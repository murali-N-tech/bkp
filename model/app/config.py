# Configuration file for the application
import os
from pathlib import Path

# Set custom HuggingFace cache directory BEFORE any imports to avoid conflicts
custom_cache_dir = Path(__file__).resolve().parents[1] / ".hf_cache"
custom_cache_dir.mkdir(exist_ok=True)
os.environ["HF_HOME"] = str(custom_cache_dir)
os.environ["HF_HUB_DISABLE_TELEMETRY"] = "1"

from pymongo import MongoClient
from sentence_transformers import SentenceTransformer

try:
	from dotenv import load_dotenv
	# Load .env from project root (model/.env)
	env_path = Path(__file__).resolve().parents[1] / ".env"
	if env_path.exists():
		load_dotenv(env_path)
except Exception:
	# dotenv is optional; if not installed, environment vars must be set externally
	pass

# =========================
# OLLAMA CONFIG
# =========================
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "phi3"

# =========================
# GROQ CONFIG (Alternative to Ollama)
# =========================
USE_GROQ = os.getenv("USE_GROQ", "false").lower() == "true"
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "mixtral-8x7b-32768")  # or llama2-70b-4096
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# =========================
# MONGODB CONFIG
# =========================
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "adaptive_quiz")
COLLECTION = os.getenv("COLLECTION", "sessions")

# =========================
# QUIZ CONFIG
# =========================
MAX_RETRIES = 5
SEMANTIC_THRESHOLD = 0.85

# =========================
# PERSISTENT STATE
# =========================
mongo = MongoClient(MONGO_URL)
db = mongo[DB_NAME]
sessions = db[COLLECTION]

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

PREFETCH_CACHE = {}
