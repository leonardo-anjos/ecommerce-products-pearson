# Troubleshooting Guide

## Common Issues and Solutions

### Docker Build Errors

#### Error: "Unable to locate package mssql-tools18"

**Cause:** The Debian Bookworm base image doesn't include mssql-tools18 in its default repositories.

**Solution:** Already fixed in the codebase. The backend Dockerfile now:
- ✅ No longer installs mssql-tools18
- ✅ Uses a simpler TCP-based health check in the bash entrypoint
- ✅ Automatically runs migrations on startup

If you're still getting this error, ensure all files are up to date:
```bash
git pull origin main
docker compose build --no-cache
docker compose up
```

#### Error: "npm ci" timeout or failure

**Cause:** Network timeout or connectivity issues while installing npm packages.

**Solution:** The Dockerfile now includes:
- ✅ Longer fetch timeouts (120 seconds)
- ✅ Retry configuration
- ✅ `--prefer-offline` flag to use cached packages
- ✅ `--no-audit` to skip unnecessary checks

Try cleaning and rebuilding:
```bash
docker compose down -v
docker compose build --no-cache frontend
docker compose up frontend
```

---

## Startup Issues

### Services fail to start

**Check service logs:**
```bash
docker compose logs -f
```

**Common reasons:**
1. Database not ready → Wait 10-15 seconds
2. Port already in use → Kill process or change ports
3. Build cache issues → Use `docker compose build --no-cache`

### Database connection errors

**Test connectivity:**
```bash
docker compose exec backend ping sqlserver:1433
```

**Reset database:**
```bash
docker compose down -v sqlserver
docker compose up -d sqlserver
```

### Frontend not connecting to backend

**Check frontend logs:**
```bash
docker compose logs -f frontend
```

**Verify environment variable:**
```bash
docker compose exec frontend printenv | grep NEXT_PUBLIC_API_URL
```

**Should show:** `http://localhost:5079`

---

## Port Conflicts

### Port 3000, 5079, or 1433 already in use

**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Or use different ports in `docker-compose.yml`:**
```yaml
ports:
  - "3001:3000"  # Frontend on 3001
  - "5080:5079"  # Backend on 5080
```

---

## Docker Desktop Issues

### Out of disk space

```bash
# Clean up Docker
docker system prune -a --volumes

# Or remove specific items
docker image prune -a
docker volume prune
```

### Service exits immediately

```bash
# Check logs
docker compose logs backend

# Rebuild without cache
docker compose build --no-cache
docker compose up
```

---

## Database Issues

### Migrations not running automatically

**Manually apply:**
```bash
docker compose exec backend dotnet ef database update
```

**Check migration status:**
```bash
docker compose exec backend dotnet ef migrations list
```

### Database locked or corrupted

**Full reset:**
```bash
docker compose down -v
docker compose up
docker compose exec backend dotnet ef database update
```

---

## Development Issues

### Changes not reflecting after code update

**Rebuild images:**
```bash
docker compose build --no-cache
docker compose up
```

### Need to debug the application

**Backend debug logs:**
```bash
docker compose logs -f backend
# Look for EF Core, validation, and API errors
```

**Frontend debug logs:**
```bash
docker compose logs -f frontend
# Look for Next.js build and routing errors
```

**Direct container access:**
```bash
# Backend shell
docker compose exec backend bash

# Frontend shell
docker compose exec frontend sh
```

---

## Environment Variable Issues

### Environment variables not being picked up

**Check if .env files exist:**
```bash
ls -la backend/.env
ls -la webapp/.env
```

**If missing, recreate them:**
```bash
# Windows
init-env.bat

# Mac/Linux
./init-env.sh

# Or manually
cp backend/.env.example backend/.env
cp webapp/.env.example webapp/.env
```

**Verify variables in container:**
```bash
docker compose exec backend printenv | grep ConnectionStrings
docker compose exec frontend printenv | grep NEXT_PUBLIC
```

---

## Performance Issues

### Docker using too much memory

**Check resource usage:**
```bash
docker stats
```

**Limit resources in `docker-compose.yml`:**
```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 1G
```

### Slow npm install

**Use BuildKit (faster builds):**
```bash
DOCKER_BUILDKIT=1 docker compose build
```

---

## Network Issues

### Can't reach localhost:3000 or localhost:5079

**Check if services are running:**
```bash
docker compose ps
```

**If containers are running but ports not accessible:**
```bash
# Restart Docker Desktop
# Or restart specific service
docker compose restart backend
```

**From inside Docker network** (e.g., frontend to backend):
- Use `http://backend:5079` not `http://localhost:5079`
- This is automatically configured in docker-compose.yml

---

## Still Having Issues?

1. **Check Docker is running** - Docker Desktop must be open
2. **Review all logs** - `docker compose logs -f`
3. **Try full reset** - `docker compose down -v && docker compose up --build`
4. **Check disk space** - Docker needs ~10GB free
5. **Update Docker** - Use latest Docker Desktop version

---

## Need More Help?

Check these files for detailed information:
- [README.md](README.md) - General setup and usage
- [QUICKSTART.md](QUICKSTART.md) - Quick reference
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment

Or run the help command:
```bash
# Windows
project.bat help

# Mac/Linux
./project.sh help
```
