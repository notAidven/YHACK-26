'use client';
import { useEffect, useRef, useState } from 'react';
import { useStore, triggerCoach } from '@/lib/store';

export default function CoachPanel() {
  const log        = useStore((s) => s.log);
  const apiKey     = useStore((s) => s.apiKey);
  const setApiKey  = useStore((s) => s.setApiKey);
  const appendLog  = useStore((s) => s.appendLog);
  const totalReps  = useStore((s) => s.totalReps);
  const startTime  = useStore((s) => s.startTime);
  const currentSet = useStore((s) => s.currentSet);
  const status     = useStore((s) => s.status);
  const repHistory = useStore((s) => s.repHistory);
  const totalSets  = useStore((s) => s.totalSets);

  const [draft, setDraft] = useState(apiKey);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [log]);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('arthAiApiKey') : null;
    if (saved) { setDraft(saved); setApiKey(saved); }
  }, [setApiKey]);

  const avgRom = repHistory.length > 0
    ? (repHistory.reduce((a, r) => a + r.avgPeakROM, 0) / repHistory.length).toFixed(0) + '%'
    : '—';

  const duration = startTime
    ? (() => {
        const s = Math.floor((Date.now() - startTime) / 1000);
        return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
      })()
    : '—';

  function save() {
    setApiKey(draft.trim());
    if (typeof window !== 'undefined') localStorage.setItem('arthAiApiKey', draft.trim());
    appendLog('system', 'API key saved.');
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Page header */}
      <div className="mb-4 shrink-0">
        <div className="text-[10px] font-bold uppercase tracking-widest text-dim font-mono mb-0.5">Coach</div>
        <h1 className="text-xl font-bold text-muted">Therapy Coach</h1>
      </div>

      {/* API key */}
      <div className="flex gap-1.5 mb-2 shrink-0">
        <input
          type="password"
          placeholder="sk-ant-api… (Anthropic key)"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="flex-1 bg-bg border border-border rounded-md text-muted font-mono text-[11px] px-2 py-1.5 outline-none focus:border-accent min-w-0"
        />
        <button
          onClick={save}
          className="border border-border rounded-md text-dim font-mono text-[11px] px-2.5 py-1.5 hover:border-accent hover:text-accent transition-colors"
        >
          Save
        </button>
        <button
          onClick={() => triggerCoach('manual')}
          className="border border-border rounded-md text-dim font-mono text-[11px] px-2.5 py-1.5 hover:border-accent hover:text-accent transition-colors"
        >
          Ask
        </button>
      </div>

      {/* Log */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 min-h-[80px]">
        {log.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-0.5">
            <span className="text-[10px] font-mono text-dim">{entry.ts}</span>
            <span className={`text-[11px] leading-relaxed border rounded-md px-2 py-1.5 break-words ${
              entry.role === 'assistant' ? 'border-[#1a3a50] bg-[#0a1a28] text-[#b3d9f0]' :
              entry.role === 'error'     ? 'border-[#3a1515] bg-bg text-danger' :
              'border-border bg-bg text-muted'
            }`}>
              {entry.text}
            </span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      <div className="h-px bg-border my-3 shrink-0" />

      {/* Session summary */}
      <div className="text-[10px] font-bold uppercase tracking-widest text-dim font-mono mb-2 shrink-0">
        Session Summary
      </div>
      <div className="grid grid-cols-2 gap-1.5 shrink-0">
        {[
          { val: String(totalReps), lbl: 'Total Reps' },
          { val: avgRom,            lbl: 'Avg ROM' },
          { val: duration,          lbl: 'Duration' },
          { val: String(status === 'complete' ? totalSets : Math.max(0, currentSet - 1)), lbl: 'Sets Done' },
        ].map(({ val, lbl }) => (
          <div key={lbl} className="bg-bg border border-border rounded-lg p-2">
            <div className="text-[16px] font-bold font-mono text-muted">{val}</div>
            <div className="text-[9px] font-mono text-dim uppercase tracking-wide">{lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
