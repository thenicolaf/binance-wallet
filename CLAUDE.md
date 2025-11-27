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

### Data Flow

The application uses a unified data fetching approach with interval-based data source selection:

**Unified Data Hook** (`useBinanceChartData`)
- Accepts `ChartInterval` parameter: `15s`, `1m`, `1h`, `1d`
- **15s mode**: WebSocket real-time trades (`wss://stream.binance.com:9443/ws/btcusdt@trade`)
  - Fetches initial price via REST
  - Maintains last 100 trade points in circular buffer
- **1m/1h/1d modes**: REST API kline data (`https://api.binance.com/api/v3/klines`)
  - Fetches 100 historical candles for selected interval

### Custom Hooks

All application logic abstracted into custom hooks in `src/hooks/`:

- `useBinanceChartData.ts` - Unified data fetching (WebSocket + REST)
- `useChartInterval.ts` - Time interval selection with localStorage persistence
- `useWalletConnection.ts` - Mock wallet connection state with localStorage persistence

### UI Components

Located in `src/ui/`:
- `Chart.tsx` - Chart visualization using lightweight-charts v5
  - `useLayoutEffect` for chart initialization (prevents flickering)
  - `ResizeObserver` for responsive sizing
  - Time deduplication logic: rounds milliseconds to seconds and removes duplicates
- `WalletButton.tsx` - Mock wallet connection/disconnection button
- `TimeIntervalSelector.tsx` - Time interval selector (15S/1M/1H/1D)

### Utilities & Types

- `src/utils/wallet.ts` - Wallet address generation and formatting
- `src/utils/chart.ts` - Chart data conversion utilities
- `src/types/binance.ts` - Binance API type definitions

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