import { NextRequest, NextResponse } from 'next/server';
import { CreateInteractionSchema } from '@/lib/validation/schemas';
import { intelligenceService } from '@/lib/domain/intelligence-service';
import { dealRepository } from '@/lib/repositories/deal-repository';
import { Logger } from '@/lib/logging/logger';
import { rateLimiter, getClientIp } from '@/lib/security/rate-limiter';

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);
  const reqId = `req-${Date.now()}`;

  // 1. Rate limiting: 60 interaction logs per minute per IP
  const limitCheck = rateLimiter.check(`interaction:${clientIp}`, 60, 60);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many interaction submissions. Please wait before retrying.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limitCheck.resetInSeconds) },
      }
    );
  }

  try {
    const body = await req.json();
    const validated = CreateInteractionSchema.parse(body);

    // 2. Validate that target deal exists
    const existingDeal = dealRepository.getDeal(validated.dealId);
    if (!existingDeal) {
      return NextResponse.json(
        { error: `Deal "${validated.dealId}" does not exist.` },
        { status: 404 }
      );
    }

    const saved = await intelligenceService.recordInteractionAndRetain(validated);

    Logger.info(`Interaction created and retained`, {
      requestId: reqId,
      interactionId: saved.id,
      dealId: saved.dealId,
    });

    return NextResponse.json({ success: true, interaction: saved }, { status: 201 });
  } catch (err: any) {
    Logger.error('Failed to create interaction', err, { requestId: reqId });
    if (err?.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed for interaction payload.', issues: err.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error while logging interaction.' },
      { status: 500 }
    );
  }
}
