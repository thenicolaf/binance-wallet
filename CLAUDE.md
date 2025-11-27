# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React + TypeScript cryptocurrency trading interface built with Vite. Mobile-first design featuring real-time BTC/USDT price tracking, interactive charts, and mock trading functionality. Connects to Binance WebSocket and REST APIs to display real-time price data and historical charts using lightweight-charts.

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
- **Icons**: lucide-react
- **Charts**: lightweight-charts v5
- **HTTP Client**: axios
- **Package Manager**: pnpm

## Architecture

### Layout Structure

Mobile-first full-screen layout using flexbox:
- Fixed header (menu, title, close)
- Scrollable main content area
- Fixed bottom navigation
- Full viewport height (`h-screen`)
- Components ordered: Header → Token/Wallet row → Price → Chart → Intervals → Position → Trading buttons

### Data Flow

The application uses a unified data fetching approach with interval-based data source selection:

**Unified Data Hook** (`useBinanceChartData`)
- Accepts `ChartInterval` parameter: `15s`, `1m`, `1h`, `1d`
- **15s mode**: WebSocket real-time trades (`wss://stream.binance.com:9443/ws/btcusdt@trade`)
  - Fetches initial price via REST
  - Maintains last 100 trade points in circular buffer using `[...prev.slice(-99), newTrade]` pattern
- **1m/1h/1d modes**: REST API kline data (`https://api.binance.com/api/v3/klines`)
  - Fetches 100 historical candles for selected interval

### Custom Hooks

All application logic abstracted into custom hooks in `src/hooks/`:

- `useBinanceChartData.ts` - Unified data fetching (WebSocket + REST)
- `useChartInterval.ts` - Time interval selection with localStorage persistence
- `useWalletConnection.ts` - Mock wallet connection state with localStorage persistence

### UI Components

Located in `src/ui/`:
- `Header.tsx` - Top navigation bar (menu, title, close button)
- `TokenSelector.tsx` - Trading pair selector with leverage display
- `PriceDisplay.tsx` - Current price with change percentage and action icons
  - Calculates price change based on first and current price from trades
  - Splits price into integer (white) and decimal (gray) parts
- `Chart.tsx` - Chart visualization using lightweight-charts v5
  - `useLayoutEffect` for chart initialization (prevents flickering)
  - `ResizeObserver` for responsive sizing
  - Time deduplication logic: rounds milliseconds to seconds and removes duplicates
  - Gold/orange line color with crosshair enabled
  - Includes `TradeFeed` overlay component
- `TradeFeed.tsx` - Mock trade activity feed (overlaid on chart)
- `TimeIntervalSelector.tsx` - Time interval selector (15S/1M/1H/1D) with pagination dots
- `PositionDetails.tsx` - Trading position details (margin, leverage)
- `TradingButtons.tsx` - Long/Short position buttons (visual only)
- `WalletButton.tsx` - Wallet connection/disconnection button (olive-green styling)
- `BottomNavigation.tsx` - Bottom tab navigation (Trade, Positions, Rewards, Profile)

### Utilities & Types

- `src/utils/wallet.ts` - Wallet address generation and formatting
- `src/utils/chart.ts` - Chart data conversion utilities
- `src/types/binance.ts` - Binance API type definitions

## Code Style Requirements

- **All code comments must be in English only**
- **UI styling must use TailwindCSS classes** - see https://tailwindcss.com/docs/
  - Custom theme colors defined in `tailwind.config.js`
  - Use Tailwind color classes (e.g., `bg-background-primary`, `text-ui-text-secondary`)
  - Avoid inline styles except for third-party libraries (like lightweight-charts)
  - Custom color palette includes: `background-*`, `accent-*`, `trading-*`, `ui-*`, `chart-*`
- **Icons must use lucide-react** - see https://lucide.dev/
  - Import icons from `lucide-react` (e.g., `import { Heart, Settings } from "lucide-react"`)
  - Apply Tailwind classes for sizing and colors (e.g., `<Heart className="w-6 h-6 text-ui-text-secondary" />`)
  - Never create custom SVG icons, always use lucide-react components
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
  - Current implementation uses `reduce()` to keep last value for each timestamp (see src/ui/Chart.tsx:101-110)
- WebSocket cleanup: Always close WebSocket connections in useEffect cleanup to prevent memory leaks