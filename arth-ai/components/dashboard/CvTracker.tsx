'use client';
import { useEffect, useRef } from 'react';
import { useHandTracking } from '@/lib/useHandTracking';

/** Invisible background tracker — feeds hwValues from camera into the store */
export default function CvTracker() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { status, init, startTracking, stopTracking } = useHandTracking();

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (status !== 'ready') return;
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    startTracking(v, c);
    return () => stopTracking();
  }, [status, startTracking, stopTracking]);

  return (
    <div className="sr-only" aria-hidden="true">
      <video ref={videoRef} muted playsInline />
      <canvas ref={canvasRef} />
    </div>
  );
}
