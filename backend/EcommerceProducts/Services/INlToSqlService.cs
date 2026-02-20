using EcommerceProducts.DTOs;

namespace EcommerceProducts.Services;

public interface INlToSqlService
{
    Task<AiQueryResponse> ProcessAsync(string question, CancellationToken cancellationToken = default);
}
