import "./App.css";
import { Suspense } from "react";
import {
  fetchCurrentPrice,
  useBinancePriceRealtime,
} from "./hooks/useBinancePriceRealtime";
import { Chart } from "./ui/Chart";

// Promise создается ВНЕ компонента для стабильности между ре-рендерами
const initialPricePromise = fetchCurrentPrice("BTCUSDT");

function PriceDisplay() {
  const { price, priceHistory, status, error } = useBinancePriceRealtime(
    initialPricePromise,
    "btcusdt"
  );

  return (
    <div className="container">
      <div className="status-bar">
        {status === "connecting" && <span>🔄 Подключение к WebSocket...</span>}
        {status === "connected" && <span>✅ Подключено</span>}
        {status === "disconnected" && <span>⚠️ Отключено</span>}
        {error && <span className="error">❌ {error}</span>}
      </div>

      <h1 className="price">${price.toLocaleString()}</h1>

      <div className="info">
        <p>BTC/USDT - Binance</p>
        <p>История: {priceHistory.length} точек данных</p>
      </div>

      <div className="chart-container">
        <Chart data={priceHistory} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Suspense
      fallback={<div className="loading">⏳ Загрузка начальной цены...</div>}
    >
      <PriceDisplay />
    </Suspense>
  );
}

export default App;
