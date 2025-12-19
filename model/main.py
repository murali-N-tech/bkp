import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import mcq, curriculum, quiz, statistics, next_level, topics

# Initialize FastAPI app
app = FastAPI(title="Adaptive Quiz Engine", version="1.0.0")

# ==========================================
# CORS CONFIGURATION
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# INCLUDE ROUTERS
# ==========================================
app.include_router(mcq.router)
app.include_router(curriculum.router)
app.include_router(quiz.router)
app.include_router(statistics.router)
app.include_router(next_level.router)
app.include_router(topics.router)

# ==========================================
# HEALTH CHECK
# ==========================================
@app.get("/health")
async def health():
    return {"status": "healthy"}

# ==========================================
# MAIN EXECUTION
# ==========================================
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
