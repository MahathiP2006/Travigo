"""
Travigo - Secure Authentication Service
Handles JWT token generation, password hashing, and instant recruiter demo logins.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr
from jose import jwt

# In production this comes from environment variable SECRET_KEY
JWT_SECRET = "travigo-super-secret-jwt-key-2026-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days token

class UserRegister(BaseModel):
    email: str
    username: str
    password: str
    learning_language: str = "Spanish"

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

# Demo recruiter account available by default
DEMO_USER = {
    "id": "demo-recruiter-uuid-001",
    "email": "recruiter@travigo-demo.com",
    "username": "Sarah Jenkins (Demo Traveler)",
    "learning_language": "Spanish",
    "study_streak_days": 14,
    "is_demo": True
}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)

def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None

def get_demo_token() -> TokenResponse:
    token = create_access_token({"sub": DEMO_USER["email"], "user_id": DEMO_USER["id"]})
    return TokenResponse(access_token=token, user=DEMO_USER)
