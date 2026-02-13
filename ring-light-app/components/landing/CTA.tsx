'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Globe, Users, Zap } from 'lucide-react';
import { LANDING_CONTENT, LANDING_STATS } from '@/lib/landingContent';
import { LANDING_EASE, animateIfMotion, initialIfMotion } from '@/lib/motion';

const statIconMap = {
  users: Users,
  globe: Globe,
  zap: Zap,
} as const;

export default function CTA() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section
      className="landing-section relative overflow-hidden px-6"
      aria-label="Call to action"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {!reduceMotion && (
          <motion.div
            className="absolute left-[8%] top-[10%] hidden h-[340px] w-[340px] rounded-full bg-hot-pink/15 blur-3xl md:block"
            animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_75%,rgba(0,240,255,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          className="glass-panel relative overflow-hidden rounded-3xl p-8 text-center sm:p-12 md:p-14"
          initial={initialIfMotion(reduceMotion, { opacity: 0, y: 28, scale: 0.98 })}
          whileInView={animateIfMotion(reduceMotion, { opacity: 1, y: 0, scale: 1 })}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: LANDING_EASE }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(255,0,110,0.08) 0%, transparent 55%)',
            }}
            aria-hidden="true"
          />

          <motion.h2
            className="relative mb-5 font-display text-4xl tracking-tight sm:text-5xl md:text-6xl"
            initial={initialIfMotion(reduceMotion, { opacity: 0, y: 20 })}
            whileInView={animateIfMotion(reduceMotion, { opacity: 1, y: 0 })}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.45, ease: LANDING_EASE }}
          >
            <span className="text-outline">{LANDING_CONTENT.cta.titlePrimary}</span>{' '}
            <span className="gradient-text">{LANDING_CONTENT.cta.titleAccent}</span>
          </motion.h2>

          <motion.p
            className="landing-muted relative mx-auto mb-10 max-w-2xl text-lg leading-relaxed sm:text-xl"
            initial={initialIfMotion(reduceMotion, { opacity: 0, y: 16 })}
            whileInView={animateIfMotion(reduceMotion, { opacity: 1, y: 0 })}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.45, ease: LANDING_EASE }}
          >
            {LANDING_CONTENT.cta.description}
          </motion.p>

          <motion.div
            className="relative mb-7 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={initialIfMotion(reduceMotion, { opacity: 0, y: 16 })}
            whileInView={animateIfMotion(reduceMotion, { opacity: 1, y: 0 })}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.45, ease: LANDING_EASE }}
          >
            <Link href="/studio" className="landing-cta-primary">
              <span className="relative z-10 flex items-center gap-3">
                {LANDING_CONTENT.cta.primaryCta}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </Link>

            <Link href="/presets" className="landing-cta-secondary">
              {LANDING_CONTENT.cta.secondaryCta}
            </Link>
          </motion.div>

          <motion.ul
            className="mb-10 flex flex-wrap justify-center gap-3"
            initial={initialIfMotion(reduceMotion, { opacity: 0, y: 14 })}
            whileInView={animateIfMotion(reduceMotion, { opacity: 1, y: 0 })}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.4, ease: LANDING_EASE }}
            aria-label="Support details"
          >
            {LANDING_CONTENT.cta.supportCopy.map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.12em] text-white/75"
              >
                {item}
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={initialIfMotion(reduceMotion, { opacity: 0, y: 14 })}
            whileInView={animateIfMotion(reduceMotion, { opacity: 1, y: 0 })}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.45, ease: LANDING_EASE }}
          >
            <p className="mb-5 font-body text-xs uppercase tracking-[0.2em] text-white/45">
              {LANDING_CONTENT.cta.socialProofLabel}
            </p>

            <div className="flex items-center justify-center gap-6 sm:gap-10">
              {LANDING_STATS.map((stat) => {
                const Icon = statIconMap[stat.icon];

                return (
                  <div key={stat.label} className="flex flex-col items-center gap-1">
                    <Icon className="mb-1 h-4 w-4 text-white/35" aria-hidden="true" />
                    <span className="font-display text-xl text-white/90 sm:text-2xl">
                      {stat.value}
                    </span>
                    <span className="font-body text-[10px] uppercase tracking-wider text-white/55 sm:text-xs">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
