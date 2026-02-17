namespace SportingGym.WebApi.Application.DTOs
{
    public class SocioResponseDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;   
        public string Apellido { get; set; } = string.Empty;
        public string Dni { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty; // "Activo" o "Inactivo"
        public string? Email { get; set; }
        public string NombreCompleto => $"{Nombre} {Apellido}";
        public string Telefono { get; set; }
        public DateTime FechaNacimiento { get; set; }
    }
}