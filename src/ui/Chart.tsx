import { useLayoutEffect, useRef } from "react";
import {
  createChart,
  LineSeries,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { TradeFeed } from "./TradeFeed";

// Chart colors from Tailwind config
const CHART_COLORS = {
  background: '#1a1a1a',
  text: '#9CA3AF',
  line: '#F0B90B',
  grid: '#2a2a2a',
};

interface Trade {
  price: string;
  time: number;
}

interface ChartProps {
  data: Trade[];
}

export const Chart = ({ data }: ChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Create chart on mount (useLayoutEffect for synchronous rendering)
  useLayoutEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: CHART_COLORS.background },
        textColor: CHART_COLORS.text,
      },
      grid: {
        vertLines: { color: CHART_COLORS.grid },
        horzLines: { color: CHART_COLORS.grid },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: CHART_COLORS.line,
          width: 1,
          style: 2,
        },
        horzLine: {
          color: CHART_COLORS.line,
          width: 1,
          style: 2,
        },
      },
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: CHART_COLORS.line,
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = lineSeries;

    // Cleanup
    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Handle resize using ResizeObserver
  useLayoutEffect(() => {
    if (!chartContainerRef.current || !chartRef.current) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      if (!chartRef.current || !entries.length) return;

      const { width, height } = entries[0].contentRect;
      chartRef.current.applyOptions({
        width: Math.max(width, 0),
        height: Math.max(height, 0),
      });
    };

    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(chartContainerRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, []);

  // Update data when it changes
  useLayoutEffect(() => {
    if (!seriesRef.current || data.length === 0) return;

    // Convert Trade[] to lightweight-charts format
    const chartData = data.map((trade) => ({
      time: Math.floor(trade.time / 1000) as UTCTimestamp, // Convert milliseconds to seconds
      value: parseFloat(trade.price),
    }));

    // Sort data by time
    chartData.sort((a, b) => a.time - b.time);

    // Remove duplicates by time (keep last value for each timestamp)
    const uniqueData = chartData.reduce((acc, current) => {
      const existingIndex = acc.findIndex((item) => item.time === current.time);
      if (existingIndex >= 0) {
        // Replace existing value with the later one
        acc[existingIndex] = current;
      } else {
        acc.push(current);
      }
      return acc;
    }, [] as Array<{ time: UTCTimestamp; value: number }>);

    seriesRef.current.setData(uniqueData);
  }, [data]);

  return (
    <div className="relative">
      <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />
      <TradeFeed />
    </div>
  );
};
