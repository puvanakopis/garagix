namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Payload submitted to register a vehicle for a customer.
/// </summary>
public class CreateVehicleRequest
{
    public string PlateNumber { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Type { get; set; } = "Sedan";
    public int? MileageKm { get; set; }
    public string? Vin { get; set; }
    public string? Color { get; set; }
}

