'use client';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useStore } from '@/lib/store';

const HandTracker = dynamic(() => import('./HandTracker'), { ssr: false });

// ── Hardware placeholder ───────────────────────────────────────────────────────

function initHardware(): void {
  // Placeholder: in production this would establish a BLE or USB handshake
  // before handing off to the WebSocket-based dashboard.
  console.log('[Arth AI] Hardware init — WebSocket will connect via dashboard settings.');
}

// ── Option cards ──────────────────────────────────────────────────────────────

function HardwareCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-panel border border-border hover:border-accent/60 rounded-2xl p-6 text-left transition-all duration-200 hover:shadow-[0_0_24px_rgba(0,201,167,0.08)] focus:outline-none focus-visible:border-accent"
    >
      <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
        {/* Chip icon */}
        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="7" y="7" width="10" height="10" rx="1" strokeWidth="1.5" />
          <path strokeWidth="1.5" strokeLinecap="round" d="M9 4v3M12 4v3M15 4v3M9 17v3M12 17v3M15 17v3M4 9h3M4 12h3M4 15h3M17 9h3M17 12h3M17 15h3" />
        </svg>
      </div>

      <div className="mb-1 flex items-center gap-2">
        <h2 className="text-[17px] font-bold text-muted">Hardware Device</h2>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">ESP32</span>
      </div>
      <p className="text-[12px] text-dim leading-relaxed mb-5">
        Connect your sensor glove via WebSocket for precise, low-latency hardware tracking.
      </p>

      <ul className="flex flex-col gap-1.5 mb-5">
        {['Real-time flex sensor data', 'Servo motor assist control', 'Sub-10 ms latency'].map((f) => (
          <li key={f} className="flex items-center gap-2 text-[11px] font-mono text-dim">
            <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-1.5 text-accent text-[12px] font-mono font-semibold">
        Connect &amp; enter dashboard
        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
      </div>

      {/* Hover glow border */}
      <div className="absolute inset-0 rounded-2xl border border-accent/0 group-hover:border-accent/20 transition-all pointer-events-none" />
    </button>
  );
}

function CVCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-panel border border-border hover:border-servo/60 rounded-2xl p-6 text-left transition-all duration-200 hover:shadow-[0_0_24px_rgba(167,139,250,0.08)] focus:outline-none focus-visible:border-servo"
    >
      <div className="w-12 h-12 rounded-xl bg-servo/10 border border-servo/20 flex items-center justify-center mb-5 group-hover:bg-servo/20 transition-colors">
        {/* Camera + hand icon */}
        <svg className="w-6 h-6 text-servo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
      </div>

      <div className="mb-1 flex items-center gap-2">
        <h2 className="text-[17px] font-bold text-muted">Hand Gesture AI</h2>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-servo/10 text-servo border border-servo/20">MediaPipe</span>
      </div>
      <p className="text-[12px] text-dim leading-relaxed mb-5">
        Use your device camera with on-device AI hand tracking. No hardware required.
      </p>

      <ul className="flex flex-col gap-1.5 mb-5">
        {['21-point hand skeleton overlay', 'Real-time ROM from landmarks', 'Works on any device'].map((f) => (
          <li key={f} className="flex items-center gap-2 text-[11px] font-mono text-dim">
            <span className="w-1 h-1 rounded-full bg-servo shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-1.5 text-servo text-[12px] font-mono font-semibold">
        Activate camera
        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
      </div>

      <div className="absolute inset-0 rounded-2xl border border-servo/0 group-hover:border-servo/20 transition-all pointer-events-none" />
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function GatewayScreen() {
  const router        = useRouter();
  const setInputMode  = useStore((s) => s.setInputMode);
  const [mode, setMode]               = useState<'hardware' | 'cv' | null>(null);
  const [handDetected, setHandDetected] = useState(false);

  function handleHardware() {
    initHardware();
    setInputMode('hardware');
    router.push('/dashboard');
  }

  function handleCV() {
    setInputMode('cv');
    setMode('cv');
  }

  const onHandDetected = useCallback((d: boolean) => setHandDetected(d), []);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Top bar */}
      <div className="flex items-center px-6 py-4 border-b border-border/50">
        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-accent">Arth AI</span>
        <div className="flex-1" />
        <span className="text-[11px] font-mono text-dim">Select input method to continue</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-panel border border-border rounded-full px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-mono text-dim">Step 1 of 2 — Input Setup</span>
          </div>
          <h1 className="text-3xl font-bold text-muted mb-3 leading-tight">
            How will you track<br />your hand movements?
          </h1>
          <p className="text-dim text-sm leading-relaxed">
            Choose a tracking method. You can switch anytime from the dashboard settings.
          </p>
        </div>

        {/* Mode cards or camera view */}
        {mode !== 'cv' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
            <HardwareCard onClick={handleHardware} />
            <CVCard onClick={handleCV} />
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            {/* Camera header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-dim mb-0.5">Hand Gesture AI</div>
                <h2 className="text-lg font-bold text-muted leading-none">Camera Setup</h2>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-dim">
                <span className="w-1.5 h-1.5 rounded-full bg-servo animate-pulse" />
                MediaPipe active
              </div>
            </div>

            {/* Camera + skeleton */}
            <HandTracker onHandDetected={onHandDetected} />

            {/* Actions */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => { setMode(null); setHandDetected(false); }}
                className="text-dim font-mono text-sm hover:text-muted transition-colors flex items-center gap-1.5"
              >
                ← Change method
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                disabled={!handDetected}
                className="flex items-center gap-2 bg-accent text-black font-semibold text-sm rounded-xl px-6 py-2.5 hover:bg-accent/85 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {handDetected ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-black/40 animate-pulse" />
                    Enter Dashboard
                    <span>→</span>
                  </>
                ) : (
                  'Waiting for hand…'
                )}
              </button>
            </div>

            {/* Tip */}
            <p className="text-center text-[11px] font-mono text-dim mt-4">
              Hold your hand open in front of the camera — the AI will detect it automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
