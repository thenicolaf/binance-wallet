import { useState } from "react";

export const TradingButtons = () => {
  const [selectedPosition, setSelectedPosition] = useState<"long" | "short" | null>(null);

  return (
    <div className="px-4 py-4 flex gap-3">
      {/* Long button */}
      <button
        onClick={() => setSelectedPosition(selectedPosition === "long" ? null : "long")}
        className={`flex-1 py-4 rounded-lg font-semibold text-base transition-all text-ui-text-primary cursor-pointer ${
          selectedPosition === "long"
            ? "bg-trading-long-hover"
            : "bg-trading-long"
        }`}
      >
        Long
      </button>

      {/* Short button */}
      <button
        onClick={() => setSelectedPosition(selectedPosition === "short" ? null : "short")}
        className={`flex-1 py-4 rounded-lg font-semibold text-base transition-all text-ui-text-primary cursor-pointer ${
          selectedPosition === "short"
            ? "bg-trading-short-hover"
            : "bg-trading-short"
        }`}
      >
        Short
      </button>
    </div>
  );
};
