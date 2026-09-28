# Taslimah Woli — Photography & Spatial Research

Monograph portfolio and curatorial Studio Content Management System for Nigerian documentary photographer and spatial researcher **Taslimah Woli**.

---

## 🏛️ Infrastructure & Stack

- **Framework**: Next.js 15 (App Router, React 19, Server Components)
- **Styling**: Tailwind CSS, Luxury Typography (`font-serif-luxury`), Framer Motion
- **Hosting**: Vercel (Edge Network & Serverless API Routes)
- **Database & Auth**: Supabase (Managed PostgreSQL, Row Level Security, bcrypt password encryption)
- **Storage**: Supabase Storage (S3-compatible bucket for high-res photo assets)
- **Edge Shield & DNS**: Cloudflare (WAF, DDoS Shield, Global CDN, Free Email Routing)
- **Domain**: `taslimahwoli.com`

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- npm

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local` and set your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
NEXT_PUBLIC_SITE_URL=https://taslimahwoli.com
```

### 4. Seed Database
Seed the Supabase database with all bodies of work, stories, assignments, journals, and prints:
```bash
npm run seed:supabase
```

### 5. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

---

## 🔐 Studio CMS Administration

- Access the Studio CMS Dashboard at `/admin`.
- Authenticate with authorized Studio Owner or Maintenance credentials.
- All published content synchronizes across edge nodes and PostgreSQL persistence.

---

© 2026 Taslimah Woli. All rights reserved.