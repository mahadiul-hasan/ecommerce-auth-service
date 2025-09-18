# Auth Service

Authentication microservice for the multi-service application.

## Base URL:

http://localhost:5002/api

## Endpoints

### Auth

-   **POST /auth/login**: Login with email & password
-   **POST /auth/refresh-token**: Refresh access token
-   **POST /auth/forgot-password**: Request password reset email
-   **POST /auth/reset-password**: Reset password
-   **POST /auth/logout**: Logout user

### OAuth (Google)

-   **GET /auth/oauth/google**: Redirect to Google login
-   **GET /auth/oauth/google/callback**: Google OAuth callback
-   **GET /auth/oauth/success**: OAuth success redirect (frontend)
-   **GET /auth/oauth/failure**: OAuth failure redirect (frontend)

## Environment Variables

-   `DATABASE_URL` – PostgreSQL connection string
-   `JWT_ACCESS_SECRET` – JWT access token secret
-   `JWT_REFRESH_SECRET` – JWT refresh token secret
-   `FRONTEND_URL` – URL of the frontend for OAuth redirects
-   `RABBITMQ_URL` – RabbitMQ connection URL

## Running Locally

```bash
npm install
npm run prisma:migrate
npm run dev
```
