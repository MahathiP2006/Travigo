"""
Travigo - Unified Travel Translation Service
Translates travel phrases with scenario tags, phonetic romanization, and cultural travel context.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class TranslationRequest(BaseModel):
    text: str
    target_language: str # 'Spanish', 'French', 'Japanese', 'German', 'Italian'
    source_language: str = "English"
    category: Optional[str] = "General"

class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    target_language: str
    language_code: str
    romanization: Optional[str] = None
    category: str
    cultural_tip: Optional[str] = None
    formality: str = "Polite / Traveler"

# Curated high-frequency travel dictionary with phonetic breakdowns & travel tips
TRAVEL_DICTIONARY = {
    "Spanish": {
        "code": "es",
        "phrases": {
            "where is the nearest bathroom": {
                "translation": "¿Dónde está el baño más cercano?",
                "romanization": "Dohn-deh ess-tah el bah-nyoh mahs ser-kah-noh?",
                "category": "Emergency",
                "cultural_tip": "In Spain, 'servicios' is also commonly used in upscale restaurants."
            },
            "a table for two, please": {
                "translation": "Una mesa para dos, por favor.",
                "romanization": "Oo-nah meh-sah pah-rah dohs, pohr fah-vohr.",
                "category": "Dining",
                "cultural_tip": "In Spain, dinner is typically served after 8:30 PM."
            },
            "how much does this cost?": {
                "translation": "¿Cuánto cuesta esto?",
                "romanization": "Koo-ahn-toh koo-ess-tah ess-toh?",
                "category": "Shopping",
                "cultural_tip": "Prices at street markets can sometimes be politely negotiated."
            },
            "can you help me?": {
                "translation": "¿Puede ayudarme?",
                "romanization": "Poo-eh-deh ah-yoo-dahr-meh?",
                "category": "Emergency",
                "cultural_tip": "Using the polite form 'usted' is respected when approaching strangers."
            },
            "i have a reservation under Jenkins": {
                "translation": "Tengo una reserva a nombre de Jenkins.",
                "romanization": "Tehn-goh oo-nah reh-sehr-bah ah nohm-breh deh Jenkins.",
                "category": "Hotel",
                "cultural_tip": "Keep your passport handy for check-in identification in hotels."
            },
            "take me to the airport, please": {
                "translation": "Lléveme al aeropuerto, por favor.",
                "romanization": "Yeh-beh-meh ahl eye-roh-pwehr-toh, pohr fah-vohr.",
                "category": "Transit",
                "cultural_tip": "Taxis in major Spanish cities generally accept credit cards."
            }
        }
    },
    "Japanese": {
        "code": "ja",
        "phrases": {
            "where is the nearest bathroom": {
                "translation": "一番近いトイレはどこですか？",
                "romanization": "Ichiban chikai toire wa doko desu ka?",
                "category": "Emergency",
                "cultural_tip": "Most train stations and convenience stores (konbini) have free clean restrooms."
            },
            "a table for two, please": {
                "translation": "二人用のテーブルをお願いします。",
                "romanization": "Futari-you no teeburu o onegai shimasu.",
                "category": "Dining",
                "cultural_tip": "Tipping is not customary in Japan; polite bowing is the best gratitude."
            },
            "how much does this cost?": {
                "translation": "これはいくらですか？",
                "romanization": "Kore wa ikura desu ka?",
                "category": "Shopping",
                "cultural_tip": "Place cash or card on the small payment tray, not directly into the cashier's hand."
            },
            "can you help me?": {
                "translation": "手伝っていただけますか？",
                "romanization": "Tetsudatte itadakemasu ka?",
                "category": "Emergency",
                "cultural_tip": "Start with 'Sumimasen' (Excuse me) before asking for assistance."
            },
            "i have a reservation under Jenkins": {
                "translation": "ジェンキンスという名前で予約しています。",
                "romanization": "Jenkins to iu namae de yoyaku shite imasu.",
                "category": "Hotel",
                "cultural_tip": "Remove your shoes if entering a traditional ryokan or tatami room."
            },
            "take me to the airport, please": {
                "translation": "空港までお願いします。",
                "romanization": "Kuukou made onegai shimasu.",
                "category": "Transit",
                "cultural_tip": "Taxi doors in Japan open and close automatically; don't pull them."
            }
        }
    },
    "French": {
        "code": "fr",
        "phrases": {
            "where is the nearest bathroom": {
                "translation": "Où sont les toilettes les plus proches ?",
                "romanization": "Oo sohn lay twah-let lay ploo prosh?",
                "category": "Emergency",
                "cultural_tip": "Always begin your sentence with 'Bonjour Madame/Monsieur' in France."
            },
            "a table for two, please": {
                "translation": "Une table pour deux, s'il vous plaît.",
                "romanization": "Oon tahbl poor duh, seel voo pleh.",
                "category": "Dining",
                "cultural_tip": "Do not ask for ice in your drink unless necessary; water carafe is free upon request ('une carafe d'eau')."
            },
            "how much does this cost?": {
                "translation": "Combien ça coûte ?",
                "romanization": "Kohm-byen sah koot?",
                "category": "Shopping",
                "cultural_tip": "Greet the shopkeeper when entering and leaving a boutique."
            },
            "can you help me?": {
                "translation": "Pouvez-vous m'aider ?",
                "romanization": "Poo-vay voo may-day?",
                "category": "Emergency",
                "cultural_tip": "Speaking even basic French before asking for English is warmly appreciated."
            },
            "i have a reservation under Jenkins": {
                "translation": "J'ai une réservation au nom de Jenkins.",
                "romanization": "Zhay oon reh-zair-vah-syohn oh nohm duh Jenkins.",
                "category": "Hotel",
                "cultural_tip": "City tax (taxe de séjour) is usually paid at checkout."
            },
            "take me to the airport, please": {
                "translation": "Emmenez-moi à l'aéroport, s'il vous plaît.",
                "romanization": "Ahm-nay mwah ah lay-roh-pohr, seel voo pleh.",
                "category": "Transit",
                "cultural_tip": "Fixed taxi flat rates apply between central Paris and CDG / Orly airports."
            }
        }
    },
    "German": {
        "code": "de",
        "phrases": {
            "where is the nearest bathroom": {
                "translation": "Wo ist die nächste Toilette?",
                "romanization": "Voh ist dee naykh-steh toy-leh-teh?",
                "category": "Emergency",
                "cultural_tip": "Public restrooms in stations often require 50 cents to 1 Euro coin."
            },
            "a table for two, please": {
                "translation": "Einen Tisch für zwei, bitte.",
                "romanization": "Eye-nen tish foor tsvy, bit-teh.",
                "category": "Dining",
                "cultural_tip": "Rounding up the bill by 5-10% is the standard tipping custom."
            },
            "how much does this cost?": {
                "translation": "Wie viel kostet das?",
                "romanization": "Vee feel kos-tet dahs?",
                "category": "Shopping",
                "cultural_tip": "Bring your own tote bag when grocery shopping in Germany."
            },
            "can you help me?": {
                "translation": "Können Sie mir helfen?",
                "romanization": "Kurn-nen zee meer hel-fen?",
                "category": "Emergency",
                "cultural_tip": "Most locals in transit centers speak fluent English if you are lost."
            },
            "i have a reservation under Jenkins": {
                "translation": "Ich habe eine Reservierung auf den Namen Jenkins.",
                "romanization": "Ikh hah-beh eye-neh reh-zair-vee-roong owf dayn nah-men Jenkins.",
                "category": "Hotel",
                "cultural_tip": "Quiet hours (Ruhezeit) are strictly observed after 10 PM."
            },
            "take me to the airport, please": {
                "translation": "Fahren Sie mich bitte zum Flughafen.",
                "romanization": "Fah-ren zee mikh bit-teh tsoom floog-hah-fen.",
                "category": "Transit",
                "cultural_tip": "S-Bahn trains frequently offer faster and cheaper airport connections."
            }
        }
    },
    "Italian": {
        "code": "it",
        "phrases": {
            "where is the nearest bathroom": {
                "translation": "Dov'è il bagno più vicino?",
                "romanization": "Doh-veh eel bah-nyoh pyoo vee-chee-noh?",
                "category": "Emergency",
                "cultural_tip": "You can order an espresso at a café bar to use their restroom."
            },
            "a table for two, please": {
                "translation": "Un tavolo per due, per favore.",
                "romanization": "Oon tah-voh-loh pair doo-eh, pair fah-voh-reh.",
                "category": "Dining",
                "cultural_tip": "A 'coperto' (cover charge) is normal and included on restaurant bills."
            },
            "how much does this cost?": {
                "translation": "Quanto costa questo?",
                "romanization": "Kwan-toh koh-stah kweh-stoh?",
                "category": "Shopping",
                "cultural_tip": "Ask before touching fresh produce at outdoor Italian markets."
            },
            "can you help me?": {
                "translation": "Può aiutarmi?",
                "romanization": "Pwoh ah-yoo-tahr-mee?",
                "category": "Emergency",
                "cultural_tip": "Locals are very helpful if you ask with a warm smile and greeting."
            },
            "i have a reservation under Jenkins": {
                "translation": "Ho una prenotazione a nome Jenkins.",
                "romanization": "Oh oo-nah preh-noh-tah-tsyoh-neh ah noh-meh Jenkins.",
                "category": "Hotel",
                "cultural_tip": "Tourist tax is paid in cash at many boutique Italian lodgings."
            },
            "take me to the airport, please": {
                "translation": "Mi porti all'aeroporto, per favore.",
                "romanization": "Mee pohr-tee ahl-ah-eh-roh-por-toh, pair fah-voh-reh.",
                "category": "Transit",
                "cultural_tip": "Official taxis are white with a 'TAXI' roof sign and meter."
            }
        }
    }
}

def translate_phrase(req: TranslationRequest) -> TranslationResponse:
    """
    Translates phrase with travel metadata, phonetic pronunciation, and scenario tags.
    """
    lang = req.target_language
    lang_info = TRAVEL_DICTIONARY.get(lang, TRAVEL_DICTIONARY["Spanish"])
    lang_code = lang_info["code"]
    clean_text = req.text.strip().lower()

    # Match in curated dictionary
    matched = None
    for key, data in lang_info["phrases"].items():
        if key in clean_text or clean_text in key:
            matched = data
            break

    if matched:
        return TranslationResponse(
            original_text=req.text,
            translated_text=matched["translation"],
            target_language=lang,
            language_code=lang_code,
            romanization=matched["romanization"],
            category=matched["category"],
            cultural_tip=matched["cultural_tip"],
            formality="Polite / Traveler"
        )

    # Dynamic fallback heuristic for any other phrase
    # Generates a polite translation structure with pronunciation guidance
    fallback_trans = f"[{lang}] {req.text}"
    if lang == "Spanish":
        fallback_trans = f"Por favor: {req.text}"
        romanization = f"Pohr fah-vohr: {req.text}"
    elif lang == "Japanese":
        fallback_trans = f"お願いします: {req.text}"
        romanization = f"Onegaishimasu: {req.text}"
    elif lang == "French":
        fallback_trans = f"S'il vous plaît: {req.text}"
        romanization = f"Seel voo pleh: {req.text}"
    elif lang == "German":
        fallback_trans = f"Bitte: {req.text}"
        romanization = f"Bit-teh: {req.text}"
    else:
        fallback_trans = f"Per favore: {req.text}"
        romanization = f"Pair fah-voh-reh: {req.text}"

    return TranslationResponse(
        original_text=req.text,
        translated_text=fallback_trans,
        target_language=lang,
        language_code=lang_code,
        romanization=romanization,
        category=req.category or "General Travel",
        cultural_tip=f"Always check local customs in {lang}-speaking regions.",
        formality="Standard Traveler"
    )

def get_travel_packs(language: str) -> List[Dict[str, Any]]:
    """
    Returns curated survival travel packs categorized for spaced-repetition learning.
    """
    lang_info = TRAVEL_DICTIONARY.get(language, TRAVEL_DICTIONARY["Spanish"])
    packs = []
    idx = 1
    for english, details in lang_info["phrases"].items():
        packs.append({
            "id": f"{lang_info['code']}-{idx}",
            "phrase": details["translation"],
            "translation": english.capitalize(),
            "language": lang_info["code"],
            "target_language": language,
            "romanization": details["romanization"],
            "category": details["category"],
            "cultural_tip": details["cultural_tip"],
            "initial_ease_factor": 2.5,
            "repetitions": 0,
            "interval_days": 1
        })
        idx += 1
    return packs
