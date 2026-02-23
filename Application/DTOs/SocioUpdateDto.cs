using System.ComponentModel.DataAnnotations;

namespace SportingGym.WebApi.Application.DTOs
{
    public class SocioUpdateDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El apellido es obligatorio")]
        public string Apellido { get; set; } = string.Empty;

        [Required(ErrorMessage = "El DNI es obligatorio")]
        public string Dni { get; set; } = string.Empty;

        public string? Email { get; set; }

        public string? Telefono { get; set; }

        [Required(ErrorMessage = "La fecha de nacimiento es obligatoria")]
        public DateTime FechaNacimiento { get; set; }
    }
}