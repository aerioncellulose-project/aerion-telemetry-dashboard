'use client';

import { ReactNode } from 'react';
import RollingOdometer from './RollingOdometer';

// ============================================================================
//  StatCard - Glassmorphism metric card with rolling odometer value
// ============================================================================

interface StatCardProps {
  icon: ReactNode;
  label: string;
  tag: string;
  value: string;
  unit: string;
  accentColor: 'emerald' | 'sky' | 'amber' | 'orange' | 'red';
  valueClassName?: string;
  onClick?: () => void;
  children?: ReactNode;
}

const accentMap = {
  emerald: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500 dark:text-emerald-400',
  },
  sky: {
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/10',
    text: 'text-sky-500 dark:text-sky-400',
  },
  amber: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-500 dark:text-amber-400',
  },
  orange: {
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/10',
    text: 'text-orange-500 dark:text-orange-400',
  },
  red: {
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
    text: 'text-red-500 dark:text-red-400',
  },
};

export default function StatCard({
  icon,
  label,
  tag,
  value,
  unit,
  accentColor,
  valueClassName = 'dark:text-white text-slate-900',
  onClick,
  children,
}: StatCardProps) {
  const accent = accentMap[accentColor];

  return (
    <div
      className="glass glass-interactive rounded-3xl p-6"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
    >
      {/* Header: Icon + Tag */}
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-10 h-10 rounded-full border ${accent.border} ${accent.bg} flex items-center justify-center ${accent.text}`}
        >
          {icon}
        </div>
        <span className="text-xs font-mono dark:text-gray-500 text-slate-500 uppercase">{tag}</span>
      </div>

      {/* Label */}
      {label && (
        <p className="text-[10px] font-mono uppercase tracking-widest dark:text-gray-500 text-slate-500 mb-2">
          {label}
        </p>
      )}

      {/* Value with Odometer */}
      {!children && (
        <h3
          className={`text-3xl font-bold font-mono tracking-tight flex items-center ${valueClassName}`}
        >
          <RollingOdometer value={value} />
          <span className="text-sm dark:text-gray-500 text-slate-500 font-display font-normal unit-text">
            {unit}
          </span>
        </h3>
      )}

      {/* Custom children */}
      {children}
    </div>
  );
}
