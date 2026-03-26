import React from 'react';
import '../styles/StrategySelector.css';

function StrategySelector({ strategies, selectedStrategy, onSelect }) {
  return (
    <div className="strategy-selector">
      <h2>Strategies</h2>
      <div className="strategy-list">
        {strategies.map(strategy => (
          <div
            key={strategy.id}
            className={`strategy-card ${selectedStrategy?.id === strategy.id ? 'active' : ''}`}
            onClick={() => onSelect(strategy)}
          >
            <h3>{strategy.name}</h3>
            <p>{strategy.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StrategySelector;
