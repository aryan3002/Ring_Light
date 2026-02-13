'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface CustomCursorProps {
  enabled?: boolean;
}

export default function CustomCursor({ enabled = true }: CustomCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Trailing dot with spring physics for smooth follow
  const trailX = useSpring(cursorX, { stiffness: 300, damping: 28, mass: 0.5 });
  const trailY = useSpring(cursorY, { stiffness: 300, damping: 28, mass: 0.5 });

  const rafRef = useRef<number>();

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
    };
    checkTouch();
    window.addEventListener('pointerdown', checkTouch, { once: true });
    return () => window.removeEventListener('pointerdown', checkTouch);
  }, []);


  // Track hover states on interactive elements
  useEffect(() => {
    if (isTouchDevice || !enabled) return;

    const handleMouseEnterInteractive = () => setIsHovering(true);
    const handleMouseLeaveInteractive = () => setIsHovering(false);

    const interactiveSelector = 'a, button, input, select, textarea, [role="button"], [tabindex]';

    const addListeners = () => {
      const elements = document.querySelectorAll(interactiveSelector);
      elements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnterInteractive);
        el.addEventListener('mouseleave', handleMouseLeaveInteractive);
      });
      return elements;
    };

    const elements = addListeners();

    // Observe DOM mutations to catch dynamically added elements
    const observer = new MutationObserver(() => {
      // Clean up old listeners
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnterInteractive);
        el.removeEventListener('mouseleave', handleMouseLeaveInteractive);
      });
      addListeners();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnterInteractive);
        el.removeEventListener('mouseleave', handleMouseLeaveInteractive);
      });
      observer.disconnect();
    };
  }, [isTouchDevice, enabled]);

  // Add/remove mouse tracking
  useEffect(() => {
    if (isTouchDevice || !enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const handleMoveOut = () => setIsVisible(false);

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMoveOut);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMoveOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isTouchDevice, enabled, cursorX, cursorY]);

  // Hide default cursor via style injection
  useEffect(() => {
    if (isTouchDevice || !enabled) return;

    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('custom-cursor-style');
      if (existingStyle) existingStyle.remove();
    };
  }, [isTouchDevice, enabled]);

  // Don't render on touch devices or when disabled
  if (isTouchDevice || !enabled) return null;

  return (
    <>
      {/* Main Cursor Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 40 : 20,
          height: isHovering ? 40 : 20,
          opacity: isVisible ? 1 : 0,
          borderWidth: isHovering ? 3 : 2,
        }}
        transition={{
          width: { type: 'spring', stiffness: 400, damping: 25 },
          height: { type: 'spring', stiffness: 400, damping: 25 },
          opacity: { duration: 0.15 },
        }}
        aria-hidden="true"
      >
        <div
          className="w-full h-full rounded-full border-[#FF006E]"
          style={{
            borderStyle: 'solid',
            borderWidth: 'inherit',
            borderColor: '#FF006E',
            boxShadow: isHovering
              ? '0 0 15px rgba(255, 0, 110, 0.4), inset 0 0 8px rgba(255, 0, 110, 0.1)'
              : '0 0 8px rgba(255, 0, 110, 0.2)',
            mixBlendMode: 'difference',
          }}
        />
      </motion.div>

      {/* Trailing Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 4 : 8,
          height: isHovering ? 4 : 8,
          opacity: isVisible ? 0.9 : 0,
        }}
        transition={{
          opacity: { duration: 0.15 },
        }}
        aria-hidden="true"
      >
        <div
          className="w-full h-full rounded-full bg-[#FF006E]"
          style={{
            boxShadow: '0 0 6px rgba(255, 0, 110, 0.6)',
          }}
        />
      </motion.div>
    </>
  );
}
