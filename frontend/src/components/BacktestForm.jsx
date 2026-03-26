import React, { useState } from 'react';
import '../styles/BacktestForm.css';

function BacktestForm({ strategy, onSubmit, loading }) {
  const [params, setParams] = useState({});
  const [symbol, setSymbol] = useState('AAPL');
  const [numDays, setNumDays] = useState(252);
  const [initialCash, setInitialCash] = useState(100000);

  const handleParamChange = (paramName, value) => {
    setParams(prev => ({
      ...prev,
      [paramName]: paramName.includes('Threshold') || paramName.includes('Period')
        ? parseInt(value)
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      symbol,
      numDays: parseInt(numDays),
      initialCash: parseFloat(initialCash),
      ...params
    });
  };

  return (
    <div className="backtest-form">
      <h2>Configure Backtest</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Symbol:</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="e.g., AAPL"
          />
        </div>

        <div className="form-group">
          <label>Number of Days:</label>
          <input
            type="number"
            value={numDays}
            onChange={(e) => setNumDays(e.target.value)}
            min="10"
            max="1000"
          />
        </div>

        <div className="form-group">
          <label>Initial Cash:</label>
          <input
            type="number"
            value={initialCash}
            onChange={(e) => setInitialCash(e.target.value)}
            min="1000"
          />
        </div>

        <div className="strategy-params">
          <h3>Strategy Parameters</h3>
          {strategy.params && strategy.params.map(param => (
            <div key={param.name} className="form-group">
              <label>{param.label}:</label>
              <input
                type={param.type}
                value={params[param.name] || param.default}
                onChange={(e) => handleParamChange(param.name, e.target.value)}
                min={param.min}
                max={param.max}
              />
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Running Backtest...' : 'Run Backtest'}
        </button>
      </form>
    </div>
  );
}

export default BacktestForm;
