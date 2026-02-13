'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLightContext } from '@/context/LightContext';
import { kelvinToRGB } from '@/lib/colorScience';
import { getPhoneGuideModel } from '@/lib/phoneGuideModels';
import {
  clampGuideCenter,
  clampTopLeft,
  computeGuideSize,
  centerToTopLeft,
  getCenteredPosition,
  topLeftToCenter,
} from '@/lib/phoneGuideSizing';

const POSITION_SAVE_DEBOUNCE_MS = 150;

export default function PhoneGuideOverlay() {
  const reduceMotion = useReducedMotion() ?? false;
  const { settings, setPhoneGuidePosition } = useLightContext();
  const { phoneGuide } = settings;

  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [topLeft, setTopLeft] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  const guideSize = useMemo(() => {
    if (viewport.width <= 0 || viewport.height <= 0) {
      return null;
    }

    return computeGuideSize({
      modelId: phoneGuide.modelId,
      orientation: phoneGuide.orientation,
      calibrationPxPerMm: phoneGuide.calibration.pxPerMm,
      viewport,
    });
  }, [
    phoneGuide.modelId,
    phoneGuide.orientation,
    phoneGuide.calibration.pxPerMm,
    viewport,
  ]);

  useEffect(() => {
    if (!phoneGuide.enabled || !guideSize) {
      return;
    }

    const hasSavedPosition =
      phoneGuide.position.x >= 0 && phoneGuide.position.y >= 0;
    const desiredCenter = hasSavedPosition
      ? phoneGuide.position
      : getCenteredPosition(viewport);

    const clampedCenter = clampGuideCenter(desiredCenter, guideSize, viewport);
    const clampedTopLeft = clampTopLeft(
      centerToTopLeft(clampedCenter, guideSize),
      guideSize,
      viewport
    );

    setTopLeft(clampedTopLeft);

    if (!hasSavedPosition) {
      setPhoneGuidePosition(clampedCenter);
    }
  }, [
    phoneGuide.enabled,
    phoneGuide.position,
    guideSize,
    viewport,
    setPhoneGuidePosition,
  ]);

  useEffect(() => {
    if (!phoneGuide.enabled || !guideSize) {
      return;
    }

    const nextCenter = clampGuideCenter(
      topLeftToCenter(topLeft, guideSize),
      guideSize,
      viewport
    );

    if (
      Math.abs(nextCenter.x - phoneGuide.position.x) < 0.5 &&
      Math.abs(nextCenter.y - phoneGuide.position.y) < 0.5
    ) {
      return;
    }

    const timer = setTimeout(() => {
      setPhoneGuidePosition(nextCenter);
    }, POSITION_SAVE_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [
    topLeft,
    phoneGuide.enabled,
    phoneGuide.position,
    guideSize,
    viewport,
    setPhoneGuidePosition,
  ]);

  const model = useMemo(
    () => getPhoneGuideModel(phoneGuide.modelId),
    [phoneGuide.modelId]
  );

  const outlineStyle = useMemo(() => {
    const rgb = kelvinToRGB(settings.temperature);
    const luminance =
      ((0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255) *
      (settings.brightness / 100);

    const strokeColor =
      luminance > 0.62 ? 'rgba(20, 20, 20, 0.78)' : 'rgba(255, 255, 255, 0.82)';

    const safeAreaColor =
      luminance > 0.62 ? 'rgba(20, 20, 20, 0.44)' : 'rgba(255, 255, 255, 0.34)';

    return {
      strokeColor,
      safeAreaColor,
      glow: `0 0 26px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18)`,
    };
  }, [settings.temperature, settings.brightness]);

  if (!phoneGuide.enabled || !guideSize) {
    return null;
  }

  const safeAreaWidth = guideSize.width * model.safeArea.widthRatio;
  const safeAreaHeight = guideSize.height * model.safeArea.heightRatio;
  const safeAreaTop = guideSize.height * model.safeArea.topOffsetRatio;

  return (
    <div
      className="phone-guide-layer fixed inset-0 z-20 pointer-events-none"
      aria-hidden="true"
    >
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={{
          left: 0,
          top: 0,
          right: Math.max(0, viewport.width - guideSize.width),
          bottom: Math.max(0, viewport.height - guideSize.height),
        }}
        onDragEnd={(_, info) => {
          setTopLeft((prev) =>
            clampTopLeft(
              {
                x: prev.x + info.offset.x,
                y: prev.y + info.offset.y,
              },
              guideSize,
              viewport
            )
          );
        }}
        whileDrag={reduceMotion ? undefined : { scale: 1.01 }}
        className="phone-guide-frame pointer-events-auto"
        style={{
          width: guideSize.width,
          height: guideSize.height,
          left: topLeft.x,
          top: topLeft.y,
          borderRadius: guideSize.cornerRadius,
          borderColor: outlineStyle.strokeColor,
          boxShadow: `${outlineStyle.glow}, inset 0 0 0 1px rgba(255,255,255,0.05)`,
        }}
      >
        {model.safeArea.type !== 'none' && (
          <div
            className={`phone-guide-safe-area phone-guide-safe-area-${model.safeArea.type}`}
            style={{
              width: safeAreaWidth,
              height: safeAreaHeight,
              top: safeAreaTop,
              borderRadius: Math.max(
                8,
                safeAreaHeight * Math.max(0.35, model.safeArea.radiusRatio)
              ),
              backgroundColor: outlineStyle.safeAreaColor,
            }}
          />
        )}

        <span className="phone-guide-label">iPhone Guide</span>

        {!guideSize.usingCalibration && (
          <span className="phone-guide-hint">Approximate size</span>
        )}
      </motion.div>
    </div>
  );
}
