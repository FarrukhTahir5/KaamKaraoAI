import re
import json
from app.utils.time_parser import parse_time
from app.agents.trace_logger import log_trace
from app.config import DATA_DIR

# Baseline defaults if files are not loaded
SERVICE_KEYWORDS = {
    "AC Technician": ["ac", "a/c", "air conditioner", "cooling", "ac wala", "ac technician", "ac repair", "ac service"],
    "Electrician": ["electrician", "bijli", "wire", "wiring", "socket", "switch", "spark", "breaker", "electric", "current"],
    "Plumber": ["plumber", "pipe", "leak", "leakage", "pani", "geyser", "tap", "washroom", "drain"],
    "Tutor": ["tutor", "teacher", "math", "maths", "physics", "chemistry", "grade", "class", "tuition", "academy"],
    "Beautician": ["beautician", "salon", "makeup", "home salon", "facial", "mehndi", "bridal"]
}

URGENCY_KEYWORDS = ["spark", "fire", "jal raha", "leak", "flood", "emergency", "urgent", "abhi", "foran", "gas leak", "current"]

# Load service keywords dynamically from JSON if exists
try:
    keywords_path = DATA_DIR / "service_keywords.json"
    if keywords_path.exists():
        with open(keywords_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            SERVICE_KEYWORDS = {}
            urgency_keys = set()
            for svc, val in data.items():
                SERVICE_KEYWORDS[svc] = val.get("keywords", [])
                for u_kw in val.get("urgency_keywords", []):
                    urgency_keys.add(u_kw)
            URGENCY_KEYWORDS = list(urgency_keys)
except Exception as e:
    pass

COMMON_ROMAN_URDU_WORDS = [
    "mujhe", "chahiye", "hai", "ko", "mein", "subah", "subha", "sham", "abhi", 
    "jaldi", "karwa", "banda", "kaam", "batao", "karna", "aaj", "kal", "ho", "raha"
]


def extract_intent(request_id: str, user_message: str) -> dict:
    """
    Parses user natural language message to extract:
    - service_type
    - location
    - time_text
    - preferred_day / preferred_slot / suggested_slot
    - urgency (low/normal/high)
    - language
    - issue
    """
    text = user_message.lower()
    
    # 1. Detect service type
    service_type = ""
    for svc, keywords in SERVICE_KEYWORDS.items():
        if any(re.search(rf"\b{kw}\b", text) or kw in text for kw in keywords):
            service_type = svc
            break
            
    # 2. Detect location keyword
    locations_list = ["g-13", "g-11", "g-10", "f-10", "f-11", "bahria town", "dha", "rawalpindi", "i-8", "blue area"]
    try:
        loc_path = DATA_DIR / "location_data.json"
        if loc_path.exists():
            with open(loc_path, "r", encoding="utf-8") as f:
                loc_data = json.load(f)
                # Sort keys by length in reverse to match longer terms first e.g., Saddar Rawalpindi before Saddar
                locations_list = sorted([k.lower() for k in loc_data.keys()], key=len, reverse=True)
    except Exception as e:
        pass

    detected_loc = ""
    for loc in locations_list:
        if loc in text:
            detected_loc = loc.upper()
            break

            
    # 3. Detect time text
    # Try to extract the time part or keywords
    time_text = "today"
    time_keywords_flat = ["aaj subah", "aaj subha", "aaj sham", "tonight", "kal subah", "kal subha", "kal sham", "weekend", "abhi", "urgent", "kal", "aaj", "today", "tomorrow"]
    for tk in time_keywords_flat:
        if tk in text:
            time_text = tk
            break
            
    parsed_time_details = parse_time(time_text)
    
    # 4. Detect urgency
    urgency = "normal"
    if any(kw in text for kw in URGENCY_KEYWORDS):
        urgency = "high"
        
    # 5. Detect language
    language = "English"
    # Simple check for Urdu unicode characters (Urdu script)
    if any(ord(char) > 127 for char in user_message):
        language = "Urdu"
    elif any(re.search(rf"\b{word}\b", text) for word in COMMON_ROMAN_URDU_WORDS):
        language = "Roman Urdu"
        
    # 6. Extract issue context / description
    issue = "General Request"
    if service_type == "AC Technician":
        issue = "AC service or repair"
    elif service_type == "Electrician":
        if "spark" in text:
            issue = "Socket spark hazard"
        elif "switch" in text or "socket" in text:
            issue = "Switch/socket repair"
        else:
            issue = "Electrical repair"
    elif service_type == "Plumber":
        if "leak" in text or "leaking" in text:
            issue = "Pipe water leakage"
        elif "geyser" in text:
            issue = "Geyser leaking/repair"
        else:
            issue = "Plumbing works"
    elif service_type == "Tutor":
        # Extract class or subject
        class_match = re.search(r"grade \d+|class \d+", text)
        sub_match = re.search(r"maths|physics|chemistry|english", text)
        class_text = class_match.group(0).capitalize() if class_match else "Grade 9"
        sub_text = sub_match.group(0).capitalize() if sub_match else "Maths"
        issue = f"{class_text} {sub_text} tuition"
    elif service_type == "Beautician":
        issue = "Home salon services"

    extracted = {
        "service_type": service_type,
        "location": detected_loc,
        "resolved_location": "", # Will be filled by Location Agent
        "time_text": time_text,
        "preferred_day": parsed_time_details["preferred_day"],
        "preferred_slot": parsed_time_details["preferred_slot"],
        "suggested_slot": parsed_time_details["suggested_slot"],
        "urgency": urgency,
        "language": language,
        "issue": issue
    }
    
    log_trace(
        request_id=request_id,
        agent="Intent Agent",
        action="Extracted request details",
        input_data=user_message,
        output_data=f"service={service_type}, location={detected_loc or 'None'}, time={time_text}, urgency={urgency}, language={language}",
        status="success" if service_type else "warning"
    )
    
    return extracted
