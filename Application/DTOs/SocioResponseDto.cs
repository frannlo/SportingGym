namespace SportingGym.WebApi.Application.DTOs
{
    public class SocioResponseDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;   
        public string Apellido { get; set; } = string.Empty;
        public string Dni { get; set; } = string.Empty;
        public bool Activo { get; set; }
        public string? Email { get; set; }
        public string NombreCompleto => $"{Nombre} {Apellido}";
        public string Telefono { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string NombrePlan { get; set; } = "Sin Plan";
        public DateTime? FechaVencimiento { get; set; }
    }
}