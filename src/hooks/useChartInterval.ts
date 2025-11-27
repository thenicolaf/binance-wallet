import { useState, useEffect, useCallback } from "react";

export type ChartInterval = "15s" | "1m" | "1h" | "1d";

// Map intervals to Binance API format
export const BINANCE_INTERVAL_MAP: Record<ChartInterval, string | null> = {
  "15s": null, // WebSocket trades only
  "1m": "1m",
  "1h": "1h",
  "1d": "1d",
};

interface UseChartIntervalReturn {
  interval: ChartInterval;
  setInterval: (interval: ChartInterval) => void;
  binanceInterval: string | null;
}

const STORAGE_KEY = "chart_interval";
const DEFAULT_INTERVAL: ChartInterval = "1m";

/**
 * Hook for managing chart time interval selection
 * Persists selected interval in localStorage
 */
export const useChartInterval = (): UseChartIntervalReturn => {
  const [interval, setIntervalState] = useState<ChartInterval>(DEFAULT_INTERVAL);

  // Load interval from localStorage on mount
  useEffect(() => {
    const savedInterval = localStorage.getItem(STORAGE_KEY) as ChartInterval;
    if (savedInterval && BINANCE_INTERVAL_MAP[savedInterval] !== undefined) {
      setIntervalState(savedInterval);
    }
  }, []);

  // Set interval and persist to localStorage
  const setInterval = useCallback((newInterval: ChartInterval) => {
    setIntervalState(newInterval);
    localStorage.setItem(STORAGE_KEY, newInterval);
  }, []);

  return {
    interval,
    setInterval,
    binanceInterval: BINANCE_INTERVAL_MAP[interval],
  };
};
