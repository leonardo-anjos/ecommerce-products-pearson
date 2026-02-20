# Project Architecture

## Overview

The EcommerceProducts application is a full-stack, containerized e-commerce platform with AI-powered search capabilities. It consists of three main services orchestrated via Docker Compose.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose Network                    │
│                    (ecommerce-network)                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │   Frontend       │  │     Backend      │  │  Database  │ │
│  │   (Next.js)      │  │   (.NET 8 API)   │  │  (MSSQL)   │ │
│  │                  │  │                  │  │            │ │
│  │  Port: 3000      │  │  Port: 5079      │  │ Port: 1433 │ │
│  │                  │  │                  │  │            │ │
│  └────────┬─────────┘  └────────┬─────────┘  └────────────┘ │
│           │                     │                │           │
│           │                     │                │           │
│           │◄────────HTTP────────┤                │           │
│           │                     │                │           │
│           │                     │◄──SQL Server──►│           │
│           │                     │  Connection    │           │
│           │                     │  String        │           │
│           │                     │                │           │
└─────────────────────────────────────────────────────────────┘

           Browser                HTTP              Database
           (Port 3000)         (Port 5079)         (Port 1433)
```

## Service Details

### 1. Frontend Service (webapp)

**Technology Stack:**
- Framework: Next.js 13+ (React)
- Language: TypeScript
- Styling: Tailwind CSS
- Package Manager: npm

**Responsibilities:**
- User interface for product management
- AI-powered product search
- Client-side routing and state management
- API communication via HTTP

**Configuration:**
- Environment: `NEXT_PUBLIC_API_URL` points to backend
- Build Image: Node.js 20-Alpine
- Production-only build optimization
- Port: 3000

**Key Files:**
- `src/app/` - Next.js app directory
- `src/components/` - Reusable React components
- `src/services/api.ts` - API client
- `src/types/product.ts` - TypeScript interfaces
- `Dockerfile` - Multi-stage build for optimization

### 2. Backend Service (backend)

**Technology Stack:**
- Framework: ASP.NET Core 8.0
- Language: C# 12
- ORM: Entity Framework Core 8.0
- API Documentation: Swagger/OpenAPI
- Validation: FluentValidation
- AI: Google Gemini API 2.5-flash

**Responsibilities:**
- RESTful API endpoints for products (CRUD)
- AI-powered natural language queries
- Data persistence and business logic
- Request validation and error handling
- Database migration management

**Architecture Layers:**
```
Controllers (HTTP Layer)
    ↓
Services (Business Logic)
    ↓
Repositories (Data Access)
    ↓
DbContext (EF Core)
    ↓
Database (SQL Server)
```

**Configuration:**
- Connection String: `ConnectionStrings__DefaultConnection`
- Gemini API: `Gemini__ApiKey`, `Gemini__Model`
- CORS: Configured for `http://localhost:3000`
- Port: 5079

**Key Directories:**
- `Controllers/` - API endpoints
- `Services/` - Business logic layer
- `Repositories/` - Data access layer
- `Data/` - Entity Framework DbContext
- `Models/` - Database entities
- `DTOs/` - Request/response objects
- `Validators/` - Input validation
- `Filters/` - Middleware & exception handling
- `Migrations/` - EF Core database changes

### 3. Database Service (SQL Server)

**Technology Stack:**
- Database: Microsoft SQL Server 2022 (Developer Edition)
- Edition: Developer (free for development/testing)

**Responsibilities:**
- Data persistence
- ACID transactions
- Relationship integrity

**Configuration:**
- Credentials:
  - Username: `sa`
  - Password: `SqlServer@2024!`
- Database: `EcommerceProductsDb`
- Port: 1433
- Persistence: Docker volume `sqlserver-data`

**Health Checks:**
- Live SQL Server connectivity checks
- Enables dependent services to wait for readiness

## Communication Flow

### Product CRUD Operations

```
1. Frontend (Next.js)
   └─► POST /api/products (Create)
       └─► GET /api/products (Read All)
       └─► GET /api/products/{id} (Read One)
       └─► PATCH /api/products/{id} (Update)
       └─► DELETE /api/products/{id} (Delete)

2. Backend (ASP.NET Core)
   └─► ProductsController
       └─► ProductService
           └─► ProductRepository
               └─► AppDbContext
                   └─► SQL Server Database
```

### AI-Powered Search

```
1. Frontend (Next.js)
   └─► POST /api/ai-query
       └─► AiQueryController
           └─► NlToSqlService
               └─► Google Gemini API
                   └─► Generated SQL Query
                       └─► ProductRepository
                           └─► Database Results
```

## Environment Configuration

### Development (Local)

```bash
# Frontend
cd webapp
npm install
npm run dev
# Runs on http://localhost:3000

# Backend
cd backend
dotnet restore
dotnet run
# Runs on http://localhost:5079

# Database
docker compose up -d
# Runs on localhost:1433
```

### Production (Docker)

```bash
docker compose up
# All services orchestrated automatically
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Product CRUD Flow                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend Component                                           │
│        │                                                      │
│        ├─ Validates input                                    │
│        │                                                      │
│        ├─ POST /api/products                                │
│        │       ↓                                             │
│        │  Backend Controller                                │
│        │       │                                             │
│        │       ├─ Validates request body (FluentValidation) │
│        │       │                                             │
│        │       ├─ Calls ProductService                      │
│        │       │       │                                     │
│        │       │       ├─ Business logic                    │
│        │       │       │                                     │
│        │       │       ├─ Calls ProductRepository           │
│        │       │       │       │                             │
│        │       │       │       ├─ Queries AppDbContext      │
│        │       │       │       │       │                     │
│        │       │       │       │       ├─ SQL Query         │
│        │       │       │       │       │   (LINQ-to-SQL)   │
│        │       │       │       │       │       │            │
│        │       │       │       │       │   Database         │
│        │       │       │       │       │       │            │
│        │       │       │       │       ├─ Returns Entity    │
│        │       │       │       │       ↓                     │
│        │       │       │       └─  Returns Entity            │
│        │       │       └─ DTO Mapping                       │
│        │       └─ Returns Response                          │
│        │       ↓                                             │
│  Frontend State Update                                       │
│        │                                                     │
│        └─► Re-render UI                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Containerization Strategy

### Multi-Stage Builds (Optimization)

**Backend (Dockerfile)**
```
Stage 1: Build
  ├─ Use SDK image
  ├─ Restore & build
  └─ Publish

Stage 2: Runtime
  ├─ Use smaller runtime image
  ├─ Copy only published artifacts
  └─ Reduce final image size
```

**Frontend (Dockerfile)**
```
Stage 1: Build
  ├─ Use Node.js image
  ├─ Install dependencies
  └─ Build Next.js app

Stage 2: Runtime
  ├─ Use Node.js image
  ├─ Copy only runtime dependencies
  ├─ Copy build output
  └─ Start production server
```

### Network Isolation

All services run on `ecommerce-network` bridge network, providing:
- Internal DNS resolution (service name → IP)
- Service-to-service communication
- Isolation from host machine

## Database Schema

### Products Table

```sql
CREATE TABLE Products (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    Price DECIMAL(18,2) NOT NULL,
    StockQuantity INT NOT NULL,
    Category NVARCHAR(100),
    ImageUrl NVARCHAR(500),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2
)

CREATE INDEX idx_name ON Products(Name)
CREATE INDEX idx_category ON Products(Category)
CREATE INDEX idx_active ON Products(IsActive)
```

## Security Considerations

1. **CORS**: Backend allows requests only from `http://localhost:3000`
2. **Input Validation**: All requests validated via FluentValidation
3. **SQL Injection Prevention**: Parameterized queries via EF Core
4. **Exception Handling**: Global exception middleware prevents information leakage
5. **HTTPS**: Production deployment should enforce HTTPS

## Scaling Considerations

- **Horizontal Scaling**: Services can be replicated behind a load balancer
- **Database**: Connection pooling configured for concurrent requests
- **Caching**: Consider implementing Redis for frequently accessed data
- **API Rate Limiting**: Implement rate limiting for production
- **Async Operations**: Services support async/await for better resource utilization

## Deployment Checklist

- [ ] Update Gemini API key in production environment
- [ ] Configure production CORS origins
- [ ] Enable HTTPS
- [ ] Set appropriate database backups
- [ ] Configure CI/CD pipeline
- [ ] Implement monitoring and logging
- [ ] Set resource limits for containers
- [ ] Configure auto-restart policies
- [ ] Set up health check monitoring
- [ ] Document production deployment steps
