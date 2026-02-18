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
                .Include(s => s.Membresias)          // Traemos historial
                .ThenInclude(m => m.TipoMembresia)   // Traemos nombre del plan
                .ToListAsync();

            return socios.Select(s => {
                // Buscamos la última membresía vigente
                var ultimaMembresia = s.Membresias
                    .Where(m => m.FechaFin >= DateTime.UtcNow) // Que no haya vencido
                    .OrderByDescending(m => m.FechaFin)
                    .FirstOrDefault();

                return new SocioResponseDto
                {
                    Id = s.Id,
                    Nombre = s.Nombre,
                    Apellido = s.Apellido,
                    Dni = s.Dni,
                    Activo = s.Activo,
                    Email = s.Email,
                    Telefono = s.Telefono,
                    FechaNacimiento = s.FechaNacimiento,
                    // Lógica para mostrar el plan
                    NombrePlan = ultimaMembresia != null ? ultimaMembresia.TipoMembresia.Nombre : "Sin membresía"
                };
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
                Nombre = socio.Nombre,
                Apellido = socio.Apellido,
                Email = socio.Email,
                Activo = socio.Activo,
                Telefono = socio.Telefono ?? string.Empty, 
                FechaNacimiento = socio.FechaNacimiento
            };
        }

        public async Task<SocioResponseDto> CreateAsync(SocioCreateDto dto)
        {
            // 1. Validaciones previas
            if (await _context.Socios.AnyAsync(s => s.Dni == dto.Dni))
            {
                throw new Exception("Ya existe un socio con ese DNI.");
            }

            // Verificamos que el plan exista
            var plan = await _context.TiposMembresia.FindAsync(dto.TipoMembresiaId);
            if (plan == null) throw new Exception("El plan seleccionado no existe.");

            // 2. INICIO DE LA TRANSACCIÓN
            // Esto asegura que si algo falla, no se guarda nada a medias.
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // A. Crear el Socio
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
                await _context.SaveChangesAsync(); // Aquí se genera el ID del socio

                // B. Crear la Membresía Automática
                var nuevaMembresia = new Membresia
                {
                    SocioId = nuevoSocio.Id, // Usamos el ID recién creado
                    TipoMembresiaId = plan.Id,
                    FechaInicio = DateTime.UtcNow,
                    FechaFin = DateTime.UtcNow.AddDays(30), 
                };

                _context.Membresias.Add(nuevaMembresia);
                await _context.SaveChangesAsync();

                // C. Confirmar todo (Commit)
                await transaction.CommitAsync();

                return new SocioResponseDto
                {
                    Id = nuevoSocio.Id,
                    Dni = nuevoSocio.Dni,
                    Nombre = nuevoSocio.Nombre,
                    Apellido = nuevoSocio.Apellido,
                    Email = nuevoSocio.Email,
                    Telefono = nuevoSocio.Telefono,
                    NombrePlan = plan.Nombre, // Devolvemos el nombre del plan asignado
                    Activo = true
                };
            }
            catch (Exception)
            {
                // Si algo falló, deshacemos todo
                await transaction.RollbackAsync();
                throw; // Re-lanzamos el error para que lo vea el Controller
            }
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