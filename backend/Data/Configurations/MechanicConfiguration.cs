using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Garagix.Api.Entities;

namespace Garagix.Api.Data.Configurations;

/// <summary>
/// Entity Framework Core mapping configuration and seed definitions for <see cref="Mechanic"/>.
/// </summary>
public class MechanicConfiguration : IEntityTypeConfiguration<Mechanic>
{
    private static readonly JsonSerializerOptions JsonOptions = new();

    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<Mechanic> builder)
    {
        builder.ToTable("mechanics");
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).HasMaxLength(50);

        builder.Property(m => m.Name).IsRequired().HasMaxLength(120);
        builder.Property(m => m.Title).IsRequired().HasMaxLength(150);
        builder.Property(m => m.Specialization).IsRequired().HasMaxLength(200);
        builder.Property(m => m.ExperienceYears).HasDefaultValue(1);

        builder.Property(m => m.Rating).HasColumnType("decimal(3,1)").HasDefaultValue(5.0m);
        builder.Property(m => m.ReviewCount).HasDefaultValue(0);

        builder.Property(m => m.Bio).HasMaxLength(1000);
        builder.Property(m => m.ImageUrl).HasMaxLength(500);

        builder.Property(m => m.Status).IsRequired().HasMaxLength(20).HasDefaultValue("available");
        builder.HasIndex(m => m.Status);

        builder.Property(m => m.Phone).HasMaxLength(30);
        builder.Property(m => m.Email).HasMaxLength(150);

        builder.Property(m => m.AssignedBookingsCount).HasDefaultValue(0);

        builder.Property(m => m.Certifications)
            .HasConversion(
                v => JsonSerializer.Serialize(v, JsonOptions),
                v => string.IsNullOrWhiteSpace(v) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(v, JsonOptions) ?? new List<string>()
            )
            .HasColumnType("longtext");

        builder.Property(m => m.WorkingHours).HasMaxLength(100).HasDefaultValue("8:00 AM - 5:30 PM (Mon - Sat)");
        builder.Property(m => m.SocialsJson).HasMaxLength(1000);

        builder.Property(m => m.CreatedAt).IsRequired();
        builder.Property(m => m.UpdatedAt);

        builder.HasData(GetInitialMechanics());
    }

    /// <summary>
    /// Returns the initial seed dataset of 6 Master Technicians.
    /// </summary>
    public static List<Mechanic> GetInitialMechanics()
    {
        var seededDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        return
        [
            new Mechanic
            {
                Id = "mech-1",
                Name = "Rohan Jayawardena",
                Title = "Tire & Suspension Master",
                Specialization = "High-Performance Wheel & Chassis Dynamics",
                ExperienceYears = 12,
                Rating = 4.9m,
                ReviewCount = 178,
                Bio = "Specialist in 3D laser alignment, computerized dynamic balancing, and racing tire compound fitments. Over 12 years of workshop excellence.",
                ImageUrl = "/images/team/mechanic-1.png",
                Status = "available",
                AssignedBookingsCount = 3,
                Certifications = ["Hunter 3D Alignment Master", "Michelin Certified Specialist"],
                WorkingHours = "8:00 AM - 5:30 PM (Mon - Sat)",
                CreatedAt = seededDate
            },
            new Mechanic
            {
                Id = "mech-2",
                Name = "Kasun Perera",
                Title = "Chief Diagnostics Engineer",
                Specialization = "ECU Programming & Oscilloscope Scans",
                ExperienceYears = 14,
                Rating = 5.0m,
                ReviewCount = 230,
                Bio = "Leading electrical diagnostics authority in Sri Lanka. Expert in CAN-bus communication, Bosch computerized scanning, and hybrid inverter diagnostics.",
                ImageUrl = "/images/team/mechanic-2.png",
                Status = "available",
                AssignedBookingsCount = 4,
                Certifications = ["Bosch Master Diagnostic Tech", "Toyota T-TEN Master", "ASE L1 Certified"],
                WorkingHours = "8:00 AM - 6:00 PM (Mon - Sat)",
                CreatedAt = seededDate
            },
            new Mechanic
            {
                Id = "mech-3",
                Name = "Marcus Cole",
                Title = "Brake & Transmission Tech",
                Specialization = "Dual-Clutch Transmissions & Ceramic Brakes",
                ExperienceYears = 11,
                Rating = 4.8m,
                ReviewCount = 142,
                Bio = "Master technician specialized in DSG, ZF 8-speed, and CVT gearboxes alongside high-performance Brembo brake system overhauls.",
                ImageUrl = "/images/team/mechanic-3.png",
                Status = "busy",
                AssignedBookingsCount = 5,
                Certifications = ["ZF ProTech Certified", "Brembo Brake Specialist"],
                WorkingHours = "8:30 AM - 6:00 PM (Mon - Sat)",
                CreatedAt = seededDate
            },
            new Mechanic
            {
                Id = "mech-4",
                Name = "Devon Brooks",
                Title = "Powertrain & Turbo Specialist",
                Specialization = "Forced Induction & Fuel Injection Systems",
                ExperienceYears = 9,
                Rating = 4.9m,
                ReviewCount = 115,
                Bio = "Passionate performance mechanic focusing on turbocharger maintenance, high-pressure common rail diesel, and direct injection carbon cleaning.",
                ImageUrl = "/images/team/mechanic-4.png",
                Status = "available",
                AssignedBookingsCount = 2,
                Certifications = ["Garrett Turbo Authorized Tech", "Denso Fuel Injection Master"],
                WorkingHours = "8:00 AM - 5:00 PM (Mon - Sat)",
                CreatedAt = seededDate
            },
            new Mechanic
            {
                Id = "mech-5",
                Name = "Nuwan Fernando",
                Title = "Body & Chassis Specialist",
                Specialization = "Chassis Alignment & High-End Body Craft",
                ExperienceYears = 15,
                Rating = 4.9m,
                ReviewCount = 198,
                Bio = "Master of structural collision repair, computer laser chassis pullers, and mirror-finish paint restoration. Certified across luxury Euro brands.",
                ImageUrl = "/images/team/mechanic-5.png",
                Status = "available",
                AssignedBookingsCount = 3,
                Certifications = ["I-CAR Platinum Body Specialist", "PPG Master Painter"],
                WorkingHours = "9:00 AM - 6:30 PM (Mon - Sat)",
                CreatedAt = seededDate
            },
            new Mechanic
            {
                Id = "mech-6",
                Name = "Robert Kowalski",
                Title = "Engine Overhaul Master",
                Specialization = "Complete Engine Rebuilds & Block Machining",
                ExperienceYears = 16,
                Rating = 5.0m,
                ReviewCount = 260,
                Bio = "Over 16 years rebuilding V6, V8, and hybrid internal combustion engines. Micro-tolerance crankshaft balancing and valve train machining.",
                ImageUrl = "/images/team/mechanic-6.png",
                Status = "available",
                AssignedBookingsCount = 3,
                Certifications = ["ASE Master Engine Machinist", "BMW Master Certified"],
                WorkingHours = "8:00 AM - 6:00 PM (Mon - Sat)",
                CreatedAt = seededDate
            }
        ];
    }
}

