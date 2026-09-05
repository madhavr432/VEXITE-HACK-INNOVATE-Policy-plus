"""
AI Policy Analyst Tests (Commit 7)

All Gemini API calls are mocked. No real network requests are made.
Tests verify:
1.  Valid structured Gemini response parses successfully via Pydantic.
2.  Malformed JSON from Gemini raises a controlled RuntimeError.
3.  Gemini API exception propagates as controlled RuntimeError.
4.  Missing API key raises ValueError with clear message.
5.  Analysis context contains deterministic values (not hardcoded).
6.  No bus simulation formulas exist in gemini_policy_analyst.py.
7.  question=None produces a general analysis prompt (no question section).
8.  question="..." produces a targeted question prompt (includes question).
"""

import json
import pytest
from unittest.mock import MagicMock, patch

from app.schemas.bus import BusSimulationRequest
from app.schemas.ai import AIPolicyAnalysisRequest, AIPolicyAnalysisResponse, TradeoffItem
from app.services.gemini_policy_analyst import (
    analyze_bus_policy,
    _build_analysis_context,
    _build_prompt,
    _get_api_key,
)


# ---------------------------------------------------------------------------
# Shared Fixtures
# ---------------------------------------------------------------------------

BASE_REQUEST = BusSimulationRequest(
    current_fleet=100,
    fleet_increase_percent=20.0,
    daily_ridership=42000.0,
    capacity_per_bus=50,
    average_ticket_price=25.0,
    operating_cost_per_bus=8200.0,
    trips_per_bus_per_day=10.0,
    current_waiting_time_minutes=14.0,
    demand_elasticity=0.25,
)

VALID_AI_RESPONSE = {
    "executive_summary": (
        "The proposed 20% fleet expansion improves system capacity and reduces utilization pressure "
        "under baseline conditions. The financial buffer narrows, making the policy more sensitive to "
        "operating cost increases. Overall risk is rated as Moderate."
    ),
    "key_insights": [
        "Daily capacity increases proportionally with fleet expansion.",
        "Operating surplus decreases due to higher fleet operating costs.",
        "The policy remains financially positive under baseline conditions.",
        "High-demand stress scenarios create the strongest capacity pressure.",
    ],
    "risk_explanation": (
        "The overall Moderate risk score is driven primarily by Utilization Risk and Financial Risk. "
        "Baseline utilization is manageable, but peak-demand scenarios approach system limits."
    ),
    "tradeoffs": [
        {"benefit": "Higher fleet availability increases daily passenger capacity.", "cost": "Additional buses increase daily operating costs."},
        {"benefit": "Lower baseline utilization reduces overcrowding pressure.", "cost": "Operating surplus is reduced as fleet expands."},
    ],
    "stress_findings": [
        "The policy remains stable under baseline assumptions.",
        "A breaking point is identified under very high operating cost conditions.",
        "Combined demand and cost shocks create the strongest adverse pressure.",
    ],
    "assumption_warnings": [
        "Demand elasticity is a simplified sensitivity approximation, not a calibrated empirical model.",
        "Waiting-time estimates are approximate and would require route-level data for precise forecasting.",
        "Operating costs are uniform per bus and may not reflect route-level variation.",
    ],
    "recommendations": [
        "Consider monitoring operating costs closely if the fleet expansion is implemented.",
        "Validate demand elasticity against historical ridership data before operational deployment.",
        "A policymaker could evaluate a phased fleet expansion if demand uncertainty remains high.",
    ],
    "confidence_note": (
        "This analysis is scenario-based and depends on the assumptions provided. "
        "It should be treated as decision support rather than a guaranteed real-world forecast."
    ),
}


def _mock_gemini_response(json_payload: dict) -> MagicMock:
    """Create a MagicMock that simulates a successful Gemini response."""
    mock_response = MagicMock()
    mock_response.text = json.dumps(json_payload)
    return mock_response


# ---------------------------------------------------------------------------
# Test 1: Valid Gemini response parses correctly
# ---------------------------------------------------------------------------

def test_test1_valid_response_parses_successfully():
    """1. Mock Gemini with valid structured output — Pydantic validation must succeed."""
    import app.services.gemini_policy_analyst as analyst_module

    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = _mock_gemini_response(VALID_AI_RESPONSE)
    mock_genai = MagicMock()
    mock_genai.Client.return_value = mock_client

    with patch.object(analyst_module, "genai", mock_genai), \
         patch.dict("os.environ", {"GEMINI_API_KEY": "fake-key"}):
        result = analyze_bus_policy(BASE_REQUEST, question=None)

    assert isinstance(result, AIPolicyAnalysisResponse)
    assert isinstance(result.executive_summary, str)
    assert len(result.key_insights) >= 3
    assert isinstance(result.tradeoffs[0], TradeoffItem)
    assert result.tradeoffs[0].benefit
    assert result.tradeoffs[0].cost
    assert len(result.stress_findings) >= 1
    assert len(result.assumption_warnings) >= 1
    assert len(result.recommendations) >= 1
    assert isinstance(result.confidence_note, str)


# ---------------------------------------------------------------------------
# Test 2: Malformed JSON from Gemini raises controlled RuntimeError
# ---------------------------------------------------------------------------

def test_test2_malformed_json_raises_runtime_error():
    """2. When Gemini returns non-JSON, a RuntimeError with a safe message is raised."""
    import app.services.gemini_policy_analyst as analyst_module

    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "This is definitely not valid JSON {{{"
    mock_client.models.generate_content.return_value = mock_response
    mock_genai = MagicMock()
    mock_genai.Client.return_value = mock_client

    with patch.object(analyst_module, "genai", mock_genai), \
         patch.dict("os.environ", {"GEMINI_API_KEY": "fake-key"}):
        with pytest.raises(RuntimeError) as exc_info:
            analyze_bus_policy(BASE_REQUEST, question=None)

    assert "unreadable" in str(exc_info.value).lower() or "unavailable" in str(exc_info.value).lower()


# ---------------------------------------------------------------------------
# Test 3: Gemini API exception propagates as controlled RuntimeError
# ---------------------------------------------------------------------------

def test_test3_gemini_api_exception_returns_runtime_error():
    """3. When the Gemini API raises an exception, a controlled RuntimeError is raised."""
    import app.services.gemini_policy_analyst as analyst_module

    mock_client = MagicMock()
    mock_client.models.generate_content.side_effect = Exception("Connection timeout")
    mock_genai = MagicMock()
    mock_genai.Client.return_value = mock_client

    with patch.object(analyst_module, "genai", mock_genai), \
         patch.dict("os.environ", {"GEMINI_API_KEY": "fake-key"}):
        with pytest.raises(RuntimeError) as exc_info:
            analyze_bus_policy(BASE_REQUEST, question=None)

    error_msg = str(exc_info.value).lower()
    assert "unavailable" in error_msg or "gemini" in error_msg


# ---------------------------------------------------------------------------
# Test 4: Missing API key raises ValueError with clear message
# ---------------------------------------------------------------------------

def test_test4_missing_api_key_raises_value_error():
    """4. Missing GEMINI_API_KEY and GOOGLE_API_KEY raises ValueError."""
    import os
    # Ensure neither key is set
    env_without_keys = {k: v for k, v in os.environ.items()
                        if k not in ("GEMINI_API_KEY", "GOOGLE_API_KEY")}

    with patch.dict("os.environ", env_without_keys, clear=True):
        with pytest.raises(ValueError) as exc_info:
            _get_api_key()

    assert "GEMINI_API_KEY" in str(exc_info.value)
    assert "not configured" in str(exc_info.value).lower()


# ---------------------------------------------------------------------------
# Test 5: Analysis context contains validated deterministic values
# ---------------------------------------------------------------------------

def test_test5_analysis_context_contains_deterministic_values():
    """5. The context assembled by the service contains real calculated values from all 3 engines."""
    context = _build_analysis_context(BASE_REQUEST, question=None)

    # Policy section
    assert context["policy"]["current_fleet"] == 100
    assert context["policy"]["fleet_increase_percent"] == 20.0
    assert context["policy"]["proposed_fleet"] == 120  # 100 * 1.20

    # Simulation section
    assert context["simulation"]["proposed"]["fleet"] == 120
    assert context["simulation"]["proposed"]["daily_capacity"] > 0
    assert context["simulation"]["proposed"]["operating_cost"] > 0
    assert context["simulation"]["proposed"]["revenue"] > 0
    assert "operating_surplus" in context["simulation"]["proposed"]

    # Risk section
    assert "overall_score" in context["risk_analysis"]
    assert context["risk_analysis"]["overall_score"] >= 0
    assert context["risk_analysis"]["overall_score"] <= 100
    assert "components" in context["risk_analysis"]
    assert "financial" in context["risk_analysis"]["components"]

    # Stress test section
    assert "breaking_point" in context["stress_test"]
    assert "stress_scenarios" in context["stress_test"]
    assert len(context["stress_test"]["stress_scenarios"]) > 0

    # Assumptions
    assert context["assumptions"]["demand_elasticity"] == 0.25


# ---------------------------------------------------------------------------
# Test 6: No bus simulation formulas in gemini_policy_analyst.py
# ---------------------------------------------------------------------------

def test_test6_no_bus_formulas_in_analyst_service():
    """6. Ensure gemini_policy_analyst.py contains no bus formula logic."""
    import pathlib
    # Use absolute path from the backend directory
    service_path = pathlib.Path(__file__).parent.parent / "app" / "services" / "gemini_policy_analyst.py"
    source_code = service_path.read_text(encoding="utf-8")

    # These are internal simulation formula constants — must NOT appear in the analyst
    forbidden_patterns = [
        "capacity_per_bus * trips_per_bus_per_day",
        "daily_fuel_use_per_bus * emission_factor",
        "operating_surplus = revenue - operating_cost",
        "FINANCIAL_WEIGHT",
        "CAPACITY_WEIGHT",
        "DEMAND_WEIGHT",
        "UTILIZATION_WEIGHT",
        "queue_pressure",
    ]
    for pattern in forbidden_patterns:
        assert pattern not in source_code, (
            f"Bus simulation formula '{pattern}' found in gemini_policy_analyst.py. "
            "The analyst service must not duplicate deterministic calculation logic."
        )


# ---------------------------------------------------------------------------
# Test 7: question=None → general analysis prompt (no question section)
# ---------------------------------------------------------------------------

def test_test7_no_question_produces_general_prompt():
    """7. When question is None, the prompt contains no user question section."""
    context = _build_analysis_context(BASE_REQUEST, question=None)
    assert context["user_question"] is None

    prompt = _build_prompt(context)
    assert "policymaker has asked" not in prompt
    assert "specific question" not in prompt


# ---------------------------------------------------------------------------
# Test 8: question="..." → targeted question appears in prompt
# ---------------------------------------------------------------------------

def test_test8_targeted_question_appears_in_prompt():
    """8. When a question is provided, it is included in the prompt text."""
    question = "What is the biggest financial risk in this policy?"
    context = _build_analysis_context(BASE_REQUEST, question=question)
    assert context["user_question"] == question

    prompt = _build_prompt(context)
    assert question in prompt
    assert "policymaker has asked" in prompt.lower() or "specific question" in prompt.lower()


# ---------------------------------------------------------------------------
# Test 9: FastAPI endpoint returns 503 when API key missing
# ---------------------------------------------------------------------------

def test_test9_api_endpoint_503_when_key_missing():
    """9. POST /api/ai/analyze-policy returns 503 if GEMINI_API_KEY is not configured."""
    import os
    from fastapi.testclient import TestClient
    from main import app

    client = TestClient(app, raise_server_exceptions=False)
    payload = {
        "policy": {
            "current_fleet": 100,
            "fleet_increase_percent": 20.0,
            "daily_ridership": 42000.0,
            "capacity_per_bus": 50,
            "average_ticket_price": 25.0,
            "operating_cost_per_bus": 8200.0,
        },
        "question": None,
    }

    env_without_keys = {k: v for k, v in os.environ.items()
                        if k not in ("GEMINI_API_KEY", "GOOGLE_API_KEY")}

    with patch.dict("os.environ", env_without_keys, clear=True), \
         patch("app.services.gemini_policy_analyst._get_api_key",
               side_effect=ValueError("AI analysis is not configured. Add GEMINI_API_KEY to the backend environment variables.")):
        response = client.post("/api/ai/analyze-policy", json=payload)

    assert response.status_code == 503
    assert "not configured" in response.json()["detail"].lower() or "GEMINI_API_KEY" in response.json()["detail"]


# ---------------------------------------------------------------------------
# Test 10: Existing simulation/stress/risk tests are not broken
# ---------------------------------------------------------------------------

def test_test10_existing_simulate_endpoint_still_works():
    """10. The AI route must not break the existing POST /api/bus/simulate endpoint."""
    from fastapi.testclient import TestClient
    from main import app

    client = TestClient(app)
    payload = {
        "current_fleet": 100,
        "fleet_increase_percent": 20.0,
        "daily_ridership": 42000.0,
        "capacity_per_bus": 50,
        "average_ticket_price": 25.0,
        "operating_cost_per_bus": 8200.0,
    }
    response = client.post("/api/bus/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["proposed"]["fleet"] == 120
    assert data["proposed"]["operating_surplus"] > 0
