# Troubleshooting Guide

## Issue: npm start not working

### Problem 1: Port 5000 Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find and kill process on port 5000
lsof -i :5000 | awk 'NR > 1 {print $2}' | xargs kill -9

# Then try again
npm run backend
```

### Problem 2: Node.js Version Too Old

**Error**: `Vite requires Node.js version 20.19+ or 22.12+`

**Current**: Node v15.14.0
**Required for frontend**: Node 20+
**Backend**: Works on Node 15+

**Solution - Run Backend Only**:
```bash
npm run backend
```
This starts the API on http://localhost:5000

**API Testing** (no frontend needed):
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/strategies
bash test_api.sh
```

### Problem 3: Port 3000 Already in Use

**Error**: `Error: Port 3000 is in use`

**Solution**:
```bash
# Kill process on port 3000
lsof -i :3000 | awk 'NR > 1 {print $2}' | xargs kill -9

# Then restart
npm run frontend
```

## Recommended Workaround for Your Setup

Since you have Node 15, use **backend only**:

```bash
npm run backend
```

This will:
- ✅ Start Express API on port 5000
- ✅ Allow API testing with curl or Postman
- ✅ Work perfectly with the backtesting engine
- ⏳ Skip the frontend (requires Node 20+)

### Test It:
```bash
# Health check
curl http://localhost:5000/api/health

# Run a backtest
curl -X POST http://localhost:5000/api/backtest \
  -H "Content-Type: application/json" \
  -d '{"strategyId":"ma-crossover","strategyParams":{"fastMA":20,"slowMA":50},"symbol":"AAPL","numDays":50,"initialCash":100000}'

# Run all tests
bash test_api.sh
```

## Option A: Run Both (If you upgrade Node to 20+)

First, upgrade Node.js:
```bash
# Using Homebrew
brew install node@20
brew link node@20 --force

# Or using NVM
nvm install 20
nvm use 20
```

Then:
```bash
npm run dev
# or
npm start
```

## Option B: Frontend via Python (Browser Access)

If you want browser access but don't want to upgrade Node:

```bash
# Terminal 1
npm run backend

# Terminal 2 - Build frontend
cd frontend
npm run build

# Terminal 3 - Serve with Python
cd dist
python -m http.server 3000
```

Then open: http://localhost:3000

## Option C: Docker (All in One)

```bash
docker run -p 5000:5000 -p 3000:3000 node:20 \
  bash -c "cd /Users/raj/kdb_backtester && npm start"
```

## Quick Diagnostic

```bash
# Check Node version
node --version

# Check ports in use
lsof -i :5000
lsof -i :3000

# Check npm version
npm --version

# Check if npm modules exist
ls -la backend/node_modules frontend/node_modules
```

## Environment Configuration

Change backend port if needed in `backend/.env`:

```
PORT=5001
NODE_ENV=development
```

Then restart with:
```bash
npm run backend
```

## Working Solution for Your System

### Step 1: Clear any stuck processes
```bash
# Kill any existing Node processes (manually if needed)
ps aux | grep node
# Look for any node processes and note their PID, then: kill <PID>
```

### Step 2: Start Backend Only
```bash
cd /Users/raj/kdb_backtester
npm run backend
```

### Step 3: Test in Another Terminal
```bash
bash test_api.sh
```

This should work without any Node version issues!

## If Still Failing

Check the exact error:
```bash
cd /Users/raj/kdb_backtester/backend
node server.js 2>&1 | head -30
```

Common issues:
- `EADDRINUSE`: Port in use (change in .env)
- `MODULE_NOT_FOUND`: Missing dependencies (run `npm install`)
- `SyntaxError`: Node version too old (use backend only)

## Production Setup

For production, use Node 20+:
```bash
# Use nvm to specify Node version
echo "20" > .nvmrc
nvm use 20
npm install
npm start
```
