# Local Setup Guide

Complete guide to set up Citadel locally with MongoDB and Cloudinary.

## Prerequisites

- Node.js 18+
- npm or yarn
- Git

## Step 1: Clone and Install

```bash
git clone <repository-url>
cd Citadel
npm install
```

## Step 2: MongoDB Setup

### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and log in
3. Click **Build a Database** → Select **FREE** tier
4. Choose a cloud provider and region
5. Create a database user:
   - Username: `citadel_admin`
   - Password: Generate a strong password (save it!)
6. Click **Create User**
7. Under **Network Access**, click **Add IP Address**
   - For development: Click **Allow Access from Anywhere**
   - For production: Add your server's IP
8. Go to **Database** → Click **Connect** → **Connect your application**
9. Copy the connection string:
   ```
   mongodb+srv://citadel_admin:<password>@cluster0.xxxxx.mongodb.net/citadel?retryWrites=true&w=majority
   ```

### Option B: Local MongoDB

1. Install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```
3. Connection string: `mongodb://localhost:27017/citadel`

## Step 3: Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/) and create a free account
2. After login, go to **Dashboard**
3. Find your credentials:
   - **Cloud Name**: Your unique cloud name
   - **API Key**: Your API key
   - **API Secret**: Your API secret (click "Reveal" to see it)
4. Create an upload preset (optional but recommended):
   - Go to **Settings** → **Upload**
   - Scroll to **Upload presets** → **Add upload preset**
   - Set **Signing Mode** to "Unsigned" for client-side uploads
   - Save the preset name

## Step 4: Environment Variables

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# MongoDB
MONGODB_URI=mongodb+srv://citadel_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/citadel?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-32-char-secret-here-use-openssl
AUTH_TRUST_HOST=true

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Security (optional - defaults work for development)
ALLOWED_ORIGINS=http://localhost:3000
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Step 5: Create First Admin

Since this is a fresh setup, you need to create the first admin user.

### Option A: Use the Setup Page (Recommended)
1. Start the app: `npm run dev`
2. Go to `http://localhost:3000/setup`
3. Fill in your admin details (name, email, password)
4. Click "Create Admin Account"
5. You'll be redirected to login

### Option B: Use the seed script
```bash
npx tsx scripts/seed.ts
```
This creates a default admin with email `admin@citadel.com` and password `admin123`.

### Option C: Register and update manually
1. Start the app: `npm run dev`
2. Go to `http://localhost:3000/auth/register`
3. Register a new account
4. Manually update the user role in MongoDB:
   ```javascript
   // In MongoDB Compass or Atlas
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

> **Note:** The `/setup` page only works if no admin exists yet. Once an admin is created, this page will show an error.

## Step 6: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Verification Checklist

- [ ] Can access the landing page
- [ ] Can log in with admin credentials
- [ ] Dashboard loads with charts (may be empty initially)
- [ ] Can create a new product with image upload
- [ ] Can access Settings page
- [ ] Can access User Management page

## Troubleshooting

### MongoDB Connection Failed
- Check your connection string for typos
- Ensure your IP is whitelisted in Atlas
- Verify MongoDB service is running (local)

### Cloudinary Upload Failed
- Verify Cloud Name, API Key, and API Secret
- Check Cloudinary dashboard for error logs
- Ensure you have upload permissions

### NextAuth Errors
- Ensure NEXTAUTH_SECRET is set (min 32 characters)
- Verify NEXTAUTH_URL matches your dev server URL
- Clear browser cookies and try again
