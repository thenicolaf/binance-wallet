import { use, useEffect, useState } from "react";
import axios from "axios";

interface Trade {
  price: string;
  time: number;
}

interface BinanceTradeMessage {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  T: number; // Trade time
}

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

// Функция для получения текущей цены (Promise)
export const fetchCurrentPrice = (symbol = "BTCUSDT"): Promise<string> => {
  return axios
    .get("https://api.binance.com/api/v3/ticker/price", {
      params: { symbol },
    })
    .then((response) => response.data.price);
};

export function useBinancePriceRealtime(
  initialPricePromise: Promise<string>,
  symbol = "btcusdt"
) {
  // Используем `use` для получения начальной цены
  const initialPrice = use(initialPricePromise);

  const [price, setPrice] = useState<number>(parseFloat(initialPrice));
  const [priceHistory, setPriceHistory] = useState<Trade[]>(() => [
    { price: initialPrice, time: Date.now() },
  ]);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol}@trade`
    );

    ws.onopen = () => {
      setStatus("connected");
      setError(null);
    };

    ws.onmessage = (event) => {
      const data: BinanceTradeMessage = JSON.parse(event.data);
      const newPrice = parseFloat(data.p);
      const time = data.T;

      setPrice(newPrice);
      setPriceHistory((prev) => [...prev.slice(-100), { price: data.p, time }]);
    };

    ws.onerror = () => {
      setStatus("error");
      setError("WebSocket connection error");
    };

    ws.onclose = () => {
      setStatus("disconnected");
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return { price, priceHistory, status, error };
}
