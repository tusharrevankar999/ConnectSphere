import { NextRequest } from 'next/server';

// Security Constants
export const MAX_QUERY_LENGTH = 300;
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
export const MAX_REQUESTS_PER_WINDOW = 20;

// In-memory rate limiting map: ip -> timestamps
const rateLimitMap = new Map<string, number[]>();

/**
 * Clean up old timestamps from rate limit map periodically to prevent memory leaks
 */
function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (validTimestamps.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, validTimestamps);
    }
  }
}

// Run cleanup every 2 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitMap, 2 * 60 * 1000);
}

/**
 * Extracts client IP address safely from headers
 */
export function getClientIp(req: NextRequest): string {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  const xRealIp = req.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Rate Limiter Check
 * Returns { success: true } if within limits, or { success: false, retryAfterSeconds } if exceeded.
 */
export function checkRateLimit(ip: string): { success: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = validTimestamps[0];
    const retryAfterSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldest)) / 1000);
    return { success: false, retryAfterSeconds };
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return { success: true };
}

/**
 * Input Sanitization & Security Validation
 * Strips script tags, HTML tags, dangerous control characters, and enforces length limits.
 */
export function sanitizeSearchQuery(rawQuery: unknown): { isValid: boolean; query: string; error?: string } {
  if (rawQuery === null || rawQuery === undefined) {
    return { isValid: true, query: '' };
  }

  if (typeof rawQuery !== 'string') {
    return { isValid: false, query: '', error: 'Invalid search query payload type.' };
  }

  // Trim whitespace
  let query = rawQuery.trim();

  // Length enforcement
  if (query.length > MAX_QUERY_LENGTH) {
    query = query.substring(0, MAX_QUERY_LENGTH);
  }

  // Strip potential script tags, event handlers, and control characters to prevent prompt injection / XSS
  query = query
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '');

  return { isValid: true, query };
}
