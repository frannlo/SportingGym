using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportingGym.Infrastructure;
using SportingGym.WebApi.Application.DTOs;
// Asegúrate de importar tu DbContext (ej: Infrastructure.Persistence)
// using SportingGym.Infrastructure.Persistence; 

namespace SportingGym.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        // Inyectamos el Contexto directamente para este reporte rápido
        // (En arquitectura pura se usaría un Servicio, pero esto es válido para reportes)
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<DashboardDto>> GetStats()
        {
            var hoy = DateTime.UtcNow;
            var inicioMes = new DateTime(hoy.Year, hoy.Month, 1);
            var semanaQueViene = hoy.AddDays(7);

            // 1. Total de Socios (No eliminados)
            var totalSocios = await _context.Socios.CountAsync(s => s.Activo);

            // 2. Socios con Membresía Vigente (Asumiendo que tienes una tabla Membresias)
            // Si no tienes tabla Membresias aún poblada, esto dará 0, no pasa nada.
            var sociosActivos = await _context.Membresias
                .CountAsync(m => m.FechaFin >= hoy);

            // 3. Ingresos de este mes
            var ingresosMes = await _context.Pagos
                .Where(p => p.FechaPago >= inicioMes)
                .SumAsync(p => p.Monto);

            // 4. Por vencer (Vencen entre hoy y 7 días más)
            var porVencer = await _context.Membresias
                .CountAsync(m => m.FechaFin >= hoy && m.FechaFin <= semanaQueViene);

            return Ok(new DashboardDto
            {
                TotalSocios = totalSocios,
                SociosActivos = sociosActivos,
                IngresosMes = ingresosMes,
                MembresiasPorVencer = porVencer
            });
        }
        // GET: api/Dashboard/vencidos
        [HttpGet("vencidos")]
        public async Task<ActionResult<List<dynamic>>> GetSociosVencidos()
        {
            var hoy = DateTime.UtcNow;
            // Buscamos socios cuya ÚLTIMA membresía ya venció
            // (Lógica simplificada: Buscamos membresias vencidas de socios activos)

            var vencidos = await _context.Membresias
                .Include(m => m.Socio)
                .Include(m => m.TipoMembresia)
                .Where(m => m.FechaFin < hoy && m.Socio.Activo)
                .OrderByDescending(m => m.FechaFin)
                .Select(m => new
                {
                    Nombre = $"{m.Socio.Nombre} {m.Socio.Apellido}",
                    Plan = m.TipoMembresia.Nombre,
                    VencioEl = m.FechaFin,
                    Telefono = m.Socio.Telefono ?? "-"
                })
                .ToListAsync();

            return Ok(vencidos);
        }

        // GET: api/Dashboard/por-vencer
        [HttpGet("por-vencer")]
        public async Task<ActionResult<List<dynamic>>> GetSociosPorVencer()
        {
            var hoy = DateTime.UtcNow;
            var semanaQueViene = hoy.AddDays(7);

            var porVencer = await _context.Membresias
                .Include(m => m.Socio)
                .Include(m => m.TipoMembresia)
                .Where(m => m.FechaFin >= hoy && m.FechaFin <= semanaQueViene)
                .OrderBy(m => m.FechaFin)
                .Select(m => new
                {
                    Nombre = $"{m.Socio.Nombre} {m.Socio.Apellido}",
                    Plan = m.TipoMembresia.Nombre,
                    VenceEl = m.FechaFin,
                    DiasRestantes = (m.FechaFin - hoy).Days
                })
                .ToListAsync();

            return Ok(porVencer);
        }
    }
}