"""
AI Policy Analyst Schemas (Commit 7)

Pydantic models for the Gemini-powered AI policy interpretation layer.
Gemini receives validated deterministic results and returns structured
natural-language insight. It never performs calculations.
"""

from typing import Optional, List
from pydantic import BaseModel, Field
from app.schemas.bus import BusSimulationRequest


class AIPolicyAnalysisRequest(BaseModel):
    """
    Request to the AI Policy Analyst endpoint.

    The backend re-runs all deterministic engines from the policy inputs,
    so the frontend only needs to send the original policy configuration.
    This prevents the frontend from injecting arbitrary calculated numbers.
    """
    policy: BusSimulationRequest
    question: Optional[str] = Field(
        default=None,
        max_length=500,
        description=(
            "Optional targeted question for the policy analyst. "
            "If omitted, a general policy analysis is returned."
        ),
    )


class TradeoffItem(BaseModel):
    """A single policy trade-off pair."""
    benefit: str
    cost: str


class AIPolicyAnalysisResponse(BaseModel):
    """
    Structured response from the Gemini AI Policy Analyst.

    Each field corresponds to a distinct analytical dimension.
    All content is grounded in validated deterministic results;
    Gemini does not invent or recalculate any metrics.
    """
    executive_summary: str = Field(
        description="2-4 sentence overview of the policy's financial and operational position."
    )
    key_insights: List[str] = Field(
        description="3-5 evidence-based insights derived from the validated simulation results."
    )
    risk_explanation: str = Field(
        description=(
            "Explanation of the overall policy risk score referencing the four "
            "deterministic risk dimensions: financial, capacity, demand, utilization."
        )
    )
    tradeoffs: List[TradeoffItem] = Field(
        description="Explicit benefit/cost trade-off pairs grounded in deterministic evidence."
    )
    stress_findings: List[str] = Field(
        description=(
            "Key findings from the stress-test results, including breaking point "
            "scenario context if one was identified."
        )
    )
    assumption_warnings: List[str] = Field(
        description=(
            "Important caveats about the assumptions used, including elasticity, "
            "waiting-time models, and cost estimates."
        )
    )
    recommendations: List[str] = Field(
        description=(
            "Non-authoritative, action-oriented recommendations using language such as "
            "'Consider...', 'A policymaker could evaluate...', 'The analysis suggests monitoring...'"
        )
    )
    confidence_note: str = Field(
        description=(
            "A brief transparency statement clarifying that Policy+ is a decision-support "
            "tool, not a guaranteed forecast."
        )
    )
