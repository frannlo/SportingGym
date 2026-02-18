using System.ComponentModel.DataAnnotations;

namespace SportingGym.Application.DTOs
{
    public class CobroDto
    {
        [Required]
        public int SocioId { get; set; }

        [Required]
        public int TipoMembresiaId { get; set; }
    }
}