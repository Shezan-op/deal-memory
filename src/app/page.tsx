import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="space-y-6 max-w-4xl">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-[#EDF3EC] text-[#346538] text-xs font-mono">
          <span>Hindsight Hackathon Submission</span>
          <span>•</span>
          <span>Outcome-Linked Memory Layer</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#111111] leading-tight">
          Every sales conversation becomes experience the next conversation can learn from.
        </h1>

        <p className="text-base sm:text-lg text-[#787774] max-w-3xl leading-relaxed">
          Traditional sales tools stop at summarizing calls. <strong className="text-[#111111]">DealMemory</strong> records what action was tried, links what outcome followed, and uses Hindsight to help account executives recommend better future actions backed by historical evidence.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href="/demo"
            className="px-5 py-2.5 bg-[#111111] text-[#FFFFFF] text-sm font-medium rounded hover:bg-[#333333] transition-colors"
          >
            Launch Judge Demo (60s Flow) →
          </Link>
          <Link
            href="/deals/deal-acme-001/prepare"
            className="px-5 py-2.5 bg-[#FFFFFF] border border-[#EAEAEA] text-[#111111] text-sm font-medium rounded hover:bg-[#F7F6F3] transition-colors"
          >
            Prepare Next Interaction
          </Link>
          <Link
            href="/learning-loop"
            className="px-5 py-2.5 bg-[#FFFFFF] border border-[#EAEAEA] text-[#787774] text-sm font-medium rounded hover:bg-[#F7F6F3] transition-colors"
          >
            View Learning Architecture
          </Link>
        </div>
      </section>

      {/* Conceptual Core Contrast Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="surface-card p-6 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[#9F2F2D] bg-[#FDEBEC] inline-block px-2 py-0.5 rounded">
            Traditional AI
          </div>
          <h2 className="text-xl font-medium text-[#111111]">Stateless Call Summaries</h2>
          <p className="text-sm text-[#787774] leading-relaxed">
            Conversation → Static Summary. The rep gets a transcript regurgitation. If they ask how to handle an objection, the model gives generic sales advice (e.g. &ldquo;Offer a 20% discount&rdquo;) regardless of whether that failed previously with this customer.
          </p>
          <div className="p-3 bg-[#F7F6F3] border border-[#EAEAEA] rounded text-xs font-mono text-[#787774]">
            Action: 20% Discount Offered<br />
            Result: Objection ignored; CTO annoyed; deal stalled.
          </div>
        </div>

        <div className="surface-card p-6 space-y-4 border-l-2 border-l-[#111111]">
          <div className="text-xs font-mono uppercase tracking-wider text-[#346538] bg-[#EDF3EC] inline-block px-2 py-0.5 rounded">
            DealMemory via Hindsight
          </div>
          <h2 className="text-xl font-medium text-[#111111]">Outcome-Linked Experience</h2>
          <p className="text-sm text-[#787774] leading-relaxed">
            Conversation → Retain → Action → Outcome → Consolidated Observation → Improved Action. The agent remembers that discounting failed on Acme, while a migration sandbox progressed the deal.
          </p>
          <div className="p-3 bg-[#F7F6F3] border border-[#EAEAEA] rounded text-xs font-mono text-[#111111]">
            Learned: Operational proof progressed technical validation.<br />
            Next Call: Lead with migration roadmap; avoid unprompted discounts.
          </div>
        </div>
      </section>

      {/* Flagship Account Callout */}
      <section className="surface-card p-8 space-y-4">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <span className="text-xs font-mono text-[#1F6C9F] bg-[#E1F3FE] px-2 py-0.5 rounded uppercase">
              Flagship Evaluation Deal
            </span>
            <h3 className="text-2xl font-editorial text-[#111111] mt-2">Acme Corporation</h3>
            <p className="text-sm text-[#787774]">
              Enterprise Intelligence Expansion — $185,000 — Stage: Technical Validation
            </p>
          </div>
          <Link
            href="/deals/deal-acme-001"
            className="px-4 py-2 border border-[#EAEAEA] text-xs font-medium rounded hover:bg-[#F7F6F3]"
          >
            Explore Account →
          </Link>
        </div>

        <p className="text-sm text-[#787774]">
          Contains 12 chronologically retained interactions spanning CTO Marcus Vance, CFO Elena Rostova, and VP InfoSec David Kim. Demonstrates how an initial price discount failed, a migration roadmap succeeded, and conflicting budget signals were resolved.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#EAEAEA] text-xs">
          <div>
            <span className="text-[#787774]">Stakeholders</span>
            <p className="font-medium text-[#111111]">4 Executives</p>
          </div>
          <div>
            <span className="text-[#787774]">Interactions</span>
            <p className="font-medium text-[#111111]">12 Retained</p>
          </div>
          <div>
            <span className="text-[#787774]">Hindsight Bank</span>
            <p className="font-mono text-[#111111]">deal-memory-demo</p>
          </div>
          <div>
            <span className="text-[#787774]">Memory Verification</span>
            <p className="text-[#346538] font-medium">Verified Active</p>
          </div>
        </div>
      </section>
    </div>
  );
}
