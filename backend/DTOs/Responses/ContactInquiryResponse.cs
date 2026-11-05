namespace Garagix.Api.DTOs.Responses;

/// <summary>
/// Data transfer object representing a submitted customer inquiry and handling status.
/// </summary>
public class ContactInquiryResponse
{
    /// <summary>
    /// Gets or sets inquiry primary identifier.
    /// </summary>
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer full name.
    /// </summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer email address.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer telephone number.
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets automotive service category requested.
    /// </summary>
    public string ServiceType { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets message text.
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets inquiry status ('pending', 'contacted', 'resolved').
    /// </summary>
    public string Status { get; set; } = "pending";

    /// <summary>
    /// Gets or sets submission timestamp.
    /// </summary>
    public DateTime CreatedAt { get; set; }
}
