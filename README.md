# Policy+

### Simulate. Stress-Test. Decide.

Explore the consequences of policy decisions before they reach the real world.

---

## What is Policy+?

Policy+ is an AI-assisted policy stress-testing and decision-support platform. It allows users to model policy interventions, compare scenarios, deliberately stress-test assumptions, quantify deterministic risk, and use Gemini to interpret the resulting trade-offs.

---

## The Problem

Policy decisions often involve uncertainty, competing objectives, and unintended consequences.

Traditional dashboards describe what has already happened.

Policy+ asks:

> **"What could happen if we change the policy?"**

---

## The Solution

Policy+ provides a structured workflow:

1. **Define a policy** with baseline and target intervention parameters.
2. **Simulate outcomes** using pure, verifiable deterministic models.
3. **Compare scenarios** across multi-tier expansion and rationalization matrices.
4. **Attack the policy** with adverse demand, cost, and compliance shocks.
5. **Calculate deterministic policy risk** across four weighted, auditable dimensions.
6. **Ask Gemini to interpret the validated results** into clear strategic trade-off narratives.
7. **Support a human decision** with transparent evidence and auditable audit trails.

---

## Key Features

- 🚌 **Bus Policy Stress Tester**: Urban transit capacity, waiting time, and depot cost simulation.
- 🧾 **GST Policy Simulator**: Macroeconomic indirect tax slabs, compliance leakage, and revenue yield modeling.
- **Scenario comparison**: Side-by-side matrices across conservative, balanced, and aggressive policy tiers.
- **Sensitivity analysis**: Interactive curves illustrating non-linear demand and fiscal response.
- **Attack My Policy**: Deliberately tests policies against adverse shocks to uncover vulnerabilities.
- **Best / Expected / Worst Tested scenarios**: Transparent analytical outcome bounds.
- **Deterministic Policy Risk Engine**: Mathematical 0–100 risk scoring with transparent weight attributions.
- **Gemini AI Policy Analyst**: Grounded analytical reports without mathematical hallucination.
- **Explainable risk breakdown**: Transparent dimensional weights and ranked diagnostic drivers.
- **Configurable assumptions**: Real-time adjustable elasticity, turnaround frequencies, and fuel burn rates.
- **Human-in-the-loop decision support**: Clear governance boundaries where AI interprets and humans decide.

---

## Architecture

```text
                        POLICY+
                           │
             ┌─────────────┴─────────────┐
             │                           │
       🚌 BUS MODULE                🧾 GST MODULE
             │                           │
     Deterministic Engine        Deterministic Engine
             │                           │
      Stress Testing             Stress Testing
             │                           │
        Risk Engine                 Risk Engine
             │                           │
             └─────────────┬─────────────┘
                           │
                    Validated Results
                           ↓
                 Gemini Policy Analyst
                           ↓
                    Human Decision
```

---

## Why Gemini Does Not Calculate the Numbers

Policy+ deliberately separates computation from interpretation. Deterministic Python engines calculate policy metrics, scenario outcomes, stress-test results, and risk scores. Gemini receives these validated results and acts as an AI policy analyst that explains risks, trade-offs, assumptions, and implications.

```text
Deterministic Engine → Numbers
Gemini → Interpretation
Human → Decision
```

This strict architectural separation ensures zero mathematical hallucinations while leveraging state-of-the-art LLM reasoning for high-level decision intelligence.

---

## Tech Stack

### Frontend
- **React** (v18+)
- **Vite**
- **Tailwind CSS**
- **Recharts**
- **Lucide React**

### Backend
- **Python** (3.11+)
- **FastAPI**
- **Pydantic** (v2)
- **NumPy**
- **Pandas**

### AI
- **Google Gemini API** (`gemini-2.5-flash` via official Google GenAI SDK)

### Communication
- **REST API** (JSON payloads with OpenAPI schemas)

---

## Modules

### 🚌 Bus Policy Stress Tester
Models urban public transport interventions to assess their impact on network capacity, passenger waiting times, route-level ridership, operating costs, and carbon emissions.
- **Fleet expansion**: Models fleet additions from 0% to +50%.
- **Capacity & Ridership**: Evaluates daily capacity ($Fleet \times Capacity \times Trips$) against elasticity-adjusted demand.
- **Queue Sensitivity**: Estimates passenger waiting times based on capacity load pressure.
- **Operating Surplus & Emissions**: Tracks daily depot operating costs, passenger tariff yields, and carbon footprints.
- **Stress Testing**: Evaluates resilience under demand spikes (+10%, +20%, +30%) and depot cost inflation (+10%, +20%).
- **Risk Engine**: Quantifies financial, capacity, demand, and utilization risk dimensions.

### 🧾 GST Policy Simulator
Explores macroeconomic indirect tax restructuring across essential, standard, and luxury consumption sectors under configurable compliance and demand elasticity assumptions.
- **Slab Rate Restructuring**: Models shifts between statutory slabs (0%, 5%, 12%, 18%, 28%).
- **Tax Base & Net Revenue**: Computes Net Revenue = Gross Revenue - Input Tax Credit (ITC) Refunds.
- **Macroeconomic Stress Shocks**: Evaluates compliance leakage shocks (-10%, -20%), consumption slumps, and combined stagflation.
- **4-Dimension Risk Scoring**: Assesses Revenue Volatility (30%), Inflationary Pressure (25%), Small Business Compliance Burden (25%), and Sector Disruption (20%).
- **Illustrative Nature**: GST calculations are illustrative scenario explorations and not official Ministry of Finance or GST Council estimates.

---

## Responsible AI

Policy+ is a decision-support prototype, not an autonomous policy-making system.

The simulation outputs depend on configurable assumptions.

Gemini does not determine policy metrics, calculate the risk score, or make autonomous policy decisions.

AI output is explanatory and should always be reviewed by a human policymaker.

---

## Limitations

- **Simplified Prototypes**: Models are designed for rapid scenario exploration, not operational transit dispatch or statutory tax collection.
- **Configurable Assumptions**: Outputs reflect tested assumptions and sensitivity coefficients rather than definitive predictive forecasts.
- **Illustrative GST Figures**: GST calculations are illustrative macroeconomic approximations and not official government revenue estimates.
- **Queueing Approximations**: Transit waiting times use queue-pressure sensitivity approximations rather than micro-simulated dynamic traffic assignment.
- **Data Calibration**: Real-world deployment would require integration with localized transit smart-card records and empirical tax filing telemetry.

---

## Future Scope

- Integration with validated open government transit and fiscal datasets.
- Domain-specific empirical elasticity calibration by municipal tier.
- Historical backtesting against past policy reforms and transit route expansions.
- Geographic GIS spatial analysis and multi-modal transit interchange modeling.
- Additional policy domains (e.g., healthcare capacity, renewable energy subsidies).
- Advanced Bayesian uncertainty modeling and confidence interval generation.
- Real-time policy monitoring and automated telemetry alerts post-implementation.

---

## Run Locally

### 1. Prerequisites
- Node.js (v18+) & npm
- Python (v3.11+) & pip

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Environment Variables
Create `.env` in the project root:
```env
# Backend environment only
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend environment
VITE_API_URL=http://localhost:8000
```
> **Security Notice**: The Gemini API key belongs **strictly** in the backend environment. Never expose API keys to frontend builds or version control.

---

## Recommended Demo Flow

1. **Open Bus Policy Stress Tester**: Navigate to `/bus` on the application dashboard.
2. **Configure a Fleet Expansion**: Adjust the fleet expansion slider to +20% and view instantaneous KPI updates.
3. **Run the Simulation**: Observe deterministic metrics for daily ridership, wait times, operating costs, and emissions.
4. **Compare Policy Scenarios**: Review the multi-tier matrix comparing 0% baseline up to +50% aggressive expansion.
5. **Click Attack My Policy**: Subject the +20% expansion to adversarial demand surges and operating cost inflation.
6. **Show First Problematic Tested Scenario**: Point out the earliest tested scenario breaching stability thresholds.
7. **Show Deterministic Risk Score**: Walk through the 0–100 composite risk score, dimensional weights, and ranked top drivers.
8. **Click Analyze with Gemini**: Trigger the Gemini Policy Analyst to synthesize strategic trade-offs and policy recommendations.
9. **Show AI Explanation of Trade-offs**: Emphasize how Gemini references validated numbers rather than calculating them.
10. **Emphasize Human Governance**: Conclude on the core principle: *Deterministic simulations. AI-assisted analysis. Human-led decisions.*

---

## License & Attribution

Policy+ is developed as an AI-powered policy intelligence prototype.

**Simulate. Stress-Test. Decide.**
