# PolicyForge

### Simulate. Stress-Test. Decide.

**PolicyForge** is an AI-powered policy decision-support platform engineered to explore, stress-test, and evaluate policy interventions before they reach the real world. By separating rigorous deterministic numerical simulation from generative AI interpretation, PolicyForge ensures governance outcomes are mathematically auditable while delivering nuanced, actionable decision intelligence.

---

## Problem

Public policy interventions—from urban public transit scheduling to national goods and services taxation—are high-stakes, capital-intensive decisions with complex second-order effects. Traditional policy modeling is often:
* **Siloed & Inflexible**: Spread across disparate spreadsheets and monolithic legacy scripts that cannot be rapidly reconfigured.
* **Unpredictable AI Over-Reliance**: Attempting to generate raw fiscal and transit numbers with LLMs leads to hallucinated figures and ungrounded forecasts.
* **Risk-Blind**: Policies are frequently evaluated against optimistic baselines without systematic multi-scenario stress-testing.

---

## Solution

PolicyForge provides an end-to-end framework built on three non-negotiable principles:
1. **Numbers are Deterministic**: Core simulations (ridership, waiting times, operating costs, tax bracket yields, elasticity shifts) run on verifiable mathematical models.
2. **Analysis is AI-Assisted**: Generative AI (Gemini) is utilized strictly to analyze outcomes, uncover hidden trade-offs, identify edge-case risks, and synthesize human-readable executive briefs.
3. **Decisions Stay Human**: Policy leaders retain total control over assumption weights, parameter baselines, and implementation choices.

---

## Policy Domains

PolicyForge operates two completely independent policy modules sharing core platform design and AI analytics infrastructure:

### 1. 🚌 Bus Policy Stress Tester
Models urban transport interventions to assess their impact on network capacity, passenger waiting times, route-level ridership, and recurring operating costs across varying demand surges and fleet constraints.

### 2. 🧾 GST Policy Simulator
Explores indirect tax policy scenarios, rate bracket restructuring, exemption shifts, and revenue impacts under configurable consumption elasticities and compliance assumptions.

---

## Tech Stack

### Frontend
* **React 19** & **Vite**: Rapid, high-performance modular client application.
* **Tailwind CSS**: Bespoke, restrained dark-mode design system with crisp typographic hierarchy.
* **React Router v6**: Client-side routing with deep state preservation across domain pages.
* **Axios**: Configured client with automated backend health and readiness telemetry.
* **Lucide React**: Clean, semantic vector iconography.

### Backend
* **Python 3.14+** & **FastAPI**: Asynchronous high-performance REST API.
* **Pydantic v2**: Strict schema validation and type-safe payload boundaries.
* **NumPy & Pandas**: High-throughput vectorized numerical simulation engines.
* **Uvicorn**: Production-grade ASGI server with hot reloading.

---

## System Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                      PolicyForge Frontend                     │
│      React 19 • Tailwind CSS • Lucide • React Router          │
└──────────────┬────────────────────────────────┬───────────────┘
               │                                │
        /api/bus (JSON)                  /api/gst (JSON)
               │                                │
┌──────────────▼────────────────────────────────▼───────────────┐
│                      FastAPI Backend Gateway                  │
│                     (CORS, Schemas, Routing)                  │
├───────────────────────────────┬───────────────────────────────┤
│    Bus Policy Engine Core     │    GST Policy Engine Core     │
│   (Transit, Capacity, Cost)   │   (Tax Brackets, Fiscal)      │
├───────────────────────────────┴───────────────────────────────┤
│            Gemini AI Policy Intelligence Layer                │
│         (Trade-off synthesis, Risk explanation)               │
└───────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```text
policyforge/
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI elements (Navbar, Button, Card, etc.)
│   │   ├── pages/              # Domain views (LandingPage, BusPage, GstPage)
│   │   ├── layouts/            # Master application wrappers
│   │   ├── services/           # Backend API clients
│   │   ├── hooks/              # Custom React hooks (telemetry, state)
│   │   ├── utils/              # Utility helpers
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx            # Application entry point
│   │   └── index.css           # Design tokens & base styles
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── routes/             # API routers (bus.py, gst.py)
│   │   ├── services/           # Simulation services (bus/, gst/)
│   │   ├── models/             # Internal domain models
│   │   ├── schemas/            # Pydantic response/request models
│   │   ├── utils/              # Shared backend helpers
│   │   └── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   └── requirements.txt        # Backend dependencies
│
├── data/
│   ├── bus/                    # Transit datasets & route schedules
│   └── gst/                    # Tax brackets, revenue baselines
│
├── README.md                   # Comprehensive documentation
├── .gitignore                  # Git ignore rules
└── .env.example                # Environment configuration template
```

---

## Local Setup

### 1. Prerequisites
* **Node.js**: v18+ (tested on v24)
* **Python**: 3.10+ (tested on Python 3.14)
* **Git**

### 2. Backend Setup
1. Open a terminal in the project directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Launch the FastAPI server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```
4. Verify backend endpoints:
   * Health check: `http://localhost:8000/api/health`
   * Bus status check: `http://localhost:8000/api/bus`
   * Deterministic Bus Simulation API: `POST http://localhost:8000/api/bus/simulate`
   * Interactive OpenAPI Docs: `http://localhost:8000/docs`

#### Bus Simulation Engine (`POST /api/bus/simulate`)
The bus policy engine calculates deterministic, reproducible mathematical projections:
* **Capacity & Headway**: `DailyCapacity = Fleet × CapacityPerBus × TripsPerBusPerDay`
* **Demand Elasticity**: Empirical ridership response `DemandChange = DemandElasticity × ServiceChange`
* **Waiting Time Sensitivity**: Approximation based on queue pressure ratios `(ProposedPressure / CurrentPressure)^alpha`
* **Fiscal Metrics**: Operational expenditure, farebox revenues, and daily operating surplus
* **Carbon Emissions**: Fuel consumption and CO₂ footprint calculations

> **Note on Scenario Estimates**:
> The bus policy engine is purely deterministic and produces transparent scenario estimates based on configurable assumptions. The waiting-time and demand-response models are sensitivity approximations designed for decision support; real-world deployment would require calibrated empirical transit data. The model is not claimed to be a guaranteed real-world forecast.

### 3. Frontend Setup
1. Open a new terminal in the project directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web interface at `http://localhost:5173`.

---

## Development Roadmap

```text
Commit 1  → Project foundation (Pristine architecture, routing, design system & API placeholders)  [ACTIVE]
Commit 2  → Bus policy UI (Route & fleet intervention configuration panels)
Commit 3  → Bus simulation engine (Deterministic queue & headway modeling)
Commit 4  → Bus scenario comparison (Multi-policy delta analysis)
Commit 5  → Bus stress testing and risk scoring (Surge simulation & capacity thresholds)
Commit 6  → Independent GST simulator (Fiscal rates, consumption elasticity, bracket modeling)
Commit 7  → Gemini AI analyst (Automated policy brief & trade-off synthesis)
Commit 8  → Unified analytics dashboard (Cross-domain impact visualization)
Commit 9  → Explainability and reliability (Sensitivity metrics & audit trails)
Commit 10 → Final hackathon polish (End-to-end integration & performance hardening)
```

---

## License

Built for hackathon innovation. Confidential and proprietary.
