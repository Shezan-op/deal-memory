import { NextRequest, NextResponse } from 'next/server';
import { RecallRequestSchema } from '@/lib/validation/schemas';
import { intelligenceService } from '@/lib/domain/intelligence-service';
import { dealRepository } from '@/lib/repositories/deal-repository';
import { Logger } from '@/lib/logging/logger';
import { rateLimiter, getClientIp } from '@/lib/security/rate-limiter';

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  // 1. Rate limiting: 60 recall requests per minute per IP
  const limitCheck = rateLimiter.check(`recall:${clientIp}`, 60, 60);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many recall requests. Please wait before retrying.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limitCheck.resetInSeconds) },
      }
    );
  }

  try {
    const json = await req.json();
    const validated = RecallRequestSchema.parse(json);

    // 2. Security requirement: Enforce deal scoping to prevent cross-deal memory exfiltration
    if (!validated.dealId) {
      return NextResponse.json(
        { error: 'Scoping parameter "dealId" is required to prevent unauthorized memory exfiltration.' },
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
    // Scope tags strictly to the validated deal
    const scopedTags = [`deal:${validated.dealId.toLowerCase()}`];
    if (validated.tags) {
      for (const t of validated.tags) {
        if (!t.startsWith('deal:') || t.toLowerCase() === scopedTags[0]) {
          scopedTags.push(t);
        }
      }
    }

    const results = await memoryProvider.recall(validated.query, {
      tags: scopedTags,
      types: validated.types,
      budget: 'high',
    });

    return NextResponse.json({
      query: validated.query,
      count: results.length,
      results,
    });
  } catch (err: any) {
    Logger.error('Memory recall API failed', err);
    if (err?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid recall request structure.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal memory recall failure.' }, { status: 500 });
  }
}
