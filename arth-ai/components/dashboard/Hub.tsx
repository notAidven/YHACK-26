'use client';
import Link from 'next/link';
import { useStore, computeAvgROM } from '@/lib/store';

const FEATURES = [
  {
    href: '/dashboard/exercises',
    title: 'Exercises',
    description: 'Choose from 5 guided therapy protocols. The session tracks every rep, phase, and rest period automatically.',
    accent: '#00c9a7',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    badge: null,
  },
  {
    href: '/dashboard/monitor',
    title: 'ROM Monitor',
    description: 'Live per-finger range-of-motion tracking with an SVG hand diagram, target zone overlays, and stats.',
    accent: '#6c8ef5',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    badge: null,
  },
  {
    href: '/dashboard/servo',
    title: 'Servo Assist',
    description: 'Enable motor-assisted movement per finger. Configure intensity and per-finger enable/disable toggles.',
    accent: '#a78bfa',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    badge: null,
  },
  {
    href: '/dashboard/coach',
    title: 'Therapy Coach',
    description: 'A Claude-powered AI coach that monitors your session in real time — encouraging progress and flagging low ROM.',
    accent: '#f0a050',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    badge: null,
  },
];

// ── Session summary strip ─────────────────────────────────────────────────────

function SessionStrip() {
  const status    = useStore((s) => s.status);
  const totalReps = useStore((s) => s.totalReps);
  const hwValues  = useStore((s) => s.hwValues);
  const connState = useStore((s) => s.connState);

  if (status === 'idle' && connState === 'disconnected') return null;

  const avg = computeAvgROM(hwValues);

  return (
    <div className="mb-8 bg-panel border border-border rounded-xl px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
      {connState !== 'disconnected' && (
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${connState === 'connected' ? 'bg-success shadow-[0_0_4px_#34d399]' : 'bg-warn animate-pulse'}`} />
          <span className="text-dim font-mono text-[12px] capitalize">{connState}</span>
        </div>
      )}
      {status !== 'idle' && (
        <>
          <div className="text-[12px] font-mono text-dim">
            Status: <span className="text-muted">{status}</span>
          </div>
          <div className="text-[12px] font-mono text-dim">
            Reps: <span className="text-muted">{totalReps}</span>
          </div>
          <div className="text-[12px] font-mono text-dim">
            Avg ROM: <span className="text-accent">{avg.toFixed(0)}%</span>
          </div>
        </>
      )}
    </div>
  );
}

// ── Hub ───────────────────────────────────────────────────────────────────────

export default function Hub() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-5 py-10">
        <div className="mb-2 text-[11px] font-mono uppercase tracking-widest text-dim">Dashboard</div>
        <h1 className="text-2xl font-bold text-muted mb-1">Select a feature</h1>
        <p className="text-dim text-sm mb-8">
          Each tool runs independently. Connect your glove from any page using the button in the top-right.
        </p>

        <SessionStrip />

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map(({ href, title, description, accent, icon }) => (
            <Link
              key={href}
              href={href}
              className="group bg-panel border border-border hover:border-current rounded-2xl p-6 flex flex-col gap-4 transition-colors"
              style={{ '--hover-color': accent } as React.CSSProperties}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: accent + '18', color: accent }}
              >
                {icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="font-semibold text-muted text-[15px] mb-1 flex items-center gap-2">
                  {title}
                  <svg
                    className="w-4 h-4 text-dim opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <p className="text-dim text-sm leading-relaxed">{description}</p>
              </div>

              {/* Open label */}
              <div
                className="text-[11px] font-mono font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: accent }}
              >
                Open →
              </div>
            </Link>
          ))}
        </div>

        {/* Quick-start tip */}
        <div className="mt-8 bg-accent-dim border border-accent/20 rounded-xl px-5 py-4 flex gap-3 items-start">
          <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-sm text-dim leading-relaxed">
            <span className="text-muted font-medium">Quick start:</span> Click the connection button (top right), enter your glove&apos;s IP, then open{' '}
            <Link href="/dashboard/exercises" className="text-accent hover:underline">Exercises</Link> to begin your session.
          </p>
        </div>
      </div>
    </div>
  );
}
