"""
GST Policy Simulator Schemas (Commit 8)

Strictly independent Pydantic models for the GST Policy Simulator domain.
No Bus domain types or calculations are shared or imported here.
"""

from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field


class GstStatusResponse(BaseModel):
    """Status endpoint response model."""
    module: str
    status: str


class GSTSimulationRequest(BaseModel):
    """
    Input parameters for deterministic GST policy simulation.
    All inputs represent modeled policy assumptions, not official tax estimates.
    """
    current_rate: float = Field(
        ...,
        ge=0.0,
        le=40.0,
        description="Current baseline GST rate percentage (0% to 40%)"
    )
    proposed_rate: float = Field(
        ...,
        ge=0.0,
        le=40.0,
        description="Proposed target GST rate percentage (0% to 40%)"
    )
    annual_turnover: float = Field(
        ...,
        ge=0.0,
        description="Modeled annual gross taxable turnover in INR (e.g. 10,00,00,00,000 for ₹1,000 Cr)"
    )
    compliance_rate: float = Field(
        default=85.0,
        ge=0.0,
        le=100.0,
        description="Estimated taxpayer compliance rate percentage (0% to 100%, default 85%)"
    )
    demand_elasticity: float = Field(
        default=0.20,
        ge=0.0,
        description="Price/service demand elasticity coefficient (default 0.20)"
    )
    effective_tax_base_factor: float = Field(
        default=0.80,
        ge=0.0,
        le=1.0,
        description="Input Tax Credit / Effective tax base factor (0.0 to 1.0, default 0.80)"
    )


class GSTSimulationMetrics(BaseModel):
    """Core financial and volume metrics for a specific GST tax rate."""
    rate_percent: float
    taxable_volume: float
    effective_taxable_base: float
    gst_revenue: float
    compliance_rate: float
    effective_tax_base_factor: float


class GSTSimulationImpact(BaseModel):
    """Comparative impact deltas between current baseline and proposed policy."""
    rate_change_percent: float
    demand_change_percent: float
    modeled_taxable_volume_change: float
    revenue_change: float
    revenue_impact_percent: float
    modeled_consumer_tax_impact: float


class GSTSimulationAssumptions(BaseModel):
    """Audit trail of assumptions used in simulation."""
    compliance_rate: float
    demand_elasticity: float
    effective_tax_base_factor: float
    disclaimer: str = (
        "Illustrative GST policy simulation based on configurable assumptions. "
        "Not official government revenue forecasts."
    )


class GSTSimulationResponse(BaseModel):
    """Structured deterministic response for single GST policy simulation."""
    current: GSTSimulationMetrics
    proposed: GSTSimulationMetrics
    impact: GSTSimulationImpact
    assumptions: GSTSimulationAssumptions


class GSTScenarioItem(BaseModel):
    """Comparative metrics for an individual rate bracket scenario."""
    gst_rate: float
    is_current: bool = False
    is_proposed: bool = False
    modeled_taxable_volume: float
    modeled_gst_revenue: float
    revenue_change: float
    revenue_change_percent: float
    demand_response_percent: float
    modeled_consumer_tax_impact: float


class GSTScenarioResponse(BaseModel):
    """Multi-scenario rate comparison response."""
    current_rate: float
    proposed_rate: float
    current: GSTSimulationMetrics
    selected_scenario: GSTScenarioItem
    scenarios: List[GSTScenarioItem]
    assumptions: GSTSimulationAssumptions


class GSTStressScenarioItem(BaseModel):
    """Detailed result for an adverse stress-test scenario."""
    id: str
    name: str
    description: str
    demand_elasticity_multiplier: float
    compliance_multiplier: float
    effective_compliance_rate: float
    effective_elasticity: float
    modeled_taxable_volume: float
    modeled_gst_revenue: float
    revenue_change_vs_proposed: float
    revenue_change_percent_vs_proposed: float
    demand_response_percent: float
    status: str  # "stable" | "warning" | "critical"
    status_reasons: List[str] = Field(default_factory=list)


class GSTBreakingPoint(BaseModel):
    """First scenario that breaches stable policy thresholds."""
    scenario_id: str
    scenario_name: str
    status: str  # "warning" | "critical"
    reason: str
    revenue_deterioration_percent: float


class GSTStressSummary(BaseModel):
    """Deterministic summary of stress testing results."""
    scenarios_tested: int
    stable_scenarios: int
    warning_scenarios: int
    critical_scenarios: int
    policy_survives_all_tests: bool


class GSTStressTestResponse(BaseModel):
    """Comprehensive Attack My GST Policy response."""
    proposed_rate: float
    baseline_proposed_revenue: float
    stress_scenarios: List[GSTStressScenarioItem]
    breaking_point: Optional[GSTBreakingPoint] = None
    worst_case: GSTStressScenarioItem
    summary: GSTStressSummary
    assumptions: Dict[str, Any]


class GSTRiskComponentDetail(BaseModel):
    """Evaluation detail for an individual GST risk dimension."""
    name: str
    dimension: str  # "revenue" | "demand" | "compliance" | "sensitivity"
    score: float
    weight: float
    weighted_score: float
    level: str  # "low" | "moderate" | "high" | "critical"
    level_label: str
    primary_reason: str
    metric_label: str
    metric_value: str


class GSTRiskResponse(BaseModel):
    """Deterministic policy risk evaluation response for GST."""
    overall_score: int
    risk_level: str  # "low" | "moderate" | "high" | "critical"
    risk_level_label: str
    components: Dict[str, GSTRiskComponentDetail]
    top_risk_drivers: List[str]
    deterministic_reasons: List[str]
    policy_verdict: str
    proposed_rate: float
    key_metrics: Dict[str, Any]
    assumptions: Dict[str, Any]
