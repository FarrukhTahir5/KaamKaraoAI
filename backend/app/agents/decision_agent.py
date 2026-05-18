from app.agents.trace_logger import log_trace

def make_decision(request_id: str, ranked_providers: list) -> dict:
    """
    Selects the recommended provider and explains the rationale.
    Also provides clear contrast reasoning for secondary providers.
    """
    if not ranked_providers:
        log_trace(
            request_id=request_id,
            agent="Decision Agent",
            action="Selected provider",
            input_data="No ranked providers",
            output_data="Decision failed: No candidates available",
            status="error"
        )
        return {
            "selected_provider": None,
            "reason": "No service providers were available in your coverage area at this time.",
            "why_not_others": []
        }
        
    recommended = None
    others = []
    
    for p in ranked_providers:
        if p.get("is_recommended") or not recommended:
            recommended = p
        else:
            others.append(p)
            
    # Generate positive, natural sounding rationale
    name = recommended["name"]
    dist = recommended["distance_km"]
    rating = recommended["rating"]
    cr = recommended["completion_rate"]
    slot = recommended["available_slot"]
    
    # Dynamic Review Quote Fetcher
    review_quote = ""
    try:
        from app.config import DATA_DIR
        import json
        reviews_path = DATA_DIR / "reviews.json"
        if reviews_path.exists():
            with open(reviews_path, "r", encoding="utf-8") as f:
                reviews_list = json.load(f)
                prov_reviews = [r for r in reviews_list if r.get("provider_id") == recommended["id"]]
                if prov_reviews:
                    # Pick highest rated comment
                    prov_reviews.sort(key=lambda x: x.get("stars", 5), reverse=True)
                    best_comment = prov_reviews[0].get("comment")
                    best_user = prov_reviews[0].get("user_name")
                    review_quote = f" Recent customer review by {best_user}: \"{best_comment}\""
    except Exception as e:
        pass

    reason = (
        f"{name} is recommended because they are nearby ({dist} km away), available at the requested slot ({slot}), "
        f"possess an exceptional customer rating of {rating}/5, and maintain a stellar {int(cr)}% completion rate."
    )
    if review_quote:
        reason += review_quote

    
    why_not_others = []
    for other in others[:2]: # include up to 2 other choices
        o_name = other["name"]
        o_dist = other["distance_km"]
        o_score = other["trust_score"]
        
        contrast_reason = f"A solid alternative, but slightly farther away ({o_dist} km) and has a lower overall trust score ({o_score}/100)."
        if other["rating"] < recommended["rating"]:
            contrast_reason = f"Good option, but has a lower customer rating ({other['rating']}/5) and slightly less availability."
            
        why_not_others.append({
            "provider": o_name,
            "reason": contrast_reason
        })
        
    # If no other providers were found
    if not why_not_others:
        why_not_others.append({
            "provider": "None Available",
            "reason": "No other matching providers exist in G-13 for this slot."
        })
        
    decision_output = {
        "id": recommended["id"],
        "name": name,
        "trust_score": recommended["trust_score"],
        "reason": reason,
        "why_not_others": why_not_others
    }
    
    log_trace(
        request_id=request_id,
        agent="Decision Agent",
        action="Selected provider",
        input_data=f"{len(ranked_providers)} candidates",
        output_data=f"Selected {name} with score {recommended['trust_score']}",
        status="success"
    )
    
    return decision_output
