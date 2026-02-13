'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  LightSettings,
  LightContextType,
  Preset,
  DEFAULT_SETTINGS,
  DEFAULT_PHONE_GUIDE_SETTINGS,
  PhoneGuideOrientation,
  PhoneGuidePosition,
  PhoneGuideSettings,
} from '@/types';
import {
  DEFAULT_PRESETS,
  savePresetsToStorage,
  loadPresetsFromStorage,
  createPreset as createNewPreset,
} from '@/lib/presetManager';
import { generateShareURL, parseShareURL } from '@/lib/urlSharing';
import { isPhoneGuideModelId } from '@/lib/phoneGuideModels';
import { isValidPxPerMm } from '@/lib/phoneGuideSizing';

const LightContext = createContext<LightContextType | null>(null);

const SETTINGS_KEY = 'glowup-settings';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function createDefaultSettings(): LightSettings {
  return {
    ...DEFAULT_SETTINGS,
    phoneGuide: {
      ...DEFAULT_PHONE_GUIDE_SETTINGS,
      position: { ...DEFAULT_PHONE_GUIDE_SETTINGS.position },
      calibration: { ...DEFAULT_PHONE_GUIDE_SETTINGS.calibration },
    },
  };
}

function sanitizePhoneGuideSettings(input: unknown): PhoneGuideSettings {
  const raw = (input ?? {}) as Partial<PhoneGuideSettings>;
  const calibrationPx = isValidPxPerMm(raw.calibration?.pxPerMm ?? null)
    ? raw.calibration?.pxPerMm ?? null
    : null;

  return {
    enabled:
      typeof raw.enabled === 'boolean'
        ? raw.enabled
        : DEFAULT_PHONE_GUIDE_SETTINGS.enabled,
    modelId: isPhoneGuideModelId(raw.modelId)
      ? raw.modelId
      : DEFAULT_PHONE_GUIDE_SETTINGS.modelId,
    orientation:
      raw.orientation === 'landscape' || raw.orientation === 'portrait'
        ? raw.orientation
        : DEFAULT_PHONE_GUIDE_SETTINGS.orientation,
    position: {
      x:
        typeof raw.position?.x === 'number' && Number.isFinite(raw.position.x)
          ? raw.position.x
          : DEFAULT_PHONE_GUIDE_SETTINGS.position.x,
      y:
        typeof raw.position?.y === 'number' && Number.isFinite(raw.position.y)
          ? raw.position.y
          : DEFAULT_PHONE_GUIDE_SETTINGS.position.y,
    },
    calibration: {
      pxPerMm: calibrationPx,
      calibratedAt:
        calibrationPx !== null &&
        typeof raw.calibration?.calibratedAt === 'string'
          ? raw.calibration.calibratedAt
          : null,
    },
  };
}

function normalizeSettings(input: LightSettings | null): LightSettings {
  const defaults = createDefaultSettings();

  if (!input) {
    return defaults;
  }

  return {
    ...defaults,
    ...input,
    brightness:
      typeof input.brightness === 'number'
        ? clamp(input.brightness, 0, 100)
        : defaults.brightness,
    temperature:
      typeof input.temperature === 'number'
        ? clamp(input.temperature, 2700, 9000)
        : defaults.temperature,
    isVisible:
      typeof input.isVisible === 'boolean'
        ? input.isVisible
        : defaults.isVisible,
    activePreset:
      typeof input.activePreset === 'string' || input.activePreset === null
        ? input.activePreset
        : defaults.activePreset,
    phoneGuide: sanitizePhoneGuideSettings(input.phoneGuide),
  };
}

function saveSettingsToStorage(settings: LightSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadSettingsFromStorage(): LightSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function LightProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<LightSettings>(createDefaultSettings);
  const [presets, setPresets] = useState<Preset[]>(DEFAULT_PRESETS);
  const [hydrated, setHydrated] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadSettingsFromStorage();
    setSettings(normalizeSettings(saved));
    const customPresets = loadPresetsFromStorage();
    setPresets([...DEFAULT_PRESETS, ...customPresets]);
    setHydrated(true);
  }, []);

  // Debounced save to localStorage
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveSettingsToStorage(settings);
    }, 300);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [settings, hydrated]);

  const updateBrightness = useCallback((value: number) => {
    setSettings((prev) => ({
      ...prev,
      brightness: Math.max(0, Math.min(100, value)),
      activePreset: null,
    }));
  }, []);

  const updateTemperature = useCallback((value: number) => {
    setSettings((prev) => ({
      ...prev,
      temperature: Math.max(2700, Math.min(9000, value)),
      activePreset: null,
    }));
  }, []);

  const toggleControls = useCallback(() => {
    setSettings((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  }, []);

  const setControlsVisible = useCallback((visible: boolean) => {
    setSettings((prev) => ({ ...prev, isVisible: visible }));
  }, []);

  const applyPreset = useCallback(
    (presetId: string) => {
      const preset = presets.find((p) => p.id === presetId);
      if (preset) {
        setSettings((prev) => ({
          ...prev,
          brightness: preset.brightness,
          temperature: preset.temperature,
          activePreset: presetId,
        }));
      }
    },
    [presets]
  );

  const createPreset = useCallback(
    (name: string) => {
      const newPreset = createNewPreset(name, settings.brightness, settings.temperature);
      setPresets((prev) => {
        const updated = [...prev, newPreset];
        savePresetsToStorage(updated);
        return updated;
      });
    },
    [settings.brightness, settings.temperature]
  );

  const deletePreset = useCallback((presetId: string) => {
    setPresets((prev) => {
      const updated = prev.filter((p) => p.id !== presetId);
      savePresetsToStorage(updated);
      return updated;
    });
    setSettings((prev) => {
      if (prev.activePreset === presetId) {
        return { ...prev, activePreset: null };
      }
      return prev;
    });
  }, []);

  const updatePreset = useCallback(
    (id: string, updates: Partial<Pick<Preset, 'name' | 'brightness' | 'temperature'>>) => {
      setPresets((prev) => {
        const updated = prev.map((p) => (p.id === id && p.isCustom ? { ...p, ...updates } : p));
        savePresetsToStorage(updated);
        return updated;
      });
    },
    []
  );

  const resetSettings = useCallback(() => {
    setSettings(createDefaultSettings());
  }, []);

  const setPhoneGuideEnabled = useCallback((enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      phoneGuide: {
        ...prev.phoneGuide,
        enabled,
      },
    }));
  }, []);

  const setPhoneGuideModel = useCallback((modelId: string) => {
    setSettings((prev) => ({
      ...prev,
      phoneGuide: {
        ...prev.phoneGuide,
        modelId: isPhoneGuideModelId(modelId)
          ? modelId
          : DEFAULT_PHONE_GUIDE_SETTINGS.modelId,
      },
    }));
  }, []);

  const setPhoneGuideOrientation = useCallback(
    (orientation: PhoneGuideOrientation) => {
      setSettings((prev) => ({
        ...prev,
        phoneGuide: {
          ...prev.phoneGuide,
          orientation,
        },
      }));
    },
    []
  );

  const setPhoneGuidePosition = useCallback((position: PhoneGuidePosition) => {
    setSettings((prev) => ({
      ...prev,
      phoneGuide: {
        ...prev.phoneGuide,
        position: {
          x: Number.isFinite(position.x)
            ? position.x
            : prev.phoneGuide.position.x,
          y: Number.isFinite(position.y)
            ? position.y
            : prev.phoneGuide.position.y,
        },
      },
    }));
  }, []);

  const setPhoneGuideCalibration = useCallback((pxPerMm: number | null) => {
    setSettings((prev) => ({
      ...prev,
      phoneGuide: {
        ...prev.phoneGuide,
        calibration: isValidPxPerMm(pxPerMm)
          ? {
              pxPerMm,
              calibratedAt: new Date().toISOString(),
            }
          : {
              pxPerMm: null,
              calibratedAt: null,
            },
      },
    }));
  }, []);

  const resetPhoneGuide = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      phoneGuide: {
        ...prev.phoneGuide,
        modelId: DEFAULT_PHONE_GUIDE_SETTINGS.modelId,
        orientation: DEFAULT_PHONE_GUIDE_SETTINGS.orientation,
        position: { ...DEFAULT_PHONE_GUIDE_SETTINGS.position },
      },
    }));
  }, []);

  const genShareURL = useCallback(() => {
    return generateShareURL(settings);
  }, [settings]);

  const loadFromURL = useCallback((params: URLSearchParams) => {
    const parsed = parseShareURL(params);
    if (parsed) {
      setSettings((prev) => ({ ...prev, ...parsed, activePreset: null }));
    }
  }, []);

  const contextValue = useMemo<LightContextType>(
    () => ({
      settings,
      presets,
      updateBrightness,
      updateTemperature,
      toggleControls,
      setControlsVisible,
      applyPreset,
      createPreset,
      deletePreset,
      updatePreset,
      resetSettings,
      generateShareURL: genShareURL,
      loadFromURL,
      setPhoneGuideEnabled,
      setPhoneGuideModel,
      setPhoneGuideOrientation,
      setPhoneGuidePosition,
      setPhoneGuideCalibration,
      resetPhoneGuide,
    }),
    [
      settings,
      presets,
      updateBrightness,
      updateTemperature,
      toggleControls,
      setControlsVisible,
      applyPreset,
      createPreset,
      deletePreset,
      updatePreset,
      resetSettings,
      genShareURL,
      loadFromURL,
      setPhoneGuideEnabled,
      setPhoneGuideModel,
      setPhoneGuideOrientation,
      setPhoneGuidePosition,
      setPhoneGuideCalibration,
      resetPhoneGuide,
    ]
  );

  return <LightContext.Provider value={contextValue}>{children}</LightContext.Provider>;
}

export function useLightContext(): LightContextType {
  const context = useContext(LightContext);
  if (!context) {
    throw new Error('useLightContext must be used within a LightProvider');
  }
  return context;
}
