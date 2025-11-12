# Docker Deployment Guide

## Overview

Thread Node is designed to run as a containerized application with all prerequisites bundled in Docker images. This guide covers single-machine and distributed deployment scenarios.

## Container Architecture

### Multi-Container Setup

```
┌─────────────────────────────────────────────────────────────────┐
│                       Docker Host                                │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  thread-node-frontend (React)                          │     │
│  │  Port: 3000                                            │     │
│  └──────────────────┬─────────────────────────────────────┘     │
│                     │                                            │
│  ┌──────────────────┴─────────────────────────────────────┐     │
│  │  thread-node-backend (Node.js/Python)                  │     │
│  │  Port: 8000                                            │     │
│  │  - A2A Protocol Gateway                                │     │
│  │  - Agent Registry                                      │     │
│  │  - Task Orchestration                                  │     │
│  └──────────────┬───────────────┬─────────────────────────┘     │
│                 │               │                                │
│  ┌──────────────┴───┐  ┌────────┴──────┐  ┌──────────────┐     │
│  │  Redis           │  │  PostgreSQL   │  │  OLLAMA      │     │
│  │  Port: 6379      │  │  Port: 5432   │  │  Port: 11434 │     │
│  │  (Message Queue) │  │  (State Store)│  │  (LLM)       │     │
│  └──────────────────┘  └───────────────┘  └──────────────┘     │
│                                                                  │
│  Docker Network: thread-node-network                            │
│  Volumes: ollama-models, postgres-data, redis-data              │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Docker 24.0+
- Docker Compose 2.20+
- 32GB+ RAM (64GB recommended for large models)
- 100GB+ free disk space

### One-Command Deployment

```bash
# Clone repository
git clone https://github.com/yourusername/thread-node.git
cd thread-node

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

Access the application at `http://localhost:3000`

## Docker Compose Configuration

### Production Configuration

```yaml
# docker-compose.yml
version: '3.9'

services:
  # Frontend - React Canvas UI
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: production
    container_name: thread-node-frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:8000
      - REACT_APP_WS_URL=ws://backend:8000
    depends_on:
      - backend
    networks:
      - thread-node-network
    restart: unless-stopped

  # Backend - A2A Gateway & Orchestration
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: production
    container_name: thread-node-backend
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://thread:thread123@postgres:5432/threadnode
      - REDIS_URL=redis://redis:6379
      - OLLAMA_DEFAULT_INSTANCE=http://ollama:11434
      - OLLAMA_INSTANCES=http://ollama:11434
      - A2A_PROTOCOL_VERSION=0.3
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis
      - ollama
    networks:
      - thread-node-network
    volumes:
      - ./config:/app/config:ro
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # OLLAMA - Local LLM Inference
  ollama:
    image: ollama/ollama:latest
    container_name: thread-node-ollama
    ports:
      - "11434:11434"
    environment:
      - OLLAMA_HOST=0.0.0.0
      - OLLAMA_MODELS=/root/.ollama/models
    volumes:
      - ollama-models:/root/.ollama
    networks:
      - thread-node-network
    restart: unless-stopped
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
      interval: 30s
      timeout: 10s
      retries: 3

  # PostgreSQL - State Persistence
  postgres:
    image: postgres:16-alpine
    container_name: thread-node-postgres
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=threadnode
      - POSTGRES_USER=thread
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-thread123}
      - PGDATA=/var/lib/postgresql/data/pgdata
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d:ro
    networks:
      - thread-node-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U thread -d threadnode"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis - Message Queue
  redis:
    image: redis:7-alpine
    container_name: thread-node-redis
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-redis123}
    volumes:
      - redis-data:/data
    networks:
      - thread-node-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Model Initialization (runs once)
  ollama-init:
    image: ollama/ollama:latest
    container_name: thread-node-ollama-init
    depends_on:
      ollama:
        condition: service_healthy
    networks:
      - thread-node-network
    entrypoint: /bin/sh
    command:
      - -c
      - |
        echo "Pulling default models..."
        ollama pull llama3:8b
        ollama pull mistral:7b
        ollama pull codellama:13b
        echo "Models pulled successfully"
    environment:
      - OLLAMA_HOST=ollama:11434
    restart: "no"

networks:
  thread-node-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16

volumes:
  ollama-models:
    driver: local
  postgres-data:
    driver: local
  redis-data:
    driver: local
```

### Development Configuration

```yaml
# docker-compose.dev.yml
version: '3.9'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: development
    volumes:
      - ./frontend/src:/app/src
      - ./frontend/public:/app/public
      - /app/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:8000
      - CHOKIDAR_USEPOLLING=true
    command: npm start

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: development
    volumes:
      - ./backend/src:/app/src
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DEBUG=thread-node:*
    command: npm run dev

  # Lightweight OLLAMA for development
  ollama:
    deploy:
      resources:
        limits:
          memory: 16G

# Extend base configuration
extends:
  file: docker-compose.yml
  service: postgres

extends:
  file: docker-compose.yml
  service: redis
```

## Dockerfiles

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# Build stage
FROM base AS build
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim AS base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Development stage
FROM base AS development
RUN pip install -r requirements.txt
RUN pip install watchdog pytest pytest-cov
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Build stage
FROM base AS build
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Production stage
FROM python:3.11-slim AS production

WORKDIR /app

# Copy installed packages from build stage
COPY --from=build /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=build /app /app

# Create non-root user
RUN useradd -m -u 1000 threadnode && \
    chown -R threadnode:threadnode /app

USER threadnode

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

### Custom OLLAMA Dockerfile (with pre-loaded models)

```dockerfile
# ollama/Dockerfile
FROM ollama/ollama:latest

# Copy model files (if pre-downloading)
COPY models/ /root/.ollama/models/

# Startup script to pull models
COPY init-models.sh /init-models.sh
RUN chmod +x /init-models.sh

EXPOSE 11434

ENTRYPOINT ["/bin/sh", "-c", "/init-models.sh && ollama serve"]
```

```bash
# ollama/init-models.sh
#!/bin/sh

# Start OLLAMA in background
ollama serve &
OLLAMA_PID=$!

# Wait for OLLAMA to be ready
until curl -s http://localhost:11434/api/tags > /dev/null; do
  echo "Waiting for OLLAMA to start..."
  sleep 2
done

# Pull default models if not present
echo "Checking for models..."

if ! ollama list | grep -q "llama3:8b"; then
  echo "Pulling llama3:8b..."
  ollama pull llama3:8b
fi

if ! ollama list | grep -q "mistral:7b"; then
  echo "Pulling mistral:7b..."
  ollama pull mistral:7b
fi

if ! ollama list | grep -q "codellama:13b"; then
  echo "Pulling codellama:13b..."
  ollama pull codellama:13b
fi

echo "Models ready!"

# Keep OLLAMA running in foreground
wait $OLLAMA_PID
```

## Environment Configuration

### .env File

```bash
# .env
# Application
NODE_ENV=production
APP_NAME=thread-node
APP_VERSION=1.0.0

# Backend
JWT_SECRET=your-super-secret-jwt-key-change-this
API_PORT=8000

# Database
POSTGRES_DB=threadnode
POSTGRES_USER=thread
POSTGRES_PASSWORD=secure-postgres-password-here
DATABASE_URL=postgresql://thread:secure-postgres-password-here@postgres:5432/threadnode

# Redis
REDIS_PASSWORD=secure-redis-password-here
REDIS_URL=redis://:secure-redis-password-here@redis:6379

# OLLAMA
OLLAMA_DEFAULT_INSTANCE=http://ollama:11434
OLLAMA_INSTANCES=http://ollama:11434
OLLAMA_INSTANCE_NAMES=Local
OLLAMA_INSTANCE_PRIORITIES=100

# Default Models
OLLAMA_ARCHITECT_MODEL=llama3:70b
OLLAMA_BROKER_MODEL=mistral:7b
OLLAMA_WORKER_MODEL=codellama:13b
OLLAMA_VALIDATOR_MODEL=llama3:70b

# A2A Protocol
A2A_PROTOCOL_VERSION=0.3
A2A_MAX_MESSAGE_SIZE=10485760
A2A_TIMEOUT_MS=30000

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Security
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000

# GPU Support (optional)
NVIDIA_VISIBLE_DEVICES=all
NVIDIA_DRIVER_CAPABILITIES=compute,utility
```

## Deployment Commands

### Build Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend

# Build with no cache
docker-compose build --no-cache
```

### Start Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend

# Start with logs
docker-compose up

# Scale workers (future)
docker-compose up -d --scale worker=3
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop specific service
docker-compose stop backend
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Execute Commands

```bash
# Shell into backend
docker-compose exec backend /bin/sh

# Run database migration
docker-compose exec backend python manage.py migrate

# Pull new OLLAMA model
docker-compose exec ollama ollama pull llama3:70b

# Check OLLAMA models
docker-compose exec ollama ollama list
```

## Data Persistence

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect thread-node_ollama-models

# Backup volume
docker run --rm \
  -v thread-node_ollama-models:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/ollama-models-backup.tar.gz -C /data .

# Restore volume
docker run --rm \
  -v thread-node_ollama-models:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/ollama-models-backup.tar.gz -C /data
```

### Database Backup

```bash
# Backup PostgreSQL
docker-compose exec postgres pg_dump -U thread threadnode > backup.sql

# Restore PostgreSQL
docker-compose exec -T postgres psql -U thread threadnode < backup.sql
```

## GPU Support

### NVIDIA GPU Configuration

```yaml
# docker-compose.gpu.yml
services:
  ollama:
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all  # or specific number
              capabilities: [gpu]
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_DRIVER_CAPABILITIES=compute,utility
```

### Verify GPU Access

```bash
# Check GPU availability
docker-compose exec ollama nvidia-smi

# Check OLLAMA can use GPU
docker-compose exec ollama ollama run llama3:8b "test"
```

## Multi-Host Deployment

### Distributed OLLAMA Instances

```yaml
# docker-compose.distributed.yml
version: '3.9'

services:
  # Main Thread Node (no local OLLAMA)
  backend:
    environment:
      - OLLAMA_INSTANCES=http://gpu-server-1:11434,http://gpu-server-2:11434,http://cpu-server:11434
      - OLLAMA_INSTANCE_NAMES=GPU-1,GPU-2,CPU
      - OLLAMA_INSTANCE_PRIORITIES=100,95,80

# On GPU Server 1 (separate host)
# docker-compose -f docker-compose.ollama-only.yml up -d
services:
  ollama-gpu-1:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
```

## Monitoring

### Health Checks

```bash
# Check all services
docker-compose ps

# Health check script
#!/bin/bash
services=("frontend" "backend" "postgres" "redis" "ollama")

for service in "${services[@]}"; do
  health=$(docker-compose ps -q $service | xargs docker inspect --format='{{.State.Health.Status}}')
  echo "$service: $health"
done
```

### Prometheus Metrics (Optional)

```yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    networks:
      - thread-node-network

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
    networks:
      - thread-node-network
```

## Production Deployment Checklist

- [ ] Change all default passwords in `.env`
- [ ] Set `JWT_SECRET` to strong random value
- [ ] Configure CORS origins for your domain
- [ ] Set up SSL/TLS certificates (use reverse proxy)
- [ ] Configure backup strategy for volumes
- [ ] Set up monitoring and alerting
- [ ] Review resource limits for containers
- [ ] Pull required OLLAMA models before production
- [ ] Test failover scenarios
- [ ] Configure log rotation
- [ ] Set up firewall rules
- [ ] Document instance-specific configuration

## Troubleshooting

### Common Issues

**OLLAMA not starting**
```bash
# Check logs
docker-compose logs ollama

# Verify GPU drivers (if using GPU)
nvidia-smi

# Restart OLLAMA
docker-compose restart ollama
```

**Backend can't connect to OLLAMA**
```bash
# Check network
docker-compose exec backend ping ollama

# Verify OLLAMA is healthy
curl http://localhost:11434/api/tags
```

**Out of memory**
```bash
# Check container memory usage
docker stats

# Increase Docker memory limit (Docker Desktop)
# Settings > Resources > Memory > Increase to 64GB

# Or limit OLLAMA model size
docker-compose exec ollama ollama run llama3:8b  # Use smaller model
```

**Port conflicts**
```bash
# Check what's using the port
lsof -i :11434

# Change port in docker-compose.yml
ports:
  - "11435:11434"  # Use different external port
```

## Performance Tuning

### Resource Limits

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '4'
          memory: 8G
        reservations:
          cpus: '2'
          memory: 4G

  ollama:
    deploy:
      resources:
        limits:
          memory: 48G  # Adjust based on models
```

### Optimize Build Time

```bash
# Use BuildKit
export DOCKER_BUILDKIT=1
docker-compose build

# Parallel builds
docker-compose build --parallel
```

## Next Steps

1. Deploy basic stack with `docker-compose up -d`
2. Pull required OLLAMA models
3. Access UI at `http://localhost:3000`
4. Configure OLLAMA instances via UI
5. Create your first agent nodes
6. Monitor performance and adjust resources

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [OLLAMA Docker Hub](https://hub.docker.com/r/ollama/ollama)
- [System Architecture](./ARCHITECTURE.md)
- [OLLAMA Integration](./OLLAMA_INTEGRATION.md)
