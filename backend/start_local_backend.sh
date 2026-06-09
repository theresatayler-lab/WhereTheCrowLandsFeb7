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

# Core packages the server needs at runtime. requirements.txt pins versions
# that need Python 3.11+, so on older Pythons we install these unpinned instead.
CORE_DEPS=(fastapi "uvicorn[standard]" motor python-dotenv bcrypt PyJWT anthropic openai stripe slowapi email-validator aiohttp requests)

if python -c "import fastapi, motor, jwt, anthropic, openai, stripe, slowapi, uvicorn" 2>/dev/null; then
    echo "Dependencies already installed — skipping pip install."
elif python -c "import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)"; then
    echo "Installing pinned dependencies from requirements.txt..."
    pip install -q -r requirements.txt
else
    echo "Python < 3.11 detected — installing core dependencies unpinned..."
    pip install -q "${CORE_DEPS[@]}"
fi

echo "Starting backend on http://localhost:8000 ..."
exec uvicorn server:app --reload --port 8000
