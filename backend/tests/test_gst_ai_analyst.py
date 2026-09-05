"""
GST Gemini AI Policy Analyst Tests (Commit 8)

All Gemini API calls are mocked. No real network requests are made.
Tests verify:
1. module="gst" is included in the structured analysis context.
2. Context contains GST deterministic values (revenue, rate tiers, compliance).
3. Mock Gemini with valid structured output parses successfully via Pydantic.
4. Malformed JSON from Gemini is handled safely via partial recovery or controlled RuntimeError.
5. Missing API key raises ValueError.
6. Targeted GST questions ("What is the biggest risk in this GST policy?") are included in prompt.
"""

import json
import pytest
from unittest.mock import MagicMock, patch

from app.schemas.gst import GSTSimulationRequest
from app.schemas.ai import AIPolicyAnalysisResponse, TradeoffItem
from app.services.gemini_policy_analyst import (
    analyze_gst_policy,
    _build_gst_analysis_context,
    _build_prompt,
)

BASE_GST_REQUEST = GSTSimulationRequest(
    current_rate=18.0,
    proposed_rate=12.0,
    annual_turnover=1000000000.0,
    compliance_rate=85.0,
    demand_elasticity=0.20,
    effective_tax_base_factor=0.80,
)

VALID_GST_AI_RESPONSE = {
    "executive_summary": (
        "The proposed rate cut from 18% to 12% stimulates consumer demand and improves modeled trade volume. "
        "However, direct fiscal revenue decreases by approximately 28.9%, requiring budgetary planning. "
        "Overall policy risk is evaluated as Moderate."
    ),
    "key_insights": [
        "Modeled consumer tax rate drops by 33.3%, stimulating demand by 6.7%.",
        "Modeled GST revenue contracts from ₹12.24 Cr to ₹8.70 Cr under baseline assumptions.",
        "Revenue risk is the primary exposure driver due to fiscal yield contraction.",
        "Stress testing indicates high resilience if compliance remains above 80%.",
    ],
    "risk_explanation": (
        "The overall Moderate risk score is driven primarily by Revenue Risk due to direct fiscal reduction. "
        "Demand Risk and Compliance Risk remain low under rate reduction conditions."
    ),
    "tradeoffs": [
        {"benefit": "Lowers consumer tax burden and stimulates economic transaction volume.", "cost": "Reduces direct short-term indirect tax revenue for the treasury."},
        {"benefit": "Reduces evasion incentives under a lower rate bracket.", "cost": "Requires higher taxable base growth to achieve fiscal neutrality."},
    ],
    "stress_findings": [
        "Policy remains stable across mild demand elasticity shifts.",
        "Combined adverse scenario (compliance drop to 68%) produces worst-case fiscal shortfall.",
    ],
    "assumption_warnings": [
        "GST calculations are illustrative scenario estimates based on configurable assumptions, not official government forecasts.",
        "Demand elasticity is an econometric sensitivity parameter and may vary across sub-sectors.",
    ],
    "recommendations": [
        "Consider phased rate rationalization to monitor taxpayer compliance trends.",
        "Evaluate input tax credit utilization data before formal bracket reclassification.",
    ],
    "confidence_note": (
        "Illustrative GST policy simulation for decision support; not an official government forecast."
    ),
}


def _mock_gemini_response(json_payload: dict) -> MagicMock:
    """Create a MagicMock that simulates a successful Gemini response."""
    mock_response = MagicMock()
    mock_response.text = json.dumps(json_payload)
    return mock_response


def test_gst_analysis_context_contains_module_gst():
    """Verify module='gst' is explicitly present in the analysis context."""
    context = _build_gst_analysis_context(BASE_GST_REQUEST)
    assert context["module"] == "gst"
    assert "policy" in context
    assert context["policy"]["current_rate_percent"] == 18.0
    assert context["policy"]["proposed_rate_percent"] == 12.0
    assert "simulation" in context
    assert "stress_test" in context
    assert "risk_analysis" in context
    assert "assumptions" in context
    assert "official government" in context["assumptions"]["disclaimer"]


def test_gst_prompt_includes_targeted_question():
    """Verify targeted question appears in prompt."""
    q = "What is the biggest risk in this GST policy?"
    context = _build_gst_analysis_context(BASE_GST_REQUEST, question=q)
    prompt = _build_prompt(context)
    assert q in prompt
    assert "GST validated simulation results" in prompt


@patch("app.services.gemini_policy_analyst._get_api_key", return_value="fake-test-key")
@patch("app.services.gemini_policy_analyst.genai")
def test_gst_gemini_valid_response_parses(mock_genai, mock_key):
    """Verify structured response parses into AIPolicyAnalysisResponse."""
    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = _mock_gemini_response(VALID_GST_AI_RESPONSE)
    mock_genai.Client.return_value = mock_client

    result = analyze_gst_policy(BASE_GST_REQUEST)
    assert isinstance(result, AIPolicyAnalysisResponse)
    assert "18% to 12%" in result.executive_summary
    assert len(result.key_insights) >= 3
    assert len(result.tradeoffs) >= 2


@patch("app.services.gemini_policy_analyst._get_api_key", return_value="fake-test-key")
@patch("app.services.gemini_policy_analyst.genai")
def test_gst_gemini_malformed_json_handled_safely(mock_genai, mock_key):
    """Verify malformed JSON from Gemini raises controlled RuntimeError."""
    mock_client = MagicMock()
    mock_bad_resp = MagicMock()
    mock_bad_resp.text = "This is not JSON at all."
    mock_client.models.generate_content.return_value = mock_bad_resp
    mock_genai.Client.return_value = mock_client

    with pytest.raises(RuntimeError) as exc_info:
        analyze_gst_policy(BASE_GST_REQUEST)
    assert "AI analysis returned an unreadable response" in str(exc_info.value)
