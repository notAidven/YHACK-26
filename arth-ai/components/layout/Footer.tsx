import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-panel mt-24">
      <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="text-accent font-bold text-lg mb-2">Arth AI</div>
          <p className="text-dim text-sm leading-relaxed max-w-xs">
            Helping people with arthritis and physical disabilities regain mobility through intelligent, accessible technology.
          </p>
        </div>

        {/* Links */}
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-dim mb-3 font-mono">Navigation</div>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/',         label: 'Home' },
              { href: '/about',    label: 'About' },
              { href: '/features', label: 'Features' },
              { href: '/contact',  label: 'Contact' },
              { href: '/dashboard',label: 'Dashboard' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-dim hover:text-muted transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Project */}
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-dim mb-3 font-mono">Project</div>
          <p className="text-dim text-sm leading-relaxed">
            Built at YHack 2026 using Next.js, React Three Fiber, and the Claude API.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-dim hover:text-accent transition-colors border border-border rounded px-2 py-1"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-5 py-4">
        <p className="text-center text-xs text-dim font-mono">
          © {new Date().getFullYear()} Arth AI · Made with care for people with arthritis
        </p>
      </div>
    </footer>
  );
}
