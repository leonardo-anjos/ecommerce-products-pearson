# EcommerceProducts

Documentação única e resumida sobre a arquitetura, padrões de projeto e integrações da plataforma de gerenciamento de produtos com IA.

---

## 🎯 Visão Geral

O **EcommerceProducts** é uma aplicação full-stack de gerenciamento de produtos de e-commerce com recursos avançados de busca inteligente baseada em IA. A plataforma utiliza uma arquitetura em camadas bem definida, com separação clara de responsabilidades entre frontend, backend e persistência de dados.

### Principais Características

- ✅ Gerenciamento completo de produtos (CRUD)
- ✅ Busca inteligente com linguagem natural integrada ao Google Gemini
- ✅ Persistência de dados em SQL Server
- ✅ Interface moderna e responsiva com Next.js
- ✅ Validação robusta e tratamento centralizado de erros
- ✅ Containerização completa com Docker Compose
- ✅ Documentação interativa com Swagger

---

## 🏗️ Arquitetura do Sistema

### Diagrama de Alto Nível

```
┌───────────────────────────────────────────────────────────────┐
│                  Docker Compose Network                        │
│                   (ecommerce-network)                          │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────┐ │
│  │   Frontend       │    │      Backend     │    │ Database │ │
│  │   (Next.js)      │    │   (ASP.NET 8)    │    │  (MSSQL) │ │
│  │                  │    │                  │    │          │ │
│  │   Port: 3000     │    │   Port: 5079     │    │ Port:1433│ │
│  └────────┬─────────┘    └────────┬─────────┘    └────────────┘ │
│           │                       │                │            │
│           └───────── HTTP ────────┤                │            │
│                                   │                │            │
│                                   └─── Connection ─┘            │
│                                      String (MSSQL)            │
│                                                                 │
└───────────────────────────────────────────────────────────────┘
```

### Componentes Principais

| Componente | Tecnologia | Porta | Função |
|-----------|-----------|--------|--------|
| **Frontend (webapp)** | Next.js 14 + React 18 | 3000 | Interface de usuário |
| **Backend (API)** | ASP.NET Core 8 | 5079 | Lógica de negócio e endpoints |
| **Database** | SQL Server 2022 | 1433 | Persistência de dados |
| **AI Service** | Google Gemini 2.5-flash | - | Processamento de queries em linguagem natural |

---

## 💻 Stack Tecnológico

### Backend

| Categoria | Tecnologia | Versão | Função |
|----------|-----------|--------|--------|
| Framework | ASP.NET Core | 8.0 | Framework web |
| Linguagem | C# | 12 | Linguagem de programação |
| ORM | Entity Framework Core | 8.0.x | Mapeamento objeto-relacional |
| BD | SQL Server | 2022 | Banco de dados relacional |
| API Docs | Swashbuckle | 6.6.2 | Documentação OpenAPI/Swagger |
| Validação | FluentValidation | 11.3.x | Validação de dados |
| Logging | Serilog | 3.1.x | Sistema de logs |
| AI/ML | Google GenerativeAI | Latest | Integração com Gemini API |

### Frontend

| Categoria | Tecnologia | Versão | Função |
|----------|-----------|--------|--------|
| Framework | Next.js | 14.2.21 | React framework |
| Linguagem | TypeScript | 5.4.5 | Tipagem estática |
| View | React | 18.3.1 | Biblioteca de UI |
| Styling | Tailwind CSS | 3.4.4 | Utility-first CSS |
| Ferramenta | npm | Latest | Package manager |

### DevOps

| Componente | Tecnologia | Função |
|-----------|-----------|--------|
| Containerização | Docker | Isolamento de serviços |
| Orquestração | Docker Compose | Gerenciamento de múltiplos containers |

---

## 🎨 Padrões de Projeto

### 1. Padrão Repository

**Propósito:** Abstrair a camada de acesso a dados e fornecer uma interface consistente para operações de BD.

**Implementação:**

```
IProductRepository (interface)
    ↓
ProductRepository (implementação)
    ├── GetAllAsync() - Retorna páginas de produtos com filtros
    ├── GetByIdAsync() - Busca um produto por ID
    ├── AddAsync() - Cria novo produto
    ├── UpdateAsync() - Atualiza produto existente
    └── DeleteAsync() - Remove produto
```

**Local:** `backend/EcommerceProducts/Repositories/`

### 2. Padrão Service (Business Logic)

**Propósito:** Encapsular regras de negócio e coordenar múltiplas operações de repositório.

**Implementação:**

```
IProductService (interface)
    ↓
ProductService (implementação)
    ├── GetAllAsync() - Lista produtos com paginação
    ├── GetByIdAsync() - Obtém detalhes de um produto
    ├── CreateAsync() - Cria novo produto com validação
    ├── UpdateAsync() - Atualiza produto com validação
    └── DeleteAsync() - Deleta produto
```

**Local:** `backend/EcommerceProducts/Services/`

### 3. Padrão Data Transfer Object (DTO)

**Propósito:** Separar a representação de dados interna (Models) das expostas pela API.

**DTOs Utilizados:**

- `AiQueryRequest` - Requisição de query em linguagem natural
- `AiQueryResponse` - Resposta da query processada pela IA
- `CreateProductRequest` - Dados para criar produto
- `UpdateProductRequest` - Dados para atualizar produto
- `ProductResponse` - Modelo de resposta de produto
- `PagedRequest` - Parâmetros de paginação
- `PagedResponse<T>` - Resposta paginada genérica

**Local:** `backend/EcommerceProducts/DTOs/`

### 4. Padrão Middleware

**Propósito:** Centralizar processamento transversal como validação e tratamento de erros.

**Implementações:**

- **GlobalExceptionMiddleware** - Captura exceções não tratadas e retorna respostas padronizadas
- **ValidationFilter** - Processa validações de FluentValidation

**Local:** `backend/EcommerceProducts/Filters/`

### 5. Padrão Dependency Injection (DI)

**Propósito:** Gerenciar dependências através do contêiner IoC do ASP.NET Core.

**Registro de Serviços (Program.cs):**

```csharp
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<INlToSqlService, NlToSqlService>();
builder.Services.AddSingleton(new GenerativeModel(apiKey, model));
```

### 6. Padrão MVC

**Propósito:** Separar responsabilidades em Model, View e Controller.

**Controllers:**

- `ProductsController` - Endpoints de CRUD (GET, POST, PUT, DELETE)
- `AiQueryController` - Endpoints de query inteligente

**Local:** `backend/EcommerceProducts/Controllers/`

---

## 🔧 Estrutura do Backend

### Camadas de Aplicação

```
┌─────────────────────────────────────────┐
│         HTTP Layer (Controllers)         │
│  ProductsController, AiQueryController  │
└──────────────┬──────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│      Business Logic Layer (Services)     │
│  ProductService, NlToSqlService          │
└──────────────┬──────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│   Data Access Layer (Repositories)       │
│          ProductRepository               │
└──────────────┬──────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│         ORM Layer (EF Core)              │
│             AppDbContext                 │
└──────────────┬──────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│         Database Layer (MSSQL)           │
│          SQL Server 2022                 │
└──────────────────────────────────────────┘
```

### Estrutura de Diretórios

```
backend/EcommerceProducts/
├── Controllers/                # Endpoints HTTP
│   ├── ProductsController.cs   # CRUD de produtos
│   └── AiQueryController.cs    # Queries com IA
├── Models/                     # Entidades de domínio
│   └── Product.cs              # Modelo de produto
├── DTOs/                       # Objetos de transferência
│   ├── ProductResponse.cs
│   ├── CreateProductRequest.cs
│   ├── UpdateProductRequest.cs
│   ├── AiQueryRequest.cs
│   ├── AiQueryResponse.cs
│   ├── PagedRequest.cs
│   └── PagedResponse.cs
├── Services/                   # Lógica de negócio
│   ├── IProductService.cs
│   ├── ProductService.cs
│   ├── INlToSqlService.cs      # NL2SQL com Gemini
│   └── NlToSqlService.cs
├── Repositories/               # Acesso a dados
│   ├── IProductRepository.cs
│   └── ProductRepository.cs
├── Data/                       # Configuração de BD
│   └── AppDbContext.cs         # EF Core DbContext
├── Migrations/                 # Migrações EF Core
│   ├── InitialCreate
│   └── ChangeProductIdToGuid
├── Validators/                 # Validações FluentValidation
│   ├── CreateProductRequestValidator.cs
│   ├── UpdateProductRequestValidator.cs
│   └── AiQueryRequestValidator.cs
├── Filters/                    # Middleware e filtros
│   ├── GlobalExceptionMiddleware.cs
│   └── ValidationFilter.cs
├── Mappings/                   # Mapeamento de dados
│   └── ProductMappings.cs
├── Program.cs                  # Configuração da aplicação
└── appsettings.json            # Arquivo de configuração
```

### Entidade Principal - Produto

```csharp
// Product.cs
public class Product
{
    public Guid Id { get; set; }              // PK UUID
    public string Name { get; set; }          // Nome do produto
    public string? Description { get; set; }  // Descrição
    public decimal Price { get; set; }        // Preço
    public int StockQuantity { get; set; }    // Quantidade em estoque
    public string? Category { get; set; }     // Categoria
    public string? ImageUrl { get; set; }     // URL da imagem
    public bool IsActive { get; set; }        // Status ativo/inativo
    public DateTime CreatedAt { get; set; }   // Data de criação
    public DateTime? UpdatedAt { get; set; }  // Data de atualização
}
```

---

## 🎨 Estrutura do Frontend

### Arquitetura Next.js

```
webapp/
├── src/
│   ├── app/                    # Next.js App Directory
│   │   ├── layout.tsx          # Layout raiz
│   │   ├── page.tsx            # Página principal
│   │   └── [routes]/           # Rotas dinâmicas
│   ├── components/             # Componentes React reutilizáveis
│   │   ├── ProductList.tsx
│   │   ├── ProductForm.tsx
│   │   ├── SearchBar.tsx
│   │   └── ...
│   ├── services/               # Camada de serviços
│   │   └── api.ts              # Cliente HTTP e chamadas API
│   └── types/                  # Interfaces TypeScript
│       ├── product.ts
│       └── ...
├── public/                     # Arquivos estáticos
├── Dockerfile                  # Build da aplicação
├── package.json                # Dependências npm
├── tsconfig.json               # Configuração TypeScript
├── tailwind.config.ts          # Configuração Tailwind CSS
└── next.config.mjs             # Configuração Next.js
```

### Fluxo de Dados Frontend

```
User Interface (React Components)
    ↓
Event Handlers (onClick, onChange, etc)
    ↓
API Service Client (api.ts)
    ↓
HTTP Requests (Fetch/Axios)
    ↓
Backend API (localhost:5079)
    ↓
Response → State Management
    ↓
Re-render Components
```

---

## 🔗 Integrações

### 1. Integração com Google Gemini (IA)

**Objetivo:** Processar queries em linguagem natural e converter para SQL.

**Fluxo:**

```
User Query (linguagem natural)
    ↓
[Frontend] AiQueryController.PostQuery()
    ↓
[Service] NlToSqlService.ProcessQueryAsync()
    ↓
[API] Google Gemini API 2.5-flash
    ↓
Generated SQL Query
    ↓
ProductRepository.GetAllAsync(filter)
    ↓
Results → AiQueryResponse
    ↓
Frontend renderiza resultados
```

**Configuração:**

```json
{
  "Gemini": {
    "ApiKey": "<sua-chave-api>",
    "Model": "gemini-2.5-flash"
  }
}
```

**Local:** `backend/EcommerceProducts/Services/NlToSqlService.cs`

### 2. Integração com SQL Server (Banco de Dados)

**Objetivo:** Persistência de dados de produtos.

**Configuração (appsettings.json):**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=db;Database=EcommerceDB;User=sa;Password=..."
  }
}
```

**Migrações EF Core:**

- `20260215174615_InitialCreate` - Criação inicial de tabelas
- `20260215184313_ChangeProductIdToGuid` - Alteração do tipo de ID

**Local:** `backend/EcommerceProducts/Migrations/`

### 3. Integração Frontend ↔ Backend

**Protocolo:** HTTP/REST

**Endpoints Principais:**

```
GET    /api/products                    # Listar produtos (com paginação)
GET    /api/products/{id}               # Obter detalhes de um produto
POST   /api/products                    # Criar novo produto
PUT    /api/products/{id}               # Atualizar produto
DELETE /api/products/{id}               # Deletar produto
POST   /api/aiqueries                   # Processar query com IA
```

**CORS (Cross-Origin Resource Sharing):**

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

---

## 📡 Fluxo de Dados

### Fluxo 1: CRUD de Produtos

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                  │
│              User clica em "Criar Produto"               │
└────────────────┬────────────────────────────────────────┘
                 │ POST /api/products
                 ↓
┌─────────────────────────────────────────────────────────┐
│                 ProductsController                       │
│            [HttpPost] CreateProduct()                    │
└────────────────┬────────────────────────────────────────┘
                 │ CreateProductRequest
                 ↓
┌─────────────────────────────────────────────────────────┐
│               Validação (ValidationFilter)              │
│         CreateProductRequestValidator                   │
└────────────────┬────────────────────────────────────────┘
                 │ ✓ Dados válidos
                 ↓
┌─────────────────────────────────────────────────────────┐
│                 ProductService                          │
│              CreateAsync(request)                       │
└────────────────┬────────────────────────────────────────┘
                 │ Mapear DTO → Model
                 ↓
┌─────────────────────────────────────────────────────────┐
│              ProductRepository                          │
│         AddAsync(product) + SaveChanges()               │
└────────────────┬────────────────────────────────────────┘
                 │ INSERT INTO Products
                 ↓
┌─────────────────────────────────────────────────────────┐
│            SQL Server Database                          │
│           Produto persistido com novo ID                │
└────────────────┬────────────────────────────────────────┘
                 │ ProductResponse (201 Created)
                 ↓
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│            Exibe mensagem de sucesso                    │
└─────────────────────────────────────────────────────────┘
```

### Fluxo 2: Query com IA

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│         User digita query: "Produtos baratos"           │
└────────────────┬────────────────────────────────────────┘
                 │ POST /api/aiqueries
                 ↓
┌─────────────────────────────────────────────────────────┐
│                 AiQueryController                       │
│               PostQuery(request)                        │
└────────────────┬────────────────────────────────────────┘
                 │ AiQueryRequest {"query": "..."}
                 ↓
┌─────────────────────────────────────────────────────────┐
│              Validação (ValidationFilter)              │
│          AiQueryRequestValidator                       │
└────────────────┬────────────────────────────────────────┘
                 │ ✓ Query válida
                 ↓
┌─────────────────────────────────────────────────────────┐
│                NlToSqlService                           │
│       ProcessQueryAsync(query)                          │
└────────────────┬────────────────────────────────────────┘
                 │ "Produtos baratos"
                 ↓
┌─────────────────────────────────────────────────────────┐
│          Google Gemini API 2.5-flash                   │
│    Converte linguagem natural para SQL                 │
│  "SELECT * FROM Product WHERE Price < 100"            │
└────────────────┬────────────────────────────────────────┘
                 │ SQL filtro
                 ↓
┌─────────────────────────────────────────────────────────┐
│              ProductRepository                          │
│    GetAllAsync(filter: p => p.Price < 100)            │
└────────────────┬────────────────────────────────────────┘
                 │ SELECT * FROM Products WHERE Price < 100
                 ↓
┌─────────────────────────────────────────────────────────┐
│           SQL Server Database                           │
│  Retorna produtos que atendem os critérios             │
└────────────────┬────────────────────────────────────────┘
                 │ Produtos
                 ↓
┌─────────────────────────────────────────────────────────┐
│           NlToSqlService                                │
│      Mapeia para AiQueryResponse                        │
└────────────────┬────────────────────────────────────────┘
                 │ Resposta formatada
                 ↓
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│         Exibe lista de produtos encontrados            │
└─────────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuração e Ambiente

### Variáveis de Ambiente

**Backend (appsettings.json / Variáveis de Environment):**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=db;Database=EcommerceDB;User=sa;Password=YourPassword123!"
  },
  "Gemini": {
    "ApiKey": "sua-chave-gemini-api",
    "Model": "gemini-2.5-flash"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

**Frontend (.env.local):**

```bash
NEXT_PUBLIC_API_URL=http://localhost:5079
```

### Docker Compose Setup

**Arquivo:** `docker-compose.yml`

```yaml
services:
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      SA_PASSWORD: YourPassword123!
    ports:
      - "1433:1433"

  backend:
    build: ./backend
    depends_on:
      - db
    ports:
      - "5079:8080"
    environment:
      ConnectionStrings__DefaultConnection: "Server=db;..."

  webapp:
    build: ./webapp
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5079
```

### Iniciar Aplicação

```bash
# Começar todos os serviços
docker compose up

# Aplicar migrações de BD
docker compose exec backend dotnet ef database update

# Acessar aplicação
# Frontend: http://localhost:3000
# Backend: http://localhost:5079
# Swagger: http://localhost:5079/swagger
```

---

## 📊 Resumo de Padrões e Decisões Arquiteturais

| Aspecto | Padrão/Tecnologia | Justificativa |
|--------|------------------|---------------|
| **Arquitetura Geral** | Layered (3-camadas) | Separação de responsabilidades, facilitando manutenção |
| **Acesso de Dados** | Repository + UnitOfWork (DbContext) | Abstração de dados, testabilidade |
| **Lógica de Negócio** | Service Layer | Reutilização de código, lógica centralizada |
| **Validação** | FluentValidation com Middleware | Validações declarativas e reutilizáveis |
| **Tratamento de Erros** | GlobalExceptionMiddleware | Respostas de erro consistentes |
| **Comunicação HTTP** | REST com DTOs | Padrão de facto para APIs web |
| **AI Integration** | Google Gemini 2.5-flash | State-of-the-art em processamento de linguagem natural |
| **Frontend Framework** | Next.js + React | Produtividade, SSR, otimições automáticas |
| **Estilo CSS** | Tailwind CSS | Desenvolvimento rápido com utility-first CSS |
| **Containerização** | Docker Compose | Ambiente consistente entre desenvolvimento e produção |
| **Banco de Dados** | SQL Server | Integração nativa com .NET, escalabilidade |

---

## 🎓 Conclusão

A arquitetura do **EcommerceProducts** segue as melhores práticas de desenvolvimento de software moderno, combinando:

1. **Padrões de Projeto Estabelecidos** - Repository, Service, DTO, Middleware
2. **Separação Clara de Responsabilidades** - Cada camada tem um propósito definido
3. **Tecnologias Modernas** - ASP.NET Core 8, Next.js 14, SQL Server, Google Gemini
4. **Escalabilidade** - Arquitetura preparada para crescimento
5. **Manutenibilidade** - Código organizado e fácil de entender
6. **DevOps Moderno** - Containerização completa com Docker Compose
