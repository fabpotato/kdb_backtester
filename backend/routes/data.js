const express = require('express');
const router = express.Router();
const backtester = require('../lib/backtester');

// GET /api/data/sample - Get sample market data
router.get('/sample', (req, res) => {
  const { symbol = 'AAPL', numDays = 252 } = req.query;

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);
    
    const data = backtester.genOHLCV(
      symbol,
      startDate,
      parseInt(numDays),
      100,
      0.02,
      0.0001
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
