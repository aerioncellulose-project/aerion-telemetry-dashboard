'use client';

import Image from 'next/image';
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
//  Navbar - Horizontal Top Bar with Official SVG Logo & Light/Dark styling
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
        <div className="bg-[#080808]/85 dark:bg-[#080808]/85 bg-white/85 backdrop-blur-xl border-b border-white/5 dark:border-white/5 border-slate-200/80 transition-colors duration-300">
          <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
            {/* LEFT: Official Logo + Title */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onPageChange('dashboard')}>
              <Image
                src="/logo.svg"
                alt="AERION Logo"
                width={40}
                height={40}
                priority
                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-transform hover:scale-105"
              />
              <div>
                <h1 className="text-base font-bold tracking-tight gradient-text leading-none">
                  AERION
                </h1>
                <p className="text-[9px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">
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
                      ${
                        isActive
                          ? 'text-emerald-500 dark:text-emerald-400'
                          : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
                      }
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
        <div className="bg-[#080808]/90 dark:bg-[#080808]/90 bg-white/90 backdrop-blur-xl border-b border-white/5 dark:border-white/5 border-slate-200/80 transition-colors duration-300">
          <div className="px-4 h-14 flex items-center justify-between">
            {/* Logo + Title */}
            <div className="flex items-center gap-2" onClick={() => onPageChange('dashboard')}>
              <Image
                src="/logo.svg"
                alt="AERION Logo"
                width={32}
                height={32}
                priority
                className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              />
              <div>
                <h1 className="text-sm font-bold gradient-text leading-none">AERION</h1>
                <p className="text-[8px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">
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
        <div className="bg-[#080808]/90 dark:bg-[#080808]/90 bg-white/90 backdrop-blur-xl border-t border-white/5 dark:border-white/5 border-slate-200/80 bottom-nav-safe transition-colors duration-300">
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
                      className={
                        isActive
                          ? 'text-emerald-500 dark:text-emerald-400'
                          : 'text-slate-400 dark:text-gray-500'
                      }
                    />
                  </motion.div>
                  <span
                    className={`text-[10px] font-medium ${
                      isActive
                        ? 'text-emerald-500 dark:text-emerald-400'
                        : 'text-slate-400 dark:text-gray-500'
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
