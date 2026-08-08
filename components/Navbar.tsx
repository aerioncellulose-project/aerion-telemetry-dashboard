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
import { NavPage } from '@/lib/types';
import SystemUptime from './SystemUptime';

// ============================================================================
//  Navbar - Horizontal Top Bar with Official SVG Logo & Light/Dark styling
//  Supabase bar removed and System Uptime positioned to the far right.
// ============================================================================

interface NavbarProps {
  activePage: NavPage;
  onPageChange: (page: NavPage) => void;
}

const navItems: { id: NavPage; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'energy', label: 'Energy', icon: Zap },
  { id: 'environment', label: 'Environment', icon: Droplets },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'information', label: 'Information', icon: Info },
];

export default function Navbar({ activePage, onPageChange }: NavbarProps) {
  return (
    <>
      {/* ============================================
          DESKTOP TOP BAR (hidden on mobile)
          ============================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="bg-white/85 dark:bg-[#080808]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/5 transition-colors duration-300 shadow-sm dark:shadow-none">
          <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
            {/* LEFT: Official Logo + Title */}
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => onPageChange('dashboard')}
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="AERION Logo"
                  width={40}
                  height={40}
                  priority
                  className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-transform hover:scale-105"
                />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight gradient-text leading-none">
                  AERION
                </h1>
                <p className="text-[9px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-widest mt-0.5 font-medium">
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
                      transition-colors duration-200 z-10 select-none
                      ${
                        isActive
                          ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-slate-600 dark:text-gray-400 hover:text-slate-950 dark:hover:text-gray-200'
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

            {/* RIGHT: System Uptime (Rightmost Position) */}
            <div className="flex items-center justify-end">
              <SystemUptime />
            </div>
          </div>
        </div>
      </header>

      {/* ============================================
          MOBILE TOP BAR (visible only on mobile)
          ============================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white/90 dark:bg-[#080808]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/5 transition-colors duration-300 shadow-sm dark:shadow-none">
          <div className="px-4 h-14 flex items-center justify-between">
            {/* Logo + Title */}
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => onPageChange('dashboard')}
            >
              <Image
                src="/logo.svg"
                alt="AERION Logo"
                width={32}
                height={32}
                priority
                className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              />
              <div>
                <h1 className="text-sm font-bold gradient-text leading-none">AERION</h1>
                <p className="text-[8px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-widest font-medium">
                  Command Center
                </p>
              </div>
            </div>

            {/* Compact System Uptime (Rightmost) */}
            <SystemUptime compact />
          </div>
        </div>
      </header>

      {/* ============================================
          MOBILE BOTTOM NAV (visible only on mobile)
          ============================================ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white/90 dark:bg-[#080808]/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/5 bottom-nav-safe transition-colors duration-300 shadow-lg dark:shadow-none">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className="flex flex-col items-center gap-1 relative py-2 px-3 select-none"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeMobileNavPill"
                      className="absolute -top-0.5 w-8 h-1 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"
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
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 dark:text-gray-500'
                      }
                    />
                  </motion.div>
                  <span
                    className={`text-[10px] font-medium ${
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-slate-500 dark:text-gray-400'
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
