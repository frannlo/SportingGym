using System.ComponentModel.DataAnnotations;

namespace SportingGym.WebApi.Application.DTOs // Asegúrate de que el namespace coincida con el tuyo
{
    public class PagoCreateDto
    {
        [Required]
        public int SocioId { get; set; }
        public decimal MontoEfectivo { get; set; }
        public decimal MontoTransferencia { get; set; }
        public decimal MontoTarjeta { get; set; }

        public string? Comprobante { get; set; }
    }
}