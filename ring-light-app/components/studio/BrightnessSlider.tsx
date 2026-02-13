'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sun } from 'lucide-react';
import { useLightContext } from '@/context/LightContext';

export default function BrightnessSlider() {
  const { settings, updateBrightness } = useLightContext();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateBrightness(Number(e.target.value));
    },
    [updateBrightness]
  );

  return (
    <div className="w-full space-y-2">
      {/* Label Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-[#FFBE0B]" />
          <span className="text-sm font-semibold tracking-wide uppercase text-white/80">
            Intensity
          </span>
        </div>
        <motion.span
          key={settings.brightness}
          initial={{ scale: 1.2, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-sm font-bold tabular-nums text-white"
        >
          {settings.brightness}%
        </motion.span>
      </div>

      {/* Slider */}
      <div className="relative w-full h-8 flex items-center">
        {/* Custom Track Background */}
        <div
          className="absolute inset-x-0 h-2 rounded-full brightness-gradient pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, #1a1a2e 0%, #2d2d44 25%, #666680 50%, #b3b3cc 75%, #ffffff 100%)',
          }}
        />

        {/* Active Fill Overlay */}
        <div
          className="absolute left-0 h-2 rounded-full pointer-events-none transition-all duration-100"
          style={{
            width: `${settings.brightness}%`,
            background: 'linear-gradient(to right, #FF006E, #FFBE0B)',
            opacity: 0.7,
          }}
        />

        {/* Input Range */}
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={settings.brightness}
          onChange={handleChange}
          className="custom-slider w-full relative z-10"
          aria-label={`Brightness intensity: ${settings.brightness}%`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={settings.brightness}
          aria-valuetext={`${settings.brightness} percent`}
        />
      </div>
    </div>
  );
}
