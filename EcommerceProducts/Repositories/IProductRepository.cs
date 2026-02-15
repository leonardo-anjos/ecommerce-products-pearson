using System.Linq.Expressions;
using EcommerceProducts.Models;

namespace EcommerceProducts.Repositories;

public interface IProductRepository
{
    Task<(IEnumerable<Product> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        Expression<Func<Product, bool>>? filter = null,
        CancellationToken cancellationToken = default);

    Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task AddAsync(Product product, CancellationToken cancellationToken = default);

    Task UpdateAsync(Product product, CancellationToken cancellationToken = default);

    Task DeleteAsync(Product product, CancellationToken cancellationToken = default);
}
