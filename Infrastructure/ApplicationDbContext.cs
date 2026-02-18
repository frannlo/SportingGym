using Microsoft.EntityFrameworkCore;
using SportingGym.Domain.Entities;
using SportingGym.Domain; // Asegúrate de que este namespace coincida con donde guardaste tus entidades

namespace SportingGym.Infrastructure
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Aquí definimos las tablas que se crearán
        public DbSet<Socio> Socios { get; set; }
        public DbSet<Membresia> Membresias { get; set; }
        public DbSet<TipoMembresia> TiposMembresia { get; set; }
        public DbSet<Pago> Pagos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<Socio>()
                .HasIndex(s => s.Dni)
                .IsUnique();

            modelBuilder.Entity<TipoMembresia>()
                .Property(t => t.Costo)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Pago>()
                .Property(p => p.Monto)
                .HasPrecision(18, 2);
        }
    }
}