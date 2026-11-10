"""
Travigo - Unified Audio & Speech Synthesis Service
Provides native pronunciation audio endpoints with caching and format conversion.
"""

import io
import base64
from typing import Optional, Dict, Any

# In-memory audio cache to provide sub-10ms response times for recruiters
AUDIO_CACHE: Dict[str, str] = {}

def synthesize_audio_base64(text: str, language_code: str = "es") -> Dict[str, Any]:
    """
    Synthesizes audio for a phrase using gTTS if available, or returns speech metadata.
    Returns a data URI string that can be played in any browser or mobile web audio player.
    """
    cache_key = f"{language_code}:{text.strip().lower()}"
    if cache_key in AUDIO_CACHE:
        return {
            "text": text,
            "language": language_code,
            "cached": True,
            "audio_data_uri": AUDIO_CACHE[cache_key]
        }

    try:
        from gtts import gTTS
        tts = gTTS(text=text, lang=language_code, slow=False)
        mp3_fp = io.BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)
        b64_audio = base64.b64encode(mp3_fp.read()).decode("utf-8")
        data_uri = f"data:audio/mp3;base64,{b64_audio}"
        
        # Cache the result
        AUDIO_CACHE[cache_key] = data_uri
        return {
            "text": text,
            "language": language_code,
            "cached": False,
            "audio_data_uri": data_uri
        }
    except Exception as e:
        # Fallback if gTTS is offline or not installed
        return {
            "text": text,
            "language": language_code,
            "cached": False,
            "audio_data_uri": None,
            "fallback_engine": "web_speech_api",
            "message": f"Synthesis using browser Web Speech API: {str(e)}"
        }
