namespace SportingGym.Domain.Entities
{
    public class TipoMembresia
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty; // Nombre descriptivo de la membresía
        public decimal Costo { get; set; } // Costo de la membresía
        public int DiasPermitidosPorSemana { get; set; } 
    }
}
