# Policy+ Preview Run Doc

## How to Reproduce Uncommitted Artifacts

1. **Backend `.env`**: Copy `.env` from the main checkout root (`C:\Policy-plus\.env`) into the project root. It already contains `GEMINI_API_KEY`, `VITE_API_BASE_URL`, and other config.

2. **Backend dependencies**: `cd backend && pip install -r requirements.txt` (includes `google-genai>=2.11.0`).

3. **Frontend dependencies**: `cd frontend && npm install`.

4. **Python backend must be running** on port 8000 before starting the frontend dev server (the frontend proxies `/api` requests to it).

## How to Run the Server

1. **Start the backend** (if not already running):
   ```bash
   cd backend
   python -m uvicorn main:app --reload --port 8000
   ```

2. **Start the frontend dev server**:
   ```bash
   cd frontend
   npm run dev
   ```
   This starts Vite on port 5173 with a proxy to `http://localhost:8000` for `/api` routes.

3. **Access**: `http://localhost:5173`

## Key Notes

- Gemini API key is backend-only (never exposed to React).
- The AI analysis button requires a valid `GEMINI_API_KEY` in the backend `.env`.
- All simulation, scenario, stress testing, and risk scoring work without the Gemini key.
