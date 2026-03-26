# KDB Backtester with Web GUI

A complete backtesting system built with Node.js and React that allows you to test trading algorithms against synthetic market data. Features a web-based GUI for strategy selection, parameter configuration, and result visualization.

## Features

- **Multiple Strategies**: Pre-built strategies including Moving Average Crossover, RSI Overbought/Oversold, and Momentum-based trading
- **Web GUI**: React frontend with strategy selector, parameter forms, and interactive results dashboard
- **Real-time Visualization**: Equity curve charts, trade logs, and performance metrics
- **Synthetic Data**: Built-in market data generation for testing
- **Metrics**: Comprehensive performance analysis including Sharpe Ratio, Maximum Drawdown, Total Returns, etc.

## Project Structure

```
kdb_backtester/
├── backend/
│   ├── server.js              # Express server entry point
│   ├── lib/
│   │   └── backtester.js      # Core backtesting engine
│   ├── routes/
│   │   ├── strategies.js      # Strategy management endpoints
│   │   ├── backtest.js        # Backtest execution endpoints
│   │   └── data.js            # Market data endpoints
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── App.css
│   │   ├── components/
│   │   │   ├── StrategySelector.jsx
│   │   │   ├── BacktestForm.jsx
│   │   │   └── ResultsDashboard.jsx
│   │   ├── styles/
│   │   │   ├── StrategySelector.css
│   │   │   ├── BacktestForm.css
│   │   │   └── ResultsDashboard.css
│   │   └── index.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── package.json               # Root package with run scripts
```

## Installation

### Prerequisites
- Node.js (v15+)
- npm (v7+)

### Setup

1. Install root dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend && npm install
cd ..
```

3. Install frontend dependencies:
```bash
cd frontend && npm install
cd ..
```

## Running

### Development Mode (Both Backend & Frontend)
```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:3000`

### Backend Only
```bash
npm run backend
```

### Frontend Only
```bash
npm run frontend
```

## Usage

1. Open http://localhost:3000 in your browser
2. Select a trading strategy from the left sidebar
3. Configure strategy parameters and backtest settings:
   - **Symbol**: Stock ticker (default: AAPL)
   - **Number of Days**: Historical period to backtest (10-1000 days)
   - **Initial Cash**: Starting portfolio value
   - **Strategy Parameters**: Algorithm-specific settings
4. Click "Run Backtest"
5. View results:
   - Performance metrics (returns, Sharpe ratio, max drawdown)
   - Equity curve chart
   - Trade execution log

## API Endpoints

### Strategies
- `GET /api/strategies` - List all available strategies
- `GET /api/strategies/:id` - Get specific strategy details

### Backtesting
- `POST /api/backtest` - Run a backtest
  - Request body: `{ strategyId, strategyParams, symbol, numDays, initialCash }`
- `GET /api/backtest/:id` - Get backtest results
- `GET /api/backtest` - List all backtests

### Data
- `GET /api/data/sample` - Get sample market data
  - Query params: `?symbol=AAPL&numDays=252`

## Available Strategies

### 1. Moving Average Crossover
- **Description**: Buys when fast MA crosses above slow MA, sells when it crosses below
- **Parameters**: 
  - Fast MA Period (default: 20)
  - Slow MA Period (default: 50)

### 2. RSI Overbought/Oversold
- **Description**: Buys when RSI is below buy threshold (oversold), sells when above sell threshold (overbought)
- **Parameters**:
  - RSI Period (default: 14)
  - Buy Threshold (default: 30)
  - Sell Threshold (default: 70)

### 3. Momentum Strategy
- **Description**: Trades based on price momentum over a defined period
- **Parameters**:
  - Momentum Period (default: 20)

## Performance Metrics

- **Total Return**: Percentage gain/loss over the period
- **Annualized Return**: Extrapolated annual return rate
- **Sharpe Ratio**: Risk-adjusted return metric (higher is better)
- **Maximum Drawdown**: Largest peak-to-trough decline
- **Trades**: Total number of buy/sell executed
- **Win Rate**: Percentage of profitable trades
- **Profit Factor**: Total profits / total losses

## Technology Stack

- **Backend**: Node.js, Express.js, JavaScript
- **Frontend**: React, Recharts (charting), Axios (HTTP client)
- **Build Tool**: Vite
- **Data**: Synthetic OHLCV via random walk model

## Future Enhancements

- Integration with real kdb+ instances for production backtesting
- Additional strategies (machine learning-based, mean reversion variants)
- CSV import for historical data
- Real-time data streaming
- Portfolio optimization tools
- Risk management features (stop-loss, position sizing)
- Multi-asset portfolio backtesting
- Trade analysis and optimization

## License

MIT

## Author

Copilot
