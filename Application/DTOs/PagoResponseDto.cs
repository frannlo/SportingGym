namespace SportingGym.WebApi.Application.DTOs
{
    public class PagoResponseDto
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Total => MontoEfectivo + MontoTransferencia + MontoTarjeta;
        public decimal MontoEfectivo { get; set; }
        public decimal MontoTransferencia { get; set; }
        public decimal MontoTarjeta { get; set; }
        public string? Comprobante { get; set; }
        public string NombreSocio { get; set; } = string.Empty;
    }
}