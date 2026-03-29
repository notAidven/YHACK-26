const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15l-1.575 1.679a2.25 2.25 0 01-1.65.721H7.425a2.25 2.25 0 01-1.65-.721L4.2 15m15.6 0a24.37 24.37 0 00-8.4-1.5 24.37 24.37 0 00-8.4 1.5" />
      </svg>
    ),
    title: 'Real-Time ROM Monitoring',
    body: 'Per-finger range-of-motion bars update live from the sensor glove. Colour-coded target zones show exactly when you hit the exercise goal.',
    accent: '#00c9a7',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Servo-Assisted Movement',
    body: 'Struggling to flex fully? The glove\'s servo motors provide gentle, calibrated assistance — per-finger, fully configurable — so no motion is out of reach.',
    accent: '#a78bfa',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    title: 'AI Therapy Coach',
    body: 'A Claude-powered coach watches your session and speaks up — celebrating milestones, suggesting form corrections, and keeping you motivated.',
    accent: '#6c8ef5',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Progress Tracking',
    body: 'A live bar+line chart shows every rep\'s peak ROM alongside the exercise target. Watch improvement happen in real time across sets.',
    accent: '#f0a050',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Guided Exercise Library',
    body: 'Five clinically-inspired hand therapy protocols — Tendon Glide, Hook Fist, Full Fist, Tabletop, and Finger Lift — with automated rep counting and rest timers.',
    accent: '#34d399',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" />
      </svg>
    ),
    title: 'Wireless Glove Connect',
    body: 'Connects to your ESP32 glove over Wi-Fi WebSocket with automatic reconnection. Manual calibration and one-tap auto-calibration keep readings accurate.',
    accent: '#d97ab8',
  },
];

export default function FeatureCards() {
  return (
    <section className="py-20 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-dim mb-3">
            What Arth AI does
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-muted">
            Everything you need to{' '}
            <span className="text-accent">move better</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon, title, body, accent }) => (
            <div
              key={title}
              className="group bg-panel border border-border rounded-xl p-6 hover:border-accent/30 transition-colors"
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                style={{ background: accent + '18', color: accent }}
              >
                {icon}
              </div>
              <h3 className="font-semibold text-muted mb-2">{title}</h3>
              <p className="text-dim text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
