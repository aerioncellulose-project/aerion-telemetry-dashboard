'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ModalType, TelemetryStats } from '@/lib/types';

// ============================================================================
//  DetailModal - Framer Motion animated detail/analytics modal
//  Replicates the reference HTML's modal with Min/Max/Avg analytics
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
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] font-mono uppercase text-gray-500 mb-1">Minimum</p>
                  <p className="text-2xl font-bold text-red-400 font-mono">
                    {powerStats.min.toFixed(2)}
                    <span className="text-xs text-gray-500"> mW</span>
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] font-mono uppercase text-gray-500 mb-1">Average</p>
                  <p className="text-2xl font-bold text-sky-400 font-mono">
                    {powerStats.avg.toFixed(2)}
                    <span className="text-xs text-gray-500"> mW</span>
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] font-mono uppercase text-gray-500 mb-1">Maximum</p>
                  <p className="text-2xl font-bold text-emerald-400 font-mono">
                    {powerStats.max.toFixed(2)}
                    <span className="text-xs text-gray-500"> mW</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Data represents the last {historyCount} polling intervals (2s each). 
                  The live candlestick continuously forms based on real-time voltage and 
                  current readings from the INA219 sensor.
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
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
                <p className="text-[10px] font-mono uppercase text-gray-500 mb-2">Current Total</p>
                <p className="text-4xl font-bold text-emerald-400 text-glow font-mono">
                  {currentValues.totalEnergy.toFixed(2)}{' '}
                  <span className="text-lg text-gray-500">mWh</span>
                </p>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Energy Collected Today:</span>
                  <span className="font-mono text-white">
                    {(currentValues.totalEnergy * 0.1).toFixed(2)} mWh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Charge Cycles Contributed:</span>
                  <span className="font-mono text-white">0.0042</span>
                </div>
                <div className="flex justify-between">
                  <span>Material Status:</span>
                  <span className="font-mono text-emerald-400">KCl Active</span>
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
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] font-mono uppercase text-gray-500 mb-1">Voltage</p>
                  <p className="text-xl font-bold text-white font-mono">
                    {currentValues.battVoltage.toFixed(2)} V
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] font-mono uppercase text-gray-500 mb-1">Current</p>
                  <p className="text-xl font-bold text-white font-mono">
                    {currentValues.liveCurrent.toFixed(2)} mA
                  </p>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Charge Level</span>
                  <span className="font-mono text-emerald-400">
                    {currentValues.battPercent.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 progress-bar"
                    style={{ width: `${currentValues.battPercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3">
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
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-center">
                  <p className="text-[10px] font-mono uppercase text-gray-500 mb-2">Temperature</p>
                  <p className="text-3xl font-bold text-orange-400 font-mono">
                    {currentValues.liveTemp.toFixed(1)}°C
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-center">
                  <p className="text-[10px] font-mono uppercase text-gray-500 mb-2">Humidity</p>
                  <p className="text-3xl font-bold text-sky-400 font-mono">
                    {currentValues.liveHum.toFixed(1)}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4 leading-relaxed">
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
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
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
                <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-2">
                  {content.label}
                </p>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {content.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors p-1"
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
