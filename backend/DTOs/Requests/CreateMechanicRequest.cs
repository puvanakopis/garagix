namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Payload submitted to register a new master technician in the workshop directory.
/// </summary>
public class CreateMechanicRequest
{
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public int ExperienceYears { get; set; } = 1;
    public decimal? Rating { get; set; }
    public int? ReviewCount { get; set; }
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }
    public string? Status { get; set; } = "available";
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public List<string>? Certifications { get; set; }
    public string? WorkingHours { get; set; } = "8:00 AM - 5:30 PM (Mon - Sat)";
}

