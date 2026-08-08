'use client';

import { useState, useEffect } from 'react';
import RollingOdometer from './RollingOdometer';

// ============================================================================
//  SystemUptime - Telemetry session uptime counter with RollingOdometer
//  Supports Light & Dark mode themes
// ============================================================================

interface SystemUptimeProps {
  compact?: boolean;
}

export default function SystemUptime({ compact = false }: SystemUptimeProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  if (compact) {
    return (
      <div className="flex flex-col items-end">
        <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500 dark:text-gray-400">
          Uptime
        </span>
        <div className="text-xs font-mono font-bold text-slate-900 dark:text-white tracking-wider">
          <RollingOdometer value={timeStr} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 pl-4 py-1 border-l border-slate-200 dark:border-white/10 text-right">
      <div className="flex flex-col items-end">
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-gray-400 leading-tight">
          System Uptime
        </p>
        <div className="text-base font-mono font-bold text-slate-900 dark:text-white tracking-wider flex items-center">
          <RollingOdometer value={timeStr} />
        </div>
      </div>
    </div>
  );
}
