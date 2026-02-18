using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using SportingGym.Domain.Entities;
using SportingGym.Infrastructure;
using SportingGym.Application.DTOs;
namespace SportingGym.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembresiasController : ControllerBase
    {
        // 1. Declaramos la variable
        private readonly ApplicationDbContext _context;

        // 2. IMPORTANTE: Inyectamos el contexto en el Constructor
        public MembresiasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Membresias/renovar
        [HttpPost("renovar")]
        public async Task<IActionResult> RenovarMembresia(CobroDto dto)
        {
            if (dto.SocioId <= 0 || dto.TipoMembresiaId <= 0)
                return BadRequest("Datos de socio o plan inválidos.");

            var socio = await _context.Socios.FindAsync(dto.SocioId);
            var plan = await _context.TiposMembresia.FindAsync(dto.TipoMembresiaId);

            if (socio == null || plan == null) return BadRequest("Socio o Plan no encontrados.");

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // A. Crear la nueva Membresía
                var nuevaMembresia = new Membresia
                {
                    SocioId = socio.Id,
                    TipoMembresiaId = plan.Id,
                    FechaInicio = DateTime.UtcNow,
                    FechaFin = DateTime.UtcNow.AddDays(30),
                };

                _context.Membresias.Add(nuevaMembresia);
                await _context.SaveChangesAsync();

                // B. Registrar el Pago en Caja
                var nuevoPago = new Pago
                {
                    SocioId = socio.Id,
                    Monto = plan.Costo,
                    FechaPago = DateTime.UtcNow
                };

                _context.Pagos.Add(nuevoPago);
                await _context.SaveChangesAsync();

                // C. Confirmar
                await transaction.CommitAsync();

                return Ok(new { message = "Cobro registrado exitosamente." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Error interno: " + ex.Message);
            }
        }
    }
}