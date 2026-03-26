#!/bin/bash

echo "Testing KDB Backtester API"
echo "=============================="
echo ""

BASE_URL="http://localhost:5000/api"

echo "1. Health Check"
curl -s $BASE_URL/health | jq . 2>/dev/null && echo "OK - Health check passed" || echo "FAILED"
echo ""

echo "2. List Strategies"
curl -s $BASE_URL/strategies | jq 'length' 2>/dev/null && echo "OK - Strategies loaded" || echo "FAILED"
echo ""

echo "3. Run Backtest (MA Crossover)"
curl -s -X POST $BASE_URL/backtest \
  -H "Content-Type: application/json" \
  -d '{"strategyId":"ma-crossover","strategyParams":{"fastMA":20,"slowMA":50},"symbol":"AAPL","numDays":50,"initialCash":100000}' | jq '.data.metrics.totalReturn' 2>/dev/null && echo "OK - Backtest executed" || echo "FAILED"
echo ""

echo "4. Sample Data"
curl -s "$BASE_URL/data/sample?symbol=AAPL&numDays=5" | jq 'length' 2>/dev/null && echo "OK - Data retrieved" || echo "FAILED"
echo ""

echo "=============================="
echo "All tests completed!"
