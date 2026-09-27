import Link from 'next/link';

export default function LearningLoopPage() {
  const steps = [
    {
      num: '01',
      title: 'Interaction Ingestion',
      desc: 'Sales call, email, or meeting transcript occurs with the customer.',
      code: `client.retain("deal-memory-demo", transcript, {
  documentId: "deal:acme-001:interaction:003",
  timestamp: "2026-08-18T11:00:00Z"
})`,
      tag: 'RETAIN',
      color: 'bg-[#E1F3FE] text-[#1F6C9F]',
    },
    {
      num: '02',
      title: 'Action Attempted',
      desc: 'Sales rep attempts a tactical action (e.g. Offering a 20% commercial discount).',
      code: `Action: 20% Commercial Discount
Target: Overcome CTO migration hesitation`,
      tag: 'ACTION',
      color: 'bg-[#FBF3DB] text-[#956400]',
    },
    {
      num: '03',
      title: 'Outcome Recorded & Retained',
      desc: 'Customer reacts negatively. Marcus explains price is not the blocker; migration downtime is.',
      code: `client.retain("deal-memory-demo", outcome, {
  documentId: "deal:acme-001:interaction:003:outcome",
  metadata: { outcome_type: "NO_CHANGE" }
})`,
      tag: 'OUTCOME',
      color: 'bg-[#FDEBEC] text-[#9F2F2D]',
    },
    {
      num: '04',
      title: 'Hindsight Consolidation (Observation)',
      desc: 'Hindsight synthesizes facts into a durable pattern: discounts fail on technical buyers.',
      code: `Observation: Across Acme interactions, pricing concessions
failed to overcome implementation risk, while migration
roadmaps produced technical validation.`,
      tag: 'CONSOLIDATION',
      color: 'bg-[#EDF3EC] text-[#346538]',
    },
    {
      num: '05',
      title: 'Better Future Action (Reflect)',
      desc: 'Next time the rep prepares a call, the agent actively warns against discounting and recommends migration guarantees.',
      code: `client.reflect("deal-memory-demo", "Prepare next call", {
  tags: ["deal:deal-acme-001"],
  budget: "high"
})`,
      tag: 'REFLECT',
      color: 'bg-[#E1F3FE] text-[#1F6C9F]',
    },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-editorial text-4xl text-[#111111]">The Core Learning Loop</h1>
        <p className="text-base text-[#787774] mt-2 max-w-3xl leading-relaxed">
          How DealMemory transforms one conversation&apos;s trial and error into permanent institutional experience for the entire revenue organization.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="surface-card p-6 flex flex-col md:flex-row md:items-start justify-between gap-6"
          >
            <div className="space-y-2 max-w-md">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-sm font-bold text-[#787774]">{step.num}</span>
                <span className={`badge-tag ${step.color}`}>{step.tag}</span>
              </div>
              <h2 className="text-lg font-semibold text-[#111111]">{step.title}</h2>
              <p className="text-sm text-[#787774] leading-relaxed">{step.desc}</p>
            </div>

            <div className="w-full md:max-w-md bg-[#F7F6F3] border border-[#EAEAEA] p-4 rounded text-xs font-mono text-[#111111] overflow-x-auto whitespace-pre">
              {step.code}
            </div>
          </div>
        ))}
      </div>

      <div className="surface-card p-8 text-center space-y-4">
        <h2 className="text-xl font-editorial text-[#111111]">Experience the Loop Live</h2>
        <p className="text-sm text-[#787774] max-w-xl mx-auto">
          Run the interactive Judge Demo to step through the sequence in 60 seconds with live Hindsight memory verification.
        </p>
        <Link
          href="/demo"
          className="inline-block px-5 py-2.5 bg-[#111111] text-[#FFFFFF] text-xs font-medium rounded hover:bg-[#333333]"
        >
          Open Judge Demo Flow →
        </Link>
      </div>
    </div>
  );
}
