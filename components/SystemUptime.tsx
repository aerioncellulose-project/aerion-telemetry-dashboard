'use client';

import { useState, useEffect } from 'react';
import RollingOdometer from './RollingOdometer';

// ============================================================================
//  SystemUptime - HH:MM:SS counter using RollingOdometer
// ============================================================================

export default function SystemUptime() {
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

  return (
    <div className="text-right">
      <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
        System Uptime
      </p>
      <div className="text-lg text-white">
        <RollingOdometer value={timeStr} />
      </div>
    </div>
  );
}
