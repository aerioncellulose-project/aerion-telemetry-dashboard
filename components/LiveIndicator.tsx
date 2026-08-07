'use client';

import { ConnectionStatus } from '@/lib/types';

// ============================================================================
//  LiveIndicator - Pulsing status dot with connection label
// ============================================================================

interface LiveIndicatorProps {
  status: ConnectionStatus;
}

export default function LiveIndicator({ status }: LiveIndicatorProps) {
  if (status === 'demo') return null;
  const config = {
    connecting: {
      dotClass: 'bg-amber-500 pulse-dot-amber',
      label: 'CONNECTING...',
      labelClass: 'text-amber-400',
    },
    connected: {
      dotClass: 'bg-emerald-500 pulse-dot',
      label: 'SUPABASE LIVE',
      labelClass: 'text-emerald-400',
    },
    disconnected: {
      dotClass: 'bg-red-500 pulse-dot-red',
      label: 'OFFLINE',
      labelClass: 'text-red-400',
    },
    demo: {
      dotClass: 'bg-emerald-500 pulse-dot',
      label: 'DEMO MODE',
      labelClass: 'text-emerald-400',
    },
  };

  const c = config[status];

  return (
    <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${c.dotClass}`} />
      <span className={`text-xs font-mono ${c.labelClass}`}>{c.label}</span>
    </div>
  );
}
