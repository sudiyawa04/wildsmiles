# WildSmiles Tours & Travel — Setup Guide

## Prerequisites
- XAMPP (Apache + MySQL) running
- Node.js 18+
- npm 9+

---

## 1. Database Setup (phpMyAdmin / MySQL CLI)

> No DELIMITER statements — all SQL is standard `CREATE TABLE` / `INSERT` / `CREATE INDEX` and is safe for phpMyAdmin.

1. Open **phpMyAdmin** → click **SQL** tab
2. Run **migrations** first:
   ```sql
   -- Copy & paste contents of:
   database/migrations/001_create_tables.sql
   ```
3. Then run **seed data**:
   ```sql
   -- Copy & paste contents of:
   database/seeds/001_seed_data.sql
   ```

**Default admin credentials:**
- Email: `admin@wildsmiles.com`
- Password: `Admin@12345`  *(change immediately after first login)*

---

## 2. Copy the Logo

The logo must be accessible by the Next.js frontend:

```bash
# Windows (PowerShell)
Copy-Item "assets\images\gallery\logowild.png" -Destination "frontend\public\images\logowild.png" -Force
```

Or manually copy `assets/images/gallery/logowild.png` → `frontend/public/images/logowild.png`

---

## 3. Backend Setup

```bash
cd backend
npm install
```

Create / edit **`backend/.env`** with your real values:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # your XAMPP MySQL password (blank by default)
DB_NAME=wildsmiles_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-change-this

# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=WildSmiles <no-reply@wildsmiles.com>

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI (for AI Trip Planner — optional)
OPENAI_API_KEY=sk-...

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev        # development (nodemon)
# or
npm start          # production
```

Backend runs on **http://localhost:5000**

---

## 4. Frontend Setup

```bash
cd frontend
npm install
```

Create / edit **`frontend/.env.local`**:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev        # development
# or
npm run build && npm start   # production
```

Frontend runs on **http://localhost:3000**

---

## 5. File Upload Directory

The backend stores uploaded images in `backend/uploads/`. Create the folder structure:

```bash
mkdir backend\uploads
mkdir backend\uploads\tours
mkdir backend\uploads\destinations
mkdir backend\uploads\profiles
```

---

## 6. Project Structure

```
wildsmiles/
├── assets/
│   └── images/
│       └── gallery/
│           └── logowild.png          ← original logo
├── database/
│   ├── migrations/
│   │   └── 001_create_tables.sql     ← full schema (18 tables)
│   └── seeds/
│       └── 001_seed_data.sql         ← sample destinations, tours, users
├── backend/                          ← Node.js / Express API
│   ├── app.js
│   ├── server.js
│   ├── .env
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── uploads/
└── frontend/                         ← Next.js 14 app
    ├── .env.local
    ├── pages/
    │   ├── index.js                  ← Homepage
    │   ├── login.js
    │   ├── register.js
    │   ├── forgot-password.js
    │   ├── reset-password.js
    │   ├── ai-planner.js
    │   ├── tours/
    │   │   ├── index.js              ← Tour listing + filters
    │   │   └── [slug].js             ← Tour detail + booking
    │   ├── destinations/
    │   │   ├── index.js
    │   │   └── [slug].js
    │   ├── dashboard/
    │   │   ├── index.js              ← User overview
    │   │   ├── bookings.js
    │   │   ├── wishlist.js
    │   │   └── profile.js
    │   └── admin/
    │       ├── index.js              ← KPI + Revenue charts
    │       ├── bookings.js
    │       ├── users.js
    │       └── reviews.js
    ├── components/
    │   ├── layout/                   ← Navbar, Footer, Layout
    │   ├── tours/                    ← TourCard
    │   ├── destinations/             ← DestinationCard
    │   ├── reviews/                  ← ReviewCard
    │   ├── search/                   ← SearchBar
    │   ├── home/                     ← AiPlannerTeaser, NewsletterSection
    │   ├── dashboard/                ← DashboardLayout
    │   └── admin/                    ← AdminLayout
    ├── context/
    │   └── AuthContext.js
    ├── lib/
    │   └── api.js                    ← Axios + all API modules
    └── public/
        └── images/
            └── logowild.png          ← copied from assets/
```

---

## 7. API Routes Reference

| Module      | Base Path            | Key Endpoints                              |
|-------------|----------------------|--------------------------------------------|
| Auth        | `/api/auth`          | POST login, register, forgot-password      |
| Tours       | `/api/tours`         | GET list (filtered), GET/:slug             |
| Destinations| `/api/destinations`  | GET list, GET/:slug                        |
| Bookings    | `/api/bookings`      | POST create, GET mine, DELETE/:id/cancel   |
| Reviews     | `/api/reviews`       | POST create, GET by tour                   |
| Users       | `/api/users`         | GET profile, PUT update, GET wishlist      |
| AI          | `/api/ai`            | POST generate-itinerary, GET recommendations|
| Admin       | `/api/admin`         | GET overview, revenue, users, bookings     |
| Payments    | `/api/payments`      | POST create-intent, POST webhook           |

---

## 8. Troubleshooting

| Problem | Fix |
|---------|-----|
| MySQL connection refused | Ensure XAMPP MySQL is running on port 3306 |
| `ENOENT logowild.png` | Copy logo to `frontend/public/images/logowild.png` |
| JWT errors | Check `JWT_SECRET` and `JWT_REFRESH_SECRET` are set |
| Stripe webhook 400 | Ensure raw body parser is used for `/api/payments/webhook` |
| CORS errors | Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL |
| Emails not sending | Check SMTP credentials; use Gmail App Password not account password |
