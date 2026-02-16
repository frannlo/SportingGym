namespace SportingGym.WebApi.Application.DTOs
{
    public class TipoMembresiaResponseDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public decimal Costo { get; set; }
        public int DiasPermitidosPorSemana { get; set; }
    }
}