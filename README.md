# EcommerceProducts API

REST API for product management built with **C# 12**, **.NET 8**, **ASP.NET Core**, **Entity Framework Core** and **Microsoft SQL Server**.

---

## Tech Stack

| Technology | Version |
|---|---|
| .NET | 8.0 |
| C# | 12 |
| ASP.NET Core | 8.0 |
| Entity Framework Core | 8.0.x |
| SQL Server | 2022 (Docker) |
| Swagger / OpenAPI | Swashbuckle 6.6.2 |

---

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Docker](https://www.docker.com/get-started)
- [dotnet-ef CLI tool](https://learn.microsoft.com/en-us/ef/core/cli/dotnet) (`dotnet tool install --global dotnet-ef`)

---

## Getting Started

### 1. Start the Database

From the project root directory:

```bash
docker compose up -d
```

This starts a **SQL Server 2022 Developer Edition** container with the following configuration:

| Setting | Value |
|---|---|
| Container Name | `ecommerce-sqlserver` |
| Port | `1433` |
| User | `sa` |
| Password | `SqlServer@2024!` |
| Volume | `sqlserver-data` (persistent) |

### 2. Apply Migrations

```bash
cd EcommerceProducts
dotnet ef database update
```

### 3. Run the Application

```bash
dotnet run
```

The API will be available at: **http://localhost:5079**

Swagger UI: **http://localhost:5079/swagger**

---

## Project Structure

```
EcommerceProducts/
├── Controllers/
│   └── ProductsController.cs       # API endpoints (CRUD)
├── Data/
│   └── AppDbContext.cs              # EF Core DbContext
├── DTOs/
│   ├── CreateProductRequest.cs      # Create request DTO
│   ├── UpdateProductRequest.cs      # Update request DTO
│   └── ProductResponse.cs           # Response DTO
├── Migrations/                      # EF Core migrations
├── Models/
│   └── Product.cs                   # Product entity
├── Properties/
│   └── launchSettings.json          # Launch configuration
├── appsettings.json                 # App settings & connection string
├── EcommerceProducts.csproj         # Project file
└── Program.cs                       # Application entry point
```

---

## API Endpoints

Base URL: `http://localhost:5079/api/products`

### Get All Products

```
GET /api/products
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `category` | string | No | Filter by category |
| `isActive` | bool | No | Filter by active status |

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 1299.99,
    "stockQuantity": 50,
    "category": "Electronics",
    "imageUrl": "https://example.com/laptop.jpg",
    "isActive": true,
    "createdAt": "2026-02-15T18:00:00Z",
    "updatedAt": null
  }
]
```

---

### Get Product by ID

```
GET /api/products/{id}
```

**Response:** `200 OK` or `404 Not Found`

```json
{
  "id": 1,
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 1299.99,
  "stockQuantity": 50,
  "category": "Electronics",
  "imageUrl": "https://example.com/laptop.jpg",
  "isActive": true,
  "createdAt": "2026-02-15T18:00:00Z",
  "updatedAt": null
}
```

---

### Create Product

```
POST /api/products
```

**Request Body:**

```json
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 1299.99,
  "stockQuantity": 50,
  "category": "Electronics",
  "imageUrl": "https://example.com/laptop.jpg"
}
```

**Validation Rules:**

| Field | Rules |
|---|---|
| `name` | Required, 1-200 characters |
| `description` | Optional, max 1000 characters |
| `price` | Required, must be > 0 |
| `stockQuantity` | Required, must be >= 0 |
| `category` | Optional, max 100 characters |
| `imageUrl` | Optional, max 500 characters |

**Response:** `201 Created` with the created product in the body and `Location` header.

---

### Update Product

```
PUT /api/products/{id}
```

**Request Body:**

```json
{
  "name": "Laptop Pro",
  "description": "Updated high-performance laptop",
  "price": 1499.99,
  "stockQuantity": 45,
  "category": "Electronics",
  "imageUrl": "https://example.com/laptop-pro.jpg",
  "isActive": true
}
```

**Response:** `200 OK` or `404 Not Found`

---

### Delete Product

```
DELETE /api/products/{id}
```

**Response:** `204 No Content` or `404 Not Found`

---

## Database Schema

### Products Table

| Column | Type | Constraints |
|---|---|---|
| `Id` | `int` | Primary Key, Identity |
| `Name` | `nvarchar(200)` | Not Null, Indexed |
| `Description` | `nvarchar(1000)` | Nullable |
| `Price` | `decimal(18,2)` | Not Null |
| `StockQuantity` | `int` | Not Null |
| `Category` | `nvarchar(100)` | Nullable, Indexed |
| `ImageUrl` | `nvarchar(500)` | Nullable |
| `IsActive` | `bit` | Not Null, Default: `true` |
| `CreatedAt` | `datetime2` | Not Null |
| `UpdatedAt` | `datetime2` | Nullable |

---

## Useful Commands

```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# Stop database and remove data
docker compose down -v

# Create a new migration
dotnet ef migrations add <MigrationName>

# Apply migrations
dotnet ef database update

# Remove last migration
dotnet ef migrations remove

# Run the application
dotnet run

# Build the project
dotnet build
```

---

## Connection String

Configured in `appsettings.json`:

```
Server=localhost,1433;Database=EcommerceProductsDb;User Id=sa;Password=SqlServer@2024!;TrustServerCertificate=True
```
