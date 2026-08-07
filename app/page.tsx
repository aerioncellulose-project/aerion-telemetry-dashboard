'use client';

import { useState } from 'react';
import { Activity, Zap, Battery, Thermometer } from 'lucide-react';
import { NavPage, ModalType } from '@/lib/types';
import { useAerionData } from '@/hooks/useAerionData';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import RollingOdometer from '@/components/RollingOdometer';
import CandlestickChart from '@/components/CandlestickChart';
import DetailModal from '@/components/DetailModal';

// ============================================================================
//  AERION Command Center - Main Dashboard Page
// ============================================================================

export default function DashboardPage() {
  const [activePage, setActivePage] = useState<NavPage>('dashboard');
  const [modalType, setModalType] = useState<ModalType>(null);

  const {
    candles,
    liveCandle,
    isShifting,
    shiftProgress,
    connectionStatus,
    powerStats,
    currentValues,
    history,
  } = useAerionData();

  const openModal = (type: ModalType) => setModalType(type);
  const closeModal = () => setModalType(null);

  // Page titles
  const pageConfig: Record<NavPage, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard Overview',
      subtitle: 'Real-time monitoring of atmospheric energy harvesting',
    },
    energy: {
      title: 'Energy Analytics',
      subtitle: 'Voltage, current, power, and accumulated energy metrics',
    },
    environment: {
      title: 'Environment Monitor',
      subtitle: 'Temperature and humidity sensor readings from DHT22',
    },
    settings: {
      title: 'System Settings',
      subtitle: 'Configuration and preferences for AERION Command Center',
    },
    information: {
      title: 'System Information',
      subtitle: 'About AERION and technical documentation',
    },
  };

  const current = pageConfig[activePage];

  return (
    <>
      <BackgroundOrbs />
      <Navbar
        activePage={activePage}
        onPageChange={setActivePage}
        connectionStatus={connectionStatus}
      />

      {/* Main Content Area */}
      <main className="pt-20 md:pt-20 pb-24 md:pb-6 px-4 md:px-6 flex flex-col gap-6 min-h-screen max-w-[1600px] mx-auto relative z-10">
        {/* Page Header */}
        <header className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{current.title}</h2>
            <p className="text-xs font-mono text-gray-500">{current.subtitle}</p>
          </div>
        </header>

        {/* ============================================
            DASHBOARD VIEW
            ============================================ */}
        {activePage === 'dashboard' && (
          <>
            {/* Stats Grid - 4 columns on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Energy */}
              <StatCard
                icon={<Activity size={18} />}
                label="Total Energy"
                tag="Total"
                value={currentValues.totalEnergy.toFixed(2)}
                unit="mWh"
                accentColor="emerald"
                valueClassName="text-emerald-400 text-glow"
                onClick={() => openModal('energy')}
              />

              {/* Live Power */}
              <StatCard
                icon={<Zap size={18} />}
                label="Harvesting Power"
                tag="Live"
                value={currentValues.livePower.toFixed(2)}
                unit="mW"
                accentColor="sky"
                onClick={() => openModal('power')}
              />

              {/* Battery Voltage */}
              <StatCard
                icon={<Battery size={18} />}
                label="Battery Voltage"
                tag="Li-Ion"
                value={currentValues.battVoltage.toFixed(2)}
                unit="V"
                accentColor="amber"
                onClick={() => openModal('battery')}
              >
                <h3 className="text-3xl font-bold text-white font-mono tracking-tight flex items-center mb-2">
                  <RollingOdometer value={currentValues.battVoltage.toFixed(2)} />
                  <span className="text-sm text-gray-500 font-display font-normal unit-text">V</span>
                </h3>
                <div className="w-full h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
                  <div
                    className="progress-bar h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                    style={{ width: `${currentValues.battPercent}%` }}
                  />
                </div>
              </StatCard>

              {/* Environment - Temp & Humidity */}
              <StatCard
                icon={<Thermometer size={18} />}
                label=""
                tag="Sensors"
                value=""
                unit=""
                accentColor="orange"
                onClick={() => openModal('env')}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">
                      Temp
                    </p>
                    <h3 className="text-xl font-bold text-orange-400 font-mono flex items-center">
                      <RollingOdometer value={currentValues.liveTemp.toFixed(1)} />
                      <span className="unit-text text-xs">°C</span>
                    </h3>
                  </div>
                  <div className="h-8 w-px bg-gray-700" />
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">
                      Hum
                    </p>
                    <h3 className="text-xl font-bold text-sky-400 font-mono flex items-center">
                      <RollingOdometer value={currentValues.liveHum.toFixed(1)} />
                      <span className="unit-text text-xs">%</span>
                    </h3>
                  </div>
                </div>
              </StatCard>
            </div>

            {/* Candlestick Chart */}
            <CandlestickChart
              candles={candles}
              liveCandle={liveCandle}
              isShifting={isShifting}
              shiftProgress={shiftProgress}
              onClick={() => openModal('chart')}
            />
          </>
        )}

        {/* ============================================
            ENERGY VIEW
            ============================================ */}
        {activePage === 'energy' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<Activity size={18} />}
                label="Total Energy"
                tag="Accumulated"
                value={currentValues.totalEnergy.toFixed(2)}
                unit="mWh"
                accentColor="emerald"
                valueClassName="text-emerald-400 text-glow"
                onClick={() => openModal('energy')}
              />
              <StatCard
                icon={<Zap size={18} />}
                label="Live Power"
                tag="Instantaneous"
                value={currentValues.livePower.toFixed(2)}
                unit="mW"
                accentColor="sky"
                onClick={() => openModal('power')}
              />
              <StatCard
                icon={<Battery size={18} />}
                label="Bus Voltage"
                tag="INA219"
                value={currentValues.battVoltage.toFixed(3)}
                unit="V"
                accentColor="amber"
                onClick={() => openModal('battery')}
              />
              <StatCard
                icon={<Activity size={18} />}
                label="Bus Current"
                tag="INA219"
                value={currentValues.liveCurrent.toFixed(2)}
                unit="mA"
                accentColor="sky"
                onClick={() => openModal('power')}
              />
            </div>

            <CandlestickChart
              candles={candles}
              liveCandle={liveCandle}
              isShifting={isShifting}
              shiftProgress={shiftProgress}
              onClick={() => openModal('chart')}
            />
          </>
        )}

        {/* ============================================
            ENVIRONMENT VIEW
            ============================================ */}
        {activePage === 'environment' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass glass-interactive rounded-3xl p-8" onClick={() => openModal('env')}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center text-orange-400">
                    <Thermometer size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
                      Ambient Temperature
                    </p>
                    <p className="text-xs text-gray-400">DHT22 Sensor</p>
                  </div>
                </div>
                <h3 className="text-5xl font-bold text-orange-400 font-mono tracking-tight flex items-center">
                  <RollingOdometer value={currentValues.liveTemp.toFixed(1)} className="text-5xl" />
                  <span className="text-xl text-gray-500 font-display font-normal unit-text">°C</span>
                </h3>
              </div>

              <div className="glass glass-interactive rounded-3xl p-8" onClick={() => openModal('env')}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full border border-sky-500/30 bg-sky-500/10 flex items-center justify-center text-sky-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
                      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
                      Relative Humidity
                    </p>
                    <p className="text-xs text-gray-400">DHT22 Sensor</p>
                  </div>
                </div>
                <h3 className="text-5xl font-bold text-sky-400 font-mono tracking-tight flex items-center">
                  <RollingOdometer value={currentValues.liveHum.toFixed(1)} className="text-5xl" />
                  <span className="text-xl text-gray-500 font-display font-normal unit-text">%RH</span>
                </h3>
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-4">
                Environmental Correlation
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                High humidity levels directly correlate with increased ionic migration in the
                cellulose matrix, resulting in higher voltage output from the AERION harvesting
                cell. The DHT22 sensor provides ±0.5°C temperature accuracy and ±2-5% humidity
                readings, enabling precise environmental monitoring for energy optimization.
              </p>
            </div>
          </>
        )}

        {/* ============================================
            SETTINGS VIEW
            ============================================ */}
        {activePage === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-3xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">Connection Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block mb-2">
                    Supabase Project URL
                  </label>
                  <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5 text-sm font-mono text-gray-400">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured'}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block mb-2">
                    Refresh Interval
                  </label>
                  <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5 text-sm font-mono text-gray-400">
                    2000ms (Realtime via WebSocket)
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block mb-2">
                    Connection Status
                  </label>
                  <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5 text-sm font-mono">
                    <span className={connectionStatus === 'connected' ? 'text-emerald-400' : connectionStatus === 'demo' ? 'text-amber-400' : 'text-red-400'}>
                      {connectionStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">Display Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block mb-2">
                    Chart Visible Candles
                  </label>
                  <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5 text-sm font-mono text-gray-400">
                    25 candles
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block mb-2">
                    Data History Buffer
                  </label>
                  <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5 text-sm font-mono text-gray-400">
                    50 rows (last {history.length} loaded)
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block mb-2">
                    Theme
                  </label>
                  <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5 text-sm font-mono text-emerald-400">
                    Dark Command Center
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================
            INFORMATION VIEW
            ============================================ */}
        {activePage === 'information' && (
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">About AERION</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                <span className="text-emerald-400 font-bold">AERION</span> (Atmospheric Energy Recovery through
                Ionic-Engineered Cellulose) is an IoT-based atmospheric energy harvesting system.
                It converts ambient moisture gradients into electrical energy using cellulose
                substrates infused with KCl (Potassium Chloride) salt.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-center">
                  <p className="text-[10px] font-mono uppercase text-gray-500 mb-1">Platform</p>
                  <p className="text-sm font-mono text-white">ESP32</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-center">
                  <p className="text-[10px] font-mono uppercase text-gray-500 mb-1">Firmware</p>
                  <p className="text-sm font-mono text-white">Rev 2.1</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-center">
                  <p className="text-[10px] font-mono uppercase text-gray-500 mb-1">Device</p>
                  <p className="text-sm font-mono text-white">ESP32_AERION_01</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-center">
                  <p className="text-[10px] font-mono uppercase text-gray-500 mb-1">Protocol</p>
                  <p className="text-sm font-mono text-white">MQTT → Supabase</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">Sensor Configuration</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-gray-400">Temperature Sensor</span>
                  <span className="text-sm font-mono text-white">DHT22 (Pin 4)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-gray-400">Power Sensor</span>
                  <span className="text-sm font-mono text-white">INA219 (I2C 0x40)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-gray-400">Current Deadband</span>
                  <span className="text-sm font-mono text-white">±0.5 mA</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-gray-400">Full Voltage Threshold</span>
                  <span className="text-sm font-mono text-white">4.20 V</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">Sensor Read Interval</span>
                  <span className="text-sm font-mono text-white">3000 ms</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">Supabase Schema Reference</h3>
              <pre className="bg-black/50 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto">
{`CREATE TABLE telemetry (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  temperature FLOAT,
  humidity FLOAT,
  voltage FLOAT,
  current FLOAT,
  power FLOAT,
  total_energy FLOAT,
  status TEXT
);`}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <DetailModal
        isOpen={modalType !== null}
        type={modalType}
        onClose={closeModal}
        powerStats={powerStats}
        currentValues={currentValues}
        historyCount={history.length}
      />
    </>
  );
}
