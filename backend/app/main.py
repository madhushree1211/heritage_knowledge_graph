import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from app.api.endpoints import router as api_router

app = FastAPI(
    title="Intelligent Cultural Heritage Semantic Search System API",
    description="Backend API combining Knowledge Graphs, Semantic/Vector Search, and RAG for Tamil Nadu Cultural Heritage Discovery",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite default
    "http://localhost:8000",
    "*"  # Allow all during development/hackathon
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount endpoints
app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Welcome to the Cultural Heritage KG API. Use /api/search or /docs for API documentation."
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
