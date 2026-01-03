import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Next.js Proxy with Security Features
 * 
 * Implements:
 * - Dashboard route protection
 * - API rate limiting
 * - CORS validation
 * - Security headers
 * - Authentication enforcement
 */

// Rate limiting configuration
const RATE_LIMITS: Record<string, { max: number; window: number }> = {
  auth: { max: 20, window: 60000 },
  upload: { max: 10, window: 60000 },
  default: { max: 100, window: 60000 },
};

// In-memory rate limit store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Protected API routes that require admin
const ADMIN_API_ROUTES = ['/api/dashboard', '/api/upload', '/api/admin'];
const PROTECTED_PRODUCT_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];

function getClientIP(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

function getAllowedOrigins(): string[] {
  const envOrigins = process.env.ALLOWED_ORIGINS;
  if (envOrigins) return envOrigins.split(',').map(o => o.trim());
  // In production without explicit origins, allow same-origin requests
  return ['http://localhost:3000', 'http://127.0.0.1:3000'];
}

function isOriginAllowed(origin: string | null, requestUrl: string): boolean {
  if (!origin) return true; // Same-origin requests have no Origin header

  // Check if origin matches the request URL (same-origin)
  try {
    const reqHost = new URL(requestUrl).origin;
    if (origin === reqHost) return true;
  } catch { }

  const allowed = getAllowedOrigins();
  if (allowed.length === 0) return true; // No restrictions if not configured
  return allowed.includes(origin);
}

function getRateLimitType(pathname: string): 'auth' | 'upload' | 'default' {
  if (pathname.startsWith('/api/auth')) return 'auth';
  if (pathname.startsWith('/api/upload')) return 'upload';
  return 'default';
}

function checkRateLimit(identifier: string, type: 'auth' | 'upload' | 'default') {
  const config = RATE_LIMITS[type];
  const now = Date.now();
  const key = `${type}:${identifier}`;

  const entry = rateLimitStore.get(key);
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.window });
    return { allowed: true, remaining: config.max - 1, resetTime: now + config.window };
  }

  entry.count++;
  return {
    allowed: entry.count <= config.max,
    remaining: Math.max(0, config.max - entry.count),
    resetTime: entry.resetTime,
  };
}

function addSecurityHeaders(response: NextResponse, origin: string | null): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (origin && isOriginAllowed(origin, '')) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const origin = request.headers.get('origin');

  // === API ROUTE HANDLING ===
  if (pathname.startsWith('/api')) {
    // Handle CORS preflight
    if (method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 });
      if (origin && isOriginAllowed(origin, request.url)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Max-Age', '86400');
      }
      return response;
    }

    // CORS check (allow same-origin and configured origins)
    if (origin && !isOriginAllowed(origin, request.url)) {
      return NextResponse.json({ error: 'CORS error: Origin not allowed' }, { status: 403 });
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitType = getRateLimitType(pathname);
    const rateLimit = checkRateLimit(clientIP, rateLimitType);

    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        { error: 'Too Many Requests', retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000) },
        { status: 429 }
      );
      response.headers.set('Retry-After', Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString());
      return response;
    }

    // Skip auth check for NextAuth and setup routes
    if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/setup')) {
      return addSecurityHeaders(NextResponse.next(), origin);
    }

    // Check if route requires authentication
    const requiresAuth = ADMIN_API_ROUTES.some(route => pathname.startsWith(route)) ||
      (pathname.startsWith('/api/products') && PROTECTED_PRODUCT_METHODS.includes(method));

    if (requiresAuth) {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

      if (!token) {
        return NextResponse.json({ error: 'Unauthorized - Authentication required' }, { status: 401 });
      }

      if (token.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
      }
    }

    return addSecurityHeaders(NextResponse.next(), origin);
  }

  // === PAGE ROUTE HANDLING ===
  // Allow public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/setup') ||
    pathname === '/' ||
    pathname.includes('.') ||
    !pathname.startsWith('/dashboard')
  ) {
    return NextResponse.next();
  }

  // Check for session cookie for dashboard routes
  const sessionToken = request.cookies.get('authjs.session-token') ||
    request.cookies.get('next-auth.session-token') ||
    request.cookies.get('__Secure-authjs.session-token') ||
    request.cookies.get('__Secure-next-auth.session-token');

  if (!sessionToken) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

