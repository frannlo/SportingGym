namespace SportingGym.WebApi.Application.DTOs
{
    public class PagoResponseDto
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Monto { get; set; }
        public string Metodo { get; set; } = string.Empty; // Devolveremos el texto ("Efectivo"), no el número
        public string? Comprobante { get; set; }
        public string NombreSocio { get; set; } = string.Empty;
    }
}