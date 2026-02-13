'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Maximize,
  Minimize,
  Settings,
  LayoutGrid,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useLightContext } from '@/context/LightContext';
import BrightnessSlider from './BrightnessSlider';
import TemperatureSlider from './TemperatureSlider';
import PresetButtons from './PresetButtons';
import PhoneGuideControls from './PhoneGuideControls';
import Link from 'next/link';

export default function ControlPanel() {
  const { settings, toggleControls, generateShareURL } = useLightContext();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleShare = useCallback(async () => {
    const url = generateShareURL();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  }, [generateShareURL]);

  const handleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <>
      {/* Floating Hint - Top Right */}
      <AnimatePresence>
        {settings.isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="fixed top-4 right-4 z-50"
          >
            <span className="text-xs text-white/30 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 font-medium">
              Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50 font-mono text-[10px] mx-0.5">H</kbd> to hide controls
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button - Always Visible */}
      <AnimatePresence>
        {!settings.isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={toggleControls}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-3 rounded-full
              bg-black/30 backdrop-blur-xl border border-white/10 text-white/60
              hover:text-white hover:bg-black/50 transition-colors"
            aria-label="Show controls"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-xl
              bg-[#39FF14]/15 backdrop-blur-xl border border-[#39FF14]/30
              text-[#39FF14] text-sm font-semibold shadow-[0_0_30px_rgba(57,255,20,0.15)]"
          >
            Link copied!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Control Panel */}
      <AnimatePresence>
        {settings.isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4 sm:pb-6 pointer-events-none"
          >
            <div
              className="glass-panel w-full max-w-[600px] rounded-2xl p-4 sm:p-5 space-y-4 pointer-events-auto"
              role="region"
              aria-label="Light controls"
            >
              {/* Presets Row */}
              <PresetButtons />

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Sliders */}
              <div className="space-y-3">
                <BrightnessSlider />
                <TemperatureSlider />
              </div>

              <PhoneGuideControls />

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Action Bar */}
              <div className="flex items-center justify-between">
                {/* Left Side - Stats */}
                <div className="flex items-center gap-3 text-xs text-white/40 font-medium tabular-nums">
                  <span>{settings.brightness}%</span>
                  <span className="w-px h-3 bg-white/10" aria-hidden="true" />
                  <span>{settings.temperature}K</span>
                </div>

                {/* Right Side - Action Buttons */}
                <div className="flex items-center gap-1">
                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10
                      transition-all duration-200 active:scale-95"
                    aria-label="Share current light settings"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={handleFullscreen}
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10
                      transition-all duration-200 active:scale-95"
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}
                  </button>

                  {/* Hide Controls */}
                  <button
                    onClick={toggleControls}
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10
                      transition-all duration-200 active:scale-95"
                    aria-label="Hide controls"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>

                  {/* Divider */}
                  <span className="w-px h-5 bg-white/10 mx-1" aria-hidden="true" />

                  {/* Presets Page Link */}
                  <Link
                    href="/presets"
                    className="p-2 rounded-lg text-white/50 hover:text-[#FF006E] hover:bg-white/10
                      transition-all duration-200 active:scale-95"
                    aria-label="Go to presets page"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Link>

                  {/* Settings Link */}
                  <Link
                    href="/settings"
                    className="p-2 rounded-lg text-white/50 hover:text-[#FFBE0B] hover:bg-white/10
                      transition-all duration-200 active:scale-95"
                    aria-label="Go to settings page"
                  >
                    <Settings className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
