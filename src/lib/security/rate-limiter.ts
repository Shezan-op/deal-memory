/**
 * In-Memory Token Bucket / Sliding Window Rate Limiter
 * Provides resource exhaustion defense for expensive AI reflection and memory operations.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

class InMemoryRateLimiter {
  private records: Map<string, RateLimitRecord> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Periodically prune expired entries to avoid memory leaks
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Check if a request exceeds the configured limit for an identifier.
   * @param key Unique key (e.g. `prep:ip_address` or `reflect:user_id`)
   * @param limit Max requests allowed in the window
   * @param windowSeconds Window duration in seconds
   */
  check(
    key: string,
    limit: number,
    windowSeconds: number
  ): { allowed: boolean; remaining: number; resetInSeconds: number } {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const record = this.records.get(key);

    if (!record || now >= record.resetAt) {
      this.records.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return { allowed: true, remaining: limit - 1, resetInSeconds: windowSeconds };
    }

    if (record.count >= limit) {
      const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
      return { allowed: false, remaining: 0, resetInSeconds };
    }

    record.count += 1;
    const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return { allowed: true, remaining: limit - record.count, resetInSeconds };
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.records.entries()) {
      if (now >= record.resetAt) {
        this.records.delete(key);
      }
    }
  }

  /**
   * Reset all records (useful for test environments)
   */
  reset(): void {
    this.records.clear();
  }
}

export const rateLimiter = new InMemoryRateLimiter();

/**
 * Helper to extract client IP from Next.js request headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}
