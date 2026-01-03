# Technical Design Document

## System Overview

Citadel is a full-stack e-commerce admin dashboard built on Next.js 16 with server-side rendering, MongoDB for data persistence, and Cloudinary for media storage.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Application                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     proxy.ts (Middleware)                  │  │
│  │  • Rate Limiting  • CORS  • Auth  • Security Headers      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                 │                                │
│         ┌───────────────────────┼───────────────────────┐       │
│         ▼                       ▼                       ▼        │
│  ┌─────────────┐      ┌─────────────────┐      ┌─────────────┐  │
│  │   Pages     │      │   API Routes    │      │  Static     │  │
│  │  (SSR/CSR)  │      │   (/api/*)      │      │  Assets     │  │
│  └─────────────┘      └─────────────────┘      └─────────────┘  │
│         │                       │                                │
│         └───────────┬───────────┘                               │
│                     ▼                                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              lib/auth.ts (NextAuth.js)                    │  │
│  │         JWT Sessions • Credential Provider                 │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 ▼                               ▼
┌─────────────────────────────┐  ┌─────────────────────────────┐
│         MongoDB             │  │        Cloudinary           │
│  • Users                    │  │  • Product Images           │
│  • Products                 │  │  • CDN Delivery             │
│  • Sales                    │  │  • Transformations          │
└─────────────────────────────┘  └─────────────────────────────┘
```

## Core Components

### 1. Middleware Layer (proxy.ts)

Central security gateway that intercepts all requests.

```
Request → Rate Limit Check → CORS Check → Auth Check → Route Handler
```

**Responsibilities:**
- IP-based rate limiting with sliding window
- CORS origin validation
- JWT token verification
- Security header injection
- Request logging (future)

### 2. Authentication (lib/auth.ts)

NextAuth.js v5 configuration with credential provider.

```typescript
// Session flow
Login → Credentials Validate → JWT Create → Session Cookie → Protected Access
```

**JWT Payload:**
```typescript
{
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}
```

### 3. Database Layer

**MongoDB Collections:**

```
users
├── _id: ObjectId
├── name: string
├── email: string (unique, indexed)
├── password: string (bcrypt hash)
├── role: 'admin' | 'user'
├── createdAt: Date
└── updatedAt: Date

products
├── _id: ObjectId
├── name: string
├── description: string
├── category: string (indexed)
├── price: number
├── stock: number
├── sku: string (unique, indexed)
├── status: 'active' | 'inactive' | 'out_of_stock'
├── images: string[]
├── tags: string[]
├── specifications: [{key, value}]
├── createdBy: ObjectId (ref: users)
├── createdAt: Date
└── updatedAt: Date

sales
├── _id: ObjectId
├── productId: ObjectId (ref: products)
├── quantity: number
├── totalAmount: number
├── date: Date (indexed)
└── createdAt: Date
```

**Indexes:**
- `users.email` - Unique, for login lookup
- `products.sku` - Unique, for inventory
- `products.category` - For filtered queries
- `sales.date` - For analytics aggregation

### 4. API Layer

RESTful API with Next.js Route Handlers.

```
/api
├── /auth
│   ├── [...nextauth]  # NextAuth handlers
│   └── register       # User registration
├── /products
│   ├── GET            # List (paginated, searchable)
│   ├── POST           # Create (admin)
│   └── /[id]
│       ├── GET        # Read single
│       ├── PUT        # Update (admin)
│       └── DELETE     # Delete (admin)
├── /users
│   ├── GET            # List users (admin)
│   └── PUT            # Update role (admin)
├── /profile
│   ├── GET            # Current user
│   └── PUT            # Update profile/password
├── /dashboard
│   └── GET            # Analytics (admin)
├── /upload
│   ├── POST           # Upload image (admin)
│   └── DELETE         # Delete image (admin)
└── /admin
    └── /create        # Create admin (admin)
```

### 5. Frontend Architecture

**State Management:**
```
React Query (Server State)
├── useProducts()      # Product list with pagination
├── useProduct(id)     # Single product
├── useDashboard()     # Analytics data
└── Mutations          # Create, Update, Delete
```

**Component Hierarchy:**
```
RootLayout
├── Providers (QueryClient, SessionProvider, ThemeProvider)
└── Pages
    ├── Landing (/)
    ├── Auth (/auth/*)
    │   ├── Login
    │   └── Register
    └── Dashboard (/dashboard/*)
        └── DashboardLayout
            ├── Sidebar Navigation
            └── Page Content
                ├── Overview
                ├── Products
                ├── Users
                └── Settings
```

## Data Flow

### Product Creation Flow
```
1. User fills multi-step form
2. Images uploaded to Cloudinary via /api/upload
3. Form submitted to POST /api/products
4. Server validates with Zod schema
5. Product saved to MongoDB
6. React Query cache invalidated
7. UI refreshes with new product
```

### Authentication Flow
```
1. User submits credentials
2. NextAuth validates against MongoDB
3. JWT created with user data + role
4. Session cookie set
5. Subsequent requests include JWT
6. Middleware verifies JWT on protected routes
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: Network                                            │
│   • HTTPS (enforced via HSTS)                              │
│   • Rate limiting (100/min default)                        │
│   • CORS whitelist                                         │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Authentication                                     │
│   • JWT verification                                        │
│   • Session management                                      │
│   • Password hashing (bcrypt, 12 rounds)                   │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: Authorization                                      │
│   • Role-based access control                              │
│   • Route-level protection                                  │
│   • Resource ownership checks                              │
├─────────────────────────────────────────────────────────────┤
│ Layer 4: Input Validation                                   │
│   • Zod schema validation                                   │
│   • Type safety (TypeScript)                               │
│   • Sanitization                                           │
├─────────────────────────────────────────────────────────────┤
│ Layer 5: Response Headers                                   │
│   • X-Frame-Options: DENY                                  │
│   • X-Content-Type-Options: nosniff                        │
│   • X-XSS-Protection: 1; mode=block                        │
│   • Referrer-Policy: strict-origin-when-cross-origin       │
└─────────────────────────────────────────────────────────────┘
```

## Performance Considerations

**Caching Strategy:**
- React Query: 5-minute stale time for lists
- Next.js: Static generation for landing page
- Cloudinary: CDN caching for images

**Database Optimization:**
- Indexed queries for search
- Pagination (limit 10-50 per page)
- Lean queries where projection possible
- Aggregation pipeline for analytics

**Bundle Optimization:**
- Route-based code splitting
- Dynamic imports for charts
- Image optimization via Cloudinary

## Scalability

**Horizontal Scaling:**
- Stateless API (JWT-based, no server sessions)
- MongoDB Atlas auto-scaling
- Cloudinary CDN distribution

**Vertical Scaling:**
- Rate limit configuration via env vars
- Connection pooling for MongoDB
- Cache TTL tuning

## Future Considerations

- Redis for rate limiting (distributed)
- Webhook integrations
- Audit logging
- Multi-tenancy support
- GraphQL API option
