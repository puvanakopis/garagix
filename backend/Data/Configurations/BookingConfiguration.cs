using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Garagix.Api.Entities;

namespace Garagix.Api.Data.Configurations;

/// <summary>
/// Entity Framework Core mapping configuration and initial seeding for <see cref="Booking"/>.
/// </summary>
public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    private static readonly JsonSerializerOptions JsonOptions = new();

    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.ToTable("bookings");
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Id).HasMaxLength(50);

        builder.Property(b => b.ReferenceNumber).IsRequired().HasMaxLength(50);
        builder.HasIndex(b => b.ReferenceNumber).IsUnique();

        builder.Property(b => b.CustomerId).IsRequired().HasMaxLength(50);
        builder.HasIndex(b => b.CustomerId);

        builder.Property(b => b.CustomerName).IsRequired().HasMaxLength(120);
        builder.Property(b => b.CustomerPhone).IsRequired().HasMaxLength(30);
        builder.Property(b => b.CustomerEmail).IsRequired().HasMaxLength(150);

        builder.Property(b => b.VehiclePlateNumber).IsRequired().HasMaxLength(30);
        builder.HasIndex(b => b.VehiclePlateNumber);

        builder.Property(b => b.VehicleBrand).IsRequired().HasMaxLength(60);
        builder.Property(b => b.VehicleModel).IsRequired().HasMaxLength(80);
        builder.Property(b => b.VehicleYear).IsRequired();

        builder.Property(b => b.ServiceIds).IsRequired().HasColumnType("longtext");
        builder.Property(b => b.ServiceNames).IsRequired().HasColumnType("longtext");

        builder.Property(b => b.ProblemDescription).HasColumnType("longtext");
        builder.Property(b => b.Symptoms).HasColumnType("longtext");
        builder.Property(b => b.DamageImages).HasColumnType("longtext");

        builder.Property(b => b.AssignedMechanicId).HasMaxLength(50);
        builder.Property(b => b.AssignedMechanicName).HasMaxLength(120);

        builder.Property(b => b.AppointmentDate).IsRequired().HasMaxLength(30);
        builder.HasIndex(b => b.AppointmentDate);

        builder.Property(b => b.AppointmentTime).IsRequired().HasMaxLength(30);

        builder.Property(b => b.EstimatedPriceLkr).HasColumnType("decimal(12,2)").HasDefaultValue(0);
        builder.Property(b => b.FinalPriceLkr).HasColumnType("decimal(12,2)");

        builder.Property(b => b.Status).IsRequired().HasMaxLength(30).HasDefaultValue("PENDING");
        builder.HasIndex(b => b.Status);

        builder.Property(b => b.ProgressPercent).HasDefaultValue(10);
        builder.Property(b => b.EstimatedCompletion).IsRequired().HasMaxLength(100);
        builder.Property(b => b.DropOffOption).IsRequired().HasMaxLength(30).HasDefaultValue("drop_off");
        builder.Property(b => b.PaymentStatus).IsRequired().HasMaxLength(30).HasDefaultValue("pending");
        builder.Property(b => b.InternalNotes).HasColumnType("longtext");

        builder.Property(b => b.CreatedAt).IsRequired();
        builder.Property(b => b.UpdatedAt);

        builder.HasData(GetInitialBookings());
    }

    /// <summary>
    /// Returns sample workshop bookings to pre-seed the repair database.
    /// </summary>
    public static List<Booking> GetInitialBookings()
    {
        return
        [
            new Booking
            {
                Id = "book-1",
                ReferenceNumber = "GRX-2026-8941",
                CustomerId = "cust-101",
                CustomerName = "Kasun Mendis",
                CustomerPhone = "+94 77 123 4567",
                CustomerEmail = "kasun.mendis@example.lk",
                VehiclePlateNumber = "WP CAD-4821",
                VehicleBrand = "Toyota",
                VehicleModel = "Prius Hybrid",
                VehicleYear = 2018,
                VehicleMileageKm = 64200,
                ServiceIds = JsonSerializer.Serialize(new[] { "srv-7", "srv-1" }),
                ServiceNames = JsonSerializer.Serialize(new[] { "Battery & Hybrid System Check", "General Car Maintenance" }),
                ProblemDescription = "Hybrid check warning came on during highway driving; slight hesitation when starting from traffic lights.",
                Symptoms = JsonSerializer.Serialize(new[] { "Check Hybrid Light", "Engine revs loudly", "Hesitation" }),
                DamageImages = JsonSerializer.Serialize(Array.Empty<string>()),
                AssignedMechanicId = "mech-5",
                AssignedMechanicName = "Nalaka Fernando",
                AppointmentDate = "2026-11-03",
                AppointmentTime = "09:30 AM",
                EstimatedPriceLkr = 38000,
                FinalPriceLkr = null,
                Status = "IN_PROGRESS",
                ProgressPercent = 50,
                EstimatedCompletion = "Today, 4:30 PM",
                DropOffOption = "drop_off",
                InternalNotes = "Cell block 7 showed 0.4V lower differential. Performing balancing cycle and intake blower fan cleaning.",
                PaymentStatus = "pending",
                CreatedAt = new DateTime(2026, 11, 2, 8, 30, 0, DateTimeKind.Utc)
            },
            new Booking
            {
                Id = "book-2",
                ReferenceNumber = "GRX-2026-8942",
                CustomerId = "cust-101",
                CustomerName = "Kasun Mendis",
                CustomerPhone = "+94 77 123 4567",
                CustomerEmail = "kasun.mendis@example.lk",
                VehiclePlateNumber = "WP CAJ-9102",
                VehicleBrand = "Honda",
                VehicleModel = "Vezel RS",
                VehicleYear = 2019,
                VehicleMileageKm = 48900,
                ServiceIds = JsonSerializer.Serialize(new[] { "srv-3", "srv-8" }),
                ServiceNames = JsonSerializer.Serialize(new[] { "Brake Repair & System Tuning", "3D Wheel Alignment & Suspension" }),
                ProblemDescription = "Brake pedal squeal on cold mornings and car drifts slightly to the left on Southern Expressway.",
                Symptoms = JsonSerializer.Serialize(new[] { "Squealing brakes", "Steering wheel pulls left" }),
                DamageImages = JsonSerializer.Serialize(Array.Empty<string>()),
                AssignedMechanicId = "mech-3",
                AssignedMechanicName = "Saman Perera",
                AppointmentDate = "2026-11-04",
                AppointmentTime = "11:00 AM",
                EstimatedPriceLkr = 24000,
                FinalPriceLkr = null,
                Status = "CONFIRMED",
                ProgressPercent = 25,
                EstimatedCompletion = "Nov 04, 2:00 PM",
                DropOffOption = "wait_at_lounge",
                InternalNotes = null,
                PaymentStatus = "pending",
                CreatedAt = new DateTime(2026, 11, 1, 10, 15, 0, DateTimeKind.Utc)
            },
            new Booking
            {
                Id = "book-3",
                ReferenceNumber = "GRX-2026-8943",
                CustomerId = "cust-102",
                CustomerName = "Malini De Silva",
                CustomerPhone = "+94 71 456 7890",
                CustomerEmail = "malini.desilva@gmail.com",
                VehiclePlateNumber = "WP CBF-1144",
                VehicleBrand = "Mercedes-Benz",
                VehicleModel = "C200 AMG Line",
                VehicleYear = 2021,
                VehicleMileageKm = 32000,
                ServiceIds = JsonSerializer.Serialize(new[] { "srv-2", "srv-5" }),
                ServiceNames = JsonSerializer.Serialize(new[] { "Engine Repair & Overhaul", "Auto AC Repair & Climate Control" }),
                ProblemDescription = "Slight coolant temperature fluctuation and AC airflow feels lukewarm after 20 minutes of driving.",
                Symptoms = JsonSerializer.Serialize(Array.Empty<string>()),
                DamageImages = JsonSerializer.Serialize(Array.Empty<string>()),
                AssignedMechanicId = "mech-2",
                AssignedMechanicName = "Rohan Jayawardena",
                AppointmentDate = "2026-11-02",
                AppointmentTime = "08:30 AM",
                EstimatedPriceLkr = 64500,
                FinalPriceLkr = null,
                Status = "QUALITY_CHECK",
                ProgressPercent = 80,
                EstimatedCompletion = "Today, 5:30 PM",
                DropOffOption = "drop_off",
                InternalNotes = "Thermostat housing replaced. Coolant bled. AC condenser washed and gas topped up.",
                PaymentStatus = "partially_paid",
                CreatedAt = new DateTime(2026, 11, 1, 14, 0, 0, DateTimeKind.Utc)
            },
            new Booking
            {
                Id = "book-4",
                ReferenceNumber = "GRX-2026-8944",
                CustomerId = "cust-103",
                CustomerName = "Dhanushka Wickrama",
                CustomerPhone = "+94 76 778 8990",
                CustomerEmail = "dhanushka.w@yahoo.com",
                VehiclePlateNumber = "WP CBB-5520",
                VehicleBrand = "Toyota",
                VehicleModel = "Land Cruiser Prado",
                VehicleYear = 2017,
                VehicleMileageKm = 98000,
                ServiceIds = JsonSerializer.Serialize(new[] { "srv-4", "srv-6" }),
                ServiceNames = JsonSerializer.Serialize(new[] { "Premium Oil Change & Lube", "Tire Replacement & Wheel Balancing" }),
                ProblemDescription = "Scheduled 100,000 km oil service and install 4 new all-terrain tires before outstation safari trip.",
                Symptoms = JsonSerializer.Serialize(Array.Empty<string>()),
                DamageImages = JsonSerializer.Serialize(Array.Empty<string>()),
                AssignedMechanicId = "mech-4",
                AssignedMechanicName = "Kamal Wickramasinghe",
                AppointmentDate = "2026-11-02",
                AppointmentTime = "10:00 AM",
                EstimatedPriceLkr = 145000,
                FinalPriceLkr = 145000,
                Status = "READY_FOR_PICKUP",
                ProgressPercent = 95,
                EstimatedCompletion = "Ready for Collection",
                DropOffOption = "drop_off",
                InternalNotes = "Mobil 1 Delvac 5W-40 poured. 4 Michelin LTX tires fitted and balanced. Client notified.",
                PaymentStatus = "paid",
                CreatedAt = new DateTime(2026, 10, 31, 9, 0, 0, DateTimeKind.Utc)
            },
            new Booking
            {
                Id = "book-5",
                ReferenceNumber = "GRX-2026-8945",
                CustomerId = "cust-101",
                CustomerName = "Kasun Mendis",
                CustomerPhone = "+94 77 123 4567",
                CustomerEmail = "kasun.mendis@example.lk",
                VehiclePlateNumber = "WP CAD-4821",
                VehicleBrand = "Toyota",
                VehicleModel = "Prius Hybrid",
                VehicleYear = 2018,
                VehicleMileageKm = 58000,
                ServiceIds = JsonSerializer.Serialize(new[] { "srv-4", "srv-8" }),
                ServiceNames = JsonSerializer.Serialize(new[] { "Premium Oil Change & Lube", "3D Wheel Alignment & Suspension" }),
                ProblemDescription = "Routine 55,000 km oil change and tire rotation.",
                Symptoms = JsonSerializer.Serialize(Array.Empty<string>()),
                DamageImages = JsonSerializer.Serialize(Array.Empty<string>()),
                AssignedMechanicId = "mech-2",
                AssignedMechanicName = "Rohan Jayawardena",
                AppointmentDate = "2026-08-15",
                AppointmentTime = "02:00 PM",
                EstimatedPriceLkr = 22000,
                FinalPriceLkr = 22000,
                Status = "DELIVERED",
                ProgressPercent = 100,
                EstimatedCompletion = "Completed on Aug 15, 2026",
                DropOffOption = "wait_at_lounge",
                InternalNotes = null,
                PaymentStatus = "paid",
                CreatedAt = new DateTime(2026, 8, 14, 11, 0, 0, DateTimeKind.Utc)
            },
            new Booking
            {
                Id = "book-6",
                ReferenceNumber = "GRX-2026-8946",
                CustomerId = "cust-104",
                CustomerName = "Ajantha Fernando",
                CustomerPhone = "+94 77 334 4556",
                CustomerEmail = "ajantha.f@gmail.com",
                VehiclePlateNumber = "WP CAR-7711",
                VehicleBrand = "Nissan",
                VehicleModel = "Leaf ZE1",
                VehicleYear = 2020,
                VehicleMileageKm = 42000,
                ServiceIds = JsonSerializer.Serialize(new[] { "srv-9" }),
                ServiceNames = JsonSerializer.Serialize(new[] { "Comprehensive Pre-Purchase Inspection" }),
                ProblemDescription = "Pre-purchase inspection for a private deal in Kohuwala.",
                Symptoms = JsonSerializer.Serialize(Array.Empty<string>()),
                DamageImages = JsonSerializer.Serialize(Array.Empty<string>()),
                AssignedMechanicId = "mech-5",
                AssignedMechanicName = "Nuwan Fernando",
                AppointmentDate = "2026-11-05",
                AppointmentTime = "01:30 PM",
                EstimatedPriceLkr = 25000,
                FinalPriceLkr = null,
                Status = "PENDING",
                ProgressPercent = 10,
                EstimatedCompletion = "Nov 05, 4:00 PM",
                DropOffOption = "wait_at_lounge",
                InternalNotes = null,
                PaymentStatus = "pending",
                CreatedAt = new DateTime(2026, 11, 2, 16, 0, 0, DateTimeKind.Utc)
            }
        ];
    }
}
