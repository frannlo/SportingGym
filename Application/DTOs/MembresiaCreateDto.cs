using System.ComponentModel.DataAnnotations;

namespace SportingGym.WebApi.Application.DTOs
{
    public class MembresiaCreateDto
    {
        [Required]
        public int SocioId { get; set; }

        [Required]
        public int TipoMembresiaId { get; set; }
    }
}