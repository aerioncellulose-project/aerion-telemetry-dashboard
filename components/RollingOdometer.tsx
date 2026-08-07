'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
//  RollingOdometer - Framer Motion Implementation
//  Uses AnimatePresence to slide numbers in and out dynamically.
//  No pre-rendered strips, completely safe from React re-render conflicts.
// ============================================================================

interface RollingOdometerProps {
  value: string;
  className?: string;
}

/**
 * Single Animated Digit using Framer Motion popLayout
 */
const AnimatedDigit = memo(function AnimatedDigit({ char }: { char: string }) {
  return (
    <span className="relative inline-flex items-center justify-center w-[0.7em] h-[1.2em] overflow-hidden align-middle">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.8,
          }}
          className="absolute inset-0 flex items-center justify-center leading-none"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});

/**
 * RollingOdometer parses the string and renders each character.
 */
function RollingOdometer({ value, className = '' }: RollingOdometerProps) {
  // Parse characters and build a stable structure
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (char === '.' || char === ':') {
      elements.push(
        <span className="dot-cell inline-flex items-center justify-center h-[1.2em] w-[0.4em] align-middle" key={`sep-${i}`}>
          {char}
        </span>
      );
    } else if (char === '-' || char === ' ') {
      elements.push(
        <span className="dot-cell inline-flex items-center justify-center h-[1.2em] w-[0.4em] align-middle" key={`static-${i}`}>
          {char}
        </span>
      );
    } else {
      elements.push(
        <AnimatedDigit key={`col-${i}`} char={char} />
      );
    }
  }

  return (
    <div className={`roll-container inline-flex items-center align-bottom font-mono ${className}`} aria-label={value}>
      {elements}
    </div>
  );
}

export default memo(RollingOdometer);
