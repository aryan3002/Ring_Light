'use client';

import Navigation from '@/components/shared/Navigation';
import PresetGallery from '@/components/presets/PresetGallery';
import { motion } from 'framer-motion';

export default function PresetsPage() {
  return (
    <div className="min-h-screen bg-deep-charcoal">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl md:text-6xl gradient-text mb-3">
            Quick Vibes
          </h1>
          <p className="text-white/50 font-body text-lg">
            Find your perfect glow. Save it. Share it.
          </p>
        </motion.div>
        <PresetGallery />
      </main>
    </div>
  );
}
