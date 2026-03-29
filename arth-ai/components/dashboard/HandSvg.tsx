'use client';
import { useStore } from '@/lib/store';
import { FINGERS, SEG_THRESHOLDS } from '@/lib/constants';

export default function HandSvg() {
  const hwValues = useStore((s) => s.hwValues);

  function segFill(fingerKey: string, seg: number) {
    const f = FINGERS.find((x) => x.key === fingerKey)!;
    const v = hwValues[f.key as keyof typeof hwValues];
    return v >= SEG_THRESHOLDS[seg] ? f.color : '#21262d';
  }

  function segOpacity(fingerKey: string, seg: number) {
    const v = hwValues[fingerKey as keyof typeof hwValues];
    return v >= SEG_THRESHOLDS[seg] ? '0.9' : '0.35';
  }

  return (
    <div className="flex justify-center">
      <svg width="150" height="245" viewBox="0 0 200 320">
        {/* Palm */}
        <rect x="48" y="180" width="108" height="100" rx="16" fill="#1e2535" stroke="#1e2530" strokeWidth="1" />

        {/* Thumb */}
        <g>
          {[
            { id: 3, x: 18, y: 218, w: 26, h: 36 },
            { id: 2, x: 14, y: 186, w: 26, h: 36 },
            { id: 1, x: 10, y: 154, w: 26, h: 36 },
          ].map(({ id, x, y, w, h }) => (
            <rect key={id} x={x} y={y} width={w} height={h} rx="7"
              fill={segFill('thumb', id)} opacity={segOpacity('thumb', id)}
              style={{ transition: 'fill 0.06s, opacity 0.06s' }} />
          ))}
        </g>

        {/* Index */}
        <g>
          {[
            { id: 3, x: 56, y: 148, w: 26, h: 36 },
            { id: 2, x: 56, y: 110, w: 26, h: 36 },
            { id: 1, x: 56, y: 72,  w: 26, h: 36 },
          ].map(({ id, x, y, w, h }) => (
            <rect key={id} x={x} y={y} width={w} height={h} rx="7"
              fill={segFill('index', id)} opacity={segOpacity('index', id)}
              style={{ transition: 'fill 0.06s, opacity 0.06s' }} />
          ))}
        </g>

        {/* Middle */}
        <g>
          {[
            { id: 3, x: 87, y: 140, w: 26, h: 36 },
            { id: 2, x: 87, y: 100, w: 26, h: 36 },
            { id: 1, x: 87, y: 62,  w: 26, h: 36 },
          ].map(({ id, x, y, w, h }) => (
            <rect key={id} x={x} y={y} width={w} height={h} rx="7"
              fill={segFill('middle', id)} opacity={segOpacity('middle', id)}
              style={{ transition: 'fill 0.06s, opacity 0.06s' }} />
          ))}
        </g>

        {/* Ring */}
        <g>
          {[
            { id: 3, x: 118, y: 145, w: 26, h: 36 },
            { id: 2, x: 118, y: 107, w: 26, h: 36 },
            { id: 1, x: 118, y: 69,  w: 26, h: 36 },
          ].map(({ id, x, y, w, h }) => (
            <rect key={id} x={x} y={y} width={w} height={h} rx="7"
              fill={segFill('ring', id)} opacity={segOpacity('ring', id)}
              style={{ transition: 'fill 0.06s, opacity 0.06s' }} />
          ))}
        </g>

        {/* Pinky */}
        <g>
          {[
            { id: 3, x: 149, y: 158, w: 26, h: 28 },
            { id: 2, x: 149, y: 126, w: 26, h: 28 },
            { id: 1, x: 149, y: 96,  w: 26, h: 26 },
          ].map(({ id, x, y, w, h }) => (
            <rect key={id} x={x} y={y} width={w} height={h} rx="7"
              fill={segFill('pinky', id)} opacity={segOpacity('pinky', id)}
              style={{ transition: 'fill 0.06s, opacity 0.06s' }} />
          ))}
        </g>

        {/* Labels */}
        {[
          { x: 23, label: 'T' },
          { x: 69, label: 'I' },
          { x: 100, label: 'M' },
          { x: 131, label: 'R' },
          { x: 162, label: 'P' },
        ].map(({ x, label }) => (
          <text key={label} x={x} y="315" textAnchor="middle" fontSize="10" fill="#555">{label}</text>
        ))}
      </svg>
    </div>
  );
}
