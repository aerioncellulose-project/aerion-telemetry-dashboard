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
    text: 'text-emerald-400',
  },
  sky: {
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
  },
  amber: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
  },
  orange: {
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
  },
  red: {
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
  },
};

export default function StatCard({
  icon,
  label,
  tag,
  value,
  unit,
  accentColor,
  valueClassName = 'text-white',
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
        <span className="text-xs font-mono text-gray-500 uppercase">{tag}</span>
      </div>

      {/* Label */}
      <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">
        {label}
      </p>

      {/* Value with Odometer */}
      {!children && (
        <h3
          className={`text-3xl font-bold font-mono tracking-tight flex items-center ${valueClassName}`}
        >
          <RollingOdometer value={value} />
          <span className="text-sm text-gray-500 font-display font-normal unit-text">
            {unit}
          </span>
        </h3>
      )}

      {/* Custom children (for environment card dual layout, battery bar, etc.) */}
      {children}
    </div>
  );
}
