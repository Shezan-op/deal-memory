import { NextRequest, NextResponse } from 'next/server';
import { InteractionOutcomeSchema, SafeIdSchema } from '@/lib/validation/schemas';
import { intelligenceService } from '@/lib/domain/intelligence-service';
import { dealRepository } from '@/lib/repositories/deal-repository';
import { Logger } from '@/lib/logging/logger';
import { rateLimiter, getClientIp } from '@/lib/security/rate-limiter';
import { z } from 'zod';

const OutcomeSubmissionSchema = z.object({
  interactionId: SafeIdSchema,
  dealId: SafeIdSchema,
  outcome: InteractionOutcomeSchema,
});

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);
  const reqId = `req-out-${Date.now()}`;

  // 1. Rate limiting: 60 outcome submissions per minute per IP
  const limitCheck = rateLimiter.check(`outcome:${clientIp}`, 60, 60);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many outcome submissions. Please wait before retrying.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limitCheck.resetInSeconds) },
      }
    );
  }

  try {
    const body = await req.json();
    const validated = OutcomeSubmissionSchema.parse(body);

    // 2. Validate that target interaction exists and belongs to the specified deal
    const dealInteractions = dealRepository.getInteractionsForDeal(validated.dealId);
    const existingInteraction = dealInteractions.find((i) => i.id === validated.interactionId);

    if (!existingInteraction) {
      return NextResponse.json(
        { error: `Interaction "${validated.interactionId}" not found for deal "${validated.dealId}".` },
        { status: 404 }
      );
    }

    const updated = await intelligenceService.recordOutcomeAndRetain(
      validated.interactionId,
      validated.dealId,
      validated.outcome
    );

    if (!updated) {
      return NextResponse.json(
        { error: `Failed to update outcome for interaction ${validated.interactionId}.` },
        { status: 500 }
      );
    }

    Logger.info('Outcome retained successfully in Hindsight', {
      requestId: reqId,
      dealId: validated.dealId,
      interactionId: validated.interactionId,
      outcomeType: validated.outcome.outcomeType,
    });

    return NextResponse.json({ success: true, interaction: updated });
  } catch (err: any) {
    Logger.error('Failed to retain outcome', err, { requestId: reqId });
    if (err?.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed for outcome submission.', issues: err.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error while recording outcome.' },
      { status: 500 }
    );
  }
}
