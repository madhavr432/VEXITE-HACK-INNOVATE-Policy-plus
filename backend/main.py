import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv, find_dotenv

from app.schemas.health import HealthResponse
from app.routes.bus import router as bus_router
from app.routes.gst import router as gst_router
from app.routes.ai import router as ai_router

# Load environment variables (searches current directory and parent directories)
load_dotenv(find_dotenv())

app = FastAPI(
    title="PolicyForge API",
    description="AI-powered policy decision-support platform backend",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Explicit production and local origins
DEFAULT_ORIGINS = [
    "https://policy-plus-zeta.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

cors_env = os.getenv("CORS_ORIGINS")
if cors_env:
    env_origins = [orig.strip() for orig in cors_env.split(",") if orig.strip()]
    origins = list(dict.fromkeys(DEFAULT_ORIGINS + env_origins))
else:
    origins = DEFAULT_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
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
