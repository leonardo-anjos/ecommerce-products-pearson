# Quick Start Guide

## For the Impatient 🚀

### One-Command Startup (Windows)

```cmd
project.bat start-bg
```

### One-Command Startup (Mac/Linux)

```bash
./project.sh start-bg
```

**What happens automatically:**
- ✅ `.env` files are created from `.env.example` (if they don't exist)
- ✅ Docker images are built
- ✅ Services start in background
- ✅ Database migrations are applied automatically

### Manual Docker Commands

```bash
# Start everything (creates .env files automatically)
docker compose up

# In another terminal, once backend is ready:
docker compose exec backend dotnet ef database update

# Done! Now access:
# Frontend: http://localhost:3000
# Backend:  http://localhost:5079
# Docs:     http://localhost:5079/swagger
```

---

## Environment Variables (Automatic Setup)

When you run the project for the first time, `.env` files are **automatically created** from `.env.example`:

```
backend/.env          Created from backend/.env.example
webapp/.env           Created from webapp/.env.example
```

**The scripts handle this automatically:**
- `project.bat start-bg` (Windows) ✓
- `./project.sh start-bg` (Linux/Mac) ✓
- `docker compose up` (Docker) ✓

**Default environment values:**
```
Backend:
  API_URL=http://localhost:5079
  Database=EcommerceProductsDb
  Gemini API Key=AIzaSyCRkWANxsrUeE8c7l3kTpbKnZVhJXhXMoU

Frontend:
  NEXT_PUBLIC_API_URL=http://localhost:5079
```

> 💡 **Customize if needed:** Edit `.env` files after they're created (not `.env.example`)

---

## What's Running?

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:3000 | ✓ Next.js |
| **Backend** | http://localhost:5079 | ✓ .NET 8 API |
| **API Docs** | http://localhost:5079/swagger | ✓ Swagger UI |
| **Database** | localhost:1433 | ✓ SQL Server |

---

## Common Operations

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f sqlserver
```

### Stop Services

```bash
# Stop (keep data)
docker compose stop

# Stop and remove (keep data)
docker compose down

# Stop and delete everything
docker compose down -v
```

### Execute Commands in Containers

```bash
# Run dotnet command in backend
docker compose exec backend dotnet ef migrations add MyMigration

# Get into backend shell
docker compose exec backend bash

# Get into frontend shell
docker compose exec frontend sh
```

### Rebuild

```bash
# Rebuild images (useful if you changed code)
docker compose build

# Full rebuild (remove containers first)
docker compose down -v
docker compose build --no-cache
docker compose up
```

---

## Troubleshooting

### Port Already in Use?

```bash
# Kill process on port
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Database Connection Error?

```bash
# Check database status
docker compose ps sqlserver

# Wait a bit longer and try again
docker compose restart sqlserver
```

### Still Having Issues?

```bash
# Full reset
docker compose down -v

# Rebuild from scratch
docker compose build --no-cache

# Start fresh
docker compose up
```

---

## Using Helper Scripts

### Windows Users

```batch
project.bat start-bg      # Start in background
project.bat logs          # View all logs
project.bat status        # Check service status
project.bat bash-backend  # Connect to backend
project.bat help          # See all commands
```

### Mac/Linux Users

```bash
./project.sh start-bg      # Start in background
./project.sh logs          # View all logs
./project.sh status        # Check service status
./project.sh bash-backend  # Connect to backend
./project.sh help          # See all commands
```

---

## Development Without Docker

If you prefer working outside Docker:

```bash
# Backend
cd backend
dotnet restore
dotnet ef database update
dotnet run

# Frontend (another terminal)
cd webapp
npm install
npm run dev
```

You'll need:
- .NET 8 SDK
- Node.js 20+
- SQL Server running locally

---

## Next Steps

- 📖 Read [README.md](README.md) for detailed information
- 🏗️ Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system design
- 🚀 Read [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- � Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
- 💻 Browse the code starting with `backend/EcommerceProducts/Program.cs`

---

## Need Help?

Common issues are documented in [TROUBLESHOOTING.md](TROUBLESHOOTING.md):
- Docker build errors
- Port conflicts
- Database issues
- Environment variable problems

Quick debug:
```bash
# Check all logs
docker compose logs -f

# Restart all services
docker compose restart

# Full reset
docker compose down -v && docker compose up --build
```
