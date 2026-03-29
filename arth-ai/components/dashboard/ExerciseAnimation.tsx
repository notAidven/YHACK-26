'use client';
import { useEffect, useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type JA = { mcp: number; pip: number; dip: number };
type Pose = { thumb: JA; index: JA; middle: JA; ring: JA; pinky: JA };
type Frame = { label: string; pose: Pose };

// ── Pose presets ──────────────────────────────────────────────────────────────

const FLAT:  JA = { mcp: 0,   pip: 0,  dip: 0  };
const HOOK:  JA = { mcp: 0,   pip: 80, dip: 80 };
const FIST:  JA = { mcp: 70,  pip: 90, dip: 70 };
const TABLE: JA = { mcp: 90,  pip: 0,  dip: 0  };
const LIFT:  JA = { mcp: -22, pip: 0,  dip: 0  };

const T_FLAT: JA = { mcp: 0,  pip: 0,  dip: 0 };
const T_FIST: JA = { mcp: 50, pip: 30, dip: 0 };
const T_HOOK: JA = { mcp: 20, pip: 15, dip: 0 };

function pose(t: JA, i: JA, m: JA, r: JA, p: JA): Pose {
  return { thumb: t, index: i, middle: m, ring: r, pinky: p };
}

const ALL_FLAT  = pose(T_FLAT, FLAT,  FLAT,  FLAT,  FLAT);
const ALL_FIST  = pose(T_FIST, FIST,  FIST,  FIST,  FIST);
const ALL_HOOK  = pose(T_HOOK, HOOK,  HOOK,  HOOK,  HOOK);
const ALL_TABLE = pose(T_FLAT, TABLE, TABLE, TABLE, TABLE);

// ── Exercise frames ───────────────────────────────────────────────────────────

const FRAMES: Record<string, Frame[]> = {
  tendon_glide: [
    { label: 'Straight', pose: ALL_FLAT },
    { label: 'Hook',     pose: ALL_HOOK },
    { label: 'Full Fist',pose: ALL_FIST },
  ],
  hook_fist: [
    { label: 'Straight', pose: ALL_FLAT },
    { label: 'Hook',     pose: ALL_HOOK },
  ],
  full_fist: [
    { label: 'Open',  pose: ALL_FLAT },
    { label: 'Fist',  pose: ALL_FIST },
  ],
  tabletop: [
    { label: 'Open',      pose: ALL_FLAT  },
    { label: 'Tabletop',  pose: ALL_TABLE },
  ],
  finger_lift: [
    { label: 'Flat',       pose: ALL_FLAT },
    { label: 'Index Up',   pose: pose(T_FLAT, LIFT, FLAT, FLAT, FLAT) },
    { label: 'Middle Up',  pose: pose(T_FLAT, FLAT, LIFT, FLAT, FLAT) },
    { label: 'Ring Up',    pose: pose(T_FLAT, FLAT, FLAT, LIFT, FLAT) },
    { label: 'Pinky Up',   pose: pose(T_FLAT, FLAT, FLAT, FLAT, LIFT) },
  ],
};

// ── SVG geometry ──────────────────────────────────────────────────────────────

const PALM_Y   = 120;
const PROX_L   = 28;
const MID_L    = 20;
const DIST_L   = 14;

const FINGER_CFG: { key: keyof Pose; bx: number; color: string }[] = [
  { key: 'index',  bx: 40,  color: '#00c9a7' },
  { key: 'middle', bx: 57,  color: '#f0a050' },
  { key: 'ring',   bx: 74,  color: '#d97ab8' },
  { key: 'pinky',  bx: 91,  color: '#a78bfa' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function Finger({ bx, ja, color }: { bx: number; ja: JA; color: string }) {
  const by = PALM_Y;
  return (
    <g transform={`rotate(${ja.mcp},${bx},${by})`}>
      <rect x={bx - 4} y={by - PROX_L} width={8} height={PROX_L} rx="3" fill={color} fillOpacity="0.85" />
      <g transform={`rotate(${ja.pip},${bx},${by - PROX_L})`}>
        <rect x={bx - 3.5} y={by - PROX_L - MID_L} width={7} height={MID_L} rx="2.5" fill={color} fillOpacity="0.9" />
        <g transform={`rotate(${ja.dip},${bx},${by - PROX_L - MID_L})`}>
          <rect x={bx - 3} y={by - PROX_L - MID_L - DIST_L} width={6} height={DIST_L} rx="2" fill={color} />
          <circle cx={bx} cy={by - PROX_L - MID_L - DIST_L} r="3.5" fill={color} />
        </g>
      </g>
    </g>
  );
}

function Thumb({ ja }: { ja: JA }) {
  const bx = 21, by = 138;
  return (
    <g transform={`rotate(-52,${bx},${by})`}>
      <g transform={`rotate(${ja.mcp},${bx},${by})`}>
        <rect x={bx - 4.5} y={by - 22} width={9} height={22} rx="3.5" fill="#6c8ef5" fillOpacity="0.85" />
        <g transform={`rotate(${ja.pip},${bx},${by - 22})`}>
          <rect x={bx - 4} y={by - 38} width={8} height={16} rx="3" fill="#6c8ef5" fillOpacity="0.9" />
          <circle cx={bx} cy={by - 38} r="4" fill="#6c8ef5" />
        </g>
      </g>
    </g>
  );
}

function HandSvg({ pose: p }: { pose: Pose }) {
  return (
    <svg viewBox="0 0 130 175" className="w-full h-full">
      {/* Palm */}
      <rect x="19" y={PALM_Y} width="96" height="52" rx="10" fill="#1a2535" stroke="#2e3d50" strokeWidth="1" />
      {/* Knuckle dots */}
      {FINGER_CFG.map(({ bx, color }) => (
        <circle key={bx} cx={bx} cy={PALM_Y} r="3" fill={color} fillOpacity="0.5" />
      ))}
      {/* Fingers */}
      {FINGER_CFG.map(({ key, bx, color }) => (
        <Finger key={key} bx={bx} ja={p[key]} color={color} />
      ))}
      {/* Thumb */}
      <Thumb ja={p.thumb} />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ExerciseAnimation({ exerciseId }: { exerciseId: string }) {
  const frames = FRAMES[exerciseId] ?? FRAMES['full_fist'];
  const [frameIdx, setFrameIdx] = useState(0);
  const [opacity, setOpacity]   = useState(1);

  // Reset to frame 0 when exercise changes
  useEffect(() => { setFrameIdx(0); setOpacity(1); }, [exerciseId]);

  useEffect(() => {
    const id = setInterval(() => {
      setOpacity(0);
      const t = setTimeout(() => {
        setFrameIdx((i) => (i + 1) % frames.length);
        setOpacity(1);
      }, 280);
      return () => clearTimeout(t);
    }, 1800);
    return () => clearInterval(id);
  }, [frames.length]);

  const frame = frames[frameIdx];

  return (
    <div className="bg-panel2 border border-border rounded-xl p-3 mb-3 shrink-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-dim font-mono">Demo</span>
        <div className="flex gap-1">
          {frames.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === frameIdx ? 'bg-accent' : 'bg-border'}`}
            />
          ))}
        </div>
      </div>

      <div
        className="h-44 flex items-center justify-center"
        style={{ opacity, transition: 'opacity 0.28s ease' }}
      >
        <HandSvg pose={frame.pose} />
      </div>

      <div className="text-center mt-1">
        <span className="text-[12px] font-mono font-semibold text-accent tracking-wide">
          {frame.label}
        </span>
        <span className="text-[10px] font-mono text-dim ml-2">
          {frameIdx + 1} / {frames.length}
        </span>
      </div>
    </div>
  );
}
