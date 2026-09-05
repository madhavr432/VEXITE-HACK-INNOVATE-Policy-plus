"""
Bridge module exposing bus stress test service at app.services.bus_stress_test
as suggested in Commit 5 specifications.
"""

from app.services.bus.stress_test import (
    run_bus_stress_test,
    DEFAULT_STRESS_SCENARIOS,
    CASE_CONFIGS,
    evaluate_scenario_status,
)

__all__ = [
    "run_bus_stress_test",
    "DEFAULT_STRESS_SCENARIOS",
    "CASE_CONFIGS",
    "evaluate_scenario_status",
]
