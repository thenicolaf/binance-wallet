# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React + TypeScript cryptocurrency price tracking application built with Vite. The app connects to Binance WebSocket and REST APIs to display real-time BTC/USDT price data and historical charts using lightweight-charts.

## Development Commands

```bash
# Start development server with HMR
pnpm dev

# Type-check and build for production
pnpm build

# Run ESLint
pnpm lint

# Preview production build
pnpm preview
```

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS 4 (with Vite plugin)
- **Charts**: lightweight-charts v5
- **HTTP Client**: axios
- **Package Manager**: pnpm

## Architecture

### Data Flow with React 19 `use()` Hook

The application uses React 19's `use()` hook for data fetching:

1. **Real-time prices** via WebSocket (`useBinancePriceRealtime` hook)

   - Initial price fetched via REST: `fetchCurrentPrice()` returns Promise consumed by `use()`
   - WebSocket connects to `wss://stream.binance.com:9443/ws/{symbol}@trade`
   - Maintains last 100 price points in circular buffer
   - Component wrapped in `<Suspense>` for initial loading state

2. **Historical data** via REST API (`useBinanceRest` hook)
   - `fetchBinanceKlines()` returns Promise consumed by `use()` hook
   - Fetches kline data from `https://api.binance.com/api/v3/klines`
   - Default: 1-minute intervals, 100 data points

### Custom Hooks Pattern

All Binance API interactions abstracted into `src/hooks/`:

- `useBinancePriceRealtime.ts` - WebSocket connection + initial price via Promise
- `useBinanceRest.ts` - Historical kline data via Promise

### Chart Component (`src/ui/Chart.tsx`)

- Uses `lightweight-charts` v5 with proper React lifecycle management
- `useLayoutEffect` for chart initialization (prevents flickering)
- `ResizeObserver` for responsive sizing
- Time deduplication logic: rounds milliseconds to seconds and removes duplicates
- Data must be sorted ascending by time before calling `setData()`

## Code Style Requirements

- **All code comments must be in English only**
- **UI styling must use TailwindCSS only** - see https://tailwindcss.com/docs/
- **HTTP requests must use axios** (already configured)

## TypeScript Configuration

- Strict mode enabled
- Module resolution: "bundler" mode for Vite
- Two separate configs:
  - `tsconfig.app.json` - Application code (src/)
  - `tsconfig.node.json` - Build tooling (vite.config.ts, etc.)

## Important Implementation Notes

- Chart component uses `chart.addSeries(LineSeries, options)` syntax (v5 API)
- lightweight-charts documentation: https://tradingview.github.io/lightweight-charts/docs/api
- Trade data timestamps are in milliseconds, must convert to seconds for chart: `Math.floor(time / 1000) as UTCTimestamp`
- Duplicate timestamps at same second must be filtered before `setData()` to avoid assertion errors
- Reference UI app this is @reference_template.png