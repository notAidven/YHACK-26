import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 px-5">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-servo/5 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-accent-dim border border-accent/20 rounded-full px-4 py-1.5 text-xs font-mono text-accent mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          AI-Powered Hand Therapy
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-muted leading-tight mb-6">
          Regain your grip.
          <br />
          <span className="text-accent">Move with confidence.</span>
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl mx-auto text-dim text-lg leading-relaxed mb-10">
          Arth AI combines sensor-tracked exercises, servo-assisted movement, and a Claude-powered therapy coach to help arthritis patients rebuild hand strength and flexibility at home.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-accent text-black font-semibold px-6 py-3 rounded-lg hover:bg-accent/85 transition-colors text-sm"
          >
            Open Dashboard
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center gap-2 border border-border text-muted font-medium px-6 py-3 rounded-lg hover:border-accent/40 hover:text-accent transition-colors text-sm"
          >
            See Features
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { val: '5',    unit: 'exercises',     label: 'Therapy Protocols' },
            { val: 'Real', unit: '-time',          label: 'ROM Monitoring' },
            { val: 'AI',   unit: ' coach',         label: 'Claude-Powered' },
          ].map(({ val, unit, label }) => (
            <div key={label} className="bg-panel border border-border rounded-lg p-4 text-center">
              <div className="font-bold text-muted font-mono text-xl">
                {val}<span className="text-accent">{unit}</span>
              </div>
              <div className="text-dim text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
