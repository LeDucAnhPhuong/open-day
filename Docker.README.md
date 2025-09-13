# Docker Setup for CSS Battle Frontend

This document explains how to run the CSS Battle frontend using Docker.

## Prerequisites

- Docker Desktop installed
- Docker Compose installed

## Files Overview

- `Dockerfile` - Production build configuration
- `Dockerfile.dev` - Development build configuration with hot reload
- `docker-compose.yml` - Docker Compose configuration
- `.dockerignore` - Files to ignore during Docker build
- `.env.production` - Production environment variables
- `.env.development` - Development environment variables

## Quick Start

### Production Build

```bash
# Build and run production container
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# Stop the services
docker-compose down
```

The application will be available at `http://localhost:3000`

### Development Build (with hot reload)

```bash
# Run development container with hot reload
docker-compose --profile dev up frontend-dev --build

# Or run in detached mode
docker-compose --profile dev up -d frontend-dev --build
```

The development server will be available at `http://localhost:3001`

## Environment Configuration

### Production Environment

Copy `.env.production` and modify as needed:

```bash
cp .env.production .env.production.local
```

Edit the `.env.production.local` file:

```env
# Production Environment Variables
NODE_ENV=production

# API Configuration - Change to your production URLs
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=wss://api.yourdomain.com

# Application Configuration
NEXT_TELEMETRY_DISABLED=1
```

### Development Environment

Copy `.env.development` and modify as needed:

```bash
cp .env.development .env.development.local
```

## Network Configuration

The frontend connects to the backend through a Docker network:

```yaml
networks:
  css-battle-network:
    driver: bridge
    external: true
```

Make sure to create the network first:

```bash
docker network create css-battle-network
```

## Build Commands

### Build Production Image

```bash
docker build -t css-battle-frontend .
```

### Build Development Image

```bash
docker build -f Dockerfile.dev -t css-battle-frontend-dev .
```

### Run Individual Containers

#### Production Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:4000 \
  -e NEXT_PUBLIC_SOCKET_URL=wss://localhost:4000 \
  css-battle-frontend
```

#### Development Container

```bash
docker run -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e NEXT_PUBLIC_API_URL=http://localhost:4000 \
  -e NEXT_PUBLIC_SOCKET_URL=wss://localhost:4000 \
  css-battle-frontend-dev
```

## Full Stack Setup

To run both frontend and backend together:

1. Create the shared network:
```bash
docker network create css-battle-network
```

2. Start the backend services first
3. Start the frontend services:
```bash
docker-compose up --build
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000 and 3001 are not in use
2. **Network issues**: Ensure the `css-battle-network` exists
3. **Environment variables**: Check that API URLs are correctly set

### Logs

View logs for debugging:

```bash
# View logs
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f frontend

# View development logs
docker-compose logs frontend-dev
```

### Clean Up

Remove containers and images:

```bash
# Stop and remove containers
docker-compose down

# Remove images
docker rmi css-battle-frontend css-battle-frontend-dev

# Remove volumes
docker-compose down -v

# Full cleanup
docker system prune -a
```

## Performance Tips

1. **Multi-stage builds**: The Dockerfile uses multi-stage builds to minimize image size
2. **Layer caching**: Dependencies are copied separately for better layer caching
3. **Standalone output**: Next.js standalone output reduces image size significantly
4. **Alpine base**: Using Alpine Linux for smaller base image

## Security Notes

1. **Non-root user**: The production container runs as a non-root user
2. **Environment variables**: Sensitive data should be passed via environment variables
3. **Image scanning**: Regularly scan images for vulnerabilities

```bash
# Scan for vulnerabilities
docker scout cves css-battle-frontend
```