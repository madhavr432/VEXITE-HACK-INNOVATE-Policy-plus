from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field


class BusStatusResponse(BaseModel):
    module: str
    status: str


class BusSimulationRequest(BaseModel):
    """
    Input parameters for deterministic bus policy simulation.
    """
    current_fleet: int = Field(
        ...,
        ge=1,
        description="Current operational bus fleet (must be at least 1)"
    )
    fleet_increase_percent: float = Field(
        ...,
        ge=0.0,
        le=50.0,
        description="Proposed fleet increase percentage (0% to 50%)"
    )
    daily_ridership: float = Field(
        ...,
        ge=0.0,
        description="Current average daily ridership in passengers/day"
    )
    capacity_per_bus: int = Field(
        ...,
        ge=1,
        description="Passenger capacity per vehicle (seated + standing limit)"
    )
    average_ticket_price: float = Field(
        ...,
        ge=0.0,
        description="Average single-trip ticket tariff in INR"
    )
    operating_cost_per_bus: float = Field(
        ...,
        ge=0.0,
        description="Average recurring daily operating cost per vehicle in INR"
    )
    trips_per_bus_per_day: float = Field(
        default=10.0,
        ge=1.0,
        description="Average operational circuit trips completed per vehicle daily"
    )

    # Optional / Advanced Assumptions
    current_waiting_time_minutes: float = Field(
        default=14.0,
        ge=0.0,
        description="Baseline passenger waiting time at stops in minutes"
    )
    demand_elasticity: float = Field(
        default=0.25,
        ge=0.0,
        description="Price/service demand elasticity ratio (e.g. 0.25)"
    )
    emission_factor_kg_per_liter: float = Field(
        default=2.31,
        ge=0.0,
        description="Diesel/fuel CO2 emission factor in kg CO2 per liter"
    )
    daily_fuel_use_per_bus: float = Field(
        default=120.0,
        ge=0.0,
        description="Estimated daily fuel consumption per vehicle in liters"
    )
    waiting_time_alpha: float = Field(
        default=0.5,
        ge=0.0,
        description="Sensitivity power factor for queue pressure vs waiting time"
    )


class PolicyOverview(BaseModel):
    current_fleet: int
    fleet_increase_percent: float
    proposed_fleet: int


class SimulationMetrics(BaseModel):
    fleet: int
    daily_ridership: float
    daily_capacity: float
    utilization_percent: float
    waiting_time_minutes: float
    operating_cost: float
    revenue: float
    operating_surplus: float
    emissions_kg: float


class SimulationImpact(BaseModel):
    fleet_percent: float
    ridership_percent: float
    capacity_percent: float
    utilization_percent: float
    waiting_time_percent: float
    operating_cost_percent: float
    revenue_percent: float
    operating_surplus_percent: float
    emissions_percent: float


class SimulationAssumptions(BaseModel):
    trips_per_bus_per_day: float
    demand_elasticity: float
    waiting_time_alpha: float
    daily_fuel_use_per_bus: float
    emission_factor_kg_per_liter: float


class BusSimulationResponse(BaseModel):
    """
    Structured deterministic response for single bus policy intervention simulation.
    """
    policy: PolicyOverview
    current: SimulationMetrics
    proposed: SimulationMetrics
    impact: SimulationImpact
    assumptions: SimulationAssumptions


class ScenarioItem(BaseModel):
    """
    Detailed metrics for a single scenario tier in multi-scenario analysis.
    """
    fleet_increase_percent: float
    fleet: int
    daily_ridership: float
    daily_capacity: float
    utilization_percent: float
    waiting_time_minutes: float
    operating_cost: float
    revenue: float
    operating_surplus: float
    emissions_kg: float
    waiting_time_delta_percent: float
    ridership_delta_percent: float
    operating_cost_delta_percent: float
    surplus_delta_percent: float


class SelectedScenario(BaseModel):
    """
    User's specifically selected intervention scenario.
    """
    fleet_increase_percent: float
    fleet: int
    daily_ridership: float
    daily_capacity: float
    utilization_percent: float
    waiting_time_minutes: float
    operating_cost: float
    revenue: float
    operating_surplus: float
    emissions_kg: float
    waiting_time_delta_percent: float
    ridership_delta_percent: float
    operating_cost_delta_percent: float
    surplus_delta_percent: float


class BusScenariosResponse(BaseModel):
    """
    Multi-scenario policy comparison and sensitivity response.
    """
    base_fleet: int
    current: SimulationMetrics
    selected_scenario: SelectedScenario
    scenarios: List[ScenarioItem]
    assumptions: SimulationAssumptions


class StressScenarioItem(BaseModel):
    """
    Detailed results for a single deterministic adverse condition.
    """
    id: str
    name: str
    description: str
    demand_multiplier: float
    cost_multiplier: float
    results: SimulationMetrics
    status: str  # "stable" | "warning" | "critical"
    status_reasons: List[str] = Field(default_factory=list)
    waiting_time_delta_percent: float
    operating_cost_delta_percent: float
    surplus_delta_percent: float


class CaseScenarioResult(BaseModel):
    """
    Result metrics for Best / Expected / Worst case evaluations.
    """
    case_type: str  # "best" | "expected" | "worst"
    name: str
    description: str
    demand_multiplier: float
    cost_multiplier: float
    results: SimulationMetrics
    impact_vs_baseline: SimulationImpact


class BreakingPoint(BaseModel):
    """
    First problematic condition encountered within tested stress scenarios.
    """
    scenario_id: str
    scenario_name: str
    status: str  # "critical" | "warning"
    demand_multiplier: float
    cost_multiplier: float
    reason: str


class AttackSummary(BaseModel):
    """
    Deterministic summary metrics of stress test run.
    """
    scenarios_tested: int
    stable_scenarios: int
    warning_scenarios: int
    critical_scenarios: int
    policy_survives_all_tests: bool


class StressTestAssumptions(BaseModel):
    """
    Audit trail for stress test assumptions and rule thresholds.
    """
    demand_scenarios: List[str]
    cost_scenarios: List[str]
    best_case: Dict[str, Any]
    expected_case: Dict[str, Any]
    worst_case: Dict[str, Any]
    thresholds: Dict[str, Any]


class BusStressTestResponse(BaseModel):
    """
    Comprehensive Attack My Policy response.
    """
    selected_policy: PolicyOverview
    baseline: SimulationMetrics
    best_case: CaseScenarioResult
    expected_case: CaseScenarioResult
    worst_case: CaseScenarioResult
    stress_scenarios: List[StressScenarioItem]
    breaking_point: Optional[BreakingPoint] = None
    attack_summary: AttackSummary
    assumptions: StressTestAssumptions


class RiskComponentDetail(BaseModel):
    """
    Evaluation details for an individual deterministic risk dimension.
    """
    name: str
    dimension: str  # "financial" | "capacity" | "demand" | "utilization"
    score: float
    weight: float
    weighted_score: float
    level: str  # "low" | "moderate" | "high" | "critical"
    level_label: str
    primary_reason: str
    metric_label: str
    metric_value: str


class BusRiskResponse(BaseModel):
    """
    Comprehensive deterministic policy risk evaluation response (Commit 6).
    Designed to be directly consumable by downstream AI policy interpretation (Commit 7).
    """
    overall_score: int
    risk_level: str  # "low" | "moderate" | "high" | "critical"
    risk_level_label: str
    components: Dict[str, RiskComponentDetail]
    top_risk_drivers: List[str]
    deterministic_reasons: List[str]
    policy_verdict: str
    selected_policy: PolicyOverview
    key_metrics: Dict[str, Any]
    assumptions: Dict[str, Any]

