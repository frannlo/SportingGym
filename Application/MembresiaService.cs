using Microsoft.EntityFrameworkCore;
using SportingGym.Domain.Entities;
using SportingGym.Infrastructure;
using SportingGym.WebApi.Application.DTOs;
using SportingGym.WebApi.Application.Interfaces;
using SportingGym.Domain;
using SportingGym.Infrastructure;

namespace SportingGym.WebApi.Application.Services
{
    public class MembresiaService : IMembresiaService
    {
        private readonly ApplicationDbContext _context;

        public MembresiaService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<MembresiaResponseDto> CreateAsync(MembresiaCreateDto dto)
        {
            // 1. Validar que existan el socio y el tipo
            var socio = await _context.Socios.FindAsync(dto.SocioId);
            if (socio == null) throw new Exception("Socio no encontrado");

            var tipo = await _context.TiposMembresia.FindAsync(dto.TipoMembresiaId);
            if (tipo == null) throw new Exception("Tipo de Membresía no encontrado");

            // 2. Crear la entidad y calcular fechas
            var nuevaMembresia = new Membresia
            {
                SocioId = dto.SocioId,
                TipoMembresiaId = dto.TipoMembresiaId,
                FechaInicio = DateTime.UtcNow,
                FechaFin = DateTime.UtcNow.AddDays(30) // Regla de negocio: Duración de 1 mes
            };

            _context.Membresias.Add(nuevaMembresia);
            await _context.SaveChangesAsync();

            // 3. Retornar DTO con datos cruzados
            return new MembresiaResponseDto
            {
                Id = nuevaMembresia.Id,
                NombreSocio = $"{socio.Nombre} {socio.Apellido}",
                NombreMembresia = tipo.Nombre,
                Costo = tipo.Costo,
                FechaInicio = nuevaMembresia.FechaInicio,
                FechaFin = nuevaMembresia.FechaFin,
                EsVigente = true,
                DiasRestantes = 30
            };
        }

        public async Task<MembresiaResponseDto?> GetByIdAsync(int id)
        {
            // Usamos .Include para traer los datos de las tablas relacionadas (JOIN)
            var m = await _context.Membresias
                .Include(x => x.Socio)
                .Include(x => x.TipoMembresia)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (m == null) return null;

            return MapToDto(m);
        }

        public async Task<List<MembresiaResponseDto>> GetBySocioIdAsync(int socioId)
        {
            var lista = await _context.Membresias
                .Include(x => x.Socio)
                .Include(x => x.TipoMembresia)
                .Where(x => x.SocioId == socioId)
                .OrderByDescending(x => x.FechaInicio) // Las más nuevas primero
                .ToListAsync();

            return lista.Select(MapToDto).ToList();
        }

        // Método auxiliar para no repetir código de mapeo
        private static MembresiaResponseDto MapToDto(Membresia m)
        {
            var diasRestantes = (m.FechaFin - DateTime.UtcNow).Days;

            return new MembresiaResponseDto
            {
                Id = m.Id,
                NombreSocio = $"{m.Socio.Nombre} {m.Socio.Apellido}",
                NombreMembresia = m.TipoMembresia.Nombre,
                Costo = m.TipoMembresia.Costo,
                FechaInicio = m.FechaInicio,
                FechaFin = m.FechaFin,
                EsVigente = m.EsVigente,
                DiasRestantes = diasRestantes > 0 ? diasRestantes : 0
            };
        }
    }
}