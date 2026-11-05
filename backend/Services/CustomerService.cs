using Microsoft.EntityFrameworkCore;
using Garagix.Api.Common.Utilities;
using Garagix.Api.Data;
using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Entities;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Services;

/// <summary>
/// Business logic service implementing customer directory and vehicle operations.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="CustomerService"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="dbContext">Database context instance.</param>
/// <param name="logger">Application logging facility.</param>
public class CustomerService(
    ApplicationDbContext dbContext,
    ILogger<CustomerService> logger) : ICustomerService
{
    private readonly ApplicationDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
    private readonly ILogger<CustomerService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <inheritdoc />
    public async Task<IReadOnlyList<CustomerResponse>> GetAllCustomersAsync(
        string? status = null,
        string? search = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Users.AsNoTracking().Where(u => u.Role == "customer");

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("ALL", StringComparison.OrdinalIgnoreCase))
        {
            var st = status.Trim().ToLower();
            query = query.Where(u => u.Status.ToLower() == st);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(u =>
                u.Name.ToLower().Contains(term) ||
                u.Email.ToLower().Contains(term) ||
                u.Phone.ToLower().Contains(term));
        }

        var customers = await query
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync(cancellationToken);

        var customerIds = customers.Select(c => c.Id).ToList();
        var vehicles = await _dbContext.Vehicles
            .AsNoTracking()
            .Where(v => customerIds.Contains(v.CustomerId))
            .ToListAsync(cancellationToken);

        var vehicleMap = vehicles
            .GroupBy(v => v.CustomerId)
            .ToDictionary(g => g.Key, g => g.Select(MapToVehicleResponse).ToList());

        return customers.Select(c =>
        {
            vehicleMap.TryGetValue(c.Id, out var custVehicles);
            return MapToCustomerResponse(c, custVehicles ?? []);
        }).ToList();
    }

    /// <inheritdoc />
    public async Task<CustomerResponse?> GetCustomerByIdAsync(
        string id,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);

        var user = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id && u.Role == "customer", cancellationToken);

        if (user is null)
        {
            return null;
        }

        var vehicles = await _dbContext.Vehicles
            .AsNoTracking()
            .Where(v => v.CustomerId == id)
            .ToListAsync(cancellationToken);

        return MapToCustomerResponse(user, vehicles.Select(MapToVehicleResponse).ToList());
    }

    /// <inheritdoc />
    public async Task<CustomerResponse> CreateCustomerAsync(
        CreateCustomerRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var emailLower = request.Email.Trim().ToLower();
        var exists = await _dbContext.Users.AnyAsync(u => u.Email.ToLower() == emailLower, cancellationToken);
        if (exists)
        {
            throw new InvalidOperationException($"An account with email '{request.Email}' already exists.");
        }

        var plainPassword = string.IsNullOrWhiteSpace(request.Password) ? "Customer@123" : request.Password;

        var user = new User
        {
            Id = $"cust-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
            Name = request.Name.Trim(),
            Email = emailLower,
            Phone = request.Phone.Trim(),
            Address = request.Address?.Trim(),
            Role = "customer",
            TotalBookings = 0,
            Status = string.IsNullOrWhiteSpace(request.Status) ? "active" : request.Status.Trim().ToLower(),
            PasswordHash = PasswordHelper.HashPassword(plainPassword),
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.Users.AddAsync(user, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Registered new customer account {Name} ({Email}) with ID {Id}", user.Name, user.Email, user.Id);
        return MapToCustomerResponse(user, []);
    }

    /// <inheritdoc />
    public async Task<CustomerResponse?> UpdateCustomerAsync(
        string id,
        UpdateCustomerRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);
        ArgumentNullException.ThrowIfNull(request);

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Id == id && u.Role == "customer", cancellationToken);

        if (user is null)
        {
            return null;
        }

        if (!string.IsNullOrWhiteSpace(request.Name)) user.Name = request.Name.Trim();
        if (!string.IsNullOrWhiteSpace(request.Phone)) user.Phone = request.Phone.Trim();
        if (request.Address is not null) user.Address = request.Address.Trim();
        if (!string.IsNullOrWhiteSpace(request.Status)) user.Status = request.Status.Trim().ToLower();
        if (request.TotalBookings.HasValue) user.TotalBookings = request.TotalBookings.Value;

        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Updated customer profile for {Id} ({Name})", user.Id, user.Name);

        var vehicles = await _dbContext.Vehicles
            .AsNoTracking()
            .Where(v => v.CustomerId == id)
            .ToListAsync(cancellationToken);

        return MapToCustomerResponse(user, vehicles.Select(MapToVehicleResponse).ToList());
    }

    /// <inheritdoc />
    public async Task<CustomerResponse?> ToggleCustomerStatusAsync(
        string id,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Id == id && u.Role == "customer", cancellationToken);

        if (user is null)
        {
            return null;
        }

        user.Status = user.Status == "active" ? "inactive" : "active";
        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Toggled customer {Id} status to {Status}", user.Id, user.Status);

        var vehicles = await _dbContext.Vehicles
            .AsNoTracking()
            .Where(v => v.CustomerId == id)
            .ToListAsync(cancellationToken);

        return MapToCustomerResponse(user, vehicles.Select(MapToVehicleResponse).ToList());
    }

    /// <inheritdoc />
    public async Task<bool> DeleteCustomerAsync(
        string id,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Id == id && u.Role == "customer", cancellationToken);

        if (user is null)
        {
            return false;
        }

        var vehicles = await _dbContext.Vehicles.Where(v => v.CustomerId == id).ToListAsync(cancellationToken);
        if (vehicles.Count != 0)
        {
            _dbContext.Vehicles.RemoveRange(vehicles);
        }

        _dbContext.Users.Remove(user);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted customer {Id} ({Name}) and their registered vehicles", user.Id, user.Name);
        return true;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<VehicleResponse>> GetCustomerVehiclesAsync(
        string customerId,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(customerId);

        var vehicles = await _dbContext.Vehicles
            .AsNoTracking()
            .Where(v => v.CustomerId == customerId)
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync(cancellationToken);

        return vehicles.Select(MapToVehicleResponse).ToList();
    }

    /// <inheritdoc />
    public async Task<VehicleResponse> AddVehicleAsync(
        string customerId,
        CreateVehicleRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(customerId);
        ArgumentNullException.ThrowIfNull(request);

        var vehicle = new Vehicle
        {
            Id = $"veh-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
            CustomerId = customerId,
            PlateNumber = request.PlateNumber.Trim().ToUpperInvariant(),
            Brand = request.Brand.Trim(),
            Model = request.Model.Trim(),
            Year = request.Year,
            Type = string.IsNullOrWhiteSpace(request.Type) ? "Sedan" : request.Type.Trim(),
            MileageKm = request.MileageKm,
            Vin = request.Vin?.Trim().ToUpperInvariant(),
            Color = request.Color?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.Vehicles.AddAsync(vehicle, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Added vehicle {PlateNumber} ({Brand} {Model}) for customer {CustomerId}", vehicle.PlateNumber, vehicle.Brand, vehicle.Model, customerId);
        return MapToVehicleResponse(vehicle);
    }

    /// <inheritdoc />
    public async Task<bool> DeleteVehicleAsync(
        string customerId,
        string vehicleId,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(customerId);
        ArgumentException.ThrowIfNullOrWhiteSpace(vehicleId);

        var vehicle = await _dbContext.Vehicles
            .FirstOrDefaultAsync(v => v.Id == vehicleId && v.CustomerId == customerId, cancellationToken);

        if (vehicle is null)
        {
            return false;
        }

        _dbContext.Vehicles.Remove(vehicle);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Removed vehicle {VehicleId} from customer {CustomerId}", vehicleId, customerId);
        return true;
    }

    private static CustomerResponse MapToCustomerResponse(User u, List<VehicleResponse> vehicles)
    {
        return new CustomerResponse
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Phone = u.Phone,
            Address = u.Address,
            Role = u.Role,
            TotalBookings = u.TotalBookings,
            Status = u.Status,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt,
            Vehicles = vehicles
        };
    }

    private static VehicleResponse MapToVehicleResponse(Vehicle v)
    {
        return new VehicleResponse
        {
            Id = v.Id,
            CustomerId = v.CustomerId,
            PlateNumber = v.PlateNumber,
            Brand = v.Brand,
            Model = v.Model,
            Year = v.Year,
            Type = v.Type,
            MileageKm = v.MileageKm,
            Vin = v.Vin,
            Color = v.Color,
            CreatedAt = v.CreatedAt,
            UpdatedAt = v.UpdatedAt
        };
    }
}
