import "./App.css";
import { Chart } from "./ui/Chart";
import { WalletButton } from "./ui/WalletButton";
import { TimeIntervalSelector } from "./ui/TimeIntervalSelector";
import { useChartInterval } from "./hooks/useChartInterval";
import { useBinanceChartData } from "./hooks/useBinanceChartData";

function App() {
  const { interval, setInterval } = useChartInterval();
  const { trades, currentPrice, status, error } = useBinanceChartData(interval);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mini App</h1>
          <p className="text-gray-400 text-sm">BTC/USDT - Binance</p>
        </div>
        <WalletButton />
      </header>

      {/* Status Bar */}
      <div className="mb-4 text-center">
        {status === "connecting" && (
          <span className="text-yellow-400">🔄 Connecting...</span>
        )}
        {status === "connected" && (
          <span className="text-green-400">✅ Connected</span>
        )}
        {status === "disconnected" && (
          <span className="text-gray-400">⚠️ Disconnected</span>
        )}
        {error && <span className="text-red-400">❌ {error}</span>}
      </div>

      {/* Current Price */}
      <div className="text-center mb-6">
        <h2 className="text-5xl font-bold">
          ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <p className="text-gray-400 mt-2">
          {trades.length} data points | {interval.toUpperCase()} interval
        </p>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <Chart data={trades} />
      </div>

      {/* Time Interval Selector */}
      <TimeIntervalSelector
        currentInterval={interval}
        onIntervalChange={setInterval}
      />
    </div>
  );
}

export default App;
