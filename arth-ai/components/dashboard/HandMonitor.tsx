'use client';
import { useStore, computeAvgROM } from '@/lib/store';
import { FINGERS, EXERCISES } from '@/lib/constants';
import HandSvg from './HandSvg';

export default function HandMonitor() {
  const hwValues    = useStore((s) => s.hwValues);
  const currentExIdx = useStore((s) => s.currentExIdx);
  const totalReps   = useStore((s) => s.totalReps);
  const fingerAssist = useStore((s) => s.fingerAssist);
  const setFingerAssist = useStore((s) => s.setFingerAssist);

  const ex = EXERCISES[currentExIdx];
  const avg = computeAvgROM(hwValues);
  const peak = FINGERS.reduce((b, f) => hwValues[f.key] > hwValues[b.key] ? f : b, FINGERS[0]);

  return (
    <div className="flex flex-col gap-0">
      {/* Page header */}
      <div className="mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-dim font-mono mb-0.5">Monitor</div>
        <h1 className="text-xl font-bold text-muted">ROM Monitor</h1>
      </div>

      <div className="flex flex-col">
        {/* SVG Hand */}
        <HandSvg />

        {/* ROM Bars */}
        <div className="mt-2 flex flex-col gap-1.5">
          {FINGERS.map((f) => {
            const v = hwValues[f.key];
            const target = ex?.targetROM[f.key] ?? 0;
            const low = Math.max(0, target - 12);
            return (
              <div key={f.key} className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-dim w-11 shrink-0">{f.label}</span>
                <div className="flex-1 h-2.5 bg-bg border border-border rounded-full relative overflow-visible">
                  {/* Target zone */}
                  {ex && (
                    <div
                      className="absolute top-[-1px] h-[calc(100%+2px)] rounded-full bg-success/20 border border-success/40 z-[1] pointer-events-none"
                      style={{ left: `${low}%`, width: `${Math.min(100 - low, 24)}%` }}
                    />
                  )}
                  {/* Fill bar */}
                  <div
                    className="h-full rounded-full relative z-[2] transition-[width] duration-[60ms]"
                    style={{ width: `${v}%`, background: f.color }}
                  />
                </div>
                <span className="text-[11px] font-mono text-muted w-9 text-right tabular-nums shrink-0">
                  {v.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Per-finger assist toggles */}
        <div className="mt-3 shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-dim font-mono mb-1.5">Assist per Finger</div>
          <div className="flex gap-1.5 flex-wrap">
            {FINGERS.map((f) => {
              const on = fingerAssist[f.key]?.enabled ?? false;
              return (
                <button
                  key={f.key}
                  onClick={() => setFingerAssist(f.key, { enabled: !on })}
                  className={`flex items-center gap-1 border rounded-md px-2 py-1 text-[11px] font-mono transition-all ${
                    on
                      ? 'border-servo text-servo bg-servo-dim'
                      : 'border-border text-dim bg-bg hover:border-dim'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${on ? 'bg-servo' : 'bg-border'}`} />
                  {f.label.charAt(0)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-3 grid grid-cols-3 gap-1.5 shrink-0">
          {[
            { val: `${avg.toFixed(0)}%`, lbl: 'Avg ROM' },
            { val: peak.label.substring(0, 3), lbl: 'Peak' },
            { val: String(totalReps), lbl: 'Total Reps' },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="bg-bg border border-border rounded-lg p-2 text-center">
              <div className="text-[18px] font-bold font-mono text-muted">{val}</div>
              <div className="text-[9px] font-mono text-dim uppercase tracking-wide mt-0.5">{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
