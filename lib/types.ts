// ============================================================================
//  AERION Live Telemetry - TypeScript Interfaces
// ============================================================================

/** Represents a single row from the Supabase `telemetry` table */
export interface TelemetryRow {
  id: string;
  created_at: string;
  temperature: number;
  humidity: number;
  voltage: number;
  current: number;
  power: number;
  total_energy: number;
  status: string;
}

/** OHLC Candlestick data point */
export interface CandleData {
  o: number;
  c: number;
  h: number;
  l: number;
}

/** Min / Max / Average statistics for a metric */
export interface TelemetryStats {
  min: number;
  max: number;
  avg: number;
  latest: number;
  count: number;
}

/** Supabase connection status */
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'demo';

/** Navigation page identifiers */
export type NavPage = 'dashboard' | 'energy' | 'environment' | 'settings' | 'information';

/** Nav item configuration */
export interface NavItem {
  id: NavPage;
  label: string;
  icon: string;
}

/** Modal type for detail view */
export type ModalType = 'energy' | 'power' | 'battery' | 'env' | 'chart' | null;
