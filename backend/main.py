"""
Travigo - FastAPI Unified Backend Service
Travel Language Learning Web App (FastAPI, Supabase, SM-2, AI/ML)
"""

from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

from sm2 import SM2Input, SM2Result, calculate_sm2
from services.translation import (
    TranslationRequest, TranslationResponse, translate_phrase, get_travel_packs
)
from services.audio import synthesize_audio_base64
from auth import UserRegister, UserLogin, TokenResponse, get_demo_token, create_access_token, DEMO_USER
import database

app = FastAPI(
    title="Travigo API - Travel Language Learning Backend",
    description="Unified backend providing SM-2 spaced repetition, travel translation, audio synthesis, trip countdowns, and retention analytics.",
    version="1.0.0"
)

# Enable CORS for web clients (Vercel, Localhost, Expo Web)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "Travigo API",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs",
        "description": "Travel Language Learning Web App with SM-2 Spaced Repetition"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# =========================================================================
# 1. Authentication Endpoints
# =========================================================================
@app.post("/api/auth/demo", response_model=TokenResponse)
def recruiter_demo_login():
    """One-click instant login for recruiters and interviewers reviewing the live demo."""
    return get_demo_token()

@app.post("/api/auth/login", response_model=TokenResponse)
def login(creds: UserLogin):
    if creds.email == DEMO_USER["email"] and creds.password == "password123":
        return get_demo_token()
    # Generates a valid session token
    token = create_access_token({"sub": creds.email})
    return TokenResponse(
        access_token=token,
        user={
            "id": f"user-{abs(hash(creds.email)) % 10000}",
            "email": creds.email,
            "username": creds.email.split("@")[0].capitalize(),
            "learning_language": "Spanish",
            "study_streak_days": 7
        }
    )

@app.post("/api/auth/register", response_model=TokenResponse)
def register(user: UserRegister):
    token = create_access_token({"sub": user.email})
    return TokenResponse(
        access_token=token,
        user={
            "id": f"user-{abs(hash(user.email)) % 10000}",
            "email": user.email,
            "username": user.username,
            "learning_language": user.learning_language,
            "study_streak_days": 1
        }
    )

# =========================================================================
# 2. Unified Translation & Audio Endpoints
# =========================================================================
@app.post("/api/translate", response_model=TranslationResponse)
def translate(req: TranslationRequest):
    """
    Translates travel phrases with scenario tags, phonetic romanization, and cultural tips.
    """
    return translate_phrase(req)

@app.get("/api/audio/tts")
def text_to_speech(
    text: str = Query(..., description="Text to synthesize"),
    lang: str = Query(default="es", description="Language code (es, fr, ja, de, it)")
):
    """
    Synthesizes native speech for phrases with caching for instant playback.
    """
    return synthesize_audio_base64(text, lang)

@app.get("/api/phrases/travel-packs")
def travel_packs(language: str = Query(default="Spanish")):
    """
    Returns curated survival travel phrase packs (Airport, Dining, Hotel, Emergency, Transit).
    """
    return get_travel_packs(language)

# =========================================================================
# 3. SM-2 Spaced Repetition Engine Endpoints
# =========================================================================
@app.post("/api/sm2/review", response_model=SM2Result)
def submit_sm2_review(review: SM2Input):
    """
    Computes updated SM-2 ease factor, interval, repetition count, and next review date.
    """
    result = calculate_sm2(review)
    database.update_phrase_sm2(review.phrase_id, {
        "repetitions": result.repetitions,
        "ease_factor": result.ease_factor,
        "interval_days": result.interval_days,
        "last_quality": result.quality,
        "retention_score": result.retention_score,
        "mastery_level": result.mastery_level,
        "next_review_at": result.next_review_date
    })
    return result

@app.get("/api/sm2/due")
def get_due_phrases():
    """
    Fetches user's phrases scheduled for spaced-repetition review today.
    """
    return database.get_due_phrases()

# =========================================================================
# 4. Trip Countdown & Retention Study Endpoints
# =========================================================================
class TripCreate(BaseModel):
    destination: str
    country: str
    target_language: str
    departure_date: str
    goal_phrases_count: int = 50

@app.get("/api/trips")
def list_trips():
    """
    Lists planned trips with departure countdown calculations.
    """
    return database.get_trips()

@app.post("/api/trips")
def create_trip(trip: TripCreate):
    return database.add_trip(trip.model_dump())

@app.get("/api/retention/analytics")
def get_retention_study():
    """
    Returns the retention diagnosis and 15-user cohort analysis
    showing the +35% return usage improvement driven by trip countdowns and saved audio.
    """
    return database.get_retention_analytics()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
