using Microsoft.EntityFrameworkCore;
using Garagix.Api.Data;
using Garagix.Api.Data.Configurations;
using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Entities;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Services;

/// <summary>
/// Implements business logic for managing workshop identity, facility hours, and booking constraints.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="WorkshopSettingsService"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="dbContext">Application database context.</param>
/// <param name="logger">Application logger.</param>
public class WorkshopSettingsService(
    ApplicationDbContext dbContext,
    ILogger<WorkshopSettingsService> logger) : IWorkshopSettingsService
{
    private readonly ApplicationDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
    private readonly ILogger<WorkshopSettingsService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <inheritdoc />
    public async Task<WorkshopSettingsResponse> GetSettingsAsync(CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.WorkshopSettings
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken);

        if (entity is null)
        {
            _logger.LogInformation("No workshop settings found in database; provisioning and caching default configuration.");
            entity = WorkshopSettingConfiguration.GetInitialWorkshopSettings();
            await _dbContext.WorkshopSettings.AddAsync(entity, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return MapToResponse(entity);
    }

    /// <inheritdoc />
    public async Task<WorkshopSettingsResponse> UpdateSettingsAsync(
        UpdateWorkshopSettingsRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var entity = await _dbContext.WorkshopSettings
            .FirstOrDefaultAsync(cancellationToken);

        if (entity is null)
        {
            entity = WorkshopSettingConfiguration.GetInitialWorkshopSettings();
            await _dbContext.WorkshopSettings.AddAsync(entity, cancellationToken);
        }

        // Apply General Identity & Location fields
        if (!string.IsNullOrWhiteSpace(request.WorkshopName))
        {
            entity.WorkshopName = request.WorkshopName.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.RegNumber))
        {
            entity.RegNumber = request.RegNumber.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.Phone))
        {
            entity.Phone = request.Phone.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.EmergencyPhone))
        {
            entity.EmergencyPhone = request.EmergencyPhone.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            entity.Email = request.Email.Trim().ToLowerInvariant();
        }

        if (!string.IsNullOrWhiteSpace(request.Address))
        {
            entity.Address = request.Address.Trim();
        }

        if (request.Description is not null)
        {
            entity.Description = request.Description.Trim();
        }

        // Apply Facility & Telemetry Statuses
        if (!string.IsNullOrWhiteSpace(request.FacilityBay))
        {
            entity.FacilityBay = request.FacilityBay.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.WorkshopStatus))
        {
            entity.WorkshopStatus = request.WorkshopStatus.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.AlertsEngineStatus))
        {
            entity.AlertsEngineStatus = request.AlertsEngineStatus.Trim();
        }

        // Apply Operating Hours & Working Days
        if (!string.IsNullOrWhiteSpace(request.MondayFridayOpen))
        {
            entity.MondayFridayOpen = request.MondayFridayOpen.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.MondayFridayClose))
        {
            entity.MondayFridayClose = request.MondayFridayClose.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.SaturdayHours))
        {
            entity.SaturdayHours = request.SaturdayHours.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.SundayHours))
        {
            entity.SundayHours = request.SundayHours.Trim();
        }

        if (request.ActiveWorkingDays is not null && request.ActiveWorkingDays.Count > 0)
        {
            entity.ActiveWorkingDays = string.Join(",", request.ActiveWorkingDays.Select(d => d.Trim()));
        }

        // Apply Booking Constraints
        if (request.SlotDurationMinutes.HasValue && request.SlotDurationMinutes.Value > 0)
        {
            entity.SlotDurationMinutes = request.SlotDurationMinutes.Value;
        }

        if (request.ConcurrentHydraulicBays.HasValue && request.ConcurrentHydraulicBays.Value > 0)
        {
            entity.ConcurrentHydraulicBays = request.ConcurrentHydraulicBays.Value;
        }

        if (request.FreeCancellationHours.HasValue && request.FreeCancellationHours.Value >= 0)
        {
            entity.FreeCancellationHours = request.FreeCancellationHours.Value;
        }

        if (request.MaxAdvanceBookingDays.HasValue && request.MaxAdvanceBookingDays.Value > 0)
        {
            entity.MaxAdvanceBookingDays = request.MaxAdvanceBookingDays.Value;
        }

        // Apply Notification Preferences
        if (request.AutomatedBookingConfirmationSms.HasValue)
        {
            entity.AutomatedBookingConfirmationSms = request.AutomatedBookingConfirmationSms.Value;
        }

        if (request.TechnicianStatusChangeBroadcast.HasValue)
        {
            entity.TechnicianStatusChangeBroadcast = request.TechnicianStatusChangeBroadcast.Value;
        }

        if (request.CollectionBayReadyNotification.HasValue)
        {
            entity.CollectionBayReadyNotification = request.CollectionBayReadyNotification.Value;
        }

        entity.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Workshop configuration settings updated successfully by administrator.");

        return MapToResponse(entity);
    }

    private static WorkshopSettingsResponse MapToResponse(WorkshopSetting entity)
    {
        var daysList = string.IsNullOrWhiteSpace(entity.ActiveWorkingDays)
            ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            : entity.ActiveWorkingDays.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        return new WorkshopSettingsResponse
        {
            Id = entity.Id,
            WorkshopName = entity.WorkshopName,
            RegNumber = entity.RegNumber,
            Phone = entity.Phone,
            EmergencyPhone = entity.EmergencyPhone,
            Email = entity.Email,
            Address = entity.Address,
            Description = entity.Description,
            FacilityBay = entity.FacilityBay,
            WorkshopStatus = entity.WorkshopStatus,
            AlertsEngineStatus = entity.AlertsEngineStatus,
            MondayFridayOpen = entity.MondayFridayOpen,
            MondayFridayClose = entity.MondayFridayClose,
            SaturdayHours = entity.SaturdayHours,
            SundayHours = entity.SundayHours,
            ActiveWorkingDays = daysList,
            SlotDurationMinutes = entity.SlotDurationMinutes,
            ConcurrentHydraulicBays = entity.ConcurrentHydraulicBays,
            FreeCancellationHours = entity.FreeCancellationHours,
            MaxAdvanceBookingDays = entity.MaxAdvanceBookingDays,
            AutomatedBookingConfirmationSms = entity.AutomatedBookingConfirmationSms,
            TechnicianStatusChangeBroadcast = entity.TechnicianStatusChangeBroadcast,
            CollectionBayReadyNotification = entity.CollectionBayReadyNotification,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }
}

