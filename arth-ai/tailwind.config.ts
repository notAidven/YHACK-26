import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:          '#0d1117',
        panel:       '#13181f',
        panel2:      '#0f1319',
        border:      '#1e2530',
        accent:      '#00c9a7',
        'accent-dim':'rgba(0,201,167,0.09)',
        servo:       '#a78bfa',
        'servo-dim': 'rgba(167,139,250,0.09)',
        success:     '#34d399',
        danger:      '#f87171',
        warn:        '#fbbf24',
        muted:       '#e2e8f0',
        dim:         '#94a3b8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in':   'fadeIn 0.6s ease forwards',
        'slide-up':  'slideUp 0.6s ease forwards',
        'glow-pulse':'glowPulse 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:  { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glowPulse:{ '0%,100%': { boxShadow: '0 0 8px #00c9a766' }, '50%': { boxShadow: '0 0 22px #00c9a7cc' } },
      },
    },
  },
  plugins: [],
};

export default config;
