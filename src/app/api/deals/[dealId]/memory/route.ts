import { NextRequest, NextResponse } from 'next/server';
import { intelligenceService } from '@/lib/domain/intelligence-service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  const { dealId } = await params;
  const memoryProvider = intelligenceService.getMemoryProvider();

  const memories = await memoryProvider.listMemories(dealId);

  return NextResponse.json({
    dealId,
    total: memories.length,
    memories,
  });
}
