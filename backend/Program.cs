using Garagix.Api.Data;
using Garagix.Api.Extensions;
using Garagix.Api.Middleware;

// Load .env file from current directory or parent directory
DotNetEnv.Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

// Configure port from .env if specified
var envPort = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(envPort) && string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ASPNETCORE_URLS")))
{
    builder.WebHost.UseUrls($"http://localhost:{envPort}");
}

// 1. Add Infrastructure & Application Services via Extensions
builder.Services.AddDatabaseConfiguration(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddCorsPolicy();
builder.Services.AddControllers();
builder.Services.AddSwaggerDocumentation();

var app = builder.Build();

// 2. Ensure MySQL Database is initialized on Startup
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        db.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogWarning(ex, "Could not connect to MySQL to run EnsureCreated. Please check your MySQL credentials in appsettings.json.");
    }
}

// 3. HTTP Request Pipeline & Middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Garagix API v1");
    });
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// Root endpoint for status / health check
app.MapGet("/", () => "Garagix API working...")
   .WithName("RootEndpoint")
   .WithTags("General");

app.MapControllers();

// Print backend URL banner in terminal once application starts
app.Lifetime.ApplicationStarted.Register(() =>
{
    var port = envPort ?? "5203";
    var address = app.Urls.FirstOrDefault() ?? $"http://localhost:{port}";
    
    Console.ForegroundColor = ConsoleColor.Cyan;
    Console.WriteLine();
    Console.WriteLine("==========================================================");
    Console.ForegroundColor = ConsoleColor.Green;
    Console.WriteLine("  🚀 Garagix API Backend is Running!");
    Console.ForegroundColor = ConsoleColor.White;
    Console.WriteLine($"  ➜ Local URL:        {address}");
    Console.WriteLine($"  ➜ Health Check:     {address}/");
    Console.WriteLine($"  ➜ Swagger API Docs: {address}/swagger");
    Console.ForegroundColor = ConsoleColor.Cyan;
    Console.WriteLine("==========================================================");
    Console.WriteLine();
    Console.ResetColor();
});

app.Run();
