# next-mart (GoCart)

> Multi-vendor e-commerce marketplace built with Next.js — featuring AI-assisted product listing (Gemini 2.5 Flash), Stripe + COD payments, role-based access, and a modern, scalable stack.

---

## Table of Contents

* [Demo](#demo)
* [Highlights](#highlights)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Architecture / How it works](#architecture--how-it-works)
* [Getting Started (Local Development)](#getting-started-local-development)
* [Environment Variables](#environment-variables)
* [Prisma + Neon — recommended local config](#prisma--neon---recommended-local-config)
* [Important API routes](#important-api-routes)
* [Common Issues & Troubleshooting](#common-issues--troubleshooting)
* [Deploying (Vercel)](#deploying-vercel)
* [Contributing](#contributing)
* [License & Contact](#license--contact)

---

## Demo

Live demo: [https://next-mart-beryl.vercel.app/](https://next-mart-beryl.vercel.app/)

---

## Highlights

* Sellers upload a product **image** and an AI (Gemini 2.5 Flash) generates an SEO-friendly **title** and a marketing **description** automatically. Sellers can review and edit the generated content.
* Multi-role system: **Admin**, **Seller**, **Customer**, and **Premium Customer** (with coupon benefits).
* Payment options: **Stripe** (online) + **Cash on Delivery (COD)**.
* Automated coupon lifecycle using **Inngest** (e.g. auto-delete expired coupons / scheduled jobs).
* Built to scale with **Prisma** + **NeonDB**, optimized image uploads with **ImageKit**, and secure auth via **Clerk**.

---

## Features

* Seller onboarding & store creation (submit for admin approval)
* Product CRUD with image upload & optimized delivery (ImageKit)
* AI-assisted product title & description generation (Gemini 2.5 Flash)
* Search with suggestions (API-based autocomplete)
* Best-selling product endpoint (backend-calculated)
* Cart, Orders, and Checkout flow (Stripe + COD)
* Role-based dashboards (Admin & Seller)
* Coupon management + Inngest scheduled jobs
* Redux (RTK) for client-side state management

---

## Tech Stack

* Frontend: **Next.js (App router)**, React, TailwindCSS
* Backend: **Next.js API routes**, Prisma ORM
* Database: **Postgres** (Neon)
* Auth: **Clerk**
* Payments: **Stripe** (+ COD support)
* Images: **ImageKit**
* AI: **Gemini 2.5 Flash** (image → title/description)
* Worker / jobs: **Inngest**
* State management: **Redux Toolkit**

---

## Architecture / How it works

1. Seller uploads a product image in the listing form.
2. The file is uploaded to ImageKit (fast CDN & storage).
3. The image URL/base64 is sent to Gemini 2.5 Flash to generate a short **title** and a **marketing description**.
4. The seller can review and edit the generated content, then submit the product.
5. Products and stores are persisted in PostgreSQL (via Prisma). Admin verifies/approves stores before they go live.
6. Payments are handled by Stripe for card/online payments. COD is available for local customers.
7. Inngest handles scheduled jobs such as automatically deleting expired coupons and other background tasks.

---

## Getting Started (Local Development)

**Prerequisites**

* Node.js v18+ (recommended)
* pnpm / npm / yarn
* A PostgreSQL database (Neon recommended) — create a project and copy the connection string
* An ImageKit, Clerk, and Stripe account (for full functionality)

**Install & run**

```bash
# clone
git clone https://github.com/arbazz-siddique/next-mart.git
cd next-mart

# install
npm install
# or pnpm install / yarn

# create .env from .env.example (or create one manually)
# set DATABASE_URL and other secrets

# prisma setup (if starting from scratch):
npx prisma generate
# if you have migrations
npx prisma migrate dev --name init

# run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env` file at project root. Example variables used in this project:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>?sslmode=require
NEXT_PUBLIC_CURRENCY_SYMBOL=$
# Clerk
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
# ImageKit
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
# Inngest (or similar)
INNGEST_KEY=
# Gemini / AI provider key (if using a hosted API)
AI_API_KEY=
```

> *Note*: Exact variable names may differ slightly depending on how you integrated services — check the repository for `.env.example` or any config files.

---

## Prisma + Neon — recommended local config

When using Neon and deploying to Edge / Vercel, reuse the Prisma client and conditionally use the Neon adapter for edge runtimes.

Add (or verify) `lib/prisma.js` contains something like:

```js
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws
neonConfig.poolQueryViaFetch = true

const connectionString = process.env.DATABASE_URL

let prisma
if (process.env.NEXT_RUNTIME === 'edge') {
  const adapter = new PrismaNeon({ connectionString })
  prisma = new PrismaClient({ adapter })
} else {
  if (!global.prisma) global.prisma = new PrismaClient()
  prisma = global.prisma
}

export default prisma
```

This avoids exhausting connections locally and supports edge runtimes when deployed.

---

## Important API routes (examples)

* `POST /api/store/create` — create a store (multipart/form-data)
* `GET /api/store/create` — check store status for current user
* `GET /api/store/is-seller` — check if user is a seller
* `GET /api/products` — list products
* `GET /api/products/best-selling` — best selling products (backend-sorted)
* `GET /api/products/search?query=...` — search / autocomplete suggestions
* `GET /api/admin/dashboard` — admin analytics

(Inspect `app/api/**` for full details.)

---

## Common Issues & Troubleshooting

* **Prisma cannot connect (Neon)**: Ensure `DATABASE_URL` includes `?sslmode=require`. If Neon DB is paused, the first request may time out while it wakes up.
* **Turbopack / dev errors about module not found**: Check `tsconfig.json` / `jsconfig.json` has `baseUrl: "."` and `"@/*": ["*"]` and file paths are correct and case-sensitive.
* **Routes working locally but 404 on Vercel**: Check folder and file names are lowercase (Linux file system is case-sensitive). Ensure `app/about/page.jsx` (not `About`) and `Link href` uses lowercase.
* **Toast / UI toast.promise not showing messages**: Use `toast.promise(yourPromise, {loading, success: msg => msg, error: err => err})` and return the API message from the promise.
* **Prisma client overload**: Use a single PrismaClient instance in dev (see snippet above).

---

## Deploying (Vercel)

1. Push code to GitHub (already done).
2. On Vercel, import the repository and set environment variables in the Project Settings (DATABASE\_URL, STRIPE keys, CLERK keys, IMAGEKIT keys, INNGEST keys, etc.).
3. If you use Edge runtimes for some routes, the `lib/prisma.js` adapter above will handle that.
4. Redeploy. If a route 404s on Vercel but works locally, check case-sensitivity of folder names and that your `.env` variables are present in Vercel.

---

## Contributing

Thanks for checking out the project! If you want to contribute:

1. Fork the repo
2. Create a feature branch
3. Open a PR with a clear description

Please include tests and check linting locally before requesting review.

---

## License & Contact

MIT License — see `LICENSE` for details.
Project: [https://github.com/arbazz-siddique/next-mart](https://github.com/arbazz-siddique/next-mart)
Contact: arbazz-siddique (GitHub)  - email: **[arbazzsiddique104@gmail.com](mailto:arbazzsiddique104@gmail.com)**

---

### Final notes

This README is a living document — if you want, I can also:

* Add a ready-to-commit `.env.example` file, or
* Add a short CONTRIBUTING.md template, or
* Generate a short video script (voice-over + on-screen steps) specifically tailored to your repo structure.
