namespace SportingGym.Domain.Entities
{
    public class Membresia
    {
        public int Id { get; set; }
        //Claves foráneas
        public int SocioId { get; set; }
        public Socio Socio { get; set; } = null!; // Relación con Socio
        public int TipoMembresiaId { get; set; }
        public TipoMembresia TipoMembresia { get; set; } = null!; // Relación con TipoMembresia
        public DateTime FechaInicio { get; set; } 
        public DateTime FechaFin { get; set; } //Se calcula sumando 1 mes a la fecha de inicio
        public bool EsVigente => DateTime.UtcNow >= FechaInicio && DateTime.UtcNow <= FechaFin;


    }
}
