# Deployment Guide

## Overview

This guide covers deploying Citadel to various platforms including Vercel, Netlify, and self-hosted solutions.

## Vercel Deployment (Recommended)

Vercel is the recommended platform as it's built by the creators of Next.js.

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free tier available)
- MongoDB Atlas account (for production database)
- Cloudinary account

### Steps

1. **Push Code to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Select "Citadel" project

3. **Configure Environment Variables**
   
   In Vercel dashboard, add these environment variables:
   
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/citadel
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your deployed site

5. **Seed Production Database**
   ```bash
   # Set production MongoDB URI locally
   MONGODB_URI=<production-uri> npx tsx scripts/seed.ts
   ```

### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

## Netlify Deployment

### Steps

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build Configuration**
   
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. **Deploy**
   ```bash
   netlify login
   netlify init
   netlify deploy --prod
   ```

4. **Configure Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all required variables

## Docker Deployment

### Dockerfile

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
      - CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
      - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Build and Run

```bash
docker-compose up -d
```

## AWS Deployment

### Using AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your Git repository

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   - Add all required variables in Amplify Console

### Using EC2

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.micro or larger
   - Configure security groups (ports 80, 443, 22)

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm nginx
   ```

3. **Deploy Application**
   ```bash
   git clone <repo-url>
   cd Citadel
   npm install
   npm run build
   ```

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Setup PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "citadel" -- start
   pm2 startup
   pm2 save
   ```

## Database Setup (MongoDB Atlas)

1. **Create Cluster**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free tier cluster
   - Choose region closest to your deployment

2. **Configure Access**
   - Database Access: Create user
   - Network Access: Add IP (0.0.0.0/0 for all, or specific IPs)

3. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

4. **Seed Database**
   ```bash
   MONGODB_URI=<atlas-uri> npx tsx scripts/seed.ts
   ```

## Environment Variables Checklist

Before deployment, ensure all these are set:

- [ ] `MONGODB_URI` - Production database connection
- [ ] `NEXTAUTH_URL` - Your production URL
- [ ] `NEXTAUTH_SECRET` - Strong secret (32+ chars)
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary name
- [ ] `CLOUDINARY_API_KEY` - Cloudinary key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary secret
- [ ] `NODE_ENV=production`

## Post-Deployment Steps

1. **Test Authentication**
   - Try logging in with admin credentials
   - Verify session persistence

2. **Test Product Operations**
   - Create a product
   - Update a product
   - Delete a product
   - Upload images

3. **Check Analytics**
   - Verify dashboard loads
   - Check charts render correctly

4. **Performance Testing**
   - Run Lighthouse audit
   - Check page load times
   - Test on mobile devices

5. **Security Checks**
   - Verify HTTPS is enabled
   - Test authentication flows
   - Check API endpoints are protected

## Monitoring & Logging

### Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
```

Configure in `sentry.config.js`

## Backup Strategy

1. **Database Backups**
   - MongoDB Atlas: Automatic backups enabled
   - Manual exports: `mongodump` command

2. **Image Backups**
   - Cloudinary: Built-in redundancy
   - Download images periodically

3. **Code Backups**
   - Git repository (primary)
   - Multiple remotes recommended

## Scaling Considerations

### Horizontal Scaling
- Vercel: Automatic scaling
- AWS: Load balancer + Auto Scaling Groups
- Docker: Kubernetes orchestration

### Database Scaling
- MongoDB Atlas: Upgrade tier
- Add read replicas
- Implement caching (Redis)

### CDN
- Cloudinary: Built-in CDN
- Vercel Edge Network
- CloudFront for custom setup

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Verify all dependencies installed
- Check for TypeScript errors

### Database Connection Issues
- Verify MongoDB URI
- Check IP whitelist
- Test connection locally

### Image Upload Fails
- Verify Cloudinary credentials
- Check file size limits
- Test API endpoint directly

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches domain
- Clear cookies and try again

## Rollback Procedure

### Vercel
1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Docker
```bash
docker-compose down
git checkout <previous-commit>
docker-compose up -d --build
```

## Support

For deployment issues:
1. Check deployment logs
2. Review error messages
3. Consult platform documentation
4. Contact support team

