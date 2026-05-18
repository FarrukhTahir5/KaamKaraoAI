import re
from datetime import datetime, timedelta

TIME_KEYWORDS = {
    "now": ["abhi", "urgent", "jaldi", "right now", "asap", "foran", "emergency", "immediately"],
    "today_morning": ["aaj subah", "aaj subha", "today morning", "morning", "subah", "subha"],
    "today_evening": ["aaj sham", "today evening", "evening", "sham"],
    "tonight": ["raat", "tonight", "aaj raat"],
    "tomorrow_morning": ["kal subah", "kal subha", "tomorrow morning"],
    "tomorrow_evening": ["kal sham", "tomorrow evening", "kal ki sham"],
    "weekend": ["weekend", "saturday", "sunday", "haftay", "itwar"]
}

def parse_time(time_text: str) -> dict:
    """
    Parses Roman Urdu / English time text and maps it to structured date/time slots.
    Returns a dictionary with:
    - preferred_day
    - preferred_slot
    - suggested_slot
    """
    text = time_text.lower().strip()
    
    preferred_day = "today"
    preferred_slot = "morning"
    suggested_slot = "10:00 AM"

    # Emergency / urgent mapping
    if any(k in text for k in TIME_KEYWORDS["now"]):
        preferred_day = "today"
        preferred_slot = "now"
        # Round to next 15 mins for slot suggestion
        now = datetime.now()
        suggested_slot = (now + timedelta(minutes=15)).strftime("%I:%M %p")
        return {
            "preferred_day": preferred_day,
            "preferred_slot": preferred_slot,
            "suggested_slot": suggested_slot
        }

    # Weekend mapping
    if any(k in text for k in TIME_KEYWORDS["weekend"]):
        preferred_day = "weekend"
        preferred_slot = "morning"
        suggested_slot = "11:00 AM"
        return {
            "preferred_day": preferred_day,
            "preferred_slot": preferred_slot,
            "suggested_slot": suggested_slot
        }

    # Tomorrow evening mapping
    if any(k in text for k in TIME_KEYWORDS["tomorrow_evening"]):
        preferred_day = "tomorrow"
        preferred_slot = "evening"
        suggested_slot = "4:00 PM"
        return {
            "preferred_day": preferred_day,
            "preferred_slot": preferred_slot,
            "suggested_slot": suggested_slot
        }

    # Tomorrow morning mapping
    if any(k in text for k in TIME_KEYWORDS["tomorrow_morning"]) or "tomorrow" in text or "kal" in text:
        preferred_day = "tomorrow"
        preferred_slot = "morning"
        suggested_slot = "10:00 AM"
        # Check if they explicitly said "sham" for tomorrow
        if "sham" in text or "evening" in text:
            preferred_slot = "evening"
            suggested_slot = "5:00 PM"
        return {
            "preferred_day": preferred_day,
            "preferred_slot": preferred_slot,
            "suggested_slot": suggested_slot
        }

    # Tonight mapping
    if any(k in text for k in TIME_KEYWORDS["tonight"]) or "raat" in text:
        preferred_day = "today"
        preferred_slot = "tonight"
        suggested_slot = "8:00 PM"
        return {
            "preferred_day": preferred_day,
            "preferred_slot": preferred_slot,
            "suggested_slot": suggested_slot
        }

    # Today evening mapping
    if any(k in text for k in TIME_KEYWORDS["today_evening"]) or "sham" in text or "evening" in text:
        preferred_day = "today"
        preferred_slot = "evening"
        suggested_slot = "5:00 PM"
        return {
            "preferred_day": preferred_day,
            "preferred_slot": preferred_slot,
            "suggested_slot": suggested_slot
        }

    # Today morning mapping
    if any(k in text for k in TIME_KEYWORDS["today_morning"]) or "morning" in text or "subah" in text or "subha" in text:
        preferred_day = "today"
        preferred_slot = "morning"
        suggested_slot = "10:00 AM"
        return {
            "preferred_day": preferred_day,
            "preferred_slot": preferred_slot,
            "suggested_slot": suggested_slot
        }

    # Default fallback
    return {
        "preferred_day": preferred_day,
        "preferred_slot": preferred_slot,
        "suggested_slot": suggested_slot
    }
