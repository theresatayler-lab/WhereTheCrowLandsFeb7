#!/usr/bin/env bash
# Start the Crowlands backend locally.
# Creates backend/venv on first run, installs deps, then launches uvicorn on port 8000.
# Requires backend/.env with MONGO_URL and API keys (never committed).

set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .env ]; then
    echo "ERROR: backend/.env not found. Copy your API keys and MONGO_URL into backend/.env first."
    exit 1
fi

if [ ! -d venv ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "Installing/updating dependencies..."
pip install -q -r requirements.txt

echo "Starting backend on http://localhost:8000 ..."
exec uvicorn server:app --reload --port 8000
