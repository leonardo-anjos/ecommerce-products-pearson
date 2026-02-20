#!/bin/bash

# EcommerceProducts Project - Quick Start Script
# This script handles common operations for the project

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_header() {
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Initialize .env files from .env.example
init_env_files() {
    if [ ! -f "$PROJECT_DIR/backend/.env" ] && [ -f "$PROJECT_DIR/backend/.env.example" ]; then
        cp "$PROJECT_DIR/backend/.env.example" "$PROJECT_DIR/backend/.env"
        print_success "Created backend/.env from .env.example"
    fi

    if [ ! -f "$PROJECT_DIR/webapp/.env" ] && [ -f "$PROJECT_DIR/webapp/.env.example" ]; then
        cp "$PROJECT_DIR/webapp/.env.example" "$PROJECT_DIR/webapp/.env"
        print_success "Created webapp/.env from .env.example"
    fi
}

# Initialize environment files before any command
init_env_files

# Commands
cmd_start() {
    print_header "Starting EcommerceProducts Services"

    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    docker compose up
}

cmd_start_detached() {
    print_header "Starting Services in Background"

    docker compose up -d
    print_success "Services started in background"

    # Wait for database to be healthy
    print_warning "Waiting for database to be healthy..."
    sleep 5

    # Run migrations
    print_warning "Applying database migrations..."
    docker compose exec -T backend dotnet ef database update

    print_success "All services are running!"
    echo ""
    echo "Access the application:"
    echo -e "  Frontend:  ${BLUE}http://localhost:3000${NC}"
    echo -e "  Backend:   ${BLUE}http://localhost:5079${NC}"
    echo -e "  API Docs:  ${BLUE}http://localhost:5079/swagger${NC}"
}

cmd_stop() {
    print_header "Stopping Services"

    docker compose stop
    print_success "Services stopped"
}

cmd_down() {
    print_header "Stopping and Removing Containers"

    read -p "Remove data volumes as well? (y/N) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker compose down -v
        print_success "Services removed (data deleted)"
    else
        docker compose down
        print_success "Services removed (data preserved)"
    fi
}

cmd_logs() {
    print_header "Service Logs"
    docker compose logs -f
}

cmd_logs_backend() {
    print_header "Backend Logs"
    docker compose logs -f backend
}

cmd_logs_frontend() {
    print_header "Frontend Logs"
    docker compose logs -f frontend
}

cmd_logs_database() {
    print_header "Database Logs"
    docker compose logs -f sqlserver
}

cmd_migrate() {
    print_header "Running Database Migrations"

    docker compose exec backend dotnet ef database update
    print_success "Migrations completed"
}

cmd_build() {
    print_header "Building Docker Images"

    docker compose build --no-cache
    print_success "Images built successfully"
}

cmd_rebuild() {
    print_header "Full Rebuild (Remove & Build)"

    docker compose down -v
    docker compose build --no-cache
    docker compose up
}

cmd_status() {
    print_header "Service Status"

    docker compose ps
}

cmd_bash_backend() {
    print_header "Opening Backend Container Shell"

    docker compose exec backend bash
}

cmd_bash_frontend() {
    print_header "Opening Frontend Container Shell"

    docker compose exec frontend sh
}

cmd_clean() {
    print_header "Cleanup - Docker Prune"

    read -p "This will remove unused Docker resources. Continue? (y/N) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker system prune -f
        print_success "Cleanup completed"
    fi
}

cmd_reset() {
    print_header "Full Reset"

    read -p "This will delete ALL containers, images, and data. Are you SURE? (y/N) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker compose down -v
        print_success "Full reset completed"
        print_warning "Run './project.sh start' to rebuild everything"
    fi
}

cmd_env() {
    print_header "Environment Variables"

    echo -e "${YELLOW}Backend Environment:${NC}"
    docker compose exec -T backend printenv | grep -E "ASPNETCORE|ConnectionStrings|Gemini" || true

    echo ""
    echo -e "${YELLOW}Frontend Environment:${NC}"
    docker compose exec -T frontend printenv | grep -E "NODE_ENV|NEXT_PUBLIC" || true
}

cmd_help() {
    cat << EOF
${BLUE}EcommerceProducts - Project Management Script${NC}

${GREEN}Usage:${NC} ./project.sh [command]

${GREEN}Commands:${NC}
  start              Start all services (interactive)
  start-bg          Start all services in background
  stop              Stop all services
  down              Stop and remove containers
  logs              View logs from all services
  logs-backend      View backend logs only
  logs-frontend     View frontend logs only
  logs-database     View database logs only
  migrate           Run database migrations
  build             Build Docker images
  rebuild           Full rebuild (remove + build + start)
  status            Show service status
  bash-backend      Open shell in backend container
  bash-frontend     Open shell in frontend container
  clean             Remove unused Docker resources
  reset             Full reset (⚠️  deletes everything)
  env               Show environment variables
  help              Show this help message

${GREEN}Examples:${NC}
  ./project.sh start-bg       # Start in background and apply migrations
  ./project.sh logs-backend   # View only backend logs
  ./project.sh bash-backend   # Connect to backend container
  ./project.sh reset          # Delete everything and start fresh

${GREEN}Useful URLs:${NC}
  Frontend:  http://localhost:3000
  Backend:   http://localhost:5079
  API Docs:  http://localhost:5079/swagger

EOF
}

# Main command routing
COMMAND="${1:-help}"

case "$COMMAND" in
    start)
        cmd_start
        ;;
    start-bg)
        cmd_start_detached
        ;;
    stop)
        cmd_stop
        ;;
    down)
        cmd_down
        ;;
    logs)
        cmd_logs
        ;;
    logs-backend)
        cmd_logs_backend
        ;;
    logs-frontend)
        cmd_logs_frontend
        ;;
    logs-database)
        cmd_logs_database
        ;;
    migrate)
        cmd_migrate
        ;;
    build)
        cmd_build
        ;;
    rebuild)
        cmd_rebuild
        ;;
    status)
        cmd_status
        ;;
    bash-backend)
        cmd_bash_backend
        ;;
    bash-frontend)
        cmd_bash_frontend
        ;;
    clean)
        cmd_clean
        ;;
    reset)
        cmd_reset
        ;;
    env)
        cmd_env
        ;;
    help|--help|-h)
        cmd_help
        ;;
    *)
        print_error "Unknown command: $COMMAND"
        echo ""
        cmd_help
        exit 1
        ;;
esac
