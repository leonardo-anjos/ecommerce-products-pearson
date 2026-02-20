#!/bin/bash

# Initialize .env files from .env.example if they don't exist
# This script is called before starting any services

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to create .env from .env.example
init_env_file() {
    local dir=$1
    local env_file="$dir/.env"
    local env_example="$dir/.env.example"

    if [ ! -f "$env_example" ]; then
        echo -e "${YELLOW}⚠ No .env.example found in $dir${NC}"
        return 1
    fi

    if [ ! -f "$env_file" ]; then
        cp "$env_example" "$env_file"
        echo -e "${GREEN}✓ Created $env_file from .env.example${NC}"
        return 0
    else
        echo -e "${GREEN}✓ $env_file already exists${NC}"
        return 0
    fi
}

# Initialize backend .env
init_env_file "$PROJECT_DIR/backend"

# Initialize webapp .env
init_env_file "$PROJECT_DIR/webapp"

echo -e "${GREEN}Environment files ready${NC}"
