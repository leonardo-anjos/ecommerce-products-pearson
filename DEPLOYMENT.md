# Deployment Guide

## Local Development with Docker

### Prerequisites

- Docker Desktop (includes Docker Engine and Docker Compose)
- Git
- No additional tools required (development inside containers)

### Quick Start

```bash
# Clone repository (if not already cloned)
git clone <repository-url>
cd ecommerce-products-pearson

# Start all services
docker compose up

# In another terminal, initialize the database
docker compose exec backend dotnet ef database update

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5079
# API Docs: http://localhost:5079/swagger
```

### Stopping Services

```bash
# Stop services (keep data)
docker compose stop

# Stop and remove containers (keep data)
docker compose down

# Stop and remove everything (loses database data)
docker compose down -v
```

## Local Development without Docker

### Prerequisites

- .NET 8 SDK
- Node.js 20+
- SQL Server (local or containerized)
- npm

### Setup

```bash
# 1. Start database (if not using Docker)
docker run -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD=SqlServer@2024! -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest

# 2. Setup Backend
cd backend
dotnet restore
dotnet ef database update
dotnet run

# In another terminal:

# 3. Setup Frontend
cd webapp
npm install
npm run dev
```

### Access Application

- Frontend: http://localhost:3000
- Backend: http://localhost:5079
- API Docs: http://localhost:5079/swagger

## Environment Variables Setup

### Docker Deployment

All environment variables are managed in `docker-compose.yml`:

```yaml
backend:
  environment:
    - ConnectionStrings__DefaultConnection=Server=sqlserver,1433;...
    - Gemini__ApiKey=YOUR_KEY
    - Gemini__Model=gemini-2.5-flash
```

### Local Development

Create `.env` files based on examples:

**backend/.env.local**
```
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__DefaultConnection=Server=localhost,1433;...
Gemini__ApiKey=YOUR_GEMINI_API_KEY
Gemini__Model=gemini-2.5-flash
```

**webapp/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:5079
```

## Production Deployment

### Docker Compose Production

```bash
# Build images
docker compose build

# Start with production settings
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Environment Variables for Production

Update `docker-compose.prod.yml`:

```yaml
backend:
  environment:
    - ASPNETCORE_ENVIRONMENT=Production
    - ConnectionStrings__DefaultConnection=Server=prod-server,1433;...
    - Gemini__ApiKey=${GEMINI_API_KEY}
    - Gemini__Model=gemini-2.5-flash

frontend:
  environment:
    - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Kubernetes Deployment (Optional)

Create namespace and secrets:

```bash
kubectl create namespace ecommerce
kubectl create secret generic app-secrets \
  --from-literal=GEMINI_API_KEY=your-key \
  -n ecommerce
```

### Reverse Proxy Setup (Nginx)

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://backend:5079;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## CI/CD Pipeline Example (GitHub Actions)

**.github/workflows/deploy.yml**

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker Images
        run: docker compose build
      
      - name: Push to Registry
        run: |
          echo ${{ secrets.REGISTRY_PASSWORD }} | docker login -u ${{ secrets.REGISTRY_USERNAME }} --password-stdin
          docker compose push
      
      - name: Deploy to Production
        run: |
          # SSH to production server and run docker compose
          ssh user@prod-server "cd /app && docker compose pull && docker compose up -d"
```

## Health Checks and Monitoring

### Docker Health Checks

Health checks are configured in `docker-compose.yml`:

```yaml
services:
  sqlserver:
    healthcheck:
      test: ["CMD", "/opt/mssql-tools18/bin/sqlcmd", "-S", "localhost", "-U", "sa", ...]
      interval: 10s
      timeout: 3s
      retries: 10
```

### Monitoring Endpoints

**Backend Health Check**
```bash
curl http://localhost:5079/health
```

**Frontend Health Check**
```bash
curl http://localhost:3000
```

## Backup and Recovery

### Database Backup

```bash
# Create backup
docker compose exec sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P SqlServer@2024! \
  -Q "BACKUP DATABASE EcommerceProductsDb TO DISK = '/var/opt/mssql/backup/db.bak'"

# List backups
docker compose exec sqlserver ls /var/opt/mssql/backup/
```

### Database Restore

```bash
# Stop services
docker compose down

# Restore from backup
docker compose exec sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P SqlServer@2024! \
  -Q "RESTORE DATABASE EcommerceProductsDb FROM DISK = '/var/opt/mssql/backup/db.bak'"

# Start services
docker compose up -d
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect sqlserver-data

# Backup volume
docker run --rm -v sqlserver-data:/data -v $(pwd):/backup alpine \
  tar czf /backup/sqlserver-data.tar.gz -C /data .

# Restore volume
docker run --rm -v sqlserver-data:/data -v $(pwd):/backup alpine \
  tar xzf /backup/sqlserver-data.tar.gz -C /data
```

## Troubleshooting

### Services Not Starting

```bash
# Check logs
docker compose logs

# Check specific service
docker compose logs backend
docker compose logs frontend
docker compose logs sqlserver
```

### Database Connection Issues

```bash
# Verify SQL Server is running
docker compose ps sqlserver

# Test connection
docker compose exec backend dotnet ef database update --verbose

# Reset database
docker compose down -v
docker compose up -d sqlserver
# Wait for health check to pass
docker compose up -d
```

### Port Conflicts

```bash
# Find process using port
lsof -i :3000
lsof -i :5079
lsof -i :1433

# Kill process
kill -9 <PID>

# Or use different ports in docker-compose.yml
```

### Container Out of Disk Space

```bash
# Clean up Docker
docker system prune

# Remove unused volumes
docker volume prune

# Remove unused images
docker image prune
```

## Performance Optimization

### Image Size Optimization

- Frontend: 400MB (Node.js + Next.js)
- Backend: 350MB (.NET ASP.NET Core)
- Database: 1GB+ (SQL Server)

### Resource Limits (docker-compose.yml)

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Caching Strategy

- Frontend: Node modules cached in Docker layer
- Backend: NuGet packages cached in Docker layer
- Database: Built-in SQL Server caching

## Security Checklist

- [ ] Change default database password in production
- [ ] Update Gemini API key securely
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure firewall rules
- [ ] Implement rate limiting
- [ ] Enable CORS properly for production domain
- [ ] Set up secrets management (Vault, AWS Secrets Manager)
- [ ] Regular security updates for base images
- [ ] Database encryption at rest
- [ ] Audit logging enabled

---

For more information, see [ARCHITECTURE.md](ARCHITECTURE.md) and [README.md](README.md)
