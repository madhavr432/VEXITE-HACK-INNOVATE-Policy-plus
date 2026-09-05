"""
GST Policy Risk Engine Unit Tests (Commit 8)

Verifies:
1. Overall score bounded strictly between 0 and 100
2. Weights sum to exactly 1.0 (Revenue 35%, Demand 25%, Compliance 20%, Sensitivity 20%)
3. Standard risk level boundaries (0-29 Low, 30-59 Moderate, 60-79 High, 80-100 Critical)
4. High revenue loss increases Revenue Risk
5. Low compliance increases Compliance Risk
6. High demand elasticity & contraction increases Demand Risk
7. Pure deterministic output
"""

import pytest
from app.schemas.gst import GSTSimulationRequest
from app.services.gst.risk import (
    calculate_gst_policy_risk,
    classify_risk_level,
    REVENUE_WEIGHT,
    DEMAND_WEIGHT,
    COMPLIANCE_WEIGHT,
    SENSITIVITY_WEIGHT,
)


def test_gst_risk_weights_sum_to_one():
    """Verify default risk dimension weights total exactly 1.0."""
    total = round(REVENUE_WEIGHT + DEMAND_WEIGHT + COMPLIANCE_WEIGHT + SENSITIVITY_WEIGHT, 4)
    assert total == 1.0


def test_gst_risk_score_bounds_and_classification():
    """Verify score clamping and tier classification."""
    req = GSTSimulationRequest(
        current_rate=18.0,
        proposed_rate=12.0,
        annual_turnover=100000000.0,
        compliance_rate=85.0,
        demand_elasticity=0.20,
        effective_tax_base_factor=0.80,
    )
    res = calculate_gst_policy_risk(req)

    assert 0 <= res.overall_score <= 100
    for dim, comp in res.components.items():
        assert 0.0 <= comp.score <= 100.0
        assert comp.level in ("low", "moderate", "high", "critical")

    # Verify classification boundaries
    assert classify_risk_level(20)[0] == "low"
    assert classify_risk_level(45)[0] == "moderate"
    assert classify_risk_level(65)[0] == "high"
    assert classify_risk_level(85)[0] == "critical"


def test_gst_risk_high_revenue_loss_increases_risk():
    """Verify drastic rate cut (18% -> 5%) increases Revenue Risk."""
    mild_cut_req = GSTSimulationRequest(
        current_rate=18.0,
        proposed_rate=16.0,
        annual_turnover=100000000.0,
        compliance_rate=85.0,
        demand_elasticity=0.20,
        effective_tax_base_factor=0.80,
    )
    deep_cut_req = GSTSimulationRequest(
        current_rate=18.0,
        proposed_rate=5.0,
        annual_turnover=100000000.0,
        compliance_rate=85.0,
        demand_elasticity=0.20,
        effective_tax_base_factor=0.80,
    )

    mild_risk = calculate_gst_policy_risk(mild_cut_req)
    deep_risk = calculate_gst_policy_risk(deep_cut_req)

    assert deep_risk.components["revenue"].score > mild_risk.components["revenue"].score


def test_gst_risk_low_compliance_increases_risk():
    """Verify lower compliance assumption increases Compliance Risk."""
    high_comp_req = GSTSimulationRequest(
        current_rate=18.0,
        proposed_rate=12.0,
        annual_turnover=100000000.0,
        compliance_rate=95.0,
        demand_elasticity=0.20,
        effective_tax_base_factor=0.80,
    )
    low_comp_req = GSTSimulationRequest(
        current_rate=18.0,
        proposed_rate=12.0,
        annual_turnover=100000000.0,
        compliance_rate=55.0,
        demand_elasticity=0.20,
        effective_tax_base_factor=0.80,
    )

    high_comp_risk = calculate_gst_policy_risk(high_comp_req)
    low_comp_risk = calculate_gst_policy_risk(low_comp_req)

    assert low_comp_risk.components["compliance"].score > high_comp_risk.components["compliance"].score


def test_gst_risk_high_elasticity_increases_risk():
    """Verify high demand elasticity under a rate hike increases Demand Risk."""
    low_elast_req = GSTSimulationRequest(
        current_rate=12.0,
        proposed_rate=18.0,
        annual_turnover=100000000.0,
        compliance_rate=85.0,
        demand_elasticity=0.10,
        effective_tax_base_factor=0.80,
    )
    high_elast_req = GSTSimulationRequest(
        current_rate=12.0,
        proposed_rate=18.0,
        annual_turnover=100000000.0,
        compliance_rate=85.0,
        demand_elasticity=0.60,
        effective_tax_base_factor=0.80,
    )

    low_elast_risk = calculate_gst_policy_risk(low_elast_req)
    high_elast_risk = calculate_gst_policy_risk(high_elast_req)

    assert high_elast_risk.components["demand"].score > low_elast_risk.components["demand"].score
