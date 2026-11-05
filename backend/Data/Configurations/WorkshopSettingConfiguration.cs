using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Garagix.Api.Entities;

namespace Garagix.Api.Data.Configurations;

/// <summary>
/// Entity Framework Core mapping configuration and initial seeding for <see cref="WorkshopSetting"/>.
/// </summary>
public class WorkshopSettingConfiguration : IEntityTypeConfiguration<WorkshopSetting>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<WorkshopSetting> builder)
    {
        builder.ToTable("workshop_settings");
        builder.HasKey(w => w.Id);
        builder.Property(w => w.Id).HasMaxLength(50);

        builder.Property(w => w.WorkshopName).IsRequired().HasMaxLength(150);
        builder.Property(w => w.RegNumber).IsRequired().HasMaxLength(50);
        builder.Property(w => w.Phone).IsRequired().HasMaxLength(30);
        builder.Property(w => w.EmergencyPhone).IsRequired().HasMaxLength(30);
        builder.Property(w => w.Email).IsRequired().HasMaxLength(150);
        builder.Property(w => w.Address).IsRequired().HasMaxLength(300);
        builder.Property(w => w.Description).HasColumnType("longtext");

        builder.Property(w => w.FacilityBay).IsRequired().HasMaxLength(100);
        builder.Property(w => w.WorkshopStatus).IsRequired().HasMaxLength(50);
        builder.Property(w => w.AlertsEngineStatus).IsRequired().HasMaxLength(100);

        builder.Property(w => w.MondayFridayOpen).IsRequired().HasMaxLength(20);
        builder.Property(w => w.MondayFridayClose).IsRequired().HasMaxLength(20);
        builder.Property(w => w.SaturdayHours).IsRequired().HasMaxLength(100);
        builder.Property(w => w.SundayHours).IsRequired().HasMaxLength(150);
        builder.Property(w => w.ActiveWorkingDays).IsRequired().HasMaxLength(300);

        builder.Property(w => w.SlotDurationMinutes).HasDefaultValue(60);
        builder.Property(w => w.ConcurrentHydraulicBays).HasDefaultValue(6);
        builder.Property(w => w.FreeCancellationHours).HasDefaultValue(4);
        builder.Property(w => w.MaxAdvanceBookingDays).HasDefaultValue(30);

        builder.Property(w => w.AutomatedBookingConfirmationSms).HasDefaultValue(true);
        builder.Property(w => w.TechnicianStatusChangeBroadcast).HasDefaultValue(true);
        builder.Property(w => w.CollectionBayReadyNotification).HasDefaultValue(true);

        builder.Property(w => w.CreatedAt).IsRequired();
        builder.Property(w => w.UpdatedAt);

        builder.HasData(GetInitialWorkshopSettings());
    }

    /// <summary>
    /// Returns default garage settings to initialize the workshop database.
    /// </summary>
    public static WorkshopSetting GetInitialWorkshopSettings()
    {
        return new WorkshopSetting
        {
            Id = "default",
            WorkshopName = "Garagix Auto Care HQ",
            RegNumber = "PV-124991-LK",
            Phone = "+94 11 234 5678",
            EmergencyPhone = "(+94) 77 123 4567",
            Email = "service@garagix.lk",
            Address = "No. 45/A, Nawala Road, Nugegoda, Colombo, Sri Lanka",
            Description = "Premier automotive engineering and computerized diagnostic center specializing in Japanese, European, and Hybrid vehicles.",
            FacilityBay = "Colombo Central",
            WorkshopStatus = "Operational",
            AlertsEngineStatus = "SMS & Email Live",
            MondayFridayOpen = "08:00",
            MondayFridayClose = "18:30",
            SaturdayHours = "08:00 AM - 05:00 PM",
            SundayHours = "Emergency Breakdown Intake Only",
            ActiveWorkingDays = "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
            SlotDurationMinutes = 60,
            ConcurrentHydraulicBays = 6,
            FreeCancellationHours = 4,
            MaxAdvanceBookingDays = 30,
            AutomatedBookingConfirmationSms = true,
            TechnicianStatusChangeBroadcast = true,
            CollectionBayReadyNotification = true,
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };
    }
}

