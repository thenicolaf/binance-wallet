/**
 * Binance API type definitions
 */

// Kline data format from Binance REST API
// https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data
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

// WebSocket trade message format
export interface BinanceTradeMessage {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  T: number; // Trade time
}
