import axios from "axios";
import type { ChartInterval } from "./useChartInterval";
import type { Trade, TradeWithDetails } from "./useBinancePrice";
import type {
  BinanceKline,
  BinanceTradeMessage,
  BinanceKlineMessage,
} from "../types/binance";

/**
 * Get WebSocket URL based on interval
 */
export function getWebSocketUrl(
  symbol: string,
  interval: ChartInterval
): string {
  const lowerSymbol = symbol.toLowerCase();

  if (interval === "15s") {
    return `wss://stream.binance.com:9443/ws/${lowerSymbol}@trade`;
  }

  const klineInterval =
    interval === "1m" ? "1m" : interval === "1h" ? "1h" : "1d";
  return `wss://stream.binance.com:9443/ws/${lowerSymbol}@kline_${klineInterval}`;
}

/**
 * Get Binance interval string from ChartInterval
 */
export function getBinanceInterval(interval: ChartInterval): string | null {
  if (interval === "15s") return null;
  return interval === "1m" ? "1m" : interval === "1h" ? "1h" : "1d";
}

/**
 * Fetch initial price for 15s interval
 */
export async function fetchCurrentPrice(symbol: string): Promise<{
  price: number;
  priceString: string;
  timestamp: number;
}> {
  const response = await axios.get(
    "https://api.binance.com/api/v3/ticker/price",
    { params: { symbol: symbol.toUpperCase() } }
  );

  return {
    price: parseFloat(response.data.price),
    priceString: response.data.price,
    timestamp: Date.now(),
  };
}

/**
 * Fetch kline data for intervals other than 15s
 */
export async function fetchKlineData(
  symbol: string,
  interval: string,
  limit: number
): Promise<Trade[]> {
  const response = await axios.get<BinanceKline[]>(
    "https://api.binance.com/api/v3/klines",
    {
      params: {
        symbol: symbol.toUpperCase(),
        interval,
        limit,
      },
    }
  );

  // Binance klines format: [openTime, open, high, low, close, volume, ...]
  return response.data.map((kline) => ({
    price: kline[4], // close price as string
    time: kline[0], // open time in milliseconds
  }));
}

/**
 * Process trade stream message (15s interval)
 */
export function processTradeMessage(
  data: BinanceTradeMessage,
  prevTrades: Trade[],
  throttleMs: number,
  lastUpdateTime: number
): {
  price: number;
  lastTrade: TradeWithDetails;
  trades: Trade[] | null;
  lastUpdateTime: number;
} {
  const price = parseFloat(data.p);
  const now = Date.now();

  const lastTrade: TradeWithDetails = {
    price: data.p,
    quantity: parseFloat(data.q),
    time: data.T,
    isBuyerMaker: data.m,
  };

  // Throttle trades array updates
  const shouldUpdateTrades = now - lastUpdateTime >= throttleMs;
  const trades = shouldUpdateTrades
    ? [...prevTrades.slice(-99), { price: data.p, time: data.T }]
    : null;

  return {
    price,
    lastTrade,
    trades,
    lastUpdateTime: shouldUpdateTrades ? now : lastUpdateTime,
  };
}

/**
 * Process kline stream message (1m, 1h, 1d intervals)
 */
export function processKlineMessage(
  data: BinanceKlineMessage,
  prevTrades: Trade[]
): {
  price: number;
  lastTrade: TradeWithDetails;
  trades: Trade[];
} {
  const kline = data.k;
  const price = parseFloat(kline.c);

  const lastTrade: TradeWithDetails = {
    price: kline.c,
    quantity: parseFloat(kline.v),
    time: kline.t,
    isBuyerMaker: false,
  };

  const newTrade: Trade = {
    price: kline.c,
    time: kline.t,
  };

  let trades: Trade[];

  if (kline.x) {
    // Kline is closed
    if (prevTrades.length > 0 && prevTrades[prevTrades.length - 1].time === kline.t) {
      trades = [...prevTrades.slice(0, -1), newTrade];
    } else {
      trades = [...prevTrades.slice(-99), newTrade];
    }
  } else {
    // Kline is still open
    if (prevTrades.length > 0 && prevTrades[prevTrades.length - 1].time === kline.t) {
      trades = [...prevTrades.slice(0, -1), newTrade];
    } else {
      trades = [...prevTrades, newTrade];
    }
  }

  return { price, lastTrade, trades };
}
