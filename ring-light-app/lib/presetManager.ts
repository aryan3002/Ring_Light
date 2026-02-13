import { Preset } from '@/types';

export const DEFAULT_PRESETS: Preset[] = [
  { id: 'daylight', name: 'Daylight', brightness: 100, temperature: 6500, isCustom: false, createdAt: '' },
  { id: 'soft-white', name: 'Soft White', brightness: 90, temperature: 5500, isCustom: false, createdAt: '' },
  { id: 'warm-glow', name: 'Warm Glow', brightness: 85, temperature: 3500, isCustom: false, createdAt: '' },
  { id: 'golden-hour', name: 'Golden Hour', brightness: 75, temperature: 3000, isCustom: false, createdAt: '' },
  { id: 'cool-studio', name: 'Cool Studio', brightness: 95, temperature: 7500, isCustom: false, createdAt: '' },
  { id: 'sunset', name: 'Sunset Warmth', brightness: 70, temperature: 2700, isCustom: false, createdAt: '' },
];

const STORAGE_KEY = 'glowup-custom-presets';

export function savePresetsToStorage(presets: Preset[]): void {
  if (typeof window === 'undefined') return;
  const customOnly = presets.filter((p) => p.isCustom);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customOnly));
}

export function loadPresetsFromStorage(): Preset[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getAllPresets(): Preset[] {
  const custom = loadPresetsFromStorage();
  return [...DEFAULT_PRESETS, ...custom];
}

export function createPreset(name: string, brightness: number, temperature: number): Preset {
  return {
    id: `custom-${Date.now()}`,
    name,
    brightness,
    temperature,
    isCustom: true,
    createdAt: new Date().toISOString(),
  };
}

export function exportPresetsJSON(presets: Preset[]): string {
  return JSON.stringify(presets.filter((p) => p.isCustom), null, 2);
}

export function importPresetsJSON(json: string): Preset[] {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((p: Preset) => ({
      ...p,
      isCustom: true,
      id: p.id || `imported-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    }));
  } catch {
    return [];
  }
}
