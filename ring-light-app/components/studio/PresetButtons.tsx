'use client';

import { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLightContext } from '@/context/LightContext';
import { kelvinToRGB, rgbToCSS } from '@/lib/colorScience';

export default function PresetButtons() {
  const { settings, presets, applyPreset } = useLightContext();

  // Show only the first 6 presets (built-in ones)
  const visiblePresets = useMemo(() => presets.slice(0, 6), [presets]);

  const handlePresetClick = useCallback(
    (presetId: string) => {
      applyPreset(presetId);
    },
    [applyPreset]
  );

  return (
    <div className="w-full">
      <div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
        role="group"
        aria-label="Light presets"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {visiblePresets.map((preset) => {
          const isActive = settings.activePreset === preset.id;
          const { r, g, b } = kelvinToRGB(preset.temperature);
          const swatchColor = rgbToCSS(r, g, b);

          return (
            <motion.button
              key={preset.id}
              onClick={() => handlePresetClick(preset.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl
                text-xs font-semibold tracking-wide transition-colors duration-200
                ${
                  isActive
                    ? 'bg-white/15 border-2 border-[#FF006E] text-white shadow-[0_0_12px_rgba(255,0,110,0.3)]'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }
              `}
              aria-label={`Apply ${preset.name} preset: ${preset.brightness}% brightness, ${preset.temperature}K`}
              aria-pressed={isActive}
            >
              {/* Color Swatch */}
              <span
                className="w-4 h-4 rounded-full flex-shrink-0 border border-white/20"
                style={{
                  backgroundColor: swatchColor,
                  opacity: preset.brightness / 100,
                  boxShadow: isActive
                    ? `0 0 8px ${swatchColor}`
                    : 'none',
                }}
                aria-hidden="true"
              />

              {/* Preset Name */}
              <span className="whitespace-nowrap">{preset.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
