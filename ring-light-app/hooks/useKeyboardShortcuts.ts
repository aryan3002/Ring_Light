'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardCallbacks {
  onToggleControls: () => void;
  onReset: () => void;
  onPreset: (index: number) => void;
  onBrightnessUp?: () => void;
  onBrightnessDown?: () => void;
  onTemperatureUp?: () => void;
  onTemperatureDown?: () => void;
  onFullscreen?: () => void;
}

export function useKeyboardShortcuts(callbacks: KeyboardCallbacks) {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'h':
        case ' ':
          e.preventDefault();
          callbacks.onToggleControls();
          break;
        case 'r':
          if (!e.ctrlKey && !e.metaKey) {
            callbacks.onReset();
          }
          break;
        case 'f':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            callbacks.onFullscreen?.();
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          callbacks.onPreset(parseInt(e.key) - 1);
          break;
        case 'arrowup':
          e.preventDefault();
          callbacks.onBrightnessUp?.();
          break;
        case 'arrowdown':
          e.preventDefault();
          callbacks.onBrightnessDown?.();
          break;
        case 'arrowleft':
          e.preventDefault();
          callbacks.onTemperatureDown?.();
          break;
        case 'arrowright':
          e.preventDefault();
          callbacks.onTemperatureUp?.();
          break;
      }
    },
    [callbacks]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}
