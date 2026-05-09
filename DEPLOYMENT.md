# Deployment Guide

This document outlines the deployment process for the Music AI Trainer application.

## Prerequisites

- Docker and Docker Compose installed on your server
- Ubuntu Server (or compatible Linux distribution) with Proxmox virtualization support
- Basic knowledge of container orchestration and networking

## Environment Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd music-ai-trainer
```

### 2. Configure Environment Variables

Create a `.env` file in the project root with:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@db:5432/music_ai_trainer

# Redis Configuration
REDIS_URL=redis://redis:6379/0

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Build and Deploy

```bash
docker-compose up --build
```

## Production Considerations

### SSL/TLS Setup

For production, configure reverse proxy with Nginx or Traefik for HTTPS:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Performance Optimization

#### Backend Optimization
1. Use GPU acceleration for audio processing when available:
   ```bash
   # For M-series chips (macOS)
   export USE_MPS=1
   ```

2. Adjust container resource limits in docker-compose.yml:
   ```yaml
   backend:
     # ... existing config
     deploy:
       resources:
         limits:
           memory: 4G
           cpus: '2.0'
   ```

#### Frontend Optimization
1. Build for production:
```bash
cd frontend
yarn build
```

2. Serve with optimized settings:
```bash
yarn start
```

## Infrastructure Requirements

### Hardware Specifications (Minimum)
- CPU: 4 cores minimum
- RAM: 8GB minimum
- Storage: 50GB SSD for application and database

### Docker Resources
The application uses the following services:

1. **Frontend**: Next.js application on port 3000
2. **Backend**: FastAPI API server on port 8000
3. **Database**: PostgreSQL (PostgreSQL) on port 5432
4. **Cache**: Redis on port 6379

## Monitoring and Maintenance

### Logs Access
```bash
docker-compose logs -f
```

### Database Backup
```bash
# Create a backup of the database
docker exec music-ai-trainer_db_1 pg_dump -U user music_ai_trainer > backup.sql
```

### Scaling Services
To scale services:
```bash
docker-compose up --scale backend=3 --scale frontend=2
```

## Troubleshooting

### Common Issues and Solutions

1. **Port conflicts**: Ensure ports 3000, 8000, 5432, 6379 are available.
2. **Permission errors**: Check file permissions for mounted volumes.
3. **Network issues**: Verify network configuration in docker-compose.yml.

### Health Checks

The application exposes health endpoints:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

## Backup Strategy

1. Regular database dumps
2. Container image snapshots
3. Configuration file backups

## Security Considerations

1. Use strong passwords for database and Redis
2. Implement rate limiting on API endpoints
3. Keep container images updated with security patches
4. Configure firewall to restrict access to only necessary ports