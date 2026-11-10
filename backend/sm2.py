"""
Travigo - SuperMemo-2 (SM-2) Spaced Repetition Engine
Automates phrase review scheduling to optimize recall for travelers before trip departure.
"""

from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

class SM2Input(BaseModel):
    phrase_id: str
    quality: int = Field(..., ge=0, le=5, description="Recall rating: 0=Blackout, 1=Wrong, 2=Hard, 3=Good, 4=Easy, 5=Perfect")
    repetitions: int = Field(default=0, ge=0, description="Consecutive successful reviews")
    ease_factor: float = Field(default=2.5, ge=1.3, description="Easiness factor (minimum 1.3)")
    interval_days: int = Field(default=1, ge=1, description="Current interval in days")
    last_reviewed_at: Optional[str] = None

class SM2Result(BaseModel):
    phrase_id: str
    quality: int
    repetitions: int
    ease_factor: float
    interval_days: int
    next_review_date: str
    retention_score: int
    mastery_level: str
    scheduled_label: str

def calculate_sm2(item: SM2Input) -> SM2Result:
    """
    Computes the next review interval, updated ease factor, and repetition count
    using the SuperMemo-2 algorithm.
    """
    q = item.quality
    ef = item.ease_factor
    reps = item.repetitions
    interval = item.interval_days

    # Calculate new Ease Factor (EF')
    # EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    new_ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    if new_ef < 1.3:
        new_ef = 1.3
    new_ef = round(new_ef, 3)

    # Calculate Interval and Repetitions
    if q < 3:
        # Failure to recall: reset repetitions count and repeat tomorrow
        new_reps = 0
        new_interval = 1
    else:
        # Successful recall
        if reps == 0:
            new_interval = 1
        elif reps == 1:
            new_interval = 6
        else:
            new_interval = max(1, round(interval * new_ef))
        new_reps = reps + 1

    # Compute Next Review Timestamp
    now = datetime.now(timezone.utc)
    next_date = now + timedelta(days=new_interval)
    next_date_str = next_date.isoformat()

    # Retention estimate & Mastery Level
    # Estimated retention percentage based on repetitions and ease factor
    retention_score = min(100, max(10, int(35 + (new_reps * 15) + (new_ef - 1.3) * 20)))
    if new_reps == 0:
        mastery_level = "Learning"
    elif new_reps < 3:
        mastery_level = "Familiar"
    elif new_reps < 5:
        mastery_level = "Proficient"
    else:
        mastery_level = "Mastered"

    if new_interval == 1:
        scheduled_label = "Tomorrow (1 day)"
    else:
        scheduled_label = f"In {new_interval} days"

    return SM2Result(
        phrase_id=item.phrase_id,
        quality=q,
        repetitions=new_reps,
        ease_factor=new_ef,
        interval_days=new_interval,
        next_review_date=next_date_str,
        retention_score=retention_score,
        mastery_level=mastery_level,
        scheduled_label=scheduled_label
    )
