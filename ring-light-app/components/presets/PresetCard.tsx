'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Sparkles, Check, X } from 'lucide-react';
import { useLightContext } from '@/context/LightContext';
import { kelvinToRGB, rgbToCSS } from '@/lib/colorScience';
import { Preset } from '@/types';

interface PresetCardProps {
  preset: Preset;
}

export default function PresetCard({ preset }: PresetCardProps) {
  const { settings, applyPreset, deletePreset } = useLightContext();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isActive = settings.activePreset === preset.id;
  const rgb = kelvinToRGB(preset.temperature);
  const colorCSS = rgbToCSS(rgb.r, rgb.g, rgb.b);

  const handleApply = () => {
    if (!confirmDelete) {
      applyPreset(preset.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deletePreset(preset.id);
    setConfirmDelete(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleApply}
      className={`
        glass-panel relative cursor-pointer overflow-hidden rounded-2xl p-5
        transition-shadow duration-300
        ${isActive
          ? 'ring-2 ring-[#FF006E] shadow-[0_0_24px_rgba(255,0,110,0.35)]'
          : 'hover:shadow-[0_0_20px_rgba(255,0,110,0.15)]'
        }
      `}
    >
      {/* Active indicator glow bar */}
      {isActive && (
        <motion.div
          layoutId="active-preset-indicator"
          className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#FF006E] via-[#FFBE0B] to-[#00F0FF]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      )}

      {/* Top row: Color swatch + badges */}
      <div className="flex items-start justify-between mb-4">
        {/* Color preview swatch */}
        <div
          className="h-10 w-10 rounded-full border-2 border-white/10 shadow-lg flex-shrink-0"
          style={{
            backgroundColor: colorCSS,
            opacity: preset.brightness / 100,
            boxShadow: `0 0 16px ${colorCSS}`,
          }}
        />

        <div className="flex items-center gap-2">
          {/* Active badge */}
          {isActive && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 rounded-full bg-[#FF006E]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FF006E]"
            >
              <Sparkles className="h-3 w-3" />
              Active
            </motion.span>
          )}

          {/* Custom badge */}
          {preset.isCustom && (
            <span className="rounded-full bg-[#00F0FF]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#00F0FF]">
              Custom
            </span>
          )}
        </div>
      </div>

      {/* Preset name */}
      <h3 className="font-display text-lg font-bold text-white mb-1 truncate">
        {preset.name}
      </h3>

      {/* Temperature & Brightness info */}
      <div className="flex items-center gap-3 text-xs font-body text-white/50 mb-4">
        <span>{preset.temperature.toLocaleString()}K</span>
        <span className="h-3 w-px bg-white/20" />
        <span>{preset.brightness}%</span>
      </div>

      {/* Color gradient bar preview */}
      <div
        className="h-1.5 w-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${rgbToCSS(rgb.r, rgb.g, rgb.b)} 0%, rgba(${rgb.r},${rgb.g},${rgb.b},0.3) 100%)`,
        }}
      />

      {/* Delete button for custom presets */}
      <AnimatePresence mode="wait">
        {preset.isCustom && !confirmDelete && (
          <motion.button
            key="delete-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDeleteClick}
            className="absolute right-3 bottom-3 rounded-lg bg-white/5 p-2 text-white/30 transition-colors hover:bg-red-500/20 hover:text-red-400"
            aria-label={`Delete preset ${preset.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        )}

        {confirmDelete && (
          <motion.div
            key="confirm-delete"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute inset-x-0 bottom-0 flex items-center justify-between rounded-b-2xl bg-red-950/80 backdrop-blur-md px-4 py-3"
          >
            <span className="text-xs font-body font-semibold text-red-300">
              Are you sure?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleConfirmDelete}
                className="flex items-center gap-1 rounded-lg bg-red-500/30 px-3 py-1.5 text-xs font-bold text-red-300 transition-colors hover:bg-red-500/50"
              >
                <Check className="h-3 w-3" />
                Yes
              </button>
              <button
                onClick={handleCancelDelete}
                className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white/60 transition-colors hover:bg-white/20"
              >
                <X className="h-3 w-3" />
                No
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
