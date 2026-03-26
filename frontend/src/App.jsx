import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StrategySelector from './components/StrategySelector';
import BacktestForm from './components/BacktestForm';
import ResultsDashboard from './components/ResultsDashboard';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backtestResults, setBacktestResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const response = await axios.get(`${API_BASE}/strategies`);
      setStrategies(response.data);
    } catch (err) {
      setError('Failed to load strategies: ' + err.message);
    }
  };

  const handleStrategySelect = (strategy) => {
    setSelectedStrategy(strategy);
  };

  const handleRunBacktest = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/backtest`, {
        strategyId: selectedStrategy.id,
        strategyParams: params,
        ...params
      });
      setBacktestResults(response.data.data);
    } catch (err) {
      setError('Backtest failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📊 KDB Backtester</h1>
        <p>Test trading algorithms with historical data</p>
      </header>

      <div className="app-container">
        <div className="sidebar">
          <StrategySelector 
            strategies={strategies}
            selectedStrategy={selectedStrategy}
            onSelect={handleStrategySelect}
          />
        </div>

        <div className="main-content">
          {error && <div className="error-message">{error}</div>}

          {selectedStrategy && (
            <BacktestForm
              strategy={selectedStrategy}
              onSubmit={handleRunBacktest}
              loading={loading}
            />
          )}

          {backtestResults && (
            <ResultsDashboard results={backtestResults} />
          )}

          {!selectedStrategy && (
            <div className="placeholder">
              <p>Select a strategy to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
