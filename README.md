# 🏰 Citadel - E-commerce Admin Dashboard

A modern, server-side rendered e-commerce product management dashboard built with Next.js 14, featuring beautiful UI, real-time analytics, and comprehensive product management capabilities.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## ✨ Features

### 🔐 Authentication & Authorization
- **Secure Authentication**: NextAuth.js with JWT tokens
- **Role-Based Access**: Admin and user roles with protected routes
- **Admin Creation**: Secure admin onboarding (admin-only feature)
- **Password Security**: Bcrypt hashing with salt rounds

### 📦 Product Management
- **Complete CRUD Operations**: Create, Read, Update, Delete products
- **Multi-Step Form**: Beautiful 4-step product creation wizard
- **Advanced Validation**: Zod schema validation on client and server
- **Image Upload**: Cloudinary integration with drag-and-drop
- **Search & Filter**: Full-text search with category and status filters
- **Bulk Operations**: Efficient product management

### 📊 Analytics Dashboard
- **Real-Time Metrics**: Total products, revenue, low stock alerts
- **Interactive Charts**: Sales trends, category distribution, top products
- **Data Visualization**: Recharts with responsive design
- **30-Day Analytics**: Historical sales and revenue tracking

### 🎨 Modern UI/UX
- **Shadcn/ui Components**: Beautiful, accessible components
- **Tailwind CSS**: Utility-first styling with custom design system
- **Framer Motion**: Smooth animations and transitions
- **Responsive Design**: Mobile-first approach, works on all devices
- **Dark Mode Ready**: Easy theme switching (future feature)

### ⚡ Performance
- **Server-Side Rendering**: Fast initial page loads
- **React Query**: Efficient data fetching and caching
- **Image Optimization**: Cloudinary CDN with automatic optimization
- **Code Splitting**: Automatic route-based splitting
- **SEO Optimized**: Meta tags and structured data

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Citadel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   MONGODB_URI=mongodb://localhost:27017/citadel-ecommerce
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-min-32-characters
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Seed the database**
   ```bash
   npx tsx scripts/seed.ts
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Default Admin Credentials

After seeding the database, use these credentials to login:

```
Email: admin@citadel.com
Password: admin123
```

⚠️ **Important**: Change these credentials in production!

## 📁 Project Structure

```
Citadel/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── products/       # Product CRUD
│   │   ├── upload/         # Image upload
│   │   ├── dashboard/      # Analytics
│   │   └── admin/          # Admin management
│   ├── auth/               # Auth pages (login, register)
│   ├── dashboard/          # Admin dashboard
│   │   ├── products/       # Product management
│   │   └── admin/          # Admin creation
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── providers.tsx       # React Query & Session providers
├── components/
│   ├── ui/                 # Shadcn/ui components
│   └── dashboard/          # Dashboard-specific components
├── lib/
│   ├── db/                 # Database connection
│   ├── hooks/              # Custom React hooks
│   ├── validations/        # Zod schemas
│   └── auth.ts             # NextAuth configuration
├── models/                  # Mongoose models
│   ├── User.ts
│   ├── Product.ts
│   └── Sale.ts
├── types/                   # TypeScript type definitions
├── scripts/                 # Utility scripts
│   └── seed.ts             # Database seeding
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── FEATURES.md
│   ├── SETUP.md
│   └── DEPLOYMENT.md
└── public/                  # Static assets
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Validation**: Zod

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **File Storage**: Cloudinary

### State Management
- **Server State**: TanStack Query (React Query)
- **Client State**: React Hooks

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Setup Guide](./docs/SETUP.md)**: Detailed installation and configuration
- **[Architecture](./docs/ARCHITECTURE.md)**: System design and patterns
- **[API Documentation](./docs/API.md)**: Complete API reference
- **[Features](./docs/FEATURES.md)**: Detailed feature descriptions
- **[Deployment](./docs/DEPLOYMENT.md)**: Production deployment guide

## 🎯 Key Features Walkthrough

### 1. Landing Page
Beautiful, modern landing page with:
- Hero section with call-to-action
- Feature showcase
- Benefits section
- Responsive design

### 2. Authentication
- Secure login and registration
- Session management
- Protected routes
- Role-based access control

### 3. Dashboard
- Overview metrics cards
- Sales trend line chart
- Category distribution pie chart
- Top products bar chart
- Real-time data updates

### 4. Product Management
- **List View**: Paginated table with search and filters
- **Create**: Multi-step form with validation
  - Step 1: Basic info (name, description, category)
  - Step 2: Pricing & stock (price, quantity, SKU)
  - Step 3: Images (upload multiple images)
  - Step 4: Details (tags, specifications)
- **Edit**: Update existing products
- **Delete**: Remove products with confirmation

### 5. Admin Management
- Create new admin accounts
- Admin-only access
- Secure password handling
- Role assignment

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Protected API routes
- ✅ Role-based authorization
- ✅ Input validation (client & server)
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure file uploads

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Detailed deployment instructions: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

### Other Platforms
- Netlify
- AWS (Amplify, EC2)
- Docker
- Self-hosted

## 📊 API Endpoints

### Authentication
- `POST /api/auth/callback/credentials` - Login
- `POST /api/auth/register` - Register

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product (admin)
- `GET /api/products/:id` - Get product
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Dashboard
- `GET /api/dashboard` - Get analytics (admin)

### Admin
- `POST /api/admin/create` - Create admin (admin)

### Upload
- `POST /api/upload` - Upload image (admin)
- `DELETE /api/upload` - Delete image (admin)

Full API documentation: [docs/API.md](./docs/API.md)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Shadcn/ui](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Recharts](https://recharts.org/) - Charting library
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Cloudinary](https://cloudinary.com/) - Image management

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🎥 Demo Video

A demo video showcasing all features is available at: [Link to be added]

## 📸 Screenshots

### Landing Page
![Landing Page](./docs/screenshots/landing.png)

### Dashboard
![Dashboard](./docs/screenshots/dashboard.png)

### Product Management
![Products](./docs/screenshots/products.png)

### Multi-Step Form
![Form](./docs/screenshots/form.png)

---

**Built with ❤️ using Next.js, MongoDB, and modern web technologies**

⭐ Star this repo if you find it helpful!
