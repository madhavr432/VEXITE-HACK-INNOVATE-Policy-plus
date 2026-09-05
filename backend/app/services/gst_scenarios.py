"""
GST Policy Scenarios Service Entrypoint
"""

from app.services.gst.scenarios import generate_gst_scenarios, DEFAULT_GST_RATE_TIERS

__all__ = ["generate_gst_scenarios", "DEFAULT_GST_RATE_TIERS"]
