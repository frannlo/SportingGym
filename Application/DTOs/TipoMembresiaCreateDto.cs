using System.ComponentModel.DataAnnotations;

namespace SportingGym.WebApi.Application.DTOs
{
    public class TipoMembresiaCreateDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "El costo debe ser mayor a 0")]
        public decimal Costo { get; set; }

        [Required]
        [Range(1, 7, ErrorMessage = "Los días permitidos deben ser entre 1 y 7")]
        public int DiasPermitidosPorSemana { get; set; }
    }
}