'use client';
import { useStore } from '@/lib/store';
import { FINGERS } from '@/lib/constants';

interface ServoControlProps {
  wsSend: (obj: object) => void;
}

export default function ServoControl({ wsSend }: ServoControlProps) {
  const assistMode    = useStore((s) => s.assistMode);
  const assistLevel   = useStore((s) => s.assistLevel);
  const fingerAssist  = useStore((s) => s.fingerAssist);
  const setAssistMode = useStore((s) => s.setAssistMode);
  const setAssistLevel = useStore((s) => s.setAssistLevel);
  const setFingerAssist = useStore((s) => s.setFingerAssist);

  function onMasterToggle() {
    const next = !assistMode;
    setAssistMode(next);
    if (!next) wsSend({ cmd: 'servo_release' });
  }

  function onLevelChange(v: number) {
    setAssistLevel(v);
  }

  function onFingerToggle(key: string) {
    const fa = fingerAssist[key];
    const next = !fa.enabled;
    setFingerAssist(key, { enabled: next });
    if (!next) {
      const i = FINGERS.findIndex((f) => f.key === key);
      wsSend({ cmd: 'servo', finger: i, position: 0, speed: 50 });
    }
  }

  return (
    <div className="shrink-0">
      {/* Master toggle */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[13px] font-semibold text-muted">Assist Mode</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-dim">{assistMode ? 'ON' : 'OFF'}</span>
          <button
            onClick={onMasterToggle}
            className={`w-11 h-6 rounded-full border-none cursor-pointer relative transition-colors ${assistMode ? 'bg-servo' : 'bg-border'}`}
          >
            <span
              className={`absolute w-[18px] h-[18px] rounded-full bg-white top-[3px] transition-all ${assistMode ? 'left-[23px]' : 'left-[3px]'}`}
            />
          </button>
        </div>
      </div>

      {/* Level slider */}
      <div className="flex items-center gap-2 mb-2">
        <label className="text-[11px] font-mono text-dim w-11 shrink-0">Level</label>
        <input
          type="range" min="0" max="100" value={assistLevel}
          onChange={(e) => onLevelChange(+e.target.value)}
          className="flex-1 h-1 cursor-pointer"
          style={{ accentColor: '#a78bfa' }}
        />
        <span className="text-[11px] font-mono text-dim w-8 text-right">{assistLevel}%</span>
      </div>

      {/* Per-finger rows */}
      <div className="text-[10px] font-bold uppercase tracking-widest text-dim font-mono mb-1.5">Per Finger</div>
      <div className="flex flex-col gap-1.5">
        {FINGERS.map((f, i) => {
          const fa = fingerAssist[f.key];
          const disabled = !fa?.enabled || !assistMode;
          return (
            <div key={f.key} className={`flex items-center gap-1.5 ${disabled ? 'opacity-40' : ''}`}>
              <span className="text-[11px] font-mono text-dim w-11 shrink-0">{f.label.substring(0, 3)}</span>
              <button
                onClick={() => onFingerToggle(f.key)}
                className={`w-8 h-[18px] rounded-full border-none cursor-pointer relative transition-colors shrink-0 ${fa?.enabled ? 'bg-servo' : 'bg-border'}`}
              >
                <span className={`absolute w-3 h-3 rounded-full bg-white top-[3px] transition-all ${fa?.enabled ? 'left-[17px]' : 'left-[3px]'}`} />
              </button>
              <input
                type="range" min="0" max="100"
                value={fa?.level ?? 70}
                disabled={disabled}
                onChange={(e) => {
                  setFingerAssist(f.key, { level: +e.target.value });
                  if (fa?.enabled && assistMode) {
                    wsSend({ cmd: 'servo', finger: i, position: +e.target.value, speed: 50 });
                  }
                }}
                className="flex-1 h-1 cursor-pointer"
                style={{ accentColor: '#a78bfa' }}
              />
              <span className="text-[11px] font-mono text-dim w-7 text-right">{fa?.level ?? 70}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
