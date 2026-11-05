using Microsoft.EntityFrameworkCore;

namespace Garagix.Api.Data;

/// <summary>
/// Provides startup initialization utilities to guarantee MySQL schema and table readiness.
/// </summary>
public static class DbInitializer
{
    /// <summary>
    /// Ensures database existence and executes schema migrations or table creation scripts.
    /// </summary>
    /// <param name="context">The database context instance.</param>
    /// <param name="logger">Logger for recording database provisioning activity.</param>
    public static async Task InitializeAsync(ApplicationDbContext context, ILogger logger)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(logger);

        try
        {
            await context.Database.EnsureCreatedAsync();

            // Explicitly ensure the pending_registrations table exists even if database was previously provisioned
            const string createPendingRegistrationsTableSql = """
                CREATE TABLE IF NOT EXISTS `pending_registrations` (
                    `Id` VARCHAR(50) NOT NULL PRIMARY KEY,
                    `FullName` VARCHAR(100) NOT NULL,
                    `Email` VARCHAR(150) NOT NULL,
                    `Phone` VARCHAR(20) NOT NULL,
                    `Address` VARCHAR(250) NULL,
                    `PasswordHash` VARCHAR(255) NOT NULL,
                    `Role` VARCHAR(20) NOT NULL DEFAULT 'customer',
                    `Otp` VARCHAR(10) NOT NULL,
                    `OtpExpiry` DATETIME(6) NOT NULL,
                    `CreatedAt` DATETIME(6) NOT NULL,
                    INDEX `IX_pending_registrations_Email` (`Email`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                """;

            await context.Database.ExecuteSqlRawAsync(createPendingRegistrationsTableSql);
            logger.LogInformation("Database schema initialized and pending_registrations table verified.");

            // Explicitly ensure the services table exists
            const string createServicesTableSql = """
                CREATE TABLE IF NOT EXISTS `services` (
                    `Id` VARCHAR(50) NOT NULL PRIMARY KEY,
                    `Name` VARCHAR(150) NOT NULL,
                    `Slug` VARCHAR(150) NOT NULL,
                    `Category` VARCHAR(50) NOT NULL,
                    `ShortDescription` VARCHAR(500) NOT NULL,
                    `FullDescription` LONGTEXT NOT NULL,
                    `StartingPriceLkr` DECIMAL(12,2) NOT NULL DEFAULT 0,
                    `DurationMinutes` INT NOT NULL DEFAULT 0,
                    `Featured` TINYINT(1) NOT NULL DEFAULT 0,
                    `IsActive` TINYINT(1) NOT NULL DEFAULT 1,
                    `IncludedItems` LONGTEXT NULL,
                    `CommonSymptoms` LONGTEXT NULL,
                    `RecommendedMechanicIds` LONGTEXT NULL,
                    `CreatedAt` DATETIME(6) NOT NULL,
                    `UpdatedAt` DATETIME(6) NULL,
                    UNIQUE INDEX `IX_services_Slug` (`Slug`),
                    INDEX `IX_services_Category` (`Category`),
                    INDEX `IX_services_IsActive` (`IsActive`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                """;

            await context.Database.ExecuteSqlRawAsync(createServicesTableSql);
            logger.LogInformation("Database schema initialized and services table verified.");

            // Ensure legacy ImageUrl column in MySQL is nullable so inserts without ImageUrl succeed
            try
            {
                await context.Database.ExecuteSqlRawAsync("ALTER TABLE `services` MODIFY COLUMN `ImageUrl` LONGTEXT NULL DEFAULT NULL;");
            }
            catch
            {
                // Ignored if column does not exist or was already modified
            }

            // Seed services if table is empty
            if (!await context.Services.AnyAsync())
            {
                var initialServices = Configurations.ServiceItemConfiguration.GetInitialServices();
                await context.Services.AddRangeAsync(initialServices);
                await context.SaveChangesAsync();
                logger.LogInformation("Pre-seeded {Count} initial vehicle service packages into database.", initialServices.Count);
            }

            // Explicitly ensure the mechanics table exists
            const string createMechanicsTableSql = """
                CREATE TABLE IF NOT EXISTS `mechanics` (
                    `Id` VARCHAR(50) NOT NULL PRIMARY KEY,
                    `Name` VARCHAR(120) NOT NULL,
                    `Title` VARCHAR(150) NOT NULL,
                    `Specialization` VARCHAR(200) NOT NULL,
                    `ExperienceYears` INT NOT NULL DEFAULT 1,
                    `Rating` DECIMAL(3,1) NOT NULL DEFAULT 5.0,
                    `ReviewCount` INT NOT NULL DEFAULT 0,
                    `Bio` LONGTEXT NULL,
                    `ImageUrl` VARCHAR(500) NULL,
                    `Status` VARCHAR(20) NOT NULL DEFAULT 'available',
                    `Phone` VARCHAR(30) NULL,
                    `Email` VARCHAR(150) NULL,
                    `AssignedBookingsCount` INT NOT NULL DEFAULT 0,
                    `Certifications` LONGTEXT NULL,
                    `WorkingHours` VARCHAR(100) NOT NULL DEFAULT '8:00 AM - 5:30 PM (Mon - Sat)',
                    `SocialsJson` LONGTEXT NULL,
                    `CreatedAt` DATETIME(6) NOT NULL,
                    `UpdatedAt` DATETIME(6) NULL,
                    INDEX `IX_mechanics_Status` (`Status`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                """;

            await context.Database.ExecuteSqlRawAsync(createMechanicsTableSql);
            logger.LogInformation("Database schema initialized and mechanics table verified.");

            // Seed mechanics if table is empty
            if (!await context.Mechanics.AnyAsync())
            {
                var initialMechanics = Configurations.MechanicConfiguration.GetInitialMechanics();
                await context.Mechanics.AddRangeAsync(initialMechanics);
                await context.SaveChangesAsync();
                logger.LogInformation("Pre-seeded {Count} initial master technicians into database.", initialMechanics.Count);
            }

            // Explicitly ensure the vehicles table exists
            const string createVehiclesTableSql = """
                CREATE TABLE IF NOT EXISTS `vehicles` (
                    `Id` VARCHAR(50) NOT NULL PRIMARY KEY,
                    `CustomerId` VARCHAR(50) NOT NULL,
                    `PlateNumber` VARCHAR(30) NOT NULL,
                    `Brand` VARCHAR(60) NOT NULL,
                    `Model` VARCHAR(80) NOT NULL,
                    `Year` INT NOT NULL,
                    `Type` VARCHAR(40) NOT NULL DEFAULT 'Sedan',
                    `MileageKm` INT NULL,
                    `Vin` VARCHAR(50) NULL,
                    `Color` VARCHAR(50) NULL,
                    `CreatedAt` DATETIME(6) NOT NULL,
                    `UpdatedAt` DATETIME(6) NULL,
                    INDEX `IX_vehicles_CustomerId` (`CustomerId`),
                    INDEX `IX_vehicles_PlateNumber` (`PlateNumber`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                """;

            await context.Database.ExecuteSqlRawAsync(createVehiclesTableSql);
            logger.LogInformation("Database schema initialized and vehicles table verified.");

            // Seed initial vehicles if table is empty
            if (!await context.Vehicles.AnyAsync())
            {
                var initialVehicles = Configurations.VehicleConfiguration.GetInitialVehicles();
                await context.Vehicles.AddRangeAsync(initialVehicles);
                await context.SaveChangesAsync();
                logger.LogInformation("Pre-seeded {Count} customer vehicles into database.", initialVehicles.Count);
            }

            // Ensure directory customers (cust-102 to cust-105) exist in users table
            var seedCustomers = new (string Id, string Name, string Email, string Phone, string Address, int Bookings, string CreatedDate)[]
            {
                ("cust-102", "Malini De Silva", "malini.desilva@gmail.com", "+94 71 456 7890", "No. 18, Queen's Road, Colombo 03", 5, "2023-07-15"),
                ("cust-103", "Dhanushka Wickrama", "dhanushka.w@yahoo.com", "+94 76 778 8990", "No. 102/3, Havelock Road, Colombo 05", 2, "2024-01-10"),
                ("cust-104", "Ajantha Fernando", "ajantha.f@gmail.com", "+94 77 334 4556", "No. 55, Galle Road, Mount Lavinia", 1, "2024-05-20"),
                ("cust-105", "Ruvini Jayasekara", "ruvini.j@outlook.com", "+94 71 223 3445", "No. 89, Kandy Road, Kadawatha", 4, "2023-08-05")
            };

            foreach (var sc in seedCustomers)
            {
                if (!await context.Users.AnyAsync(u => u.Id == sc.Id || u.Email == sc.Email))
                {
                    context.Users.Add(new Entities.User
                    {
                        Id = sc.Id,
                        Name = sc.Name,
                        Email = sc.Email,
                        Phone = sc.Phone,
                        Address = sc.Address,
                        Role = "customer",
                        TotalBookings = sc.Bookings,
                        Status = "active",
                        PasswordHash = Common.Utilities.PasswordHelper.HashPassword("Customer@123"),
                        CreatedAt = DateTime.Parse(sc.CreatedDate, System.Globalization.CultureInfo.InvariantCulture)
                    });
                }
            }
            await context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "DbInitializer: Could not verify MySQL tables on startup. Ensure MySQL service is running.");
        }
    }
}

