using System.Linq.Expressions;
using EcommerceProducts.DTOs;
using EcommerceProducts.Mappings;
using EcommerceProducts.Models;
using EcommerceProducts.Repositories;

namespace EcommerceProducts.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _repository;

    public ProductService(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResponse<ProductResponse>> GetAllAsync(
        PagedRequest request,
        CancellationToken cancellationToken = default)
    {
        Expression<Func<Product, bool>>? filter = BuildFilter(request);

        var (items, totalCount) = await _repository.GetAllAsync(
            request.Page,
            request.PageSize,
            filter,
            cancellationToken);

        return new PagedResponse<ProductResponse>
        {
            Items = items.Select(p => p.ToResponse()),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };
    }

    public async Task<ProductResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await _repository.GetByIdAsync(id, cancellationToken);
        return product?.ToResponse();
    }

    public async Task<ProductResponse> CreateAsync(
        CreateProductRequest request,
        CancellationToken cancellationToken = default)
    {
        var product = request.ToEntity();
        await _repository.AddAsync(product, cancellationToken);
        return product.ToResponse();
    }

    public async Task<ProductResponse?> UpdateAsync(
        Guid id,
        UpdateProductRequest request,
        CancellationToken cancellationToken = default)
    {
        var product = await _repository.GetByIdAsync(id, cancellationToken);

        if (product is null)
        {
            return null;
        }

        product.UpdateFrom(request);
        await _repository.UpdateAsync(product, cancellationToken);
        return product.ToResponse();
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await _repository.GetByIdAsync(id, cancellationToken);

        if (product is null)
        {
            return false;
        }

        await _repository.DeleteAsync(product, cancellationToken);
        return true;
    }

    private static Expression<Func<Product, bool>>? BuildFilter(PagedRequest request)
    {
        var filters = new List<Expression<Func<Product, bool>>>();

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            filters.Add(p => p.Category == request.Category);
        }

        if (request.IsActive.HasValue)
        {
            filters.Add(p => p.IsActive == request.IsActive.Value);
        }

        if (filters.Count == 0)
        {
            return null;
        }

        // Combine filters with AND
        Expression<Func<Product, bool>> combined = filters[0];
        for (int i = 1; i < filters.Count; i++)
        {
            var parameter = Expression.Parameter(typeof(Product), "p");
            var body = Expression.AndAlso(
                Expression.Invoke(combined, parameter),
                Expression.Invoke(filters[i], parameter));
            combined = Expression.Lambda<Func<Product, bool>>(body, parameter);
        }

        return combined;
    }
}
