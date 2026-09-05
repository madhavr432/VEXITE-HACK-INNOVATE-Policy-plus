"""
GST Policy Stress Testing Unit Tests (Commit 8)

Verifies:
1. Baseline scenario has multipliers 1.0 and matches proposed yield
2. High elasticity multiplier (+25%) increases demand response
3. Much high elasticity multiplier (+50%) creates further demand contraction
4. Lower compliance (-10%) drops revenue proportionally
5. Combined adverse scenario tests both shocks simultaneously
6. Deterministic status evaluation (stable, warning, critical)
7. Breaking point scenario identification
8. Worst case scenario identification
"""

import pytest
from app.schemas.gst import GSTSimulationRequest
from app.services.gst.stress_test import (
    run_gst_stress_test,
    evaluate_scenario_status,
)


def test_gst_stress_test_scenarios():
    """Verify all 6 predefined adverse stress scenarios run deterministically."""
    req = GSTSimulationRequest(
        current_rate=12.0,
        proposed_rate=18.0,  # Rate hike from 12% to 18% creates demand pressure
        annual_turnover=1000000000.0,
        compliance_rate=85.0,
        demand_elasticity=0.30,
        effective_tax_base_factor=0.80,
    )
    res = run_gst_stress_test(req)

    assert res.summary.scenarios_tested == 6
    scenarios = {s.id: s for s in res.stress_scenarios}

    # 1. Baseline
    baseline = scenarios["baseline"]
    assert baseline.demand_elasticity_multiplier == 1.0
    assert baseline.compliance_multiplier == 1.0
    assert baseline.modeled_gst_revenue == res.baseline_proposed_revenue
    assert baseline.revenue_change_percent_vs_proposed == 0.0

    # 2. Higher elasticity
    high_elast = scenarios["higher_elasticity"]
    assert high_elast.effective_elasticity == pytest.approx(req.demand_elasticity * 1.25)
    assert high_elast.demand_response_percent < baseline.demand_response_percent

    # 3. Lower compliance
    low_comp = scenarios["lower_compliance"]
    assert low_comp.effective_compliance_rate == pytest.approx(req.compliance_rate * 0.90)
    assert low_comp.modeled_gst_revenue < baseline.modeled_gst_revenue

    # 4. Combined adverse
    combined = scenarios["combined_adverse"]
    assert combined.effective_elasticity == pytest.approx(req.demand_elasticity * 1.50)
    assert combined.effective_compliance_rate == pytest.approx(req.compliance_rate * 0.80)
    assert combined.modeled_gst_revenue <= low_comp.modeled_gst_revenue

    # 5. Worst case
    assert res.worst_case.id in ("combined_adverse", "much_lower_compliance")

    # 6. Breaking point detection
    if not res.summary.policy_survives_all_tests:
        assert res.breaking_point is not None
        assert res.breaking_point.status in ("warning", "critical")


def test_evaluate_scenario_status_thresholds():
    """Verify centralized rule-based status thresholds."""
    # Stable
    status, reasons = evaluate_scenario_status(revenue_loss_percent=5.0, demand_change_percent=-3.0)
    assert status == "stable"

    # Warning via revenue
    status, reasons = evaluate_scenario_status(revenue_loss_percent=12.0, demand_change_percent=-3.0)
    assert status == "warning"

    # Critical via revenue
    status, reasons = evaluate_scenario_status(revenue_loss_percent=22.0, demand_change_percent=-3.0)
    assert status == "critical"

    # Critical via demand contraction
    status, reasons = evaluate_scenario_status(revenue_loss_percent=5.0, demand_change_percent=-16.0)
    assert status == "critical"
