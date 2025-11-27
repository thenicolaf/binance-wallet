import { use } from "react";
import axios from "axios";

// Тип для данных kline от Binance
export type BinanceKline = [
  number, // Open time
  string, // Open
  string, // High
  string, // Low
  string, // Close
  string, // Volume
  number, // Close time
  string, // Quote asset volume
  number, // Number of trades
  string, // Taker buy base asset volume
  string, // Taker buy quote asset volume
  string  // Ignore
];

// Функция создает Promise для загрузки исторических данных
export const fetchBinanceKlines = (
  symbol = "BTCUSDT",
  interval = "1m",
  limit = 100
): Promise<BinanceKline[]> => {
  return axios
    .get("https://api.binance.com/api/v3/klines", {
      params: {
        symbol,
        interval,
        limit,
      },
    })
    .then((response) => response.data);
};

// Хук использует `use` для чтения Promise
export const useBinanceRest = (
  dataPromise: Promise<BinanceKline[]>
): BinanceKline[] => {
  const klines = use(dataPromise);
  return klines;
};
