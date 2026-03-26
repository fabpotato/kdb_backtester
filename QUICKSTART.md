# Getting Started

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

This will install dependencies for the root, backend, and frontend projects.

### 2. Start Development Servers

Open two terminal windows:

**Terminal 1 - Backend API (Port 5000)**
```bash
npm run backend
```

**Terminal 2 - React Frontend (Port 3000)**
```bash
npm run frontend
```

Or run both simultaneously:
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: http://localhost:3000

## Testing

### Test Backend API
```bash
# Health check
curl http://localhost:5000/api/health

# List strategies
curl http://localhost:5000/api/strategies

# Run backtest
curl -X POST http://localhost:5000/api/backtest \
  -H "Content-Type: application/json" \
  -d '{
    "strategyId": "ma-crossover",
    "strategyParams": {"fastMA": 20, "slowMA": 50},
    "symbol": "AAPL",
    "numDays": 100,
    "initialCash": 100000
  }'
```

## Usage Steps

1. Select a strategy from the left sidebar
2. Adjust strategy parameters and backtest settings
3. Click "Run Backtest"
4. View results: equity curve, metrics, and trade log

## Troubleshooting

**Port Already in Use**
- Change port in backend/.env or frontend/vite.config.js
- Kill process: `kill <PID>` (get PID from `lsof -i :<port>`)

**Module Not Found Errors**
- Run `npm install` in the affected directory
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**CORS Issues**
- Backend CORS is configured to accept localhost:3000
- Update `backend/server.js` if frontend runs on different port

## Project Structure

```
├── backend/        # Express.js API server
│  ├── lib/         # Backtesting engine
│  ├── routes/      # API endpoints
│  └── server.js    # Server entry point
├── frontend/       # React web application
│  ├── src/         # React components
│  ├── vite.config.js
│  └── index.html
└── README.md
```

## API Reference

See [API Documentation](./API.md) for detailed endpoint reference.
