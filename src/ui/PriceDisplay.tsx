import { useMemo } from "react";
import { Heart, Settings } from "lucide-react";

interface PriceDisplayProps {
  currentPrice: number;
  trades: Array<{ price: string; time: number }>;
}

export const PriceDisplay = ({ currentPrice, trades }: PriceDisplayProps) => {
  // Calculate price change percentage
  const priceChange = useMemo(() => {
    if (trades.length < 2) return { percent: 0, isPositive: true };

    const firstPrice = parseFloat(trades[0].price);
    const changePercent = ((currentPrice - firstPrice) / firstPrice) * 100;

    return {
      percent: Math.abs(changePercent),
      isPositive: changePercent >= 0,
    };
  }, [currentPrice, trades]);

  // Format price into integer and decimal parts
  const formattedPrice = currentPrice.toFixed(2);
  const [integerPart, decimalPart] = formattedPrice.split(".");

  return (
    <div className="px-4 py-6">
      <div className="flex items-start justify-between">
        {/* Price with change percentage */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold tabular-nums text-ui-text-primary">
              {parseInt(integerPart).toLocaleString()}
            </span>
            <span className="text-5xl font-bold tabular-nums text-ui-text-secondary">
              .{decimalPart}
            </span>
          </div>

          {/* Price change percentage */}
          {trades.length >= 2 && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  priceChange.isPositive
                    ? "text-trading-positive"
                    : "text-trading-negative"
                }`}
              >
                {priceChange.isPositive ? "+" : "-"}
                {priceChange.percent.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3 mt-2">
          {/* Favorite/Heart icon */}
          <button
            className="p-2 hover:opacity-80 transition-opacity"
            aria-label="Add to favorites"
          >
            <Heart className="w-6 h-6 text-ui-text-secondary" />
          </button>

          {/* Settings icon */}
          <button
            className="p-2 hover:opacity-80 transition-opacity"
            aria-label="Settings"
          >
            <Settings className="w-6 h-6 text-ui-text-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
};
