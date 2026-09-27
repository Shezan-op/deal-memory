import { NextRequest, NextResponse } from 'next/server';
import { ReflectRequestSchema } from '@/lib/validation/schemas';
import { intelligenceService } from '@/lib/domain/intelligence-service';
import { dealRepository } from '@/lib/repositories/deal-repository';
import { Logger } from '@/lib/logging/logger';
import { rateLimiter, getClientIp } from '@/lib/security/rate-limiter';

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  // 1. Rate limiting: 20 reflect requests per minute per IP
  const limitCheck = rateLimiter.check(`reflect:${clientIp}`, 20, 60);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many reflection requests. Please wait before retrying.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limitCheck.resetInSeconds) },
      }
    );
  }

  try {
    const json = await req.json();
    const validated = ReflectRequestSchema.parse(json);

    // 2. Security requirement: Enforce deal scoping
    if (!validated.dealId) {
      return NextResponse.json(
        { error: 'Scoping parameter "dealId" is required for reflection queries.' },
        { status: 400 }
      );
    }

    const existingDeal = dealRepository.getDeal(validated.dealId);
    if (!existingDeal) {
      return NextResponse.json(
        { error: `Deal with ID "${validated.dealId}" not found.` },
        { status: 404 }
      );
    }

    const memoryProvider = intelligenceService.getMemoryProvider();
    const tags = [`deal:${validated.dealId.toLowerCase()}`];

    const answer = await memoryProvider.reflect(validated.query, {
      budget: validated.budget,
      tags,
      includeFacts: true,
    });

    return NextResponse.json(answer);
  } catch (err: any) {
    Logger.error('Memory reflect API failed', err);
    if (err?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid reflect request structure.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal memory reflection failure.' }, { status: 500 });
  }
}
