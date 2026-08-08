'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ModalType, TelemetryStats } from '@/lib/types';

// ============================================================================
//  DetailModal - Framer Motion animated detail/analytics modal
//  Supports Light & Dark mode themes
// ============================================================================

interface DetailModalProps {
  isOpen: boolean;
  type: ModalType;
  onClose: () => void;
  powerStats: TelemetryStats;
  currentValues: {
    totalEnergy: number;
    battVoltage: number;
    liveCurrent: number;
    battPercent: number;
    liveTemp: number;
    liveHum: number;
  };
  historyCount: number;
}

export default function DetailModal({
  isOpen,
  type,
  onClose,
  powerStats,
  currentValues,
  historyCount,
}: DetailModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const getModalContent = () => {
    switch (type) {
      case 'chart':
      case 'power':
        return {
          label: 'Energy Flow Statistics',
          title: 'Harvesting Power Analytics',
          body: (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="dark:bg-white/5 bg-slate-100 rounded-xl p-4 border dark:border-white/5 border-slate-200">
                  <p className="text-[10px] font-mono uppercase dark:text-gray-500 text-slate-500 mb-1">
                    Minimum
                  </p>
                  <p className="text-2xl font-bold text-red-500 dark:text-red-400 font-mono">
                    {powerStats.min.toFixed(2)}
                    <span className="text-xs dark:text-gray-500 text-slate-500"> mW</span>
                  </p>
                </div>
                <div className="dark:bg-white/5 bg-slate-100 rounded-xl p-4 border dark:border-white/5 border-slate-200">
                  <p className="text-[10px] font-mono uppercase dark:text-gray-500 text-slate-500 mb-1">
                    Average
                  </p>
                  <p className="text-2xl font-bold text-sky-500 dark:text-sky-400 font-mono">
                    {powerStats.avg.toFixed(2)}
                    <span className="text-xs dark:text-gray-500 text-slate-500"> mW</span>
                  </p>
                </div>
                <div className="dark:bg-white/5 bg-slate-100 rounded-xl p-4 border dark:border-white/5 border-slate-200">
                  <p className="text-[10px] font-mono uppercase dark:text-gray-500 text-slate-500 mb-1">
                    Maximum
                  </p>
                  <p className="text-2xl font-bold text-emerald-500 dark:text-emerald-400 font-mono">
                    {powerStats.max.toFixed(2)}
                    <span className="text-xs dark:text-gray-500 text-slate-500"> mW</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 dark:bg-white/5 bg-slate-100 rounded-xl p-4 border dark:border-white/5 border-slate-200">
                <p className="text-xs dark:text-gray-400 text-slate-600 leading-relaxed">
                  Data represents the last {historyCount} live telemetry polling intervals. The live
                  candlestick continuously updates from real-time voltage and current readings from
                  the INA219 sensor.
                </p>
              </div>
            </>
          ),
        };

      case 'energy':
        return {
          label: 'Accumulated Energy',
          title: 'Total Harvested Energy',
          body: (
            <>
              <div className="dark:bg-white/5 bg-slate-100 rounded-xl p-4 border dark:border-white/5 border-slate-200 mb-4">
                <p className="text-[10px] font-mono uppercase dark:text-gray-500 text-slate-500 mb-2">
                  Current Total
                </p>
                <p className="text-4xl font-bold text-emerald-500 dark:text-emerald-400 text-glow font-mono">
                  {currentValues.totalEnergy.toFixed(2)}{' '}
                  <span className="text-lg dark:text-gray-500 text-slate-500">mWh</span>
                </p>
              </div>
              <div className="space-y-2 text-sm dark:text-gray-400 text-slate-600">
                <div className="flex justify-between">
                  <span>Energy Collected Today:</span>
                  <span className="font-mono dark:text-white text-slate-900 font-bold">
                    {(currentValues.totalEnergy * 0.1).toFixed(2)} mWh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Charge Cycles Contributed:</span>
                  <span className="font-mono dark:text-white text-slate-900 font-bold">
                    0.0042
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Material Status:</span>
                  <span className="font-mono text-emerald-500 dark:text-emerald-400 font-bold">
                    KCl Active
                  </span>
                </div>
              </div>
            </>
          ),
        };

      case 'battery':
        return {
          label: 'Battery Telemetry',
          title: 'Li-Ion 18650 Status',
          body: (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="dark:bg-white/5 bg-slate-100 rounded-xl p-4 border dark:border-white/5 border-slate-200">
                  <p className="text-[10px] font-mono uppercase dark:text-gray-500 text-slate-500 mb-1">
                    Voltage
                  </p>
                  <p className="text-xl font-bold dark:text-white text-slate-900 font-mono">
                    {currentValues.battVoltage.toFixed(2)} V
                  </p>
                </div>
                <div className="dark:bg-white/5 bg-slate-100 rounded-xl p-4 border dark:border-white/5 border-slate-200">
                  <p className="text-[10px] font-mono uppercase dark:text-gray-500 text-slate-500 mb-1">
                    Current
                  </p>
                  <p className="text-xl font-bold dark:text-white text-slate-900 font-mono">
                    {currentValues.liveCurrent.toFixed(2)} mA
                  </p>
                </div>
              </div>
              <div className="dark:bg-white/5 bg-slate-100 rounded-xl p-4 border dark:border-white/5 border-slate-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="dark:text-gray-400 text-slate-600">Charge Level</span>
                  <span className="font-mono text-emerald-500 dark:text-emerald-400 font-bold">
                    {currentValues.battPercent.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-3 dark:bg-gray-800 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 progress-bar"
                    style={{ width: `${currentValues.battPercent}%` }}
                  />
                </div>
                <p className="text-xs dark:text-gray-500 text-slate-500 mt-3">
                  Protected by TP4056 module. Overcharge protection active at 4.20V.
                </p>
              </div>
            </>
          ),
        };

      case 'env':
        return {
          label: 'Environment Data',
          title: 'Sensor Readings (DHT22)',
          body: (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="dark:bg-white/5 bg-slate-100 rounded-xl p-4 border dark:border-white/5 border-slate-200 text-center">
                  <p className="text-[10px] font-mono uppercase dark:text-gray-500 text-slate-500 mb-2">
                    Temperature
                  </p>
                  <p className="text-3xl font-bold text-orange-500 dark:text-orange-400 font-mono">
                    {currentValues.liveTemp.toFixed(1)}°C
                  </p>
                </div>
                <div className="dark:bg-white/5 bg-slate-100 rounded-xl p-4 border dark:border-white/5 border-slate-200 text-center">
                  <p className="text-[10px] font-mono uppercase dark:text-gray-500 text-slate-500 mb-2">
                    Humidity
                  </p>
                  <p className="text-3xl font-bold text-sky-500 dark:text-sky-400 font-mono">
                    {currentValues.liveHum.toFixed(1)}%
                  </p>
                </div>
              </div>
              <p className="text-xs dark:text-gray-400 text-slate-600 mt-4 leading-relaxed">
                High humidity levels directly correlate with increased ionic migration in the
                cellulose matrix, resulting in higher voltage output.
              </p>
            </>
          ),
        };

      default:
        return { label: '', title: '', body: null };
    }
  };

  const content = getModalContent();

  return (
    <AnimatePresence>
      {isOpen && type && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="glass rounded-3xl p-8 max-w-lg w-full"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-500 dark:text-emerald-400 mb-2 font-bold">
                  {content.label}
                </p>
                <h2 className="text-2xl font-bold dark:text-white text-slate-900 tracking-tight">
                  {content.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="dark:text-gray-400 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors p-1"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4">{content.body}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
