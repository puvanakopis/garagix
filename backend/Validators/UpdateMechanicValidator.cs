using FluentValidation;
using Garagix.Api.DTOs.Requests;

namespace Garagix.Api.Validators;

/// <summary>
/// Fluent validation rules for <see cref="UpdateMechanicRequest"/>.
/// </summary>
public class UpdateMechanicValidator : AbstractValidator<UpdateMechanicRequest>
{
    public UpdateMechanicValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(120).WithMessage("Name cannot exceed 120 characters.")
            .When(x => !string.IsNullOrEmpty(x.Name));

        RuleFor(x => x.Title)
            .MaximumLength(150).WithMessage("Job title cannot exceed 150 characters.")
            .When(x => !string.IsNullOrEmpty(x.Title));

        RuleFor(x => x.Specialization)
            .MaximumLength(200).WithMessage("Specialization cannot exceed 200 characters.")
            .When(x => !string.IsNullOrEmpty(x.Specialization));

        RuleFor(x => x.ExperienceYears)
            .GreaterThanOrEqualTo(0).WithMessage("Experience years must be 0 or greater.")
            .When(x => x.ExperienceYears.HasValue);
    }
}

