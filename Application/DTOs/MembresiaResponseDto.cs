namespace SportingGym.WebApi.Application.DTOs
{
    public class MembresiaResponseDto
    {
        public int Id { get; set; }
        public string NombreSocio { get; set; } = string.Empty;
        public string NombreMembresia { get; set; } = string.Empty;
        public decimal Costo { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public bool EsVigente { get; set; }
        public int DiasRestantes { get; set; } // Un dato calculado muy útil para el Frontend
    }
}