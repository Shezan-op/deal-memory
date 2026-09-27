import Link from 'next/link';

export function Navigation() {
  return (
    <header className="border-b border-[#EAEAEA] bg-[#FBFBFA]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
            <span className="font-semibold text-sm tracking-tight text-[#111111]">
              DEALMEMORY
            </span>
          </Link>
          <span className="text-xs text-[#787774] hidden sm:inline-block">
            Outcome-Learning Deal Intelligence via Hindsight
          </span>
        </div>

        <nav className="flex items-center space-x-1 sm:space-x-4 text-xs font-medium">
          <Link
            href="/deals"
            className="px-3 py-1.5 text-[#111111] hover:text-[#787774] transition-colors"
          >
            Deals
          </Link>
          <Link
            href="/deals/deal-acme-001"
            className="px-3 py-1.5 text-[#111111] hover:text-[#787774] transition-colors"
          >
            Overview
          </Link>
          <Link
            href="/deals/deal-acme-001/timeline"
            className="px-3 py-1.5 text-[#111111] hover:text-[#787774] transition-colors"
          >
            Timeline
          </Link>
          <Link
            href="/deals/deal-acme-001/prepare"
            className="px-3 py-1.5 text-[#111111] hover:text-[#787774] transition-colors"
          >
            Next Interaction
          </Link>
          <Link
            href="/deals/deal-acme-001/memory"
            className="px-3 py-1.5 text-[#111111] hover:text-[#787774] transition-colors"
          >
            Memory
          </Link>
          <Link
            href="/learning-loop"
            className="px-3 py-1.5 text-[#111111] hover:text-[#787774] transition-colors"
          >
            Learning Loop
          </Link>
          <a
            href="/gamified.html"
            className="px-3 py-1.5 text-[#111111] hover:text-[#787774] transition-colors"
          >
            Simulation
          </a>
          <Link
            href="/demo"
            className="ml-2 px-3 py-1.5 bg-[#111111] text-[#FFFFFF] rounded text-xs hover:bg-[#333333] transition-all"
          >
            Judge Demo
          </Link>
        </nav>
      </div>
    </header>
  );
}
