# Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Citadel
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Update the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/citadel-ecommerce
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/citadel

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-characters-long

# Cloudinary Configuration (Get from cloudinary.com)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App Configuration
NODE_ENV=development
```

### 4. MongoDB Setup

#### Option A: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Get connection string and update `MONGODB_URI`
4. Whitelist your IP address in Network Access

### 5. Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Update environment variables

### 6. Seed Database

Populate the database with sample data and create admin user:

```bash
npx tsx scripts/seed.ts
```

This will create:
- Admin user (email: admin@citadel.com, password: admin123)
- 10 sample products
- 50 sample sales records

### 7. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Credentials

After seeding the database, use these credentials to login:

```
Email: admin@citadel.com
Password: admin123
```

## Project Structure

```
Citadel/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Admin dashboard
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── providers.tsx      # React Query & Session providers
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utility functions
│   ├── db/               # Database connection
│   ├── hooks/            # Custom React hooks
│   ├── validations/      # Zod schemas
│   └── auth.ts           # NextAuth config
├── models/               # Mongoose models
├── types/                # TypeScript types
├── scripts/              # Utility scripts
├── docs/                 # Documentation
└── public/               # Static files
```

## Development Workflow

### Running Tests

```bash
npm run test
# or
yarn test
```

### Building for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## Common Issues

### MongoDB Connection Error

**Problem:** Cannot connect to MongoDB

**Solution:**
1. Ensure MongoDB is running
2. Check `MONGODB_URI` in `.env.local`
3. For Atlas, verify IP whitelist and credentials

### Cloudinary Upload Error

**Problem:** Image upload fails

**Solution:**
1. Verify Cloudinary credentials in `.env.local`
2. Check file size (max 10MB)
3. Ensure file type is supported (jpg, png, gif, webp)

### NextAuth Session Error

**Problem:** Authentication not working

**Solution:**
1. Verify `NEXTAUTH_SECRET` is set (min 32 characters)
2. Clear browser cookies
3. Restart development server

### Port Already in Use

**Problem:** Port 3000 is already in use

**Solution:**
```bash
# Kill process on port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

## Additional Configuration

### Custom Port

Create `.env.local`:
```env
PORT=3001
```

### Production Environment Variables

For production deployment, ensure:
1. Strong `NEXTAUTH_SECRET` (use: `openssl rand -base64 32`)
2. Production MongoDB URI
3. Proper CORS configuration
4. Environment-specific URLs

## Next Steps

1. Explore the [API Documentation](./API.md)
2. Review [Architecture](./ARCHITECTURE.md)
3. Check [Features Documentation](./FEATURES.md)
4. Read [Deployment Guide](./DEPLOYMENT.md)

## Support

For issues or questions:
1. Check documentation in `/docs`
2. Review GitHub issues
3. Contact support team

