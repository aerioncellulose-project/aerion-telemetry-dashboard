'use client';

import { useEffect, useRef, useCallback } from 'react';
import { CandleData } from '@/lib/types';

// ============================================================================
//  CandlestickChart - Custom SVG candlestick engine
//  Direct React port of the reference HTML's chart rendering system.
//  Supports smooth shift animation when new candles arrive.
// ============================================================================

interface CandlestickChartProps {
  candles: CandleData[];
  liveCandle: CandleData | null;
  isShifting: boolean;
  shiftProgress: number;
  onClick?: () => void;
}

const NUM_CANDLES_VISIBLE = 25;
const TOTAL_DOM_CANDLES = 26;
const CANDLE_WIDTH = 2.5;
const CANDLE_GAP = 1.5;

export default function CandlestickChart({
  candles,
  liveCandle,
  isShifting,
  shiftProgress,
  onClick,
}: CandlestickChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const candleGroupRef = useRef<SVGGElement>(null);
  const initializedRef = useRef(false);

  // Initialize DOM candle elements (once)
  const initCandles = useCallback(() => {
    const group = candleGroupRef.current;
    if (!group || initializedRef.current) return;

    for (let i = 0; i < TOTAL_DOM_CANDLES; i++) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('id', `candle-${i}`);

      const wick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      wick.setAttribute('stroke-width', '0.4');
      g.appendChild(wick);

      const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      body.setAttribute('width', String(CANDLE_WIDTH));
      g.appendChild(body);

      group.appendChild(g);
    }

    initializedRef.current = true;
  }, []);

  // Render frame
  const renderChart = useCallback(() => {
    const group = candleGroupRef.current;
    if (!group) return;

    const allCandles = [...candles.slice(-(NUM_CANDLES_VISIBLE))];
    if (liveCandle) allCandles.push(liveCandle);
    // Pad with nulls at the beginning to always have TOTAL_DOM_CANDLES elements
    const paddedCandles = Array(TOTAL_DOM_CANDLES - allCandles.length).fill(null).concat(allCandles);
    const frac = isShifting ? shiftProgress : 0;

    for (let i = 0; i < TOTAL_DOM_CANDLES; i++) {
      const c = paddedCandles[i];
      const g = group.querySelector(`#candle-${i}`) as SVGGElement;
      if (!g) continue;

      if (!c) {
        g.setAttribute('display', 'none');
        continue;
      }
      g.removeAttribute('display');

      const cx = 5 + (i - frac) * (CANDLE_WIDTH + CANDLE_GAP) + CANDLE_WIDTH / 2;
      g.setAttribute('transform', `translate(${cx}, 0)`);

      const wick = g.querySelector('line')!;
      const body = g.querySelector('rect')!;

      const yH = 100 - c.h;
      const yL = 100 - c.l;
      const yO = 100 - c.o;
      const yC = 100 - c.c;

      wick.setAttribute('x1', '0');
      wick.setAttribute('x2', '0');
      wick.setAttribute('y1', String(yH));
      wick.setAttribute('y2', String(yL));

      const bodyY = Math.min(yO, yC);
      const bodyH = Math.max(Math.abs(yO - yC), 0.5);

      body.setAttribute('x', String(-CANDLE_WIDTH / 2));
      body.setAttribute('y', String(bodyY));
      body.setAttribute('height', String(bodyH));

      const isBullish = c.c >= c.o;
      const color = isBullish ? '#10b981' : '#ef4444';

      wick.setAttribute('stroke', color);
      body.setAttribute('fill', color);
    }
  }, [candles, liveCandle, isShifting, shiftProgress]);

  // Init on mount
  useEffect(() => {
    initCandles();
  }, [initCandles]);

  // Re-render on data change
  useEffect(() => {
    if (initializedRef.current) {
      renderChart();
    }
  }, [renderChart]);

  return (
    <div
      className="glass glass-interactive rounded-3xl p-6 flex flex-col flex-grow"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
            Energy Flow Monitor (mW)
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Click to view detailed statistics (Min, Max, Avg)
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full relative flex-grow">
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
          <g ref={candleGroupRef} />
        </svg>
      </div>
    </div>
  );
}
