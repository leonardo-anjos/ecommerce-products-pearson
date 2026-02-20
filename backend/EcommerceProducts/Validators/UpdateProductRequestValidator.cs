using FluentValidation;
using EcommerceProducts.DTOs;

namespace EcommerceProducts.Validators;

public class UpdateProductRequestValidator : AbstractValidator<UpdateProductRequest>
{
    public UpdateProductRequestValidator()
    {
        RuleFor(x => x.Name)
            .Length(2, 200).WithMessage("The field 'name' must be between 2 and 200 characters.")
            .When(x => x.Name is not null);

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("The field 'description' cannot exceed 1000 characters.")
            .When(x => x.Description is not null);

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("The field 'price' must be greater than zero.")
            .LessThanOrEqualTo(999_999_999.99m).WithMessage("The field 'price' cannot exceed 999,999,999.99.")
            .When(x => x.Price.HasValue);

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0).WithMessage("The field 'stockQuantity' cannot be negative.")
            .When(x => x.StockQuantity.HasValue);

        RuleFor(x => x.Category)
            .Length(2, 100).WithMessage("The field 'category' must be between 2 and 100 characters.")
            .When(x => x.Category is not null);

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500).WithMessage("The field 'imageUrl' cannot exceed 500 characters.")
            .Must(BeAValidUrl).WithMessage("The field 'imageUrl' must be a valid URL.")
            .When(x => x.ImageUrl is not null);
    }

    private static bool BeAValidUrl(string? url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var result)
            && (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
    }
}
