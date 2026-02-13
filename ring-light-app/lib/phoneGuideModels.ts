export type PhoneGuideSafeAreaType = 'notch' | 'dynamic-island' | 'none';

export interface PhoneGuideSafeArea {
  type: PhoneGuideSafeAreaType;
  widthRatio: number;
  heightRatio: number;
  topOffsetRatio: number;
  radiusRatio: number;
}

export interface PhoneGuideModel {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  cornerRadiusRatio: number;
  safeArea: PhoneGuideSafeArea;
}

const NOTCH: PhoneGuideSafeArea = {
  type: 'notch',
  widthRatio: 0.33,
  heightRatio: 0.055,
  topOffsetRatio: 0.016,
  radiusRatio: 0.45,
};

const DYNAMIC_ISLAND: PhoneGuideSafeArea = {
  type: 'dynamic-island',
  widthRatio: 0.24,
  heightRatio: 0.036,
  topOffsetRatio: 0.022,
  radiusRatio: 0.5,
};

const NONE: PhoneGuideSafeArea = {
  type: 'none',
  widthRatio: 0,
  heightRatio: 0,
  topOffsetRatio: 0,
  radiusRatio: 0,
};

export const PHONE_GUIDE_MODELS: PhoneGuideModel[] = [
  { id: 'iphone-16-pro-max', label: 'iPhone 16 Pro Max', widthMm: 77.6, heightMm: 163.0, cornerRadiusRatio: 0.06, safeArea: DYNAMIC_ISLAND },
  { id: 'iphone-16-pro', label: 'iPhone 16 Pro', widthMm: 71.5, heightMm: 149.6, cornerRadiusRatio: 0.062, safeArea: DYNAMIC_ISLAND },
  { id: 'iphone-16-plus', label: 'iPhone 16 Plus', widthMm: 77.8, heightMm: 160.9, cornerRadiusRatio: 0.06, safeArea: DYNAMIC_ISLAND },
  { id: 'iphone-16', label: 'iPhone 16', widthMm: 71.6, heightMm: 147.6, cornerRadiusRatio: 0.06, safeArea: DYNAMIC_ISLAND },

  { id: 'iphone-15-pro-max', label: 'iPhone 15 Pro Max', widthMm: 76.7, heightMm: 159.9, cornerRadiusRatio: 0.06, safeArea: DYNAMIC_ISLAND },
  { id: 'iphone-15-pro', label: 'iPhone 15 Pro', widthMm: 70.6, heightMm: 146.6, cornerRadiusRatio: 0.062, safeArea: DYNAMIC_ISLAND },
  { id: 'iphone-15-plus', label: 'iPhone 15 Plus', widthMm: 77.8, heightMm: 160.9, cornerRadiusRatio: 0.06, safeArea: DYNAMIC_ISLAND },
  { id: 'iphone-15', label: 'iPhone 15', widthMm: 71.6, heightMm: 147.6, cornerRadiusRatio: 0.06, safeArea: DYNAMIC_ISLAND },

  { id: 'iphone-14-pro-max', label: 'iPhone 14 Pro Max', widthMm: 77.6, heightMm: 160.7, cornerRadiusRatio: 0.06, safeArea: DYNAMIC_ISLAND },
  { id: 'iphone-14-pro', label: 'iPhone 14 Pro', widthMm: 71.5, heightMm: 147.5, cornerRadiusRatio: 0.06, safeArea: DYNAMIC_ISLAND },
  { id: 'iphone-14-plus', label: 'iPhone 14 Plus', widthMm: 78.1, heightMm: 160.8, cornerRadiusRatio: 0.058, safeArea: NOTCH },
  { id: 'iphone-14', label: 'iPhone 14', widthMm: 71.5, heightMm: 146.7, cornerRadiusRatio: 0.06, safeArea: NOTCH },

  { id: 'iphone-13-pro-max', label: 'iPhone 13 Pro Max', widthMm: 78.1, heightMm: 160.8, cornerRadiusRatio: 0.058, safeArea: NOTCH },
  { id: 'iphone-13-pro', label: 'iPhone 13 Pro', widthMm: 71.5, heightMm: 146.7, cornerRadiusRatio: 0.06, safeArea: NOTCH },
  { id: 'iphone-13', label: 'iPhone 13', widthMm: 71.5, heightMm: 146.7, cornerRadiusRatio: 0.06, safeArea: NOTCH },
  { id: 'iphone-13-mini', label: 'iPhone 13 mini', widthMm: 64.2, heightMm: 131.5, cornerRadiusRatio: 0.064, safeArea: NOTCH },

  { id: 'iphone-12-pro-max', label: 'iPhone 12 Pro Max', widthMm: 78.1, heightMm: 160.8, cornerRadiusRatio: 0.058, safeArea: NOTCH },
  { id: 'iphone-12-pro', label: 'iPhone 12 Pro', widthMm: 71.5, heightMm: 146.7, cornerRadiusRatio: 0.06, safeArea: NOTCH },
  { id: 'iphone-12', label: 'iPhone 12', widthMm: 71.5, heightMm: 146.7, cornerRadiusRatio: 0.06, safeArea: NOTCH },
  { id: 'iphone-12-mini', label: 'iPhone 12 mini', widthMm: 64.2, heightMm: 131.5, cornerRadiusRatio: 0.064, safeArea: NOTCH },

  { id: 'standard-compact', label: 'Standard Compact', widthMm: 66.5, heightMm: 138.5, cornerRadiusRatio: 0.062, safeArea: NONE },
  { id: 'standard', label: 'Standard', widthMm: 71.5, heightMm: 147.0, cornerRadiusRatio: 0.06, safeArea: NONE },
  { id: 'standard-plus', label: 'Standard Plus', widthMm: 77.8, heightMm: 160.0, cornerRadiusRatio: 0.058, safeArea: NONE },
  { id: 'standard-pro-max', label: 'Standard Pro Max', widthMm: 77.5, heightMm: 161.0, cornerRadiusRatio: 0.058, safeArea: NONE },
];

const modelMap = new Map(PHONE_GUIDE_MODELS.map((model) => [model.id, model]));

export function isPhoneGuideModelId(value: unknown): value is string {
  return typeof value === 'string' && modelMap.has(value);
}

export function getPhoneGuideModel(modelId: string): PhoneGuideModel {
  return modelMap.get(modelId) ?? modelMap.get('standard')!;
}
