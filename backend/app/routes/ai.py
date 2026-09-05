"""
AI Policy Analyst Route (Commit 7 & 8)

Exposes the Gemini-powered policy interpretation layer for both Bus and GST modules.
All deterministic calculations are performed by domain-specific engines;
this route orchestrates the AI analysis on top of validated results.
"""

import logging
from fastapi import APIRouter, HTTPException
from starlette.concurrency import run_in_threadpool
from app.schemas.ai import AIPolicyAnalysisRequest, AIPolicyAnalysisResponse
from app.schemas.gst import GSTSimulationRequest
from app.services.gemini_policy_analyst import analyze_bus_policy, analyze_gst_policy

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/analyze-policy", response_model=AIPolicyAnalysisResponse)
async def analyze_policy(request: AIPolicyAnalysisRequest):
    """
    AI Policy Analyst endpoint (Commit 7 & 8).

    Flow:
    1. Identify module domain (Bus or GST).
    2. Re-run deterministic simulation, stress-test, and risk engines for that domain.
    3. Assemble validated analysis context.
    4. Send to Gemini for structured natural-language interpretation.
    5. Validate Pydantic response and return to frontend.

    Gemini interprets validated results — it does not calculate or modify metrics.
    """
    try:
        # Determine whether this is a GST or Bus analysis request
        is_gst = (
            request.module.lower() == "gst"
            or request.gst_policy is not None
            or isinstance(request.policy, GSTSimulationRequest)
        )

        if is_gst:
            gst_req = request.gst_policy or request.policy
            if not isinstance(gst_req, GSTSimulationRequest):
                # If parsed as generic dict or model
                gst_req = GSTSimulationRequest(**(gst_req if isinstance(gst_req, dict) else gst_req.model_dump()))
            result = await run_in_threadpool(
                analyze_gst_policy,
                request=gst_req,
                question=request.question,
            )
        else:
            bus_req = request.policy
            result = await run_in_threadpool(
                analyze_bus_policy,
                request=bus_req,
                question=request.question,
            )

        return result

    except ValueError as exc:
        # Missing API key — configuration error
        logger.warning("AI configuration error: %s", exc)
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        )

    except RuntimeError as exc:
        # Gemini API failure, invalid response, etc.
        logger.error("AI analysis runtime error: %s", exc)
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        )

    except Exception as exc:
        # Unexpected failure — log but return safe message
        logger.exception("Unexpected AI analysis failure: %s", exc)
        raise HTTPException(
            status_code=503,
            detail=(
                "AI analysis is temporarily unavailable. "
                "Your deterministic simulation and risk results are still available."
            ),
        )
