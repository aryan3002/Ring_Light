export type PhoneGuideOrientation = 'portrait' | 'landscape';

export interface PhoneGuidePosition {
  x: number;
  y: number;
}

export interface PhoneGuideCalibration {
  pxPerMm: number | null;
  calibratedAt: string | null;
}

export interface PhoneGuideSettings {
  enabled: boolean;
  modelId: string;
  orientation: PhoneGuideOrientation;
  position: PhoneGuidePosition;
  calibration: PhoneGuideCalibration;
}

export interface LightSettings {
  brightness: number;
  temperature: number;
  isVisible: boolean;
  activePreset: string | null;
  phoneGuide: PhoneGuideSettings;
}

export interface Preset {
  id: string;
  name: string;
  brightness: number;
  temperature: number;
  isCustom: boolean;
  createdAt: string;
}

export interface LightContextType {
  settings: LightSettings;
  presets: Preset[];
  updateBrightness: (value: number) => void;
  updateTemperature: (value: number) => void;
  toggleControls: () => void;
  setControlsVisible: (visible: boolean) => void;
  applyPreset: (presetId: string) => void;
  createPreset: (name: string) => void;
  deletePreset: (presetId: string) => void;
  updatePreset: (id: string, updates: Partial<Pick<Preset, 'name' | 'brightness' | 'temperature'>>) => void;
  resetSettings: () => void;
  generateShareURL: () => string;
  loadFromURL: (params: URLSearchParams) => void;
  setPhoneGuideEnabled: (enabled: boolean) => void;
  setPhoneGuideModel: (modelId: string) => void;
  setPhoneGuideOrientation: (orientation: PhoneGuideOrientation) => void;
  setPhoneGuidePosition: (position: PhoneGuidePosition) => void;
  setPhoneGuideCalibration: (pxPerMm: number | null) => void;
  resetPhoneGuide: () => void;
}

export interface AppSettings {
  defaultPreset: string | null;
  customCursorEnabled: boolean;
  shortcutsEnabled: boolean;
}

export const DEFAULT_PHONE_GUIDE_SETTINGS: PhoneGuideSettings = {
  enabled: false,
  modelId: 'standard',
  orientation: 'portrait',
  position: {
    x: -1,
    y: -1,
  },
  calibration: {
    pxPerMm: null,
    calibratedAt: null,
  },
};

export const DEFAULT_SETTINGS: LightSettings = {
  brightness: 100,
  temperature: 5500,
  isVisible: true,
  activePreset: null,
  phoneGuide: DEFAULT_PHONE_GUIDE_SETTINGS,
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  defaultPreset: null,
  customCursorEnabled: true,
  shortcutsEnabled: true,
};
