# 🚀 Quick Start Checklist

Your KDB Backtester is complete and ready to use! Follow these steps to get started.

## Prerequisites Check
- [ ] Node.js v15+ installed
- [ ] npm v7+ installed
- [ ] Port 5000 and 3000 are available

## Installation (1 minute)
```bash
cd /Users/raj/kdb_backtester
npm install
```

## Start Servers

### Option A: Run Both (Easiest)
```bash
npm run dev
```
Then open: http://localhost:3000

### Option B: Run Separately

**Terminal 1 - Backend**
```bash
npm run backend
```

**Terminal 2 - Frontend**
```bash
npm run frontend
```

Then open: http://localhost:3000

## Test the System

### Quick API Test
```bash
bash test_api.sh
```

Expected output: All tests should show "OK"

### Manual API Test
```bash
# Health check
curl http://localhost:5000/api/health

# List strategies
curl http://localhost:5000/api/strategies

# Run backtest
curl -X POST http://localhost:5000/api/backtest \
  -H "Content-Type: application/json" \
  -d '{"strategyId":"ma-crossover","strategyParams":{"fastMA":20,"slowMA":50},"symbol":"AAPL","numDays":100,"initialCash":100000}'
```

## Using the Web Interface

1. Open http://localhost:3000 in your browser
2. **Select Strategy** - Choose from the left sidebar
3. **Configure** - Adjust parameters as needed:
   - Symbol: Stock ticker (e.g., AAPL, MSFT)
   - Number of Days: Historical period (10-1000)
   - Initial Cash: Starting portfolio value
   - Strategy Parameters: Algorithm-specific settings
4. **Run Backtest** - Click the button and wait for results
5. **View Results** - Charts and metrics will appear below

## Key Features Explained

### Strategies Available
- **Moving Average Crossover**: Fast MA crosses slow MA
- **RSI Overbought/Oversold**: Buy/sell based on RSI levels
- **Momentum**: Price momentum-based trading

### Metrics Displayed
- **Total Return**: Overall profit/loss percentage
- **Annualized Return**: Extrapolated annual performance
- **Sharpe Ratio**: Risk-adjusted return (higher = better)
- **Max Drawdown**: Largest peak-to-trough decline
- **Trades**: Number of buy/sell executed
- **Equity Curve**: Portfolio value over time (chart)
- **Trade Log**: Detailed list of all trades

## Project Structure

```
kdb_backtester/
├── backend/               # Express.js API
├── frontend/              # React web app
├── README.md             # Full documentation
├── API.md                # API reference
├── QUICKSTART.md         # Quick start guide
├── IMPLEMENTATION_SUMMARY.md  # Implementation details
└── test_api.sh           # API test script
```

## Common Tasks

### Add New Strategy
1. Create strategy function in `backend/lib/backtester.js`
2. Add to strategies list in `backend/routes/strategies.js`
3. Update frontend parameters if needed

### Change Backend Port
Edit `backend/.env`:
```
PORT=5001
```

### Change Frontend Port
Edit `frontend/vite.config.js`:
```javascript
server: {
  port: 3001,
  ...
}
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Port already in use" | Kill process: `lsof -i :5000` then `kill -9 <PID>` |
| Module not found | Run `npm install` in affected directory |
| Blank frontend | Check browser console for errors, ensure backend is running |
| Backtest fails | Check strategy ID, validate JSON parameters |

## Documentation

- **README.md** - Complete project overview
- **API.md** - All endpoints with examples
- **QUICKSTART.md** - Getting started guide
- **IMPLEMENTATION_SUMMARY.md** - Architecture and features

## Next Steps

1. ✅ Verify installation works
2. ✅ Run test script
3. ✅ Open web interface
4. ✅ Try different strategies
5. ✅ Experiment with parameters
6. ⚡ Ready to extend with your own strategies!

## Tips

- Smaller datasets test faster
- RSI works well with volatile stocks
- MA Crossover needs sufficient periods
- Start with default parameters
- Check equity curve shape for strategy success

---

**Happy Backtesting! 📊**

For more details, see README.md or API.md
