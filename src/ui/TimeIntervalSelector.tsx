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
    <div className="px-4 py-4">
      {/* Interval buttons */}
      <div className="flex gap-3 justify-center mb-3">
        {INTERVALS.map((interval) => {
          const isActive = currentInterval === interval;

          return (
            <button
              key={interval}
              onClick={() => onIntervalChange(interval)}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all border-2 ${
                isActive
                  ? "bg-accent-gold text-background-primary border-accent-gold"
                  : "bg-transparent text-ui-text-secondary border-ui-border"
              }`}
            >
              {INTERVAL_LABELS[interval]}
            </button>
          );
        })}
      </div>

      {/* Pagination dots */}
      <div className="flex gap-1.5 justify-center">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full ${
              index === 1 ? "bg-accent-gold" : "bg-ui-text-tertiary"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
