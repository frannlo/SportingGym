using System.ComponentModel.DataAnnotations;

namespace SportingGym.Application.DTOs
{
    public class SocioCreateDto
    {
        [Required(ErrorMessage = "El DNI es obligatorio")]
        public string Dni { get; set; } = string.Empty;

        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El apellido es obligatorio")]
        public string Apellido { get; set; } = string.Empty;

        [EmailAddress]
        public string? Email { get; set; }

        public string? Telefono { get; set; }

        public DateTime FechaNacimiento { get; set; }
    }
}