'use client';

import { Suspense, useEffect, useCallback, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLightContext } from '@/context/LightContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useWakeLock } from '@/hooks/useWakeLock';
import LightScreen from '@/components/studio/LightScreen';
import PhoneGuideOverlay from '@/components/studio/PhoneGuideOverlay';
import ControlPanel from '@/components/studio/ControlPanel';
import CustomCursor from '@/components/studio/CustomCursor';

// Konami code easter egg sequence
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

/** Reads URL search params and loads them into context */
function URLParamsLoader() {
  const searchParams = useSearchParams();
  const { loadFromURL } = useLightContext();

  useEffect(() => {
    if (searchParams) {
      loadFromURL(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function StudioContent() {
  const {
    settings,
    presets,
    toggleControls,
    resetSettings,
    applyPreset,
    updateBrightness,
    updateTemperature,
  } = useLightContext();

  const { isLocked } = useWakeLock();
  const [partyMode, setPartyMode] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Konami code listener
  useEffect(() => {
    const handleKonami = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const expectedKey = KONAMI_CODE[konamiIndex].toLowerCase();

      if (key === expectedKey) {
        const next = konamiIndex + 1;
        if (next === KONAMI_CODE.length) {
          setPartyMode(true);
          setShowConfetti(true);
          setKonamiIndex(0);
          setTimeout(() => setShowConfetti(false), 4000);
        } else {
          setKonamiIndex(next);
        }
      } else {
        setKonamiIndex(0);
      }
    };
    window.addEventListener('keydown', handleKonami);
    return () => window.removeEventListener('keydown', handleKonami);
  }, [konamiIndex]);

  // Party mode color cycling
  useEffect(() => {
    if (!partyMode) return;
    const temps = [2700, 3500, 5000, 6500, 8000, 9000];
    let i = 0;
    const interval = setInterval(() => {
      updateTemperature(temps[i % temps.length]);
      updateBrightness(70 + Math.random() * 30);
      i++;
    }, 400);
    const timeout = setTimeout(() => {
      setPartyMode(false);
      clearInterval(interval);
    }, 10000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [partyMode, updateTemperature, updateBrightness]);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const keyboardCallbacks = useMemo(
    () => ({
      onToggleControls: toggleControls,
      onReset: resetSettings,
      onPreset: (index: number) => {
        if (index < presets.length) {
          applyPreset(presets[index].id);
        }
      },
      onBrightnessUp: () => updateBrightness(Math.min(100, settings.brightness + 5)),
      onBrightnessDown: () => updateBrightness(Math.max(0, settings.brightness - 5)),
      onTemperatureUp: () => updateTemperature(Math.min(9000, settings.temperature + 100)),
      onTemperatureDown: () => updateTemperature(Math.max(2700, settings.temperature - 100)),
      onFullscreen: handleFullscreen,
    }),
    [
      toggleControls,
      resetSettings,
      presets,
      applyPreset,
      updateBrightness,
      updateTemperature,
      settings.brightness,
      settings.temperature,
      handleFullscreen,
    ]
  );

  useKeyboardShortcuts(keyboardCallbacks);

  // Confetti colors
  const confettiColors = ['#FF006E', '#FFBE0B', '#39FF14', '#00F0FF', '#fff'];

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      <LightScreen />
      <PhoneGuideOverlay />
      <ControlPanel />
      <CustomCursor />

      {/* URL params loader wrapped in Suspense */}
      <Suspense fallback={null}>
        <URLParamsLoader />
      </Suspense>

      {/* Fullscreen exit hint */}
      <AnimatePresence>
        {!settings.isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20"
          >
            <span className="text-xs text-white/20 font-body">
              Press H or Space to show controls
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wake lock indicator */}
      {isLocked && (
        <div className="fixed top-4 right-4 z-20">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" title="Screen wake lock active" />
        </div>
      )}

      {/* Party mode confetti */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: confettiColors[i % confettiColors.length],
                  borderRadius: Math.random() > 0.5 ? '50%' : '0',
                  width: `${6 + Math.random() * 8}px`,
                  height: `${6 + Math.random() * 8}px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]"
            >
              <span className="font-display text-4xl md:text-6xl gradient-text whitespace-nowrap">
                Party Mode!
              </span>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StudioPage() {
  return <StudioContent />;
}
