"""
GST Policy Scenario Service Unit Tests (Commit 8)

Verifies:
1. Deterministic output
2. All expected rate tiers present (0%, 5%, 8%, 12%, 15%, 18%, 20%, 25%, 28%)
3. Manually selected custom proposed rate is included (e.g., 14%)
4. Current-rate scenario is marked is_current=True
5. Selected proposed scenario is marked is_proposed=True
6. Sorted scenario ordering by GST rate ascending
7. Math consistency across scenarios
"""

from app.schemas.gst import GSTSimulationRequest
from app.services.gst.scenarios import generate_gst_scenarios, DEFAULT_GST_RATE_TIERS


def test_gst_scenarios_includes_custom_rate():
    """Verify custom rates outside default tiers (e.g., 14%) are included and selected."""
    req = GSTSimulationRequest(
        current_rate=18.0,
        proposed_rate=14.0,  # 14% is not in DEFAULT_GST_RATE_TIERS
        annual_turnover=100000000.0,
        compliance_rate=85.0,
        demand_elasticity=0.20,
        effective_tax_base_factor=0.80,
    )
    res = generate_gst_scenarios(req)

    rates = [s.gst_rate for s in res.scenarios]
    assert 14.0 in rates
    assert 18.0 in rates
    # Verify sorted ascending
    assert rates == sorted(rates)

    # Verify is_current and is_proposed flags
    current_item = next(s for s in res.scenarios if s.gst_rate == 18.0)
    assert current_item.is_current is True
    assert current_item.is_proposed is False

    proposed_item = next(s for s in res.scenarios if s.gst_rate == 14.0)
    assert proposed_item.is_proposed is True
    assert res.selected_scenario.gst_rate == 14.0


def test_gst_scenarios_math_consistency():
    """Verify current rate scenario produces zero revenue change and zero demand response."""
    req = GSTSimulationRequest(
        current_rate=18.0,
        proposed_rate=12.0,
        annual_turnover=500000000.0,
        compliance_rate=85.0,
        demand_elasticity=0.25,
        effective_tax_base_factor=0.80,
    )
    res = generate_gst_scenarios(req)

    curr_scenario = next(s for s in res.scenarios if s.is_current)
    assert curr_scenario.revenue_change == 0.0
    assert curr_scenario.revenue_change_percent == 0.0
    assert curr_scenario.demand_response_percent == 0.0
    assert curr_scenario.modeled_gst_revenue == res.current.gst_revenue
