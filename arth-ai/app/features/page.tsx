import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Explore Arth AI\'s full feature set — ROM monitoring, servo assist, AI coaching, and more.',
};

const FEATURE_SECTIONS = [
  {
    id: 'monitoring',
    label: 'Monitoring',
    color: '#00c9a7',
    title: 'Real-Time ROM Monitoring',
    features: [
      { name: 'Per-finger tracking', desc: 'Each of the 5 fingers is tracked independently. Flex sensors stream data at ~20 Hz over WebSocket.' },
      { name: 'SVG hand diagram', desc: 'Anatomically-inspired hand SVG highlights finger segments as they reach ROM thresholds — instant visual feedback.' },
      { name: 'Target zone overlay', desc: 'The current exercise\'s target ROM is shown as a green overlay on each bar, so patients know exactly where to aim.' },
      { name: 'Stats panel', desc: 'Live average ROM, peak finger, and cumulative rep count shown in a compact stats row.' },
    ],
  },
  {
    id: 'exercises',
    label: 'Exercises',
    color: '#34d399',
    title: 'Guided Exercise Library',
    features: [
      { name: '5 therapy protocols', desc: 'Tendon Glide, Hook Fist, Full Fist, Tabletop, and Finger Lift — all inspired by standard occupational therapy programmes.' },
      { name: 'Automated rep counting', desc: 'A 4-phase state machine (extend → hold → flex → rest) counts each rep automatically based on sensor data.' },
      { name: 'Set & rest management', desc: 'Configurable sets per exercise with a 30-second rest timer between sets. Visual progress with set-dot indicator.' },
      { name: 'Session chart', desc: 'Chart.js bar+line chart plots every rep\'s peak ROM vs the exercise target in real time.' },
    ],
  },
  {
    id: 'servo',
    label: 'Servo Assist',
    color: '#a78bfa',
    title: 'Servo-Assisted Movement',
    features: [
      { name: 'Master assist mode', desc: 'One toggle activates servo assistance across all fingers — perfect for patients with limited grip strength.' },
      { name: 'Per-finger control', desc: 'Each finger can be independently enabled/disabled and its assist level tuned with a range slider.' },
      { name: 'Auto-assist on flex phase', desc: 'When assist mode is on, servos automatically apply force during the flex phase of each rep.' },
      { name: 'Instant release', desc: 'Servos release immediately when the rep completes or the user disables assist mode.' },
    ],
  },
  {
    id: 'coach',
    label: 'AI Coach',
    color: '#6c8ef5',
    title: 'Claude-Powered Therapy Coach',
    features: [
      { name: 'Context-aware coaching', desc: 'The coach receives live ROM readings, current exercise, and session progress on every trigger.' },
      { name: 'Automatic triggers', desc: 'Coach fires on session start, rep milestones, set completions, low ROM warnings, and session end.' },
      { name: 'Low ROM detection', desc: 'If average ROM drops below 45% of target for too long, the coach automatically checks in.' },
      { name: 'Manual check-in', desc: 'Patients can tap "Ask" at any time to get personalised encouragement or a form tip.' },
    ],
  },
  {
    id: 'hardware',
    label: 'Hardware',
    color: '#d97ab8',
    title: 'Wireless Glove & Calibration',
    features: [
      { name: 'WebSocket connection', desc: 'Connects to the ESP32 glove over Wi-Fi with automatic exponential-backoff reconnection.' },
      { name: 'Manual calibration', desc: 'Set MIN/MAX calibration points per finger to account for different hand sizes and sensor drift.' },
      { name: 'One-tap auto-calibration', desc: 'Auto-Cal guides the patient through a fist → open sequence and sets all 10 calibration points in 6 seconds.' },
      { name: 'MediaPipe debug mode', desc: 'Append ?debug=cv to use your webcam and MediaPipe Hands instead of the hardware glove — great for demos.' },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-5 py-16">
        {/* Breadcrumb */}
        <div className="text-xs font-mono text-dim mb-8">
          <Link href="/" className="hover:text-muted transition-colors">Home</Link>
          <span className="mx-2 text-border">›</span>
          <span className="text-muted">Features</span>
        </div>

        <h1 className="text-4xl font-bold text-muted mb-4">Features</h1>
        <p className="text-dim text-lg leading-relaxed mb-14 max-w-2xl">
          Everything Arth AI does — from hardware communication to AI-powered coaching.
        </p>

        {/* Quick-nav pills */}
        <div className="flex flex-wrap gap-2 mb-14">
          {FEATURE_SECTIONS.map(({ id, label, color }) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-xs font-mono border border-border rounded-full px-3 py-1.5 transition-colors hover:border-current"
              style={{ color }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {FEATURE_SECTIONS.map(({ id, color, title, features }) => (
            <section key={id} id={id}>
              <div
                className="inline-block text-xs font-mono font-bold uppercase tracking-widest mb-2 px-2 py-0.5 rounded"
                style={{ background: color + '18', color }}
              >
                {title}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {features.map(({ name, desc }) => (
                  <div key={name} className="bg-panel border border-border rounded-xl p-5">
                    <div className="font-semibold text-muted mb-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                      {name}
                    </div>
                    <p className="text-dim text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-accent text-black font-bold px-7 py-3 rounded-lg hover:bg-accent/85 transition-colors"
          >
            Open the Dashboard
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
