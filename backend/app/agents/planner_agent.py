from app.agents.trace_logger import log_trace

def create_plan(request_id: str, user_message: str) -> dict:
    """
    Defines the structured plan for solving the user request.
    """
    plan = [
        "extract_intent",
        "resolve_location",
        "discover_providers",
        "rank_providers",
        "select_provider",
        "simulate_booking",
        "schedule_followup",
        "log_trace"
    ]
    
    log_trace(
        request_id=request_id,
        agent="Planner Agent",
        action="Created workflow plan",
        input_data=user_message,
        output_data="8-step workflow plan created",
        status="success"
    )
    
    return {
        "plan": plan,
        "summary": "Service request workflow plan created."
    }
