import Link from 'next/link';
import { notFound } from 'next/navigation';
import { dealRepository } from '@/lib/repositories/deal-repository';

export default async function DealOverviewPage({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;
  const deal = dealRepository.getDeal(dealId);

  if (!deal) {
    notFound();
  }

  const company = dealRepository.getCompany(deal.companyId);
  const stakeholders = dealRepository.getStakeholdersForDeal(deal.id);
  const interactions = dealRepository.getInteractionsForDeal(deal.id);

  return (
    <div className="space-y-10">
      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#EAEAEA]">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="font-editorial text-3xl text-[#111111]">{company?.name}</h1>
            <span className="badge-tag bg-[#E1F3FE] text-[#1F6C9F]">{deal.stage}</span>
          </div>
          <p className="text-sm text-[#787774] mt-1">
            {deal.title} — ${deal.value.toLocaleString()} ACV
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/deals/${deal.id}/timeline`}
            className="px-3.5 py-2 border border-[#EAEAEA] text-xs font-medium rounded hover:bg-[#F7F6F3]"
          >
            Timeline ({interactions.length})
          </Link>
          <Link
            href={`/deals/${deal.id}/prepare`}
            className="px-4 py-2 bg-[#111111] text-[#FFFFFF] text-xs font-medium rounded hover:bg-[#333333]"
          >
            Prepare for Next Interaction →
          </Link>
        </div>
      </div>

      {/* Grid: Stakeholders & Company Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="surface-card p-6 md:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#787774]">
            Key Stakeholders
          </h2>
          <div className="divide-y divide-[#EAEAEA]">
            {stakeholders.map((s) => (
              <div key={s.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-[#111111]">{s.name}</span>
                  <span className="badge-tag bg-[#F7F6F3] text-[#787774]">{s.role}</span>
                </div>
                <p className="text-xs text-[#787774]">{s.title}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {s.priorities.map((p, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-[#EDF3EC] text-[#346538] px-2 py-0.5 rounded"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#787774]">
            Account Facts
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#787774]">Industry</span>
              <p className="font-medium text-[#111111]">{company?.industry}</p>
            </div>
            <div>
              <span className="text-[#787774]">Annual Revenue</span>
              <p className="font-medium text-[#111111]">{company?.annualRevenue}</p>
            </div>
            <div>
              <span className="text-[#787774]">Tech Stack</span>
              <p className="font-mono text-[#111111]">{company?.techStack.join(', ')}</p>
            </div>
            <div>
              <span className="text-[#787774]">Active Competitors</span>
              <p className="font-medium text-[#111111]">{deal.competitors.join(', ') || 'None'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Open Objections & What Has Been Learned */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="surface-card p-6 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#787774]">
            Open Objections
          </h2>
          <div className="space-y-2">
            {deal.openObjections.map((obj, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#FDEBEC] text-[#9F2F2D] text-xs border border-[#EAEAEA] rounded"
              >
                {obj}
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-6 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#787774]">
            Consolidated Observation (Hindsight)
          </h2>
          <div className="p-4 bg-[#EDF3EC] text-[#346538] text-xs border border-[#EAEAEA] rounded space-y-2">
            <p className="font-medium">Observed Response Pattern:</p>
            <p className="leading-relaxed">
              &ldquo;Across 12 interactions with Acme Corporation, technical objections from CTO Marcus Vance stalled under commercial discounting (Interaction acme-003: 20% discount failed). However, presenting a phased 30-day sandbox migration roadmap (acme-004) produced immediate progression into technical validation.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
