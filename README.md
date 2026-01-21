## Lynos Sweets

Modern “restaurant menu” style site for **Lynos Sweets**, backed by **Supabase Postgres**, with a secure **admin panel** to manage products (cards), users/admins, and sales stats.

### Features

- **Public site**: shows products as cards (image, name, description, price, category).
- **Admin login**: `/admin/login` (admins only).
- **Admin dashboard**: `/admin` (stats overview).
- **Product management**: add / edit / delete products at `/admin/products`.
- **User management**: add / edit / delete users + admins at `/admin/users`.
- **Sales tracking**: record sales and view analytics at `/admin/sales`.

### Tech

- Next.js 16 (App Router)
- Prisma 7 + Postgres adapter (`@prisma/adapter-pg`) + `pg`
- Supabase Postgres (use **Session pooler** URL)
- JWT auth (cookie-based)

---

## Setup (Local)

### 1) Install

```bash
npm install
```

### 2) Environment variables

Create `.env` in the project root with:

```env
DATABASE_URL="YOUR_SUPABASE_SESSION_POOLER_URL"
JWT_SECRET="your-long-random-secret"
```

### 3) Migrate + seed

```bash
npx prisma migrate dev --name init
npm run db:seed
```

### 4) Run

```bash
npm run dev
```

Open:
- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

### Default Admin Credentials

Seed creates:
- **Email**: `admin@lynossweets.com`
- **Password**: `admin123`

Change password after first login.

---

## Deployment (Vercel + Supabase)

1. Push to GitHub.
2. Create a Vercel project from the repo.
3. In Vercel **Environment Variables**, set:
   - `DATABASE_URL` = your Supabase **Session pooler** URL
   - `JWT_SECRET` = a long random string
4. Deploy.
5. Seed production once (from your machine):

```bash
DATABASE_URL="YOUR_SUPABASE_SESSION_POOLER_URL" npm run db:seed
```
