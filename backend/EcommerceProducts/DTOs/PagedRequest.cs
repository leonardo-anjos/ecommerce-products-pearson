namespace EcommerceProducts.DTOs;

public class PagedRequest
{
    private const int MaxPageSize = 50;
    private const int DefaultPageSize = 10;
    private const int DefaultPage = 1;

    private int _page = DefaultPage;
    private int _pageSize = DefaultPageSize;

    public int Page
    {
        get => _page;
        set => _page = value < 1 ? DefaultPage : value;
    }

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value < 1 ? DefaultPageSize : value > MaxPageSize ? MaxPageSize : value;
    }

    public string? Category { get; set; }

    public bool? IsActive { get; set; }

    public string? Name { get; set; }

    public decimal? MinPrice { get; set; }

    public decimal? MaxPrice { get; set; }

    public int? MinStock { get; set; }

    public int? MaxStock { get; set; }

    public string? OrderBy { get; set; }
}
