'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { useWebSocket } from '@/lib/useWebSocket';
import { useStore } from '@/lib/store';
import { WsContext } from '@/lib/WsContext';
import { FINGERS } from '@/lib/constants';

const CvTracker = dynamic(() => import('./CvTracker'), { ssr: false });

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Hub',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/exercises',
    label: 'Exercises',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
  {
    href: '/dashboard/monitor',
    label: 'Monitor',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/servo',
    label: 'Servo',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/coach',
    label: 'Coach',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
];

// ── Connect popover ───────────────────────────────────────────────────────────

function ConnectPopover({ wsSend }: { wsSend: (o: object) => void }) {
  const [open, setOpen] = useState(false);
  const connState  = useStore((s) => s.connState);
  const wsUrl      = useStore((s) => s.wsUrl);
  const setWsUrl   = useStore((s) => s.setWsUrl);
  const appendLog  = useStore((s) => s.appendLog);
  const calMin     = useStore((s) => s.calMin);
  const calMax     = useStore((s) => s.calMax);
  const setCalMin  = useStore((s) => s.setCalMin);
  const setCalMax  = useStore((s) => s.setCalMax);
  const hwValues   = useStore((s) => s.hwValues);
  const { toggle } = useWebSocket();

  const dotCls =
    connState === 'connected'  ? 'bg-success shadow-[0_0_5px_#34d399]' :
    connState === 'connecting' ? 'bg-warn animate-pulse' : 'bg-border';

  function sendCal(i: number, type: 'min' | 'max') {
    wsSend({ cmd: 'calibrate', finger: i, type });
    const key = FINGERS[i].key as keyof typeof hwValues;
    if (type === 'min') setCalMin(i, Math.round(hwValues[key]));
    else setCalMax(i, Math.round(hwValues[key]));
  }

  function startAutoCal() {
    appendLog('system', 'Auto-Cal: Make a fist and hold 3 seconds…');
    setTimeout(() => {
      FINGERS.forEach((_, i) => sendCal(i, 'min'));
      appendLog('system', 'MIN set. Open your hand fully for 3 seconds…');
      setTimeout(() => {
        FINGERS.forEach((_, i) => sendCal(i, 'max'));
        appendLog('system', 'Auto-Cal complete.');
      }, 3000);
    }, 3000);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 border border-border rounded-lg px-3 py-1.5 text-[12px] font-mono text-dim hover:border-accent hover:text-accent transition-colors"
      >
        <div className={`w-2 h-2 rounded-full shrink-0 ${dotCls}`} />
        <span className="hidden sm:inline capitalize">{connState}</span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* Popover */}
          <div className="absolute top-full right-0 mt-2 bg-panel border border-border rounded-xl p-4 z-50 shadow-xl w-72">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-dim mb-3">
              Glove Connection
            </div>
            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 bg-bg border border-border rounded-md text-muted font-mono text-[12px] px-2.5 py-1.5 outline-none focus:border-accent"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
              />
              <button
                onClick={toggle}
                className={clsx(
                  'border rounded-md font-mono text-[11px] px-3 py-1.5 transition-colors',
                  connState === 'connected'
                    ? 'border-danger text-danger hover:bg-danger/10'
                    : 'border-accent text-accent hover:bg-accent-dim'
                )}
              >
                {connState === 'connected' ? 'Disconnect' : 'Connect'}
              </button>
            </div>

            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-dim mb-2">
              Calibration
            </div>
            <div className="flex gap-3 flex-wrap mb-2">
              {FINGERS.map((f, i) => (
                <div key={f.key} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-mono text-dim">{f.label.substring(0, 3).toUpperCase()}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => sendCal(i, 'min')}
                      className="text-[10px] font-mono px-1.5 py-0.5 border border-[#1f3a5c] text-[#58a6ff88] rounded hover:border-[#58a6ff] hover:text-[#58a6ff] transition-colors"
                    >MIN</button>
                    <button
                      onClick={() => sendCal(i, 'max')}
                      className="text-[10px] font-mono px-1.5 py-0.5 border border-[#3a1f5c] text-[#a78bfa88] rounded hover:border-servo hover:text-servo transition-colors"
                    >MAX</button>
                  </div>
                  <span className="text-[9px] font-mono text-dim">{calMin[i]}/{calMax[i]}</span>
                </div>
              ))}
            </div>
            <button
              onClick={startAutoCal}
              className="w-full border border-border rounded-md text-dim font-mono text-[11px] py-1.5 hover:border-accent hover:text-accent transition-colors"
            >
              Auto-Calibrate
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main shell ────────────────────────────────────────────────────────────────

// ── Main shell ────────────────────────────────────────────────────────────────

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { wsSend, toggle } = useWebSocket();
  const path      = usePathname();
  const router    = useRouter();
  const status    = useStore((s) => s.status);
  const connState = useStore((s) => s.connState);
  const inputMode = useStore((s) => s.inputMode);

  // Enforce gateway selection
  useEffect(() => {
    if (inputMode === null) router.replace('/gateway');
  }, [inputMode, router]);

  const sessionLabel =
    status === 'active'   ? 'Active' :
    status === 'paused'   ? 'Paused' :
    status === 'resting'  ? 'Resting' :
    status === 'complete' ? 'Complete' : null;

  const sessionDotCls =
    status === 'active'  ? 'bg-accent shadow-[0_0_5px_#00c9a7]' :
    status === 'resting' ? 'bg-warn' :
    status === 'complete'? 'bg-success' : 'bg-dim';

  if (inputMode === null) return null;

  return (
    <WsContext.Provider value={wsSend}>
      {inputMode === 'cv' && <CvTracker />}
      <div className="flex flex-col h-screen overflow-hidden bg-bg">

        {/* ── Top bar ── */}
        <header className="h-12 bg-panel border-b border-border flex items-center px-4 gap-4 shrink-0 z-20">
          <Link href="/" className="text-accent font-bold text-[17px] shrink-0 hover:text-accent/80 transition-colors">
            Arth AI
          </Link>

          <div className="h-4 w-px bg-border shrink-0" />

          {/* Feature nav */}
          <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
            {NAV_ITEMS.map(({ href, label, icon }) => {
              const exact = href === '/dashboard';
              const active = exact ? path === href : path.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors whitespace-nowrap',
                    active
                      ? 'text-accent bg-accent-dim'
                      : 'text-dim hover:text-muted hover:bg-panel2'
                  )}
                >
                  {icon}
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Session pill */}
          {sessionLabel && (
            <div className="hidden sm:flex items-center gap-1.5 bg-bg border border-border rounded-full px-2.5 py-1 text-[11px] font-mono shrink-0">
              <div className={`w-1.5 h-1.5 rounded-full ${sessionDotCls}`} />
              {sessionLabel}
            </div>
          )}

          {/* Connect */}
          <ConnectPopover wsSend={wsSend} />
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-hidden min-h-0">
          {children}
        </main>

        {/* ── Status bar ── */}
        <footer className="h-9 bg-panel border-t border-border flex items-center px-4 gap-3 shrink-0">
          <div className={clsx(
            'w-1.5 h-1.5 rounded-full shrink-0',
            connState === 'connected'  ? 'bg-success shadow-[0_0_4px_#34d399]' :
            connState === 'connecting' ? 'bg-warn animate-pulse' : 'bg-border'
          )} />
          <span className="text-[11px] font-mono text-dim capitalize">{connState}</span>
          {sessionLabel && (
            <>
              <div className="h-3 w-px bg-border" />
              <span className="text-[11px] font-mono text-dim">Session: {sessionLabel}</span>
            </>
          )}
        </footer>

      </div>
    </WsContext.Provider>
  );
}
