using System.ComponentModel.DataAnnotations;

namespace EcommerceProducts.DTOs;

public class CreateProductRequest
{
    [Required(ErrorMessage = "The field 'name' is required.")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "The field 'name' must be between 2 and 200 characters.")]
    public string Name { get; set; } = string.Empty;

    [StringLength(1000, ErrorMessage = "The field 'description' cannot exceed 1000 characters.")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "The field 'price' is required.")]
    [Range(0.01, 999999999.99, ErrorMessage = "The field 'price' must be between 0.01 and 999,999,999.99.")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "The field 'stockQuantity' is required.")]
    [Range(0, int.MaxValue, ErrorMessage = "The field 'stockQuantity' cannot be negative.")]
    public int StockQuantity { get; set; }

    [StringLength(100, MinimumLength = 2, ErrorMessage = "The field 'category' must be between 2 and 100 characters.")]
    public string? Category { get; set; }

    [StringLength(500, ErrorMessage = "The field 'imageUrl' cannot exceed 500 characters.")]
    [Url(ErrorMessage = "The field 'imageUrl' must be a valid URL.")]
    public string? ImageUrl { get; set; }
}
