from fastapi import APIRouter, Request, HTTPException
import requests
import json
from app.config import OLLAMA_URL, OLLAMA_MODEL, USE_GROQ, GROQ_API_KEY, GROQ_MODEL, GROQ_API_URL
from app.prompts.curriculum_prompt import CURRICULUM_PROMPT_TEMPLATE
from app.utils.text_processing import clean_json_string
from app.utils.validation import validate_curriculum

router = APIRouter(prefix="/curriculum", tags=["curriculum"])

@router.post("/generate_curriculum")
async def create_curriculum(request: Request):
    """Generate a curriculum structure"""
    data = await request.json()
    user_input = data.get("prompt")
    if not user_input:
        raise HTTPException(status_code=400, detail="Prompt required")
    
    final_prompt = CURRICULUM_PROMPT_TEMPLATE.format(user_input=user_input)
    
    try:
        # Choose API provider based on configuration flag
        if USE_GROQ:
            print("[CURRICULUM] Using Groq API for curriculum generation")
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": GROQ_MODEL,
                "messages": [{"role": "user", "content": final_prompt}],
                "temperature": 0.5,
                "max_completion_tokens": 2000
            }
            resp = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
            if resp.status_code >= 400:
                print("[GROQ CURRICULUM ERROR] Status:", resp.status_code)
                print("[GROQ CURRICULUM ERROR] Body:\n", resp.text)
            resp.raise_for_status()
            # Groq returns choices -> message -> content
            groq_content = resp.json().get("choices", [])[0].get("message", {}).get("content", "")
            parsed = json.loads(clean_json_string(groq_content))
        else:
            print("[CURRICULUM] Using Ollama API for curriculum generation")
            resp = requests.post(
                OLLAMA_URL,
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": final_prompt,
                    "stream": False,
                    "format": "json",
                    "options": {"temperature": 0.5}
                },
                timeout=30
            )
            resp.raise_for_status()
            parsed = json.loads(clean_json_string(resp.json().get("response", "")))
        if validate_curriculum(parsed):
            return {"status": "success", "data": parsed}
    except Exception as e:
        print(e)
    return {"status": "error", "message": "Failed to generate Curriculum"}
