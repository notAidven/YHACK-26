'use client';
import { create } from 'zustand';
import {
  FINGERS, EXERCISES, REST_DURATION_MS, COACH_COOLDOWN_MS,
} from './constants';
import type {
  SessionStatus, SessionPhase, RepRecord, ChartPoint, CoachEntry, FingerAssist,
} from './types';

// ── Types ────────────────────────────────────────────────────────────────────

interface HwValues { thumb: number; index: number; middle: number; ring: number; pinky: number; }

interface SessionSlice {
  hwValues: HwValues;
  status: SessionStatus;
  phase: SessionPhase;
  startTime: number | null;
  elapsedMs: number;
  lastResumedAt: number | null;
  currentExIdx: number;
  currentSet: number;
  currentRep: number;
  totalReps: number;
  repsPerSet: number;
  totalSets: number;
  phaseStartTime: number | null;
  assistSentFlex: boolean;
  peakROM: Partial<HwValues>;
  repHistory: RepRecord[];
  chartData: ChartPoint[];
  lastCoachCall: number;
  calMin: number[];
  calMax: number[];
}

interface ServoSlice {
  assistMode: boolean;
  assistLevel: number;
  fingerAssist: Record<string, FingerAssist>;
}

interface WsSlice {
  wsUrl: string;
  connState: 'connected' | 'connecting' | 'disconnected';
}

interface CoachSlice {
  log: CoachEntry[];
  apiKey: string;
}

interface Actions {
  // hw
  setHwValues: (v: Partial<HwValues>) => void;
  // session
  startSession: () => void;
  pauseSession: () => void;
  completeSet: () => void;
  completeSession: () => void;
  transitionPhase: (p: SessionPhase) => void;
  countRep: () => void;
  setCurrentExIdx: (i: number) => void;
  setRestComplete: () => void;
  // servo
  setAssistMode: (on: boolean) => void;
  setAssistLevel: (v: number) => void;
  setFingerAssist: (key: string, patch: Partial<FingerAssist>) => void;
  // ws
  setWsUrl: (u: string) => void;
  setConnState: (s: WsSlice['connState']) => void;
  // coach
  appendLog: (role: CoachEntry['role'], text: string) => void;
  setApiKey: (k: string) => void;
  setLastCoachCall: (t: number) => void;
  // cal
  setCalMin: (i: number, v: number) => void;
  setCalMax: (i: number, v: number) => void;
}

type Store = SessionSlice & ServoSlice & WsSlice & CoachSlice & Actions;

// ── Helpers ──────────────────────────────────────────────────────────────────

const defaultFingerAssist = (): Record<string, FingerAssist> => ({
  thumb:  { enabled: true,  level: 70 },
  index:  { enabled: true,  level: 70 },
  middle: { enabled: false, level: 70 },
  ring:   { enabled: false, level: 70 },
  pinky:  { enabled: true,  level: 50 },
});

export function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

export function computeAvgROM(hw: HwValues): number {
  return FINGERS.reduce((s, f) => s + hw[f.key], 0) / FINGERS.length;
}

export function computeAvgTargetROM(exIdx: number): number {
  const ex = EXERCISES[exIdx];
  return FINGERS.reduce((s, f) => s + ex.targetROM[f.key], 0) / FINGERS.length;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useStore = create<Store>()((set, get) => ({
  // ── Session defaults ──
  hwValues:      { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 },
  status:        'idle',
  phase:         'idle',
  startTime:     null,
  elapsedMs:     0,
  lastResumedAt: null,
  currentExIdx:  0,
  currentSet:    1,
  currentRep:    0,
  totalReps:     0,
  repsPerSet:    EXERCISES[0].repsPerSet,
  totalSets:     EXERCISES[0].sets,
  phaseStartTime: null,
  assistSentFlex: false,
  peakROM:       {},
  repHistory:    [],
  chartData:     [],
  lastCoachCall: 0,
  calMin:        [0, 0, 0, 0, 0],
  calMax:        [4095, 4095, 4095, 4095, 4095],

  // ── Servo defaults ──
  assistMode:   false,
  assistLevel:  70,
  fingerAssist: defaultFingerAssist(),

  // ── WS defaults ──
  wsUrl:     'ws://192.168.4.1:81',
  connState: 'disconnected',

  // ── Coach defaults ──
  log:    [],
  apiKey: '',

  // ── Actions ──────────────────────────────────────────────────────────────

  setHwValues: (v) => set((s) => ({ hwValues: { ...s.hwValues, ...v } })),

  startSession: () => {
    const { currentExIdx } = get();
    const ex = EXERCISES[currentExIdx];
    const now = Date.now();
    set({
      status:         'active',
      startTime:      now,
      elapsedMs:      0,
      lastResumedAt:  now,
      currentSet:     1,
      currentRep:     0,
      totalReps:      0,
      repHistory:     [],
      chartData:      [],
      phase:          'waiting_extend',
      phaseStartTime: now,
      peakROM:        {},
      assistSentFlex: false,
      repsPerSet:     ex.repsPerSet,
      totalSets:      ex.sets,
    });
  },

  pauseSession: () => set((s) => {
    if (s.status === 'active') {
      const now = Date.now();
      return {
        status:        'paused',
        elapsedMs:     s.elapsedMs + (s.lastResumedAt ? now - s.lastResumedAt : 0),
        lastResumedAt: null,
      };
    }
    if (s.status === 'paused') {
      return { status: 'active', lastResumedAt: Date.now() };
    }
    return {};
  }),

  transitionPhase: (phase) => set({ phase, phaseStartTime: Date.now() }),

  countRep: () => {
    const s = get();
    const ex = EXERCISES[s.currentExIdx];
    const avgPeak = FINGERS.reduce((acc, f) => acc + (s.peakROM[f.key] ?? 0), 0) / FINGERS.length;
    const newRep = s.currentRep + 1;
    const newTotal = s.totalReps + 1;
    const record: RepRecord = {
      set: s.currentSet, rep: newRep,
      peakROM: { ...s.peakROM } as Record<string, number>,
      avgPeakROM: avgPeak, timestamp: Date.now(),
    };
    const point: ChartPoint = {
      rep: newTotal, avgROM: avgPeak,
      targetAvgROM: computeAvgTargetROM(s.currentExIdx),
    };
    set({
      currentRep: newRep,
      totalReps:  newTotal,
      repHistory: [...s.repHistory, record],
      chartData:  [...s.chartData, point],
    });
    if (newRep >= s.repsPerSet) {
      if (s.currentSet >= s.totalSets) get().completeSession();
      else get().completeSet();
    }
  },

  completeSet: () => {
    const s = get();
    const now = Date.now();
    set({
      currentSet:    s.currentSet + 1,
      currentRep:    0,
      status:        'resting',
      phase:         'idle',
      elapsedMs:     s.elapsedMs + (s.lastResumedAt ? now - s.lastResumedAt : 0),
      lastResumedAt: null,
    });
    let remaining = REST_DURATION_MS;
    const iv = setInterval(() => {
      remaining -= 1000;
      if (remaining <= 0) {
        clearInterval(iv);
        get().setRestComplete();
      }
    }, 1000);
  },

  setRestComplete: () => set({
    status:         'active',
    phase:          'waiting_extend',
    phaseStartTime: Date.now(),
    lastResumedAt:  Date.now(),
  }),

  completeSession: () => set((s) => ({
    status:        'complete',
    phase:         'idle',
    elapsedMs:     s.elapsedMs + (s.lastResumedAt ? Date.now() - s.lastResumedAt : 0),
    lastResumedAt: null,
  })),

  setCurrentExIdx: (i) => {
    const ex = EXERCISES[i];
    set({ currentExIdx: i, repsPerSet: ex.repsPerSet, totalSets: ex.sets });
  },

  setAssistMode: (on) => set({ assistMode: on }),
  setAssistLevel: (v) => set((s) => ({
    assistLevel: v,
    fingerAssist: Object.fromEntries(
      FINGERS.map((f) => [f.key, {
        ...s.fingerAssist[f.key],
        level: s.fingerAssist[f.key].enabled ? v : s.fingerAssist[f.key].level,
      }])
    ),
  })),
  setFingerAssist: (key, patch) => set((s) => ({
    fingerAssist: { ...s.fingerAssist, [key]: { ...s.fingerAssist[key], ...patch } },
  })),

  setWsUrl:     (u) => set({ wsUrl: u }),
  setConnState: (s) => set({ connState: s }),

  appendLog: (role, text) => {
    const ts = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const entry: CoachEntry = { id: Date.now().toString(), role, text, ts };
    set((s) => ({
      log: [...s.log.slice(-59), entry],
    }));
  },
  setApiKey:        (k) => set({ apiKey: k }),
  setLastCoachCall: (t) => set({ lastCoachCall: t }),

  setCalMin: (i, v) => set((s) => {
    const next = [...s.calMin]; next[i] = v; return { calMin: next };
  }),
  setCalMax: (i, v) => set((s) => {
    const next = [...s.calMax]; next[i] = v; return { calMax: next };
  }),
}));

// ── Coach trigger ─────────────────────────────────────────────────────────────

type CoachTrigger = 'session_start' | 'rep_milestone' | 'set_complete' | 'low_rom' | 'session_end' | 'manual';

export async function triggerCoach(trigger: CoachTrigger) {
  const s = useStore.getState();
  const { apiKey, appendLog, setLastCoachCall, currentExIdx, repHistory, currentSet, totalSets, currentRep, repsPerSet, hwValues, totalReps } = s;

  if (!apiKey) {
    if (trigger === 'manual') appendLog('system', 'Enter your Anthropic API key to enable the therapy coach.');
    return;
  }
  const now = Date.now();
  if (now - s.lastCoachCall < COACH_COOLDOWN_MS && trigger !== 'manual') return;
  setLastCoachCall(now);

  const ex = EXERCISES[currentExIdx];
  const romSummary = FINGERS.map((f) =>
    `${f.label}: ${hwValues[f.key].toFixed(0)}% (target ${ex.targetROM[f.key]}%)`
  ).join(', ');
  const lastRep = repHistory[repHistory.length - 1];
  const avgROM = computeAvgROM(hwValues);
  const targetROM = computeAvgTargetROM(currentExIdx);

  const context: Record<CoachTrigger, string> = {
    session_start: 'Patient is beginning their first set.',
    rep_milestone: `Patient completed rep ${currentRep}. Last peak ROM: ${lastRep ? lastRep.avgPeakROM.toFixed(0) : '?'}%.`,
    set_complete:  `Patient completed Set ${currentSet - 1}/${totalSets}. Now resting for 30 seconds.`,
    low_rom:       `Patient's ROM is well below target — possible pain or fatigue. Current avg: ${avgROM.toFixed(0)}%, target: ${targetROM.toFixed(0)}%.`,
    session_end:   `Session complete! Total: ${totalReps} reps over ${totalSets} sets. Avg ROM: ${repHistory.length > 0 ? (repHistory.reduce((a, r) => a + r.avgPeakROM, 0) / repHistory.length).toFixed(0) : '?'}%.`,
    manual:        'Patient requested a check-in.',
  };

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-ipc': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 180,
        messages: [{
          role: 'user',
          content: `You are Arth AI, a warm and encouraging hand therapy coach for arthritis patients.

Exercise: ${ex.name} — ${ex.description}
ROM readings: ${romSummary}
Session: Set ${currentSet}/${totalSets}, Rep ${currentRep}/${repsPerSet}
Event: ${context[trigger]}

Respond in 2-3 warm sentences. Celebrate progress, give gentle form tips if ROM is low, and be encouraging. Speak directly to the patient. Do not mention technical terms like Hz, latency, or packets.`,
        }],
      }),
    });
    if (!resp.ok) {
      const e = await resp.json().catch(() => ({}));
      appendLog('error', 'Coach error: ' + ((e as {error?: {message?: string}}).error?.message ?? resp.status));
      return;
    }
    const result = await resp.json() as { content: Array<{ text: string }> };
    appendLog('assistant', result.content[0].text);
  } catch (e) {
    appendLog('error', 'Network error: ' + (e instanceof Error ? e.message : String(e)));
  }
}
