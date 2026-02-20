using EcommerceProducts.DTOs;
using EcommerceProducts.Models;

namespace EcommerceProducts.Mappings;

public static class ProductMappings
{
    public static Product ToEntity(this CreateProductRequest request) => new()
    {
        Name = request.Name.Trim(),
        Description = request.Description?.Trim(),
        Price = request.Price,
        StockQuantity = request.StockQuantity,
        Category = request.Category?.Trim(),
        ImageUrl = request.ImageUrl?.Trim(),
        IsActive = true,
        CreatedAt = DateTime.UtcNow
    };

    public static void UpdateFrom(this Product product, UpdateProductRequest request)
    {
        if (request.Name is not null)
        {
            product.Name = request.Name.Trim();
        }

        if (request.Description is not null)
        {
            product.Description = request.Description.Trim();
        }

        if (request.Price.HasValue)
        {
            product.Price = request.Price.Value;
        }

        if (request.StockQuantity.HasValue)
        {
            product.StockQuantity = request.StockQuantity.Value;
        }

        if (request.Category is not null)
        {
            product.Category = request.Category.Trim();
        }

        if (request.ImageUrl is not null)
        {
            product.ImageUrl = request.ImageUrl.Trim();
        }

        if (request.IsActive.HasValue)
        {
            product.IsActive = request.IsActive.Value;
        }

        product.UpdatedAt = DateTime.UtcNow;
    }

    public static ProductResponse ToResponse(this Product product) => new()
    {
        Id = product.Id,
        Name = product.Name,
        Description = product.Description,
        Price = product.Price,
        StockQuantity = product.StockQuantity,
        Category = product.Category,
        ImageUrl = product.ImageUrl,
        IsActive = product.IsActive,
        CreatedAt = product.CreatedAt,
        UpdatedAt = product.UpdatedAt
    };
}
