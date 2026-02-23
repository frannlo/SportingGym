// WebApi/Controllers/MembresiasController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportingGym.Application.DTOs;
using SportingGym.Domain.Entities;
using SportingGym.Infrastructure;

namespace SportingGym.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembresiasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MembresiasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("renovar")]
        public async Task<IActionResult> RenovarMembresia(CobroDto dto)
        {
            if (dto.SocioId <= 0 || dto.TipoMembresiaId <= 0)
                return BadRequest("Datos de socio o plan inválidos.");

            // Validamos que al menos esté pagando algo
            if (dto.MontoEfectivo + dto.MontoTransferencia + dto.MontoTarjeta <= 0)
                return BadRequest("El monto a cobrar debe ser mayor a 0.");

            var socio = await _context.Socios.FindAsync(dto.SocioId);
            var plan = await _context.TiposMembresia.FindAsync(dto.TipoMembresiaId);

            if (socio == null || plan == null) return BadRequest("Socio o Plan no encontrados.");

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // --- A. LÓGICA DE EXTENSIÓN DE MEMBRESÍA ---

                // 1. Buscamos si tiene una membresía VIGENTE (que vence en el futuro)
                var membresiaActiva = await _context.Membresias
                    .Where(m => m.SocioId == socio.Id && m.FechaFin >= DateTime.UtcNow)
                    .OrderByDescending(m => m.FechaFin)
                    .FirstOrDefaultAsync();

                if (membresiaActiva != null)
                {
                    // Si está activa, extendemos el tiempo desde su vencimiento actual
                    // y le actualizamos el plan por si decidió cambiarlo (Ej: pasó a Pase Libre)
                    membresiaActiva.FechaFin = membresiaActiva.FechaFin.AddDays(30);
                    membresiaActiva.TipoMembresiaId = plan.Id;

                    _context.Membresias.Update(membresiaActiva);
                }
                else
                {
                    // Si no tiene membresía o ya está vencida, creamos una nueva desde HOY
                    var nuevaMembresia = new Membresia
                    {
                        SocioId = socio.Id,
                        TipoMembresiaId = plan.Id,
                        FechaInicio = DateTime.UtcNow,
                        FechaFin = DateTime.UtcNow.AddDays(30),
                    };
                    _context.Membresias.Add(nuevaMembresia);
                }

                await _context.SaveChangesAsync();

                // --- B. REGISTRO DE CAJA (PAGOS MIXTOS) ---
                var nuevoPago = new Pago
                {
                    SocioId = socio.Id,
                    MontoEfectivo = dto.MontoEfectivo,
                    MontoTransferencia = dto.MontoTransferencia,
                    MontoTarjeta = dto.MontoTarjeta,
                    Comprobante = dto.Comprobante,
                    FechaPago = DateTime.UtcNow
                };

                _context.Pagos.Add(nuevoPago);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new { message = "Cobro y renovación registrados exitosamente." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Error interno: " + ex.Message);
            }
        }
    }
}