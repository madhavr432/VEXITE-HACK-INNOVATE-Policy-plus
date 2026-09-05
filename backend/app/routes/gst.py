"""
GST Policy Routes (Commit 8)

Deterministic endpoints for the independent GST Policy Simulator domain:
- GET  /api/gst           : Module status
- POST /api/gst/simulate  : Deterministic single policy simulation
- POST /api/gst/scenarios : Multi-rate bracket scenario comparison
- POST /api/gst/stress-test: Adverse scenario stress testing & breaking point analysis
- POST /api/gst/risk      : Four-dimensional deterministic policy risk engine
"""

from fastapi import APIRouter, HTTPException
from app.schemas.gst import (
    GstStatusResponse,
    GSTSimulationRequest,
    GSTSimulationResponse,
    GSTScenarioResponse,
    GSTStressTestResponse,
    GSTRiskResponse,
)
from app.services.gst.simulation import simulate_gst_policy
from app.services.gst.scenarios import generate_gst_scenarios
from app.services.gst.stress_test import run_gst_stress_test
from app.services.gst.risk import calculate_gst_policy_risk

router = APIRouter(prefix="/api/gst", tags=["gst"])


@router.get("", response_model=GstStatusResponse)
async def get_gst_status():
    """
    GST Policy module readiness status.
    """
    return GstStatusResponse(module="gst", status="ready")


@router.post("/simulate", response_model=GSTSimulationResponse)
async def simulate_gst(request: GSTSimulationRequest):
    """
    Run deterministic GST policy simulation.
    Calculates effective taxable base, baseline GST yield, consumer rate delta,
    elasticity-driven demand response, modeled proposed yield, and fiscal impact.
    """
    try:
        result = simulate_gst_policy(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"GST simulation computation failed: {str(e)}"
        )


@router.post("/scenarios", response_model=GSTScenarioResponse)
async def simulate_gst_scenarios(request: GSTSimulationRequest):
    """
    Generate multi-bracket scenario comparison across standard GST rate tiers
    (0%, 5%, 8%, 12%, 15%, 18%, 20%, 25%, 28%) including the user's specific
    current baseline and proposed target rates.
    """
    try:
        results = generate_gst_scenarios(request)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"GST scenario generation failed: {str(e)}"
        )


@router.post("/stress-test", response_model=GSTStressTestResponse)
async def stress_test_gst(request: GSTSimulationRequest):
    """
    Execute Attack My GST Policy stress testing against the user's selected policy.
    Evaluates adverse demand elasticity surges and compliance leakage scenarios,
    flags rule-based stability thresholds, and identifies the breaking point.
    """
    try:
        results = run_gst_stress_test(request)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"GST stress test computation failed: {str(e)}"
        )


@router.post("/risk", response_model=GSTRiskResponse)
async def evaluate_gst_risk(request: GSTSimulationRequest):
    """
    Execute Deterministic GST Policy Risk assessment.
    Evaluates Revenue Risk (35%), Demand Risk (25%), Compliance Risk (20%),
    and Policy Sensitivity Risk (20%) into an overall Policy Risk Score (0-100),
    identifies top risk drivers, and generates transparent rule-based reasons and verdict.
    """
    try:
        results = calculate_gst_policy_risk(request)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"GST policy risk computation failed: {str(e)}"
        )
