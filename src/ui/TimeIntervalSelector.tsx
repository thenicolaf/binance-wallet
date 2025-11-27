import type { ChartInterval } from "../hooks/useChartInterval";

interface TimeIntervalSelectorProps {
  currentInterval: ChartInterval;
  onIntervalChange: (interval: ChartInterval) => void;
}

const INTERVALS: ChartInterval[] = ["15s", "1m", "1h", "1d"];

const INTERVAL_LABELS: Record<ChartInterval, string> = {
  "15s": "15S",
  "1m": "1M",
  "1h": "1H",
  "1d": "1D",
};

export const TimeIntervalSelector = ({
  currentInterval,
  onIntervalChange,
}: TimeIntervalSelectorProps) => {
  return (
    <div className="flex gap-2 justify-center my-4">
      {INTERVALS.map((interval) => {
        const isActive = currentInterval === interval;

        return (
          <button
            key={interval}
            onClick={() => onIntervalChange(interval)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              isActive
                ? "bg-yellow-600 text-white border-2 border-yellow-500"
                : "bg-gray-800 text-gray-400 border-2 border-gray-700 hover:bg-gray-700 hover:text-gray-200"
            }`}
          >
            {INTERVAL_LABELS[interval]}
          </button>
        );
      })}
    </div>
  );
};
