using SportingGym.Domain.Enums;

namespace SportingGym.Domain.Entities
{
    public class Pago
    {
        public int Id { get; set; }
        public int SocioId { get; set; }
        public Socio Socio { get; set; } = null!;

        public decimal Monto { get; set; }
        public DateTime FechaPago { get; set; } = DateTime.UtcNow;

        // Enum para controlar los métodos de pago definidos en INANSI
        public MetodoPago Metodo { get; set; }
        public string? Comprobante { get; set; } // Para transferencias
    }
}

