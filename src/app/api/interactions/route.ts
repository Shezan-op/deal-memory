import { NextRequest, NextResponse } from 'next/server';
import { CreateInteractionSchema } from '@/lib/validation/schemas';
import { intelligenceService } from '@/lib/domain/intelligence-service';
import { Logger } from '@/lib/logging/logger';

export async function POST(req: NextRequest) {
  const reqId = `req-${Date.now()}`;
  try {
    const body = await req.json();
    const validated = CreateInteractionSchema.parse(body);

    const saved = await intelligenceService.recordInteractionAndRetain(validated);

    Logger.info(`Interaction created and retained`, {
      requestId: reqId,
      interactionId: saved.id,
      dealId: saved.dealId,
    });

    return NextResponse.json({ success: true, interaction: saved }, { status: 201 });
  } catch (err: any) {
    Logger.error('Failed to create interaction', err, { requestId: reqId });
    return NextResponse.json(
      { error: err.message || 'Internal Server Error', issues: err.issues },
      { status: 400 }
    );
  }
}
