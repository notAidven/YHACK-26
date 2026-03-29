'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useHandTracking, type TrackingStatus } from '@/lib/useHandTracking';

interface Props {
  onHandDetected: (detected: boolean) => void;
}

function StatusBadge({ status, handDetected }: { status: TrackingStatus; handDetected: boolean }) {
  if (status === 'loading') {
    return (
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-bg/80 border border-border rounded-full px-3 py-1.5 text-[11px] font-mono text-dim">
        <span className="w-3 h-3 border border-accent border-t-transparent rounded-full animate-spin" />
        Loading MediaPipe…
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-bg/80 border border-danger/40 rounded-full px-3 py-1.5 text-[11px] font-mono text-danger">
        <span className="w-1.5 h-1.5 rounded-full bg-danger" />
        Failed to load model
      </div>
    );
  }
  return (
    <div className={`absolute top-3 left-3 flex items-center gap-2 border rounded-full px-3 py-1.5 text-[11px] font-mono transition-all ${
      handDetected
        ? 'bg-success/10 border-success/40 text-success'
        : 'bg-bg/80 border-border text-dim'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${handDetected ? 'bg-success animate-pulse' : 'bg-dim'}`} />
      {handDetected ? 'Hand detected' : 'No hand in frame'}
    </div>
  );
}

function CornerGuide() {
  return (
    <>
      {/* Top-left */}
      <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-accent/40 rounded-tr-md" />
      {/* Bottom-right */}
      <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-accent/40 rounded-bl-md" />
      {/* Bottom-left */}
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-accent/40 rounded-br-md" />
      {/* Top-left */}
      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-accent/40 rounded-tl-md" style={{ left: '76px' }} />
    </>
  );
}

export default function HandTracker({ onHandDetected }: Props) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { status, handDetected, init, startTracking, stopTracking } = useHandTracking();

  const stableOnHandDetected = useCallback(onHandDetected, []); // eslint-disable-line

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (status !== 'ready') return;
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    startTracking(v, c);
    return () => stopTracking();
  }, [status, startTracking, stopTracking]);

  useEffect(() => {
    stableOnHandDetected(handDetected);
  }, [handDetected, stableOnHandDetected]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-bg border border-border aspect-video">
      {/* Hidden video source */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
        muted
        playsInline
      />

      {/* Canvas shows mirrored video + skeleton overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Loading screen */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg gap-3">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <div className="text-center">
            <div className="text-muted font-semibold text-sm">Loading AI Model</div>
            <div className="text-dim text-[11px] font-mono mt-0.5">Fetching MediaPipe hand landmarker…</div>
          </div>
        </div>
      )}

      {/* Idle (not started yet) */}
      {status === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg">
          <div className="text-dim font-mono text-sm">Initialising…</div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg gap-2">
          <span className="text-danger text-2xl">⚠</span>
          <div className="text-danger font-mono text-sm">Failed to load model</div>
          <div className="text-dim text-[11px]">Check your internet connection and reload</div>
        </div>
      )}

      {/* Overlays when camera is active */}
      {status === 'ready' && (
        <>
          <StatusBadge status={status} handDetected={handDetected} />
          <CornerGuide />

          {/* Instruction overlay when no hand */}
          {!handDetected && (
            <div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none">
              <div className="bg-bg/70 backdrop-blur-sm border border-border rounded-xl px-4 py-2.5 text-center">
                <div className="text-dim text-[11px] font-mono">Hold your hand in front of the camera</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
