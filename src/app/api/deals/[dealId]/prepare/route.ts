import { NextRequest, NextResponse } from 'next/server';
import { PrepareRequestSchema, SafeIdSchema } from '@/lib/validation/schemas';
import { intelligenceService } from '@/lib/domain/intelligence-service';
import { dealRepository } from '@/lib/repositories/deal-repository';
import { Logger } from '@/lib/logging/logger';
import { rateLimiter, getClientIp } from '@/lib/security/rate-limiter';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  const clientIp = getClientIp(req);
  const { dealId } = await params;
  const reqId = `prep-${Date.now()}`;

  // 1. Rate limiting: 30 requests per minute per IP for reflection/preparation
  const limitCheck = rateLimiter.check(`prep:${clientIp}`, 30, 60);
  if (!limitCheck.allowed) {
    Logger.warn(`Rate limit exceeded for prepare brief from IP ${clientIp}`, { dealId });
    return NextResponse.json(
      { error: 'Too many preparation requests. Please wait before retrying.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limitCheck.resetInSeconds) },
      }
    );
  }

  // 2. Validate dealId parameter format
  const idValidation = SafeIdSchema.safeParse(dealId);
  if (!idValidation.success) {
    return NextResponse.json(
      { error: 'Invalid deal ID format. Alphanumeric, underscores, and hyphens only.' },
      { status: 400 }
    );
  }

  // 3. Verify deal existence
  const existingDeal = dealRepository.getDeal(dealId);
  if (!existingDeal) {
    return NextResponse.json(
      { error: `Deal with ID "${dealId}" not found.` },
      { status: 404 }
    );
  }

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

    if (err?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request payload structure.' }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Internal error preparing deal brief. Please retry.' },
      { status: 500 }
    );
  }
}
