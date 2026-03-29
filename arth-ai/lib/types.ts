export interface FingerConfig {
  key: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
  label: string;
  color: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  guide: string;
  targetROM: Record<string, number>;
  holdDuration: number;
  repsPerSet: number;
  sets: number;
}

export interface FingerAssist {
  enabled: boolean;
  level: number;
}

export type SessionStatus = 'idle' | 'active' | 'paused' | 'resting' | 'complete';
export type SessionPhase =
  | 'idle'
  | 'waiting_extend'
  | 'extending'
  | 'hold_flex'
  | 'releasing';

export interface RepRecord {
  set: number;
  rep: number;
  peakROM: Record<string, number>;
  avgPeakROM: number;
  timestamp: number;
}

export interface ChartPoint {
  rep: number;
  avgROM: number;
  targetAvgROM: number;
}

export interface CoachEntry {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  text: string;
  ts: string;
}
