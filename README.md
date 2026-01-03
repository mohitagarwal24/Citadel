# Citadel

A modern e-commerce admin dashboard built with Next.js 16, MongoDB, and Cloudinary.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square&logo=mongodb)

## Features

**Authentication & Security**
- JWT-based authentication with NextAuth.js
- Role-based access control (Admin/User)
- Rate limiting on all API endpoints
- Strict CORS policy
- Security headers (HSTS, XSS protection, etc.)

**Product Management**
- CRUD operations with validation
- Multi-step product creation wizard
- Cloudinary image upload with drag-and-drop
- Search and pagination

**Dashboard & Analytics**
- Interactive charts (Area, Bar, Donut)
- Real-time metrics
- 30-day sales trends
- Category distribution

**User Management**
- Profile settings with password change
- Admin privilege management (grant/revoke)
- User listing and role control

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)
- Cloudinary account

### Installation

```bash
# Clone and install
git clone <repository-url>
cd Citadel
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### First Admin Setup

**Option 1 (Recommended):** Use the setup page
```
Visit http://localhost:3000/setup
```

**Option 2:** Run seed script
```bash
npx tsx scripts/seed.ts
```

**Option 3:** Register at `/auth/register` and update role in MongoDB:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/citadel

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-char-secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Security (optional)
ALLOWED_ORIGINS=http://localhost:3000
```

## Project Structure

```
Citadel/
├── app/
│   ├── api/              # API routes
│   │   ├── products/     # Product CRUD
│   │   ├── users/        # User management
│   │   ├── profile/      # Profile settings
│   │   ├── dashboard/    # Analytics
│   │   └── admin/        # Admin creation
│   ├── auth/             # Login/Register pages
│   └── dashboard/        # Admin dashboard
│       ├── products/     # Product management
│       ├── users/        # User management
│       └── settings/     # Profile settings
├── components/
│   ├── ui/               # Shadcn/ui components
│   └── dashboard/        # Dashboard layout
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── rate-limit.ts     # Rate limiting
│   └── security/         # CORS config
├── models/               # Mongoose models
├── proxy.ts              # Security middleware
└── docs/                 # Documentation
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** MongoDB with Mongoose
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS + Shadcn/ui
- **Charts:** Recharts
- **Animations:** Framer Motion
- **File Storage:** Cloudinary

## Documentation

- [Setup Guide](./docs/SETUP.md) - Local development setup
- [API Reference](./docs/API.md) - Endpoints and usage
- [Security](./docs/SECURITY.md) - Security features
- [Architecture](./docs/ARCHITECTURE.md) - Technical design

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List products | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| GET | `/api/users` | List users | Admin |
| PUT | `/api/users` | Update user role | Admin |
| GET/PUT | `/api/profile` | Profile management | Auth |
| GET | `/api/dashboard` | Analytics | Admin |
| POST | `/api/upload` | Image upload | Admin |

## Security Features

- Password hashing (bcrypt)
- JWT authentication
- Rate limiting (100 req/min default)
- CORS whitelist
- Security headers
- Input validation (Zod)

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### MongoDB Atlas Network Access

For production, configure Network Access in Atlas:
- Add your deployment platform's IP, or
- Allow `0.0.0.0/0` for platforms with dynamic IPs

## License

MIT
