import { NextRequest, NextResponse } from 'next/server';
import { dealRepository } from '@/lib/repositories/deal-repository';
import { Logger } from '@/lib/logging/logger';
import { rateLimiter, getClientIp } from '@/lib/security/rate-limiter';

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  // 1. Rate limit: Max 5 reset requests per minute
  const limitCheck = rateLimiter.check(`reset:${clientIp}`, 5, 60);
  if (!limitCheck.allowed) {
    Logger.warn(`Rate limit exceeded for demo reset from IP ${clientIp}`);
    return NextResponse.json(
      { error: 'Too many reset requests. Please wait before retrying.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limitCheck.resetInSeconds) },
      }
    );
  }

  // 2. Environment guard: In production, demo reset is strictly disabled unless explicitly opted-in
  const isProduction = process.env.NODE_ENV === 'production';
  const demoResetAllowed = process.env.DEMO_RESET_ALLOWED === 'true';

  if (isProduction && !demoResetAllowed) {
    Logger.warn(`Unauthorized demo reset attempt in production from IP ${clientIp}`);
    return NextResponse.json(
      { error: 'Demo reset endpoint is disabled in production environments.' },
      { status: 403 }
    );
  }

  // 3. Secret key verification if DEMO_ADMIN_KEY is configured
  const requiredKey = process.env.DEMO_ADMIN_KEY;
  if (requiredKey) {
    const providedKey = req.headers.get('x-demo-admin-key');
    if (providedKey !== requiredKey) {
      Logger.warn(`Demo reset rejected: invalid or missing x-demo-admin-key from IP ${clientIp}`);
      return NextResponse.json(
        { error: 'Unauthorized: Invalid admin key for reset operation.' },
        { status: 401 }
      );
    }
  }

  try {
    dealRepository.reset();
    Logger.info('Demo database reset to initial seed state', { clientIp });

    return NextResponse.json({
      success: true,
      message: 'Demo dataset reset to initial state with 3 companies, 3 deals, and full interaction history.',
      dealsCount: dealRepository.getDeals().length,
    });
  } catch (err: unknown) {
    Logger.error('Failed to reset demo dataset', err);
    return NextResponse.json(
      { error: 'Internal server error while executing demo reset.' },
      { status: 500 }
    );
  }
}
