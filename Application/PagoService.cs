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
                MontoEfectivo = dto.MontoEfectivo,
                MontoTransferencia = dto.MontoTransferencia,
                MontoTarjeta = dto.MontoTarjeta,
                FechaPago = DateTime.UtcNow,
                Comprobante = dto.Comprobante
            };

            _context.Pagos.Add(nuevoPago);
            await _context.SaveChangesAsync();
            
            return new PagoResponseDto
            {
                Id = nuevoPago.Id,
                Fecha = nuevoPago.FechaPago,
                MontoEfectivo = nuevoPago.MontoEfectivo,
                MontoTransferencia = nuevoPago.MontoTransferencia,
                MontoTarjeta = nuevoPago.MontoTarjeta,
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
                MontoEfectivo = p.MontoEfectivo,
                MontoTransferencia = p.MontoTransferencia,
                MontoTarjeta = p.MontoTarjeta,
                Comprobante = p.Comprobante,
                NombreSocio = p.Socio != null ? $"{p.Socio.Nombre} {p.Socio.Apellido}" : "Socio Eliminado"
            }).ToList();
        }

        public async Task<List<PagoResponseDto>> GetAllAsync()
        {
            var pagos = await _context.Pagos
                .Include(p => p.Socio)
                .OrderByDescending(p => p.FechaPago)
                .ToListAsync();

            return pagos.Select(p => new PagoResponseDto
            {
                Id = p.Id,
                Fecha = p.FechaPago,
                // Reemplazamos Monto y Metodo por los nuevos campos:
                MontoEfectivo = p.MontoEfectivo,
                MontoTransferencia = p.MontoTransferencia,
                MontoTarjeta = p.MontoTarjeta,
                NombreSocio = p.Socio != null ? $"{p.Socio.Nombre} {p.Socio.Apellido}" : "Socio Eliminado",
                Comprobante = p.Comprobante
            }).ToList();
        }
    }
}