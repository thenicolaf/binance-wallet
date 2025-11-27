import { useState, useEffect } from "react";
import axios from "axios";
import type { ChartInterval } from "./useChartInterval";
import { convertKlinesToTrades, type Trade } from "../utils/chart";
import type { BinanceKline } from "./useBinanceRest";

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

interface UseBinanceChartDataReturn {
  trades: Trade[];
  currentPrice: number;
  status: ConnectionStatus;
  error: string | null;
}

const SYMBOL = "BTCUSDT";
const WS_SYMBOL = "btcusdt";

/**
 * Unified hook for fetching chart data based on selected interval
 * - 15s: WebSocket real-time trades
 * - 1m, 1h, 1d: REST API klines
 */
export const useBinanceChartData = (
  interval: ChartInterval
): UseBinanceChartDataReturn => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let isMounted = true;

    const initializeData = async () => {
      setStatus("connecting");
      setError(null);

      try {
        if (interval === "15s") {
          // WebSocket mode for real-time trades
          // First, get initial price
          const priceResponse = await axios.get(
            "https://api.binance.com/api/v3/ticker/price",
            { params: { symbol: SYMBOL } }
          );
          const initialPrice = parseFloat(priceResponse.data.price);

          if (isMounted) {
            setCurrentPrice(initialPrice);
            setTrades([{ price: priceResponse.data.price, time: Date.now() }]);

            // Connect WebSocket
            ws = new WebSocket(
              `wss://stream.binance.com:9443/ws/${WS_SYMBOL}@trade`
            );

            ws.onopen = () => {
              if (isMounted) {
                setStatus("connected");
              }
            };

            ws.onmessage = (event) => {
              if (!isMounted) return;

              const data: BinanceTradeMessage = JSON.parse(event.data);
              const newPrice = parseFloat(data.p);
              const time = data.T;

              setCurrentPrice(newPrice);
              setTrades((prev) => [...prev.slice(-99), { price: data.p, time }]);
            };

            ws.onerror = () => {
              if (isMounted) {
                setStatus("error");
                setError("WebSocket connection error");
              }
            };

            ws.onclose = () => {
              if (isMounted) {
                setStatus("disconnected");
              }
            };
          }
        } else {
          // REST API mode for historical klines
          const binanceInterval = interval === "1m" ? "1m" : interval === "1h" ? "1h" : "1d";

          const klinesResponse = await axios.get<BinanceKline[]>(
            "https://api.binance.com/api/v3/klines",
            {
              params: {
                symbol: SYMBOL,
                interval: binanceInterval,
                limit: 100,
              },
            }
          );

          if (isMounted) {
            const tradesData = convertKlinesToTrades(klinesResponse.data);
            setTrades(tradesData);

            // Set current price from latest kline
            if (tradesData.length > 0) {
              setCurrentPrice(parseFloat(tradesData[tradesData.length - 1].price));
            }

            setStatus("connected");
          }
        }
      } catch (err) {
        if (isMounted) {
          setStatus("error");
          setError(err instanceof Error ? err.message : "Failed to fetch data");
        }
      }
    };

    initializeData();

    // Cleanup
    return () => {
      isMounted = false;
      if (ws) {
        ws.close();
      }
    };
  }, [interval]);

  return {
    trades,
    currentPrice,
    status,
    error,
  };
};
