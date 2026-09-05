"""
Bridge module exposing GST stress test service at app.services.gst_stress_test
as specified in architecture rules.
"""

from app.services.gst.stress_test import (
    run_gst_stress_test,
    evaluate_scenario_status,
    DEFAULT_GST_STRESS_SCENARIOS,
    REVENUE_DETERIORATION_CRITICAL_PERCENT,
    REVENUE_DETERIORATION_WARNING_PERCENT,
    DEMAND_CONTRACTION_CRITICAL_PERCENT,
    DEMAND_CONTRACTION_WARNING_PERCENT,
)

__all__ = [
    "run_gst_stress_test",
    "evaluate_scenario_status",
    "DEFAULT_GST_STRESS_SCENARIOS",
    "REVENUE_DETERIORATION_CRITICAL_PERCENT",
    "REVENUE_DETERIORATION_WARNING_PERCENT",
    "DEMAND_CONTRACTION_CRITICAL_PERCENT",
    "DEMAND_CONTRACTION_WARNING_PERCENT",
]
