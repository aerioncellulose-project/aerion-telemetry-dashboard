'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { TelemetryRow, CandleData, TelemetryStats, ConnectionStatus } from '@/lib/types';

// ============================================================================
//  useAerionData - Custom hook for Supabase realtime + demo fallback
//  Handles: initial fetch, realtime subscription, demo data generation,
//  candlestick building, and statistics computation.
// ============================================================================

interface AerionDataState {
  latestData: TelemetryRow | null;
  history: TelemetryRow[];
  candles: CandleData[];
  liveCandle: CandleData | null;
  isShifting: boolean;
  shiftProgress: number;
  connectionStatus: ConnectionStatus;
  powerStats: TelemetryStats;
  currentValues: {
    totalEnergy: number;
    livePower: number;
    battVoltage: number;
    liveCurrent: number;
    liveTemp: number;
    liveHum: number;
    battPercent: number;
  };
}

function computeStats(values: number[]): TelemetryStats {
  if (values.length === 0) {
    return { min: 0, max: 0, avg: 0, latest: 0, count: 0 };
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return { min, max, avg, latest: values[values.length - 1], count: values.length };
}

export function useAerionData(): AerionDataState {
  const [history, setHistory] = useState<TelemetryRow[]>([]);
  const [latestData, setLatestData] = useState<TelemetryRow | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  // Candlestick state
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [liveCandle, setLiveCandle] = useState<CandleData | null>(null);
  const [isShifting, setIsShifting] = useState(false);
  const [shiftProgress, setShiftProgress] = useState(0);

  // Simulation state (demo mode)
  const phaseRef = useRef(0);
  const livePowerSimRef = useRef(50);
  const totalEnergyRef = useRef(145.20);
  const animFrameRef = useRef<number>(0);
  const shiftingRef = useRef(false);
  const shiftIndexRef = useRef(0);
  const candlesRef = useRef<CandleData[]>([]);
  const liveCandleRef = useRef<CandleData | null>(null);

  // Current values for display
  const [currentValues, setCurrentValues] = useState({
    totalEnergy: 145.20,
    livePower: 0,
    battVoltage: 3.5,
    liveCurrent: 0,
    liveTemp: 28.0,
    liveHum: 65.0,
    battPercent: 0,
  });

  // Power stats
  const [powerStats, setPowerStats] = useState<TelemetryStats>({
    min: 0,
    max: 0,
    avg: 0,
    latest: 0,
    count: 0,
  });

  // =============================================
  // SUPABASE MODE
  // =============================================
  const initSupabase = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setConnectionStatus('demo');
      return false;
    }

    try {
      setConnectionStatus('connecting');

      // Fetch last 25 rows
      const { data, error } = await supabase
        .from('telemetry')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(25);

      if (error) {
        console.error('[AERION] Supabase fetch error:', error);
        setConnectionStatus('demo');
        return false;
      }

      if (data && data.length > 0) {
        setHistory(data);
        setLatestData(data[data.length - 1]);

        // Build candles from power values
        const powerCandles = data.map((row) => {
          const p = row.power || 50;
          return { o: p, c: p, h: p, l: p };
        });
        // Pad to 25 if needed
        while (powerCandles.length < 25) {
          powerCandles.unshift({ o: 50, c: 50, h: 50, l: 50 });
        }
        setCandles(powerCandles);
        candlesRef.current = powerCandles;

        // Set current values from latest
        const latest = data[data.length - 1];
        setCurrentValues({
          totalEnergy: latest.total_energy || 0,
          livePower: latest.power || 0,
          battVoltage: latest.voltage || 0,
          liveCurrent: latest.current || 0,
          liveTemp: latest.temperature || 0,
          liveHum: latest.humidity || 0,
          battPercent: Math.max(0, Math.min(100, ((latest.voltage - 3.0) / 1.2) * 100)),
        });
        totalEnergyRef.current = latest.total_energy || 0;

        // Compute power stats
        const powerValues = data.map((r) => r.power || 0);
        setPowerStats(computeStats(powerValues));
      }

      // Subscribe to realtime
      const channel = supabase
        .channel('telemetry-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'telemetry',
          },
          (payload) => {
            const newRow = payload.new as TelemetryRow;

            setHistory((prev) => {
              const updated = [...prev, newRow].slice(-50);
              // Update power stats
              const powerValues = updated.map((r) => r.power || 0);
              setPowerStats(computeStats(powerValues));
              return updated;
            });

            setLatestData(newRow);

            // Update current values
            setCurrentValues({
              totalEnergy: newRow.total_energy || 0,
              livePower: newRow.power || 0,
              battVoltage: newRow.voltage || 0,
              liveCurrent: newRow.current || 0,
              liveTemp: newRow.temperature || 0,
              liveHum: newRow.humidity || 0,
              battPercent: Math.max(
                0,
                Math.min(100, (((newRow.voltage || 0) - 3.0) / 1.2) * 100)
              ),
            });

            // Add new candle
            const p = newRow.power || 50;
            const newCandle: CandleData = { o: p, c: p, h: p, l: p };

            setCandles((prev) => {
              const updated = [...prev, newCandle];
              if (updated.length > 25) updated.shift();
              candlesRef.current = updated;
              return updated;
            });

            setLiveCandle({ o: p, c: p, h: p, l: p });
            liveCandleRef.current = { o: p, c: p, h: p, l: p };
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setConnectionStatus('connected');
          } else if (status === 'CHANNEL_ERROR') {
            setConnectionStatus('disconnected');
          }
        });

      setConnectionStatus('connected');

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      console.error('[AERION] Supabase connection failed, falling back to demo mode');
      setConnectionStatus('demo');
      return false;
    }
  }, []);

  // =============================================
  // DEMO MODE - Simulation engine
  // Exact port of reference HTML's data generator
  // =============================================
  const startDemoMode = useCallback(() => {
    // Initialize empty candles
    candlesRef.current = [];
    setCandles([]);

    liveCandleRef.current = null;
    setLiveCandle(null);

    // Animation loop for live candle updates
    const animate = () => {
      if (!shiftingRef.current) {
        phaseRef.current += 0.05;
        const p = phaseRef.current;
        let power =
          50 +
          Math.sin(p) * 15 +
          Math.sin(p * 2.3) * 5 +
          Math.random() * 2;
        power = Math.max(10, Math.min(90, power));
        livePowerSimRef.current = power;

        const lc = liveCandleRef.current || { o: power, c: power, h: power, l: power };
        lc.c = power;
        lc.h = Math.max(lc.h, lc.c);
        lc.l = Math.min(lc.l, lc.c);
        liveCandleRef.current = { ...lc };
        setLiveCandle({ ...lc });
      }

      if (shiftingRef.current) {
        shiftIndexRef.current += 0.04;
        setShiftProgress(shiftIndexRef.current);

        if (shiftIndexRef.current >= 1) {
          shiftIndexRef.current = 0;
          shiftingRef.current = false;
          setIsShifting(false);
          setShiftProgress(0);

          // Remove oldest, set new live candle
          const arr = candlesRef.current;
          if (arr.length > 25) arr.shift();
          candlesRef.current = [...arr];
          setCandles([...arr]);

          const lastClose = arr[arr.length - 1]?.c || 50;
          const newLc = { o: lastClose, c: lastClose, h: lastClose, l: lastClose };
          liveCandleRef.current = newLc;
          setLiveCandle(newLc);
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Generate new data every 2 seconds (matching reference)
    const dataInterval = setInterval(() => {
      // Push the completed live candle to history
      if (liveCandleRef.current) {
        candlesRef.current = [...candlesRef.current, { ...liveCandleRef.current }];
        setCandles([...candlesRef.current]);
        shiftingRef.current = true;
        shiftIndexRef.current = 0;
        setIsShifting(true);
      }

      // Generate new sensor values
      const livePower = livePowerSimRef.current;
      const battVoltage = 3.6 + Math.random() * 0.4;
      const liveTemp = 28 + Math.random() * 3;
      const liveHum = 65 + Math.random() * 10;
      const liveCurrent = livePower / battVoltage;
      const battPercent = Math.max(0, Math.min(100, ((battVoltage - 3.0) / 1.2) * 100));
      totalEnergyRef.current += (livePower * (2 / 3600));

      const vals = {
        totalEnergy: totalEnergyRef.current,
        livePower,
        battVoltage,
        liveCurrent,
        liveTemp,
        liveHum,
        battPercent,
      };
      setCurrentValues(vals);

      // Update power stats from candle close values
      const closeValues = candlesRef.current.map((c) => c.c);
      setPowerStats(computeStats(closeValues));

      // Create synthetic history row
      const row: TelemetryRow = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        temperature: liveTemp,
        humidity: liveHum,
        voltage: battVoltage,
        current: liveCurrent,
        power: livePower,
        total_energy: totalEnergyRef.current,
        status: livePower > 0 ? 'CHARGING' : 'IDLE',
      };
      setLatestData(row);
      setHistory((prev) => [...prev, row].slice(-50));
    }, 2000);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearInterval(dataInterval);
    };
  }, []);

  // =============================================
  // INITIALIZATION
  // =============================================
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const result = await initSupabase();
      if (result === false) {
        // Demo mode
        cleanup = startDemoMode();
      } else if (typeof result === 'function') {
        cleanup = result;
      }
    };

    init();

    return () => {
      cleanup?.();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initSupabase, startDemoMode]);

  return {
    latestData,
    history,
    candles,
    liveCandle,
    isShifting,
    shiftProgress,
    connectionStatus,
    powerStats,
    currentValues,
  };
}
