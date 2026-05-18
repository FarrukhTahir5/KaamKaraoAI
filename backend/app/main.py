import uvicorn
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

from app.models.schemas import (
    UserRequestInput,
    UserRequestResponse,
    MatchRequest,
    MatchResponse,
    BookRequest,
    BookResponse,
    TraceResponse
)
from app.services.storage import (
    get_requests,
    save_request,
    get_providers,
    get_bookings,
    reset_all_data,
    read_json,
    PROVIDERS_FILE
)
from app.utils.ids import generate_request_id
from app.agents.planner_agent import create_plan
from app.agents.intent_agent import extract_intent
from app.agents.location_agent import resolve_location
from app.agents.provider_agent import find_matching_providers
from app.agents.ranking_agent import rank_providers
from app.agents.decision_agent import make_decision
from app.agents.booking_agent import book_provider
from app.agents.followup_agent import schedule_followups
from app.agents.trace_logger import get_traces_by_request

app = FastAPI(
    title="KaamKarao AI Backend",
    description="Agentic service orchestrator for informal economic matching and booking lifecycles.",
    version="1.0.0"
)

# Enable CORS for React Native / Expo development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "app": "KaamKarao AI",
        "status": "running",
        "message": "Agentic service orchestrator backend is active."
    }

@app.post("/api/request", response_model=UserRequestResponse)
def submit_request(payload: UserRequestInput):
    """
    Step 1: Planner Agent plans the steps,
    Step 2: Intent Agent extracts key terms,
    Step 3: Location Agent normalizes the user location and maps coordinates.
    """
    existing_requests = get_requests()
    req_id = generate_request_id(len(existing_requests))
    
    # 1. Planner Agent
    plan_details = create_plan(req_id, payload.message)
    
    # 2. Intent Agent
    extracted = extract_intent(req_id, payload.message)
    
    # 3. Location Agent
    loc_res = resolve_location(req_id, extracted)
    
    # Save the request state to mock database
    req_data = {
        "request_id": req_id,
        "message": payload.message,
        "workflow_plan": plan_details["plan"],
        "extracted": None if loc_res["requires_clarification"] else loc_res["extracted"],
        "requires_clarification": loc_res["requires_clarification"],
        "missing_fields": loc_res.get("missing_fields", []),
        "clarification_message": loc_res.get("message", None)
    }
    save_request(req_data)
    
    if loc_res["requires_clarification"]:
        return UserRequestResponse(
            request_id=req_id,
            original_message=payload.message,
            workflow_plan=plan_details["plan"],
            extracted=None,
            requires_clarification=True,
            missing_fields=loc_res["missing_fields"],
            message=loc_res["message"],
            next_step="clarify_location"
        )
        
    return UserRequestResponse(
        request_id=req_id,
        original_message=payload.message,
        workflow_plan=plan_details["plan"],
        extracted=loc_res["extracted"],
        requires_clarification=False,
        missing_fields=[],
        message=None,
        next_step="provider_matching"
    )

@app.post("/api/match", response_model=MatchResponse)
def match_providers(payload: MatchRequest):
    """
    Step 4: Provider Discovery Agent matches service type and area,
    Step 5: Ranking Agent calculates trust scores,
    Step 6: Decision Agent makes final selection.
    """
    requests = get_requests()
    target_req = next((r for r in requests if r["request_id"] == payload.request_id), None)
    
    if not target_req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request ID not found."
        )
        
    if target_req.get("requires_clarification"):
        return MatchResponse(
            request_id=payload.request_id,
            providers=[],
            message="Clarification required before matching can proceed."
        )
        
    extracted = target_req["extracted"]
    service_type = extracted["service_type"]
    location = extracted["location"]
    suggested_slot = extracted["suggested_slot"]
    urgency = extracted["urgency"]
    
    # 4. Discovery
    discovered = find_matching_providers(payload.request_id, service_type, location)
    
    # 5. Ranking
    ranked = rank_providers(payload.request_id, discovered, suggested_slot, urgency)
    
    # Check if empty
    if not ranked:
        # No matching providers - propose alternate times or locations
        # Fallback to finding nearest matching service provider regardless of G-13 slot availability
        all_provs = get_providers()
        alternates = [p for p in all_provs if p["service_type"] == service_type]
        alt_option = None
        if alternates:
            # pick closest
            alternates.sort(key=lambda x: x.get("distance_map", {}).get(location, 10.0))
            closest = alternates[0]
            alt_option = {
                "provider": closest["name"],
                "slot": closest["available_slots"][0] if closest["available_slots"] else "Anytime",
                "reason": "Closest available alternate provider."
            }
            
        return MatchResponse(
            request_id=payload.request_id,
            providers=[],
            message="No provider is available at your requested time.",
            alternate_option=alt_option
        )
        
    # 6. Decision Agent
    decision = make_decision(payload.request_id, ranked)
    
    return MatchResponse(
        request_id=payload.request_id,
        providers=ranked,
        recommended_provider=decision
    )

@app.post("/api/book", response_model=BookResponse)
def confirm_booking(payload: BookRequest):
    """
    Step 7: Booking Agent reserves provider,
    Step 8: Follow-Up Agent schedules reminder objects.
    """
    requests = get_requests()
    target_req = next((r for r in requests if r["request_id"] == payload.request_id), None)
    
    if not target_req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request ID not found."
        )
        
    extracted = target_req["extracted"]
    
    # 7. Booking simulation
    booking_res = book_provider(payload.request_id, payload.provider_id, extracted)
    
    # 8. Follow-up scheduling
    booking_obj = booking_res["booking"]
    followup_res = schedule_followups(
        request_id=payload.request_id,
        booking_id=booking_obj["booking_id"],
        provider_name=booking_obj["provider_name"],
        service_type=booking_obj["service_type"],
        slot_text=booking_obj["slot"]
    )
    
    return BookResponse(
        booking=booking_obj,
        confirmation_message=booking_res["confirmation_message"],
        follow_up=followup_res
    )

@app.get("/api/trace/{request_id}", response_model=TraceResponse)
def get_trace(request_id: str):
    """
    Retrieves step-by-step reasoning traces for agent transparency.
    """
    traces = get_traces_by_request(request_id)
    return TraceResponse(
        request_id=request_id,
        trace=traces
    )

@app.get("/api/bookings")
def get_all_bookings():
    return get_bookings()

@app.get("/api/providers")
def get_all_providers():
    return get_providers()

@app.post("/api/demo/reset")
def reset_demo():
    reset_all_data()
    return {
        "status": "success",
        "message": "Demo data has been reset to defaults."
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
