'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { TelemetryRow, CandleData, TelemetryStats, ConnectionStatus } from '@/lib/types';

// ============================================================================
//  useAerionData - Live Supabase-Only Telemetry Hook
//  Strictly listens to real-time events from Supabase.
//  Zero random data generation, zero fake ticker simulations.
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

  const candlesRef = useRef<CandleData[]>([]);
  const shiftingRef = useRef(false);
  const shiftIndexRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  // Current values for display (starts clean at 0 until live Supabase data arrives)
  const [currentValues, setCurrentValues] = useState({
    totalEnergy: 0,
    livePower: 0,
    battVoltage: 0,
    liveCurrent: 0,
    liveTemp: 0,
    liveHum: 0,
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

  // Smooth shift animation loop when new candles arrive
  const animateShift = useCallback(() => {
    if (shiftingRef.current) {
      shiftIndexRef.current += 0.05;
      setShiftProgress(shiftIndexRef.current);

      if (shiftIndexRef.current >= 1) {
        shiftIndexRef.current = 0;
        shiftingRef.current = false;
        setIsShifting(false);
        setShiftProgress(0);
      } else {
        animFrameRef.current = requestAnimationFrame(animateShift);
      }
    }
  }, []);

  // =============================================
  // SUPABASE REAL-TIME CONNECTION
  // =============================================
  const initSupabase = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setConnectionStatus('disconnected');
      return;
    }

    try {
      setConnectionStatus('connecting');

      // Fetch last 25 real records from database
      const { data, error } = await supabase
        .from('telemetry')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(25);

      if (error) {
        console.error('[AERION] Supabase initial query error:', error);
        setConnectionStatus('disconnected');
        return;
      }

      if (data && data.length > 0) {
        setHistory(data);
        const latest = data[data.length - 1];
        setLatestData(latest);

        // Build candles strictly from real power telemetry
        const powerCandles: CandleData[] = data.map((row, idx) => {
          const p = typeof row.power === 'number' ? row.power : 0;
          const prev = idx > 0 && typeof data[idx - 1].power === 'number' ? data[idx - 1].power : p;
          return {
            o: prev,
            c: p,
            h: Math.max(prev, p),
            l: Math.min(prev, p),
          };
        });

        setCandles(powerCandles);
        candlesRef.current = powerCandles;

        const latestPower = typeof latest.power === 'number' ? latest.power : 0;
        const prevPower = data.length > 1 && typeof data[data.length - 2].power === 'number'
          ? data[data.length - 2].power
          : latestPower;

        setLiveCandle({
          o: prevPower,
          c: latestPower,
          h: Math.max(prevPower, latestPower),
          l: Math.min(prevPower, latestPower),
        });

        // Set real display values
        const v = typeof latest.voltage === 'number' ? latest.voltage : 0;
        setCurrentValues({
          totalEnergy: typeof latest.total_energy === 'number' ? latest.total_energy : 0,
          livePower: latestPower,
          battVoltage: v,
          liveCurrent: typeof latest.current === 'number' ? latest.current : 0,
          liveTemp: typeof latest.temperature === 'number' ? latest.temperature : 0,
          liveHum: typeof latest.humidity === 'number' ? latest.humidity : 0,
          battPercent: v > 0 ? Math.max(0, Math.min(100, ((v - 3.0) / 1.2) * 100)) : 0,
        });

        const powerValues = data.map((r) => (typeof r.power === 'number' ? r.power : 0));
        setPowerStats(computeStats(powerValues));
      }

      // Subscribe to real-time INSERT notifications
      const channel = supabase
        .channel('telemetry-live-stream')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'telemetry',
          },
          (payload) => {
            const newRow = payload.new as TelemetryRow;
            if (!newRow) return;

            setHistory((prev) => {
              const updated = [...prev, newRow].slice(-50);
              const powerValues = updated.map((r) => (typeof r.power === 'number' ? r.power : 0));
              setPowerStats(computeStats(powerValues));
              return updated;
            });

            setLatestData(newRow);

            const v = typeof newRow.voltage === 'number' ? newRow.voltage : 0;
            const p = typeof newRow.power === 'number' ? newRow.power : 0;

            // Update display values directly from real-time row
            setCurrentValues({
              totalEnergy: typeof newRow.total_energy === 'number' ? newRow.total_energy : 0,
              livePower: p,
              battVoltage: v,
              liveCurrent: typeof newRow.current === 'number' ? newRow.current : 0,
              liveTemp: typeof newRow.temperature === 'number' ? newRow.temperature : 0,
              liveHum: typeof newRow.humidity === 'number' ? newRow.humidity : 0,
              battPercent: v > 0 ? Math.max(0, Math.min(100, ((v - 3.0) / 1.2) * 100)) : 0,
            });

            // Form real candle from the incoming reading
            const prevCandles = candlesRef.current;
            const prevClose = prevCandles.length > 0 ? prevCandles[prevCandles.length - 1].c : p;
            const newCandle: CandleData = {
              o: prevClose,
              c: p,
              h: Math.max(prevClose, p),
              l: Math.min(prevClose, p),
            };

            const updatedCandles = [...prevCandles, newCandle];
            if (updatedCandles.length > 25) updatedCandles.shift();
            candlesRef.current = updatedCandles;
            setCandles(updatedCandles);
            setLiveCandle(newCandle);

            // Trigger smooth shift transition
            shiftingRef.current = true;
            shiftIndexRef.current = 0;
            setIsShifting(true);
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = requestAnimationFrame(animateShift);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setConnectionStatus('connected');
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setConnectionStatus('disconnected');
          }
        });

      setConnectionStatus('connected');

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.error('[AERION] Supabase connection failure:', err);
      setConnectionStatus('disconnected');
    }
  }, [animateShift]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    initSupabase().then((cleanup) => {
      if (cleanup) unsubscribe = cleanup;
    });

    return () => {
      if (unsubscribe) unsubscribe();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initSupabase]);

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
