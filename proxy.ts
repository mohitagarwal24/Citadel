import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow all public routes and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname === '/' ||
    pathname.includes('.') ||
    !pathname.startsWith('/dashboard')
  ) {
    return NextResponse.next();
  }

  // Only check session for dashboard routes
  // Check for session cookie (NextAuth v5 uses different cookie names)
  const sessionToken = request.cookies.get('authjs.session-token') || 
                       request.cookies.get('next-auth.session-token') ||
                       request.cookies.get('__Secure-authjs.session-token') ||
                       request.cookies.get('__Secure-next-auth.session-token');

  // Protect dashboard routes
  if (!sessionToken) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

