# Banke Bihari Pujan Samagri — Production Deployment

## Before going live
1. Create a Turso database and set `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`.
2. Set a strong `ADMIN_PASSWORD` (12+ characters).
3. Set a random `SESSION_SECRET` (32+ characters).
4. Configure `UPI_ID` and `WHATSAPP_NUMBER`.
5. Connect an SMS provider through `SMS_WEBHOOK_URL`. The endpoint receives JSON:
   `{ "phone": "10-digit-number", "otp": "6-digit-code", "app": "Banke Bihari Pujan Samagri" }`.
6. Add AI API keys only if the AI feature is enabled.
7. Use HTTPS on the final custom domain.

## Render
The included `render.yaml` can be used as a starting point. Set all `sync: false` secrets in Render's Environment settings.

## Health check
`GET /health` returns a small JSON health response for hosting monitors.

## Important
The current UPI flow is a UPI deep-link/manual confirmation flow, not a verified payment-gateway integration. For automatic payment confirmation, add Razorpay/another gateway with server-side signature verification and webhooks before enabling it for customers.
