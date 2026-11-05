namespace Garagix.Api.DTOs.Responses;

/// <summary>
/// Vehicle data transfer object returned to client callers.
/// </summary>
public class VehicleResponse
{
    public string Id { get; set; } = string.Empty;
    public string CustomerId { get; set; } = string.Empty;
    public string PlateNumber { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Type { get; set; } = string.Empty;
    public int? MileageKm { get; set; }
    public string? Vin { get; set; }
    public string? Color { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

