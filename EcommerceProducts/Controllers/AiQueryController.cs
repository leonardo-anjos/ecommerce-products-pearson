using Microsoft.AspNetCore.Mvc;
using EcommerceProducts.DTOs;
using EcommerceProducts.Services;

namespace EcommerceProducts.Controllers;

[ApiController]
[Route("api/ai-query")]
public class AiQueryController : ControllerBase
{
    private readonly INlToSqlService _nlToSqlService;
    private readonly ILogger<AiQueryController> _logger;

    public AiQueryController(INlToSqlService nlToSqlService, ILogger<AiQueryController> logger)
    {
        _nlToSqlService = nlToSqlService;
        _logger = logger;
    }

    /// <summary>
    /// Receives a natural language question, uses an LLM to generate SQL,
    /// executes it against the database, and returns the results.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<AiQueryResponse>> Query(
        [FromBody] AiQueryRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Question))
        {
            return BadRequest(new { message = "The field 'question' is required." });
        }

        try
        {
            var result = await _nlToSqlService.ProcessAsync(request.Question, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "NL2SQL validation error for question: {Question}", request.Question);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "NL2SQL processing error for question: {Question}", request.Question);
            return StatusCode(500, new { message = "Failed to process your question. Please try again." });
        }
    }
}
