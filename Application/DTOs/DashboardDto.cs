namespace SportingGym.WebApi.Application.DTOs
{
    public class DashboardDto
    {
        public int TotalSocios { get; set; }
        public int SociosActivos { get; set; } // Los que tienen membresía vigente
        public decimal IngresosMes { get; set; } // Suma de plata de este mes
        public int MembresiasPorVencer { get; set; } // Vencen en los próximos 7 días
    }
}