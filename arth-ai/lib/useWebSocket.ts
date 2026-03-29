'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useStore, computeAvgROM, computeAvgTargetROM, triggerCoach } from './store';
import { FINGERS, EXERCISES, COACH_COOLDOWN_MS } from './constants';

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const manualDisconnect = useRef(false);

  const setConnState    = useStore((s) => s.setConnState);
  const setHwValues     = useStore((s) => s.setHwValues);
  const transitionPhase = useStore((s) => s.transitionPhase);
  const countRep        = useStore((s) => s.countRep);

  const wsSend = useCallback((obj: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(obj));
    }
  }, []);

  const onMessage = useCallback((data: Record<string, number>) => {
    // Update hw values
    const patch: Partial<{ thumb: number; index: number; middle: number; ring: number; pinky: number }> = {};
    FINGERS.forEach((f) => { if (data[f.key] !== undefined) patch[f.key as keyof typeof patch] = data[f.key]; });
    setHwValues(patch);

    // Run rep state machine
    const s = useStore.getState();
    if (s.status !== 'active') return;

    const hw = s.hwValues;
    const avg = computeAvgROM(hw);
    const flexThresh = computeAvgTargetROM(s.currentExIdx) * 0.75;
    const extendThresh = 30;
    const now = Date.now();
    const elapsed = now - (s.phaseStartTime ?? now);
    const ex = EXERCISES[s.currentExIdx];

    switch (s.phase) {
      case 'waiting_extend':
        if (avg < extendThresh && elapsed > 300) transitionPhase('extending');
        break;

      case 'extending': {
        if (!s.assistSentFlex && s.assistMode) {
          wsSend({ cmd: 'servo_all', position: s.assistLevel, speed: 50 });
          useStore.setState({ assistSentFlex: true });
        }
        if (avg >= flexThresh) {
          const peak: Partial<typeof hw> = {};
          FINGERS.forEach((f) => { peak[f.key as keyof typeof peak] = hw[f.key as keyof typeof hw]; });
          useStore.setState({ peakROM: peak });
          transitionPhase('hold_flex');
        }
        break;
      }

      case 'hold_flex': {
        // Track peak per finger
        const updatedPeak = { ...s.peakROM };
        FINGERS.forEach((f) => {
          const cur = hw[f.key as keyof typeof hw] ?? 0;
          if (cur > (updatedPeak[f.key as keyof typeof updatedPeak] ?? 0)) {
            (updatedPeak as Record<string, number>)[f.key] = cur;
          }
        });
        useStore.setState({ peakROM: updatedPeak });

        if (avg < flexThresh * 0.85) { transitionPhase('extending'); break; }
        if (elapsed >= ex.holdDuration) {
          countRep();
          useStore.setState({ assistSentFlex: false });
          if (s.assistMode) wsSend({ cmd: 'servo_release' });
          transitionPhase('releasing');
        }
        break;
      }

      case 'releasing':
        if (avg < extendThresh) transitionPhase('waiting_extend');
        break;
    }

    // Low ROM coach trigger
    const s2 = useStore.getState();
    const avg2 = computeAvgROM(s2.hwValues);
    const target = computeAvgTargetROM(s2.currentExIdx);
    if (avg2 < target * 0.45 && now - s2.lastCoachCall > COACH_COOLDOWN_MS) {
      triggerCoach('low_rom');
    }
  }, [setHwValues, transitionPhase, countRep, wsSend]);

  const connect = useCallback((url: string) => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.CONNECTING || wsRef.current.readyState === WebSocket.OPEN)
    ) return;

    setConnState('connecting');
    try {
      wsRef.current = new WebSocket(url);
    } catch {
      setConnState('disconnected');
      return;
    }

    wsRef.current.onopen = () => {
      setConnState('connected');
      manualDisconnect.current = false;
      reconnectAttempts.current = 0;
      useStore.getState().appendLog('system', 'Connected to glove at ' + url);
    };

    wsRef.current.onclose = () => {
      setConnState('disconnected');
      if (!manualDisconnect.current) {
        const delay = Math.min(500 * Math.pow(2, reconnectAttempts.current), 30_000);
        reconnectAttempts.current++;
        reconnectTimer.current = setTimeout(
          () => connect(useStore.getState().wsUrl),
          delay,
        );
      }
    };

    wsRef.current.onerror = () => setConnState('disconnected');

    wsRef.current.onmessage = (e) => {
      try { onMessage(JSON.parse(e.data as string)); } catch { /* ignore malformed */ }
    };
  }, [setConnState, onMessage]);

  const disconnect = useCallback(() => {
    manualDisconnect.current = true;
    if (reconnectTimer.current) { clearTimeout(reconnectTimer.current); reconnectTimer.current = null; }
    wsRef.current?.close();
  }, []);

  const toggle = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) disconnect();
    else connect(useStore.getState().wsUrl);
  }, [connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => () => disconnect(), [disconnect]);

  return { wsSend, toggle };
}
