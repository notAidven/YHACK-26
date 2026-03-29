'use client';
import { useWsSend } from '@/lib/WsContext';
import ServoControl from './ServoControl';

export default function ServoPage() {
  const wsSend = useWsSend();
  return (
    <div className="flex flex-col gap-0">
      <div className="mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-dim font-mono mb-1">Servo Assist</div>
        <p className="text-dim text-sm leading-relaxed">
          Control the servo motors built into the glove. Enable assist mode to have the glove help bend your fingers during therapy exercises.
        </p>
      </div>
      <div className="bg-panel border border-border rounded-2xl p-5">
        <ServoControl wsSend={wsSend} />
      </div>
    </div>
  );
}
