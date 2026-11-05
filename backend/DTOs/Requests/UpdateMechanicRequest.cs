namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Payload submitted to update an existing master technician profile.
/// </summary>
public class UpdateMechanicRequest
{
    public string? Name { get; set; }
    public string? Title { get; set; }
    public string? Specialization { get; set; }
    public int? ExperienceYears { get; set; }
    public decimal? Rating { get; set; }
    public int? ReviewCount { get; set; }
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }
    public string? Status { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public int? AssignedBookingsCount { get; set; }
    public List<string>? Certifications { get; set; }
    public string? WorkingHours { get; set; }
}

