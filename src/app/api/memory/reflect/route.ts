import { NextRequest, NextResponse } from 'next/server';
import { ReflectRequestSchema } from '@/lib/validation/schemas';
import { intelligenceService } from '@/lib/domain/intelligence-service';
import { Logger } from '@/lib/logging/logger';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = ReflectRequestSchema.parse(json);

    const memoryProvider = intelligenceService.getMemoryProvider();
    const tags = validated.dealId ? [`deal:${validated.dealId.toLowerCase()}`] : undefined;

    const answer = await memoryProvider.reflect(validated.query, {
      budget: validated.budget,
      tags,
      includeFacts: true,
    });

    return NextResponse.json(answer);
  } catch (err: any) {
    Logger.error('Memory reflect API failed', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
