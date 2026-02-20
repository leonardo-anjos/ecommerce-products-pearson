using FluentValidation;
using Microsoft.EntityFrameworkCore;
using GenerativeAI;
using EcommerceProducts.Data;
using EcommerceProducts.Filters;
using EcommerceProducts.Repositories;
using EcommerceProducts.Services;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configurar Serilog
builder.Host.UseSerilog((ctx, lc) => lc
    .WriteTo.Console()
    .ReadFrom.Configuration(ctx.Configuration));

// Add services to the container.
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>();
});

// Disable default model state validation (handled by ValidationFilter)
builder.Services.Configure<Microsoft.AspNetCore.Mvc.ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Ecommerce Products API",
        Version = "v1",
        Description = "API para gerenciamento de produtos e queries de IA."
    });
});

// Configure Entity Framework Core with SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register FluentValidation validators
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Register Repository
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// Register Service
builder.Services.AddScoped<IProductService, ProductService>();

// Register Google Gemini GenerativeModel
var geminiApiKey = builder.Configuration["Gemini:ApiKey"] ?? string.Empty;
var geminiModel = builder.Configuration["Gemini:Model"] ?? "gemini-2.5-flash";
builder.Services.AddSingleton(new GenerativeModel(geminiApiKey, geminiModel));

// Register NL2SQL Service (Gemini AI agent)
builder.Services.AddScoped<INlToSqlService, NlToSqlService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Ecommerce Products API v1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseMiddleware<EcommerceProducts.Filters.GlobalExceptionMiddleware>();
app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();
