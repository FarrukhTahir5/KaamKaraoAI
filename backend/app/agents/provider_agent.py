from app.services.storage import get_providers
from app.agents.trace_logger import log_trace

def find_matching_providers(request_id: str, service_type: str, location: str) -> list:
    """
    Finds and filters matching providers from providers.json based on:
    - service_type
    - coverage areas or distance_map presence
    Loads up to 5 matching providers, mapping their specific distance.
    """
    all_providers = get_providers()
    matched = []
    
    clean_location = location.strip().upper()
    
    for provider in all_providers:
        # Match service type
        if provider.get("service_type") != service_type:
            continue
            
        # Check area coverage
        provider_areas = [area.upper() for area in provider.get("areas", [])]
        distance_map = provider.get("distance_map", {})
        
        # Format keys of distance_map to uppercase for comparison
        clean_distance_map = {k.upper(): v for k, v in distance_map.items()}
        
        # Match if in areas or has distance defined
        if clean_location in provider_areas or clean_location in clean_distance_map:
            # Map distance
            distance_km = clean_distance_map.get(clean_location, 5.0) # default fallback distance
            
            matched_provider = {
                "id": provider["id"],
                "name": provider["name"],
                "service_type": provider["service_type"],
                "rating": provider["rating"],
                "available_slots": provider["available_slots"],
                "completion_rate": provider["completion_rate"],
                "response_time_min": provider["response_time_min"],
                "estimated_charges": provider["estimated_charges"],
                "distance_km": distance_km,
                "emergency_available": provider.get("emergency_available", False)
            }
            matched.append(matched_provider)
            
    # Cap at 5 matching providers
    matched = matched[:5]
    
    log_trace(
        request_id=request_id,
        agent="Provider Discovery Agent",
        action="Found matching providers",
        input_data=f"service={service_type}, location={location}",
        output_data=f"{len(matched)} matching providers found",
        status="success" if matched else "warning"
    )
    
    return matched
