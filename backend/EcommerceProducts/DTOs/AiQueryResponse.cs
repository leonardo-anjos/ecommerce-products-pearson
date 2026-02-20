namespace EcommerceProducts.DTOs;

public class AiQueryResponse
{
    public string Question { get; set; } = string.Empty;
    public string GeneratedSql { get; set; } = string.Empty;
    public IEnumerable<string> Columns { get; set; } = [];
    public IEnumerable<IDictionary<string, object?>> Rows { get; set; } = [];
    public int RowCount { get; set; }
    public long ExecutionTimeMs { get; set; }
}
