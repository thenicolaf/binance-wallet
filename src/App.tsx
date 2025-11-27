import "./App.css";
import { Chart } from "./ui/Chart";
import { WalletButton } from "./ui/WalletButton";
import { TimeIntervalSelector } from "./ui/TimeIntervalSelector";
import { Header } from "./ui/Header";
import { TokenSelector } from "./ui/TokenSelector";
import { PriceDisplay } from "./ui/PriceDisplay";
import { PositionDetails } from "./ui/PositionDetails";
import { TradingButtons } from "./ui/TradingButtons";
import { BottomNavigation } from "./ui/BottomNavigation";
import { useChartInterval } from "./hooks/useChartInterval";
import { useBinanceChartData } from "./hooks/useBinanceChartData";

function App() {
  const { interval, setInterval } = useChartInterval();
  const { trades, currentPrice } = useBinanceChartData(interval);

  return (
    <div className="h-screen flex flex-col bg-background-primary">
      {/* Header */}
      <Header />

      {/* Main content - scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Token selector and Wallet button row */}
        <div className="flex items-center justify-between">
          <TokenSelector />
          <div className="pr-4">
            <WalletButton />
          </div>
        </div>

        {/* Price display with change percentage */}
        <PriceDisplay currentPrice={currentPrice} trades={trades} />

        {/* Chart with trade feed overlay */}
        <div className="px-4">
          <Chart data={trades} />
        </div>

        {/* Time interval selector */}
        <TimeIntervalSelector
          currentInterval={interval}
          onIntervalChange={setInterval}
        />

        {/* Position details */}
        <PositionDetails />

        {/* Trading buttons */}
        <TradingButtons />
      </div>

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
}

export default App;
