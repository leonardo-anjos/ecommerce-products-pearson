using System.Diagnostics;
using System.Text.RegularExpressions;
using GenerativeAI;
using GenerativeAI.Types;
using Microsoft.EntityFrameworkCore;
using EcommerceProducts.Data;
using EcommerceProducts.DTOs;

namespace EcommerceProducts.Services;

/// <summary>
/// NL2SQL service powered by Google Gemini.
/// Receives a natural language question, uses the LLM to generate a T-SQL
/// SELECT query, validates it for safety, executes it against SQL Server,
/// and returns the results.
/// </summary>
public sealed partial class NlToSqlService : INlToSqlService
{
    private const string SystemPrompt = """
        You are a T-SQL expert. Given a natural language question about products,
        generate a valid T-SQL SELECT query for Microsoft SQL Server.

        The database has a single table called "Products" with these columns:
        - Id (uniqueidentifier, PK)
        - Name (nvarchar(200), NOT NULL)
        - Description (nvarchar(1000), NULL)
        - Price (decimal(18,2), NOT NULL)
        - StockQuantity (int, NOT NULL)
        - Category (nvarchar(100), NULL)
        - ImageUrl (nvarchar(500), NULL)
        - IsActive (bit, NOT NULL, 1 = active, 0 = inactive)
        - CreatedAt (datetime2, NOT NULL)
        - UpdatedAt (datetime2, NULL)

        Rules:
        1. Only generate SELECT statements — never DELETE, UPDATE, INSERT, DROP, ALTER, CREATE, TRUNCATE, EXEC, or any DDL/DML.
        2. Only query the "Products" table.
        3. Always limit results with TOP 100.
        4. Return ONLY the raw SQL query — no markdown fences, no explanations, no comments.
        5. Use proper T-SQL syntax (e.g., TOP instead of LIMIT).
        6. For text searches, use LIKE with wildcards for partial match.
        """;

    private static readonly string[] ForbiddenKeywords =
    [
        "INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "CREATE", "TRUNCATE",
        "EXEC", "EXECUTE", "MERGE", "GRANT", "REVOKE", "DENY",
        "xp_", "sp_", "OPENROWSET", "OPENDATASOURCE", "BULK",
        "--", ";", "/*"
    ];

    private readonly GenerativeModel _model;
    private readonly AppDbContext _dbContext;
    private readonly ILogger<NlToSqlService> _logger;

    public NlToSqlService(GenerativeModel model, AppDbContext dbContext, ILogger<NlToSqlService> logger)
    {
        _model = model;
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<AiQueryResponse> ProcessAsync(string question, CancellationToken cancellationToken = default)
    {
        var stopwatch = Stopwatch.StartNew();

        // 1. Use Gemini to generate SQL from the natural language question
        string generatedSql = await GenerateSqlAsync(question, cancellationToken);

        // 2. Validate — only safe SELECT queries are allowed
        ValidateSql(generatedSql);

        // 3. Execute the SQL against the database
        var (columns, rows) = await ExecuteSqlAsync(generatedSql, cancellationToken);

        stopwatch.Stop();

        return new AiQueryResponse
        {
            Question = question,
            GeneratedSql = generatedSql,
            Columns = columns,
            Rows = rows,
            RowCount = rows.Count,
            ExecutionTimeMs = stopwatch.ElapsedMilliseconds
        };
    }

    // ── LLM call ─────────────────────────────────────────────────────

    private async Task<string> GenerateSqlAsync(string question, CancellationToken cancellationToken)
    {
        var request = new GenerateContentRequest
        {
            Contents = [new Content(question, "user")],
            SystemInstruction = new Content(SystemPrompt, "model"),
            GenerationConfig = new GenerationConfig
            {
                Temperature = 0f,
                MaxOutputTokens = 500
            }
        };

        GenerateContentResponse response = await _model.GenerateContentAsync(request, cancellationToken);

        string sql = response.Text?.Trim()
            ?? throw new InvalidOperationException("Gemini returned an empty response.");

        // Strip markdown code fences if the LLM wrapped the SQL
        sql = StripMarkdownFences().Replace(sql, "$1").Trim();

        _logger.LogInformation("NL2SQL — Question: {Question} | SQL: {Sql}", question, sql);

        return sql;
    }

    // ── SQL validation ───────────────────────────────────────────────

    private static void ValidateSql(string sql)
    {
        string upper = sql.ToUpperInvariant();

        if (!upper.TrimStart().StartsWith("SELECT"))
        {
            throw new InvalidOperationException("Only SELECT queries are allowed.");
        }

        foreach (string keyword in ForbiddenKeywords)
        {
            if (Regex.IsMatch(upper, $@"\b{keyword}\b"))
            {
                throw new InvalidOperationException($"Query contains a forbidden keyword: {keyword}");
            }
        }
    }

    // ── SQL execution ────────────────────────────────────────────────

    private async Task<(List<string> Columns, List<Dictionary<string, object?>> Rows)> ExecuteSqlAsync(
        string sql, CancellationToken cancellationToken)
    {
        var columns = new List<string>();
        var rows = new List<Dictionary<string, object?>>();

        var connection = _dbContext.Database.GetDbConnection();
        await _dbContext.Database.OpenConnectionAsync(cancellationToken);

        try
        {
            await using var command = connection.CreateCommand();
            command.CommandText = sql;
            command.CommandTimeout = 10;

            await using var reader = await command.ExecuteReaderAsync(cancellationToken);

            for (int i = 0; i < reader.FieldCount; i++)
            {
                columns.Add(reader.GetName(i));
            }

            int rowCount = 0;
            while (await reader.ReadAsync(cancellationToken) && rowCount < 100)
            {
                var row = new Dictionary<string, object?>();
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    row[columns[i]] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                }
                rows.Add(row);
                rowCount++;
            }
        }
        finally
        {
            await _dbContext.Database.CloseConnectionAsync();
        }

        return (columns, rows);
    }

    // ── Helpers ──────────────────────────────────────────────────────

    [GeneratedRegex(@"```(?:sql)?\s*([\s\S]*?)```", RegexOptions.IgnoreCase)]
    private static partial Regex StripMarkdownFences();
}
