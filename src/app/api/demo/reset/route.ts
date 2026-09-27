import { NextResponse } from 'next/server';
import { dealRepository } from '@/lib/repositories/deal-repository';
import { Logger } from '@/lib/logging/logger';

export async function POST() {
  dealRepository.reset();
  Logger.info('Demo database reset to initial seed state');
  return NextResponse.json({
    success: true,
    message: 'Demo dataset reset to initial state with 3 companies, 3 deals, and full interaction history.',
    dealsCount: dealRepository.getDeals().length,
  });
}
