using Microsoft.EntityFrameworkCore;
using SportingGym.Domain.Entities;
using SportingGym.Domain.Enums;
using SportingGym.Infrastructure;
using SportingGym.WebApi.Application.DTOs;
using SportingGym.WebApi.Application.Interfaces;
using SportingGym.Domain;
using SportingGym.Infrastructure;

namespace SportingGym.WebApi.Application.Services
{
    public class PagoService : IPagoService
    {
        private readonly ApplicationDbContext _context;

        public PagoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagoResponseDto> RegistrarPagoAsync(PagoCreateDto dto)
        {
            var socio = await _context.Socios.FindAsync(dto.SocioId);
            if (socio == null) throw new Exception("El socio no existe.");

            var nuevoPago = new Pago
            {
                SocioId = dto.SocioId,
                Monto = dto.Monto,
                Metodo = (MetodoPago)dto.MetodoPagoId, // Casteo de int a Enum
                FechaPago = DateTime.UtcNow,
                Comprobante = dto.Comprobante
            };

            _context.Pagos.Add(nuevoPago);
            await _context.SaveChangesAsync();

            return new PagoResponseDto
            {
                Id = nuevoPago.Id,
                Fecha = nuevoPago.FechaPago,
                Monto = nuevoPago.Monto,
                Metodo = nuevoPago.Metodo.ToString(), // "Efectivo", "Transferencia", etc.
                Comprobante = nuevoPago.Comprobante,
                NombreSocio = $"{socio.Nombre} {socio.Apellido}"
            };
        }

        public async Task<List<PagoResponseDto>> GetBySocioIdAsync(int socioId)
        {
            var pagos = await _context.Pagos
                .Include(p => p.Socio)
                .Where(p => p.SocioId == socioId)
                .OrderByDescending(p => p.FechaPago)
                .ToListAsync();

            return pagos.Select(p => new PagoResponseDto
            {
                Id = p.Id,
                Fecha = p.FechaPago,
                Monto = p.Monto,
                Metodo = p.Metodo.ToString(),
                Comprobante = p.Comprobante,
                NombreSocio = $"{p.Socio.Nombre} {p.Socio.Apellido}"
            }).ToList();
        }
    }
}