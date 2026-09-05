"""
Deterministic Bus Policy Simulation Engine

Implements pure mathematical calculation functions for public transit policy analysis:
- Fleet scaling and daily service capacity modeling
- Empirical demand elasticity response
- Network congestion pressure and waiting-time sensitivity
- Operating cost, farebox revenue, and fiscal surplus analysis
- Fuel consumption and carbon emissions modeling

All computations are reproducible, auditable, and deterministic.
"""

from typing import Dict, Any
from app.schemas.bus import (
    BusSimulationRequest,
    BusSimulationResponse,
    PolicyOverview,
    SimulationMetrics,
    SimulationImpact,
    SimulationAssumptions,
)


def percentage_change(old: float, new: float) -> float:
    """
    Compute percentage change from old to new value.
    Handles zero values safely without division by zero.
    """
    if old == 0.0:
        return 0.0 if new == 0.0 else 100.0
    return round(((new - old) / old) * 100.0, 2)


def simulate_bus_policy(request: BusSimulationRequest) -> BusSimulationResponse:
    """
    Execute deterministic bus policy simulation comparing baseline to proposed intervention.
    """
    # 1. Fleet Scaling (Whole vehicles, min 1)
    current_fleet = request.current_fleet
    proposed_fleet = max(
        1,
        round(current_fleet * (1.0 + (request.fleet_increase_percent / 100.0)))
    )

    # 2. Daily Service Capacity Units (passengers-capacity/day)
    # DailyCapacity = Fleet × CapacityPerBus × TripsPerBusPerDay
    trips_per_day = request.trips_per_bus_per_day
    bus_capacity = request.capacity_per_bus

    current_daily_capacity = float(current_fleet * bus_capacity * trips_per_day)
    proposed_daily_capacity = float(proposed_fleet * bus_capacity * trips_per_day)

    # 3. Modeled Ridership Response (Demand Elasticity)
    # ServiceChangePercent = (NewFleet - CurrentFleet) / CurrentFleet * 100
    service_change_percent = (
        ((proposed_fleet - current_fleet) / current_fleet) * 100.0
        if current_fleet > 0 else 0.0
    )
    demand_change_percent = request.demand_elasticity * service_change_percent
    current_ridership = float(request.daily_ridership)
    proposed_ridership = float(round(current_ridership * (1.0 + (demand_change_percent / 100.0))))

    # 4. Fleet Utilization (Load Factor %)
    # Utilization = DailyRidership / DailyCapacity * 100
    current_utilization = (
        round((current_ridership / current_daily_capacity) * 100.0, 2)
        if current_daily_capacity > 0 else 0.0
    )
    proposed_utilization = (
        round((proposed_ridership / proposed_daily_capacity) * 100.0, 2)
        if proposed_daily_capacity > 0 else 0.0
    )

    # 5. Waiting Time Sensitivity Approximation (Queue Pressure Model)
    # CurrentPressure = CurrentRidership / CurrentDailyCapacity
    # ProposedPressure = ProposedRidership / ProposedDailyCapacity
    # ProposedWaitingTime = CurrentWaitingTime * (ProposedPressure / CurrentPressure)^alpha
    current_wait_time = request.current_waiting_time_minutes
    alpha = request.waiting_time_alpha

    current_pressure = (
        current_ridership / current_daily_capacity
        if current_daily_capacity > 0 else 0.0
    )
    proposed_pressure = (
        proposed_ridership / proposed_daily_capacity
        if proposed_daily_capacity > 0 else 0.0
    )

    if current_pressure <= 0.0 or proposed_pressure <= 0.0:
        proposed_wait_time = current_wait_time
    else:
        pressure_ratio = proposed_pressure / current_pressure
        proposed_wait_time = round(current_wait_time * (pressure_ratio ** alpha), 2)

    # 6. Daily Operating Cost (INR/day)
    # DailyOperatingCost = Fleet × OperatingCostPerBus
    cost_per_bus = request.operating_cost_per_bus
    current_operating_cost = float(current_fleet * cost_per_bus)
    proposed_operating_cost = float(proposed_fleet * cost_per_bus)

    # 7. Daily Farebox Revenue (INR/day)
    # Revenue = DailyRidership × AverageTicketPrice
    ticket_price = request.average_ticket_price
    current_revenue = float(round(current_ridership * ticket_price, 2))
    proposed_revenue = float(round(proposed_ridership * ticket_price, 2))

    # 8. Operating Surplus (INR/day)
    # OperatingSurplus = Revenue - OperatingCost
    current_surplus = float(round(current_revenue - current_operating_cost, 2))
    proposed_surplus = float(round(proposed_revenue - proposed_operating_cost, 2))

    # 9. Daily Fleet Carbon Emissions (kg CO2/day)
    # FuelConsumed = Fleet × DailyFuelUsePerBus
    # CO2 = FuelConsumed × EmissionFactor
    fuel_use_per_bus = request.daily_fuel_use_per_bus
    emission_factor = request.emission_factor_kg_per_liter
    current_emissions = float(round(current_fleet * fuel_use_per_bus * emission_factor, 2))
    proposed_emissions = float(round(proposed_fleet * fuel_use_per_bus * emission_factor, 2))

    # 10. Percentage Changes across all key indicators
    impact = SimulationImpact(
        fleet_percent=percentage_change(current_fleet, proposed_fleet),
        ridership_percent=percentage_change(current_ridership, proposed_ridership),
        capacity_percent=percentage_change(current_daily_capacity, proposed_daily_capacity),
        utilization_percent=percentage_change(current_utilization, proposed_utilization),
        waiting_time_percent=percentage_change(current_wait_time, proposed_wait_time),
        operating_cost_percent=percentage_change(current_operating_cost, proposed_operating_cost),
        revenue_percent=percentage_change(current_revenue, proposed_revenue),
        operating_surplus_percent=percentage_change(current_surplus, proposed_surplus),
        emissions_percent=percentage_change(current_emissions, proposed_emissions),
    )

    return BusSimulationResponse(
        policy=PolicyOverview(
            current_fleet=current_fleet,
            fleet_increase_percent=request.fleet_increase_percent,
            proposed_fleet=proposed_fleet,
        ),
        current=SimulationMetrics(
            fleet=current_fleet,
            daily_ridership=current_ridership,
            daily_capacity=current_daily_capacity,
            utilization_percent=current_utilization,
            waiting_time_minutes=current_wait_time,
            operating_cost=current_operating_cost,
            revenue=current_revenue,
            operating_surplus=current_surplus,
            emissions_kg=current_emissions,
        ),
        proposed=SimulationMetrics(
            fleet=proposed_fleet,
            daily_ridership=proposed_ridership,
            daily_capacity=proposed_daily_capacity,
            utilization_percent=proposed_utilization,
            waiting_time_minutes=proposed_wait_time,
            operating_cost=proposed_operating_cost,
            revenue=proposed_revenue,
            operating_surplus=proposed_surplus,
            emissions_kg=proposed_emissions,
        ),
        impact=impact,
        assumptions=SimulationAssumptions(
            trips_per_bus_per_day=trips_per_day,
            demand_elasticity=request.demand_elasticity,
            waiting_time_alpha=alpha,
            daily_fuel_use_per_bus=fuel_use_per_bus,
            emission_factor_kg_per_liter=emission_factor,
        ),
    )
