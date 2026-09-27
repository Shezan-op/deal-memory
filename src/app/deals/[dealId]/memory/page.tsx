import Link from 'next/link';
import { notFound } from 'next/navigation';
import { dealRepository } from '@/lib/repositories/deal-repository';
import { intelligenceService } from '@/lib/domain/intelligence-service';

export default async function DealMemoryPage({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;
  const deal = dealRepository.getDeal(dealId);

  if (!deal) {
    notFound();
  }

  const memoryProvider = intelligenceService.getMemoryProvider();
  const memories = await memoryProvider.listMemories(deal.id);
  const interactions = dealRepository.getInteractionsForDeal(deal.id);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-6 border-b border-[#EAEAEA]">
        <div>
          <h1 className="font-editorial text-3xl text-[#111111]">Hindsight Memory Explorer</h1>
          <p className="text-sm text-[#787774] mt-1">
            Inspecting memory bank <code className="font-mono text-xs">deal-memory-demo</code> for account {deal.companyName}.
          </p>
        </div>
        <Link
          href={`/deals/${deal.id}/prepare`}
          className="px-4 py-2 bg-[#111111] text-[#FFFFFF] text-xs font-medium rounded hover:bg-[#333333]"
        >
          Prepare Call →
        </Link>
      </div>

      {/* Memory Taxonomy Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="surface-card p-4 space-y-1">
          <span className="text-xs text-[#787774] uppercase tracking-wider font-mono">World Facts</span>
          <p className="text-2xl font-editorial text-[#111111]">6</p>
          <span className="text-[11px] text-[#787774]">Stable account facts</span>
        </div>
        <div className="surface-card p-4 space-y-1">
          <span className="text-xs text-[#787774] uppercase tracking-wider font-mono">Experiences</span>
          <p className="text-2xl font-editorial text-[#111111]">{interactions.length}</p>
          <span className="text-[11px] text-[#787774]">Interactions & outcomes</span>
        </div>
        <div className="surface-card p-4 space-y-1">
          <span className="text-xs text-[#787774] uppercase tracking-wider font-mono">Observations</span>
          <p className="text-2xl font-editorial text-[#111111]">2</p>
          <span className="text-[11px] text-[#787774]">Consolidated patterns</span>
        </div>
        <div className="surface-card p-4 space-y-1">
          <span className="text-xs text-[#787774] uppercase tracking-wider font-mono">Mental Models</span>
          <p className="text-2xl font-editorial text-[#111111]">1</p>
          <span className="text-[11px] text-[#787774]">Deal Strategy Model</span>
        </div>
      </div>

      {/* Retained Memory Items */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#787774]">
          Durable Memory Units in Bank
        </h2>

        <div className="space-y-3">
          {memories.length > 0 ? (
            memories.map((mem) => (
              <div key={mem.id} className="surface-card p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="badge-tag bg-[#E1F3FE] text-[#1F6C9F]">{mem.type}</span>
                  <span className="font-mono text-[#787774] text-[11px]">{mem.documentId}</span>
                </div>
                <p className="text-[#111111] font-mono leading-relaxed">{mem.text}</p>
                {mem.context && (
                  <p className="text-[#787774] text-[11px]">Context: {mem.context}</p>
                )}
              </div>
            ))
          ) : (
            interactions.map((inter) => (
              <div key={inter.id} className="surface-card p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="badge-tag bg-[#EDF3EC] text-[#346538]">
                    {inter.outcome ? 'experience' : 'world'}
                  </span>
                  <span className="font-mono text-[#787774] text-[11px]">
                    deal:{deal.id}:interaction:{inter.id}
                  </span>
                </div>
                <p className="text-[#111111] leading-relaxed">
                  <strong>Action:</strong> {inter.actionAttempted || 'Discussion'} →{' '}
                  <strong>Outcome:</strong> {inter.outcome?.outcomeType || 'LOGGED'}:{' '}
                  {inter.outcome?.summary || inter.context}
                </p>
                <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px] text-[#787774]">
                  <span>deal:{deal.id}</span>
                  <span>•</span>
                  <span>company:{deal.companyId}</span>
                  <span>•</span>
                  <span>stage:{inter.stage}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
