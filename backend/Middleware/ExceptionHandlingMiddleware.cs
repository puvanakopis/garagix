using System.Net;
using System.Text.Json;

namespace Garagix.Api.Middleware;

/// <summary>
/// Global exception handling middleware that catches unhandled errors and normalizes them into structured JSON responses.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="ExceptionHandlingMiddleware"/> class.
/// </remarks>
/// <param name="next">The next middleware delegate.</param>
/// <param name="logger">Logger for capturing unexpected server faults.</param>
public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    private readonly RequestDelegate _next = next ?? throw new ArgumentNullException(nameof(next));
    private readonly ILogger<ExceptionHandlingMiddleware> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <summary>
    /// Invokes the exception handling pipeline.
    /// </summary>
    /// <param name="context">Active HTTP context.</param>
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var statusCode = exception switch
        {
            BadHttpRequestException => (int)HttpStatusCode.BadRequest,
            UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
            KeyNotFoundException => (int)HttpStatusCode.NotFound,
            _ => (int)HttpStatusCode.InternalServerError
        };

        // Only log stack traces for actual unexpected 500 server errors
        if (statusCode >= 500)
        {
            _logger.LogError(exception, "Internal server error: {Message}", exception.Message);
        }

        var response = new
        {
            success = false,
            message = exception.Message,
            statusCode
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}
