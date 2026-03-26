import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/ResultsDashboard.css';

function ResultsDashboard({ results }) {
  const metrics = results.metrics;
  const equityCurve = results.equityCurve || [];
  const trades = results.trades || [];

  // Format equity curve for chart
  const chartData = equityCurve.map((value, index) => ({
    day: index,
    equity: parseFloat(value.toFixed(2))
  }));

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercent = (value) => {
    return (value * 100).toFixed(2) + '%';
  };

  return (
    <div className="results-dashboard">
      <h2>Backtest Results</h2>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <label>Total Return</label>
          <div className={`value ${metrics.totalReturn >= 0 ? 'positive' : 'negative'}`}>
            {formatPercent(metrics.totalReturn)}
          </div>
        </div>

        <div className="metric-card">
          <label>Final Value</label>
          <div className="value">{formatCurrency(metrics.finalValue)}</div>
        </div>

        <div className="metric-card">
          <label>Annualized Return</label>
          <div className={`value ${metrics.annualizedReturn >= 0 ? 'positive' : 'negative'}`}>
            {formatPercent(metrics.annualizedReturn)}
          </div>
        </div>

        <div className="metric-card">
          <label>Sharpe Ratio</label>
          <div className="value">{metrics.sharpe.toFixed(2)}</div>
        </div>

        <div className="metric-card">
          <label>Max Drawdown</label>
          <div className="value negative">{formatPercent(metrics.maxDD)}</div>
        </div>

        <div className="metric-card">
          <label>Trades Executed</label>
          <div className="value">{metrics.numTrades}</div>
        </div>
      </div>

      {/* Equity Curve Chart */}
      <div className="chart-container">
        <h3>Equity Curve</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(label) => `Day ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="equity" 
              stroke="#2563eb" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trades Log */}
      {trades && trades.length > 0 && (
        <div className="trades-container">
          <h3>Trade Log</h3>
          <div className="trades-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Symbol</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice(0, 20).map((trade, idx) => (
                  <tr key={idx}>
                    <td>{trade.timestamp}</td>
                    <td>{trade.symbol}</td>
                    <td className={trade.type === 'BUY' ? 'buy' : 'sell'}>
                      {trade.type}
                    </td>
                    <td>{trade.qty}</td>
                    <td>{formatCurrency(trade.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {trades.length > 20 && (
              <p className="trades-note">Showing first 20 of {trades.length} trades</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsDashboard;
