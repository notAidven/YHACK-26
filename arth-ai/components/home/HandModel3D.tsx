'use client';
import { useEffect, useRef } from 'react';

const FINGERS = [
  { id: 'thumb',  color: '#6c8ef5', x: 52,  yBase: 210, width: 20, heights: [32, 28, 22], delay: 0 },
  { id: 'index',  color: '#00c9a7', x: 82,  yBase: 168, width: 20, heights: [34, 28, 22], delay: 120 },
  { id: 'middle', color: '#f0a050', x: 108, yBase: 160, width: 20, heights: [38, 30, 24], delay: 60 },
  { id: 'ring',   color: '#d97ab8', x: 134, yBase: 164, width: 20, heights: [34, 28, 22], delay: 180 },
  { id: 'pinky',  color: '#a78bfa', x: 160, yBase: 180, width: 17, heights: [26, 22, 18], delay: 240 },
];

export default function HandModel3D({ className = '' }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Gentle floating animation via JS (avoids Tailwind keyframe limits)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let frame: number;
    const start = performance.now();

    function animate(now: number) {
      const t = (now - start) / 1000;
      // Slow sway
      const sway = Math.sin(t * 0.5) * 4;
      const lift = Math.sin(t * 0.35) * 3;
      svg!.style.transform = `translateX(${sway}px) translateY(${lift}px)`;
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`flex items-center justify-center relative ${className}`}>
      {/* Glow backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-52 h-52 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #00c9a7 0%, #a78bfa 60%, transparent 100%)' }}
        />
      </div>

      <svg
        ref={svgRef}
        viewBox="0 40 210 260"
        width="220"
        height="270"
        style={{ filter: 'drop-shadow(0 8px 32px #00c9a733)' }}
      >
        <defs>
          {FINGERS.map((f) => (
            <linearGradient key={f.id} id={`grad-${f.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={f.color} stopOpacity="0.95" />
              <stop offset="100%" stopColor={f.color} stopOpacity="0.55" />
            </linearGradient>
          ))}
          <linearGradient id="grad-palm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e2a3a" />
            <stop offset="100%" stopColor="#13181f" />
          </linearGradient>
          <filter id="segment-shadow">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#00000066" />
          </filter>
        </defs>

        {/* Palm */}
        <rect
          x="48" y="210" width="120" height="90" rx="18"
          fill="url(#grad-palm)"
          stroke="#1e2530" strokeWidth="1"
          style={{ filter: 'drop-shadow(0 4px 12px #0008)' }}
        />

        {/* Fingers */}
        {FINGERS.map((f) => {
          let y = f.yBase;
          const rects = [];
          for (let i = 0; i < f.heights.length; i++) {
            const h = f.heights[i];
            rects.push(
              <rect
                key={i}
                x={f.x}
                y={y - h}
                width={f.width}
                height={h - 3}
                rx="6"
                fill={`url(#grad-${f.id})`}
                filter="url(#segment-shadow)"
                style={{
                  animation: `fingerPulse${f.id} 3s ease-in-out infinite`,
                  animationDelay: `${f.delay + i * 80}ms`,
                }}
              />
            );
            y -= h + 4; // gap between segments
          }
          return <g key={f.id}>{rects}</g>;
        })}

        {/* Finger labels */}
        {[
          { x: 62,  label: 'T' },
          { x: 92,  label: 'I' },
          { x: 118, label: 'M' },
          { x: 144, label: 'R' },
          { x: 168, label: 'P' },
        ].map(({ x, label }) => (
          <text key={label} x={x} y="310" textAnchor="middle" fontSize="10" fill="#4a5568" fontFamily="monospace">
            {label}
          </text>
        ))}

        {/* Knuckle dots */}
        {FINGERS.map((f) => (
          <circle
            key={f.id + '-knuckle'}
            cx={f.x + f.width / 2}
            cy={f.yBase}
            r="4"
            fill={f.color}
            opacity="0.6"
          />
        ))}
      </svg>

      {/* Per-finger glow pulses */}
      <style>{`
        ${FINGERS.map((f) => `
          @keyframes fingerPulse${f.id} {
            0%, 100% { opacity: 0.85; }
            50% { opacity: 1; }
          }
        `).join('')}
      `}</style>

      {/* Interaction hint */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs font-mono text-dim/50 pointer-events-none select-none">
        live sensor data visualisation
      </div>
    </div>
  );
}
