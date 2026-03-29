'use client';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useStore, formatTime, triggerCoach } from '@/lib/store';
import { EXERCISES, REST_DURATION_MS } from '@/lib/constants';
import ExerciseAnimation from './ExerciseAnimation';
import {
  Chart, BarController, LineController, BarElement, LineElement,
  PointElement, CategoryScale, LinearScale,
} from 'chart.js';

Chart.register(BarController, LineController, BarElement, LineElement, PointElement, CategoryScale, LinearScale);

// ── Phase bar ─────────────────────────────────────────────────────────────────

function PhaseBar() {
  const phase  = useStore((s) => s.phase);
  const status = useStore((s) => s.status);

  const steps = [
    { key: 'extend', label: 'EXTEND', active: phase === 'waiting_extend' || phase === 'extending' || phase === 'releasing', cls: 'bg-accent text-black' },
    { key: 'hold',   label: 'HOLD',   active: false, cls: 'bg-warn text-black' },
    { key: 'flex',   label: 'FLEX',   active: phase === 'hold_flex', cls: 'bg-servo text-black' },
    { key: 'rest',   label: 'REST',   active: status === 'complete', cls: 'bg-dim text-black' },
  ];

  return (
    <div className="flex items-center gap-1.5 bg-bg border border-border rounded-lg px-3 py-2 mb-3 shrink-0 flex-wrap">
      {steps.map(({ key, label, active, cls }, i) => (
        <span key={key} className="flex items-center gap-1.5">
          <span className={clsx('text-[11px] font-mono font-bold px-2 py-0.5 rounded transition-all', active ? cls : 'text-dim')}>
            {label}
          </span>
          {i < steps.length - 1 && <span className="text-border text-xs">›</span>}
        </span>
      ))}
    </div>
  );
}

// ── Set dots ──────────────────────────────────────────────────────────────────

function SetDots() {
  const currentSet = useStore((s) => s.currentSet);
  const totalSets  = useStore((s) => s.totalSets);
  const status     = useStore((s) => s.status);

  return (
    <div className="flex justify-center gap-2 my-2 shrink-0">
      {Array.from({ length: totalSets }, (_, i) => i + 1).map((i) => (
        <div key={i} className={clsx(
          'w-2.5 h-2.5 rounded-full transition-colors',
          i < currentSet        ? 'bg-accent' :
          i === currentSet && status !== 'idle' ? 'bg-accent/50' : 'bg-border'
        )} />
      ))}
    </div>
  );
}

// ── Rest countdown ────────────────────────────────────────────────────────────

function RestDisplay() {
  const status         = useStore((s) => s.status);
  const setRestComplete = useStore((s) => s.setRestComplete);
  const appendLog      = useStore((s) => s.appendLog);
  const currentSet     = useStore((s) => s.currentSet);
  const [remaining, setRemaining] = useState(REST_DURATION_MS);

  useEffect(() => {
    if (status !== 'resting') { setRemaining(REST_DURATION_MS); return; }
    const iv = setInterval(() => {
      setRemaining((v) => {
        if (v <= 1000) {
          clearInterval(iv);
          setRestComplete();
          appendLog('system', 'Rest complete — starting Set ' + currentSet);
          return REST_DURATION_MS;
        }
        return v - 1000;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [status, setRestComplete, appendLog, currentSet]);

  if (status !== 'resting') return null;

  return (
    <div className="bg-servo-dim border border-servo rounded-lg p-2.5 text-center mb-3 shrink-0">
      <div className="text-[10px] font-mono text-servo uppercase tracking-widest">Rest — next set in</div>
      <div className="text-[28px] font-bold font-mono text-servo">{formatTime(remaining)}</div>
    </div>
  );
}

// ── Session timer ─────────────────────────────────────────────────────────────

function SessionTimer() {
  const status        = useStore((s) => s.status);
  const elapsedMs     = useStore((s) => s.elapsedMs);
  const lastResumedAt = useStore((s) => s.lastResumedAt);
  const [display, setDisplay] = useState('00:00');

  useEffect(() => {
    if (status === 'idle') { setDisplay('00:00'); return; }
    if (status !== 'active') {
      setDisplay(formatTime(elapsedMs));
      return;
    }
    const tick = () => {
      const total = elapsedMs + (lastResumedAt ? Date.now() - lastResumedAt : 0);
      setDisplay(formatTime(total));
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [status, elapsedMs, lastResumedAt]);

  if (status === 'idle') return null;
  return <span className="font-mono text-[13px] text-dim tracking-wide">{display}</span>;
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ExerciseStation() {
  const currentExIdx    = useStore((s) => s.currentExIdx);
  const setCurrentExIdx = useStore((s) => s.setCurrentExIdx);
  const currentRep      = useStore((s) => s.currentRep);
  const repsPerSet      = useStore((s) => s.repsPerSet);
  const status          = useStore((s) => s.status);
  const chartData       = useStore((s) => s.chartData);
  const startSession    = useStore((s) => s.startSession);
  const pauseSession    = useStore((s) => s.pauseSession);

  const ex = EXERCISES[currentExIdx];

  // Chart
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      data: {
        labels: [],
        datasets: [
          { type: 'bar',  label: 'ROM',    data: [], backgroundColor: '#00c9a766', borderColor: '#00c9a7', borderWidth: 1, borderRadius: 3 } as never,
          { type: 'line', label: 'Target', data: [], borderColor: '#fbbf2488', borderDash: [4, 3], borderWidth: 1.5, pointRadius: 0, fill: false } as never,
        ],
      },
      options: {
        animation: false, responsive: true, maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: '#64748b', font: { family: 'monospace', size: 9 }, maxTicksLimit: 8 }, grid: { color: '#1e2530' }, border: { color: '#1e2530' } },
          y: { min: 0, max: 100, ticks: { color: '#64748b', font: { family: 'monospace', size: 9 }, stepSize: 25 }, grid: { color: '#1e2530' }, border: { color: '#1e2530' } },
        },
        plugins: { legend: { display: false } },
      },
    });
    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, []);

  useEffect(() => {
    const c = chartRef.current;
    if (!c) return;
    c.data.labels = chartData.map((d) => String(d.rep));
    c.data.datasets[0].data = chartData.map((d) => d.avgROM);
    c.data.datasets[1].data = chartData.map((d) => d.targetAvgROM);
    c.update('none');
  }, [chartData]);

  return (
    <div className="flex flex-col gap-0">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-dim font-mono mb-0.5">Exercises</div>
          <h1 className="text-xl font-bold text-muted leading-none">Exercise Station</h1>
        </div>
        <div className="flex-1" />
        <SessionTimer />
      </div>

      <div className="flex flex-col">
        {/* Exercise selector */}
        <select
          className="w-full bg-bg border border-border rounded-lg text-muted text-[13px] px-2.5 py-1.5 mb-3 cursor-pointer outline-none focus:border-accent shrink-0"
          value={ex.id}
          onChange={(e) => {
            const idx = EXERCISES.findIndex((x) => x.id === e.target.value);
            if (idx >= 0) setCurrentExIdx(idx);
          }}
        >
          {EXERCISES.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>

        {/* Exercise card */}
        <div className="bg-panel2 border border-border rounded-xl p-3.5 mb-3 shrink-0">
          <div className="text-[18px] font-bold text-muted mb-1">{ex.name}</div>
          <div className="text-xs text-dim leading-relaxed mb-3">{ex.description}</div>
          <pre className="bg-bg border border-border rounded-md px-2.5 py-2 font-mono text-[11px] text-dim leading-relaxed whitespace-pre overflow-x-auto">
            {ex.guide}
          </pre>
        </div>

        <ExerciseAnimation exerciseId={ex.id} />

        <PhaseBar />

        {/* Rep counter */}
        <div className="text-center my-2 shrink-0">
          <div className="text-[11px] font-mono text-dim uppercase tracking-widest mb-1">Rep</div>
          <div className="text-[52px] font-bold text-accent leading-none tracking-tight">
            {currentRep}
            <span className="text-[22px] text-dim font-normal"> / {repsPerSet}</span>
          </div>
        </div>

        <SetDots />
        <RestDisplay />

        {/* Controls */}
        <div className="flex gap-2 mb-3 shrink-0">
          <button
            className="flex-1 bg-accent text-black font-semibold text-[13px] rounded-lg py-2 hover:bg-accent/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => { startSession(); triggerCoach('session_start'); }}
            disabled={status === 'active' || status === 'resting'}
          >
            {status === 'complete' ? '↺ Restart' : '▶ Start'}
          </button>
          <button
            className="flex-1 border border-border text-muted text-[13px] rounded-lg py-2 hover:border-accent/40 hover:text-accent transition-colors disabled:opacity-40"
            onClick={pauseSession}
            disabled={status === 'idle' || status === 'resting' || status === 'complete'}
          >
            {status === 'paused' ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button
            className="flex-1 border border-border text-muted text-[13px] rounded-lg py-2 hover:border-accent/40 hover:text-accent transition-colors"
            onClick={() => setCurrentExIdx((currentExIdx + 1) % EXERCISES.length)}
          >
            → Next
          </button>
        </div>

        {/* Chart section — canvas always in DOM so Chart.js can bind */}
        <div className="flex flex-col flex-1 min-h-[120px] relative">
          <div className="text-[10px] font-bold uppercase tracking-widest text-dim font-mono mb-2">Session Progress</div>
          {chartData.length === 0 && (
            <div className="flex-1 flex items-center justify-center border border-dashed border-border rounded-lg text-dim text-xs font-mono text-center p-5">
              Start a session to<br />track rep performance
            </div>
          )}
          <div className={clsx('flex-1 min-h-[100px] relative', chartData.length === 0 ? 'hidden' : 'block')}>
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
