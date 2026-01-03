# Security

## Overview

Citadel implements multiple layers of security to protect your data and users.

## Authentication

- **NextAuth.js** with JWT tokens
- **Bcrypt** password hashing (12 salt rounds)
- Session-based authentication with secure cookies
- Automatic token refresh

## Authorization

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all features |
| **User** | Read-only access to products |

### Protected Routes

| Route | Required Role |
|-------|---------------|
| `/dashboard/*` | Admin |
| `POST/PUT/DELETE /api/products` | Admin |
| `/api/admin/*` | Admin |
| `/api/users/*` | Admin |
| `/api/upload/*` | Admin |

## Rate Limiting

IP-based rate limiting prevents abuse:

| Endpoint | Limit | Window |
|----------|-------|--------|
| General API | 100 req | 60 sec |
| Auth endpoints | 20 req | 60 sec |
| File uploads | 10 req | 60 sec |

Response on limit exceeded:
```
HTTP 429 Too Many Requests
Retry-After: 45
```

## CORS Policy

- Strict origin whitelist (configurable via `ALLOWED_ORIGINS`)
- No wildcard origins for authenticated routes
- Credentials supported for whitelisted origins

Configure in `.env.local`:
```
ALLOWED_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
```

## Security Headers

Applied to all responses:

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | max-age=63072000 | Force HTTPS |
| `X-Content-Type-Options` | nosniff | Prevent MIME sniffing |
| `X-Frame-Options` | DENY | Prevent clickjacking |
| `X-XSS-Protection` | 1; mode=block | XSS filter |
| `Referrer-Policy` | strict-origin-when-cross-origin | Limit referer |
| `Permissions-Policy` | camera=(), microphone=() | Disable APIs |

## Input Validation

- **Zod** schema validation on all inputs
- Server-side validation on all API routes
- Type-safe with TypeScript

## File Upload Security

- File type validation (images only)
- File size limits (10MB max)
- Secure Cloudinary integration
- No direct file system storage

## Best Practices

1. **Never commit `.env.local`** - Use `.env.example` as template
2. **Rotate secrets regularly** - Especially `NEXTAUTH_SECRET`
3. **Use strong passwords** - Minimum 6 characters enforced
4. **Enable 2FA** on MongoDB Atlas and Cloudinary
5. **Monitor rate limit logs** for potential attacks
6. **Keep dependencies updated** - Run `npm audit` regularly
