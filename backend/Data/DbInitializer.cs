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
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "DbInitializer: Could not verify MySQL tables on startup. Ensure MySQL service is running.");
        }
    }
}

