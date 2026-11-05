using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Controllers;

/// <summary>
/// Handles authentication endpoints including customer registration with email OTP verification,
/// user login, password recovery, and authenticated profile lookup.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="AuthController"/> class using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="authService">The authentication business logic service.</param>
[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    private readonly IAuthService _authService = authService ?? throw new ArgumentNullException(nameof(authService));

    /// <summary>
    /// Step 1: Dispatches a 6-digit OTP verification code to the customer's email address
    /// after validating registration form fields and ensuring the email is unique.
    /// </summary>
    /// <param name="request">Customer registration data transfer object.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Confirmation message indicating the code was sent.</returns>
    /// <response code="200">OTP code dispatched successfully.</response>
    /// <response code="400">If validation fails or email is already registered.</response>
    [HttpPost("register/send-otp")]
    [HttpPost("send-registration-otp")]
    [ProducesResponseType(typeof(RegistrationOtpResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RegistrationOtpResponse>> SendRegistrationOtp(
        [FromBody] SendRegistrationOtpRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _authService.SendRegistrationOtpAsync(request, cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Step 2: Validates the 6-digit email OTP and provisions the new customer account in the database.
    /// Only when the OTP is confirmed valid and non-expired will the user account be created.
    /// </summary>
    /// <param name="request">Email address and 6-digit OTP code.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The newly created user profile and initial JWT bearer token.</returns>
    /// <response code="200">OTP verified and account created successfully.</response>
    /// <response code="400">If the OTP is invalid, expired, or registration was not initiated.</response>
    [HttpPost("register/verify-otp")]
    [HttpPost("verify-registration-otp")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponse>> VerifyRegistrationOtp(
        [FromBody] VerifyRegistrationOtpRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _authService.VerifyRegistrationOtpAsync(request, cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Customer account registration endpoint.
    /// If an OTP code is included in the payload, verifies the code and creates the account.
    /// If no OTP code is provided, generates and emails the verification OTP to the customer.
    /// </summary>
    /// <param name="request">Customer registration payload with optional OTP.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Authentication response containing JWT session or OTP dispatch confirmation.</returns>
    /// <response code="200">Registration completed or verification OTP dispatched.</response>
    /// <response code="400">If validation fails or credentials are invalid.</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponse>> Register(
        [FromBody] RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _authService.RegisterAsync(request, cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Authenticates a customer or administrator with email and password.
    /// </summary>
    /// <param name="request">Credentials and optional remember-me flag.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Signed JWT bearer token and user profile.</returns>
    /// <response code="200">Authentication successful, JWT token issued.</response>
    /// <response code="401">Invalid credentials or account is inactive.</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponse>> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _authService.LoginAsync(request, cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Step 1 of Password Reset: Initiates password recovery by requesting a 6-digit OTP code to the registered email.
    /// </summary>
    /// <param name="request">Email request for password recovery.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Confirmation message and OTP code (in development mode).</returns>
    /// <response code="200">OTP code generated and dispatched.</response>
    /// <response code="400">If email address is missing or invalid.</response>
    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(ForgotPasswordResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ForgotPasswordResponse>> ForgotPassword(
        [FromBody] ForgotPasswordRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _authService.ForgotPasswordAsync(request, cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Step 2 of Password Reset: Validates the 6-digit password recovery OTP code.
    /// </summary>
    /// <param name="request">Email and OTP verification request.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Verification status confirmation.</returns>
    /// <response code="200">OTP code verified successfully.</response>
    /// <response code="400">Invalid or expired OTP code.</response>
    [HttpPost("verify-otp")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> VerifyOtp(
        [FromBody] VerifyOtpRequest request,
        CancellationToken cancellationToken)
    {
        var isValid = await _authService.VerifyOtpAsync(request, cancellationToken);
        return Ok(new
        {
            success = isValid,
            message = "OTP verification code confirmed successfully."
        });
    }

    /// <summary>
    /// Step 3 of Password Reset: Completes password reset with new credentials.
    /// </summary>
    /// <param name="request">Password reset payload with email, valid OTP, and new password.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Confirmation of updated credentials.</returns>
    /// <response code="200">Password reset successful.</response>
    /// <response code="400">Invalid code or mismatched password parameters.</response>
    [HttpPost("reset-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword(
        [FromBody] ResetPasswordRequest request,
        CancellationToken cancellationToken)
    {
        var success = await _authService.ResetPasswordAsync(request, cancellationToken);
        return Ok(new
        {
            success,
            message = "Your password has been successfully reset. You may now sign in."
        });
    }

    /// <summary>
    /// Retrieves the profile of the currently authenticated user from the JWT Bearer token claims.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The authenticated user profile details.</returns>
    /// <response code="200">Returns the authenticated user details.</response>
    /// <response code="401">If the request is unauthenticated or token claims are missing.</response>
    /// <response code="404">If the user associated with the token cannot be found.</response>
    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserResponse>> GetCurrentUser(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { success = false, message = "User not identified in token." });
        }

        var user = await _authService.GetCurrentUserAsync(userId, cancellationToken);
        if (user == null)
        {
            return NotFound(new { success = false, message = "User record not found." });
        }

        return Ok(user);
    }
}
