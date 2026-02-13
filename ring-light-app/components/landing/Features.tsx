'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Keyboard,
  Layers,
  Monitor,
  Share2,
  Thermometer,
  Wifi,
} from 'lucide-react';
import { LANDING_FEATURES } from '@/lib/landingContent';
import { LANDING_EASE, animateIfMotion, initialIfMotion } from '@/lib/motion';

const iconMap = {
  monitor: Monitor,
  thermometer: Thermometer,
  layers: Layers,
  share2: Share2,
  keyboard: Keyboard,
  wifi: Wifi,
} as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: LANDING_EASE,
    },
  },
};

export default function Features() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section
      className="landing-section relative overflow-hidden px-6"
      aria-label="Features"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="landing-accent-orb absolute -top-28 left-1/4 hidden h-96 w-96 rounded-full opacity-[0.06] md:block" />
        <div className="landing-accent-orb-cool absolute -bottom-28 right-1/4 hidden h-96 w-96 rounded-full opacity-[0.05] md:block" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          className="mb-16 text-center sm:mb-20"
          initial={initialIfMotion(reduceMotion, { opacity: 0, y: 20 })}
          whileInView={animateIfMotion(reduceMotion, { opacity: 1, y: 0 })}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: LANDING_EASE }}
        >
          <motion.span
            className="mb-4 inline-block font-body text-sm uppercase tracking-[0.3em] text-hot-pink"
            initial={initialIfMotion(reduceMotion, { opacity: 0 })}
            whileInView={animateIfMotion(reduceMotion, { opacity: 1 })}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Built for creators and teams
          </motion.span>

          <h2 className="font-display text-4xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-outline">Everything you need</span>{' '}
            <span className="gradient-text">to stay camera-ready</span>
          </h2>

          <p className="landing-muted mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
            Launch quickly, match your environment, and keep your look
            consistent across calls, streams, and recordings.
          </p>

          <motion.div
            className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-hot-pink to-electric-blue"
            initial={initialIfMotion(reduceMotion, { scaleX: 0 })}
            whileInView={animateIfMotion(reduceMotion, { scaleX: 1 })}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4, ease: LANDING_EASE }}
          />
        </motion.div>

        <motion.ul
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
          variants={containerVariants}
          initial={initialIfMotion(reduceMotion, 'hidden')}
          whileInView={animateIfMotion(reduceMotion, 'visible')}
          viewport={{ once: true, margin: '-80px' }}
        >
          {LANDING_FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon];

            return (
              <motion.li
                key={feature.title}
                variants={cardVariants}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -4,
                        transition: { duration: 0.2 },
                      }
                }
                className="group relative list-none"
              >
                <div
                  className="absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, ${feature.accent}66, transparent 40%, ${feature.accent}33)`,
                  }}
                />

                <article className="relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md sm:p-8">
                  <div
                    className="absolute right-0 top-0 h-16 w-16 opacity-10 transition-opacity group-hover:opacity-20"
                    style={{
                      background: `linear-gradient(135deg, ${feature.accent}, transparent)`,
                      borderRadius: '0 20px 0 20px',
                    }}
                    aria-hidden="true"
                  />

                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div
                      className="relative flex h-14 w-14 items-center justify-center rounded-xl"
                      style={{
                        background: `${feature.accent}15`,
                        border: `1px solid ${feature.accent}30`,
                      }}
                      aria-hidden="true"
                    >
                      <Icon className="h-6 w-6" style={{ color: feature.accent }} />
                    </div>

                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80"
                      style={{
                        border: `1px solid ${feature.accent}40`,
                        background: `${feature.accent}1A`,
                      }}
                    >
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="mb-3 font-display text-xl tracking-tight text-white sm:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="landing-muted flex-1 text-sm leading-relaxed sm:text-base">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <div
                      className="h-0.5 flex-1 rounded-full"
                      style={{ background: `${feature.accent}66` }}
                    />
                    <span
                      className="font-body text-xs tracking-[0.2em] text-white/45"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <span
                    className="pointer-events-none absolute bottom-4 right-6 select-none font-display text-6xl opacity-[0.04] transition-opacity group-hover:opacity-[0.08]"
                    style={{ color: feature.accent }}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </article>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
