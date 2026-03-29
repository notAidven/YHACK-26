import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeatureCards from '@/components/home/FeatureCards';
import HandModel3DClient from '@/components/home/HandModel3DClient';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeatureCards />

        {/* ── 3D Model section ── */}
        <section className="py-20 px-5 bg-panel border-y border-border">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-dim mb-3">
                Interactive 3D Preview
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-muted mb-5">
                See every joint.
                <br />
                <span className="text-servo">Monitor every movement.</span>
              </h2>
              <p className="text-dim leading-relaxed mb-6">
                The Arth AI glove tracks each of your 5 fingers independently using flex sensors. Our procedural 3D model reflects the real hand anatomy — giving you and your therapist a precise view of joint angles and range of motion.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Per-finger ROM tracking with coloured segments',
                  'Target zone overlay for each exercise',
                  'Servo-assisted movement for limited mobility',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-dim">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/gateway"
                className="inline-flex items-center gap-2 bg-accent text-black font-semibold px-5 py-2.5 rounded-lg hover:bg-accent/85 transition-colors text-sm"
              >
                Try the dashboard
              </Link>
            </div>

            {/* 3D Canvas */}
            <div className="h-[420px] bg-bg rounded-2xl border border-border overflow-hidden relative">
              <HandModel3DClient className="w-full h-full" />
              <div className="absolute bottom-3 right-3 text-xs font-mono text-dim/60 pointer-events-none">
                drag to rotate · scroll to zoom
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-20 px-5">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-dim mb-3">How it works</div>
            <h2 className="text-3xl font-bold text-muted mb-14">Three steps to better mobility</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Connect the glove',
                  body: 'Slip on the sensor glove and connect wirelessly over Wi-Fi. Flex sensors read each finger\'s position at ~20 Hz.',
                  color: '#00c9a7',
                },
                {
                  step: '02',
                  title: 'Follow the exercise',
                  body: 'Pick from 5 guided protocols. The dashboard tracks every rep, phase, and rest period automatically.',
                  color: '#a78bfa',
                },
                {
                  step: '03',
                  title: 'Get AI feedback',
                  body: 'The Claude-powered coach monitors your ROM in real time — celebrating progress and helping with form.',
                  color: '#6c8ef5',
                },
              ].map(({ step, title, body, color }) => (
                <div key={step} className="relative">
                  <div className="text-4xl font-bold font-mono mb-4" style={{ color: color + '40' }}>
                    {step}
                  </div>
                  <h3 className="font-semibold text-muted mb-2">{title}</h3>
                  <p className="text-dim text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA banner ── */}
        <section className="py-16 px-5">
          <div className="max-w-2xl mx-auto text-center bg-panel border border-accent/20 rounded-2xl p-10">
            <div className="w-12 h-12 rounded-full bg-accent-dim flex items-center justify-center mx-auto mb-5">
              <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15l-1.575 1.679a2.25 2.25 0 01-1.65.721H7.425a2.25 2.25 0 01-1.65-.721L4.2 15m15.6 0a24.37 24.37 0 00-8.4-1.5 24.37 24.37 0 00-8.4 1.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-muted mb-3">Ready to start your therapy?</h2>
            <p className="text-dim text-sm mb-7 leading-relaxed">
              Open the live dashboard, connect your glove, and begin your first session in under a minute.
            </p>
            <Link
              href="/gateway"
              className="inline-flex items-center gap-2 bg-accent text-black font-bold px-7 py-3 rounded-lg hover:bg-accent/85 transition-colors"
            >
              Open Dashboard
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
