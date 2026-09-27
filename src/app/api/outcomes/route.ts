import { NextRequest, NextResponse } from 'next/server';
import { InteractionOutcomeSchema } from '@/lib/validation/schemas';
import { intelligenceService } from '@/lib/domain/intelligence-service';
import { Logger } from '@/lib/logging/logger';
import { z } from 'zod';

const OutcomeSubmissionSchema = z.object({
  interactionId: z.string().min(1),
  dealId: z.string().min(1),
  outcome: InteractionOutcomeSchema,
});

export async function POST(req: NextRequest) {
  const reqId = `req-out-${Date.now()}`;
  try {
    const body = await req.json();
    const validated = OutcomeSubmissionSchema.parse(body);

    const updated = await intelligenceService.recordOutcomeAndRetain(
      validated.interactionId,
      validated.dealId,
      validated.outcome
    );

    if (!updated) {
      return NextResponse.json(
        { error: `Interaction ${validated.interactionId} not found` },
        { status: 404 }
      );
    }

    Logger.info('Outcome retained successfully in Hindsight', {
      requestId: reqId,
      dealId: validated.dealId,
      interactionId: validated.interactionId,
    });

    return NextResponse.json({ success: true, interaction: updated });
  } catch (err: any) {
    Logger.error('Failed to retain outcome', err, { requestId: reqId });
    return NextResponse.json(
      { error: err.message || 'Invalid outcome request', issues: err.issues },
      { status: 400 }
    );
  }
}
