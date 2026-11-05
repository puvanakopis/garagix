namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Payload submitted by administrators to create a new vehicle service package.
/// </summary>
public class CreateServiceRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string Category { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string? FullDescription { get; set; }
    public decimal StartingPriceLkr { get; set; }
    public int DurationMinutes { get; set; }
    public bool? Featured { get; set; }
    public bool? IsActive { get; set; }
    public List<string>? IncludedItems { get; set; }
    public List<string>? CommonSymptoms { get; set; }
    public List<string>? RecommendedMechanicIds { get; set; }
}

