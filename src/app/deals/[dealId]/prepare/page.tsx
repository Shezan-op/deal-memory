'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { DealPreparationBrief } from '@/lib/domain/models';

export default function PrepareNextInteractionPage() {
  const params = useParams();
  const dealId = params?.dealId as string;

  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<DealPreparationBrief | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const customGoal = '';

  const fetchBrief = useCallback(async (withMemory: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/deals/${dealId}/prepare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memoryEnabled: withMemory,
          customGoal: customGoal || undefined,
        }),
      });
      const data = await res.json();
      setBrief(data);
    } catch (err) {
      console.error('Failed to load brief', err);
    } finally {
      setLoading(false);
    }
  }, [dealId, customGoal]);

  useEffect(() => {
    if (dealId) {
      void fetchBrief(memoryEnabled);
    }
  }, [dealId, memoryEnabled, fetchBrief]);

  return (
    <div className="space-y-10">
      {/* Title & Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#EAEAEA]">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="font-editorial text-3xl text-[#111111]">Prepare Next Interaction</h1>
            <span className="badge-tag bg-[#E1F3FE] text-[#1F6C9F]">{dealId}</span>
          </div>
          <p className="text-sm text-[#787774] mt-1">
            Historical, evidence-backed preparation brief generated from retained interactions and outcomes.
          </p>
        </div>

        {/* Memory ON / OFF Switch (Core Contrast) */}
        <div className="flex items-center space-x-3 bg-[#FFFFFF] border border-[#EAEAEA] p-1.5 rounded-lg">
          <span className="text-xs font-medium text-[#787774] pl-2">Memory Layer:</span>
          <button
            onClick={() => setMemoryEnabled(false)}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              !memoryEnabled
                ? 'bg-[#9F2F2D] text-[#FFFFFF]'
                : 'text-[#787774] hover:text-[#111111]'
            }`}
          >
            OFF (Stateless)
          </button>
          <button
            onClick={() => setMemoryEnabled(true)}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              memoryEnabled
                ? 'bg-[#346538] text-[#FFFFFF]'
                : 'text-[#787774] hover:text-[#111111]'
            }`}
          >
            ON (Hindsight)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="surface-card p-12 text-center space-y-3">
          <div className="inline-block w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-[#111111]">
            {memoryEnabled
              ? 'Connecting historical evidence and analyzing past outcomes...'
              : 'Generating stateless baseline recommendation...'}
          </p>
          <p className="text-xs text-[#787774]">
            {memoryEnabled
              ? 'Querying Hindsight memory bank for previous objections and successful actions.'
              : 'Zero historical memory context.'}
          </p>
        </div>
      ) : brief ? (
        <div className="space-y-8">
          {/* Status Banner */}
          {!brief.memoryEnabled ? (
            <div className="p-4 bg-[#FDEBEC] border border-[#EAEAEA] rounded text-xs text-[#9F2F2D] flex items-center justify-between">
              <div>
                <strong>Memory Layer Disabled (Stateless Mode):</strong> Notice how the recommendation suggests generic advice (such as commercial discounts) without knowing that a 20% discount already failed with this CTO.
              </div>
              <button
                onClick={() => setMemoryEnabled(true)}
                className="underline font-semibold ml-4 whitespace-nowrap"
              >
                Turn Memory ON →
              </button>
            </div>
          ) : (
            <div className="p-4 bg-[#EDF3EC] border border-[#EAEAEA] rounded text-xs text-[#346538] flex items-center justify-between">
              <div>
                <strong>Memory Layer Active (Hindsight Enabled):</strong> Grounded in 12 retained interactions. Recommends operational migration proof and warns against discounts.
              </div>
              <span className="font-mono text-[11px]">8 Memories Cited</span>
            </div>
          )}

          {/* Section 1: Situation & Recommended Approach */}
          <div className="surface-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#787774]">
                Recommended Strategy for Next Meeting
              </h2>
              <button
                onClick={() => setShowEvidence(!showEvidence)}
                className="text-xs font-medium text-[#111111] underline hover:text-[#787774]"
              >
                {showEvidence ? 'Hide Supporting Evidence' : 'Inspect Supporting Evidence (Why?) →'}
              </button>
            </div>

            <p className="text-base text-[#111111] font-medium leading-relaxed bg-[#F7F6F3] p-4 rounded border border-[#EAEAEA]">
              {brief.recommendedApproach}
            </p>

            {brief.learnedPattern && (
              <div className="text-xs space-y-1 pt-2">
                <span className="text-[#787774] font-semibold">Learned Experience Pattern:</span>
                <p className="text-[#111111] leading-relaxed">{brief.learnedPattern}</p>
              </div>
            )}
          </div>

          {/* Collapsible Evidence Section (Why?) */}
          {showEvidence && (
            <div className="surface-card p-6 space-y-4 border-l-2 border-l-[#1F6C9F]">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1F6C9F]">
                Ground Truth Evidence Cited from Hindsight
              </h2>
              <div className="space-y-3">
                {brief.supportingEvidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 bg-[#FBFBFA] border border-[#EAEAEA] rounded text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="badge-tag bg-[#E1F3FE] text-[#1F6C9F]">{ev.type}</span>
                      <span className="font-mono text-[11px] text-[#787774]">{ev.documentId}</span>
                    </div>
                    <p className="text-[#111111]">{ev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What Has Been Tried Grid */}
          {brief.whatHasBeenTried.length > 0 && (
            <div className="surface-card p-6 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#787774]">
                What Has Been Tried & Resulting Outcomes
              </h2>
              <div className="divide-y divide-[#EAEAEA]">
                {brief.whatHasBeenTried.map((item, idx) => (
                  <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-medium text-[#111111]">{item.action}</span>
                      <p className="text-[#787774]">{item.resultSummary}</p>
                    </div>
                    <span
                      className={`badge-tag self-start sm:self-center ${
                        item.outcome === 'PROGRESSED' || item.outcome === 'NEXT_STEP_CONFIRMED'
                          ? 'bg-[#EDF3EC] text-[#346538]'
                          : 'bg-[#FDEBEC] text-[#9F2F2D]'
                      }`}
                    >
                      {item.outcome}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conflicting Memory Detection */}
          {brief.conflicts.length > 0 && (
            <div className="surface-card p-6 space-y-3 border-l-2 border-l-[#956400]">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#956400]">
                Conflicting Memory Signals Detected
              </h2>
              {brief.conflicts.map((c, idx) => (
                <div key={idx} className="text-xs space-y-2 bg-[#FBF3DB]/40 p-4 rounded border border-[#EAEAEA]">
                  <p className="font-medium text-[#111111]">{c.field}:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#787774]">
                    <div>Earlier: <strong className="text-[#111111]">{c.earlierValue}</strong> ({c.earlierSource})</div>
                    <div>Later: <strong className="text-[#111111]">{c.laterValue}</strong> ({c.laterSource})</div>
                  </div>
                  <p className="text-[#956400] pt-1 font-medium">{c.resolutionAdvice}</p>
                </div>
              ))}
            </div>
          )}

          {/* Questions to Ask & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="surface-card p-6 space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#787774]">
                Questions to Ask on Call
              </h2>
              <ul className="space-y-2 text-xs text-[#111111] list-disc list-inside">
                {brief.questionsToAsk.map((q, idx) => (
                  <li key={idx} className="leading-relaxed">{q}</li>
                ))}
              </ul>
            </div>

            <div className="surface-card p-6 space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9F2F2D]">
                Risks & Watch-outs
              </h2>
              <ul className="space-y-2 text-xs text-[#9F2F2D] list-disc list-inside">
                {brief.risksAndWatchouts.map((r, idx) => (
                  <li key={idx} className="leading-relaxed">{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
