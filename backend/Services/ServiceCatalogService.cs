using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Garagix.Api.Data;
using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Entities;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Services;

/// <summary>
/// Business logic service implementing vehicle service catalog operations.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="ServiceCatalogService"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="dbContext">Database context instance.</param>
/// <param name="logger">Application logging facility.</param>
public partial class ServiceCatalogService(
    ApplicationDbContext dbContext,
    ILogger<ServiceCatalogService> logger) : IServiceCatalogService
{
    private readonly ApplicationDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
    private readonly ILogger<ServiceCatalogService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    private static readonly string[] StandardCategories =
    [
        "Maintenance",
        "Diagnostics",
        "Engine & Transmission",
        "Brakes & Tires",
        "Electrical & Battery",
        "AC & Climate",
        "Body & Detailing"
    ];

    /// <inheritdoc />
    public async Task<IReadOnlyList<ServiceResponse>> GetAllAsync(
        bool? activeOnly = null,
        string? category = null,
        string? search = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Services.AsNoTracking();

        if (activeOnly.HasValue && activeOnly.Value)
        {
            query = query.Where(s => s.IsActive);
        }

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("ALL", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(s => s.Category.ToLower() == category.ToLower().Trim());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower().Trim();
            query = query.Where(s =>
                s.Name.ToLower().Contains(term) ||
                s.Category.ToLower().Contains(term) ||
                s.ShortDescription.ToLower().Contains(term));
        }

        var list = await query
            .OrderByDescending(s => s.Featured)
            .ThenBy(s => s.Category)
            .ThenBy(s => s.Name)
            .ToListAsync(cancellationToken);

        return list.Select(MapToResponse).ToList();
    }

    /// <inheritdoc />
    public async Task<ServiceResponse?> GetByIdOrSlugAsync(
        string idOrSlug,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(idOrSlug);

        var service = await _dbContext.Services.AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == idOrSlug || s.Slug == idOrSlug, cancellationToken);

        return service == null ? null : MapToResponse(service);
    }

    /// <inheritdoc />
    public async Task<ServiceResponse> CreateAsync(
        CreateServiceRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var slug = GenerateSlug(string.IsNullOrWhiteSpace(request.Slug) ? request.Name : request.Slug);
        var finalSlug = await EnsureUniqueSlugAsync(slug, null, cancellationToken);

        var newId = $"srv-{Guid.NewGuid():N}"[..12];

        var entity = new ServiceItem
        {
            Id = newId,
            Name = request.Name.Trim(),
            Slug = finalSlug,
            Category = request.Category.Trim(),
            ShortDescription = request.ShortDescription.Trim(),
            FullDescription = string.IsNullOrWhiteSpace(request.FullDescription) ? request.ShortDescription.Trim() : request.FullDescription.Trim(),
            StartingPriceLkr = request.StartingPriceLkr,
            DurationMinutes = request.DurationMinutes,
            Featured = request.Featured ?? false,
            IsActive = request.IsActive ?? true,
            IncludedItems = request.IncludedItems ?? [],
            CommonSymptoms = request.CommonSymptoms ?? [],
            RecommendedMechanicIds = request.RecommendedMechanicIds ?? [],
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Services.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Administrator created service package '{Name}' with ID '{Id}' and slug '{Slug}'.", entity.Name, entity.Id, entity.Slug);

        return MapToResponse(entity);
    }

    /// <inheritdoc />
    public async Task<ServiceResponse?> UpdateAsync(
        string id,
        UpdateServiceRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);
        ArgumentNullException.ThrowIfNull(request);

        var entity = await _dbContext.Services
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

        if (entity == null)
        {
            _logger.LogWarning("Attempted to update non-existent service package with ID '{Id}'.", id);
            return null;
        }

        var slug = GenerateSlug(string.IsNullOrWhiteSpace(request.Slug) ? request.Name : request.Slug);
        var finalSlug = await EnsureUniqueSlugAsync(slug, id, cancellationToken);

        entity.Name = request.Name.Trim();
        entity.Slug = finalSlug;
        entity.Category = request.Category.Trim();
        entity.ShortDescription = request.ShortDescription.Trim();
        entity.FullDescription = string.IsNullOrWhiteSpace(request.FullDescription) ? request.ShortDescription.Trim() : request.FullDescription.Trim();
        entity.StartingPriceLkr = request.StartingPriceLkr;
        entity.DurationMinutes = request.DurationMinutes;
        
        if (request.Featured.HasValue) entity.Featured = request.Featured.Value;
        if (request.IsActive.HasValue) entity.IsActive = request.IsActive.Value;
        if (request.IncludedItems != null) entity.IncludedItems = request.IncludedItems;
        if (request.CommonSymptoms != null) entity.CommonSymptoms = request.CommonSymptoms;
        if (request.RecommendedMechanicIds != null) entity.RecommendedMechanicIds = request.RecommendedMechanicIds;

        entity.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Administrator updated service package '{Name}' with ID '{Id}'.", entity.Name, entity.Id);

        return MapToResponse(entity);
    }

    /// <inheritdoc />
    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);

        var entity = await _dbContext.Services
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

        if (entity == null)
        {
            _logger.LogWarning("Attempted to delete non-existent service package with ID '{Id}'.", id);
            return false;
        }

        _dbContext.Services.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Administrator deleted service package '{Name}' with ID '{Id}'.", entity.Name, entity.Id);

        return true;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<string>> GetCategoriesAsync(CancellationToken cancellationToken = default)
    {
        var dbCategories = await _dbContext.Services.AsNoTracking()
            .Select(s => s.Category)
            .Distinct()
            .ToListAsync(cancellationToken);

        var merged = StandardCategories
            .Union(dbCategories, StringComparer.OrdinalIgnoreCase)
            .OrderBy(c => c)
            .ToList();

        return merged;
    }

    private static ServiceResponse MapToResponse(ServiceItem entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Slug = entity.Slug,
        Category = entity.Category,
        ShortDescription = entity.ShortDescription,
        FullDescription = entity.FullDescription,
        StartingPriceLkr = entity.StartingPriceLkr,
        DurationMinutes = entity.DurationMinutes,
        Featured = entity.Featured,
        IsActive = entity.IsActive,
        IncludedItems = entity.IncludedItems ?? [],
        CommonSymptoms = entity.CommonSymptoms ?? [],
        RecommendedMechanicIds = entity.RecommendedMechanicIds ?? [],
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };

    private static string GenerateSlug(string text)
    {
        var clean = SlugRegex().Replace(text.ToLowerInvariant().Trim(), "-");
        return clean.Trim('-');
    }

    private async Task<string> EnsureUniqueSlugAsync(string baseSlug, string? currentId, CancellationToken cancellationToken)
    {
        var slug = baseSlug;
        var counter = 1;

        while (await _dbContext.Services.AsNoTracking()
                   .AnyAsync(s => s.Slug == slug && (currentId == null || s.Id != currentId), cancellationToken))
        {
            slug = $"{baseSlug}-{counter++}";
        }

        return slug;
    }

    [GeneratedRegex(@"[^a-z0-9]+")]
    private static partial Regex SlugRegex();
}

