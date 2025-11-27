import type { BinanceKline } from "../types/binance";

export interface Trade {
  price: string;
  time: number;
}

/**
 * Converts Binance kline data to Trade format for chart
 * @param kline - Binance kline array [openTime, open, high, low, close, ...]
 * @returns Trade object with close price and time
 */
export const convertKlineToTrade = (kline: BinanceKline): Trade => {
  const [openTime, , , , close] = kline;
  return {
    price: close, // Use close price
    time: openTime, // Open time in milliseconds
  };
};

/**
 * Converts array of klines to array of trades
 * @param klines - Array of Binance klines
 * @returns Array of Trade objects
 */
export const convertKlinesToTrades = (klines: BinanceKline[]): Trade[] => {
  return klines.map(convertKlineToTrade);
};
