import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.schemas.health import HealthResponse
from app.routes.bus import router as bus_router
from app.routes.gst import router as gst_router
from app.routes.ai import router as ai_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="PolicyForge API",
    description="AI-powered policy decision-support platform backend",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint
@app.get("/api/health", response_model=HealthResponse, tags=["health"])
async def health_check():
    """
    Platform health check endpoint.
    Verifies service operational readiness.
    """
    return HealthResponse(status="ok", service="PolicyForge API")

# Include domain routers
app.include_router(bus_router)
app.include_router(gst_router)
app.include_router(ai_router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=True)
