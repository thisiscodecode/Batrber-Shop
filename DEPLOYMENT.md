# Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Production Deployment](#production-deployment)
4. [Environment Variables Reference](#environment-variables-reference)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Local Development

- Docker Engine 24.0+ and Docker Compose v2.20+
- Git
- A Telegram Bot Token (get one from [@BotFather](https://t.me/BotFather))

### Production Deployment

- Ubuntu 22.04 LTS VPS (minimum 2 vCPU / 2GB RAM)
- Docker Engine 24.0+ and Docker Compose v2.20+
- A registered domain name pointed to the VPS IP (A record)
- Port 80 and 443 open on the VPS firewall

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd telegram-booking-bot
```

### 2. Create Environment File

```bash
cp .env.example .env
```

Edit `.env` and set at minimum:

```bash
BOT_TOKEN=your_token_from_botfather
SECRET_KEY=any_random_string_at_least_32_chars
POSTGRES_PASSWORD=dev_password
```

### 3. Start All Services

```bash
docker compose -f docker-compose.dev.yml up --build
```

This starts:

| Service   | URL                        | Description                     |
|-----------|----------------------------|---------------------------------|
| API       | http://localhost:8000/docs | FastAPI Swagger documentation   |
| Bot       | (polling mode)             | Telegram bot process            |
| Frontend  | http://localhost:3000       | Admin Dashboard                 |
| Nginx     | http://localhost            | Reverse proxy                   |
| PostgreSQL| localhost:5432             | Database                        |

### 4. Verify Services

- Open http://localhost:3000 — you should see the login page
- Open http://localhost:8000/api/health — should return `{"status": "ok"}`
- Open http://localhost:8000/docs — FastAPI interactive docs

### 5. Default Admin Login

- **Username:** admin
- **Password:** admin123

(Change these in `.env` before production deployment)

### 6. Stop Services

```bash
docker compose -f docker-compose.dev.yml down
```

To also remove the database volume:

```bash
docker compose -f docker-compose.dev.yml down -v
```

---

## Production Deployment

### 1. Provision the VPS

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker && systemctl start docker

# Install Docker Compose
apt install docker-compose-plugin -y
```

### 2. Deploy the Application

```bash
# Clone the repository
cd /opt
git clone <repository-url> telegram-booking-bot
cd telegram-booking-bot

# Create production environment file
cp .env.example .env.prod
```

Edit `.env.prod` with production values:

```bash
# IMPORTANT: Use strong, unique values for production!
POSTGRES_USER=bookinguser
POSTGRES_PASSWORD=<generate_strong_password>
POSTGRES_DB=bookingdb
DATABASE_URL=postgresql+asyncpg://bookinguser:<password>@postgres:5432/bookingdb
DATABASE_URL_SYNC=postgresql://bookinguser:<password>@postgres:5432/bookingdb
BOT_TOKEN=<your_bot_token>
SECRET_KEY=<generate_strong_32_char_key>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<generate_strong_password>
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
CORS_ORIGINS=https://yourdomain.com
DOMAIN=yourdomain.com
```

### 3. Configure Nginx for SSL

Replace `yourdomain.com` in `docker/nginx.prod.conf` with your actual domain (or set it via environment variable substitution).

### 4. Obtain SSL Certificate

```bash
# Start services without SSL first
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d nginx

# Get certificate (replace yourdomain.com)
docker compose -f docker-compose.prod.yml --env-file .env.prod run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  -d yourdomain.com --agree-tos -m your@email.com

# Restart nginx with SSL
docker compose -f docker-compose.prod.yml --env-file .env.prod restart nginx
```

### 5. Start All Services

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

### 6. Verify Deployment

```bash
# Check all services are running
docker compose -f docker-compose.prod.yml ps

# Check API health
curl -k https://yourdomain.com/api/health

# Check frontend
curl -k -o /dev/null -w "%{http_code}" https://yourdomain.com
```

### 7. SSL Auto-Renewal

The certbot service runs in the container and auto-renews certificates every 12 hours. Certbot checks for renewal every 12 hours and renews when the certificate has less than 30 days remaining.

### 8. Set Up Firewall

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_USER` | Database username | `bookinguser` |
| `POSTGRES_PASSWORD` | Database password | (must set) |
| `POSTGRES_DB` | Database name | `bookingdb` |
| `DATABASE_URL` | Async database URL | auto-constructed |
| `BOT_TOKEN` | Telegram Bot API token | (must set) |
| `SECRET_KEY` | JWT signing secret (32+ chars) | (must set) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT access token lifetime | `60` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | JWT refresh token lifetime | `30` |
| `ADMIN_USERNAME` | Default admin username | `admin` |
| `ADMIN_PASSWORD` | Default admin password | `admin123` |
| `NEXT_PUBLIC_API_URL` | Frontend API base URL | `http://localhost:8000/api` |
| `DOMAIN` | Production domain (for Nginx) | (must set for prod) |
| `WEBHOOK_URL` | Telegram webhook URL (prod only) | (empty = polling mode) |

---

## Troubleshooting

### Bot Not Starting

```bash
docker compose logs bot
```

Ensure `BOT_TOKEN` is set correctly in `.env`.

### Database Connection Refused

```bash
docker compose logs postgres
```

Ensure the postgres health check passes before API starts.

### Frontend Shows "Network Error"

1. Ensure the API is running: `curl http://localhost:8000/api/health`
2. Check `NEXT_PUBLIC_API_URL` matches your API URL
3. Check CORS_ORIGINS includes your frontend URL

### SSL Certificate Issues

```bash
# Check certificate status
docker compose -f docker-compose.prod.yml run --rm certbot certificates

# Force renewal
docker compose -f docker-compose.prod.yml run --rm certbot renew --force-renewal
```

### Reset Everything

```bash
docker compose -f docker-compose.dev.yml down -v --rmi all
docker compose -f docker-compose.dev.yml up --build
```

---

## Quick Commands Reference

```bash
# Development
docker compose -f docker-compose.dev.yml up --build
docker compose -f docker-compose.dev.yml down

# Production
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
docker compose -f docker-compose.prod.yml --env-file .env.prod down

# Logs
docker compose -f docker-compose.dev.yml logs -f api
docker compose -f docker-compose.dev.yml logs -f bot

# Database access
docker compose -f docker-compose.dev.yml exec postgres psql -U bookinguser -d bookingdb
```
