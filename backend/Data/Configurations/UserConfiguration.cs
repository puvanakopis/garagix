using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Garagix.Api.Common.Utilities;
using Garagix.Api.Entities;

namespace Garagix.Api.Data.Configurations;

/// <summary>
/// Entity Framework Core entity mapping configuration and seed data for the <see cref="User"/> entity.
/// Configures table schemas, unique constraints, property rules, and automatic password hashing conversions.
/// </summary>
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    /// <inheritdoc />
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
        
        // Converts plain text password automatically into a secure BCrypt password hash upon saving
        builder.Property(u => u.PasswordHash)
            .IsRequired()
            .HasMaxLength(255)
            .HasConversion(
                passwordOrHash => ConvertToPasswordHash(passwordOrHash),
                hashFromDb => hashFromDb
            );

        builder.Property(u => u.PasswordResetOtp).HasMaxLength(10);

        // Seed default Admin user ("Admin@123")
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
            PasswordHash = ConvertToPasswordHash("Admin@123"),
            CreatedAt = new DateTime(2022, 1, 15, 0, 0, 0, DateTimeKind.Utc)
        });

        // Seed default Customer user ("Customer@123")
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
            PasswordHash = ConvertToPasswordHash("Customer@123"),
            CreatedAt = new DateTime(2024, 3, 1, 0, 0, 0, DateTimeKind.Utc)
        });
    }

    /// <summary>
    /// Converts a plain text password into a secure BCrypt password hash.
    /// If the incoming string is already a formatted BCrypt hash, it is preserved without re-hashing.
    /// </summary>
    /// <param name="passwordOrHash">Plain text password or existing BCrypt hash.</param>
    /// <returns>A secure BCrypt password hash string.</returns>
    public static string ConvertToPasswordHash(string passwordOrHash)
    {
        if (string.IsNullOrWhiteSpace(passwordOrHash))
        {
            return string.Empty;
        }

        // Return unchanged if already a BCrypt hash
        if (IsBCryptHash(passwordOrHash))
        {
            return passwordOrHash;
        }

        return PasswordHelper.HashPassword(passwordOrHash);
    }

    /// <summary>
    /// Determines whether the given string conforms to standard BCrypt hash format.
    /// </summary>
    /// <param name="value">String value to test.</param>
    /// <returns><c>true</c> if the string is already a BCrypt hash; otherwise, <c>false</c>.</returns>
    private static bool IsBCryptHash(string value)
    {
        return value.Length == 60 &&
               (value.StartsWith("$2a$") || value.StartsWith("$2b$") || value.StartsWith("$2y$") || value.StartsWith("$2x$"));
    }
}
