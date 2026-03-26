const express = require('express');
const router = express.Router();

const STRATEGIES = [
  {
    id: 'ma-crossover',
    name: 'Moving Average Crossover',
    description: 'Buys when fast MA crosses above slow MA, sells when it crosses below',
    params: [
      { name: 'fastMA', label: 'Fast MA Period', type: 'number', default: 20, min: 5, max: 100 },
      { name: 'slowMA', label: 'Slow MA Period', type: 'number', default: 50, min: 10, max: 200 }
    ]
  },
  {
    id: 'rsi',
    name: 'RSI Overbought/Oversold',
    description: 'Buys when RSI < threshold (oversold), sells when RSI > threshold (overbought)',
    params: [
      { name: 'period', label: 'RSI Period', type: 'number', default: 14, min: 5, max: 30 },
      { name: 'buyThreshold', label: 'Buy Threshold', type: 'number', default: 30, min: 10, max: 50 },
      { name: 'sellThreshold', label: 'Sell Threshold', type: 'number', default: 70, min: 50, max: 90 }
    ]
  },
  {
    id: 'momentum',
    name: 'Momentum Strategy',
    description: 'Trades based on price momentum over a defined period',
    params: [
      { name: 'period', label: 'Momentum Period', type: 'number', default: 20, min: 5, max: 100 }
    ]
  }
];

// GET /api/strategies - List all strategies
router.get('/', (req, res) => {
  res.json(STRATEGIES);
});

// GET /api/strategies/:id - Get specific strategy
router.get('/:id', (req, res) => {
  const strategy = STRATEGIES.find(s => s.id === req.params.id);
  if (!strategy) {
    return res.status(404).json({ error: 'Strategy not found' });
  }
  res.json(strategy);
});

module.exports = router;
