// Dominio/Entities/Pago.cs
namespace SportingGym.Domain.Entities
{
    public class Pago
    {
        public int Id { get; set; }
        public int SocioId { get; set; }
        public Socio Socio { get; set; } = null!;

        public DateTime FechaPago { get; set; } = DateTime.UtcNow;

        public decimal MontoEfectivo { get; set; }
        public decimal MontoTransferencia { get; set; }
        public decimal MontoTarjeta { get; set; }

        public string? Comprobante { get; set; } 
    }
}