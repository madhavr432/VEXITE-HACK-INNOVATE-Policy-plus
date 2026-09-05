"""
AI Policy Analyst Route (Commit 7)

Exposes the Gemini-powered policy interpretation layer.
All deterministic calculations are performed by the existing engines;
this route only orchestrates the AI analysis on top of validated results.
"""

import logging
from fastapi import APIRouter, HTTPException
from app.schemas.ai import AIPolicyAnalysisRequest, AIPolicyAnalysisResponse
from app.services.gemini_policy_analyst import analyze_bus_policy

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/analyze-policy", response_model=AIPolicyAnalysisResponse)
async def analyze_policy(request: AIPolicyAnalysisRequest):
    """
    AI Policy Analyst endpoint (Commit 7).

    Flow:
    1. Receive policy inputs from React frontend.
    2. Re-run deterministic simulation, stress-test, and risk engines.
    3. Assemble validated analysis context.
    4. Send to Gemini for structured interpretation.
    5. Validate Pydantic response and return to frontend.

    Gemini interprets validated results — it does not calculate or modify metrics.
    """
    try:
        result = analyze_bus_policy(
            request=request.policy,
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
