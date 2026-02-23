namespace SportingGym.Domain.Entities
{
    public class Socio
    {
        public int Id { get; set; }
        public string Dni { get; set; } = string.Empty; // Identificador clave según INANSI
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string? Email { get; set; } // Opcional, para notificaciones futuras
        public string? Telefono { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public DateTime FechaAlta { get; set; } = DateTime.UtcNow;
        public bool Activo { get; set; } = true; // Para baja lógica (Soft Delete)

        // Relaciones
        public virtual ICollection<Membresia>? Membresias { get; set; } = new List<Membresia>(); 
        public ICollection<Pago> Pagos { get; set; } = new List<Pago>();
    }
}
