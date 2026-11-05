using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Garagix.Api.Data;
using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Entities;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Services;

/// <summary>
/// Implements business logic for garage bookings, customer intake, repair lifecycle tracking, and technician assignment.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="BookingService"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="dbContext">Application database context.</param>
/// <param name="logger">Application logger.</param>
public class BookingService(
    ApplicationDbContext dbContext,
    ILogger<BookingService> logger) : IBookingService
{
    private static readonly JsonSerializerOptions JsonOptions = new();
    private readonly ApplicationDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
    private readonly ILogger<BookingService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <inheritdoc />
    public async Task<IReadOnlyList<BookingResponse>> GetAllAsync(
        string? status = null,
        string? customerId = null,
        string? search = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Bookings.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("ALL", StringComparison.OrdinalIgnoreCase))
        {
            var cleanStatus = status.Trim().ToUpperInvariant();
            query = query.Where(b => b.Status.ToUpper() == cleanStatus);
        }

        if (!string.IsNullOrWhiteSpace(customerId))
        {
            query = query.Where(b => b.CustomerId == customerId.Trim());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(b =>
                b.ReferenceNumber.ToLower().Contains(term) ||
                b.CustomerName.ToLower().Contains(term) ||
                b.CustomerPhone.ToLower().Contains(term) ||
                b.VehiclePlateNumber.ToLower().Contains(term) ||
                b.VehicleModel.ToLower().Contains(term) ||
                b.ServiceNames.ToLower().Contains(term));
        }

        var entities = await query
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync(cancellationToken);

        return entities.Select(MapToResponse).ToList();
    }

    /// <inheritdoc />
    public async Task<BookingResponse?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(id)) return null;

        var entity = await _dbContext.Bookings
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

        return entity is null ? null : MapToResponse(entity);
    }

    /// <inheritdoc />
    public async Task<BookingResponse?> GetByReferenceOrPlateAsync(string referenceOrPlate, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(referenceOrPlate)) return null;

        var clean = referenceOrPlate.Trim().ToUpperInvariant();

        var entity = await _dbContext.Bookings
            .AsNoTracking()
            .FirstOrDefaultAsync(b =>
                b.ReferenceNumber.ToUpper() == clean ||
                b.VehiclePlateNumber.ToUpper() == clean,
                cancellationToken);

        return entity is null ? null : MapToResponse(entity);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<BookingResponse>> GetCustomerBookingsAsync(string customerId, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(customerId)) return [];

        var entities = await _dbContext.Bookings
            .AsNoTracking()
            .Where(b => b.CustomerId == customerId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync(cancellationToken);

        return entities.Select(MapToResponse).ToList();
    }

    /// <inheritdoc />
    public async Task<BookingResponse> CreateAsync(
        CreateBookingRequest request,
        string? authenticatedUserId = null,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var customerId = !string.IsNullOrWhiteSpace(authenticatedUserId)
            ? authenticatedUserId
            : (!string.IsNullOrWhiteSpace(request.CustomerId) ? request.CustomerId : "guest-" + Guid.NewGuid().ToString("N")[..8]);

        // Generate a human-readable booking reference code: GRX-2026-XXXX
        var referenceNumber = await GenerateUniqueReferenceNumberAsync(cancellationToken);

        // Resolve service names if not provided
        var serviceIds = request.ServiceIds ?? [];
        var serviceNames = request.ServiceNames ?? [];
        if (serviceNames.Count == 0 && serviceIds.Count > 0)
        {
            var matchingServices = await _dbContext.Services
                .AsNoTracking()
                .Where(s => serviceIds.Contains(s.Id))
                .Select(s => s.Name)
                .ToListAsync(cancellationToken);
            serviceNames = matchingServices;
        }

        var customerName = !string.IsNullOrWhiteSpace(request.CustomerName) ? request.CustomerName.Trim() : "Valued Customer";
        var customerPhone = !string.IsNullOrWhiteSpace(request.CustomerPhone) ? request.CustomerPhone.Trim() : "+94 77 123 4567";
        var customerEmail = !string.IsNullOrWhiteSpace(request.CustomerEmail) ? request.CustomerEmail.Trim().ToLowerInvariant() : "customer@garagix.lk";

        var vehiclePlate = !string.IsNullOrWhiteSpace(request.Vehicle?.PlateNumber) ? request.Vehicle.PlateNumber.Trim().ToUpperInvariant() : "WP CAD-4821";
        var vehicleBrand = !string.IsNullOrWhiteSpace(request.Vehicle?.Brand) ? request.Vehicle.Brand.Trim() : "Toyota";
        var vehicleModel = !string.IsNullOrWhiteSpace(request.Vehicle?.Model) ? request.Vehicle.Model.Trim() : "Prius Hybrid";
        var vehicleYear = (request.Vehicle != null && request.Vehicle.Year >= 1970 && request.Vehicle.Year <= 2030) ? request.Vehicle.Year : 2020;

        var bookingId = "book-" + Guid.NewGuid().ToString("N")[..8];
        var entity = new Booking
        {
            Id = bookingId,
            ReferenceNumber = referenceNumber,
            CustomerId = customerId,
            CustomerName = customerName,
            CustomerPhone = customerPhone,
            CustomerEmail = customerEmail,
            VehiclePlateNumber = vehiclePlate,
            VehicleBrand = vehicleBrand,
            VehicleModel = vehicleModel,
            VehicleYear = vehicleYear,
            VehicleMileageKm = request.Vehicle?.MileageKm,
            ServiceIds = JsonSerializer.Serialize(serviceIds, JsonOptions),
            ServiceNames = JsonSerializer.Serialize(serviceNames, JsonOptions),
            ProblemDescription = request.ProblemDescription?.Trim() ?? string.Empty,
            Symptoms = JsonSerializer.Serialize(request.Symptoms ?? [], JsonOptions),
            DamageImages = JsonSerializer.Serialize(request.DamageImages ?? [], JsonOptions),
            AssignedMechanicId = request.PreferredMechanicId,
            AssignedMechanicName = !string.IsNullOrWhiteSpace(request.PreferredMechanicName)
                ? request.PreferredMechanicName
                : (request.PreferredMechanicId != null ? "Assigned" : "To Be Assigned"),
            AppointmentDate = !string.IsNullOrWhiteSpace(request.AppointmentDate) ? request.AppointmentDate.Trim() : DateTime.UtcNow.ToString("yyyy-MM-dd"),
            AppointmentTime = !string.IsNullOrWhiteSpace(request.AppointmentTime) ? request.AppointmentTime.Trim() : "09:30 AM",
            EstimatedPriceLkr = request.EstimatedPriceLkr,
            FinalPriceLkr = null,
            Status = "CONFIRMED",
            ProgressPercent = 25,
            EstimatedCompletion = $"{request.AppointmentDate}, {request.AppointmentTime}",
            DropOffOption = request.DropOffOption?.Trim() ?? "drop_off",
            PaymentStatus = "pending",
            InternalNotes = null,
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.Bookings.AddAsync(entity, cancellationToken);

        // If registered customer, increment their booking total
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == customerId, cancellationToken);
        if (user != null)
        {
            user.TotalBookings += 1;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("New vehicle repair booking created with reference '{ReferenceNumber}' for customer '{CustomerId}'.", referenceNumber, customerId);

        return MapToResponse(entity);
    }

    /// <inheritdoc />
    public async Task<BookingResponse?> UpdateAsync(
        string id,
        UpdateBookingRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var entity = await _dbContext.Bookings
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

        if (entity is null) return null;

        if (!string.IsNullOrWhiteSpace(request.AppointmentDate))
        {
            entity.AppointmentDate = request.AppointmentDate.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.AppointmentTime))
        {
            entity.AppointmentTime = request.AppointmentTime.Trim();
        }

        if (request.EstimatedPriceLkr.HasValue)
        {
            entity.EstimatedPriceLkr = request.EstimatedPriceLkr.Value;
        }

        if (request.FinalPriceLkr.HasValue)
        {
            entity.FinalPriceLkr = request.FinalPriceLkr.Value;
        }

        if (!string.IsNullOrWhiteSpace(request.PaymentStatus))
        {
            entity.PaymentStatus = request.PaymentStatus.Trim();
        }

        if (request.Vehicle != null)
        {
            if (!string.IsNullOrWhiteSpace(request.Vehicle.PlateNumber))
            {
                entity.VehiclePlateNumber = request.Vehicle.PlateNumber.Trim().ToUpperInvariant();
            }
            if (!string.IsNullOrWhiteSpace(request.Vehicle.Brand))
            {
                entity.VehicleBrand = request.Vehicle.Brand.Trim();
            }
            if (!string.IsNullOrWhiteSpace(request.Vehicle.Model))
            {
                entity.VehicleModel = request.Vehicle.Model.Trim();
            }
            if (request.Vehicle.Year > 0)
            {
                entity.VehicleYear = request.Vehicle.Year;
            }
            if (request.Vehicle.MileageKm.HasValue)
            {
                entity.VehicleMileageKm = request.Vehicle.MileageKm.Value;
            }
        }

        if (!string.IsNullOrWhiteSpace(request.DropOffOption))
        {
            entity.DropOffOption = request.DropOffOption.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.CustomerPhone))
        {
            entity.CustomerPhone = request.CustomerPhone.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.CustomerEmail))
        {
            entity.CustomerEmail = request.CustomerEmail.Trim().ToLowerInvariant();
        }

        if (request.ProblemDescription != null)
        {
            entity.ProblemDescription = request.ProblemDescription.Trim();
        }

        if (request.InternalNotes != null)
        {
            entity.InternalNotes = request.InternalNotes.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.AssignedMechanicId))
        {
            entity.AssignedMechanicId = request.AssignedMechanicId.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.AssignedMechanicName))
        {
            entity.AssignedMechanicName = request.AssignedMechanicName.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.EstimatedCompletion))
        {
            entity.EstimatedCompletion = request.EstimatedCompletion.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            entity.Status = request.Status.Trim().ToUpperInvariant();
            entity.ProgressPercent = request.ProgressPercent ?? CalculateProgress(entity.Status);

            if (string.IsNullOrWhiteSpace(request.EstimatedCompletion))
            {
                if (entity.Status is "DELIVERED" or "COMPLETED")
                {
                    entity.EstimatedCompletion = $"Completed on {DateTime.UtcNow:MMM dd, yyyy}";
                }
                else if (entity.Status is "READY_FOR_PICKUP")
                {
                    entity.EstimatedCompletion = "Ready for Collection";
                }
            }
        }
        else if (request.ProgressPercent.HasValue)
        {
            entity.ProgressPercent = request.ProgressPercent.Value;
        }

        entity.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Booking '{BookingId}' updated by administrator.", id);

        return MapToResponse(entity);
    }

    /// <inheritdoc />
    public async Task<BookingResponse?> UpdateStatusAsync(
        string id,
        UpdateBookingStatusRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var entity = await _dbContext.Bookings
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

        if (entity is null) return null;

        var status = request.Status.Trim().ToUpperInvariant();
        entity.Status = status;
        entity.ProgressPercent = request.ProgressPercent ?? CalculateProgress(status);

        if (!string.IsNullOrWhiteSpace(request.Note))
        {
            var timestamp = DateTime.UtcNow.ToString("HH:mm");
            entity.InternalNotes = string.IsNullOrWhiteSpace(entity.InternalNotes)
                ? $"[{timestamp}] {request.Note.Trim()}"
                : $"{entity.InternalNotes}\n[{timestamp}] {request.Note.Trim()}";
        }

        if (status is "DELIVERED" or "COMPLETED")
        {
            entity.EstimatedCompletion = $"Completed on {DateTime.UtcNow:MMM dd, yyyy}";
        }
        else if (status is "READY_FOR_PICKUP")
        {
            entity.EstimatedCompletion = "Ready for Collection";
        }

        entity.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Booking '{BookingId}' status changed to '{Status}'.", id, status);
        return MapToResponse(entity);
    }

    /// <inheritdoc />
    public async Task<BookingResponse?> AssignMechanicAsync(
        string id,
        AssignMechanicRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var entity = await _dbContext.Bookings
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

        if (entity is null) return null;

        entity.AssignedMechanicId = request.MechanicId.Trim();

        if (!string.IsNullOrWhiteSpace(request.MechanicName))
        {
            entity.AssignedMechanicName = request.MechanicName.Trim();
        }
        else
        {
            var mechanic = await _dbContext.Mechanics
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == request.MechanicId, cancellationToken);
            entity.AssignedMechanicName = mechanic?.Name ?? "Assigned";
        }

        entity.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Mechanic '{MechanicId}' assigned to booking '{BookingId}'.", request.MechanicId, id);
        return MapToResponse(entity);
    }

    /// <inheritdoc />
    public async Task<BookingResponse?> CancelAsync(
        string id,
        CancelBookingRequest request,
        string? authenticatedUserId,
        bool isAdmin,
        CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.Bookings
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

        if (entity is null) return null;

        // If not admin, check customer ownership
        if (!isAdmin && !string.IsNullOrWhiteSpace(authenticatedUserId) && entity.CustomerId != authenticatedUserId)
        {
            return null; // Not owner
        }

        // Cannot cancel completed or ready for collection jobs
        if (entity.Status == "DELIVERED" || entity.Status == "READY_FOR_PICKUP")
        {
            return null;
        }

        entity.Status = "CANCELLED";
        entity.ProgressPercent = 0;

        var reason = !string.IsNullOrWhiteSpace(request?.Reason) ? request.Reason.Trim() : "Customer requested";
        entity.InternalNotes = string.IsNullOrWhiteSpace(entity.InternalNotes)
            ? $"Cancelled: {reason}"
            : $"{entity.InternalNotes} | Cancelled: {reason}";

        entity.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Booking '{BookingId}' was cancelled. Reason: {Reason}", id, reason);
        return MapToResponse(entity);
    }

    /// <inheritdoc />
    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.Bookings
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

        if (entity is null) return false;

        _dbContext.Bookings.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Booking '{BookingId}' permanently deleted from database.", id);
        return true;
    }

    private static int CalculateProgress(string status)
    {
        return status.ToUpperInvariant() switch
        {
            "PENDING" => 10,
            "CONFIRMED" => 25,
            "IN_PROGRESS" => 50,
            "WAITING_FOR_PARTS" => 60,
            "ON_HOLD" => 60,
            "QUALITY_CHECK" => 80,
            "READY_FOR_PICKUP" => 95,
            "DELIVERED" => 100,
            "CANCELLED" => 0,
            _ => 10
        };
    }

    private async Task<string> GenerateUniqueReferenceNumberAsync(CancellationToken cancellationToken)
    {
        for (int i = 0; i < 10; i++)
        {
            var randomDigits = RandomNumberGenerator.GetInt32(1000, 9999);
            var refNum = $"GRX-2026-{randomDigits}";

            var exists = await _dbContext.Bookings
                .AnyAsync(b => b.ReferenceNumber == refNum, cancellationToken);

            if (!exists) return refNum;
        }

        return $"GRX-2026-{RandomNumberGenerator.GetInt32(10000, 99999)}";
    }

    private static BookingResponse MapToResponse(Booking entity)
    {
        var sIds = SafeDeserializeList(entity.ServiceIds);
        var sNames = SafeDeserializeList(entity.ServiceNames);
        var symptoms = SafeDeserializeList(entity.Symptoms);
        var images = SafeDeserializeList(entity.DamageImages);

        return new BookingResponse
        {
            Id = entity.Id,
            ReferenceNumber = entity.ReferenceNumber,
            CustomerId = entity.CustomerId,
            CustomerName = entity.CustomerName,
            CustomerPhone = entity.CustomerPhone,
            CustomerEmail = entity.CustomerEmail,
            Vehicle = new BookingVehicleDto
            {
                PlateNumber = entity.VehiclePlateNumber,
                Brand = entity.VehicleBrand,
                Model = entity.VehicleModel,
                Year = entity.VehicleYear,
                MileageKm = entity.VehicleMileageKm
            },
            ServiceIds = sIds,
            ServiceNames = sNames,
            ProblemDescription = entity.ProblemDescription,
            Symptoms = symptoms,
            DamageImages = images,
            AssignedMechanicId = entity.AssignedMechanicId,
            AssignedMechanicName = entity.AssignedMechanicName,
            AppointmentDate = entity.AppointmentDate,
            AppointmentTime = entity.AppointmentTime,
            EstimatedPriceLkr = entity.EstimatedPriceLkr,
            FinalPriceLkr = entity.FinalPriceLkr,
            Status = entity.Status,
            ProgressPercent = entity.ProgressPercent,
            EstimatedCompletion = entity.EstimatedCompletion,
            DropOffOption = entity.DropOffOption,
            InternalNotes = entity.InternalNotes,
            PaymentStatus = entity.PaymentStatus,
            CreatedAt = entity.CreatedAt.ToString("yyyy-MM-dd hh:mm tt"),
            UpdatedAt = entity.UpdatedAt
        };
    }

    private static List<string> SafeDeserializeList(string? json)
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

