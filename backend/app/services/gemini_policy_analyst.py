"""
Gemini AI Policy Analyst Service (Commit 7)

Architecture:
    BusSimulationRequest
        → simulate_bus_policy()          [existing deterministic engine]
        → run_bus_stress_test()          [existing deterministic engine]
        → calculate_bus_policy_risk()    [existing deterministic engine]
        → _build_analysis_context()      [assemble validated package]
        → _build_prompt()                [system instruction + question]
        → Gemini API (gemini-2.0-flash)  [interpretation only]
        → Pydantic validation            [structured response]
        → AIPolicyAnalysisResponse

Critical Principle:
    Gemini is an interpretation layer. It NEVER calculates or modifies
    any policy metric. All numbers come from the deterministic engines.
"""

import os
import json
import logging
from typing import Optional, Dict, Any

try:
    from google import genai
    from google.genai import types as genai_types
except ImportError:
    genai = None  # type: ignore
    genai_types = None  # type: ignore

from app.schemas.bus import BusSimulationRequest
from app.schemas.ai import AIPolicyAnalysisResponse, TradeoffItem
from app.services.bus.simulation import simulate_bus_policy
from app.services.bus.stress_test import run_bus_stress_test
from app.services.bus.risk import calculate_bus_policy_risk

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# System-level instruction for Gemini
# ---------------------------------------------------------------------------

_SYSTEM_INSTRUCTION = """\
You are Policy+, an AI-assisted policy analysis system built for government \
decision-support.

You receive validated, deterministic outputs from a mathematical policy simulation engine.

Your role:
- Interpret the provided simulation, stress-test, and risk results in clear policy language.
- Explain trade-offs, risks, and implications using ONLY the evidence provided.
- Write for non-technical policymakers — avoid jargon.

Hard constraints:
- NEVER recalculate or alter any metric. The numbers are already computed and validated.
- NEVER invent facts, statistics, or policies not present in the analysis context.
- NEVER present simulation assumptions as observed real-world facts.
- NEVER claim certainty about future outcomes.
- If asked about something outside the supplied analysis (e.g. political figures, \
real-world events), state clearly that the information is outside the provided simulation context.
- Treat every number as a model estimate under specified assumptions, not a guaranteed forecast.

Communication style:
- Concise, analytical, evidence-based.
- Use "the analysis suggests...", "under tested conditions...", "the model indicates...".
- For recommendations, use "Consider...", "A policymaker could evaluate...", \
"The analysis suggests monitoring...".
- Neutral tone. No marketing language or exaggerated claims.
"""


# ---------------------------------------------------------------------------
# Analysis Context Builder
# ---------------------------------------------------------------------------

def _build_analysis_context(
    request: BusSimulationRequest,
    question: Optional[str],
) -> Dict[str, Any]:
    """
    Run all deterministic engines and assemble a structured analysis package.
    This is the ONLY source of numbers that Gemini will see.

    Returns:
        A validated analysis context dictionary ready to be serialized into the prompt.
    """
    sim_result = simulate_bus_policy(request)
    stress_result = run_bus_stress_test(request)
    risk_result = calculate_bus_policy_risk(
        request=request,
        simulation_result=sim_result,
        stress_result=stress_result,
    )

    # Serialize stress scenario summary
    stress_scenarios_summary = []
    for sc in stress_result.stress_scenarios:
        stress_scenarios_summary.append({
            "name": sc.name,
            "description": sc.description,
            "status": sc.status,
            "status_reasons": sc.status_reasons,
            "utilization_percent": sc.results.utilization_percent,
            "operating_surplus": sc.results.operating_surplus,
            "waiting_time_minutes": sc.results.waiting_time_minutes,
        })

    context = {
        "policy": {
            "current_fleet": request.current_fleet,
            "fleet_increase_percent": request.fleet_increase_percent,
            "proposed_fleet": sim_result.proposed.fleet,
            "daily_ridership_baseline": request.daily_ridership,
        },
        "simulation": {
            "current": {
                "fleet": sim_result.current.fleet,
                "daily_capacity": sim_result.current.daily_capacity,
                "utilization_percent": sim_result.current.utilization_percent,
                "waiting_time_minutes": sim_result.current.waiting_time_minutes,
                "operating_cost": sim_result.current.operating_cost,
                "revenue": sim_result.current.revenue,
                "operating_surplus": sim_result.current.operating_surplus,
            },
            "proposed": {
                "fleet": sim_result.proposed.fleet,
                "daily_capacity": sim_result.proposed.daily_capacity,
                "utilization_percent": sim_result.proposed.utilization_percent,
                "waiting_time_minutes": sim_result.proposed.waiting_time_minutes,
                "operating_cost": sim_result.proposed.operating_cost,
                "revenue": sim_result.proposed.revenue,
                "operating_surplus": sim_result.proposed.operating_surplus,
            },
            "impact": {
                "fleet_percent_change": sim_result.impact.fleet_percent,
                "capacity_percent_change": sim_result.impact.capacity_percent,
                "operating_cost_percent_change": sim_result.impact.operating_cost_percent,
                "operating_surplus_percent_change": sim_result.impact.operating_surplus_percent,
                "utilization_percent_change": sim_result.impact.utilization_percent,
                "waiting_time_percent_change": sim_result.impact.waiting_time_percent,
            },
        },
        "assumptions": {
            "trips_per_bus_per_day": request.trips_per_bus_per_day,
            "demand_elasticity": request.demand_elasticity,
            "average_ticket_price_inr": request.average_ticket_price,
            "operating_cost_per_bus_inr": request.operating_cost_per_bus,
            "current_waiting_time_minutes": request.current_waiting_time_minutes,
            "note": (
                "The waiting-time and demand-response models are sensitivity "
                "approximations for decision support, not calibrated empirical forecasts."
            ),
        },
        "stress_test": {
            "policy_survives_all_tests": stress_result.attack_summary.policy_survives_all_tests,
            "scenarios_tested": stress_result.attack_summary.scenarios_tested,
            "stable_scenarios": stress_result.attack_summary.stable_scenarios,
            "warning_scenarios": stress_result.attack_summary.warning_scenarios,
            "critical_scenarios": stress_result.attack_summary.critical_scenarios,
            "breaking_point": (
                {
                    "scenario_name": stress_result.breaking_point.scenario_name,
                    "status": stress_result.breaking_point.status,
                    "demand_multiplier": stress_result.breaking_point.demand_multiplier,
                    "cost_multiplier": stress_result.breaking_point.cost_multiplier,
                    "reason": stress_result.breaking_point.reason,
                }
                if stress_result.breaking_point
                else None
            ),
            "worst_case": {
                "name": stress_result.worst_case.name,
                "operating_surplus": stress_result.worst_case.results.operating_surplus,
                "utilization_percent": stress_result.worst_case.results.utilization_percent,
            },
            "stress_scenarios": stress_scenarios_summary,
        },
        "risk_analysis": {
            "overall_score": risk_result.overall_score,
            "risk_level": risk_result.risk_level,
            "risk_level_label": risk_result.risk_level_label,
            "top_risk_drivers": risk_result.top_risk_drivers,
            "policy_verdict": risk_result.policy_verdict,
            "components": {
                dim: {
                    "name": comp.name,
                    "score": comp.score,
                    "weight_percent": round(comp.weight * 100),
                    "level": comp.level,
                    "primary_reason": comp.primary_reason,
                    "metric_label": comp.metric_label,
                    "metric_value": comp.metric_value,
                }
                for dim, comp in risk_result.components.items()
            },
        },
        "user_question": question or None,
    }

    return context


# ---------------------------------------------------------------------------
# Prompt Builder
# ---------------------------------------------------------------------------

def _build_prompt(context: Dict[str, Any]) -> str:
    """
    Build the user-turn prompt from the analysis context.
    The system instruction is passed separately to the Gemini client.
    """
    question_section = ""
    if context.get("user_question"):
        question_section = (
            f"\n\nThe policymaker has asked a specific question:\n"
            f'"{context["user_question"]}"\n\n'
            f"Please ensure your executive_summary and key_insights directly address "
            f"this question using the evidence in the analysis context below."
        )

    context_json = json.dumps(context, indent=2, ensure_ascii=False, default=str)

    return (
        f"Analyze the following Policy+ validated simulation results and provide "
        f"a structured policy analysis.{question_section}\n\n"
        f"VALIDATED ANALYSIS CONTEXT:\n```json\n{context_json}\n```\n\n"
        f"Return a JSON object with exactly these fields:\n"
        f"- executive_summary (string, 2-4 sentences)\n"
        f"- key_insights (array of 3-5 strings, evidence-based, no generic praise)\n"
        f"- risk_explanation (string, references the 4 risk dimensions from risk_analysis.components)\n"
        f"- tradeoffs (array of objects, each with 'benefit' and 'cost' string fields, min 2)\n"
        f"- stress_findings (array of 2-4 strings about stress test outcomes)\n"
        f"- assumption_warnings (array of 2-3 strings about model limitations)\n"
        f"- recommendations (array of 2-4 action-oriented strings using non-authoritative language)\n"
        f"- confidence_note (string, 1-2 sentences on simulation limitations)\n\n"
        f"Return ONLY valid JSON. Do not add markdown fences or any text outside the JSON object."
    )


# ---------------------------------------------------------------------------
# Gemini Client Helper
# ---------------------------------------------------------------------------

def _get_api_key() -> str:
    """
    Retrieve Gemini API key from environment variables.
    Supports both GEMINI_API_KEY and GOOGLE_API_KEY (legacy fallback).
    """
    key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not key:
        raise ValueError(
            "AI analysis is not configured. "
            "Add GEMINI_API_KEY to the backend environment variables."
        )
    return key


# ---------------------------------------------------------------------------
# Main Service Function
# ---------------------------------------------------------------------------

def analyze_bus_policy(
    request: BusSimulationRequest,
    question: Optional[str] = None,
) -> AIPolicyAnalysisResponse:
    """
    Orchestrate the full AI policy analysis pipeline:

    1. Validate API key availability.
    2. Re-run deterministic engines to obtain validated results.
    3. Assemble structured analysis context.
    4. Build and send prompt to Gemini.
    5. Parse and validate structured response with Pydantic.
    6. Return AIPolicyAnalysisResponse.

    Raises:
        ValueError: If GEMINI_API_KEY is not configured.
        RuntimeError: If Gemini returns an invalid or unparseable response.
        Exception: For other API-level failures (re-raised with context).
    """
    # 1. Check API key first (fail fast, clean error)
    api_key = _get_api_key()

    # 2 + 3. Run deterministic engines and assemble context
    logger.info("Building analysis context via deterministic engines...")
    analysis_context = _build_analysis_context(request, question)

    # 4. Build prompt
    prompt = _build_prompt(analysis_context)

    # 5. Call Gemini
    logger.info("Calling Gemini AI policy analyst...")
    try:
        if genai is None:
            raise RuntimeError("google-genai package is not installed.")

        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=genai_types.GenerateContentConfig(
                system_instruction=_SYSTEM_INSTRUCTION,
                temperature=0.3,          # Low temp for analytical consistency
                max_output_tokens=2048,
                response_mime_type="application/json",
            ),
        )

        raw_text = response.text.strip()

    except ValueError:
        # Re-raise API key errors as-is
        raise
    except Exception as exc:
        logger.error("Gemini API call failed: %s", exc)
        raise RuntimeError(
            f"AI analysis temporarily unavailable. Gemini API error: {type(exc).__name__}"
        ) from exc

    # 6. Parse and validate response
    if not raw_text:
        raise RuntimeError(
            "AI analysis returned an empty response. Please try again."
        )

    try:
        parsed = json.loads(raw_text)
    except json.JSONDecodeError as exc:
        logger.error("Gemini returned invalid JSON: %s", raw_text[:500])
        raise RuntimeError(
            "AI analysis returned an unreadable response. Please try again."
        ) from exc

    # Validate with Pydantic (raises ValidationError on schema mismatch)
    try:
        return AIPolicyAnalysisResponse(**parsed)
    except Exception as exc:
        logger.error("Pydantic validation failed for Gemini response: %s", exc)
        # Attempt safe partial recovery for common recoverable fields
        return _safe_partial_recovery(parsed, exc)


def _safe_partial_recovery(
    parsed: dict,
    original_error: Exception,
) -> AIPolicyAnalysisResponse:
    """
    Attempt to recover a partial response if Gemini returned mostly-valid data
    with some fields missing or malformed.
    """
    defaults = {
        "executive_summary": parsed.get("executive_summary", "Analysis summary unavailable."),
        "key_insights": parsed.get("key_insights", ["Insights could not be fully structured."]),
        "risk_explanation": parsed.get(
            "risk_explanation", "Risk explanation could not be fully structured."
        ),
        "tradeoffs": [
            TradeoffItem(**t) if isinstance(t, dict) else TradeoffItem(benefit=str(t), cost="")
            for t in parsed.get("tradeoffs", [])
        ] or [TradeoffItem(benefit="Additional capacity", cost="Higher operating cost")],
        "stress_findings": parsed.get("stress_findings", ["Stress findings unavailable."]),
        "assumption_warnings": parsed.get(
            "assumption_warnings",
            ["Results are model estimates under specified assumptions."],
        ),
        "recommendations": parsed.get(
            "recommendations",
            ["Validate model assumptions with empirical data before deployment."],
        ),
        "confidence_note": parsed.get(
            "confidence_note",
            (
                "This analysis is scenario-based and should be treated as decision support "
                "rather than a guaranteed forecast."
            ),
        ),
    }
    try:
        return AIPolicyAnalysisResponse(**defaults)
    except Exception:
        # Total recovery failure — raise the original error
        raise RuntimeError(
            "AI analysis returned an unstructured response that could not be parsed. "
            "Please try again."
        ) from original_error
