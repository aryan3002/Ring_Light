'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children' | 'className'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-hot-pink text-white',
    'hover:shadow-[0_0_24px_rgba(255,0,110,0.45)]',
    'disabled:bg-hot-pink/40 disabled:text-white/50',
  ].join(' '),
  secondary: [
    'bg-transparent text-white border border-white/20',
    'hover:border-white/40 hover:bg-white/[0.04]',
    'disabled:border-white/10 disabled:text-white/30',
  ].join(' '),
  ghost: [
    'bg-transparent text-white/70',
    'hover:bg-white/[0.06] hover:text-white',
    'disabled:text-white/25 disabled:hover:bg-transparent',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
};

const springTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 17,
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel,
  onClick,
  ...motionProps
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      whileHover={disabled ? undefined : { scale: 1.04 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={springTransition}
      className={[
        'inline-flex items-center justify-center font-medium',
        'transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-blue',
        'disabled:pointer-events-none disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
