using FluentValidation;
using Garagix.Api.DTOs.Requests;

namespace Garagix.Api.Validators;

/// <summary>
/// Fluent validation rules for <see cref="CreateVehicleRequest"/>.
/// </summary>
public class CreateVehicleValidator : AbstractValidator<CreateVehicleRequest>
{
    public CreateVehicleValidator()
    {
        RuleFor(x => x.PlateNumber)
            .NotEmpty().WithMessage("License plate number is required.")
            .MaximumLength(30).WithMessage("Plate number cannot exceed 30 characters.");

        RuleFor(x => x.Brand)
            .NotEmpty().WithMessage("Vehicle make/brand is required.")
            .MaximumLength(60).WithMessage("Brand cannot exceed 60 characters.");

        RuleFor(x => x.Model)
            .NotEmpty().WithMessage("Vehicle model is required.")
            .MaximumLength(80).WithMessage("Model cannot exceed 80 characters.");

        RuleFor(x => x.Year)
            .InclusiveBetween(1970, DateTime.UtcNow.Year + 1)
            .WithMessage($"Year must be between 1970 and {DateTime.UtcNow.Year + 1}.");
    }
}

