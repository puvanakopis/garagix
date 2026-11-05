using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Garagix.Api.Entities;

namespace Garagix.Api.Data.Configurations;

/// <summary>
/// Entity Framework Core entity mapping configuration for the <see cref="PendingRegistration"/> entity.
/// Configures table name, indices, field limits, and constraints.
/// </summary>
public class PendingRegistrationConfiguration : IEntityTypeConfiguration<PendingRegistration>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<PendingRegistration> builder)
    {
        builder.ToTable("pending_registrations");
        builder.HasKey(p => p.Id);
        builder.HasIndex(p => p.Email);

        builder.Property(p => p.Id).HasMaxLength(50);
        builder.Property(p => p.FullName).IsRequired().HasMaxLength(100);
        builder.Property(p => p.Email).IsRequired().HasMaxLength(150);
        builder.Property(p => p.Phone).IsRequired().HasMaxLength(20);
        builder.Property(p => p.Address).HasMaxLength(250);
        builder.Property(p => p.PasswordHash).IsRequired().HasMaxLength(255);
        builder.Property(p => p.Role).IsRequired().HasMaxLength(20);
        builder.Property(p => p.Otp).IsRequired().HasMaxLength(10);
        builder.Property(p => p.OtpExpiry).IsRequired();
        builder.Property(p => p.CreatedAt).IsRequired();
    }
}

