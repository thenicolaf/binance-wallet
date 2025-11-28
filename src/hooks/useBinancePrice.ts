import { useEffect, useState, useRef, useCallback } from "react";
import type { ChartInterval } from "./useChartInterval";
import {
  getWebSocketUrl,
  getBinanceInterval,
  fetchCurrentPrice,
  fetchKlineData,
  processTradeMessage,
  processKlineMessage,
} from "./useBinancePrice.helpers";

export interface Trade {
  price: string;
  time: number;
}

export interface TradeWithDetails extends Trade {
  quantity: number;
  isBuyerMaker: boolean;
}

interface UseBinancePriceOptions {
  symbol?: string;
  historyLimit?: number;
  throttleMs?: number;
}

interface UseBinancePriceReturn {
  trades: Trade[];
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  lastTrade: TradeWithDetails | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useBinancePrice(
  interval: ChartInterval,
  options: UseBinancePriceOptions = {}
): UseBinancePriceReturn {
  const { symbol = "btcusdt", historyLimit = 100, throttleMs = 500 } = options;

  // State
  const [price, setPrice] = useState<number>(0);
  const [initialPrice, setInitialPrice] = useState<number>(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [lastTrade, setLastTrade] = useState<TradeWithDetails | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs for WebSocket management
  const wsRef = useRef<WebSocket | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Calculate price change
  const priceChange = initialPrice > 0 ? price - initialPrice : 0;
  const priceChangePercent =
    initialPrice > 0 ? ((price - initialPrice) / initialPrice) * 100 : 0;

  // Load initial data from REST API
  const loadInitialData = useCallback(async () => {
    try {
      const binanceInterval = getBinanceInterval(interval);

      if (!binanceInterval) {
        // For 15s interval, fetch current price
        const data = await fetchCurrentPrice(symbol);
        setPrice(data.price);
        setInitialPrice(data.price);
        setTrades([{ price: data.priceString, time: data.timestamp }]);
      } else {
        // For other intervals, fetch kline data
        const tradesData = await fetchKlineData(
          symbol,
          binanceInterval,
          historyLimit
        );
        setTrades(tradesData);

        if (tradesData.length > 0) {
          const lastPrice = parseFloat(tradesData[tradesData.length - 1].price);
          const firstPrice = parseFloat(tradesData[0].price);
          setPrice(lastPrice);
          setInitialPrice(firstPrice);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    }
  }, [interval, symbol, historyLimit]);

  // Handle WebSocket message
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (interval === "15s") {
        setTrades((prevTrades) => {
          const result = processTradeMessage(
            data,
            prevTrades,
            throttleMs,
            lastUpdateRef.current
          );

          if (result.trades) {
            setPrice(result.price);
            setLastTrade(result.lastTrade);
            lastUpdateRef.current = result.lastUpdateTime;
            return result.trades;
          }

          return prevTrades;
        });
      } else {
        setTrades((prevTrades) => {
          const result = processKlineMessage(data, prevTrades);

          setPrice(result.price);
          setLastTrade(result.lastTrade);

          return result.trades;
        });
      }
    },
    [interval, throttleMs]
  );

  // Create WebSocket connection
  const createWebSocket = useCallback(() => {
    const wsUrl = getWebSocketUrl(symbol, interval);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      setIsLoading(false);
      setError(null);
      console.log(`WebSocket connected: ${symbol} (${interval})`);
    };

    ws.onmessage = handleMessage;

    ws.onerror = () => {
      setError("WebSocket connection error");
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket disconnected");
    };

    return ws;
  }, [symbol, interval, handleMessage]);

  // Main effect: manage WebSocket lifecycle
  useEffect(() => {
    let mounted = true;
    let reconnectTimeout: number | undefined;

    // Cleanup previous connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Load data and connect
    const initialize = async () => {
      setIsLoading(true);
      setError(null);

      await loadInitialData();

      if (!mounted) return;

      // Create and store WebSocket connection
      wsRef.current = createWebSocket();

      // Auto-reconnect on close
      const handleReconnect = () => {
        if (!mounted) return;

        console.log("Reconnecting in 3s...");
        reconnectTimeout = setTimeout(() => {
          if (mounted && wsRef.current?.readyState === WebSocket.CLOSED) {
            wsRef.current = createWebSocket();
            wsRef.current.addEventListener("close", handleReconnect);
          }
        }, 3000) as unknown as number;
      };

      wsRef.current.addEventListener("close", handleReconnect);
    };

    initialize();

    // Cleanup
    return () => {
      mounted = false;

      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [loadInitialData, createWebSocket]);

  return {
    trades,
    currentPrice: price,
    priceChange,
    priceChangePercent,
    lastTrade,
    isConnected,
    isLoading,
    error,
  };
}
