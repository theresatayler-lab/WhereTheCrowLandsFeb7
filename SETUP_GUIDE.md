# Where The Crowlands - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd crowlands

# Backend setup
cd backend
pip install -r requirements.txt
cp .env.example .env  # Then edit with your keys

# Frontend setup
cd ../frontend
yarn install
cp .env.example .env  # Then edit with your backend URL
```

### Running Locally

```bash
# Terminal 1 - Backend
cd backend
uvicorn server:app --reload --port 8001

# Terminal 2 - Frontend
cd frontend
yarn start
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
# Required
MONGO_URL=mongodb://localhost:27017
DB_NAME=crowlands

# LLM Keys (choose based on your setup)
EMERGENT_LLM_KEY=sk-emergent-xxx        # For Emergent Universal Key
OPENAI_API_KEY=sk-xxx                    # For direct OpenAI
DEEPSEEK_API_KEY=sk-xxx                  # For DeepSeek

# Payments
STRIPE_API_KEY=sk_test_xxx               # Stripe secret key
```

### Frontend (`frontend/.env`)

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## Project Structure

```
/app
├── backend/
│   ├── server.py              # Main FastAPI application
│   ├── llm_providers.py       # LLM routing abstraction
│   ├── persona_config.py      # AI guide personalities
│   ├── research_service.py    # Spell research service
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables (NOT in git)
│
├── frontend/
│   ├── public/
│   │   └── images/            # ALL ASSETS ARE HERE (in git)
│   │       ├── guides/        # Character images & videos
│   │       ├── brand/         # Logo, crow avatar
│   │       ├── backgrounds/   # Page backgrounds
│   │       ├── borders/       # Decorative borders
│   │       └── ui/            # UI elements
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── data/              # Static data (archetypes, etc.)
│   │   └── assets/            # SVG ornaments
│   ├── package.json           # Node dependencies
│   └── .env                   # Environment variables (NOT in git)
│
├── memory/
│   └── PRD.md                 # Product requirements
│
└── SETUP_GUIDE.md             # This file
```

---

## Assets & Images

**All images are stored locally in the repository** at:
```
frontend/public/images/
```

This includes:
- 28 character images (~55MB)
- 4 character videos (~20MB)
- Brand assets (logo, crow avatar)
- Background images
- Decorative borders

**Total: ~115MB of assets committed to Git**

See `frontend/public/images/ASSET_MANIFEST.md` for complete inventory.

---

## Verifying Your GitHub Save

After pushing to GitHub, verify assets are saved:

1. **On GitHub.com:**
   - Navigate to `frontend/public/images/`
   - You should see folders: `backgrounds/`, `borders/`, `brand/`, `guides/`, `ui/`
   - Click into `guides/shigg/` - you should see 10 PNG files

2. **After cloning fresh:**
   ```bash
   git clone <your-repo>
   ls frontend/public/images/guides/shigg/
   # Should show: shigg-main.png, shigg-19.png, etc.
   ```

3. **Check total size:**
   ```bash
   du -sh frontend/public/images/
   # Should be ~115MB
   ```

---

## Database Collections

The app uses these MongoDB collections:

| Collection | Purpose |
|------------|---------|
| `waitlist` | Early access signups |
| `spells` | Generated spells |
| `users` | User accounts |
| `invisible_helpers` | Battle cry generation tracking |
| `handcrafted_orders` | Premium product orders |
| `timeline_events` | Historical timeline data |

---

## API Keys Required

| Service | Variable | Required For |
|---------|----------|--------------|
| MongoDB | `MONGO_URL` | Database |
| Emergent | `EMERGENT_LLM_KEY` | Claude/GPT via Emergent |
| OpenAI | `OPENAI_API_KEY` | Direct OpenAI (alternative) |
| DeepSeek | `DEEPSEEK_API_KEY` | Research/analysis |
| Stripe | `STRIPE_API_KEY` | Payments |

---

## Deployment Notes

### For Vercel/Netlify (Frontend)
- Set `REACT_APP_BACKEND_URL` to your backend URL
- Build command: `yarn build`
- Output directory: `build`

### For Railway/Render (Backend)
- Set all backend env vars
- Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

### For Emergent Platform
- All configuration is automatic
- Just push to GitHub and deploy

---

## Troubleshooting

### Images not loading?
- Check browser console for 404 errors
- Verify images exist in `frontend/public/images/`
- Paths should be like `/images/guides/shigg/shigg-main.png`

### API errors?
- Check backend logs for missing env vars
- Verify MongoDB connection
- Check LLM API key is valid

### Payments not working?
- Verify Stripe key in backend `.env`
- Use test keys for development (`sk_test_...`)
