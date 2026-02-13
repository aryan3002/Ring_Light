'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, SlidersHorizontal, Sun } from 'lucide-react';
import { LANDING_CONTENT } from '@/lib/landingContent';
import { kelvinToRGB, rgbToCSS, temperatureLabel } from '@/lib/colorScience';
import { LANDING_EASE, animateIfMotion, initialIfMotion } from '@/lib/motion';

export default function Demo() {
  const reduceMotion = useReducedMotion() ?? false;
  const [temperature, setTemperature] = useState(4500);
  const [brightness, setBrightness] = useState(80);

  const rgb = kelvinToRGB(temperature);
  const adjustedR = Math.round(rgb.r * (brightness / 100));
  const adjustedG = Math.round(rgb.g * (brightness / 100));
  const adjustedB = Math.round(rgb.b * (brightness / 100));

  const displayColor = rgbToCSS(adjustedR, adjustedG, adjustedB);
  const glowColor = `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, 0.36)`;
  const softGlow = `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, 0.12)`;

  const handleTempChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTemperature(Number(event.target.value));
    },
    []
  );

  const handleBrightnessChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setBrightness(Number(event.target.value));
    },
    []
  );

  return (
    <section
      className="landing-section relative overflow-hidden px-6"
      aria-label="Interactive demo"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(ellipse at 50% 45%, ${softGlow} 0%, transparent 60%)`,
        }}
        transition={{ duration: reduceMotion ? 0 : 0.25, ease: LANDING_EASE }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          className="mb-14 text-center"
          initial={initialIfMotion(reduceMotion, { opacity: 0, y: 24 })}
          whileInView={animateIfMotion(reduceMotion, { opacity: 1, y: 0 })}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: LANDING_EASE }}
        >
          <motion.span
            className="mb-4 inline-block font-body text-sm uppercase tracking-[0.3em] text-electric-blue"
            initial={initialIfMotion(reduceMotion, { opacity: 0 })}
            whileInView={animateIfMotion(reduceMotion, { opacity: 1 })}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {LANDING_CONTENT.demo.eyebrow}
          </motion.span>

          <h2 className="font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
            <span className="chrome-text">{LANDING_CONTENT.demo.titlePrimary}</span>{' '}
            <span className="gradient-text">{LANDING_CONTENT.demo.titleAccent}</span>
          </h2>

          <p className="landing-muted mx-auto mt-5 max-w-3xl text-base leading-relaxed sm:text-lg">
            {LANDING_CONTENT.demo.description}
          </p>
        </motion.div>

        <motion.div
          className="glass-panel corner-brackets overflow-hidden rounded-3xl"
          initial={initialIfMotion(reduceMotion, { opacity: 0, y: 32, scale: 0.98 })}
          whileInView={animateIfMotion(reduceMotion, {
            opacity: 1,
            y: 0,
            scale: 1,
          })}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55, ease: LANDING_EASE }}
        >
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-5">
            <div className="relative lg:col-span-3">
              <motion.div
                className="relative flex min-h-[280px] items-center justify-center overflow-hidden sm:min-h-[340px] lg:h-full"
                animate={{ backgroundColor: displayColor }}
                transition={{ duration: reduceMotion ? 0 : 0.2, ease: LANDING_EASE }}
              >
                <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                  <motion.div
                    className="h-40 w-40 rounded-full border-[6px] sm:h-56 sm:w-56 sm:border-[8px]"
                    style={{
                      borderColor: `rgba(255,255,255,${brightness > 50 ? 0.18 : 0.3})`,
                    }}
                    animate={{
                      boxShadow: `0 0 50px ${glowColor}, inset 0 0 50px ${glowColor}`,
                    }}
                    transition={{ duration: reduceMotion ? 0 : 0.2, ease: LANDING_EASE }}
                  />
                </div>

                <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                  <div className="rounded-lg border border-white/15 bg-black/45 px-3 py-1.5 backdrop-blur-md">
                    <span className="font-body text-xs text-white/80">
                      {temperature}K &middot; {brightness}%
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
                  <div className="rounded-lg border border-white/15 bg-black/45 px-3 py-1.5 backdrop-blur-md">
                    <span className="font-body text-xs text-white/80">
                      {temperatureLabel(temperature)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="border-t border-white/10 bg-dark-surface/65 p-6 lg:col-span-2 lg:border-l lg:border-t-0 sm:p-8">
              <div className="mb-8 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-hot-pink" aria-hidden="true" />
                <h3 className="font-display text-lg tracking-tight">
                  {LANDING_CONTENT.demo.controlsHeading}
                </h3>
              </div>

              <div className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                  <label
                    htmlFor="demo-temp"
                    className="flex items-center gap-1.5 font-body text-sm text-white/75"
                  >
                    <Sun className="h-3.5 w-3.5 text-cyber-yellow" aria-hidden="true" />
                    Color temperature
                  </label>
                  <span className="font-body text-sm tabular-nums text-white/90">
                    {temperature}K
                  </span>
                </div>

                <div className="relative">
                  <div className="temp-gradient mb-1 h-2 rounded-full" />
                  <input
                    id="demo-temp"
                    type="range"
                    min={2700}
                    max={9000}
                    step={100}
                    value={temperature}
                    onChange={handleTempChange}
                    className="custom-slider absolute inset-0 w-full bg-transparent"
                    aria-label="Color temperature"
                  />
                </div>

                <div className="mt-2 flex justify-between">
                  <span className="font-body text-[10px] text-white/40">2700K</span>
                  <span className="font-body text-[10px] text-white/40">9000K</span>
                </div>
              </div>

              <div className="mb-10">
                <div className="mb-3 flex items-center justify-between">
                  <label
                    htmlFor="demo-brightness"
                    className="flex items-center gap-1.5 font-body text-sm text-white/75"
                  >
                    <Sun className="h-3.5 w-3.5 text-white/65" aria-hidden="true" />
                    Brightness
                  </label>
                  <span className="font-body text-sm tabular-nums text-white/90">
                    {brightness}%
                  </span>
                </div>

                <div className="relative">
                  <div className="brightness-gradient mb-1 h-2 rounded-full" />
                  <input
                    id="demo-brightness"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={brightness}
                    onChange={handleBrightnessChange}
                    className="custom-slider absolute inset-0 w-full bg-transparent"
                    aria-label="Brightness"
                  />
                </div>

                <div className="mt-2 flex justify-between">
                  <span className="font-body text-[10px] text-white/40">0%</span>
                  <span className="font-body text-[10px] text-white/40">100%</span>
                </div>
              </div>

              <div className="mb-8 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <motion.div
                  className="h-10 w-10 flex-shrink-0 rounded-lg"
                  animate={{
                    backgroundColor: displayColor,
                    boxShadow: `0 0 16px ${glowColor}`,
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.2, ease: LANDING_EASE }}
                />
                <div>
                  <p className="font-body text-xs text-white/55">
                    {LANDING_CONTENT.demo.outputLabel}
                  </p>
                  <p className="font-body font-mono text-sm text-white/90">
                    rgb({adjustedR}, {adjustedG}, {adjustedB})
                  </p>
                </div>
              </div>

              <Link href="/studio" className="landing-inline-link">
                {LANDING_CONTENT.demo.cta}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
