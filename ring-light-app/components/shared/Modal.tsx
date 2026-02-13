'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' as const },
  },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 340,
      damping: 26,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 16,
    transition: { duration: 0.15, ease: 'easeIn' as const },
  },
};

/**
 * Collects all focusable elements inside a container.
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ------------------------------------------------------------------
  // Escape key handler
  // ------------------------------------------------------------------
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    },
    [onClose],
  );

  // ------------------------------------------------------------------
  // Focus trap
  // ------------------------------------------------------------------
  const handleTabKey = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !panelRef.current) return;

    const focusable = getFocusableElements(panelRef.current);
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  // ------------------------------------------------------------------
  // Side-effects: lock scroll, attach listeners, manage focus
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;

    // Remember the element that opened the modal so we can restore focus later.
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // Prevent body scroll while the modal is open.
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Attach key listeners.
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleTabKey);

    // Move focus into the panel on next tick (after framer-motion renders).
    const raf = requestAnimationFrame(() => {
      if (panelRef.current) {
        const focusable = getFocusableElements(panelRef.current);
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          panelRef.current.focus();
        }
      }
    });

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleTabKey);
      cancelAnimationFrame(raf);

      // Restore focus to the previously-focused element.
      previousFocusRef.current?.focus();
    };
  }, [isOpen, handleKeyDown, handleTabKey]);

  // ------------------------------------------------------------------
  // Backdrop click handler
  // ------------------------------------------------------------------
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only close when clicking the backdrop itself, not its children.
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
          aria-label={title ?? 'Dialog'}
        >
          <motion.div
            key="modal-panel"
            ref={panelRef}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            tabIndex={-1}
            className="glass-panel relative w-full max-w-lg overflow-hidden outline-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
              {title && (
                <h2 className="font-display text-lg tracking-tight text-white">
                  {title}
                </h2>
              )}

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={onClose}
                className="ml-auto inline-flex items-center justify-center rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white"
                aria-label="Close dialog"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
