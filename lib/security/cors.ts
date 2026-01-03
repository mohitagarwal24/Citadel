/**
 * CORS Configuration Helper
 * 
 * Implements strict CORS policy with:
 * - Environment-specific allowed origins
 * - No wildcard for authenticated routes
 * - Proper credential handling
 */

/**
 * Get allowed origins based on environment
 */
export function getAllowedOrigins(): string[] {
    const envOrigins = process.env.ALLOWED_ORIGINS;

    if (envOrigins) {
        return envOrigins.split(',').map(origin => origin.trim());
    }

    // Default origins based on environment
    if (process.env.NODE_ENV === 'production') {
        // In production, require explicit configuration
        console.warn('⚠️ ALLOWED_ORIGINS not set. Using restrictive default.');
        return [];
    }

    // Development defaults
    return [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ];
}

/**
 * Check if an origin is allowed
 */
export function isOriginAllowed(origin: string | null): boolean {
    if (!origin) return false;

    const allowedOrigins = getAllowedOrigins();

    // Never allow wildcard in production
    if (allowedOrigins.includes('*')) {
        if (process.env.NODE_ENV === 'production') {
            console.error('❌ Wildcard origin (*) not allowed in production');
            return false;
        }
        return true;
    }

    return allowedOrigins.includes(origin);
}

/**
 * Get CORS headers for a response
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
    const headers: Record<string, string> = {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400', // 24 hours
    };

    if (origin && isOriginAllowed(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
        headers['Access-Control-Allow-Credentials'] = 'true';
    }

    return headers;
}

/**
 * Get security headers for all responses
 */
export function getSecurityHeaders(): Record<string, string> {
    return {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    };
}
