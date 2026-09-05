"""
Bridge module exposing GST risk engine service at app.services.gst_risk
as specified in architecture rules.
"""

from app.services.gst.risk import (
    calculate_gst_policy_risk,
    classify_risk_level,
    calculate_revenue_risk,
    calculate_demand_risk,
    calculate_compliance_risk,
    calculate_sensitivity_risk,
    REVENUE_WEIGHT,
    DEMAND_WEIGHT,
    COMPLIANCE_WEIGHT,
    SENSITIVITY_WEIGHT,
)

__all__ = [
    "calculate_gst_policy_risk",
    "classify_risk_level",
    "calculate_revenue_risk",
    "calculate_demand_risk",
    "calculate_compliance_risk",
    "calculate_sensitivity_risk",
    "REVENUE_WEIGHT",
    "DEMAND_WEIGHT",
    "COMPLIANCE_WEIGHT",
    "SENSITIVITY_WEIGHT",
]
