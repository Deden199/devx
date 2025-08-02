# Operational Confidence Bundle

An MVP for monitoring, reconciliation, and alerting.

## Setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate --name init
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Simulate an alert

Send a POST request to `/alerts`:

```bash
curl -X POST http://localhost:4000/alerts -H 'Content-Type: application/json' -d '{"message":"Test alert"}'
```

## Trigger reconciliation

```bash
curl -X POST http://localhost:4000/reconcile
```

## Toggle subscription

```bash
curl -X POST http://localhost:4000/onboarding/subscribe -H 'Content-Type: application/json' -d '{"clientId":"abc"}'
```

```bash
curl -X POST http://localhost:4000/onboarding/unsubscribe -H 'Content-Type: application/json' -d '{"clientId":"abc"}'
```

## Deployment

Build the backend and frontend, then deploy using your preferred platform. Ensure the `DATABASE_URL` and other
environment variables are set in production.

Use `npm run build` for both packages and start the backend with `node dist/app.js`.
