from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import documents, auth

app = FastAPI(
    title="LexAfrica API",
    description="Générateur de documents juridiques conformes au droit OHADA",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(documents.router, prefix="/api/v1/documents", tags=["documents"])


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok", "version": "0.2.0", "environment": settings.environment}
