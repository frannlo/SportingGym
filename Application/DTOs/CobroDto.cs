using System.ComponentModel.DataAnnotations;

namespace SportingGym.Application.DTOs
{
    public class CobroDto
    {
        [Required]
        public int SocioId { get; set; }

        [Required]
        public int TipoMembresiaId { get; set; }
        public decimal MontoEfectivo { get; set; }
        public decimal MontoTransferencia { get; set; }
        public decimal MontoTarjeta { get; set; }
        public string? Comprobante { get; set; }
    }
}