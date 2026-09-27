"use client";

import { useState } from "react";
import Link from "next/link";

interface Step {
  id: number;
  title: string;
  badge: string;
  description: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "1. Select Flagship Account",
    badge: "Deal Context",
    description: "Inspect Acme Corp ($120k Enterprise expansion) facing a critical security and implementation blocker."
  },
  {
    id: 2,
    title: "2. Contrast: Memory OFF vs. Memory ON",
    badge: "The Hindsight Difference",
    description: "Compare what a standard stateless LLM recommends versus what Hindsight delivers from retained experience."
  },
  {
    id: 3,
    title: "3. Inspect Evidence & Mental Model",
    badge: "Audit Trail",
    description: "Trace recommendations back to specific historical interactions: why discounts failed and why migration roadmaps succeeded."
  },
  {
    id: 4,
    title: "4. Inject New Interaction & Outcome",
    badge: "Live Ingestion",
    description: "Simulate a live customer meeting where Sarah Jenkins confirms acceptance of the SOC2 bridge letter and migration schedule."
  },
  {
    id: 5,
    title: "5. Observe Updated Learning",
    badge: "Accumulated Intelligence",
    description: "Witness the system update its synthesized strategy in real time—experience directly informing future decisions."
  }
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [memoryMode, setMemoryMode] = useState<"on" | "off">("off");
  const [loading, setLoading] = useState(false);
  const [outcomeSubmitted, setOutcomeSubmitted] = useState(false);

  const simulateLoading = (nextAction: () => void) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      nextAction();
    }, 600);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-[#e2dec9] pb-8">
        <div className="inline-block px-2.5 py-0.5 text-xs font-mono tracking-widest uppercase bg-[#181817] text-[#f7f6f0] mb-3">
          Interactive Evaluation Walkthrough
        </div>
        <h1 className="text-3xl font-serif font-normal text-[#181817]">
          DealMemory Judge Evaluation Demo
        </h1>
        <p className="mt-2 text-sm text-[#666359] max-w-2xl font-serif">
          Experience the 60-second guided path showing how sales conversations turn into structured experience,
          how Hindsight replaces generic advice with evidence, and how new outcomes update future recommendations.
        </p>
      </div>

      {/* Step Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {STEPS.map((s) => {
          const isActive = s.id === currentStep;
          const isDone = s.id < currentStep;
          return (
            <button
              key={s.id}
              onClick={() => setCurrentStep(s.id)}
              className={`text-left p-3.5 border transition-all text-xs font-mono ${
                isActive
                  ? "border-[#181817] bg-[#ede9d8] shadow-sm"
                  : isDone
                  ? "border-[#c4beaa] bg-[#f2eee1] text-[#666359]"
                  : "border-[#e2dec9] bg-transparent text-[#948f80]"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{s.badge}</span>
                {isDone && <span className="text-[10px] text-emerald-700">DONE</span>}
                {isActive && <span className="text-[10px] text-[#181817] font-bold">CURRENT</span>}
              </div>
              <div className="font-serif text-sm text-[#181817] truncate">{s.title}</div>
            </button>
          );
        })}
      </div>

      {/* Step Content Container */}
      <div className="p-8 border border-[#e2dec9] bg-[#fcfbf7] space-y-6">
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#7c786a]">Step 1 of 5</span>
                <h2 className="text-2xl font-serif text-[#181817] mt-1">Select Account: Acme Corp</h2>
              </div>
              <span className="px-2.5 py-1 text-xs font-mono bg-[#ede9d8] border border-[#d6d0b8] text-[#181817]">
                Deal ID: deal_acme_001
              </span>
            </div>

            <p className="text-sm font-serif text-[#3a3935] leading-relaxed">
              Acme Corp is an enterprise prospect ($120k ARR) currently in the Technical Validation stage.
              They have 4 active stakeholders: Marcus Vance (VP Engineering), Sarah Jenkins (CTO), Elena Rostova (CFO),
              and David Park (Head of InfoSec). Over 7 recorded interactions, the deal has hit roadblocks on implementation
              friction, security compliance, and pricing.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs pt-4 border-t border-[#e2dec9]">
              <div className="p-3 bg-[#ede9d8] border border-[#d6d0b8]">
                <div className="text-[#7c786a] text-[10px] uppercase">Stage</div>
                <div className="font-bold text-[#181817] mt-0.5">Technical Validation</div>
              </div>
              <div className="p-3 bg-[#ede9d8] border border-[#d6d0b8]">
                <div className="text-[#7c786a] text-[10px] uppercase">Open Blockers</div>
                <div className="font-bold text-[#181817] mt-0.5">Implementation Complexity, SOC2 Type II</div>
              </div>
              <div className="p-3 bg-[#ede9d8] border border-[#d6d0b8]">
                <div className="text-[#7c786a] text-[10px] uppercase">Retained Interactions</div>
                <div className="font-bold text-[#181817] mt-0.5">7 Ingested in Hindsight</div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-[#181817] text-[#f7f6f0] hover:bg-[#33312e] transition-colors"
              >
                Proceed to Contrast Test →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#7c786a]">Step 2 of 5</span>
                <h2 className="text-2xl font-serif text-[#181817] mt-1">The Memory Contrast</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMemoryMode("off")}
                  className={`px-3 py-1 text-xs font-mono border ${
                    memoryMode === "off" ? "bg-[#181817] text-[#f7f6f0] border-[#181817]" : "bg-transparent border-[#c4beaa] text-[#666359]"
                  }`}
                >
                  Memory: OFF (Stateless)
                </button>
                <button
                  onClick={() => setMemoryMode("on")}
                  className={`px-3 py-1 text-xs font-mono border ${
                    memoryMode === "on" ? "bg-[#181817] text-[#f7f6f0] border-[#181817]" : "bg-transparent border-[#c4beaa] text-[#666359]"
                  }`}
                >
                  Memory: ON (Hindsight)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Memory OFF */}
              <div className={`p-5 border transition-all ${memoryMode === "off" ? "border-[#181817] bg-[#ede9d8]" : "border-[#e2dec9] opacity-60"}`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-mono font-bold uppercase text-[#7c786a]">Traditional AI Assistant</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#ded9c2] border border-[#c4beaa]">0 Memories Recalled</span>
                </div>
                <div className="font-serif text-sm text-[#2b2a26] space-y-3">
                  <p className="italic text-[#666359]">
                    &quot;Based on the deal stage, summarize our core product features. Emphasize competitive pricing and offer a 15-20% discount if the client pushes back on budget. Reiterate our enterprise SLA.&quot;
                  </p>
                  <div className="p-3 bg-[#e4dfca] border border-[#d6d0b8] text-xs font-mono text-[#733333]">
                    <strong>Fatal Flaw:</strong> Has zero knowledge that Acme already rejected discounts on Oct 24, resulting in a stalled conversation. Recommending another discount is actively harmful.
                  </div>
                </div>
              </div>

              {/* Memory ON */}
              <div className={`p-5 border transition-all ${memoryMode === "on" ? "border-emerald-700 bg-[#eff5ef]" : "border-[#e2dec9] opacity-60"}`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-900">Hindsight DealMemory</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-800">4 Evidence Units Recalled</span>
                </div>
                <div className="font-serif text-sm text-[#1b261d] space-y-3">
                  <p className="font-medium text-[#181817]">
                    &quot;Do not lead with pricing concessions. When a 15% discount was offered on Oct 24, the account stalled. Progress was only unlocked on Nov 02 when we provided an engineer-led migration roadmap. Lead with technical onboarding milestones and attach the SOC2 bridge letter for InfoSec.&quot;
                  </p>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-900">
                    <strong>Evidence-Linked:</strong> Grounded in deterministic interactions #002 (discount failure) and #004 (migration success).
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs font-mono uppercase text-[#666359] hover:text-[#181817]"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-[#181817] text-[#f7f6f0] hover:bg-[#33312e] transition-colors"
              >
                Inspect Evidence & Traceability →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#7c786a]">Step 3 of 5</span>
                <h2 className="text-2xl font-serif text-[#181817] mt-1">Audit Trail & Evidence</h2>
              </div>
              <span className="text-xs font-mono px-2 py-1 bg-[#ede9d8] border border-[#d6d0b8]">
                Disposition: Skeptical (Evidence-First)
              </span>
            </div>

            <p className="text-sm font-serif text-[#3a3935]">
              Every claim made by DealMemory links to an immutable document ID inside Hindsight.
              The agent refuses to hallucinate consensus where evidence shows conflict.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 border border-[#e2dec9] bg-[#ede9d8] text-xs font-mono">
                <div className="flex justify-between text-[#7c786a] mb-1">
                  <span>DOCUMENT: deal:acme-001:interaction:002</span>
                  <span className="text-rose-800 font-bold">OUTCOME: STALLED</span>
                </div>
                <div className="font-serif text-sm text-[#181817] mb-2">
                  Action: Offered 15% discount against Marcus Vance&apos;s implementation objection.
                </div>
                <div className="text-[11px] text-[#666359]">
                  Result: Prospect became disengaged. Stated price wasn&apos;t the problem; internal engineering bandwidth was the sole gating factor.
                </div>
              </div>

              <div className="p-4 border border-[#e2dec9] bg-[#ede9d8] text-xs font-mono">
                <div className="flex justify-between text-[#7c786a] mb-1">
                  <span>DOCUMENT: deal:acme-001:interaction:004</span>
                  <span className="text-emerald-800 font-bold">OUTCOME: PROGRESSED</span>
                </div>
                <div className="font-serif text-sm text-[#181817] mb-2">
                  Action: Delivered 30-day dual-run migration plan with dedicated TAM support.
                </div>
                <div className="text-[11px] text-[#666359]">
                  Result: CTO Sarah Jenkins approved proceeding to technical validation sandbox.
                </div>
              </div>

              <div className="p-4 border border-amber-300 bg-amber-50 text-xs font-mono">
                <div className="flex justify-between text-amber-900 mb-1">
                  <span>OBSERVED CONFLICT: BUDGET AMBIGUITY</span>
                  <span className="font-bold">REQUIRES HUMAN VALIDATION</span>
                </div>
                <div className="text-[11px] text-amber-800">
                  Interaction #001 recorded budget limit of $100k; Interaction #005 (CFO Elena Rostova) referenced an internal $85k cap. System flags: &quot;Validate ceiling with CFO before sending proposal.&quot;
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-xs font-mono uppercase text-[#666359] hover:text-[#181817]"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-[#181817] text-[#f7f6f0] hover:bg-[#33312e] transition-colors"
              >
                Simulate New Interaction & Outcome →
              </button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#7c786a]">Step 4 of 5</span>
                <h2 className="text-2xl font-serif text-[#181817] mt-1">Live Ingestion: Closing the Loop</h2>
              </div>
              <span className="text-xs font-mono px-2 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300">
                Action → Outcome → Ingestion
              </span>
            </div>

            <p className="text-sm font-serif text-[#3a3935]">
              Simulate the account executive logging the results of today&apos;s call with CTO Sarah Jenkins and Head of InfoSec David Park.
            </p>

            <div className="p-5 border border-[#e2dec9] bg-[#ede9d8] space-y-4 font-mono text-xs">
              <div>
                <span className="text-[#7c786a] uppercase">New Interaction Content</span>
                <p className="font-serif text-sm text-[#181817] mt-1">
                  &quot;Presented the SOC2 Type II bridge letter and 30-day technical validation plan to David Park (InfoSec) and Sarah Jenkins (CTO). David accepted the bridge letter and signed off on the security review. Sarah confirmed scheduled kickoff for sandbox testing on Monday.&quot;
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-[#7c786a] uppercase">Action Taken</span>
                  <div className="font-bold text-[#181817] mt-0.5">Delivered SOC2 Bridge + 30-Day Onboarding Plan</div>
                </div>
                <div>
                  <span className="text-[#7c786a] uppercase">Recorded Outcome</span>
                  <div className="font-bold text-emerald-800 mt-0.5">NEXT_STEP_CONFIRMED (Security Approved)</div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 text-xs font-mono uppercase text-[#666359] hover:text-[#181817]"
              >
                ← Back
              </button>

              <button
                disabled={loading || outcomeSubmitted}
                onClick={() => simulateLoading(() => {
                  setOutcomeSubmitted(true);
                  setCurrentStep(5);
                })}
                className="px-6 py-2.5 text-xs font-mono uppercase tracking-wider bg-emerald-800 text-[#f7f6f0] hover:bg-emerald-900 transition-colors disabled:opacity-50"
              >
                {loading ? "Retaining into Hindsight..." : outcomeSubmitted ? "Outcome Retained ✓" : "Ingest & Retain in Hindsight →"}
              </button>
            </div>
          </div>
        )}

        {/* Step 5 */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#7c786a]">Step 5 of 5</span>
                <h2 className="text-2xl font-serif text-[#181817] mt-1">Synthesized Mental Model Updated</h2>
              </div>
              <span className="text-xs font-mono px-2 py-1 bg-emerald-900 text-[#f7f6f0]">
                Loop Complete
              </span>
            </div>

            <div className="p-5 border border-emerald-300 bg-emerald-50 text-sm font-serif space-y-4">
              <h3 className="text-lg font-normal text-emerald-950">
                New Learned Pattern Formed
              </h3>
              <p className="text-emerald-900 leading-relaxed">
                With the successful resolution of interaction #008, Hindsight has consolidated the
                <strong> Acme Corp Deal Progression Model</strong>:
              </p>
              <div className="p-4 bg-[#fcfbf7] border border-emerald-200 text-xs font-mono text-[#181817] space-y-2">
                <div>
                  <span className="text-[#7c786a]">Consolidated Pattern:</span> Technical certainty and security documentation consistently unlock progression at Acme Corp. Price concessions stall progression.
                </div>
                <div>
                  <span className="text-[#7c786a]">Active Next Milestone:</span> Monday Sandbox Kickoff with Sarah Jenkins.
                </div>
                <div>
                  <span className="text-[#7c786a]">Outstanding Action Item:</span> Reconcile $85k vs $100k budget discrepancy with CFO Elena Rostova prior to contract draft.
                </div>
              </div>
            </div>

            <div className="p-4 border border-[#e2dec9] bg-[#ede9d8] text-xs font-mono text-[#666359] flex items-center justify-between">
              <span>This marks the transition from static CRM history to active outcome-learning intelligence.</span>
              <Link
                href="/deals/deal_acme_001/prepare"
                className="px-3 py-1.5 bg-[#181817] text-[#f7f6f0] hover:bg-[#33312e] uppercase text-[11px]"
              >
                Open Full Preparation Screen
              </Link>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => {
                  setOutcomeSubmitted(false);
                  setCurrentStep(1);
                }}
                className="px-4 py-2 text-xs font-mono uppercase text-[#666359] hover:text-[#181817]"
              >
                ↺ Reset Walkthrough
              </button>
              <Link
                href="/learning-loop"
                className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-[#181817] text-[#f7f6f0] hover:bg-[#33312e] transition-colors"
              >
                Inspect Global Learning Loop →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
