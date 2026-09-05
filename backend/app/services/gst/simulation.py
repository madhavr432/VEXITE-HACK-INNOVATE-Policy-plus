"""
GST Policy Simulation Engine (Commit 8)

Deterministic mathematical model for indirect tax rate adjustments.
Calculates modeled tax base, consumer demand response, and fiscal revenue impact.

CRITICAL PRINCIPLE:
This is an illustrative policy simulation prototype based on configurable
assumptions, NOT an official government revenue forecast.
"""

from app.schemas.gst import (
    GSTSimulationRequest,
    GSTSimulationMetrics,
    GSTSimulationImpact,
    GSTSimulationAssumptions,
    GSTSimulationResponse,
)


def percentage_change(proposed: float, baseline: float) -> float:
    """Safely calculate percentage change between proposed and baseline."""
    if baseline == 0.0:
        return 0.0
    return ((proposed - baseline) / baseline) * 100.0


def simulate_gst_policy(request: GSTSimulationRequest) -> GSTSimulationResponse:
    """
    Simulate the fiscal and demand impact of a proposed GST rate change.

    Formulas:
    1. Effective Taxable Base = Annual Turnover × (Compliance / 100) × Effective Base Factor
    2. Current GST Revenue = Effective Taxable Base × (Current Rate / 100)
    3. Rate Change % = ((Proposed Rate - Current Rate) / Current Rate) × 100
    4. Demand Change % = -Demand Elasticity × Rate Change %
    5. Modeled Taxable Volume = Annual Turnover × max(0.0, 1 + Demand Change % / 100)
    6. Proposed Effective Base = Modeled Volume × (Compliance / 100) × Effective Base Factor
    7. Proposed GST Revenue = Proposed Effective Base × (Proposed Rate / 100)
    8. Revenue Impact % = ((Proposed Revenue - Current Revenue) / Current Revenue) × 100
    """
    compliance_factor = request.compliance_rate / 100.0
    current_rate_decimal = request.current_rate / 100.0
    proposed_rate_decimal = request.proposed_rate / 100.0

    # 1. Baseline Effective Tax Base and Revenue
    current_effective_base = (
        request.annual_turnover * compliance_factor * request.effective_tax_base_factor
    )
    current_revenue = current_effective_base * current_rate_decimal

    # 2. Consumer Price & Demand Response
    if request.current_rate > 0:
        rate_change_percent = (
            (request.proposed_rate - request.current_rate) / request.current_rate
        ) * 100.0
    else:
        rate_change_percent = 0.0

    demand_change_percent = -request.demand_elasticity * rate_change_percent

    # 3. Modeled Proposed Taxable Volume & Revenue
    volume_multiplier = max(0.0, 1.0 + (demand_change_percent / 100.0))
    proposed_taxable_volume = request.annual_turnover * volume_multiplier

    proposed_effective_base = (
        proposed_taxable_volume * compliance_factor * request.effective_tax_base_factor
    )
    proposed_revenue = proposed_effective_base * proposed_rate_decimal

    # 4. Deltas
    revenue_change = proposed_revenue - current_revenue
    revenue_impact_percent = percentage_change(proposed_revenue, current_revenue)
    volume_change = proposed_taxable_volume - request.annual_turnover

    current_metrics = GSTSimulationMetrics(
        rate_percent=round(request.current_rate, 2),
        taxable_volume=round(request.annual_turnover, 2),
        effective_taxable_base=round(current_effective_base, 2),
        gst_revenue=round(current_revenue, 2),
        compliance_rate=round(request.compliance_rate, 2),
        effective_tax_base_factor=round(request.effective_tax_base_factor, 4),
    )

    proposed_metrics = GSTSimulationMetrics(
        rate_percent=round(request.proposed_rate, 2),
        taxable_volume=round(proposed_taxable_volume, 2),
        effective_taxable_base=round(proposed_effective_base, 2),
        gst_revenue=round(proposed_revenue, 2),
        compliance_rate=round(request.compliance_rate, 2),
        effective_tax_base_factor=round(request.effective_tax_base_factor, 4),
    )

    impact = GSTSimulationImpact(
        rate_change_percent=round(rate_change_percent, 2),
        demand_change_percent=round(demand_change_percent, 2),
        modeled_taxable_volume_change=round(volume_change, 2),
        revenue_change=round(revenue_change, 2),
        revenue_impact_percent=round(revenue_impact_percent, 2),
        modeled_consumer_tax_impact=round(rate_change_percent, 2),
    )

    assumptions = GSTSimulationAssumptions(
        compliance_rate=round(request.compliance_rate, 2),
        demand_elasticity=round(request.demand_elasticity, 4),
        effective_tax_base_factor=round(request.effective_tax_base_factor, 4),
    )

    return GSTSimulationResponse(
        current=current_metrics,
        proposed=proposed_metrics,
        impact=impact,
        assumptions=assumptions,
    )
