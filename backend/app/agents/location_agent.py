import json
from app.agents.trace_logger import log_trace
from app.config import DATA_DIR

LOCATION_COORDINATES = {
    "G-13": {"lat": 33.6500, "lng": 72.9600, "resolved": "G-13 Islamabad"},
    "G-11": {"lat": 33.6680, "lng": 72.9970, "resolved": "G-11 Islamabad"},
    "G-10": {"lat": 33.6780, "lng": 73.0120, "resolved": "G-10 Islamabad"},
    "F-10": {"lat": 33.6930, "lng": 73.0180, "resolved": "F-10 Islamabad"},
    "F-11": {"lat": 33.6840, "lng": 72.9800, "resolved": "F-11 Islamabad"},
    "BAHRIA TOWN": {"lat": 33.5600, "lng": 73.1200, "resolved": "Bahria Town Islamabad/Rawalpindi"},
    "DHA": {"lat": 33.5200, "lng": 73.1500, "resolved": "DHA Islamabad/Rawalpindi"},
    "RAWALPINDI": {"lat": 33.6000, "lng": 73.0600, "resolved": "Rawalpindi City"},
    "I-8": {"lat": 33.6690, "lng": 73.0780, "resolved": "I-8 Islamabad"},
    "BLUE AREA": {"lat": 33.7100, "lng": 73.0600, "resolved": "Blue Area Islamabad"}
}

# Load locations dynamically from JSON if exists
try:
    loc_path = DATA_DIR / "location_data.json"
    if loc_path.exists():
        with open(loc_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            LOCATION_COORDINATES = {}
            for key, val in data.items():
                LOCATION_COORDINATES[key.upper()] = {
                    "lat": val["lat"],
                    "lng": val["lng"],
                    "resolved": val["resolved_name"]
                }
except Exception as e:
    pass


def resolve_location(request_id: str, extracted_details: dict) -> dict:
    """
    Resolves spatial data, coordinates, and standardizes location names.
    If the location is empty/not detected, flags that clarification is required.
    """
    loc_key = extracted_details.get("location", "").strip().upper()
    
    if not loc_key:
        # Clarification Required
        log_trace(
            request_id=request_id,
            agent="Location Agent",
            action="Resolved location",
            input_data="Missing Location",
            output_data="Requires clarification: Location is missing",
            status="error"
        )
        return {
            "requires_clarification": True,
            "missing_fields": ["location"],
            "message": "Please tell your area, for example: G-13, F-10, Bahria Town."
        }
        
    resolved_info = LOCATION_COORDINATES.get(loc_key)
    
    if resolved_info:
        extracted_details["resolved_location"] = resolved_info["resolved"]
        extracted_details["lat"] = resolved_info["lat"]
        extracted_details["lng"] = resolved_info["lng"]
        
        log_trace(
            request_id=request_id,
            agent="Location Agent",
            action="Resolved location",
            input_data=loc_key,
            output_data=f"location={resolved_info['resolved']}, lat={resolved_info['lat']}, lng={resolved_info['lng']}",
            status="success"
        )
        return {
            "requires_clarification": False,
            "extracted": extracted_details
        }
    else:
        # Fallback if somehow not mapped directly
        extracted_details["resolved_location"] = f"{loc_key} Islamabad"
        extracted_details["lat"] = 33.6500
        extracted_details["lng"] = 72.9600
        
        log_trace(
            request_id=request_id,
            agent="Location Agent",
            action="Resolved location",
            input_data=loc_key,
            output_data=f"location={loc_key} Islamabad (Fallback Coordinates)",
            status="warning"
        )
        return {
            "requires_clarification": False,
            "extracted": extracted_details
        }
