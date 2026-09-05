"""
GST FastAPI Route Integration Tests (Commit 8)

Tests:
1. GET /api/gst returns status "ready"
2. POST /api/gst/simulate returns 200 with structured metrics
3. POST /api/gst/scenarios returns 200 with bracket list
4. POST /api/gst/stress-test returns 200 with stress scenarios & breaking point
5. POST /api/gst/risk returns 200 with 4 risk dimensions and overall score
6. POST /api/ai/analyze-policy with module='gst' routes to GST analyst
7. Invalid payloads return 422 Unprocessable Entity
"""

from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from main import app
from app.schemas.ai import AIPolicyAnalysisResponse

client = TestClient(app)

SAMPLE_GST_PAYLOAD = {
    "current_rate": 18.0,
    "proposed_rate": 12.0,
    "annual_turnover": 1000000000.0,
    "compliance_rate": 85.0,
    "demand_elasticity": 0.20,
    "effective_tax_base_factor": 0.80,
}


def test_get_gst_status():
    """Verify GET /api/gst returns readiness."""
    res = client.get("/api/gst")
    assert res.status_code == 200
    assert res.json() == {"module": "gst", "status": "ready"}


def test_post_gst_simulate():
    """Verify POST /api/gst/simulate calculates metrics."""
    res = client.post("/api/gst/simulate", json=SAMPLE_GST_PAYLOAD)
    assert res.status_code == 200
    data = res.json()
    assert "current" in data
    assert "proposed" in data
    assert "impact" in data
    assert "assumptions" in data
    assert data["current"]["rate_percent"] == 18.0
    assert data["proposed"]["rate_percent"] == 12.0
    assert data["impact"]["revenue_change"] < 0.0


def test_post_gst_scenarios():
    """Verify POST /api/gst/scenarios returns multi-tier brackets."""
    res = client.post("/api/gst/scenarios", json=SAMPLE_GST_PAYLOAD)
    assert res.status_code == 200
    data = res.json()
    assert len(data["scenarios"]) >= 9
    assert data["current_rate"] == 18.0
    assert data["proposed_rate"] == 12.0
    assert data["selected_scenario"]["gst_rate"] == 12.0


def test_post_gst_stress_test():
    """Verify POST /api/gst/stress-test returns stress scenarios."""
    res = client.post("/api/gst/stress-test", json=SAMPLE_GST_PAYLOAD)
    assert res.status_code == 200
    data = res.json()
    assert data["summary"]["scenarios_tested"] == 6
    assert "worst_case" in data


def test_post_gst_risk():
    """Verify POST /api/gst/risk evaluates 4 dimensions."""
    res = client.post("/api/gst/risk", json=SAMPLE_GST_PAYLOAD)
    assert res.status_code == 200
    data = res.json()
    assert 0 <= data["overall_score"] <= 100
    assert "revenue" in data["components"]
    assert "demand" in data["components"]
    assert "compliance" in data["components"]
    assert "sensitivity" in data["components"]


def test_post_gst_invalid_payload():
    """Verify invalid input returns 422 error."""
    bad_payload = dict(SAMPLE_GST_PAYLOAD, current_rate=55.0)  # > 40%
    res = client.post("/api/gst/simulate", json=bad_payload)
    assert res.status_code == 422


@patch("app.routes.ai.analyze_gst_policy")
def test_post_ai_analyze_policy_gst_routing(mock_gst_analyst):
    """Verify POST /api/ai/analyze-policy correctly routes GST policy."""
    mock_gst_analyst.return_value = AIPolicyAnalysisResponse(
        executive_summary="GST summary",
        key_insights=["Insight 1", "Insight 2", "Insight 3"],
        risk_explanation="Risk explanation",
        tradeoffs=[{"benefit": "Lower prices", "cost": "Less revenue"}],
        stress_findings=["Finding 1"],
        assumption_warnings=["Warning 1"],
        recommendations=["Recommendation 1"],
        confidence_note="Confidence note",
    )

    res = client.post(
        "/api/ai/analyze-policy",
        json={
            "module": "gst",
            "policy": SAMPLE_GST_PAYLOAD,
            "question": "What is the biggest risk in this GST policy?",
        },
    )
    assert res.status_code == 200
    assert mock_gst_analyst.called
    data = res.json()
    assert data["executive_summary"] == "GST summary"
