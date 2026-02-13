'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Keyboard, Info, ChevronRight, Check } from 'lucide-react';
import { useLightContext } from '@/context/LightContext';
import Navigation from '@/components/shared/Navigation';

const shortcuts = [
  { key: 'H / Space', action: 'Toggle controls visibility' },
  { key: 'F', action: 'Toggle fullscreen' },
  { key: 'R', action: 'Reset to defaults' },
  { key: '1-6', action: 'Apply preset by number' },
  { key: 'Arrow Up/Down', action: 'Adjust brightness' },
  { key: 'Arrow Left/Right', action: 'Adjust temperature' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function SettingsPage() {
  const { presets, resetSettings } = useLightContext();
  const [defaultPreset, setDefaultPreset] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('glowup-default-preset');
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleDefaultPreset = (presetId: string | null) => {
    setDefaultPreset(presetId);
    if (presetId) {
      localStorage.setItem('glowup-default-preset', presetId);
    } else {
      localStorage.removeItem('glowup-default-preset');
    }
  };

  const handleReset = () => {
    resetSettings();
    localStorage.removeItem('glowup-settings');
    localStorage.removeItem('glowup-custom-presets');
    localStorage.removeItem('glowup-default-preset');
    setDefaultPreset(null);
    setShowResetConfirm(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2000);
  };

  return (
    <div className="min-h-screen bg-deep-charcoal">
      <Navigation />
      <main className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl gradient-text mb-10"
        >
          Settings
        </motion.h1>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Default Startup Preset */}
          <motion.section variants={item} className="glass-panel p-6">
            <h2 className="font-display text-lg text-white mb-4 flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-hot-pink" />
              Default Startup Preset
            </h2>
            <p className="text-white/50 text-sm mb-4">
              Choose which preset loads when you open the studio.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleDefaultPreset(null)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm ${
                  defaultPreset === null
                    ? 'bg-hot-pink/20 border border-hot-pink/50 text-white'
                    : 'bg-white/5 border border-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="flex items-center justify-between">
                  Last used settings
                  {defaultPreset === null && <Check className="w-4 h-4 text-hot-pink" />}
                </span>
              </button>
              {presets.slice(0, 6).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleDefaultPreset(preset.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm ${
                    defaultPreset === preset.id
                      ? 'bg-hot-pink/20 border border-hot-pink/50 text-white'
                      : 'bg-white/5 border border-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {preset.name}
                    {defaultPreset === preset.id && <Check className="w-4 h-4 text-hot-pink" />}
                  </span>
                </button>
              ))}
            </div>
          </motion.section>

          {/* Keyboard Shortcuts */}
          <motion.section variants={item} className="glass-panel p-6">
            <h2 className="font-display text-lg text-white mb-4 flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-electric-blue" />
              Keyboard Shortcuts
            </h2>
            <div className="space-y-3">
              {shortcuts.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-white/50">{s.action}</span>
                  <kbd className="px-3 py-1 rounded-lg bg-white/10 text-white/80 font-mono text-xs border border-white/10">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Reset */}
          <motion.section variants={item} className="glass-panel p-6">
            <h2 className="font-display text-lg text-white mb-4 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-cyber-yellow" />
              Reset All Data
            </h2>
            <p className="text-white/50 text-sm mb-4">
              This will clear all custom presets, saved settings, and preferences.
            </p>
            {resetDone ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-4 py-3 rounded-xl bg-neon-green/20 border border-neon-green/30 text-neon-green text-sm text-center"
              >
                All data has been reset.
              </motion.div>
            ) : !showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
              >
                Reset Everything
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <span className="text-white/70 text-sm">Are you sure?</span>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Yes, reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white/70 text-sm hover:bg-white/15 transition-colors"
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </motion.section>

          {/* About */}
          <motion.section variants={item} className="glass-panel p-6">
            <h2 className="font-display text-lg text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-neon-green" />
              About
            </h2>
            <div className="space-y-2 text-sm text-white/50">
              <p>
                <span className="text-white/80">Glow Up Studio</span> v1.0.0
              </p>
              <p>
                Turn your screen into a professional ring light for content creation.
              </p>
              <p className="pt-2 text-xs text-white/30">
                Made with care for creators everywhere.
              </p>
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
}
