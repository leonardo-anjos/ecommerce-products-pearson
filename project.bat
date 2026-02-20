@echo off
REM EcommerceProducts Project - Quick Start Script for Windows
REM This script handles common operations for the project

setlocal enabledelayedexpansion

REM Check if docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed or not in PATH
    exit /b 1
)

REM Get the directory of this script
for /f "delims=" %%A in ('cd') do set "PROJECT_DIR=%%A"

REM Colors are not supported in standard CMD, so we use text instead
set "GREEN=[OK]"
set "RED=[ERROR]"
set "YELLOW=[WARN]"
set "BLUE=[INFO]"

REM Initialize .env files from .env.example
call :init-env-files

set "COMMAND=%1"
if "%COMMAND%"=="" set "COMMAND=help"

goto :%COMMAND%
goto :help

:init-env-files
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo %GREEN% Created backend\.env from .env.example
    )
)
if not exist "webapp\.env" (
    if exist "webapp\.env.example" (
        copy "webapp\.env.example" "webapp\.env" >nul
        echo %GREEN% Created webapp\.env from .env.example
    )
)
exit /b

:start
cls
echo ================================================================
echo Starting EcommerceProducts Services
echo ================================================================
docker compose up
exit /b

:start-bg
cls
echo ================================================================
echo Starting Services in Background
echo ================================================================
docker compose up -d
echo %GREEN% Services started in background
echo.
echo Waiting for database to be healthy...
timeout /t 5 /nobreak
echo.
echo Applying database migrations...
docker compose exec -T backend dotnet ef database update
echo.
echo %GREEN% All services are running!
echo.
echo Access the application:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5079
echo   API Docs:  http://localhost:5079/swagger
exit /b

:stop
cls
echo ================================================================
echo Stopping Services
echo ================================================================
docker compose stop
echo %GREEN% Services stopped
exit /b

:down
cls
echo ================================================================
echo Stopping and Removing Containers
echo ================================================================
set /p removedata="Remove data volumes as well? (y/N): "
if /i "%removedata%"=="y" (
    docker compose down -v
    echo %GREEN% Services removed (data deleted)
) else (
    docker compose down
    echo %GREEN% Services removed (data preserved)
)
exit /b

:logs
cls
echo ================================================================
echo Service Logs
echo ================================================================
docker compose logs -f
exit /b

:logs-backend
cls
echo ================================================================
echo Backend Logs Only
echo ================================================================
docker compose logs -f backend
exit /b

:logs-frontend
cls
echo ================================================================
echo Frontend Logs Only
echo ================================================================
docker compose logs -f frontend
exit /b

:logs-database
cls
echo ================================================================
echo Database Logs Only
echo ================================================================
docker compose logs -f sqlserver
exit /b

:migrate
cls
echo ================================================================
echo Running Database Migrations
echo ================================================================
docker compose exec backend dotnet ef database update
echo %GREEN% Migrations completed
exit /b

:build
cls
echo ================================================================
echo Building Docker Images
echo ================================================================
docker compose build --no-cache
echo %GREEN% Images built successfully
exit /b

:rebuild
cls
echo ================================================================
echo Full Rebuild (Remove and Build)
echo ================================================================
docker compose down -v
docker compose build --no-cache
docker compose up
exit /b

:status
cls
echo ================================================================
echo Service Status
echo ================================================================
docker compose ps
exit /b

:bash-backend
cls
echo ================================================================
echo Opening Backend Container Shell
echo ================================================================
docker compose exec backend bash
exit /b

:bash-frontend
cls
echo ================================================================
echo Opening Frontend Container Shell
echo ================================================================
docker compose exec frontend sh
exit /b

:clean
cls
echo ================================================================
echo Cleanup - Docker Prune
echo ================================================================
set /p confirm="This will remove unused Docker resources. Continue? (y/N): "
if /i "%confirm%"=="y" (
    docker system prune -f
    echo %GREEN% Cleanup completed
) else (
    echo Cleanup cancelled
)
exit /b

:reset
cls
echo ================================================================
echo Full Reset
echo ================================================================
set /p confirm="This will delete ALL containers, images, and data. Are you SURE? (y/N): "
if /i "%confirm%"=="y" (
    docker compose down -v
    echo %GREEN% Full reset completed
    echo %YELLOW% Run 'project.bat start-bg' to rebuild everything
) else (
    echo Reset cancelled
)
exit /b

:env
cls
echo ================================================================
echo Environment Variables
echo ================================================================
echo.
echo Backend Environment:
docker compose exec -T backend printenv | findstr /i "ASPNETCORE ConnectionStrings Gemini" || (echo No ENV vars found)
echo.
echo Frontend Environment:
docker compose exec -T frontend printenv | findstr /i "NODE_ENV NEXT_PUBLIC" || (echo No ENV vars found)
exit /b

:help
cls
echo.
echo ================================================================
echo EcommerceProducts - Project Management Script
echo ================================================================
echo.
echo Usage: project.bat [command]
echo.
echo Commands:
echo   start              Start all services ^(interactive^)
echo   start-bg           Start all services in background
echo   stop               Stop all services
echo   down               Stop and remove containers
echo   logs               View logs from all services
echo   logs-backend       View backend logs only
echo   logs-frontend      View frontend logs only
echo   logs-database      View database logs only
echo   migrate            Run database migrations
echo   build              Build Docker images
echo   rebuild            Full rebuild ^(remove + build + start^)
echo   status             Show service status
echo   bash-backend       Open shell in backend container
echo   bash-frontend      Open shell in frontend container
echo   clean              Remove unused Docker resources
echo   reset              Full reset ^(!!! deletes everything !!!^)
echo   env                Show environment variables
echo   help               Show this help message
echo.
echo Examples:
echo   project.bat start-bg       # Start in background and apply migrations
echo   project.bat logs-backend   # View only backend logs
echo   project.bat bash-backend   # Connect to backend container
echo   project.bat reset          # Delete everything and start fresh
echo.
echo Useful URLs:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5079
echo   API Docs:  http://localhost:5079/swagger
echo.
exit /b
