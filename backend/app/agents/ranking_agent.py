from app.services.scoring import calculate_trust_score
from app.agents.trace_logger import log_trace

def rank_providers(request_id: str, matched_providers: list, suggested_slot: str, urgency: str = "normal") -> list:
    """
    Ranks matching providers by calculating their trust score.
    Applies logic to map availability_match ("exact", "window", "alternate", "none").
    Sorts descending by trust score.
    """
    ranked_list = []
    
    # Standard time windows definition
    # Morning: 8 AM - 12 PM
    # Afternoon: 12 PM - 4 PM
    # Evening: 4 PM - 7 PM
    # Tonight: 7 PM - 10 PM
    def get_time_window(slot_str: str) -> str:
        s = slot_str.upper()
        if "AM" in s:
            # check hours
            hr = int(s.split(":")[0])
            if hr >= 8 and hr < 12:
                return "morning"
        elif "PM" in s:
            parts = s.split(":")
            hr = int(parts[0])
            # Handle 12 PM
            if hr == 12:
                return "afternoon"
            elif hr >= 1 and hr < 4:
                return "afternoon"
            elif hr >= 4 and hr < 7:
                return "evening"
            else:
                return "tonight"
        return "morning"

    target_window = get_time_window(suggested_slot)
    
    for provider in matched_providers:
        slots = provider.get("available_slots", [])
        
        # 1. Determine availability match level
        availability_match = "none"
        if suggested_slot in slots:
            availability_match = "exact"
        else:
            # Check window overlap
            window_overlap = False
            for sl in slots:
                if get_time_window(sl) == target_window:
                    window_overlap = True
                    break
            if window_overlap:
                availability_match = "window"
            elif len(slots) > 0:
                availability_match = "alternate"
                
        # 2. Get trust score calculation
        score_res = calculate_trust_score(
            rating=provider["rating"],
            distance_km=provider["distance_km"],
            availability_match=availability_match,
            completion_rate=provider["completion_rate"],
            response_time_min=provider["response_time_min"],
            urgency=urgency
        )
        
        # Map a single preferred slot out of available slots
        # Prefer exact matched, otherwise window overlapping, otherwise first alternative, otherwise default
        selected_slot = suggested_slot
        if suggested_slot not in slots:
            # find overlapping
            overlapping_slots = [sl for sl in slots if get_time_window(sl) == target_window]
            if overlapping_slots:
                selected_slot = overlapping_slots[0]
            elif slots:
                selected_slot = slots[0]
                
        ranked_provider = {
            "id": provider["id"],
            "name": provider["name"],
            "service_type": provider["service_type"],
            "distance_km": provider["distance_km"],
            "rating": provider["rating"],
            "available_slot": selected_slot,
            "completion_rate": provider["completion_rate"],
            "response_time_min": provider["response_time_min"],
            "estimated_charges": provider["estimated_charges"],
            "trust_score": score_res["trust_score"],
            "is_recommended": False
        }
        ranked_list.append(ranked_provider)
        
    # Sort descending by trust score
    ranked_list.sort(key=lambda x: x["trust_score"], reverse=True)
    
    # Mark the highest trust score provider as recommended
    if ranked_list:
        ranked_list[0]["is_recommended"] = True
        highest_name = ranked_list[0]["name"]
        highest_score = ranked_list[0]["trust_score"]
        log_out = f"{highest_name} ranked highest with score {highest_score}"
    else:
        log_out = "No providers to rank"
        
    log_trace(
        request_id=request_id,
        agent="Ranking Agent",
        action="Calculated trust scores",
        input_data=f"{len(matched_providers)} providers matched",
        output_data=log_out,
        status="success" if ranked_list else "warning"
    )
    
    return ranked_list
