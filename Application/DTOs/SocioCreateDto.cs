using System.ComponentModel.DataAnnotations;

namespace SportingGym.Application.DTOs
{
    public class SocioCreateDto
    {
        [Required(ErrorMessage = "El DNI es obligatorio")]
        [StringLength(8, MinimumLength = 7, ErrorMessage = "El DNI debe tener entre 7 y 8 dígitos")] 
        [RegularExpression(@"^\d+$", ErrorMessage = "El DNI debe contener solo números")] 
        public string Dni { get; set; } = string.Empty;

        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(50, ErrorMessage = "El nombre no puede superar los 50 caracteres")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El apellido es obligatorio")]
        [StringLength(50, ErrorMessage = "El apellido no puede superar los 50 caracteres")]
        public string Apellido { get; set; } = string.Empty;

        [EmailAddress(ErrorMessage = "El formato del email no es válido")]
        public string? Email { get; set; }
        
        [Phone(ErrorMessage = "El formato del teléfono no es válido")]
        public string? Telefono { get; set; }

        public DateTime FechaNacimiento { get; set; }

        [Required(ErrorMessage = "Debes seleccionar una membresía para dar de alta al socio")]
        [Range(1, int.MaxValue, ErrorMessage = "Membresía inválida")]
        public int TipoMembresiaId { get; set; }

    }
}