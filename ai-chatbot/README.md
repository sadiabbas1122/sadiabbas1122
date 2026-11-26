# Sadi AI Business Chatbot — MVP

A small-business website chatbot starter built with a static demo page and a Cloudflare Worker backend. The backend calls Google's Gemini API without exposing the API key in browser code.

## What this MVP includes
- Website chat interface for a business FAQ assistant.
- Cloudflare Worker API at `/api/chat`.
- Gemini API key stored as a Worker secret.
- Business name and approved knowledge configured server-side.
- Origin allow-list, input length limits, bounded conversation history and basic error handling.
- Optional embeddable floating chat widget for a client's website.
- No chat transcript database in this MVP.

## Important scope
This is a **single-business pilot**, not yet a multi-tenant SaaS. Deploy a separate Worker/configuration for each pilot client until tenant authentication, isolated knowledge storage, usage metering, rate limiting and billing are implemented and security-tested. Do not promise unlimited messages or guaranteed AI accuracy.

## Local setup
1. Install Node.js LTS and Wrangler: `npm install`.
2. Copy `wrangler.toml.example` to `wrangler.toml`.
3. Set a unique `ALLOWED_ORIGINS` value in `wrangler.toml` for local testing, e.g. `http://localhost:8787`.
4. Add your Gemini API key as a secret: `npx wrangler secret put GEMINI_API_KEY`.
5. Run: `npm run dev`.
6. Open the local URL and test questions relevant to the configured business.

## Deploy to Cloudflare
1. Create/sign in to a Cloudflare account and install Wrangler.
2. Configure `wrangler.toml` with a unique Worker name and the client's website origin(s).
3. Set the secret: `npx wrangler secret put GEMINI_API_KEY`.
4. Deploy: `npm run deploy`.
5. Test the Worker URL and then add the widget script to the client's site.
6. Configure the business's approved FAQ and service information in Worker variables. Never put private customer records, passwords, payment details or confidential data in the public prompt.

## Widget installation
Add this to the client's website after deployment (replace the endpoint and business name):

```html
<script
  src="https://YOUR-WORKER.workers.dev/chat-widget.js"
  data-endpoint="https://YOUR-WORKER.workers.dev/api/chat"
  data-business-name="Your Business"
  defer
></script>
```

The Worker must allow the client's exact website origin in `ALLOWED_ORIGINS`.

## Environment variables
- `GEMINI_API_KEY`: secret; set with Wrangler, never commit it.
- `GEMINI_MODEL`: model identifier, default `gemini-2.5-flash`.
- `BUSINESS_NAME`: public business name used by the assistant.
- `BUSINESS_INFO`: approved public FAQs, products, opening hours and policies.
- `ALLOWED_ORIGINS`: comma-separated exact origins, e.g. `https://example.com,http://localhost:8787`.

## Before charging a client
Add and test per-client data isolation, server-side rate limiting, abuse controls, usage logs that avoid sensitive message content, a privacy notice, retention/deletion policy, uptime monitoring and a clear monthly usage cap. Confirm the current Gemini pricing and quota for the chosen account before quoting clients.
