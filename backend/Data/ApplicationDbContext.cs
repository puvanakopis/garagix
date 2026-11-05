using Microsoft.EntityFrameworkCore;
using Garagix.Api.Entities;

namespace Garagix.Api.Data;

/// <summary>
/// Entity Framework Core database context for the Garagix application.
/// Manages user accounts and pending registrations awaiting email verification.
/// </summary>
public class ApplicationDbContext : DbContext
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ApplicationDbContext"/> class.
    /// </summary>
    /// <param name="options">Database context options.</param>
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    /// <summary>
    /// Gets the registered users database set.
    /// </summary>
    public DbSet<User> Users => Set<User>();

    /// <summary>
    /// Gets the pending registrations database set awaiting email OTP verification.
    /// </summary>
    public DbSet<PendingRegistration> PendingRegistrations => Set<PendingRegistration>();

    /// <summary>
    /// Gets the vehicle repair and maintenance services database set.
    /// </summary>
    public DbSet<ServiceItem> Services => Set<ServiceItem>();

    /// <inheritdoc />
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
