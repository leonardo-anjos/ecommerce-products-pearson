using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using EcommerceProducts.Data;
using EcommerceProducts.Models;

namespace EcommerceProducts.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<Product> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        Expression<Func<Product, bool>>? filter = null,
        string? orderBy = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Products.AsNoTracking().AsQueryable();

        if (filter is not null)
        {
            query = query.Where(filter);
        }

        int totalCount = await query.CountAsync(cancellationToken);

        query = orderBy?.ToLowerInvariant() switch
        {
            "price" => query.OrderBy(p => p.Price),
            "pricedesc" => query.OrderByDescending(p => p.Price),
            "name" => query.OrderBy(p => p.Name),
            "namedesc" => query.OrderByDescending(p => p.Name),
            "stock" => query.OrderBy(p => p.StockQuantity),
            "stockdesc" => query.OrderByDescending(p => p.StockQuantity),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Products.FindAsync([id], cancellationToken);
    }

    public async Task AddAsync(Product product, CancellationToken cancellationToken = default)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Product product, CancellationToken cancellationToken = default)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Product product, CancellationToken cancellationToken = default)
    {
        _context.Products.Remove(product);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
