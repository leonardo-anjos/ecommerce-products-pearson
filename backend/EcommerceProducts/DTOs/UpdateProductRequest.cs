namespace EcommerceProducts.DTOs;

public class UpdateProductRequest
{
    public string? Name { get; set; }

    public string? Description { get; set; }

    public decimal? Price { get; set; }

    public int? StockQuantity { get; set; }

    public string? Category { get; set; }

    public string? ImageUrl { get; set; }

    public bool? IsActive { get; set; }
}
