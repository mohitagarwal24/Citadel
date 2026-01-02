# 🚀 Quick Start Guide

Get Citadel up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Minimum required for local development:
MONGODB_URI=mongodb://localhost:27017/citadel-ecommerce
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=citadel-secret-key-for-nextauth-production-ready-2024

# Optional (for image upload):
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Step 3: Start MongoDB

### Option A: Local MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Option B: MongoDB Atlas
1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in `.env.local`

## Step 4: Seed Database

```bash
npm run seed
```

This creates:
- ✅ Admin user (admin@citadel.com / admin123)
- ✅ 10 sample products
- ✅ 50 sales records

## Step 5: Start Development Server

```bash
npm run dev
```

## Step 6: Open Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Step 7: Login

Use the default admin credentials:
- **Email**: admin@citadel.com
- **Password**: admin123

## 🎉 You're Ready!

Now you can:
- ✅ View the beautiful landing page
- ✅ Login to admin dashboard
- ✅ View analytics and charts
- ✅ Manage products (CRUD)
- ✅ Upload images (if Cloudinary configured)
- ✅ Create new admin accounts

## Next Steps

1. **Explore the Dashboard**
   - Check out the analytics
   - View sample products
   - Try creating a new product

2. **Read the Documentation**
   - [Setup Guide](./docs/SETUP.md) - Detailed setup
   - [Features](./docs/FEATURES.md) - All features
   - [API Docs](./docs/API.md) - API reference
   - [Architecture](./docs/ARCHITECTURE.md) - System design

3. **Configure Cloudinary** (Optional)
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Get your credentials
   - Update `.env.local`
   - Test image upload

4. **Customize**
   - Update branding
   - Modify color scheme
   - Add custom features

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If not, start it (see Step 3)
```

### Port 3000 Already in Use
```bash
# Use different port
PORT=3001 npm run dev
```

### Cannot Login
```bash
# Re-run seed script
npm run seed

# Clear browser cookies
# Try again
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

### Hot Reload
Changes to files automatically reload the page.

### Database Reset
```bash
# Warning: Deletes all data
npm run seed
```

### View Database
```bash
# Using mongosh
mongosh
use citadel-ecommerce
db.products.find()
db.users.find()
```

### API Testing
```bash
# Test API endpoints
curl http://localhost:3000/api/products
```

## Production Checklist

Before deploying to production:

- [ ] Change default admin password
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Use MongoDB Atlas (not local)
- [ ] Configure Cloudinary
- [ ] Set up proper domain
- [ ] Enable HTTPS
- [ ] Review security settings
- [ ] Set up monitoring
- [ ] Configure backups

## Need Help?

- 📖 Check [docs/](./docs/) folder
- 🐛 Report issues on GitHub
- 💬 Join community discussions
- 📧 Contact support

---

**Happy coding! 🎉**

