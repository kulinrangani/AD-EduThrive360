# EM360 Admin

Super-admin console for organizations, quiz builder, and platform analytics.

## Setup

```bash
cp .env.example .env   # VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

Default dev URL: `http://localhost:5174` (add to backend `CORS_ORIGINS`).

## Features

- Organizations (schools & corporates): create, edit, archive, org codes
- Quiz builder: groups, questions, quotes, publish
- Dashboard, wellness, alerts, reports, users — wired to live analytics APIs
- Organization detail → **Quiz results** tab for member outcomes

## Auth

Super admin only. Forgot password calls `POST /auth/forgot-password`; in development the API logs a reset token to the console.
