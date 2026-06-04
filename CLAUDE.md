# Ahmed Store — Project Guide for Claude

## Project Overview
Full-stack e-commerce app (Ahmed Store). Monorepo with a React frontend and Express + MongoDB backend.

## Structure
```
root/
├── client/          # React 19 + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/layout/   # Header, Footer, AppShell, MobileBottomNav
│   │   ├── context/             # AuthContext, CartContext, WishlistContext
│   │   ├── features/products/   # ProductCard, AllProductsSection, DealsSection
│   │   ├── lib/api.ts           # Typed fetch wrapper — all API calls go here
│   │   ├── pages/               # One file per route
│   │   ├── sections/            # HeroSection, PromoBanners (homepage only)
│   │   ├── styles/              # CSS files — NO Tailwind
│   │   └── types/product.ts     # Shared Product type
│   ├── ahmed.css                # Global CSS (legacy — do not restructure)
│   ├── vite.config.ts           # Includes /api proxy to localhost:5000
│   └── vercel.json              # Frontend-only Vercel config
├── server/          # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── config/db.ts         # MongoDB connection with serverless caching
│   │   ├── middleware/auth.ts   # JWT requireAuth middleware
│   │   ├── models/              # Mongoose models
│   │   ├── routes/              # auth, products, cart, wishlist, orders
│   │   └── index.ts             # Express app entry — serves client/dist in production
│   └── vercel.json              # Backend-only Vercel config (if deployed separately)
├── package.json     # Root monorepo scripts
├── vercel.json      # Root Vercel config — builds client/, serves client/dist/
└── render.yaml      # Render unified deployment config
```

## Commands
```bash
npm run dev          # Run client (port 5173) + server (port 5000) concurrently
npm run dev:client   # Frontend only
npm run dev:server   # Backend only
npm run build        # Full production build: client (Vite) + server (tsc)
npm start            # Start production server: node server/dist/index.js
npm run seed         # Seed MongoDB with sample products
npm run install:all  # npm install in both client/ and server/
```

## Tech Stack

### Frontend
- React 19, React Router v7, TypeScript, Vite 6
- **Pure CSS only — no Tailwind, no CSS-in-JS**
- All mobile media queries live in `client/src/styles/react-overrides.css`
- Global styles in `client/ahmed.css` (legacy file — keep as-is)
- Swiper.js for product carousels
- PWA: `client/public/manifest.json` + meta tags in `client/index.html`

### Backend
- Node.js, Express 4, TypeScript, Mongoose 8
- JWT auth (bcryptjs for hashing, jsonwebtoken for tokens)
- MongoDB Atlas (connection string cached for serverless cold starts)

### API Client (`client/src/lib/api.ts`)
- `BASE_URL` defaults to `""` (same-origin in production, Vite proxy in dev)
- All requests go through `api.get/post/patch/delete<T>(path)`
- Token stored in localStorage via `tokenStorage`
- Dispatches `auth:expired` CustomEvent on 401

## Key Conventions

### CSS
- Write styles in `client/src/styles/react-overrides.css` for React-specific overrides
- Mobile breakpoints: `@media (max-width: 768px)` and `@media (max-width: 480px)`
- CSS variables defined in `ahmed.css`: `--main_color`, `--p_color`, `--border_color`, etc.

### TypeScript — Product type
```typescript
// client/src/types/product.ts
type Product = {
  id: number;
  img: string;
  name: string;
  price: number;
  old_price?: number;
  catetory: string;  // intentional typo — matches DB schema, do not fix
}
```

### API Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register |
| POST | /api/auth/login | — | Login → returns JWT |
| GET | /api/auth/me | ✓ | Current user |
| GET | /api/products | — | List (query: category, search, featured, page, limit) |
| GET | /api/products/deals | — | On-sale products |
| GET | /api/products/:id | — | Single product |
| GET/POST/PATCH/DELETE | /api/cart | ✓ | Cart CRUD |
| GET/POST/DELETE | /api/wishlist | ✓ | Wishlist |
| POST/GET | /api/orders | ✓ | Place order / history |

### Contexts (dual-mode: backend when logged in, localStorage as guest)
- `AuthContext` — user state, login/logout, session restore via `/api/auth/me`
- `CartContext` — cartItems, cartCount, addToCart, removeFromCart, updateQty
- `WishlistContext` — savedItems, savedCount, toggleSaved

## Environment Variables

### client/.env.local (gitignored)
```
VITE_API_URL=http://localhost:5000   # optional — Vite proxy handles /api without it
```

### server/.env (gitignored) — copy from server/.env.example
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=long_random_string
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173
PORT=5000
```

## Deployment

### Render (unified — frontend + backend in one server)
- Build: `npm run build` → builds React + compiles TypeScript
- Start: `npm start` → `node server/dist/index.js`
- `NODE_ENV=production` enables Express to serve `client/dist/` as static files
- Required env vars on Render: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`

### Vercel (frontend only)
- Root `vercel.json` handles the build from root directory
- `buildCommand`: `npm run build --prefix client`
- `outputDirectory`: `client/dist`

## Important Notes
- `catetory` typo in Product model/type is **intentional** — it matches the seeded DB data
- The Vite dev proxy (`/api → localhost:5000`) means `VITE_API_URL` is not needed locally
- `connectDB()` uses a cached Promise to handle serverless cold starts safely
- Static file serving in `server/src/index.ts` is guarded by `NODE_ENV === "production"` — in dev, Vite handles the frontend
- Git remotes: `ecommerce` → ahmedsabryelmancy/ecommerce, `fullstack` → ahmedsabryelmancy/Myfullstack-web
