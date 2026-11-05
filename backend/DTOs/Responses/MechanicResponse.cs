namespace Garagix.Api.DTOs.Responses;

/// <summary>
/// Master technician data transfer object returned to client callers.
/// </summary>
public class MechanicResponse
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public int ExperienceYears { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public string Bio { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public int AssignedBookingsCount { get; set; }
    public List<string> Certifications { get; set; } = [];
    public string WorkingHours { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

