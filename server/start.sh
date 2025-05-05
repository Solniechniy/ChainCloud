#!/bin/bash

# Build and start the server using Docker Compose

echo "Starting ChainCloud Server..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker and try again."
  exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Creating .env file from example..."
  cp .env.example .env
  echo "Please edit the .env file with your configuration if needed."
fi

# Build and start the containers
docker-compose up -d --build

echo "ChainCloud Server is running!"
echo "- HTTP API: http://localhost:3000"
echo "- WebSocket: ws://localhost:8080"
echo "- MySQL: localhost:3306"
echo "- Redis: localhost:6379"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down" 