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
            .NotEmpty().WithMessage("Customer name is required.")
            .MaximumLength(120).WithMessage("Customer name cannot exceed 120 characters.");

        RuleFor(x => x.CustomerPhone)
            .NotEmpty().WithMessage("Contact phone number is required.")
            .MaximumLength(30).WithMessage("Phone number cannot exceed 30 characters.");

        RuleFor(x => x.CustomerEmail)
            .NotEmpty().WithMessage("Email address is required.")
            .EmailAddress().WithMessage("A valid email address is required.")
            .MaximumLength(150).WithMessage("Email cannot exceed 150 characters.");

        RuleFor(x => x.Vehicle)
            .NotNull().WithMessage("Vehicle specifications are required.");

        When(x => x.Vehicle != null, () =>
        {
            RuleFor(x => x.Vehicle.PlateNumber)
                .NotEmpty().WithMessage("Vehicle license plate number is required.")
                .MaximumLength(30).WithMessage("Plate number cannot exceed 30 characters.");

            RuleFor(x => x.Vehicle.Brand)
                .NotEmpty().WithMessage("Vehicle brand is required.")
                .MaximumLength(60).WithMessage("Brand cannot exceed 60 characters.");

            RuleFor(x => x.Vehicle.Model)
                .NotEmpty().WithMessage("Vehicle model is required.")
                .MaximumLength(80).WithMessage("Model cannot exceed 80 characters.");

            RuleFor(x => x.Vehicle.Year)
                .InclusiveBetween(1970, 2030).WithMessage("Vehicle year must be between 1970 and 2030.");
        });

        RuleFor(x => x.AppointmentDate)
            .NotEmpty().WithMessage("Appointment date is required.");

        RuleFor(x => x.AppointmentTime)
            .NotEmpty().WithMessage("Appointment time slot is required.");

        RuleFor(x => x.EstimatedPriceLkr)
            .GreaterThanOrEqualTo(0).WithMessage("Estimated price cannot be negative.");
    }
}
