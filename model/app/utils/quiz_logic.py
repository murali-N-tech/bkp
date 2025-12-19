from typing import List, Any

def get_level_description(level: int) -> str:
    """Get description for difficulty level"""
    mapping = {
        1: "Basics (Definitions & Terminology)",
        2: "Easy (Simple Concepts)",
        3: "Medium (Application & Logic)",
        4: "Hard (Complex Scenarios & Optimization)",
        5: "Certification (Comprehensive Mixed Assessment)"
    }
    return mapping.get(level, "General")

def auto_adjust_level(level: int, history: List[Any]) -> int:
    """Auto-adjust difficulty based on performance and question progress
    
    Strategy:
    1. Every 5 questions, increase difficulty (question progress)
    2. Based on last 2 answers (performance-based):
       - 2 correct: +1 level
       - 0 correct: -1 level
    3. Cap between 1 and 5
    """
    adjusted = level
    
    # Progressive difficulty: +1 level every 5 questions asked
    question_count = len(history)
    progress_boost = question_count // 5  # +1 for Q5, +2 for Q10, etc.
    adjusted = min(5, adjusted + progress_boost)
    
    # Performance-based adjustment (last 2 answers)
    if len(history) >= 2:
        last_two = history[-2:]
        correct = sum(h.get("was_correct", False) if isinstance(h, dict) else h.was_correct for h in last_two)

        if correct == 2:
            adjusted = min(5, adjusted + 1)
        elif correct == 0:
            adjusted = max(1, adjusted - 1)

    return adjusted
