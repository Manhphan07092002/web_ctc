using System.Data.Entity;

namespace Cubetech.Website.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext() : base("DefaultConnection")
        {
            // Sử dụng connection string từ web.config
            Database.SetInitializer<ApplicationDbContext>(null); // Không tự động tạo database
        }

        public DbSet<Activity> Activities { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            // Configure Activity entity
            modelBuilder.Entity<Activity>()
                .HasKey(a => a.ActivityID);

            modelBuilder.Entity<Activity>()
                .Property(a => a.Title)
                .IsRequired()
                .HasMaxLength(300);

            modelBuilder.Entity<Activity>()
                .Property(a => a.ActivityType)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Activity>()
                .Property(a => a.ImageUrl)
                .HasMaxLength(255);

            modelBuilder.Entity<Activity>()
                .Property(a => a.Location)
                .HasMaxLength(200);

            base.OnModelCreating(modelBuilder);
        }
    }
}
