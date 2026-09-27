import { NextResponse } from 'next/server';
import { dealRepository } from '@/lib/repositories/deal-repository';

export async function GET() {
  const deals = dealRepository.getDeals();
  const enhanced = deals.map((d) => {
    const comp = dealRepository.getCompany(d.companyId);
    const stakeholders = dealRepository.getStakeholdersForDeal(d.id);
    const interactions = dealRepository.getInteractionsForDeal(d.id);
    return {
      ...d,
      company: comp,
      stakeholderCount: stakeholders.length,
      interactionCount: interactions.length,
      lastInteraction: interactions[interactions.length - 1],
    };
  });

  return NextResponse.json({ deals: enhanced });
}
