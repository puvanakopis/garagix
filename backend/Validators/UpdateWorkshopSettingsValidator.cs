using FluentValidation;
using Garagix.Api.DTOs.Requests;

namespace Garagix.Api.Validators;

/// <summary>
/// Fluent validation rules for <see cref="UpdateWorkshopSettingsRequest"/>.
/// </summary>
public class UpdateWorkshopSettingsValidator : AbstractValidator<UpdateWorkshopSettingsRequest>
{
    public UpdateWorkshopSettingsValidator()
    {
        When(x => x.WorkshopName != null, () =>
        {
            RuleFor(x => x.WorkshopName)
                .NotEmpty().WithMessage("Workshop brand name cannot be empty.")
                .MaximumLength(150).WithMessage("Workshop name cannot exceed 150 characters.");
        });

        When(x => x.Email != null, () =>
        {
            RuleFor(x => x.Email)
                .EmailAddress().WithMessage("Please provide a valid email address.")
                .MaximumLength(150).WithMessage("Email cannot exceed 150 characters.");
        });

        When(x => x.Phone != null, () =>
        {
            RuleFor(x => x.Phone)
                .NotEmpty().WithMessage("Contact phone number cannot be empty.")
                .MaximumLength(30).WithMessage("Phone number cannot exceed 30 characters.");
        });

        When(x => x.SlotDurationMinutes.HasValue, () =>
        {
            RuleFor(x => x.SlotDurationMinutes!.Value)
                .GreaterThan(0).WithMessage("Slot duration must be greater than 0 minutes.")
                .LessThanOrEqualTo(480).WithMessage("Slot duration cannot exceed 480 minutes.");
        });

        When(x => x.ConcurrentHydraulicBays.HasValue, () =>
        {
            RuleFor(x => x.ConcurrentHydraulicBays!.Value)
                .GreaterThan(0).WithMessage("Workshop must have at least 1 hydraulic bay.")
                .LessThanOrEqualTo(100).WithMessage("Concurrent hydraulic bays cannot exceed 100.");
        });

        When(x => x.FreeCancellationHours.HasValue, () =>
        {
            RuleFor(x => x.FreeCancellationHours!.Value)
                .GreaterThanOrEqualTo(0).WithMessage("Cancellation window hours must be non-negative.");
        });

        When(x => x.MaxAdvanceBookingDays.HasValue, () =>
        {
            RuleFor(x => x.MaxAdvanceBookingDays!.Value)
                .GreaterThan(0).WithMessage("Advance booking window must be at least 1 day.")
                .LessThanOrEqualTo(365).WithMessage("Advance booking window cannot exceed 365 days.");
        });
    }
}

