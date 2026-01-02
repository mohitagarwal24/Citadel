# Architecture Documentation

## Overview

Citadel is a modern, server-side rendered e-commerce admin dashboard built with Next.js 14+, featuring a beautiful UI powered by Shadcn/ui and Tailwind CSS.

## Technology Stack

### Frontend
- **Next.js 14+**: React framework with App Router for server-side rendering
- **React 18**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Beautiful, accessible component library
- **Framer Motion**: Animation library for smooth transitions
- **Recharts**: Data visualization and charting library

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **NextAuth.js**: Authentication and session management
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling

### State Management & Data Fetching
- **TanStack Query (React Query)**: Server state management and caching
- **Next.js Server Components**: Built-in data fetching

### Validation & Forms
- **Zod**: TypeScript-first schema validation
- **React Hook Form**: Performant form management

### File Storage
- **Cloudinary**: Cloud-based image storage and optimization

## Architecture Patterns

### 1. Server-Side Rendering (SSR)

The application leverages Next.js's server-side rendering capabilities for:
- Improved initial page load performance
- Better SEO optimization
- Enhanced security (sensitive operations on server)

### 2. API-First Design

All data operations go through RESTful API routes:
```
/api/auth/[...nextauth]  - Authentication
/api/auth/register       - User registration
/api/products            - Product CRUD operations
/api/products/[id]       - Single product operations
/api/upload              - Image upload
/api/dashboard           - Dashboard analytics
/api/admin/create        - Admin creation (protected)
```

### 3. Component Architecture

```
app/
├── (auth)/              # Authentication pages
├── dashboard/           # Protected admin dashboard
├── api/                 # API routes
└── page.tsx            # Public landing page

components/
├── ui/                  # Shadcn/ui components
└── dashboard/           # Dashboard-specific components

lib/
├── db/                  # Database connection
├── hooks/               # Custom React hooks
├── validations/         # Zod schemas
└── auth.ts             # NextAuth configuration

models/                  # Mongoose models
types/                   # TypeScript type definitions
```

### 4. Authentication Flow

```
User Login → NextAuth.js → Credentials Provider → MongoDB
                ↓
            JWT Token
                ↓
        Session Storage
                ↓
    Protected Routes Check
```

### 5. Data Flow

```
Client Component → React Query → API Route → MongoDB → Response
       ↓                                          ↓
   Local Cache ←──────────────────────── Validation
```

## Security Features

1. **Role-Based Access Control (RBAC)**
   - Admin-only routes protected by middleware
   - Session validation on every request

2. **Password Security**
   - Bcrypt hashing with salt rounds
   - Minimum password requirements

3. **Input Validation**
   - Client-side validation with Zod
   - Server-side validation on all API routes
   - SQL injection prevention through Mongoose

4. **Image Upload Security**
   - File type validation
   - Size restrictions
   - Cloudinary secure uploads

## Database Schema

### User Collection
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'admin' | 'user'
  createdAt: Date
  updatedAt: Date
}
```

### Product Collection
```typescript
{
  name: string
  description: string
  category: string
  price: number
  stock: number
  images: string[]
  sku: string (unique)
  status: 'active' | 'inactive' | 'out_of_stock'
  tags: string[]
  specifications: { key: string, value: string }[]
  createdBy: string (User ID)
  createdAt: Date
  updatedAt: Date
}
```

### Sale Collection
```typescript
{
  productId: string (Product ID)
  quantity: number
  totalAmount: number
  date: Date
  createdAt: Date
}
```

## Performance Optimizations

1. **Server-Side Rendering**: Fast initial page loads
2. **React Query Caching**: Reduced API calls
3. **Image Optimization**: Cloudinary CDN
4. **Code Splitting**: Automatic with Next.js
5. **Database Indexing**: Optimized queries

## Scalability Considerations

1. **Stateless API**: Easy horizontal scaling
2. **CDN for Images**: Reduced server load
3. **Database Indexing**: Fast queries at scale
4. **Caching Strategy**: React Query + potential Redis layer
5. **Serverless Functions**: Auto-scaling API routes

## Deployment Architecture

```
User → CDN (Vercel Edge) → Next.js Server → MongoDB Atlas
                              ↓
                         Cloudinary API
```

## Future Enhancements

1. **Redis Caching**: Add Redis for API response caching
2. **WebSocket**: Real-time inventory updates
3. **Microservices**: Split into separate services
4. **GraphQL**: Alternative to REST API
5. **ElasticSearch**: Advanced product search

