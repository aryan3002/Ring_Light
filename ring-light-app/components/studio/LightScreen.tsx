'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLightContext } from '@/context/LightContext';
import { kelvinToRGB, rgbToCSS } from '@/lib/colorScience';

export default function LightScreen() {
  const { settings } = useLightContext();

  const backgroundColor = useMemo(() => {
    const { r, g, b } = kelvinToRGB(settings.temperature);
    return rgbToCSS(r, g, b);
  }, [settings.temperature]);

  const opacity = settings.brightness / 100;

  return (
    <motion.div
      className="fixed inset-0 w-screen h-screen"
      style={{ zIndex: -10 }}
      animate={{
        backgroundColor,
        opacity,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
}
