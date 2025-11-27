import { useMemo } from "react";

interface TradeActivity {
  user: string;
  timestamp: string;
  action: string;
  leverage: number;
  type: "long" | "short";
}

export const TradeFeed = () => {
  // Mock trade data
  const trades = useMemo<TradeActivity[]>(() => {
    const now = new Date();
    const getTimeAgo = (minutesAgo: number) => {
      const time = new Date(now.getTime() - minutesAgo * 60000);
      return `Today at ${time.getHours()}:${String(time.getMinutes()).padStart(2, "0")}`;
    };

    return [
      {
        user: "Dany",
        timestamp: getTimeAgo(28),
        action: "Opened Long",
        leverage: 10,
        type: "long",
      },
      {
        user: "Gabriel",
        timestamp: getTimeAgo(15),
        action: "Opened Short",
        leverage: 100,
        type: "short",
      },
    ];
  }, []);

  return (
    <div className="absolute left-4 top-4 space-y-3 pointer-events-none max-w-[200px]">
      {trades.map((trade, index) => (
        <div key={index} className="text-xs text-ui-text-secondary">
          <div
            className={`font-medium ${
              trade.type === "long"
                ? "text-trading-positive"
                : "text-trading-negative"
            }`}
          >
            {trade.user}
          </div>
          <div className="opacity-70">{trade.timestamp}</div>
          <div className="opacity-70">
            {trade.action} {trade.leverage}X
          </div>
        </div>
      ))}
    </div>
  );
};
