# 💈 BookEase Barber

A Telegram-based booking system with a modern admin panel for barber shops and service businesses.

Customers can book appointments directly through Telegram, while admins manage bookings, services, and reports from a web dashboard.

---

## 📌 Project Overview

**BookEase Barber** helps businesses handle appointment booking in a simple and organized way.

Instead of taking bookings manually, customers use the Telegram bot to choose a service, select a date and time, and submit their request. Admins can then review, confirm, or reject bookings from the admin panel.

### Main Benefits

* Easy booking through Telegram
* Central dashboard for admins
* Booking status management
* Service management
* Excel export for reports
* Docker-ready deployment

---

## 🧰 Tech Stack

| Part        | Technology                    |
| ----------- | ----------------------------- |
| Bot         | Python, aiogram               |
| Backend     | FastAPI, SQLAlchemy Async     |
| Database    | PostgreSQL                    |
| Admin Panel | Next.js, React, TypeScript    |
| Styling     | Tailwind CSS                  |
| Auth        | JWT                           |
| Export      | OpenPyXL                      |
| Deployment  | Docker, Docker Compose, nginx |
| Migrations  | Alembic                       |

---

## 🏗️ Architecture

The project has three main application layers:

```text
Telegram Bot  →  FastAPI Backend  →  PostgreSQL Database
                      ↑
                      |
              Next.js Admin Panel
```

### 1. Telegram Bot

The bot is used by customers.

It handles the booking conversation:

* Shows available services
* Collects booking date and time
* Gets customer name and phone number
* Sends the booking request to the backend
* Shows the customer’s bookings
* Sends status updates after admin review

The bot does not connect directly to the database.
It communicates with the backend API.

---

### 2. FastAPI Backend

The backend is the core of the system.

It handles:

* Booking creation
* Booking validation
* Admin authentication
* Service management
* Booking status updates
* Dashboard statistics
* Excel export
* Database communication
* Telegram customer notifications

Both the Telegram bot and the admin panel use this backend.

---

### 3. Admin Panel

The admin panel is used by business staff.

It allows admins to:

* Log in securely
* View all bookings
* Filter and search bookings
* Confirm or reject appointments
* Manage services
* Export booking data

---

### 4. PostgreSQL Database

The database stores all main system data:

* Users
* Services
* Bookings
* Admin accounts
* Booking logs

---

## 🔄 Data Flow

```text
Customer
   ↓
Telegram Bot
   ↓
FastAPI Backend
   ↓
PostgreSQL Database
   ↑
Admin Panel
```

### Step-by-Step Flow

1. The customer starts the Telegram bot.
2. The bot requests active services from the backend.
3. The customer selects a service, date, and time.
4. The bot sends the booking request to the backend.
5. The backend saves the booking in PostgreSQL with `pending` status.
6. The admin opens the dashboard and reviews the booking.
7. The admin confirms or rejects the booking.
8. The backend updates the database.
9. The customer receives a Telegram notification.

---

## ✨ Features

## Telegram Bot

* `/start` command
* Service selection
* Date and time selection
* Customer name and phone collection
* Booking confirmation
* View personal bookings
* Telegram status notifications
* Persian-language user interface

---

## Admin Panel

* Secure admin login
* Booking dashboard
* Search and filters
* Booking status management
* Service management
* Booking statistics
* Excel export
* Clean responsive UI

---

## Backend

* REST API with FastAPI
* Async database access
* JWT authentication
* Booking validation
* Admin-protected routes
* Health check endpoint
* Docker support
* Alembic migrations

---

## 📁 Project Structure

```text
Batrber-Shop/
│
├── api/                  # FastAPI backend
│   ├── models/           # Database models
│   ├── routers/          # API routes
│   ├── schemas/          # Pydantic schemas
│   ├── services/         # Business logic
│   ├── migrations/       # Alembic migrations
│   └── main.py           # API entry point
│
├── bot/                  # Telegram bot
│   ├── handlers.py       # Bot commands and booking flow
│   ├── api_client.py     # Backend API client
│   ├── states.py         # Bot conversation states
│   └── main.py           # Bot entry point
│
├── frontend/             # Next.js admin panel
│   └── src/              # Pages, components, and API logic
│
├── docker/               # Docker and nginx config
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── DEPLOYMENT.md
```

---

## 🚀 Setup Instructions

## 1. Clone the Repository

```bash
git clone https://github.com/thisiscodecode/Batrber-Shop.git
cd Batrber-Shop
```

---

## 2. Create `.env` File

Create a `.env` file in the project root:

```env
POSTGRES_USER=bookinguser
POSTGRES_PASSWORD=changeme
POSTGRES_DB=bookingdb

DATABASE_URL=postgresql+asyncpg://bookinguser:changeme@postgres:5432/bookingdb
DATABASE_URL_SYNC=postgresql://bookinguser:changeme@postgres:5432/bookingdb

SECRET_KEY=change_this_to_a_secure_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=30

BOT_TOKEN=your_telegram_bot_token
API_URL=http://localhost:8000

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

CORS_ORIGINS=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 3. Run with Docker

```bash
docker compose -f docker-compose.dev.yml up --build
```

---

## 4. Open the Services

| Service      | URL                                |
| ------------ | ---------------------------------- |
| Admin Panel  | `http://localhost:3000`            |
| Backend API  | `http://localhost:8000`            |
| Health Check | `http://localhost:8000/api/health` |

To test the Telegram bot, open the bot in Telegram and send:

```text
/start
```

---

## 🔐 Default Admin Login

```text
Username: admin
Password: admin123
```

> Change the default credentials before production use.

---

## 📤 Export

Admins can export booking data to Excel for reports, records, or offline review.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👥 Author

Built by the **codecode** team.
