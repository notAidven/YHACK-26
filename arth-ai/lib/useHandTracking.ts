'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from './store';

// ── Types ─────────────────────────────────────────────────────────────────────

type Landmark = { x: number; y: number; z: number };
export type TrackingStatus = 'idle' | 'loading' | 'ready' | 'error';

// ── Hand connections (MediaPipe hand topology) ────────────────────────────────

const CONNECTIONS: [number, number][] = [
  // Thumb
  [0,1],[1,2],[2,3],[3,4],
  // Index
  [0,5],[5,6],[6,7],[7,8],
  // Middle
  [0,9],[9,10],[10,11],[11,12],
  // Ring
  [0,13],[13,14],[14,15],[15,16],
  // Pinky
  [0,17],[17,18],[18,19],[19,20],
  // Palm
  [5,9],[9,13],[13,17],[17,0],
];

const FINGER_SEGS: { indices: number[]; color: string }[] = [
  { indices: [1,2,3,4],     color: '#6c8ef5' }, // thumb
  { indices: [5,6,7,8],     color: '#00c9a7' }, // index
  { indices: [9,10,11,12],  color: '#f0a050' }, // middle
  { indices: [13,14,15,16], color: '#d97ab8' }, // ring
  { indices: [17,18,19,20], color: '#a78bfa' }, // pinky
];

const TIP_IDS = new Set([4, 8, 12, 16, 20]);

// ── Geometry helpers ──────────────────────────────────────────────────────────

/** Angle at joint b (a-b-c), returns 0–100 curl % */
function jointCurl(a: Landmark, b: Landmark, c: Landmark): number {
  const v1 = { x: a.x - b.x, y: a.y - b.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag = Math.sqrt((v1.x ** 2 + v1.y ** 2) * (v2.x ** 2 + v2.y ** 2));
  if (mag < 1e-6) return 0;
  const angle = Math.acos(Math.max(-1, Math.min(1, dot / mag)));
  return Math.max(0, Math.min(100, ((Math.PI - angle) / Math.PI) * 100));
}

/** Average curl across two joints for a 4-point finger chain */
function fingerROM(lms: Landmark[], mcp: number, pip: number, dip: number, tip: number): number {
  const a = jointCurl(lms[mcp], lms[pip], lms[dip]);
  const b = jointCurl(lms[pip], lms[dip], lms[tip]);
  return (a + b) / 2;
}

// ── Canvas drawing ────────────────────────────────────────────────────────────

function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  lms: Landmark[],
  w: number,
  h: number,
) {
  // Base connections (subtle green)
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(0,201,167,0.35)';
  for (const [a, b] of CONNECTIONS) {
    ctx.beginPath();
    ctx.moveTo(lms[a].x * w, lms[a].y * h);
    ctx.lineTo(lms[b].x * w, lms[b].y * h);
    ctx.stroke();
  }

  // Per-finger coloured segments (brighter)
  for (const { indices, color } of FINGER_SEGS) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    for (let i = 0; i < indices.length - 1; i++) {
      const la = lms[indices[i]];
      const lb = lms[indices[i + 1]];
      ctx.beginPath();
      ctx.moveTo(la.x * w, la.y * h);
      ctx.lineTo(lb.x * w, lb.y * h);
      ctx.stroke();
    }
  }

  // Landmark dots
  for (let i = 0; i < lms.length; i++) {
    const lm = lms[i];
    const isTip = TIP_IDS.has(i);
    ctx.beginPath();
    ctx.arc(lm.x * w, lm.y * h, isTip ? 6 : 4, 0, Math.PI * 2);
    ctx.fillStyle = isTip ? '#ffffff' : 'rgba(255,255,255,0.8)';
    ctx.fill();
    ctx.strokeStyle = '#00c9a7';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useHandTracking() {
  const [status, setStatus]           = useState<TrackingStatus>('idle');
  const [handDetected, setHandDetected] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const landmarkerRef = useRef<any>(null);
  const rafRef        = useRef<number>(0);
  const streamRef     = useRef<MediaStream | null>(null);
  const setHwValues   = useStore((s) => s.setHwValues);

  /** Load MediaPipe (call once) */
  const init = useCallback(async () => {
    if (status !== 'idle') return;
    setStatus('loading');
    try {
      // webpackIgnore prevents webpack from bundling the large tasks-vision
      // binary — it is fetched directly from CDN at runtime instead.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mp: any = await import(
        /* webpackIgnore: true */
        // @ts-expect-error CDN URL — webpack skips bundling, types come from npm pkg
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/vision_bundle.mjs'
      );
      const { HandLandmarker, FilesetResolver } = mp;
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm',
      );
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      });
      setStatus('ready');
    } catch (err) {
      console.error('[HandTracking] init failed', err);
      setStatus('error');
    }
  }, [status]);

  /** Open camera and start detection loop */
  const startTracking = useCallback(
    async (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      streamRef.current = stream;
      video.srcObject = stream;
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error('Video source error'));
      });
      await video.play();

      const ctx = canvas.getContext('2d')!;
      let lastTime = -1;

      function loop() {
        rafRef.current = requestAnimationFrame(loop);
        if (video.readyState < 2) return;

        const now = performance.now();
        if (now === lastTime) return;
        lastTime = now;

        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw mirrored video frame
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0);
        ctx.restore();

        const result = landmarkerRef.current?.detectForVideo(video, now);

        if (result?.landmarks?.length > 0) {
          // Mirror the x coordinate to match the flipped canvas
          const lms: Landmark[] = result.landmarks[0].map((lm: Landmark) => ({
            ...lm,
            x: 1 - lm.x,
          }));

          drawSkeleton(ctx, lms, canvas.width, canvas.height);
          setHandDetected(true);

          // Update store with computed ROM values
          setHwValues({
            thumb:  fingerROM(lms, 1,  2,  3,  4),
            index:  fingerROM(lms, 5,  6,  7,  8),
            middle: fingerROM(lms, 9,  10, 11, 12),
            ring:   fingerROM(lms, 13, 14, 15, 16),
            pinky:  fingerROM(lms, 17, 18, 19, 20),
          });
        } else {
          setHandDetected(false);
        }
      }

      loop();
    },
    [setHwValues],
  );

  /** Stop camera and RAF loop */
  const stopTracking = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setHandDetected(false);
  }, []);

  useEffect(() => () => stopTracking(), [stopTracking]);

  return { status, handDetected, init, startTracking, stopTracking };
}
