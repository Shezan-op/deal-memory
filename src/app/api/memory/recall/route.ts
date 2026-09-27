import { NextRequest, NextResponse } from 'next/server';
import { RecallRequestSchema } from '@/lib/validation/schemas';
import { intelligenceService } from '@/lib/domain/intelligence-service';
import { Logger } from '@/lib/logging/logger';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = RecallRequestSchema.parse(json);

    const memoryProvider = intelligenceService.getMemoryProvider();
    const tags = validated.tags || (validated.dealId ? [`deal:${validated.dealId.toLowerCase()}`] : undefined);

    const results = await memoryProvider.recall(validated.query, {
      tags,
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
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
