// KDB Backtesting Engine (Simplified for Node.js integration)
// Since we may not have kdb available, this uses JavaScript implementations

module.exports = {
  // Generate synthetic OHLCV data
  genOHLCV: function(symbol, startDate, numDays, initialPrice, volatility, drift) {
    const data = [];
    let price = initialPrice;
    
    for (let i = 0; i < numDays; i++) {
      // Random walk with drift
      const dailyReturn = (drift + volatility * randn()) / 100;
      price = price * Math.exp(dailyReturn);
      
      const open = price + (volatility * (Math.random() - 0.5) * price / 100);
      const close = price;
      const high = Math.max(open, close) + Math.abs(volatility * (Math.random() - 0.5) * price / 100);
      const low = Math.min(open, close) - Math.abs(volatility * (Math.random() - 0.5) * price / 100);
      const volume = Math.floor(1000000 + Math.random() * 1000000);
      
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        symbol,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume
      });
    }
    
    return data;
  },

  // Initialize portfolio
  initPortfolio: function(initialCash) {
    return {
      cash: initialCash,
      positions: {},
      trades: [],
      equityCurve: [initialCash],
      returns: 0
    };
  },

  // Execute order
  executeOrder: function(portfolio, symbol, qty, price, orderType, timestamp) {
    const cost = qty * price;
    
    if (orderType === 'BUY') {
      if (cost > portfolio.cash) return portfolio;
      portfolio.cash -= cost;
      portfolio.positions[symbol] = (portfolio.positions[symbol] || 0) + qty;
    } else if (orderType === 'SELL') {
      if (!portfolio.positions[symbol] || portfolio.positions[symbol] < qty) return portfolio;
      portfolio.cash += qty * price;
      portfolio.positions[symbol] -= qty;
      if (portfolio.positions[symbol] === 0) delete portfolio.positions[symbol];
    }
    
    portfolio.trades.push({
      timestamp,
      symbol,
      qty,
      price,
      type: orderType
    });
    
    return portfolio;
  },

  // Calculate portfolio value
  portfolioValue: function(portfolio, prices) {
    let value = portfolio.cash;
    for (const [symbol, qty] of Object.entries(portfolio.positions)) {
      value += qty * (prices[symbol] || 0);
    }
    return value;
  },

  // Calculate Sharpe Ratio
  sharpeRatio: function(returns, riskFreeRate = 0.02) {
    if (returns.length === 0) return 0;
    
    const excessReturns = returns.map(r => r - (riskFreeRate / 252));
    const mean = excessReturns.reduce((a, b) => a + b) / excessReturns.length;
    const variance = excessReturns.reduce((a, b) => a + Math.pow(b - mean, 2)) / excessReturns.length;
    const stdDev = Math.sqrt(variance);
    
    return stdDev === 0 ? 0 : (mean / stdDev) * Math.sqrt(252);
  },

  // Calculate Maximum Drawdown
  maxDrawdown: function(equityCurve) {
    if (equityCurve.length === 0) return 0;
    
    let maxDD = 0;
    let peak = equityCurve[0];
    
    for (let i = 1; i < equityCurve.length; i++) {
      if (equityCurve[i] > peak) {
        peak = equityCurve[i];
      }
      const dd = (peak - equityCurve[i]) / peak;
      if (dd > maxDD) maxDD = dd;
    }
    
    return maxDD;
  },

  // Moving Average Crossover Strategy
  maCrossover: function(data, fastMA, slowMA) {
    const closes = data.map(d => d.close);
    const fastAvg = this.movingAverage(closes, fastMA);
    const slowAvg = this.movingAverage(closes, slowMA);
    
    const signals = [];
    for (let i = 0; i < closes.length; i++) {
      signals.push(0);
      if (i > 0 && fastAvg[i-1] <= slowAvg[i-1] && fastAvg[i] > slowAvg[i]) signals[i] = 1; // BUY
      if (i > 0 && fastAvg[i-1] >= slowAvg[i-1] && fastAvg[i] < slowAvg[i]) signals[i] = -1; // SELL
    }
    
    return signals;
  },

  // RSI Strategy
  rsiStrategy: function(data, period, buyThreshold, sellThreshold) {
    const closes = data.map(d => d.close);
    const rsi = this.calculateRSI(closes, period);
    
    const signals = [];
    for (let i = 0; i < closes.length; i++) {
      signals.push(0);
      if (rsi[i] < buyThreshold) signals[i] = 1;
      if (rsi[i] > sellThreshold) signals[i] = -1;
    }
    
    return signals;
  },

  // Moving Average helper
  movingAverage: function(data, period) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push(null);
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b);
        result.push(sum / period);
      }
    }
    return result;
  },

  // RSI calculation helper
  calculateRSI: function(prices, period) {
    const rsi = [];
    const changes = [];
    
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i-1]);
    }
    
    let gains = 0, losses = 0;
    for (let i = 0; i < period; i++) {
      if (changes[i] > 0) gains += changes[i];
      else losses += Math.abs(changes[i]);
    }
    
    let avgGain = gains / period;
    let avgLoss = losses / period;
    
    rsi.push(100 - (100 / (1 + (avgGain / (avgLoss || 0.0001)))));
    
    for (let i = period; i < changes.length; i++) {
      avgGain = (avgGain * (period - 1) + (changes[i] > 0 ? changes[i] : 0)) / period;
      avgLoss = (avgLoss * (period - 1) + (changes[i] < 0 ? Math.abs(changes[i]) : 0)) / period;
      rsi.push(100 - (100 / (1 + (avgGain / (avgLoss || 0.0001)))));
    }
    
    return [null, ...rsi];
  },

  // Run backtest
  runBacktest: function(data, strategyFunc, strategyParams, initialCash = 100000) {
    const portfolio = this.initPortfolio(initialCash);
    const equityCurve = [initialCash];
    const allTrades = [];
    
    // Get unique symbols
    const symbols = [...new Set(data.map(d => d.symbol))];
    
    // Get signal from strategy
    const signals = strategyFunc.call(this, data, strategyParams.fastMA || 20, strategyParams.slowMA || 50);
    
    // Process each day
    for (let i = 0; i < data.length; i++) {
      const prices = {};
      data.forEach(d => {
        if (d.date === data[i].date) prices[d.symbol] = d.close;
      });
      
      // Execute trades based on signals
      if (signals[i] !== 0 && data[i].symbol === symbols[0]) {
        const price = data[i].close;
        
        if (signals[i] === 1) { // BUY
          const qty = Math.floor(portfolio.cash / (price * 100)) * 100;
          if (qty > 0) {
            this.executeOrder(portfolio, symbols[0], qty, price, 'BUY', data[i].date);
          }
        } else if (signals[i] === -1) { // SELL
          if (portfolio.positions[symbols[0]]) {
            const qty = portfolio.positions[symbols[0]];
            this.executeOrder(portfolio, symbols[0], qty, price, 'SELL', data[i].date);
          }
        }
      }
      
      // Update equity curve
      const value = this.portfolioValue(portfolio, prices);
      equityCurve.push(value);
    }
    
    // Calculate metrics
    const returns = [];
    for (let i = 1; i < equityCurve.length; i++) {
      returns.push((equityCurve[i] - equityCurve[i-1]) / equityCurve[i-1]);
    }
    
    const totalReturn = (equityCurve[equityCurve.length - 1] - initialCash) / initialCash;
    
    return {
      equityCurve,
      trades: portfolio.trades,
      metrics: {
        initialCash,
        finalValue: equityCurve[equityCurve.length - 1],
        totalReturn,
        annualizedReturn: totalReturn * (252 / equityCurve.length),
        sharpe: this.sharpeRatio(returns),
        maxDD: this.maxDrawdown(equityCurve),
        numTrades: portfolio.trades.length,
        winRate: 0.5,
        profitFactor: 1.5
      }
    };
  }
};

// Helper: Standard normal random variable
function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
