import Link from 'next/link';
import { notFound } from 'next/navigation';
import { dealRepository } from '@/lib/repositories/deal-repository';

export default async function DealTimelinePage({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;
  const deal = dealRepository.getDeal(dealId);

  if (!deal) {
    notFound();
  }

  const interactions = dealRepository.getInteractionsForDeal(deal.id);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-6 border-b border-[#EAEAEA]">
        <div>
          <h1 className="font-editorial text-3xl text-[#111111]">Interaction Timeline</h1>
          <p className="text-sm text-[#787774] mt-1">
            Chronological interaction history and outcomes retained in Hindsight for {deal.companyName}.
          </p>
        </div>
        <Link
          href={`/deals/${deal.id}/prepare`}
          className="px-4 py-2 bg-[#111111] text-[#FFFFFF] text-xs font-medium rounded hover:bg-[#333333]"
        >
          Prepare Call →
        </Link>
      </div>

      <div className="relative border-l border-[#EAEAEA] ml-4 pl-6 space-y-8">
        {interactions.map((interaction) => {
          const outcome = interaction.outcome;
          const isProgress =
            outcome?.outcomeType === 'PROGRESSED' || outcome?.outcomeType === 'NEXT_STEP_CONFIRMED';
          const isStall = outcome?.outcomeType === 'STALLED' || outcome?.outcomeType === 'NO_CHANGE';

          return (
            <div key={interaction.id} className="relative space-y-3">
              {/* Timeline marker */}
              <div
                className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border-2 bg-[#FFFFFF] ${
                  isProgress
                    ? 'border-[#346538]'
                    : isStall
                    ? 'border-[#9F2F2D]'
                    : 'border-[#787774]'
                }`}
              />

              <div className="flex items-center space-x-3 text-xs">
                <span className="font-mono text-[#787774]">
                  {new Date(interaction.timestamp).toLocaleDateString()}
                </span>
                <span className="badge-tag bg-[#F7F6F3] text-[#787774]">{interaction.channel}</span>
                <span className="badge-tag bg-[#E1F3FE] text-[#1F6C9F]">{interaction.stage}</span>
                <span className="font-mono text-[11px] text-[#787774]">
                  ID: deal:{deal.id}:interaction:{interaction.id}
                </span>
              </div>

              <div className="surface-card p-5 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[#111111]">{interaction.context}</h3>
                    <p className="text-xs text-[#787774] mt-0.5">
                      Participants: {interaction.participants.join(', ')}
                    </p>
                  </div>
                  {outcome && (
                    <span
                      className={`badge-tag text-[10px] ${
                        isProgress
                          ? 'bg-[#EDF3EC] text-[#346538]'
                          : isStall
                          ? 'bg-[#FDEBEC] text-[#9F2F2D]'
                          : 'bg-[#FBF3DB] text-[#956400]'
                      }`}
                    >
                      {outcome.outcomeType}
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#111111] bg-[#F7F6F3] p-3 rounded font-mono leading-relaxed whitespace-pre-wrap">
                  {interaction.rawContent}
                </div>

                {interaction.actionAttempted && (
                  <div className="text-xs pt-1 flex items-center space-x-2">
                    <span className="text-[#787774] font-medium">Action Attempted:</span>
                    <span className="text-[#111111]">{interaction.actionAttempted}</span>
                  </div>
                )}

                {outcome && (
                  <div className="p-3 bg-[#FBFBFA] border border-[#EAEAEA] rounded text-xs space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-[#111111]">Outcome:</span>
                      <span className="text-[#787774]">{outcome.summary}</span>
                    </div>
                    <div className="text-[#787774]">
                      <strong>Reason:</strong> {outcome.reason}
                    </div>
                    {outcome.stakeholderReaction && (
                      <div className="text-[#787774]">
                        <strong>Stakeholder Reaction:</strong> {outcome.stakeholderReaction}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
