# Binance Trading Interface

Mobile cryptocurrency trading interface built with React + TypeScript using Vite. The application displays real-time data from Binance API, including BTC/USDT price charts and mock trading functionality.

## Key Features

- **Real-time Price Display** - WebSocket connection to Binance for live trade data
- **Interactive Charts** - Price data visualization using lightweight-charts v5
- **Multiple Time Intervals** - 15 seconds (WebSocket), 1 minute, 1 hour, 1 day (REST API)
- **Mobile Design** - Responsive interface optimized for mobile devices
- **Wallet Connection** - Mock crypto wallet connection with address generation
- **Trading Interface** - UI for opening Long/Short positions (visual mode)
- **Trade Feed** - Display of recent trades in real-time

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS 4 (with Vite plugin)
- **Icons**: lucide-react
- **Charts**: lightweight-charts v5
- **HTTP Client**: axios
- **Package Manager**: pnpm

## Quick Start

### Requirements

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd binance-wallet

# Install dependencies
pnpm install
```

### Development Commands

```bash
# Start dev server with HMR
pnpm dev

# Type check and build for production
pnpm build

# Run ESLint
pnpm lint

# Preview production build
pnpm preview
```

## Project Architecture

### Directory Structure

```
src/
├── hooks/              # Custom React hooks
│   ├── useBinancePrice.ts           # Main data fetching hook (WebSocket + REST)
│   ├── useBinancePrice.helpers.ts   # Helper functions for data processing
│   ├── useChartInterval.ts          # Time interval selection management
│   └── useWalletConnection.ts       # Wallet connection state management
├── ui/                 # React components
│   ├── Header.tsx                   # Top navigation
│   ├── TokenSelector.tsx            # Trading pair selector
│   ├── PriceDisplay.tsx             # Current price display
│   ├── Chart.tsx                    # Price chart (lightweight-charts)
│   ├── TradeFeed.tsx                # Recent trades feed
│   ├── TimeIntervalSelector.tsx     # Time interval selector
│   ├── PositionDetails.tsx          # Trading position details
│   ├── TradingButtons.tsx           # Long/Short buttons
│   ├── WalletButton.tsx             # Wallet connection button
│   └── BottomNavigation.tsx         # Bottom navigation
├── utils/              # Utilities
│   ├── chart.ts                     # Chart data conversion
│   └── wallet.ts                    # Wallet address generation
├── types/              # TypeScript types
│   └── binance.ts                   # Binance API types
├── App.tsx             # Main application component
└── main.tsx            # Entry point
```

### Component Structure

The application uses a mobile-first layout with fixed elements:

```
┌─────────────────────────┐
│ Header (fixed)          │ ← Menu, title, close button
├─────────────────────────┤
│                         │
│ Token Selector          │ ← BTC/USDT pair selection
│ Price Display           │ ← Current price with change
│                         │
│ Chart (scrollable)      │ ← Interactive chart
│   └─ Trade Feed         │   (overlay)
│                         │
│ Time Intervals          │ ← 15S / 1M / 1H / 1D
│ Position Details        │ ← Margin, leverage
│ Trading Buttons         │ ← Long / Short
│                         │
├─────────────────────────┤
│ Bottom Navigation       │ ← Trade, Positions, Rewards, Profile
│        (fixed)          │
└─────────────────────────┘
```

### Data Flow

The application uses a unified data fetching approach:

**`useBinancePrice` Hook**

- **15s mode**: WebSocket connection (`wss://stream.binance.com:9443/ws/btcusdt@trade`)

  - Fetches initial price via REST API
  - Maintains last 100 trades in circular buffer
  - Updates in real-time as new trades arrive

- **1m/1h/1d modes**: REST API (`https://api.binance.com/api/v3/klines`)
  - Fetches 100 historical candles for selected interval
  - Periodic data updates

### Key Technical Decisions

#### Chart (Chart.tsx)

- Uses `useLayoutEffect` for chart initialization (prevents flickering)
- `ResizeObserver` for responsive sizing
- Timestamp deduplication: rounds milliseconds to seconds
- Line color: gold-orange with crosshair enabled

#### Price Display (PriceDisplay.tsx)

- Calculates price change based on first and current price from trades
- Splits price into integer part (white) and decimal part (gray)

#### WebSocket Management

- Automatic connection cleanup in useEffect cleanup function
- Prevents memory leaks on component unmount

## Code Style

- **TypeScript strict mode** enabled
- **All comments in English only**
- **Styling using TailwindCSS classes only**
- **Icons from lucide-react only**
- **HTTP requests using axios only**

## TypeScript Configuration

The project uses two separate configurations:

- `tsconfig.app.json` - application code (src/)
- `tsconfig.node.json` - build tooling (vite.config.ts, etc.)

## Binance API Integration

### WebSocket

```typescript
wss://stream.binance.com:9443/ws/btcusdt@trade
```

### REST API

```typescript
https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=100
```
