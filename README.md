# Personal Expense Tracker

A production-oriented full-stack expense tracker using real authentication, real database records, REST APIs, protected routes, analytics, reports, budgets, exports, and spending insights generated only from user transaction history.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Zustand, Recharts
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose
- Auth: bcrypt password hashing, JWT access tokens, refresh-token cookies
- Exports: PDF and CSV
- Deployment targets: Vercel frontend, Render backend, MongoDB Atlas database

## No Mock Data Policy

This app does not create fake transactions, hardcoded expenses, or demo dashboard numbers. Dashboard, analytics, reports, exports, notifications, and AI spending suggestions are calculated from authenticated users' database records only.

Default categories are created for each user at signup because categories are required app configuration, not fake transaction data.

## Local Setup

1. Install dependencies:

```sh
npm install
```

2. Configure backend environment:

```sh
cp apps/api/.env.example apps/api/.env
```

Set `MONGODB_URI`, JWT secrets, client URL, and SMTP credentials for email verification and password reset delivery.

3. Configure frontend environment:

```sh
cp apps/web/.env.example apps/web/.env
```

4. Run both apps:

```sh
npm run dev
```

Frontend runs on `http://localhost:5173`.
Backend runs on `http://localhost:8080/api/v1`.

## Production Deployment

### MongoDB Atlas

Create a production MongoDB Atlas cluster and set `MONGODB_URI` in Render.

### Render Backend

- Root directory: `apps/api`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Required env vars are listed in `apps/api/.env.example`

### Vercel Frontend

- Root directory: `apps/web`
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_BASE_URL` to your Render API URL, for example `https://your-api.onrender.com/api/v1`

## Security Notes

- Passwords are hashed with bcrypt.
- Refresh tokens are stored hashed in MongoDB and sent as HTTP-only cookies.
- Access tokens are short-lived JWTs.
- APIs are protected by authentication and per-user ownership checks.
- Input is validated with Zod and sanitized before reaching controllers.
- Rate limiting, Helmet, CORS, HPP, Mongo sanitization, and centralized error handling are enabled.
- All core collections support soft delete.
