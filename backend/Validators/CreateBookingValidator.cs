using FluentValidation;
using Garagix.Api.DTOs.Requests;

namespace Garagix.Api.Validators;

/// <summary>
/// Fluent validation rules for <see cref="CreateBookingRequest"/>.
/// </summary>
public class CreateBookingValidator : AbstractValidator<CreateBookingRequest>
{
    public CreateBookingValidator()
    {
        RuleFor(x => x.CustomerName)
            .MaximumLength(120).WithMessage("Customer name cannot exceed 120 characters.");

        RuleFor(x => x.CustomerPhone)
            .MaximumLength(30).WithMessage("Phone number cannot exceed 30 characters.");

        RuleFor(x => x.CustomerEmail)
            .MaximumLength(150).WithMessage("Email cannot exceed 150 characters.")
            .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.CustomerEmail))
            .WithMessage("A valid email address is required.");

        RuleFor(x => x.Vehicle)
            .NotNull().WithMessage("Vehicle specifications are required.");

        When(x => x.Vehicle != null, () =>
        {
            RuleFor(x => x.Vehicle.PlateNumber)
                .MaximumLength(30).WithMessage("Plate number cannot exceed 30 characters.");

            RuleFor(x => x.Vehicle.Brand)
                .MaximumLength(60).WithMessage("Brand cannot exceed 60 characters.");

            RuleFor(x => x.Vehicle.Model)
                .MaximumLength(80).WithMessage("Model cannot exceed 80 characters.");

            RuleFor(x => x.Vehicle.Year)
                .InclusiveBetween(1970, 2030).When(x => x.Vehicle.Year > 0)
                .WithMessage("Vehicle year must be between 1970 and 2030.");
        });

        RuleFor(x => x.AppointmentDate)
            .NotEmpty().WithMessage("Appointment date is required.");

        RuleFor(x => x.AppointmentTime)
            .NotEmpty().WithMessage("Appointment time slot is required.");

        RuleFor(x => x.EstimatedPriceLkr)
            .GreaterThanOrEqualTo(0).WithMessage("Estimated price cannot be negative.");
    }
}

