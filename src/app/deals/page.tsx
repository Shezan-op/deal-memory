import Link from 'next/link';
import { dealRepository } from '@/lib/repositories/deal-repository';

export default function DealsPage() {
  const deals = dealRepository.getDeals();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-editorial text-3xl text-[#111111]">Deal Inbox</h1>
        <p className="text-sm text-[#787774] mt-1">
          Active enterprise pipeline with retained conversational memory and accumulated outcomes.
        </p>
      </div>

      <div className="space-y-4">
        {deals.map((deal) => {
          const company = dealRepository.getCompany(deal.companyId);
          const stakeholders = dealRepository.getStakeholdersForDeal(deal.id);
          const interactions = dealRepository.getInteractionsForDeal(deal.id);

          return (
            <div
              key={deal.id}
              className="surface-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#111111]/30 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-lg text-[#111111]">{company?.name}</span>
                  <span className="badge-tag bg-[#E1F3FE] text-[#1F6C9F]">{deal.stage}</span>
                  <span className="text-xs text-[#787774] font-mono">${deal.value.toLocaleString()}</span>
                </div>
                <h2 className="text-sm font-medium text-[#111111]">{deal.title}</h2>
                <div className="flex flex-wrap gap-2 text-xs text-[#787774]">
                  <span>{stakeholders.length} Stakeholders</span>
                  <span>•</span>
                  <span>{interactions.length} Interactions</span>
                  <span>•</span>
                  <span>Last: {new Date(deal.lastInteractionDate).toLocaleDateString()}</span>
                </div>
                {deal.openObjections.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {deal.openObjections.map((obj, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-[#F7F6F3] border border-[#EAEAEA] text-[#787774] px-2 py-0.5 rounded"
                      >
                        {obj}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 self-end md:self-center">
                <Link
                  href={`/deals/${deal.id}`}
                  className="px-3.5 py-2 border border-[#EAEAEA] text-xs font-medium rounded hover:bg-[#F7F6F3]"
                >
                  Overview
                </Link>
                <Link
                  href={`/deals/${deal.id}/prepare`}
                  className="px-3.5 py-2 bg-[#111111] text-[#FFFFFF] text-xs font-medium rounded hover:bg-[#333333]"
                >
                  Prepare Call →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
