'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Palette, Sparkles } from 'lucide-react';
import { LANDING_CONTENT } from '@/lib/landingContent';
import { LANDING_EASE, animateIfMotion, initialIfMotion } from '@/lib/motion';

const introVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: LANDING_EASE,
    },
  },
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ['0%', '0%'] : ['0%', '14%']
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24"
      aria-label="Hero"
    >
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
        <div className="hero-gradient absolute inset-0" aria-hidden="true" />

        <svg
          className="absolute inset-0 hidden h-full w-full opacity-[0.04] md:block"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="hero-grid"
              width="64"
              height="64"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 64 0 L 0 0 0 64"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        {!reduceMotion && (
          <motion.div
            className="absolute left-[10%] top-[18%] hidden h-72 w-72 rounded-full bg-hot-pink/20 blur-3xl md:block"
            animate={{ x: [0, 24, 0], y: [0, -20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        )}
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto max-w-6xl text-center"
        variants={introVariants}
        initial={initialIfMotion(reduceMotion, 'hidden')}
        animate={animateIfMotion(reduceMotion, 'visible')}
      >
        <motion.p
          variants={itemVariants}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/12 bg-dark-surface/70 px-5 py-2.5 font-body text-sm uppercase tracking-[0.2em] text-white/75"
        >
          <Sparkles className="h-4 w-4 text-cyber-yellow" aria-hidden="true" />
          {LANDING_CONTENT.hero.eyebrow}
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="text-outline">{LANDING_CONTENT.hero.titlePrimary}</span>
          <br />
          <span className="gradient-text">{LANDING_CONTENT.hero.titleAccent}</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="landing-muted mx-auto mt-8 max-w-3xl text-lg leading-relaxed sm:text-xl"
        >
          {LANDING_CONTENT.hero.description}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/studio" className="landing-cta-primary">
            <span className="relative z-10 flex items-center gap-2">
              {LANDING_CONTENT.hero.primaryCta}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </span>
            {!reduceMotion && (
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-hot-pink via-cyber-yellow to-hot-pink bg-[length:200%_100%]"
                animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
              />
            )}
          </Link>

          <Link href="/presets" className="landing-cta-secondary">
            <Palette className="h-5 w-5" aria-hidden="true" />
            {LANDING_CONTENT.hero.secondaryCta}
          </Link>
        </motion.div>

        <motion.ul
          variants={itemVariants}
          className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3"
          aria-label="Support details"
        >
          {LANDING_CONTENT.hero.trustPoints.map((item) => (
            <li
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.12em] text-white/75"
            >
              {item}
            </li>
          ))}
        </motion.ul>

        <motion.div
          variants={itemVariants}
          className="mx-auto mt-14 flex h-44 w-44 items-center justify-center rounded-full border border-white/15 bg-dark-surface/70 sm:h-56 sm:w-56"
          aria-hidden="true"
        >
          <div className="relative h-28 w-28 rounded-full border border-white/20 sm:h-36 sm:w-36">
            {!reduceMotion && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-hot-pink/60"
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-cyber-yellow/50 via-hot-pink/25 to-electric-blue/10" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
