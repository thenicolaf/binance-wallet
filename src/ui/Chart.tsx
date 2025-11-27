import { useLayoutEffect, useRef } from "react";
import {
  createChart,
  LineSeries,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";

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

  // Создание графика при монтировании (useLayoutEffect для синхронной отрисовки)
  useLayoutEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#1a1a1a" },
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: { color: "#2a2a2a" },
        horzLines: { color: "#2a2a2a" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: "#2962FF",
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

  // Обработка изменения размера с помощью ResizeObserver
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

  // Обновление данных при изменении
  useLayoutEffect(() => {
    if (!seriesRef.current || data.length === 0) return;

    // Конвертация данных из Trade[] в формат lightweight-charts
    const chartData = data.map((trade) => ({
      time: Math.floor(trade.time / 1000) as UTCTimestamp, // конвертируем миллисекунды в секунды
      value: parseFloat(trade.price),
    }));

    // Сортируем данные по времени
    chartData.sort((a, b) => a.time - b.time);

    // Убираем дубликаты по времени (оставляем последнее значение для каждого времени)
    const uniqueData = chartData.reduce((acc, current) => {
      const existingIndex = acc.findIndex((item) => item.time === current.time);
      if (existingIndex >= 0) {
        // Заменяем существующее значение на более позднее
        acc[existingIndex] = current;
      } else {
        acc.push(current);
      }
      return acc;
    }, [] as Array<{ time: UTCTimestamp; value: number }>);

    seriesRef.current.setData(uniqueData);
  }, [data]);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />
  );
};
