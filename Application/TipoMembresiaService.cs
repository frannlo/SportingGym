using Microsoft.EntityFrameworkCore;
using SportingGym.Domain.Entities;
using SportingGym.Infrastructure;
using SportingGym.WebApi.Application.DTOs;
using SportingGym.WebApi.Application.Interfaces;
using SportingGym.Domain;
using SportingGym.Infrastructure;

namespace SportingGym.WebApi.Application.Services
{
    public class TipoMembresiaService : ITipoMembresiaService
    {
        private readonly ApplicationDbContext _context;

        public TipoMembresiaService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<TipoMembresiaResponseDto>> GetAllAsync()
        {
            var tipos = await _context.TiposMembresia.ToListAsync();
            return tipos.Select(t => new TipoMembresiaResponseDto
            {
                Id = t.Id,
                Nombre = t.Nombre,
                Costo = t.Costo,
                DiasPermitidosPorSemana = t.DiasPermitidosPorSemana
            }).ToList();
        }

        public async Task<TipoMembresiaResponseDto?> GetByIdAsync(int id)
        {
            var tipo = await _context.TiposMembresia.FindAsync(id);
            if (tipo == null) return null;

            return new TipoMembresiaResponseDto
            {
                Id = tipo.Id,
                Nombre = tipo.Nombre,
                Costo = tipo.Costo,
                DiasPermitidosPorSemana = tipo.DiasPermitidosPorSemana
            };
        }

        public async Task<TipoMembresiaResponseDto> CreateAsync(TipoMembresiaCreateDto dto)
        {
            var nuevoTipo = new TipoMembresia
            {
                Nombre = dto.Nombre,
                Costo = dto.Costo,
                DiasPermitidosPorSemana = dto.DiasPermitidosPorSemana
            };

            _context.TiposMembresia.Add(nuevoTipo);
            await _context.SaveChangesAsync();

            return new TipoMembresiaResponseDto
            {
                Id = nuevoTipo.Id,
                Nombre = nuevoTipo.Nombre,
                Costo = nuevoTipo.Costo,
                DiasPermitidosPorSemana = nuevoTipo.DiasPermitidosPorSemana
            };
        }

        public async Task<bool> UpdateAsync(int id, TipoMembresiaCreateDto dto)
        {
            var tipo = await _context.TiposMembresia.FindAsync(id);
            if (tipo == null) return false;

            tipo.Nombre = dto.Nombre;
            tipo.Costo = dto.Costo;
            tipo.DiasPermitidosPorSemana = dto.DiasPermitidosPorSemana;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var tipo = await _context.TiposMembresia.FindAsync(id);
            if (tipo == null) return false;

            _context.TiposMembresia.Remove(tipo);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}