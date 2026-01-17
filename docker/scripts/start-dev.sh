#!/bin/bash

# Script to start development environment with Docker Compose

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Task Manager development environment...${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Warning: .env file not found. Creating from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}.env file created. Please review and update if needed.${NC}"
    else
        echo -e "${YELLOW}Warning: .env.example not found. Using default values.${NC}"
    fi
fi

# Check if docker-compose.dev.yml exists
if [ ! -f docker-compose.dev.yml ]; then
    echo -e "${YELLOW}Error: docker-compose.dev.yml not found!${NC}"
    exit 1
fi

# Start services
echo -e "${GREEN}Starting Docker Compose services...${NC}"
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be healthy
echo -e "${GREEN}Waiting for services to be ready...${NC}"
sleep 5

# Check service status
echo -e "${GREEN}Checking service status...${NC}"
docker-compose -f docker-compose.dev.yml ps

# Load environment variables if .env exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo -e "${GREEN}Development environment started successfully!${NC}"
echo -e "${GREEN}API: http://localhost:${API_PORT:-3000}${NC}"
echo -e "${GREEN}MongoDB: localhost:${MONGODB_PORT:-27017}${NC}"
echo -e "${GREEN}Redis: localhost:${REDIS_PORT:-6379}${NC}"
echo ""
echo -e "${YELLOW}To view logs: docker-compose -f docker-compose.dev.yml logs -f${NC}"
echo -e "${YELLOW}To stop: docker-compose -f docker-compose.dev.yml down${NC}"
