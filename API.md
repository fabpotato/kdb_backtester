# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### Health Check
```
GET /health
```
Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-26T07:44:07.072Z"
}
```

---

## Strategies

### List All Strategies
```
GET /strategies
```
Returns all available trading strategies.

**Response:**
```json
[
  {
    "id": "ma-crossover",
    "name": "Moving Average Crossover",
    "description": "Buys when fast MA crosses above slow MA, sells when it crosses below",
    "params": [
      {
        "name": "fastMA",
        "label": "Fast MA Period",
        "type": "number",
        "default": 20,
        "min": 5,
        "max": 100
      },
      {
        "name": "slowMA",
        "label": "Slow MA Period",
        "type": "number",
        "default": 50,
        "min": 10,
        "max": 200
      }
    ]
  }
]
```

### Get Specific Strategy
```
GET /strategies/{id}
```

**Parameters:**
- `id` (string): Strategy ID (e.g., "ma-crossover")

---

## Backtests

### Run Backtest
```
POST /backtest
```
Execute a backtest with specified strategy and parameters.

**Request Body:**
```json
{
  "strategyId": "ma-crossover",
  "strategyParams": {
    "fastMA": 20,
    "slowMA": 50
  },
  "symbol": "AAPL",
  "numDays": 252,
  "initialCash": 100000
}
```

**Parameters:**
- `strategyId` (string, required): ID of strategy to use
- `strategyParams` (object, required): Strategy-specific parameters
- `symbol` (string, optional): Stock ticker symbol (default: "AAPL")
- `numDays` (number, optional): Number of historical days to backtest (default: 252)
- `initialCash` (number, optional): Starting portfolio value in USD (default: 100000)

**Response:**
```json
{
  "backtestId": "49bd053e-f7c4-4be8-9407-5d546ffb5cc0",
  "data": {
    "equityCurve": [100000, 99982, 99964, ...],
    "trades": [
      {
        "timestamp": "2026-02-23",
        "symbol": "AAPL",
        "qty": 900,
        "price": 100.01,
        "type": "BUY"
      },
      {
        "timestamp": "2026-03-25",
        "symbol": "AAPL",
        "qty": 900,
        "price": 99.89,
        "type": "SELL"
      }
    ],
    "metrics": {
      "initialCash": 100000,
      "finalValue": 99892,
      "totalReturn": -0.00108,
      "annualizedReturn": -0.005336470588235294,
      "sharpe": 0.45,
      "maxDD": 0.00126,
      "numTrades": 2,
      "winRate": 0.5,
      "profitFactor": 1.5
    }
  },
  "message": "Backtest completed successfully"
}
```

### Get Backtest Results
```
GET /backtest/{id}
```

**Parameters:**
- `id` (string): Backtest ID returned from POST /backtest

**Response:** Same as backtest results above

### List All Backtests
```
GET /backtest
```
Returns summary of all completed backtests (without full equity curve).

**Response:**
```json
[
  {
    "id": "49bd053e-f7c4-4be8-9407-5d546ffb5cc0",
    "strategyId": "ma-crossover",
    "symbol": "AAPL",
    "timestamp": "2026-03-26T07:44:00.000Z",
    "metrics": {
      "finalValue": 99892,
      "totalReturn": -0.00108,
      ...
    }
  }
]
```

---

## Data

### Get Sample Market Data
```
GET /data/sample
```
Returns sample OHLCV (Open, High, Low, Close, Volume) market data.

**Query Parameters:**
- `symbol` (string, optional): Stock ticker symbol (default: "AAPL")
- `numDays` (number, optional): Number of days of data (default: 252)

**Response:**
```json
[
  {
    "date": "2026-02-23",
    "symbol": "AAPL",
    "open": 100.05,
    "high": 101.23,
    "low": 99.87,
    "close": 100.45,
    "volume": 1523456
  },
  ...
]
```

---

## Performance Metrics Explained

- **Total Return**: Percentage gain/loss over the backtest period
- **Annualized Return**: Extrapolated annual return rate
- **Sharpe Ratio**: Risk-adjusted return (higher is better; >1.0 is good, >2.0 is excellent)
- **Max Drawdown**: Largest peak-to-trough percentage decline
- **Num Trades**: Total number of buy and sell orders executed
- **Win Rate**: Percentage of profitable trades
- **Profit Factor**: Total profits divided by total losses

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "strategyId is required"
}
```

### 404 Not Found
```json
{
  "error": "Strategy not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Example Workflows

### Example 1: MA Crossover Backtest
```bash
curl -X POST http://localhost:5000/api/backtest \
  -H "Content-Type: application/json" \
  -d '{
    "strategyId": "ma-crossover",
    "strategyParams": {"fastMA": 20, "slowMA": 50},
    "symbol": "AAPL",
    "numDays": 252,
    "initialCash": 50000
  }'
```

### Example 2: RSI Strategy Backtest
```bash
curl -X POST http://localhost:5000/api/backtest \
  -H "Content-Type: application/json" \
  -d '{
    "strategyId": "rsi",
    "strategyParams": {
      "period": 14,
      "buyThreshold": 30,
      "sellThreshold": 70
    },
    "symbol": "MSFT",
    "numDays": 100,
    "initialCash": 100000
  }'
```

### Example 3: Get Strategies and Select One
```bash
# List available strategies
curl http://localhost:5000/api/strategies

# Get details of specific strategy
curl http://localhost:5000/api/strategies/ma-crossover
```
