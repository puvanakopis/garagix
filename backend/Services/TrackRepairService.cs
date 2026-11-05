using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Garagix.Api.Data;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Entities;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Services;

/// <summary>
/// Service implementing vehicle repair telemetry aggregation, bay milestones, and live customer tracking.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="TrackRepairService"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="dbContext">Application database context.</param>
/// <param name="logger">Application logger.</param>
public class TrackRepairService(
    ApplicationDbContext dbContext,
    ILogger<TrackRepairService> logger) : ITrackRepairService
{
    private readonly ApplicationDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
    private readonly ILogger<TrackRepairService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private static readonly (string Key, string Label, string Description, int Order)[] StatusMilestones =
    [
        ("PENDING", "Pending", "Vehicle received and awaiting inspection.", 0),
        ("CONFIRMED", "Confirmed", "Customer approves the repair estimate.", 1),
        ("IN_PROGRESS", "In Progress", "Mechanic starts the repair work.", 2),
        ("WAITING_FOR_PARTS", "Waiting for Parts / On Hold", "Optional statuses when work cannot continue.", 3),
        ("QUALITY_CHECK", "Quality Check", "Final inspection and testing.", 4),
        ("READY_FOR_PICKUP", "Ready for Pickup", "Vehicle is ready for collection.", 5),
        ("DELIVERED", "Delivered", "Vehicle handed over to the customer.", 6)
    ];

    /// <inheritdoc />
    public async Task<TrackRepairResponse?> GetTelemetryAsync(
        string referenceOrPlate,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(referenceOrPlate)) return null;

        var clean = referenceOrPlate.Trim();

        var booking = await _dbContext.Bookings
            .AsNoTracking()
            .FirstOrDefaultAsync(b =>
                EF.Functions.Like(b.ReferenceNumber, clean) ||
                EF.Functions.Like(b.VehiclePlateNumber, clean),
                cancellationToken);

        if (booking is null)
        {
            _logger.LogWarning("No repair telemetry found matching search code: '{SearchCode}'", clean);
            return null;
        }

        return MapToTelemetryResponse(booking);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<TrackFeedSummaryDto>> GetActiveFeedsAsync(
        CancellationToken cancellationToken = default)
    {
        var list = await _dbContext.Bookings
            .AsNoTracking()
            .Where(b => b.Status != "CANCELLED")
            .OrderByDescending(b => b.CreatedAt)
            .Take(12)
            .Select(b => new TrackFeedSummaryDto
            {
                Id = b.Id,
                ReferenceNumber = b.ReferenceNumber,
                VehicleModel = $"{b.VehicleBrand} {b.VehicleModel}",
                VehiclePlate = b.VehiclePlateNumber,
                Status = b.Status,
                ProgressPercent = b.ProgressPercent
            })
            .ToListAsync(cancellationToken);

        return list;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<TrackFeedSummaryDto>> GetCustomerFeedsAsync(
        string customerId,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(customerId)) return [];

        var list = await _dbContext.Bookings
            .AsNoTracking()
            .Where(b => b.CustomerId == customerId)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new TrackFeedSummaryDto
            {
                Id = b.Id,
                ReferenceNumber = b.ReferenceNumber,
                VehicleModel = $"{b.VehicleBrand} {b.VehicleModel}",
                VehiclePlate = b.VehiclePlateNumber,
                Status = b.Status,
                ProgressPercent = b.ProgressPercent
            })
            .ToListAsync(cancellationToken);

        return list;
    }

    private static TrackRepairResponse MapToTelemetryResponse(Booking b)
    {
        var serviceNames = DeserializeList(b.ServiceNames);

        var timeline = BuildTimeline(b.Status, b.ProgressPercent, b.CreatedAt, b.UpdatedAt);

        return new TrackRepairResponse
        {
            Id = b.Id,
            ReferenceNumber = b.ReferenceNumber,
            CustomerId = b.CustomerId,
            CustomerName = b.CustomerName,
            Status = b.Status,
            ProgressPercent = b.ProgressPercent,
            EstimatedCompletion = b.EstimatedCompletion,
            EstimatedPriceLkr = b.EstimatedPriceLkr,
            FinalPriceLkr = b.FinalPriceLkr,
            PaymentStatus = b.PaymentStatus,
            Vehicle = new BookingVehicleDto
            {
                PlateNumber = b.VehiclePlateNumber,
                Brand = b.VehicleBrand,
                Model = b.VehicleModel,
                Year = b.VehicleYear,
                MileageKm = b.VehicleMileageKm
            },
            ServiceNames = serviceNames,
            ProblemDescription = b.ProblemDescription,
            AssignedMechanicName = b.AssignedMechanicName ?? "To Be Assigned",
            InternalNotes = b.InternalNotes,
            DropOffOption = b.DropOffOption,
            AppointmentDate = b.AppointmentDate,
            AppointmentTime = b.AppointmentTime,
            Timeline = timeline,
            CreatedAt = b.CreatedAt.ToString("yyyy-MM-dd hh:mm tt"),
            UpdatedAt = b.UpdatedAt?.ToString("o")
        };
    }

    private static IReadOnlyList<TrackTimelineStepDto> BuildTimeline(
        string currentStatus,
        int progressPercent,
        DateTime createdAt,
        DateTime? updatedAt)
    {
        if (currentStatus.Equals("CANCELLED", StringComparison.OrdinalIgnoreCase))
        {
            return
            [
                new TrackTimelineStepDto
                {
                    Step = 1,
                    Key = "CANCELLED",
                    Label = "Cancelled",
                    Description = "This vehicle repair appointment was cancelled.",
                    Timestamp = updatedAt?.ToString("MMM dd, yyyy hh:mm tt"),
                    Completed = false,
                    Current = true
                }
            ];
        }

        var normalizedStatus = currentStatus.ToUpperInvariant();
        var currentOrder = normalizedStatus switch
        {
            "PENDING" => 0,
            "CONFIRMED" => 1,
            "IN_PROGRESS" => 2,
            "WAITING_FOR_PARTS" or "ON_HOLD" => 3,
            "QUALITY_CHECK" => 4,
            "READY_FOR_PICKUP" => 5,
            "DELIVERED" or "COMPLETED" => 6,
            _ => 0
        };

        var isDelivered = normalizedStatus is "DELIVERED" or "COMPLETED";

        var steps = new List<TrackTimelineStepDto>();
        for (var i = 0; i < StatusMilestones.Length; i++)
        {
            var m = StatusMilestones[i];
            var completed = isDelivered || currentOrder > m.Order;
            var isCurrent = !isDelivered && currentOrder == m.Order;

            string? timestamp = null;
            if (completed && i == 0)
            {
                timestamp = createdAt.ToString("MMM dd, hh:mm tt");
            }
            else if (isCurrent && updatedAt.HasValue)
            {
                timestamp = updatedAt.Value.ToString("MMM dd, hh:mm tt");
            }

            steps.Add(new TrackTimelineStepDto
            {
                Step = i + 1,
                Key = m.Key,
                Label = m.Label,
                Description = m.Description,
                Timestamp = timestamp,
                Completed = completed,
                Current = isCurrent
            });
        }

        return steps;
    }

    private static IReadOnlyList<string> DeserializeList(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return [];
        try
        {
            return JsonSerializer.Deserialize<List<string>>(json, JsonOptions) ?? [];
        }
        catch
        {
            return [];
        }
    }
}

