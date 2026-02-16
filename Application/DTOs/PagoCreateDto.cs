using System.ComponentModel.DataAnnotations;

namespace SportingGym.WebApi.Application.DTOs
{
    public class PagoCreateDto
    {
        [Required]
        public int SocioId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor a 0")]
        public decimal Monto { get; set; }

        [Required]
        [Range(1, 3, ErrorMessage = "Método de pago inválido (1=Efectivo, 2=Transferencia, 3=Tarjeta)")]
        public int MetodoPagoId { get; set; } // 1, 2 o 3

        public string? Comprobante { get; set; } // Opcional, para transferencias
    }
}