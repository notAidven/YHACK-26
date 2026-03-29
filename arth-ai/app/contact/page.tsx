import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Arth AI team.',
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 py-16">
        {/* Breadcrumb */}
        <div className="text-xs font-mono text-dim mb-8">
          <Link href="/" className="hover:text-muted transition-colors">Home</Link>
          <span className="mx-2 text-border">›</span>
          <span className="text-muted">Contact</span>
        </div>

        <h1 className="text-4xl font-bold text-muted mb-4">Get in touch</h1>
        <p className="text-dim text-lg leading-relaxed mb-12">
          Have a question about the hardware, want to collaborate, or just want to say hi? We&apos;d love to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {/* Info cards */}
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              ),
              label: 'Email',
              value: 'hello@arth-ai.dev',
              sub: 'We usually respond within 24 hours',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              ),
              label: 'GitHub',
              value: 'github.com/arth-ai',
              sub: 'Open source hardware + firmware',
            },
          ].map(({ icon, label, value, sub }) => (
            <div key={label} className="bg-panel border border-border rounded-xl p-6 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent-dim text-accent flex items-center justify-center shrink-0">
                {icon}
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-dim mb-1">{label}</div>
                <div className="font-medium text-muted mb-0.5">{value}</div>
                <div className="text-xs text-dim">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="bg-panel border border-border rounded-2xl p-8">
          <h2 className="text-xl font-bold text-muted mb-6">Send a message</h2>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-dim mb-1.5">Name</label>
                <input
                  type="text"
                  className="w-full bg-bg border border-border rounded-lg text-muted text-sm px-3 py-2.5 outline-none focus:border-accent transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-dim mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full bg-bg border border-border rounded-lg text-muted text-sm px-3 py-2.5 outline-none focus:border-accent transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-dim mb-1.5">Subject</label>
              <input
                type="text"
                className="w-full bg-bg border border-border rounded-lg text-muted text-sm px-3 py-2.5 outline-none focus:border-accent transition-colors"
                placeholder="What's this about?"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-dim mb-1.5">Message</label>
              <textarea
                rows={5}
                className="w-full bg-bg border border-border rounded-lg text-muted text-sm px-3 py-2.5 outline-none focus:border-accent transition-colors resize-none"
                placeholder="Tell us what's on your mind…"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent/85 transition-colors"
            >
              Send Message
            </button>
            <p className="text-center text-xs text-dim">
              This is a static demo form. Please use the email above to reach us directly.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
