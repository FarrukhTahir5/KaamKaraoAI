from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class UserRequestInput(BaseModel):
    message: str

class ExtractedDetails(BaseModel):
    service_type: str
    location: str
    resolved_location: str
    time_text: str
    preferred_day: str
    preferred_slot: str
    suggested_slot: str
    urgency: str
    language: str
    issue: str

class UserRequestResponse(BaseModel):
    request_id: str
    original_message: str
    workflow_plan: List[str]
    extracted: Optional[ExtractedDetails] = None
    requires_clarification: bool = False
    missing_fields: List[str] = []
    message: Optional[str] = None
    next_step: str

class MatchRequest(BaseModel):
    request_id: str

class ScoreBreakdown(BaseModel):
    rating_score: float
    availability_score: float
    distance_score: float
    completion_score: float
    response_speed_score: float

class ProviderMatched(BaseModel):
    id: str
    name: str
    service_type: str
    distance_km: float
    rating: float
    available_slot: str
    completion_rate: float
    response_time_min: int
    estimated_charges: str
    trust_score: float
    is_recommended: bool

class WhyNotOther(BaseModel):
    provider: str
    reason: str

class RecommendedProvider(BaseModel):
    id: str
    name: str
    trust_score: float
    reason: str
    why_not_others: List[WhyNotOther] = []

class MatchResponse(BaseModel):
    request_id: str
    providers: List[ProviderMatched]
    recommended_provider: Optional[RecommendedProvider] = None
    message: Optional[str] = None
    alternate_option: Optional[Dict[str, Any]] = None

class BookRequest(BaseModel):
    request_id: str
    provider_id: str

class BookingSchema(BaseModel):
    booking_id: str
    request_id: str
    provider_id: str
    provider_name: str
    service_type: str
    location: str
    slot: str
    status: str
    estimated_charges: str
    created_at: str

class FollowUpReminder(BaseModel):
    type: str
    scheduled_for: str
    message: str

class FollowUpDetails(BaseModel):
    reminders: List[FollowUpReminder]

class BookResponse(BaseModel):
    booking: BookingSchema
    confirmation_message: str
    follow_up: FollowUpDetails

class AgentTraceLog(BaseModel):
    id: str
    request_id: str
    timestamp: str
    agent: str
    action: str
    input: str
    output: str
    status: str

class TraceResponse(BaseModel):
    request_id: str
    trace: List[AgentTraceLog]
