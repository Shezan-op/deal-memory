import { NextRequest, NextResponse } from 'next/server';
import { dealRepository } from '@/lib/repositories/deal-repository';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  const { dealId } = await params;
  const deal = dealRepository.getDeal(dealId);

  if (!deal) {
    return NextResponse.json({ error: `Deal ${dealId} not found` }, { status: 404 });
  }

  const company = dealRepository.getCompany(deal.companyId);
  const stakeholders = dealRepository.getStakeholdersForDeal(deal.id);
  const interactions = dealRepository.getInteractionsForDeal(deal.id);

  return NextResponse.json({
    deal,
    company,
    stakeholders,
    interactionCount: interactions.length,
    lastInteraction: interactions[interactions.length - 1],
  });
}
