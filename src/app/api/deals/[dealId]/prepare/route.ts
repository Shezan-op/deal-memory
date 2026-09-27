import { NextRequest, NextResponse } from 'next/server';
import { PrepareRequestSchema } from '@/lib/validation/schemas';
import { intelligenceService } from '@/lib/domain/intelligence-service';
import { Logger } from '@/lib/logging/logger';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  const { dealId } = await params;
  const reqId = `prep-${Date.now()}`;

  try {
    const json = await req.json().catch(() => ({}));
    const validated = PrepareRequestSchema.parse({
      dealId,
      memoryEnabled: json.memoryEnabled ?? true,
      customGoal: json.customGoal,
    });

    Logger.info(`Generating deal preparation brief`, {
      requestId: reqId,
      dealId: validated.dealId,
      memoryEnabled: validated.memoryEnabled,
    });

    const brief = await intelligenceService.generatePreparationBrief({
      dealId: validated.dealId,
      memoryEnabled: validated.memoryEnabled,
      customGoal: validated.customGoal,
    });

    return NextResponse.json(brief);
  } catch (err: any) {
    Logger.error(`Failed to generate preparation brief for ${dealId}`, err, {
      requestId: reqId,
    });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
