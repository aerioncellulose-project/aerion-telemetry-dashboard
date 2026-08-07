'use client';

import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Zap,
  Droplets,
  Settings,
  Info,
} from 'lucide-react';
import { NavPage, ConnectionStatus } from '@/lib/types';
import SystemUptime from './SystemUptime';
import LiveIndicator from './LiveIndicator';

// ============================================================================
//  Navbar - Horizontal Top Bar with Framer Motion sliding pill
//  Desktop: Full top bar with centered nav + sliding pill animation
//  Mobile: Simplified top bar + fixed bottom navigation
// ============================================================================

interface NavbarProps {
  activePage: NavPage;
  onPageChange: (page: NavPage) => void;
  connectionStatus: ConnectionStatus;
}

const navItems: { id: NavPage; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'energy', label: 'Energy', icon: Zap },
  { id: 'environment', label: 'Environment', icon: Droplets },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'information', label: 'Information', icon: Info },
];

export default function Navbar({ activePage, onPageChange, connectionStatus }: NavbarProps) {
  return (
    <>
      {/* ============================================
          DESKTOP TOP BAR (hidden on mobile)
          ============================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="bg-[#080808]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
            {/* LEFT: Logo + Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center rounded-xl text-white font-bold text-lg shadow-lg shadow-emerald-500/30">
                A
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight gradient-text leading-none">
                  AERION
                </h1>
                <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                  Live Telemetry
                </p>
              </div>
            </div>

            {/* CENTER: Navigation with sliding pill */}
            <nav className="flex items-center gap-1 relative">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`
                      relative px-4 py-2 rounded-xl text-sm font-medium
                      transition-colors duration-200 z-10
                      ${isActive ? 'text-emerald-400' : 'text-gray-400 hover:text-gray-200'}
                    `}
                  >
                    {/* Sliding pill background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 rounded-xl nav-pill-bg"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon size={16} />
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* RIGHT: Uptime + Live Status */}
            <div className="flex items-center gap-4">
              <SystemUptime />
              <LiveIndicator status={connectionStatus} />
            </div>
          </div>
        </div>
      </header>

      {/* ============================================
          MOBILE TOP BAR (visible only on mobile)
          ============================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-[#080808]/90 backdrop-blur-xl border-b border-white/5">
          <div className="px-4 h-14 flex items-center justify-between">
            {/* Logo + Title */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center rounded-lg text-white font-bold text-sm shadow-lg shadow-emerald-500/30">
                A
              </div>
              <div>
                <h1 className="text-sm font-bold gradient-text leading-none">AERION</h1>
                <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                  Command Center
                </p>
              </div>
            </div>

            {/* Live Indicator */}
            <LiveIndicator status={connectionStatus} />
          </div>
        </div>
      </header>

      {/* ============================================
          MOBILE BOTTOM NAV (visible only on mobile)
          ============================================ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-[#080808]/90 backdrop-blur-xl border-t border-white/5 bottom-nav-safe">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className="flex flex-col items-center gap-1 relative py-2 px-3"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeMobileNavPill"
                      className="absolute -top-0.5 w-8 h-1 rounded-full bg-emerald-500"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <motion.div
                    animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon
                      size={20}
                      className={isActive ? 'text-emerald-400' : 'text-gray-500'}
                    />
                  </motion.div>
                  <span
                    className={`text-[10px] font-medium ${
                      isActive ? 'text-emerald-400' : 'text-gray-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
