using System.ComponentModel.DataAnnotations.Schema;

namespace Garagix.Api.Entities;

/// <summary>
/// Represents a public customer inquiry submitted through the Garagix contact portal.
/// </summary>
[Table("contact_inquiries")]
public class ContactInquiry
{
    /// <summary>
    /// Gets or sets primary identifier.
    /// </summary>
    public string Id { get; set; } = Guid.NewGuid().ToString("N");

    /// <summary>
    /// Gets or sets customer first name.
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer last name.
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer email address.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer telephone number.
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets requested automotive service type.
    /// </summary>
    public string ServiceType { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets inquiry message content.
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets inquiry handling status ('pending', 'contacted', 'resolved').
    /// </summary>
    public string Status { get; set; } = "pending";

    /// <summary>
    /// Gets or sets creation timestamp.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
