# Auth Service

**Auth Service** is a microservice responsible for **user authentication and authorization** in a **multivendor e-commerce application**. It is built with **Node.js, TypeScript, Prisma, PostgreSQL, and JWT**. The service supports:

-   Local strategy (email/password) and OAuth login (Google)
-   Role-based access control (RBAC)
-   JWT-based access and refresh tokens
-   Password reset flow (forgot/reset password)
-   Logout and token refresh
-   Integration with Notification Service via RabbitMQ for emails
-   Centralized error logging

---

## Table of Contents

1. [Architecture Diagram](#architecture-diagram)
2. [Features](#features)
3. [Folder Structure](#folder-structure)
4. [Installation](#installation)
5. [Environment Variables](#environment-variables)
6. [Scripts](#scripts)
7. [Usage](#usage)
8. [API Endpoints](#api-endpoints)
9. [Publishing Messages](#publishing-messages)
10. [Contributing](#contributing)
11. [License](#license)

---

## Architecture Diagram

```text
            +------------------+
            |   Frontend App   |
            +--------+---------+
                     |
                     | HTTP API Calls
                     v
            +------------------+
            |   API Gateway    |
            +--------+---------+
                     |
                     | Proxy requests
                     v
            +------------------+
            |   Auth Service   |
            +--------+---------+
                     |
         +-----------+-----------+
         |                       |
         v                       v
  PostgreSQL (Users & Roles)    RabbitMQ
                                   |
                                   v
                         Notification Service
```

## Features

1. Local Strategy: email/password authentication

2. OAuth login: Google

3. Role-Based Access Control (one user → one role; roles → multiple permissions)

4. JWT Access & Refresh Tokens

5. Token refresh (`/api/auth/refresh-token`)

6. Password reset flow (`/api/auth/forgot-password` & `/api/auth/reset-password`)

7. Logout (`/api/auth/logout`)

8. RabbitMQ integration to trigger emails via Notification Service

9. Centralized error logging with unique error IDs

10. Fully decoupled microservice architecture

## Folder Structure

```
auth-service/
│
├─ src/
│   ├─ config/
│   │   └─ index.ts               # Environment variables and config
│   │
│   ├─ controllers/
│   │   └─ auth.controller.ts     # Local auth endpoints
│   │   └─ oauth.controller.ts    # OAuth login endpoints
│   │
│   ├─ routes/
│   │   ├─ auth.routes.ts         # Local auth routes
│   │   └─ oauth.routes.ts        # OAuth routes
│   │   └─ index.ts               # Route aggregator
│   │
│   ├─ services/
│   │   ├─ user.service.ts        # Local strategy user management
│   │   └─ oauth.service.ts       # OAuth login logic
│   │   └─ jwtHelpers.ts          # Access/Refresh token utilities
│   │
│   ├─ shared/
│   │   └─ prisma.ts              # Prisma client
│   │   └─ sendResponse.ts        # Standardized API responses
│   │
│   ├─ rabbitmq/
│   │   └─ publisher.ts           # Publish messages to Notification Service
│   │   └─ consumer.ts            # Consume messages if needed
│   │
│   ├─ middlewares/
│   │   └─ globalErrorHandler.ts  # Global error handling
│   │   └─ catchAsync.ts
│   │
│   ├─ swagger/
│   │   └─ swagger.ts             # Swagger setup for API documentation
│   │
│   └─ app.ts                      # Express app setup
│
├─ prisma/
│   └─ schema.prisma
├─ package.json
├─ tsconfig.json
├─ .env.example
└─ README.md
```

## Installation

```
# Clone repository
git clone <repo-url>
cd auth-service

# Install dependencies
npm install
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```
# Database
DATABASE_URL=postgresql_url_here

# Server
PORT=5002
NODE_ENV=development

# JWT
JWT_ACCESS_TOKEN_SECRET=replace_with_strong_secret
JWT_REFRESH_TOKEN_SECRET=replace_with_strong_secret_refresh
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=30d

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=5267
REDIS_DB=0
REDIS_CACHE_TTL=3600

# google auth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# rabbitmq
RABBITMQ_URI=amqp://localhost:5672
```

## Scripts

```
# Development
npm run dev          # start dev server
npm run dev:oauth    # start only OAuth workflow (optional)

# Build
npm run build

# Production
npm start
```

## Usage

1. **Start PostgreSQL**

2. **Run Auth Service**

```npm run dev

```

3. Use Swagger UI: `http://localhost:5002/api/docs`
4. **Local login**

```
POST /api/auth/login
Body:
{
  "email": "user@example.com",
  "password": "secret"
}
```

5. **OAuth login**

```
GET /api/auth/oauth/google
```

## API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/register` | POST | Register new user (local strategy) |
| `/api/auth/login` | POST | Login with email/password |
| `/api/auth/refresh-token` | POST | Refresh access token |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Reset password using token |
| `/api/auth/logout` | POST | Logout user and invalidate refresh token |
| `/api/auth/oauth/google` | GET | Redirect to Google OAuth login |
| `/api/auth/oauth/google/callback` | GET | Google OAuth callback |

## Publishing Messages

Auth Service publishes messages to **Notification Service** via RabbitMQ:

```
import { publishCustomerCreate } from '../rabbitmq/publisher';

await publishCustomerCreate({
  user_id: user.id,
  name: user.name
});
```

## Contributing

-   Use TypeScript with strict typing.

-   Maintain folder structure.

-   Test RabbitMQ integration and database migrations before committing.

-   Follow linting and code style rules.

## License

MIT License © 2025

```
---

This README.md is styled similarly to your Notification Service README and includes:

- Architecture diagram
- Folder structure
- API endpoints
- RabbitMQ integration details
- Scripts, environment variables, and usage examples

---

If you want, I can also **create a visual flow diagram for Auth Service with OAuth, local login, and RabbitMQ integration**, so your README looks professional and easy to understand.

Do you want me to do that?
```
