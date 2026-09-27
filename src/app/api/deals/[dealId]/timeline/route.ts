import { NextRequest, NextResponse } from 'next/server';
import { dealRepository } from '@/lib/repositories/deal-repository';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  const { dealId } = await params;
  const interactions = dealRepository.getInteractionsForDeal(dealId);

  return NextResponse.json({
    dealId,
    total: interactions.length,
    interactions,
  });
}
