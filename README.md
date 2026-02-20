# EcommerceProducts API

Full-stack e-commerce products management application with **AI-powered search**. Built with **.NET 8** backend, **Next.js** frontend, and **SQL Server** database.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Backend** | .NET / ASP.NET Core | 8.0 |
| **Language** | C# | 12 |
| **Database** | SQL Server | 2022 |
| **ORM** | Entity Framework Core | 8.0.x |
| **Frontend** | Next.js / React | Latest |
| **Language** | TypeScript | Latest |
| **Styling** | Tailwind CSS | Latest |
| **API Docs** | Swagger / OpenAPI | Swashbuckle 6.6.2 |
| **AI Integration** | Google Gemini API | 2.5-flash |

---

## Prerequisites

- [Docker](https://www.docker.com/get-started) & Docker Compose
- (Optional) [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) for local development
- (Optional) [Node.js 20+](https://nodejs.org/) for local frontend development

---

## Quick Start

### Run Everything with Docker (Recommended)

From the project root:

```bash
# Start all services (Database, Backend API, Frontend)
docker compose up

# In another terminal, apply database migrations
docker compose exec backend dotnet ef database update
```

**Access the application:**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5079](http://localhost:5079)
- API Documentation: [http://localhost:5079/swagger](http://localhost:5079/swagger)

### Stop All Services

```bash
docker compose down

# Remove data volumes
docker compose down -v
```

---

## Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Quick reference guide for getting started
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and architecture overview
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment and CI/CD setup
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

---

## Project Structure

```
.
├── backend/                                    # Backend API (.NET)
│   ├── Dockerfile                              # Docker build configuration
│   ├── docker-compose.yml                      # Old DB-only compose
│   ├── ecommerce-products-pearson.sln          # Visual Studio solution
│   ├── EcommerceProducts/
│   │   ├── Controllers/
│   │   │   ├── AiQueryController.cs            # AI query endpoints
│   │   │   └── ProductsController.cs           # CRUD endpoints
│   │   ├── Data/
│   │   │   └── AppDbContext.cs                 # EF Core DbContext
│   │   ├── DTOs/                               # Data transfer objects
│   │   ├── Models/
│   │   │   └── Product.cs                      # Product entity
│   │   ├── Services/                           # Business logic
│   │   ├── Repositories/                       # Data access layer
│   │   ├── Validators/                         # FluentValidation
│   │   ├── Filters/                            # Middleware & filters
│   │   ├── Migrations/                         # EF Core migrations
│   │   ├── appsettings.json                    # Configuration
│   │   └── Program.cs                          # Application entry point
│   └── EcommerceProducts.Tests/                # Unit tests
│
├── webapp/                                     # Frontend (Next.js)
│   ├── Dockerfile                              # Docker build configuration
│   ├── src/
│   │   ├── app/                                # Next.js app directory
│   │   ├── components/                         # React components
│   │   ├── services/                           # API client services
│   │   └── types/                              # TypeScript types
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml                          # Main orchestration file
├── README.md                                   # This file
├── .editorconfig                               # Editor configuration
├── .gitignore                                  # Git ignore rules
└── .globalconfig                               # Global analyzer configuration
```

---

## Local Development (Without Docker)

### Backend Setup

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

API: http://localhost:5079

### Frontend Setup

```bash
cd webapp
npm install
npm run dev
```

Frontend: http://localhost:3000

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
| `page` | int | No | Page number (default: 1) |
| `pageSize` | int | No | Items per page (default: 12) |
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

## Environment Configuration

The project automatically creates `.env` files from `.env.example` templates when you run it for the first time.

### Automatic Setup

**All startup methods handle this automatically:**

```bash
# Windows
project.bat start-bg

# Linux/Mac
./project.sh start-bg

# Docker
docker compose up
```

### Environment Files

| File | Purpose | Auto-created |
|------|---------|--------------|
| `backend/.env` | Backend configuration | ✓ Yes |
| `webapp/.env` | Frontend configuration | ✓ Yes |

### Default Values

**Backend** (`backend/.env`):
```
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Server=sqlserver,1433;Database=EcommerceProductsDb;...
Gemini__ApiKey=YOUR_GEMINI_API_KEY_HERE
Gemini__Model=gemini-2.5-flash
```

**Frontend** (`webapp/.env`):
```
NEXT_PUBLIC_API_URL=http://localhost:5079
```

### Customization

1. Let the project create `.env` files automatically
2. Edit the `.env` files (not `.env.example`)
3. Restart services: `docker compose restart`

> 💡 **Never commit `.env` files to Git** - they contain sensitive data

---

### Docker Commands

```bash
# Start all services
docker compose up

# Start services in background
docker compose up -d

# Stop all services
docker compose down

# Stop services and remove data volumes
docker compose down -v

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend

# Execute command in backend container
docker compose exec backend dotnet ef database update

# Rebuild images
docker compose build --no-cache
```

### Backend Commands (Local Development)

From the `backend` directory:

```bash
# Restore dependencies
dotnet restore

# Build project
dotnet build

# Run application
dotnet run

# Create a new migration
dotnet ef migrations add <MigrationName>

# Apply migrations
dotnet ef database update

# Remove last migration
dotnet ef migrations remove
```

### Frontend Commands (Local Development)

From the `webapp` directory:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Environment Configuration

### Backend (.NET)

The backend uses environment variables for configuration. In Docker, these are set in `docker-compose.yml`:

- `ConnectionStrings__DefaultConnection` - SQL Server connection string
- `Gemini__ApiKey` - Google Gemini API key
- `Gemini__Model` - Gemini model name (default: gemini-2.5-flash)

### Frontend (Next.js)

The frontend uses environment variables prefixed with `NEXT_PUBLIC_` (visible to browser):

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5079)

---

## Database

**SQL Server 2022 Developer Edition**

| Setting | Value |
|---|---|
| Server | `localhost,1433` (local) or `sqlserver,1433` (Docker) |
| Database | `EcommerceProductsDb` |
| Username | `sa` |
| Password | `SqlServer@2024!` |

### Connection Strings

**Docker (from docker-compose.yml):**
```
Server=sqlserver,1433;Database=EcommerceProductsDb;User Id=sa;Password=SqlServer@2024!;TrustServerCertificate=True
```

**Local Development:**
```
Server=localhost,1433;Database=EcommerceProductsDb;User Id=sa;Password=SqlServer@2024!;TrustServerCertificate=True
```

---

## Troubleshooting

### Port Already in Use

If a port is already bound:

```bash
# Free up port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Free up port 5079 (backend)
lsof -ti:5079 | xargs kill -9

# Free up port 1433 (database)
lsof -ti:1433 | xargs kill -9
```

### Database Connection Issues

```bash
# Check if SQL Server container is healthy
docker compose ps

# Reset database
docker compose down -v
docker compose up -d
docker compose exec backend dotnet ef database update
```

### Building Issues

```bash
# Clear Docker cache and rebuild
docker compose down
docker compose build --no-cache
docker compose up
```

---

## License

This project is licensed under the MIT License.
