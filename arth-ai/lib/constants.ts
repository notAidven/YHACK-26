import type { FingerConfig, Exercise } from './types';

export const FINGERS: FingerConfig[] = [
  { key: 'thumb',  label: 'Thumb',  color: '#6c8ef5' },
  { key: 'index',  label: 'Index',  color: '#00c9a7' },
  { key: 'middle', label: 'Middle', color: '#f0a050' },
  { key: 'ring',   label: 'Ring',   color: '#d97ab8' },
  { key: 'pinky',  label: 'Pinky',  color: '#a78bfa' },
];

export const SEG_THRESHOLDS: Record<number, number> = { 1: 60, 2: 30, 3: 5 };

export const EXERCISES: Exercise[] = [
  {
    id: 'tendon_glide',
    name: 'Tendon Glide',
    description: 'Curl fingers from straight → hooked → fist and back. Focus on full range of motion.',
    guide: '  Straight:  | | | | |\n  Hook:      / / / / /\n  Full Fist: ( ( ( ( (',
    targetROM: { thumb: 80, index: 85, middle: 85, ring: 80, pinky: 75 },
    holdDuration: 1000, repsPerSet: 10, sets: 3,
  },
  {
    id: 'hook_fist',
    name: 'Hook Fist',
    description: 'Bend only the top two finger joints. Keep the knuckle joints straight.',
    guide: '  Straight:  | | | | |\n  Hook:      \\ \\ \\ \\ \\',
    targetROM: { thumb: 40, index: 70, middle: 70, ring: 65, pinky: 60 },
    holdDuration: 1000, repsPerSet: 10, sets: 3,
  },
  {
    id: 'full_fist',
    name: 'Full Fist',
    description: 'Close your hand into a complete fist, then open fully. Maximize your range.',
    guide: '  Open:  | | | | |\n  Fist:   ( ( ( ( (',
    targetROM: { thumb: 90, index: 95, middle: 95, ring: 90, pinky: 85 },
    holdDuration: 1500, repsPerSet: 8, sets: 3,
  },
  {
    id: 'tabletop',
    name: 'Tabletop',
    description: 'Bend at the knuckles 90°, keeping the top two joints straight like a table.',
    guide: '  Open:   | | | | |\n  Table:  [= = = = =]',
    targetROM: { thumb: 20, index: 50, middle: 50, ring: 45, pinky: 40 },
    holdDuration: 2000, repsPerSet: 8, sets: 2,
  },
  {
    id: 'finger_lift',
    name: 'Finger Lift',
    description: 'Lift each finger gently from a flat surface, one at a time.',
    guide: '  Flat: _ | | | |\n  Lift: _ ^ | | |',
    targetROM: { thumb: 30, index: 30, middle: 30, ring: 30, pinky: 30 },
    holdDuration: 1000, repsPerSet: 5, sets: 2,
  },
];

export const REST_DURATION_MS = 30_000;
export const COACH_COOLDOWN_MS = 8_000;
