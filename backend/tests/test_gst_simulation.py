"""
GST Policy Simulation Unit Tests (Commit 8)

Verifies:
1. Current revenue computation
2. Proposed revenue computation
3. Rate decimal conversion
4. Revenue change and percentage change
5. Demand response calculation
6. Zero turnover handling
7. Zero rate handling
8. Invalid rate handling (Pydantic validation)
9. Invalid compliance handling
10. Negative values handling
"""

import pytest
from pydantic import ValidationError
from app.schemas.gst import GSTSimulationRequest
from app.services.gst.simulation import simulate_gst_policy, percentage_change


def test_gst_simulation_standard_case():
    """Verify standard GST rate reduction scenario."""
    # Annual turnover: ₹10,000 Cr = 10,000,00,00,000
    # Current rate: 18%, Proposed: 12%
    # Compliance: 85%, Elasticity: 0.20, Base factor: 0.80
    req = GSTSimulationRequest(
        current_rate=18.0,
        proposed_rate=12.0,
        annual_turnover=1000000000.0,
        compliance_rate=85.0,
        demand_elasticity=0.20,
        effective_tax_base_factor=0.80,
    )
    res = simulate_gst_policy(req)

    # 1. Base turnover = 1,000,000,000 * 0.85 * 0.80 = 680,000,000
    # Current revenue = 680,000,000 * 0.18 = 122,400,000
    assert res.current.effective_taxable_base == 680000000.0
    assert res.current.gst_revenue == 122400000.0

    # 2. Rate change % = (12 - 18) / 18 * 100 = -33.333%
    # Demand change % = -0.20 * -33.333% = +6.67%
    assert round(res.impact.rate_change_percent, 2) == -33.33
    assert round(res.impact.demand_change_percent, 2) == 6.67

    # 3. Proposed taxable volume = 1,000,000,000 * (1 + 0.066667) = 1,066,666,667
    assert res.proposed.taxable_volume > req.annual_turnover
    # Proposed revenue = 1,066,666,667 * 0.85 * 0.80 * 0.12 = 87,040,000
    assert res.proposed.gst_revenue < res.current.gst_revenue
    assert res.impact.revenue_change < 0.0
    assert res.impact.revenue_impact_percent < 0.0


def test_gst_simulation_rate_increase():
    """Verify rate increase causes demand contraction."""
    req = GSTSimulationRequest(
        current_rate=12.0,
        proposed_rate=18.0,
        annual_turnover=1000000000.0,
        compliance_rate=80.0,
        demand_elasticity=0.30,
        effective_tax_base_factor=0.75,
    )
    res = simulate_gst_policy(req)

    # Rate change % = (18 - 12) / 12 * 100 = +50.0%
    # Demand change % = -0.30 * 50% = -15.0%
    assert res.impact.rate_change_percent == 50.0
    assert res.impact.demand_change_percent == -15.0
    assert res.proposed.taxable_volume == 850000000.0
    assert res.proposed.gst_revenue > res.current.gst_revenue


def test_gst_simulation_zero_turnover():
    """Verify safe zero turnover handling without errors."""
    req = GSTSimulationRequest(
        current_rate=18.0,
        proposed_rate=12.0,
        annual_turnover=0.0,
        compliance_rate=85.0,
        demand_elasticity=0.20,
        effective_tax_base_factor=0.80,
    )
    res = simulate_gst_policy(req)

    assert res.current.gst_revenue == 0.0
    assert res.proposed.gst_revenue == 0.0
    assert res.impact.revenue_change == 0.0
    assert res.impact.revenue_impact_percent == 0.0


def test_gst_simulation_zero_rate():
    """Verify safe zero rate exemption handling."""
    req = GSTSimulationRequest(
        current_rate=0.0,
        proposed_rate=5.0,
        annual_turnover=50000000.0,
        compliance_rate=90.0,
        demand_elasticity=0.20,
        effective_tax_base_factor=0.80,
    )
    res = simulate_gst_policy(req)

    assert res.current.gst_revenue == 0.0
    assert res.proposed.gst_revenue > 0.0
    assert res.impact.rate_change_percent == 0.0
    assert res.impact.demand_change_percent == 0.0


def test_gst_simulation_validation_errors():
    """Verify Pydantic enforces bounds on rate, compliance, and negative turnover."""
    # 1. Invalid rate > 40%
    with pytest.raises(ValidationError):
        GSTSimulationRequest(
            current_rate=45.0,
            proposed_rate=18.0,
            annual_turnover=1000.0,
        )

    # 2. Invalid negative rate
    with pytest.raises(ValidationError):
        GSTSimulationRequest(
            current_rate=-5.0,
            proposed_rate=18.0,
            annual_turnover=1000.0,
        )

    # 3. Invalid compliance > 100%
    with pytest.raises(ValidationError):
        GSTSimulationRequest(
            current_rate=18.0,
            proposed_rate=12.0,
            annual_turnover=1000.0,
            compliance_rate=105.0,
        )

    # 4. Invalid negative compliance
    with pytest.raises(ValidationError):
        GSTSimulationRequest(
            current_rate=18.0,
            proposed_rate=12.0,
            annual_turnover=1000.0,
            compliance_rate=-10.0,
        )

    # 5. Invalid negative turnover
    with pytest.raises(ValidationError):
        GSTSimulationRequest(
            current_rate=18.0,
            proposed_rate=12.0,
            annual_turnover=-50000.0,
        )


def test_percentage_change_utility():
    """Verify safe division by zero in percentage_change helper."""
    assert percentage_change(100.0, 0.0) == 0.0
    assert percentage_change(150.0, 100.0) == 50.0
    assert percentage_change(50.0, 100.0) == -50.0
