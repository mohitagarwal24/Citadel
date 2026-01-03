/**
 * Production-grade Rate Limiter
 * 
 * Implements sliding window rate limiting with:
 * - IP-based limiting for public routes
 * - User-based limiting for authenticated routes
 * - Configurable via environment variables
 * - Proper 429 responses with rate limit headers
 */

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store (use Redis in production cluster)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}, 60000); // Cleanup every minute

/**
 * Get rate limit configuration from environment or use defaults
 */
export function getRateLimitConfig(type: 'default' | 'auth' | 'upload' = 'default'): RateLimitConfig {
    switch (type) {
        case 'auth':
            return {
                maxRequests: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '20'),
                windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || '60000'),
            };
        case 'upload':
            return {
                maxRequests: parseInt(process.env.RATE_LIMIT_UPLOAD_MAX || '10'),
                windowMs: parseInt(process.env.RATE_LIMIT_UPLOAD_WINDOW_MS || '60000'),
            };
        default:
            return {
                maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
                windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
            };
    }
}

/**
 * Check rate limit for a given identifier (IP or user ID)
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = getRateLimitConfig()
): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter: number;
} {
    const now = Date.now();
    const key = identifier;

    let entry = rateLimitStore.get(key);

    // If no entry or window expired, create new entry
    if (!entry || entry.resetTime < now) {
        entry = {
            count: 1,
            resetTime: now + config.windowMs,
        };
        rateLimitStore.set(key, entry);

        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetTime: entry.resetTime,
            retryAfter: 0,
        };
    }

    // Increment counter
    entry.count++;
    rateLimitStore.set(key, entry);

    const remaining = Math.max(0, config.maxRequests - entry.count);
    const allowed = entry.count <= config.maxRequests;
    const retryAfter = allowed ? 0 : Math.ceil((entry.resetTime - now) / 1000);

    return {
        allowed,
        remaining,
        resetTime: entry.resetTime,
        retryAfter,
    };
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: ReturnType<typeof checkRateLimit>): Record<string, string> {
    return {
        'X-RateLimit-Limit': getRateLimitConfig().maxRequests.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
        ...(result.retryAfter > 0 ? { 'Retry-After': result.retryAfter.toString() } : {}),
    };
}

/**
 * Create a rate limiter for a specific route type
 */
export function createRateLimiter(type: 'default' | 'auth' | 'upload' = 'default') {
    const config = getRateLimitConfig(type);

    return {
        check: (identifier: string) => checkRateLimit(identifier, config),
        getHeaders: getRateLimitHeaders,
        config,
    };
}

/**
 * Extract client IP from request headers
 */
export function getClientIP(headers: Headers): string {
    // Check various headers for real IP (behind proxy/load balancer)
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    const cfConnectingIP = headers.get('cf-connecting-ip');
    if (cfConnectingIP) {
        return cfConnectingIP;
    }

    return 'unknown';
}
