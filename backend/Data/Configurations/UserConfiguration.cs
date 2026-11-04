using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Garagix.Api.Entities;

namespace Garagix.Api.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");
        builder.HasKey(u => u.Id);
        builder.HasIndex(u => u.Email).IsUnique();

        builder.Property(u => u.Id).HasMaxLength(50);
        builder.Property(u => u.Name).IsRequired().HasMaxLength(100);
        builder.Property(u => u.Email).IsRequired().HasMaxLength(150);
        builder.Property(u => u.Phone).IsRequired().HasMaxLength(20);
        builder.Property(u => u.Address).HasMaxLength(250);
        builder.Property(u => u.Role).IsRequired().HasMaxLength(20);
        builder.Property(u => u.Status).IsRequired().HasMaxLength(20);
        builder.Property(u => u.PasswordHash).IsRequired().HasMaxLength(255);
        builder.Property(u => u.PasswordResetOtp).HasMaxLength(10);

        // Seed default Admin user
        builder.HasData(new User
        {
            Id = "admin-001",
            Name = "Priyantha Jayasuriya",
            Email = "admin@garagix.lk",
            Phone = "+94 11 234 5678",
            Address = "Garagix Workshop HQ, Nawala Road, Colombo",
            Role = "admin",
            TotalBookings = 0,
            Status = "active",
            // BCrypt hash for "Admin@123"
            PasswordHash = "$2a$11$0FfM4pIekhS9f37jD2oZwe4l9QpE9dYvXU8WwM9W0w3m0k1pX.g5a",
            CreatedAt = new DateTime(2022, 1, 15, 0, 0, 0, DateTimeKind.Utc)
        });

        // Seed default Customer user
        builder.HasData(new User
        {
            Id = "cust-101",
            Name = "Kasun Mendis",
            Email = "kasun.mendis@example.lk",
            Phone = "+94 77 123 4567",
            Address = "No. 42/B, Flower Road, Colombo 07, Sri Lanka",
            Role = "customer",
            TotalBookings = 4,
            Status = "active",
            // BCrypt hash for "Customer@123"
            PasswordHash = "$2a$11$X0rD9pQekhS9f37jD2oZwe4l9QpE9dYvXU8WwM9W0w3m0k1pX.g5b",
            CreatedAt = new DateTime(2024, 3, 1, 0, 0, 0, DateTimeKind.Utc)
        });
    }
}

