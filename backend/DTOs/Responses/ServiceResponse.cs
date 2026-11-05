namespace Garagix.Api.DTOs.Responses;

/// <summary>
/// Service package data transfer object returned to client callers.
/// </summary>
public class ServiceResponse
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public decimal StartingPriceLkr { get; set; }
    public int DurationMinutes { get; set; }
    public bool Featured { get; set; }
    public bool IsActive { get; set; }
    public List<string> IncludedItems { get; set; } = [];
    public List<string> CommonSymptoms { get; set; } = [];
    public List<string>? RecommendedMechanicIds { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

