'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { LANDING_CONTENT } from '@/lib/landingContent';
import { LANDING_EASE, animateIfMotion, initialIfMotion } from '@/lib/motion';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Studio', href: '/studio' },
  { label: 'Presets', href: '/presets' },
  { label: 'Settings', href: '/settings' },
];

export default function Navigation() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion() ?? false;
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string): boolean => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <motion.nav
      initial={initialIfMotion(reduceMotion, { y: -24, opacity: 0 })}
      animate={animateIfMotion(reduceMotion, { y: 0, opacity: 1 })}
      transition={{ duration: 0.35, ease: LANDING_EASE }}
      className="glass-panel fixed left-0 right-0 top-0 z-50 !rounded-none border-x-0 border-b border-t-0 border-white/[0.1]"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="rounded-md px-1 py-1 font-display text-xl tracking-tight text-white transition-colors hover:text-hot-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-blue"
          >
            {LANDING_CONTENT.brandName}
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-blue ${
                  isActive(link.href)
                    ? 'text-white'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-hot-pink"
                    transition={{ duration: 0.2, ease: LANDING_EASE }}
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-blue md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            type="button"
          >
            {mobileOpen ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={initialIfMotion(reduceMotion, { opacity: 0, height: 0 })}
            animate={animateIfMotion(reduceMotion, { opacity: 1, height: 'auto' })}
            exit={animateIfMotion(reduceMotion, { opacity: 0, height: 0 })}
            transition={{ duration: 0.25, ease: LANDING_EASE }}
            className="overflow-hidden border-t border-white/[0.08] md:hidden"
          >
            <div className="space-y-1 px-4 pb-4 pt-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-blue ${
                    isActive(link.href)
                      ? 'bg-hot-pink/15 text-white'
                      : 'text-white/75 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
