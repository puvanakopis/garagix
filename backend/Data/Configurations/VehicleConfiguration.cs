using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Garagix.Api.Entities;

namespace Garagix.Api.Data.Configurations;

/// <summary>
/// Entity Framework Core entity mapping configuration and seed definitions for <see cref="Vehicle"/>.
/// </summary>
public class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder.ToTable("vehicles");
        builder.HasKey(v => v.Id);
        builder.Property(v => v.Id).HasMaxLength(50);

        builder.Property(v => v.CustomerId).IsRequired().HasMaxLength(50);
        builder.HasIndex(v => v.CustomerId);

        builder.Property(v => v.PlateNumber).IsRequired().HasMaxLength(30);
        builder.HasIndex(v => v.PlateNumber);

        builder.Property(v => v.Brand).IsRequired().HasMaxLength(60);
        builder.Property(v => v.Model).IsRequired().HasMaxLength(80);
        builder.Property(v => v.Year).IsRequired();
        builder.Property(v => v.Type).IsRequired().HasMaxLength(40).HasDefaultValue("Sedan");
        builder.Property(v => v.MileageKm);
        builder.Property(v => v.Vin).HasMaxLength(50);
        builder.Property(v => v.Color).HasMaxLength(50);

        builder.Property(v => v.CreatedAt).IsRequired();
        builder.Property(v => v.UpdatedAt);

        builder.HasData(GetInitialVehicles());
    }

    /// <summary>
    /// Returns the initial seed dataset of customer vehicles.
    /// </summary>
    public static List<Vehicle> GetInitialVehicles()
    {
        var seededDate = new DateTime(2024, 3, 1, 0, 0, 0, DateTimeKind.Utc);

        return
        [
            new Vehicle
            {
                Id = "veh-1",
                CustomerId = "cust-101",
                PlateNumber = "WP CAD-4821",
                Brand = "Toyota",
                Model = "Prius Hybrid (ZVW50)",
                Year = 2018,
                Type = "Hybrid",
                MileageKm = 64200,
                Vin = "JTDKN36U901847123",
                Color = "Pearl White",
                CreatedAt = seededDate
            },
            new Vehicle
            {
                Id = "veh-2",
                CustomerId = "cust-101",
                PlateNumber = "WP CAJ-9102",
                Brand = "Honda",
                Model = "Vezel RS Turbo",
                Year = 2019,
                Type = "SUV",
                MileageKm = 48900,
                Vin = "RU1-1309841",
                Color = "Cosmic Blue",
                CreatedAt = seededDate
            },
            new Vehicle
            {
                Id = "veh-3",
                CustomerId = "cust-102",
                PlateNumber = "WP CAA-5521",
                Brand = "Mercedes-Benz",
                Model = "C200 AMG Line",
                Year = 2020,
                Type = "Sedan",
                MileageKm = 32500,
                Vin = "WDD2050402R198421",
                Color = "Obsidian Black",
                CreatedAt = seededDate
            },
            new Vehicle
            {
                Id = "veh-4",
                CustomerId = "cust-103",
                PlateNumber = "WP CBA-7814",
                Brand = "BMW",
                Model = "320i M-Sport",
                Year = 2021,
                Type = "Sedan",
                MileageKm = 24100,
                Vin = "WBA5R1103MFA98124",
                Color = "Mineral Grey",
                CreatedAt = seededDate
            },
            new Vehicle
            {
                Id = "veh-5",
                CustomerId = "cust-105",
                PlateNumber = "WP CAB-1234",
                Brand = "Toyota",
                Model = "Land Cruiser Prado",
                Year = 2019,
                Type = "SUV",
                MileageKm = 78000,
                Vin = "JTEBU25J804918234",
                Color = "Silver Metallic",
                CreatedAt = seededDate
            }
        ];
    }
}

