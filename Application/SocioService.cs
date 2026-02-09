using Microsoft.EntityFrameworkCore;
using SportingGym.Application.DTOs;
using SportingGym.Domain.Entities;
using SportingGym.Infrastructure;
using SportingGym.WebApi.Application.DTOs;
using SportingGym.WebApi.Application.Interfaces;
using SportingGym.Domain;

namespace SportingGym.WebApi.Application.Services
{
    public class SocioService : ISocioService
    {
        private readonly ApplicationDbContext _context;

        public SocioService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<SocioResponseDto>> GetAllAsync()
        {
            var socios = await _context.Socios
                .Where(s => s.Activo) // Solo traemos los activos (Soft Delete)
                .ToListAsync();

            // Mapeo manual (en proyectos grandes usaríamos AutoMapper, pero así se aprende mejor)
            return socios.Select(s => new SocioResponseDto
            {
                Id = s.Id,
                Dni = s.Dni,
                NombreCompleto = $"{s.Nombre} {s.Apellido}",
                Email = s.Email,
                Estado = s.Activo ? "Activo" : "Inactivo"
            }).ToList();
        }

        public async Task<SocioResponseDto?> GetByIdAsync(int id)
        {
            var socio = await _context.Socios.FindAsync(id);

            if (socio == null || !socio.Activo) return null;

            return new SocioResponseDto
            {
                Id = socio.Id,
                Dni = socio.Dni,
                NombreCompleto = $"{socio.Nombre} {socio.Apellido}",
                Email = socio.Email,
                Estado = socio.Activo ? "Activo" : "Inactivo"
            };
        }

        public async Task<SocioResponseDto> CreateAsync(SocioCreateDto dto)
        {
            // Validar si el DNI ya existe (Regla de negocio crítica)
            if (await _context.Socios.AnyAsync(s => s.Dni == dto.Dni))
            {
                throw new Exception("Ya existe un socio con ese DNI.");
            }

            var nuevoSocio = new Socio
            {
                Dni = dto.Dni,
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Email = dto.Email,
                Telefono = dto.Telefono,
                FechaNacimiento = dto.FechaNacimiento,
                FechaAlta = DateTime.UtcNow,
                Activo = true
            };

            _context.Socios.Add(nuevoSocio);
            await _context.SaveChangesAsync();

            return new SocioResponseDto
            {
                Id = nuevoSocio.Id,
                Dni = nuevoSocio.Dni,
                NombreCompleto = $"{nuevoSocio.Nombre} {nuevoSocio.Apellido}",
                Email = nuevoSocio.Email,
                Estado = "Activo"
            };
        }

        public async Task<bool> UpdateAsync(int id, SocioCreateDto dto)
        {
            var socio = await _context.Socios.FindAsync(id);
            if (socio == null) return false;

            socio.Nombre = dto.Nombre;
            socio.Apellido = dto.Apellido;
            socio.Dni = dto.Dni; // Ojo, aquí también deberíamos validar duplicados si cambia el DNI
            socio.Email = dto.Email;
            socio.Telefono = dto.Telefono;
            socio.FechaNacimiento = dto.FechaNacimiento;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var socio = await _context.Socios.FindAsync(id);
            if (socio == null) return false;

            // Baja Lógica (Soft Delete) según sugerencia de INANSI
            socio.Activo = false;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}