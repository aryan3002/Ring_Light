import { getPhoneGuideModel } from '@/lib/phoneGuideModels';
import type { PhoneGuideOrientation, PhoneGuidePosition } from '@/types';

export interface ViewportSize {
  width: number;
  height: number;
}

export interface PhoneGuideSize {
  width: number;
  height: number;
  cornerRadius: number;
  pxPerMm: number;
  usingCalibration: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function isValidPxPerMm(value: number | null): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0.8 && value <= 10;
}

export function computeGuideSize(params: {
  modelId: string;
  orientation: PhoneGuideOrientation;
  calibrationPxPerMm: number | null;
  viewport: ViewportSize;
}): PhoneGuideSize {
  const model = getPhoneGuideModel(params.modelId);
  const { orientation, viewport } = params;

  const widthMm = orientation === 'portrait' ? model.widthMm : model.heightMm;
  const heightMm = orientation === 'portrait' ? model.heightMm : model.widthMm;

  const longEdgeMm = Math.max(widthMm, heightMm);
  const viewportShortEdge = Math.min(viewport.width, viewport.height);

  const targetLongPx = clamp(viewportShortEdge * 0.48, 180, 420);
  const fallbackPxPerMm = targetLongPx / longEdgeMm;

  const usingCalibration = isValidPxPerMm(params.calibrationPxPerMm);
  const calibrationPxPerMm = usingCalibration ? params.calibrationPxPerMm : null;
  let pxPerMm = calibrationPxPerMm ?? fallbackPxPerMm;

  let width = widthMm * pxPerMm;
  let height = heightMm * pxPerMm;

  const maxWidth = viewport.width * 0.75;
  const maxHeight = viewport.height * 0.75;
  const downscale = Math.min(1, maxWidth / width, maxHeight / height);

  width *= downscale;
  height *= downscale;
  pxPerMm *= downscale;

  return {
    width,
    height,
    cornerRadius: clamp(Math.min(width, height) * model.cornerRadiusRatio, 12, 44),
    pxPerMm,
    usingCalibration,
  };
}

export function clampGuideCenter(
  center: PhoneGuidePosition,
  size: Pick<PhoneGuideSize, 'width' | 'height'>,
  viewport: ViewportSize
): PhoneGuidePosition {
  const halfWidth = size.width / 2;
  const halfHeight = size.height / 2;

  return {
    x: clamp(center.x, halfWidth, Math.max(halfWidth, viewport.width - halfWidth)),
    y: clamp(center.y, halfHeight, Math.max(halfHeight, viewport.height - halfHeight)),
  };
}

export function centerToTopLeft(
  center: PhoneGuidePosition,
  size: Pick<PhoneGuideSize, 'width' | 'height'>
): PhoneGuidePosition {
  return {
    x: center.x - size.width / 2,
    y: center.y - size.height / 2,
  };
}

export function topLeftToCenter(
  topLeft: PhoneGuidePosition,
  size: Pick<PhoneGuideSize, 'width' | 'height'>
): PhoneGuidePosition {
  return {
    x: topLeft.x + size.width / 2,
    y: topLeft.y + size.height / 2,
  };
}

export function getCenteredPosition(viewport: ViewportSize): PhoneGuidePosition {
  return {
    x: viewport.width / 2,
    y: viewport.height / 2,
  };
}

export function clampTopLeft(
  topLeft: PhoneGuidePosition,
  size: Pick<PhoneGuideSize, 'width' | 'height'>,
  viewport: ViewportSize
): PhoneGuidePosition {
  return {
    x: clamp(topLeft.x, 0, Math.max(0, viewport.width - size.width)),
    y: clamp(topLeft.y, 0, Math.max(0, viewport.height - size.height)),
  };
}
