'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Thermometer } from 'lucide-react';
import { useLightContext } from '@/context/LightContext';
import { temperatureLabel } from '@/lib/colorScience';

export default function TemperatureSlider() {
  const { settings, updateTemperature } = useLightContext();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateTemperature(Number(e.target.value));
    },
    [updateTemperature]
  );

  const label = temperatureLabel(settings.temperature);

  return (
    <div className="w-full space-y-2">
      {/* Label Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-[#00F0FF]" />
          <span className="text-sm font-semibold tracking-wide uppercase text-white/80">
            Warmth
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-medium">
            {label}
          </span>
          <motion.span
            key={settings.temperature}
            initial={{ scale: 1.2, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-bold tabular-nums text-white"
          >
            {settings.temperature}K
          </motion.span>
        </div>
      </div>

      {/* Slider */}
      <div className="relative w-full h-8 flex items-center">
        {/* Custom Track Background - warm to cool */}
        <div
          className="absolute inset-x-0 h-2 rounded-full temp-gradient pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, #FF8C00 0%, #FFB347 20%, #FFEFD5 40%, #E0E8FF 60%, #87CEEB 80%, #4DA6FF 100%)',
          }}
        />

        {/* Input Range */}
        <input
          type="range"
          min={2700}
          max={9000}
          step={100}
          value={settings.temperature}
          onChange={handleChange}
          className="custom-slider w-full relative z-10"
          aria-label={`Color temperature: ${settings.temperature} Kelvin, ${label}`}
          aria-valuemin={2700}
          aria-valuemax={9000}
          aria-valuenow={settings.temperature}
          aria-valuetext={`${settings.temperature} Kelvin, ${label}`}
        />
      </div>
    </div>
  );
}
