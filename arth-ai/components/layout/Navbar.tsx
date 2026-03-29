'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';

const NAV_LINKS = [
  { href: '/',         label: 'Home' },
  { href: '/about',    label: 'About' },
  { href: '/features', label: 'Features' },
  { href: '/contact',  label: 'Contact' },
];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 h-14 bg-panel/90 border-b border-border backdrop-blur-md">
      <div className="max-w-6xl mx-auto h-full px-5 flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="text-accent font-bold text-lg tracking-tight shrink-0">
          Arth AI
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                path === href
                  ? 'text-accent bg-accent-dim'
                  : 'text-dim hover:text-muted hover:bg-panel2'
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex-1 hidden md:block" />

        {/* CTA */}
        <Link
          href="/dashboard"
          className="hidden md:inline-flex items-center gap-2 bg-accent text-black font-semibold text-sm px-4 py-2 rounded-lg hover:bg-accent/85 transition-colors"
        >
          Open Dashboard
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto text-dim hover:text-muted p-1"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {open ? (
              <path d="M5 5L17 17M17 5L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <>
                <path d="M3 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 11h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 15h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-panel border-t border-border px-5 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={clsx(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                path === href ? 'text-accent bg-accent-dim' : 'text-dim hover:text-muted'
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="mt-2 text-center bg-accent text-black font-semibold text-sm px-4 py-2 rounded-lg"
          >
            Open Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}
