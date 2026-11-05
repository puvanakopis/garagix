using System.Diagnostics;
using System.Net;

namespace Garagix.Api.Middleware;

/// <summary>
/// Middleware that intercepts incoming HTTP requests and outputs concise, clean, color-coded API call logs
/// directly to the terminal showing HTTP Method, Endpoint Path, HTTP Status Code, and Processing Time.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="RequestLoggingMiddleware"/> class using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="next">The subsequent request delegate in the execution pipeline.</param>
public class RequestLoggingMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next ?? throw new ArgumentNullException(nameof(next));

    /// <summary>
    /// Intercepts and records the calling API and its execution outcome.
    /// </summary>
    /// <param name="context">Active HTTP context.</param>
    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.Value ?? string.Empty;

        // Skip internal Swagger assets and favicon to keep terminal completely uncluttered
        if ((path.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase) && 
             (path.EndsWith(".js", StringComparison.OrdinalIgnoreCase) || 
              path.EndsWith(".css", StringComparison.OrdinalIgnoreCase) || 
              path.EndsWith(".png", StringComparison.OrdinalIgnoreCase))) ||
            path.Equals("/favicon.ico", StringComparison.OrdinalIgnoreCase))
        {
            await _next(context);
            return;
        }

        var stopwatch = Stopwatch.StartNew();

        try
        {
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();
            PrintApiCallSummary(context, stopwatch.ElapsedMilliseconds);
        }
    }

    private static void PrintApiCallSummary(HttpContext context, long elapsedMs)
    {
        var timestamp = DateTime.Now.ToString("HH:mm:ss");
        var method = context.Request.Method;
        var fullPath = $"{context.Request.Path}{context.Request.QueryString}";
        var statusCode = context.Response.StatusCode;
        var statusName = Enum.IsDefined(typeof(HttpStatusCode), statusCode)
            ? ((HttpStatusCode)statusCode).ToString()
            : string.Empty;

        lock (Console.Out)
        {
            Console.ForegroundColor = ConsoleColor.DarkGray;
            Console.Write($"[{timestamp}] ");

            Console.ForegroundColor = method switch
            {
                "GET" => ConsoleColor.Cyan,
                "POST" => ConsoleColor.Green,
                "PUT" => ConsoleColor.Yellow,
                "PATCH" => ConsoleColor.Magenta,
                "DELETE" => ConsoleColor.Red,
                _ => ConsoleColor.White
            };
            Console.Write($"[{method}] ");

            Console.ForegroundColor = ConsoleColor.White;
            Console.Write($"{fullPath} ");

            Console.ForegroundColor = ConsoleColor.DarkGray;
            Console.Write("-> ");

            Console.ForegroundColor = statusCode switch
            {
                >= 200 and < 300 => ConsoleColor.Green,
                >= 300 and < 400 => ConsoleColor.Cyan,
                >= 400 and < 500 => ConsoleColor.Yellow,
                _ => ConsoleColor.Red
            };
            Console.Write($"{statusCode} {statusName} ");

            Console.ForegroundColor = ConsoleColor.DarkGray;
            Console.WriteLine($"({elapsedMs}ms)");

            Console.ResetColor();
        }
    }
}
