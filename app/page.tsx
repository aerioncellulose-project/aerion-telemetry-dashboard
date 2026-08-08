'use client';

import { useState, useEffect } from 'react';
import { Activity, Zap, Battery, Thermometer, Sun, Moon, Check } from 'lucide-react';
import { NavPage, ModalType } from '@/lib/types';
import { useAerionData } from '@/hooks/useAerionData';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import DoodleBackground from '@/components/DoodleBackground';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import RollingOdometer from '@/components/RollingOdometer';
import CandlestickChart from '@/components/CandlestickChart';
import DetailModal from '@/components/DetailModal';

// ============================================================================
//  AERION Command Center - Main Dashboard Page
//  Fully integrated with live Supabase telemetry, Light/Dark theme switch,
//  and thematic doodle backgrounds.
// ============================================================================

export default function DashboardPage() {
  const [activePage, setActivePage] = useState<NavPage>('dashboard');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem('aerion-theme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('aerion-theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

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
      <DoodleBackground />
      <Navbar
        activePage={activePage}
        onPageChange={setActivePage}
      />

      {/* Main Content Area - Full width with balanced padding */}
      <main className="pt-20 md:pt-20 pb-24 md:pb-6 px-6 md:px-8 lg:px-12 flex flex-col gap-6 min-h-screen w-full relative z-10">
        {/* Page Header */}
        <header className="flex justify-between items-center mb-1">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">
              {current.title}
            </h2>
            <p className="text-xs font-mono text-slate-600 dark:text-gray-400 font-semibold mt-0.5">{current.subtitle}</p>
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
                valueClassName="text-emerald-700 dark:text-emerald-400 text-glow"
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
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white font-mono tracking-tight flex items-center mb-2">
                  <RollingOdometer value={currentValues.battVoltage.toFixed(2)} />
                  <span className="text-sm text-slate-600 dark:text-gray-400 font-display font-normal unit-text">
                    V
                  </span>
                </h3>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-gray-800/50 rounded-full overflow-hidden">
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
                    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-gray-400 font-bold mb-1">
                      Temp
                    </p>
                    <h3 className="text-xl font-bold text-orange-700 dark:text-orange-400 font-mono flex items-center">
                      <RollingOdometer value={currentValues.liveTemp.toFixed(1)} />
                      <span className="unit-text text-xs">°C</span>
                    </h3>
                  </div>
                  <div className="h-8 w-px bg-slate-300 dark:bg-gray-700" />
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-gray-400 font-bold mb-1">
                      Hum
                    </p>
                    <h3 className="text-xl font-bold text-sky-700 dark:text-sky-400 font-mono flex items-center">
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
                valueClassName="text-emerald-700 dark:text-emerald-400 text-glow"
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
              <div
                className="glass glass-interactive rounded-3xl p-8"
                onClick={() => openModal('env')}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center text-orange-700 dark:text-orange-400">
                    <Thermometer size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-gray-400 font-bold">
                      Ambient Temperature
                    </p>
                    <p className="text-xs text-slate-600 dark:text-gray-400 font-semibold">DHT22 Sensor</p>
                  </div>
                </div>
                <h3 className="text-5xl font-bold text-orange-700 dark:text-orange-400 font-mono tracking-tight flex items-center">
                  <RollingOdometer value={currentValues.liveTemp.toFixed(1)} className="text-5xl" />
                  <span className="text-xl text-slate-600 dark:text-gray-400 font-display font-normal unit-text">
                    °C
                  </span>
                </h3>
              </div>

              <div
                className="glass glass-interactive rounded-3xl p-8"
                onClick={() => openModal('env')}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full border border-sky-500/30 bg-sky-500/10 flex items-center justify-center text-sky-700 dark:text-sky-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
                      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-gray-400 font-bold">
                      Relative Humidity
                    </p>
                    <p className="text-xs text-slate-600 dark:text-gray-400 font-semibold">DHT22 Sensor</p>
                  </div>
                </div>
                <h3 className="text-5xl font-bold text-sky-700 dark:text-sky-400 font-mono tracking-tight flex items-center">
                  <RollingOdometer value={currentValues.liveHum.toFixed(1)} className="text-5xl" />
                  <span className="text-xl text-slate-600 dark:text-gray-400 font-display font-normal unit-text">
                    %RH
                  </span>
                </h3>
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-gray-400 font-bold mb-3">
                Environmental Correlation
              </h3>
              <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-normal">
                High humidity levels directly correlate with increased ionic migration in the
                cellulose matrix, resulting in higher voltage output from the AERION harvesting
                cell. The DHT22 sensor provides ±0.5°C temperature accuracy and ±2-5% humidity
                readings, enabling precise environmental monitoring for energy optimization.
              </p>
            </div>
          </>
        )}

        {/* ============================================
            SETTINGS VIEW (Includes Light Mode Interface)
            ============================================ */}
        {activePage === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme & Appearance */}
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sun className="text-amber-500" size={20} />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Interface Theme
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-400 mb-6 leading-relaxed">
                Choose your preferred visual mode. Switch between the sleek dark command center
                or the crisp, high-contrast light studio mode.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {/* Dark Mode Button */}
                <button
                  type="button"
                  onClick={() => toggleTheme('dark')}
                  className={`
                    relative rounded-2xl p-4 border text-left transition-all duration-300 flex flex-col justify-between
                    ${
                      theme === 'dark'
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-slate-400'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-400">
                      <Moon size={18} />
                    </div>
                    {theme === 'dark' && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-black">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</p>
                    <p className="text-[11px] font-mono text-slate-600 dark:text-gray-400">
                      Command Center
                    </p>
                  </div>
                </button>

                {/* Light Mode Button */}
                <button
                  type="button"
                  onClick={() => toggleTheme('light')}
                  className={`
                    relative rounded-2xl p-4 border text-left transition-all duration-300 flex flex-col justify-between
                    ${
                      theme === 'light'
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-slate-400'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
                      <Sun size={18} />
                    </div>
                    {theme === 'light' && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Light Mode</p>
                    <p className="text-[11px] font-mono text-slate-600 dark:text-gray-400">
                      Clean Studio
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Connection Settings */}
            <div className="glass rounded-3xl p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Connection Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-gray-400 font-bold block mb-1.5">
                    Supabase Realtime Stream
                  </label>
                  <div className="bg-slate-100/90 dark:bg-white/5 rounded-xl px-4 py-3 border border-slate-200 dark:border-white/5 text-sm font-mono text-slate-800 dark:text-gray-300">
                    Active WebSocket Subscription
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-gray-400 font-bold block mb-1.5">
                    Data Stream Mode
                  </label>
                  <div className="bg-slate-100/90 dark:bg-white/5 rounded-xl px-4 py-3 border border-slate-200 dark:border-white/5 text-sm font-mono text-slate-800 dark:text-gray-300">
                    Live Telemetry Ingestion (Pure Database Rows)
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-gray-400 font-bold block mb-1.5">
                    Connection Status
                  </label>
                  <div className="bg-slate-100/90 dark:bg-white/5 rounded-xl px-4 py-3 border border-slate-200 dark:border-white/5 text-sm font-mono">
                    <span
                      className={
                        connectionStatus === 'connected'
                          ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                          : 'text-red-500 font-bold'
                      }
                    >
                      {connectionStatus.toUpperCase()}
                    </span>
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
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                About AERION
              </h3>
              <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed mb-5">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">AERION</span>{' '}
                (Atmospheric Energy Recovery through Ionic-Engineered Cellulose) is an IoT-based
                atmospheric energy harvesting system. It converts ambient moisture gradients into
                electrical energy using cellulose substrates infused with KCl (Potassium Chloride)
                salt.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-100/90 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/5 text-center">
                  <p className="text-[10px] font-mono uppercase text-slate-600 dark:text-gray-400 mb-1 font-bold">
                    Platform
                  </p>
                  <p className="text-sm font-mono text-slate-900 dark:text-white font-bold">ESP32</p>
                </div>
                <div className="bg-slate-100/90 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/5 text-center">
                  <p className="text-[10px] font-mono uppercase text-slate-600 dark:text-gray-400 mb-1 font-bold">
                    Firmware
                  </p>
                  <p className="text-sm font-mono text-slate-900 dark:text-white font-bold">Rev 2.1</p>
                </div>
                <div className="bg-slate-100/90 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/5 text-center">
                  <p className="text-[10px] font-mono uppercase text-slate-600 dark:text-gray-400 mb-1 font-bold">
                    Device
                  </p>
                  <p className="text-sm font-mono text-slate-900 dark:text-white font-bold">
                    ESP32_AERION_01
                  </p>
                </div>
                <div className="bg-slate-100/90 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/5 text-center">
                  <p className="text-[10px] font-mono uppercase text-slate-600 dark:text-gray-400 mb-1 font-bold">
                    Protocol
                  </p>
                  <p className="text-sm font-mono text-slate-900 dark:text-white font-bold">
                    HTTPS REST / Supabase
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Sensor Configuration
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-white/5">
                  <span className="text-sm text-slate-700 dark:text-gray-300">
                    Temperature & Humidity Sensor
                  </span>
                  <span className="text-sm font-mono text-slate-900 dark:text-white font-medium">
                    DHT22 (Pin 4)
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-white/5">
                  <span className="text-sm text-slate-700 dark:text-gray-300">Power Sensor</span>
                  <span className="text-sm font-mono text-slate-900 dark:text-white font-medium">
                    INA219 (I2C 0x40)
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-white/5">
                  <span className="text-sm text-slate-700 dark:text-gray-300">Current Deadband</span>
                  <span className="text-sm font-mono text-slate-900 dark:text-white font-medium">
                    ±0.5 mA
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-white/5">
                  <span className="text-sm text-slate-700 dark:text-gray-300">
                    Full Voltage Threshold
                  </span>
                  <span className="text-sm font-mono text-slate-900 dark:text-white font-medium">
                    4.20 V
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-700 dark:text-gray-300">
                    Sensor Read Interval
                  </span>
                  <span className="text-sm font-mono text-slate-900 dark:text-white font-medium">
                    3000 ms
                  </span>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Supabase Schema Reference
              </h3>
              <pre className="bg-[#0f172a] text-emerald-400 rounded-xl p-4 text-xs font-mono overflow-x-auto shadow-md">
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
