namespace SportingGym.WebApi.Application.DTOs
{
    public class SocioResponseDto
    {
        public int Id { get; set; }
        public string NombreCompleto { get; set; } = string.Empty; // Un campo calculado útil
        public string Dni { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty; // "Activo" o "Inactivo"
        public string? Email { get; set; }
    }
}