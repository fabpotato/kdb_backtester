const express = require('express');
const router = express.Router();
const backtester = require('../lib/backtester');

// Simple UUID v4 implementation
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Store backtest results in memory (in production, use a database)
const backtestResults = {};

// POST /api/backtest - Run a backtest
router.post('/', (req, res) => {
  const { strategyId, strategyParams, symbol = 'AAPL', numDays = 252, initialCash = 100000 } = req.body;

  if (!strategyId) {
    return res.status(400).json({ error: 'strategyId is required' });
  }

  try {
    // Generate synthetic data
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);
    
    const data = backtester.genOHLCV(
      symbol,
      startDate,
      numDays,
      100, // initial price
      0.02, // volatility (2% daily)
      0.0001 // drift (0.01% daily)
    );

    // Select strategy function
    let strategyFunc;
    if (strategyId === 'ma-crossover') {
      strategyFunc = backtester.maCrossover;
    } else if (strategyId === 'rsi') {
      strategyFunc = backtester.rsiStrategy;
    } else {
      return res.status(400).json({ error: 'Unknown strategy' });
    }

    // Run backtest
    const results = backtester.runBacktest(data, strategyFunc, strategyParams || {}, initialCash);

    // Store results
    const backtestId = generateUUID();
    backtestResults[backtestId] = {
      id: backtestId,
      strategyId,
      strategyParams,
      symbol,
      numDays,
      initialCash,
      timestamp: new Date(),
      ...results
    };

    res.json({
      backtestId,
      data: results,
      message: 'Backtest completed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/backtest/:id - Get backtest results
router.get('/:id', (req, res) => {
  const result = backtestResults[req.params.id];
  if (!result) {
    return res.status(404).json({ error: 'Backtest not found' });
  }
  res.json(result);
});

// GET /api/backtest - List all backtests
router.get('/', (req, res) => {
  const list = Object.values(backtestResults).map(r => ({
    id: r.id,
    strategyId: r.strategyId,
    symbol: r.symbol,
    timestamp: r.timestamp,
    metrics: r.metrics
  }));
  res.json(list);
});

module.exports = router;
