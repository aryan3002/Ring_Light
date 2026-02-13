'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Download,
  Upload,
  PackageOpen,
  Sparkles,
  X,
} from 'lucide-react';
import { useLightContext } from '@/context/LightContext';
import { exportPresetsJSON, importPresetsJSON } from '@/lib/presetManager';
import PresetCard from './PresetCard';
import PresetCreator from './PresetCreator';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function PresetGallery() {
  const { presets } = useLightContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreator, setShowCreator] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const builtInPresets = useMemo(
    () => presets.filter((p) => !p.isCustom),
    [presets]
  );

  const customPresets = useMemo(
    () => presets.filter((p) => p.isCustom),
    [presets]
  );

  const filteredBuiltIn = useMemo(
    () =>
      builtInPresets.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [builtInPresets, searchQuery]
  );

  const filteredCustom = useMemo(
    () =>
      customPresets.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [customPresets, searchQuery]
  );

  // Export custom presets as downloadable JSON
  const handleExport = () => {
    const json = exportPresetsJSON(presets);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glowup-presets-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import presets from JSON file
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = importPresetsJSON(content);
      if (imported.length > 0) {
        // Imported presets are added via the context's createPreset
        // But since importPresetsJSON returns Preset[], we need to add them directly
        // We'll use the presetManager's save and reload approach
        imported.forEach((preset) => {
          // Create each imported preset individually through context
          // The importPresetsJSON already validates and formats them
          window.dispatchEvent(
            new CustomEvent('import-preset', { detail: preset })
          );
        });
        setImportStatus('success');
        setTimeout(() => setImportStatus('idle'), 2500);
      } else {
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 2500);
      }
    };
    reader.readAsText(file);

    // Reset file input so the same file can be re-imported
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasCustomPresets = customPresets.length > 0;
  const noResults =
    searchQuery && filteredBuiltIn.length === 0 && filteredCustom.length === 0;

  return (
    <section className="w-full">
      {/* Section header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold gradient-text sm:text-3xl">
            Quick Vibes
          </h2>
          <p className="font-body mt-1 text-sm text-white/40">
            Pick a mood or create your own
          </p>
        </div>

        {/* Import / Export buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            disabled={!hasCustomPresets}
            className="
              flex items-center gap-1.5 rounded-xl border border-white/10
              bg-white/5 px-3 py-2 font-body text-xs text-white/50
              transition-colors hover:bg-white/10 hover:text-white/70
              disabled:cursor-not-allowed disabled:opacity-30
            "
            title="Export custom presets"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="
              flex items-center gap-1.5 rounded-xl border border-white/10
              bg-white/5 px-3 py-2 font-body text-xs text-white/50
              transition-colors hover:bg-white/10 hover:text-white/70
            "
            title="Import presets from JSON"
          >
            <Upload className="h-3.5 w-3.5" />
            Import
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          {/* Import status feedback */}
          <AnimatePresence>
            {importStatus === 'success' && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="font-body text-xs text-[#00F0FF]"
              >
                Imported!
              </motion.span>
            )}
            {importStatus === 'error' && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="font-body text-xs text-red-400"
              >
                Invalid file
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search presets..."
          className="
            w-full rounded-xl border border-white/10 bg-white/5
            py-3 pl-11 pr-10 font-body text-sm text-white
            placeholder-white/20 outline-none transition-all duration-200
            focus:border-[#FF006E]/40 focus:bg-white/[0.08]
            focus:ring-1 focus:ring-[#FF006E]/20
          "
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/30 transition-colors hover:text-white/60"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* No results state */}
      <AnimatePresence>
        {noResults && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Search className="mb-3 h-10 w-10 text-white/15" />
            <p className="font-display text-lg font-bold text-white/40">
              No matching presets
            </p>
            <p className="font-body mt-1 text-sm text-white/25">
              Try a different search term
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Built-in presets section */}
      {filteredBuiltIn.length > 0 && (
        <div className="mb-10">
          <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-white/30">
            <Sparkles className="h-4 w-4 text-[#FFBE0B]" />
            Built-in Presets
          </h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredBuiltIn.map((preset) => (
              <motion.div key={preset.id} variants={itemVariants}>
                <PresetCard preset={preset} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Custom presets section */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-white/30">
          <span className="h-4 w-4 rounded-full bg-gradient-to-br from-[#FF006E] to-[#00F0FF]" />
          Your Custom Presets
        </h3>

        {filteredCustom.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredCustom.map((preset) => (
              <motion.div key={preset.id} variants={itemVariants}>
                <PresetCard preset={preset} />
              </motion.div>
            ))}

            {/* Create New card */}
            {!searchQuery && (
              <motion.div variants={itemVariants}>
                <motion.button
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreator(true)}
                  className="
                    glass-panel hover-lift flex h-full min-h-[160px] w-full flex-col
                    items-center justify-center gap-3 rounded-2xl border-2
                    border-dashed border-white/10 p-5 transition-colors
                    hover:border-[#FF006E]/30 hover:bg-white/[0.03]
                  "
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF006E]/20 to-[#FFBE0B]/20">
                    <Plus className="h-6 w-6 text-[#FF006E]" />
                  </div>
                  <span className="font-display text-sm font-bold text-white/50">
                    Create New
                  </span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* Empty state for custom presets */
          !searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-14"
            >
              <PackageOpen className="mb-4 h-12 w-12 text-white/15" />
              <p className="font-display text-lg font-bold text-white/30">
                No custom presets yet
              </p>
              <p className="font-body mt-1 mb-5 text-sm text-white/20">
                Save your current settings as a custom preset
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreator(true)}
                className="
                  flex items-center gap-2 rounded-xl bg-gradient-to-r
                  from-[#FF006E] to-[#FFBE0B] px-5 py-2.5
                  font-display text-sm font-bold text-white
                  shadow-[0_0_20px_rgba(255,0,110,0.3)]
                  transition-shadow hover:shadow-[0_0_30px_rgba(255,0,110,0.5)]
                "
              >
                <Plus className="h-4 w-4" />
                Create Your First Preset
              </motion.button>
            </motion.div>
          )
        )}
      </div>

      {/* Preset Creator overlay/modal */}
      <AnimatePresence>
        {showCreator && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreator(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            {/* Creator panel */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md"
              >
                <PresetCreator onClose={() => setShowCreator(false)} />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
