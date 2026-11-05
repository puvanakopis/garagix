using Microsoft.EntityFrameworkCore;
using Garagix.Api.Data;
using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Entities;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Services;

/// <summary>
/// Business logic service implementing workshop technician operations.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="MechanicService"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="dbContext">Database context instance.</param>
/// <param name="logger">Application logging facility.</param>
public class MechanicService(
    ApplicationDbContext dbContext,
    ILogger<MechanicService> logger) : IMechanicService
{
    private readonly ApplicationDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
    private readonly ILogger<MechanicService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <inheritdoc />
    public async Task<IReadOnlyList<MechanicResponse>> GetAllAsync(
        string? status = null,
        string? search = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Mechanics.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(status))
        {
            var st = status.Trim().ToLower();
            query = query.Where(m => m.Status.ToLower() == st);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(m =>
                m.Name.ToLower().Contains(term) ||
                m.Title.ToLower().Contains(term) ||
                m.Specialization.ToLower().Contains(term));
        }

        var mechanics = await query
            .OrderBy(m => m.Name)
            .ToListAsync(cancellationToken);

        return mechanics.Select(MapToResponse).ToList();
    }

    /// <inheritdoc />
    public async Task<MechanicResponse?> GetByIdAsync(
        string id,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);

        var mechanic = await _dbContext.Mechanics
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);

        return mechanic is null ? null : MapToResponse(mechanic);
    }

    /// <inheritdoc />
    public async Task<MechanicResponse> CreateAsync(
        CreateMechanicRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var mechanic = new Mechanic
        {
            Id = $"mech-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
            Name = request.Name.Trim(),
            Title = request.Title.Trim(),
            Specialization = request.Specialization.Trim(),
            ExperienceYears = Math.Max(0, request.ExperienceYears),
            Rating = request.Rating ?? 5.0m,
            ReviewCount = request.ReviewCount ?? 0,
            Bio = request.Bio?.Trim() ?? string.Empty,
            ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl) ? "/images/team/mechanic-1.png" : request.ImageUrl.Trim(),
            Status = string.IsNullOrWhiteSpace(request.Status) ? "available" : request.Status.Trim().ToLower(),
            Phone = request.Phone?.Trim(),
            Email = request.Email?.Trim(),
            AssignedBookingsCount = 0,
            Certifications = request.Certifications ?? ["Automotive Guild Member"],
            WorkingHours = string.IsNullOrWhiteSpace(request.WorkingHours) ? "8:00 AM - 5:30 PM (Mon - Sat)" : request.WorkingHours.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.Mechanics.AddAsync(mechanic, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Registered new Master Technician {Name} (ID: {Id})", mechanic.Name, mechanic.Id);

        return MapToResponse(mechanic);
    }

    /// <inheritdoc />
    public async Task<MechanicResponse?> UpdateAsync(
        string id,
        UpdateMechanicRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);
        ArgumentNullException.ThrowIfNull(request);

        var mechanic = await _dbContext.Mechanics
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);

        if (mechanic is null)
        {
            return null;
        }

        if (!string.IsNullOrWhiteSpace(request.Name)) mechanic.Name = request.Name.Trim();
        if (!string.IsNullOrWhiteSpace(request.Title)) mechanic.Title = request.Title.Trim();
        if (!string.IsNullOrWhiteSpace(request.Specialization)) mechanic.Specialization = request.Specialization.Trim();
        if (request.ExperienceYears.HasValue) mechanic.ExperienceYears = Math.Max(0, request.ExperienceYears.Value);
        if (request.Rating.HasValue) mechanic.Rating = request.Rating.Value;
        if (request.ReviewCount.HasValue) mechanic.ReviewCount = request.ReviewCount.Value;
        if (request.Bio is not null) mechanic.Bio = request.Bio.Trim();
        if (!string.IsNullOrWhiteSpace(request.ImageUrl)) mechanic.ImageUrl = request.ImageUrl.Trim();
        if (!string.IsNullOrWhiteSpace(request.Status)) mechanic.Status = request.Status.Trim().ToLower();
        if (request.Phone is not null) mechanic.Phone = request.Phone.Trim();
        if (request.Email is not null) mechanic.Email = request.Email.Trim();
        if (request.AssignedBookingsCount.HasValue) mechanic.AssignedBookingsCount = request.AssignedBookingsCount.Value;
        if (request.Certifications is not null) mechanic.Certifications = request.Certifications;
        if (!string.IsNullOrWhiteSpace(request.WorkingHours)) mechanic.WorkingHours = request.WorkingHours.Trim();

        mechanic.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Updated technician profile {Id} ({Name})", mechanic.Id, mechanic.Name);

        return MapToResponse(mechanic);
    }

    /// <inheritdoc />
    public async Task<bool> DeleteAsync(
        string id,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);

        var mechanic = await _dbContext.Mechanics
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);

        if (mechanic is null)
        {
            return false;
        }

        _dbContext.Mechanics.Remove(mechanic);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Removed technician {Id} ({Name}) from workshop roster", mechanic.Id, mechanic.Name);
        return true;
    }

    /// <inheritdoc />
    public async Task<MechanicResponse?> UpdateStatusAsync(
        string id,
        string status,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);
        ArgumentException.ThrowIfNullOrWhiteSpace(status);

        var mechanic = await _dbContext.Mechanics
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);

        if (mechanic is null)
        {
            return null;
        }

        mechanic.Status = status.Trim().ToLower();
        mechanic.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Changed technician {Id} status to {Status}", mechanic.Id, mechanic.Status);

        return MapToResponse(mechanic);
    }

    private static MechanicResponse MapToResponse(Mechanic m)
    {
        return new MechanicResponse
        {
            Id = m.Id,
            Name = m.Name,
            Title = m.Title,
            Specialization = m.Specialization,
            ExperienceYears = m.ExperienceYears,
            Rating = m.Rating,
            ReviewCount = m.ReviewCount,
            Bio = m.Bio,
            ImageUrl = m.ImageUrl,
            Status = m.Status,
            Phone = m.Phone,
            Email = m.Email,
            AssignedBookingsCount = m.AssignedBookingsCount,
            Certifications = m.Certifications,
            WorkingHours = m.WorkingHours,
            CreatedAt = m.CreatedAt,
            UpdatedAt = m.UpdatedAt
        };
    }
}
