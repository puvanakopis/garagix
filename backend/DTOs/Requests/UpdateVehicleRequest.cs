namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Payload submitted to update details of a customer vehicle.
/// </summary>
public class UpdateVehicleRequest
{
    public string? PlateNumber { get; set; }
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public int? Year { get; set; }
    public string? Type { get; set; }
    public int? MileageKm { get; set; }
    public string? Vin { get; set; }
    public string? Color { get; set; }
}

