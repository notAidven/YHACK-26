import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'The story behind Arth AI — built at YHack to help arthritis patients regain hand mobility.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-5 py-16">
        {/* Breadcrumb */}
        <div className="text-xs font-mono text-dim mb-8">
          <Link href="/" className="hover:text-muted transition-colors">Home</Link>
          <span className="mx-2 text-border">›</span>
          <span className="text-muted">About</span>
        </div>

        <h1 className="text-4xl font-bold text-muted mb-4">About Arth AI</h1>
        <p className="text-dim text-lg leading-relaxed mb-10">
          We built Arth AI because access to quality hand therapy shouldn&apos;t depend on
          expensive clinic visits or living near a specialist.
        </p>

        {/* Mission */}
        <section className="mb-14">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-dim mb-3">Our Mission</div>
          <div className="bg-panel border border-border rounded-xl p-8">
            <blockquote className="text-xl text-muted font-medium leading-relaxed">
              &quot;Help people with arthritis and similar physical disabilities regain hand mobility
              through affordable, technology-powered therapy — at home, on their schedule.&quot;
            </blockquote>
          </div>
        </section>

        {/* The problem */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-muted mb-4">The problem we&apos;re solving</h2>
          <div className="space-y-4 text-dim leading-relaxed">
            <p>
              Over 350 million people worldwide live with arthritis. For many, hand therapy is essential to
              maintaining daily function — opening jars, typing, holding a phone. Yet physical therapy is
              expensive, inconvenient, and often under-prescribed.
            </p>
            <p>
              Patients are frequently sent home with a paper sheet of exercises and no way to know if
              they&apos;re performing them correctly. Without feedback, progress is slow and demotivating.
            </p>
            <p>
              Arth AI closes that gap. The sensor glove tracks exactly how far each finger bends on
              every rep. The AI coach watches in real time and speaks up when form slips or effort
              drops. Servo motors assist fingers that can&apos;t complete the motion on their own.
            </p>
          </div>
        </section>

        {/* Tech stack */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-muted mb-6">How it&apos;s built</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { layer: 'Hardware', desc: 'ESP32 microcontroller + 5 flex sensors + servo motors. Streams live finger data over Wi-Fi WebSocket at ~20 Hz.' },
              { layer: 'Computer Vision', desc: 'Optional MediaPipe hand-tracking mode lets you use a webcam instead of the glove for debug/demo purposes.' },
              { layer: 'Dashboard', desc: 'Next.js 15 app with React Three Fiber 3D model, Chart.js rep tracking, and real-time Zustand state management.' },
              { layer: 'AI Coach', desc: 'Claude (Haiku) via the Anthropic API. Watches ROM readings and session events, responds in warm and motivating plain English.' },
            ].map(({ layer, desc }) => (
              <div key={layer} className="bg-panel border border-border rounded-xl p-5">
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-accent mb-2">{layer}</div>
                <p className="text-dim text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Origin */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-muted mb-4">Origin</h2>
          <p className="text-dim leading-relaxed">
            Arth AI was built at <strong className="text-muted">YHack 2026</strong> — Yale University&apos;s annual hackathon.
            The project emerged from a conversation about a team member&apos;s grandmother, who struggled
            to maintain hand strength after a rheumatoid arthritis diagnosis. What started as a 24-hour
            sprint became a full-stack hardware+AI system that we&apos;re continuing to develop.
          </p>
        </section>

        <div className="flex gap-4">
          <Link href="/features" className="text-sm text-accent hover:underline font-medium">
            Explore features →
          </Link>
          <Link href="/contact" className="text-sm text-dim hover:text-muted transition-colors">
            Get in touch
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
