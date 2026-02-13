'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useLightContext } from '@/context/LightContext';
import { kelvinToRGB, rgbToCSS } from '@/lib/colorScience';

interface PresetCreatorProps {
  onClose?: () => void;
}

export default function PresetCreator({ onClose }: PresetCreatorProps) {
  const { settings, createPreset } = useLightContext();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const rgb = kelvinToRGB(settings.temperature);
  const colorCSS = rgbToCSS(rgb.r, rgb.g, rgb.b);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-dismiss success message
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        onClose?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = name.trim();
    if (!trimmed) {
      setError('Give your preset a name first!');
      inputRef.current?.focus();
      return;
    }

    if (trimmed.length > 30) {
      setError('Keep it under 30 characters');
      return;
    }

    createPreset(trimmed);
    setName('');
    setShowSuccess(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel rounded-2xl p-6"
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF006E] to-[#FFBE0B]">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold gradient-text">
            Save This Vibe
          </h3>
          <p className="font-body text-xs text-white/40">
            Lock in your current settings as a preset
          </p>
        </div>
      </div>

      {/* Current settings preview */}
      <div className="mb-5 flex items-center gap-4 rounded-xl bg-white/5 p-4">
        {/* Live color swatch */}
        <div
          className="h-12 w-12 flex-shrink-0 rounded-xl border border-white/10"
          style={{
            backgroundColor: colorCSS,
            opacity: settings.brightness / 100,
            boxShadow: `0 0 20px ${colorCSS}`,
          }}
        />
        <div className="flex-1">
          <p className="font-body text-xs uppercase tracking-wider text-white/40 mb-1">
            Current Settings
          </p>
          <div className="flex items-center gap-4">
            <div>
              <span className="font-display text-xl font-bold text-white">
                {settings.brightness}
              </span>
              <span className="font-body text-xs text-white/40 ml-1">% bright</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <span className="font-display text-xl font-bold text-white">
                {settings.temperature.toLocaleString()}
              </span>
              <span className="font-body text-xs text-white/40 ml-1">K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center gap-3 py-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <CheckCircle className="h-12 w-12 text-[#00F0FF]" />
            </motion.div>
            <p className="font-display text-lg font-bold text-white">
              Preset saved!
            </p>
            <p className="font-body text-sm text-white/40">
              Your custom vibe is ready to use
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Name input */}
            <div>
              <label
                htmlFor="preset-name"
                className="mb-2 block font-body text-xs uppercase tracking-wider text-white/40"
              >
                Preset Name
              </label>
              <input
                ref={inputRef}
                id="preset-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Main Character Energy"
                maxLength={30}
                className={`
                  w-full rounded-xl border bg-white/5 px-4 py-3
                  font-body text-sm text-white placeholder-white/20
                  outline-none transition-all duration-200
                  focus:bg-white/[0.08]
                  ${error
                    ? 'border-red-500/50 focus:border-red-500/80 focus:ring-1 focus:ring-red-500/30'
                    : 'border-white/10 focus:border-[#FF006E]/50 focus:ring-1 focus:ring-[#FF006E]/20'
                  }
                `}
              />
              {/* Character count */}
              <div className="mt-1 flex items-center justify-between">
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="flex items-center gap-1 text-xs text-red-400"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
                <span className="ml-auto font-body text-[10px] text-white/20">
                  {name.length}/30
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="
                  flex flex-1 items-center justify-center gap-2 rounded-xl
                  bg-gradient-to-r from-[#FF006E] to-[#FFBE0B]
                  px-5 py-3 font-display text-sm font-bold text-white
                  shadow-[0_0_20px_rgba(255,0,110,0.3)]
                  transition-shadow duration-300
                  hover:shadow-[0_0_30px_rgba(255,0,110,0.5)]
                "
              >
                <Save className="h-4 w-4" />
                Save Current Settings
              </motion.button>

              {onClose && (
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-sm text-white/50 transition-colors hover:bg-white/10 hover:text-white/70"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
