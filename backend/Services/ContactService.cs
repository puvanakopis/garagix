using Microsoft.EntityFrameworkCore;
using Garagix.Api.Data;
using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Entities;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Services;

/// <summary>
/// Business logic provider for managing customer inquiries and triage dispatches.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="ContactService"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="dbContext">Database context instance.</param>
/// <param name="logger">Application logger.</param>
public class ContactService(
    ApplicationDbContext dbContext,
    ILogger<ContactService> logger) : IContactService
{
    private readonly ApplicationDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
    private readonly ILogger<ContactService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <inheritdoc />
    public async Task<ContactInquiryResponse> SubmitInquiryAsync(
        CreateContactInquiryRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var inquiry = new ContactInquiry
        {
            Id = "inq-" + Guid.NewGuid().ToString("N")[..8],
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Phone = request.Phone.Trim(),
            ServiceType = request.ServiceType?.Trim() ?? "General Mechanical Inspection",
            Message = request.Message?.Trim() ?? string.Empty,
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.ContactInquiries.AddAsync(inquiry, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("New customer inquiry '{InquiryId}' received from {Email}.", inquiry.Id, inquiry.Email);

        return new ContactInquiryResponse
        {
            Id = inquiry.Id,
            FullName = $"{inquiry.FirstName} {inquiry.LastName}".Trim(),
            Email = inquiry.Email,
            Phone = inquiry.Phone,
            ServiceType = inquiry.ServiceType,
            Message = inquiry.Message,
            Status = inquiry.Status,
            CreatedAt = inquiry.CreatedAt
        };
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<ContactInquiryResponse>> GetAllInquiriesAsync(
        CancellationToken cancellationToken = default)
    {
        var inquiries = await _dbContext.ContactInquiries
            .AsNoTracking()
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync(cancellationToken);

        return inquiries.Select(i => new ContactInquiryResponse
        {
            Id = i.Id,
            FullName = $"{i.FirstName} {i.LastName}".Trim(),
            Email = i.Email,
            Phone = i.Phone,
            ServiceType = i.ServiceType,
            Message = i.Message,
            Status = i.Status,
            CreatedAt = i.CreatedAt
        }).ToList();
    }
}
