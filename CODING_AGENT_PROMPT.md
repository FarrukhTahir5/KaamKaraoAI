# KaamKarao AI — Detailed Coding Agent Prompt

## Role

You are a senior full-stack hackathon coding agent. Your job is to build a working prototype for **KaamKarao AI**, a mobile-first Agentic AI Service Orchestrator for the informal economy.

The prototype must be practical, handy, demo-ready, and aligned with the hackathon requirement that **Google Antigravity must be central to the system logic, orchestration, implementation workflow, and demonstration artifacts**.

Build the system as a clean, working MVP, not a large production marketplace.

---

# 1. Product Summary

## Product Name

**KaamKarao AI**

## Tagline

**Bas kaam batao, AI banda dhoond dega.**

## One-Line Pitch

KaamKarao AI is a mobile-first agentic AI assistant that understands local service requests in Urdu, Roman Urdu, and English, finds the best nearby provider, simulates booking, and handles follow-up automatically.

## Core Problem

In Pakistan and similar informal economies, users find plumbers, AC technicians, electricians, tutors, beauticians, and home service providers through:

- WhatsApp groups
- phone calls
- informal referrals
- random recommendations
- repeated manual follow-ups

This causes:

- inefficient service matching
- missed service opportunities
- no real availability check
- poor user experience
- no confirmation trail
- no automated follow-up

## Core Solution

The user simply types or speaks a natural request, for example:

```text
Mujhe kal subah G-13 mein AC technician chahiye
```

The system should:

1. Understand the natural language request.
2. Extract service type, location, time, urgency, issue, and language.
3. Discover matching nearby providers from mock data.
4. Rank providers using distance, availability, rating, completion rate, and response speed.
5. Recommend the best provider with clear reasoning.
6. Simulate booking confirmation.
7. Generate a WhatsApp-style confirmation message.
8. Simulate reminders and follow-up.
9. Show a complete agent trace/log of every workflow step.

---

# 2. Hackathon Requirement Alignment

This is **not** a simple listing app.

The system must clearly demonstrate:

```text
Planning → Intent Understanding → Provider Discovery → Ranking → Decision → Booking Action → Follow-Up → Trace Logs
```

## Mandatory Challenge Requirements

The prototype must satisfy:

| Requirement | Implementation |
|---|---|
| Mobile App | Build using React Native + Expo |
| Web App | Optional, not required for MVP |
| Natural language input | Text input with demo examples |
| Urdu/Roman Urdu/English support | Rule-based + optional LLM-ready structure |
| Provider discovery | Mock dataset |
| Matching and ranking | Trust score formula |
| Booking simulation | Booking object saved to mock DB |
| Follow-up automation | Reminder and completion check objects |
| Agentic workflow | Separate backend agent modules |
| Trace/logs | Visible in mobile app and saved in backend |
| Google Antigravity | Use as central development/orchestration platform and document usage |

---

# 3. Technical Stack

## Required Stack

Use the following stack unless there is a strong technical reason not to:

### Mobile App

```text
React Native + Expo
JavaScript or TypeScript
```

### Backend

```text
FastAPI
Python
Pydantic
JSON file storage for mock database
```

### Data Storage

Use simple JSON files for hackathon speed:

```text
providers.json
bookings.json
agent_logs.json
requests.json
reminders.json
```

### API Style

Use REST APIs.

### AI / Agent Logic

For MVP, use deterministic rule-based logic with modular agent files.

Optional: leave clean extension points for external LLM calls, but the prototype should work without depending on paid or unstable APIs.

---

# 4. High-Level Architecture

Build the system with the following architecture:

```text
React Native Mobile App
        |
        | REST API calls
        v
FastAPI Backend
        |
        v
Agentic Orchestration Layer
        |
        ├── Planner Agent
        ├── Intent Agent
        ├── Location Agent
        ├── Provider Discovery Agent
        ├── Ranking Agent
        ├── Decision Agent
        ├── Booking Agent
        ├── Follow-Up Agent
        └── Trace Logger
        |
        v
Mock JSON Database
        |
        ├── Providers
        ├── Requests
        ├── Bookings
        ├── Reminders
        └── Agent Logs
```

---

# 5. Final Folder Structure

Create this folder structure:

```text
kaamkarao-ai/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   │
│   │   ├── agents/
│   │   │   ├── __init__.py
│   │   │   ├── planner_agent.py
│   │   │   ├── intent_agent.py
│   │   │   ├── location_agent.py
│   │   │   ├── provider_agent.py
│   │   │   ├── ranking_agent.py
│   │   │   ├── decision_agent.py
│   │   │   ├── booking_agent.py
│   │   │   ├── followup_agent.py
│   │   │   └── trace_logger.py
│   │   │
│   │   ├── data/
│   │   │   ├── providers.json
│   │   │   ├── requests.json
│   │   │   ├── bookings.json
│   │   │   ├── reminders.json
│   │   │   └── agent_logs.json
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── storage.py
│   │   │   └── scoring.py
│   │   │
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── ids.py
│   │       └── time_parser.py
│   │
│   ├── requirements.txt
│   └── README.md
│
├── mobile/
│   ├── App.js
│   ├── package.json
│   ├── app.json
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js
│   │   │
│   │   ├── screens/
│   │   │   ├── HomeScreen.js
│   │   │   ├── UnderstandingScreen.js
│   │   │   ├── ProviderRankingScreen.js
│   │   │   ├── RecommendationScreen.js
│   │   │   ├── BookingConfirmationScreen.js
│   │   │   ├── FollowUpScreen.js
│   │   │   └── AgentTraceScreen.js
│   │   │
│   │   ├── components/
│   │   │   ├── ProviderCard.js
│   │   │   ├── ConfirmationCard.js
│   │   │   ├── TraceLogCard.js
│   │   │   ├── StatusPill.js
│   │   │   └── PrimaryButton.js
│   │   │
│   │   └── theme/
│   │       └── colors.js
│   │
│   └── README.md
│
├── docs/
│   ├── architecture.md
│   ├── antigravity-usage.md
│   ├── demo-script.md
│   ├── judging-strategy.md
│   └── screenshots/
│
└── README.md
```

---

# 6. Backend Requirements

## 6.1 FastAPI App

Create a FastAPI backend with the following endpoints:

```http
GET /
POST /api/request
POST /api/match
POST /api/book
GET /api/trace/{request_id}
GET /api/bookings
GET /api/providers
POST /api/demo/reset
```

The backend must run with:

```bash
uvicorn app.main:app --reload
```

---

# 7. API Details

## 7.1 Health Check

### Endpoint

```http
GET /
```

### Response

```json
{
  "app": "KaamKarao AI",
  "status": "running",
  "message": "Agentic service orchestrator backend is active."
}
```

---

## 7.2 Submit Natural Language Request

### Endpoint

```http
POST /api/request
```

### Request Body

```json
{
  "message": "Mujhe kal subah G-13 mein AC technician chahiye"
}
```

### Backend Workflow

This endpoint should run:

```text
Planner Agent
Intent Agent
Location Agent
Trace Logger
```

### Response Body

```json
{
  "request_id": "REQ-1001",
  "original_message": "Mujhe kal subah G-13 mein AC technician chahiye",
  "workflow_plan": [
    "extract_intent",
    "resolve_location",
    "discover_providers",
    "rank_providers",
    "select_provider",
    "simulate_booking",
    "schedule_followup",
    "log_trace"
  ],
  "extracted": {
    "service_type": "AC Technician",
    "location": "G-13",
    "resolved_location": "G-13 Islamabad",
    "time_text": "kal subah",
    "preferred_day": "tomorrow",
    "preferred_slot": "morning",
    "suggested_slot": "10:00 AM",
    "urgency": "normal",
    "language": "Roman Urdu",
    "issue": "AC service or repair"
  },
  "next_step": "provider_matching"
}
```

---

## 7.3 Match and Rank Providers

### Endpoint

```http
POST /api/match
```

### Request Body

```json
{
  "request_id": "REQ-1001"
}
```

### Backend Workflow

This endpoint should run:

```text
Provider Discovery Agent
Ranking Agent
Decision Agent
Trace Logger
```

### Response Body

```json
{
  "request_id": "REQ-1001",
  "providers": [
    {
      "id": "p001",
      "name": "Ali AC Services",
      "service_type": "AC Technician",
      "distance_km": 2.1,
      "rating": 4.8,
      "available_slot": "10:00 AM",
      "completion_rate": 94,
      "response_time_min": 8,
      "estimated_charges": "Rs. 1500 - Rs. 2000",
      "trust_score": 92,
      "is_recommended": true
    },
    {
      "id": "p002",
      "name": "Umar Cooling",
      "service_type": "AC Technician",
      "distance_km": 3.4,
      "rating": 4.6,
      "available_slot": "9:30 AM",
      "completion_rate": 90,
      "response_time_min": 12,
      "estimated_charges": "Rs. 1200 - Rs. 1800",
      "trust_score": 87,
      "is_recommended": false
    }
  ],
  "recommended_provider": {
    "id": "p001",
    "name": "Ali AC Services",
    "trust_score": 92,
    "reason": "Ali AC Services is nearby, available in the requested morning slot, has a high rating, and has a strong completion record.",
    "why_not_others": [
      {
        "provider": "Umar Cooling",
        "reason": "Good option, but slightly farther and lower trust score."
      },
      {
        "provider": "Fast Cool Repair",
        "reason": "Available, but lower rating and completion rate."
      }
    ]
  }
}
```

---

## 7.4 Confirm Booking

### Endpoint

```http
POST /api/book
```

### Request Body

```json
{
  "request_id": "REQ-1001",
  "provider_id": "p001"
}
```

### Backend Workflow

This endpoint should run:

```text
Booking Agent
Follow-Up Agent
Trace Logger
```

### Response Body

```json
{
  "booking": {
    "booking_id": "KK-1024",
    "request_id": "REQ-1001",
    "provider_id": "p001",
    "provider_name": "Ali AC Services",
    "service_type": "AC Technician",
    "location": "G-13 Islamabad",
    "slot": "Tomorrow, 10:00 AM",
    "status": "confirmed",
    "estimated_charges": "Rs. 1500 - Rs. 2000",
    "created_at": "ISO_TIMESTAMP"
  },
  "confirmation_message": "Booking Confirmed ✅\n\nService: AC Technician\nProvider: Ali AC Services\nTime: Tomorrow, 10:00 AM\nLocation: G-13 Islamabad\nCharges: Rs. 1500 - Rs. 2000\nBooking ID: KK-1024\n\nReminder will be sent 1 hour before visit.",
  "follow_up": {
    "reminders": [
      {
        "type": "user_reminder",
        "scheduled_for": "Tomorrow, 9:00 AM",
        "message": "Reminder: Ali AC Services will arrive at 10:00 AM for your AC Technician booking."
      },
      {
        "type": "completion_check",
        "scheduled_for": "Tomorrow, 12:00 PM",
        "message": "Was your AC service completed?"
      },
      {
        "type": "rating_request",
        "scheduled_for": "Tomorrow, 12:15 PM",
        "message": "Please rate your experience with Ali AC Services."
      }
    ]
  }
}
```

---

## 7.5 Get Agent Trace

### Endpoint

```http
GET /api/trace/{request_id}
```

### Response Body

```json
{
  "request_id": "REQ-1001",
  "trace": [
    {
      "timestamp": "ISO_TIMESTAMP",
      "agent": "Planner Agent",
      "action": "Created workflow plan",
      "input": "Mujhe kal subah G-13 mein AC technician chahiye",
      "output": "8-step workflow plan created",
      "status": "success"
    },
    {
      "timestamp": "ISO_TIMESTAMP",
      "agent": "Intent Agent",
      "action": "Extracted request details",
      "input": "Mujhe kal subah G-13 mein AC technician chahiye",
      "output": "service=AC Technician, location=G-13, time=tomorrow morning",
      "status": "success"
    },
    {
      "timestamp": "ISO_TIMESTAMP",
      "agent": "Provider Discovery Agent",
      "action": "Found matching providers",
      "input": "AC Technician near G-13",
      "output": "4 matching providers found",
      "status": "success"
    },
    {
      "timestamp": "ISO_TIMESTAMP",
      "agent": "Ranking Agent",
      "action": "Calculated trust scores",
      "input": "4 providers",
      "output": "Ali AC Services ranked highest with score 92",
      "status": "success"
    },
    {
      "timestamp": "ISO_TIMESTAMP",
      "agent": "Booking Agent",
      "action": "Created booking",
      "input": "provider=p001, slot=10:00 AM",
      "output": "booking_id=KK-1024",
      "status": "success"
    },
    {
      "timestamp": "ISO_TIMESTAMP",
      "agent": "Follow-Up Agent",
      "action": "Scheduled reminders",
      "input": "booking_id=KK-1024",
      "output": "3 follow-up reminders created",
      "status": "success"
    }
  ]
}
```

---

# 8. Agent Module Details

## 8.1 Planner Agent

File:

```text
backend/app/agents/planner_agent.py
```

Purpose:

Create a clear workflow plan for every user request.

Function:

```python
def create_plan(user_message: str) -> dict:
    ...
```

Output:

```json
{
  "plan": [
    "extract_intent",
    "resolve_location",
    "discover_providers",
    "rank_providers",
    "select_provider",
    "simulate_booking",
    "schedule_followup",
    "log_trace"
  ],
  "summary": "Service request workflow plan created."
}
```

---

## 8.2 Intent Agent

File:

```text
backend/app/agents/intent_agent.py
```

Purpose:

Extract structured fields from natural language.

Must support:

- English
- Urdu keywords
- Roman Urdu keywords

Supported example inputs:

```text
Mujhe kal subah G-13 mein AC technician chahiye
Aaj electrician chahiye socket spark kar raha hai
Need plumber near Bahria Town tonight
Grade 9 maths tutor chahiye near F-10
Sunday ko home salon service chahiye
Geyser leak ho raha hai, plumber chahiye
```

Extract:

```json
{
  "service_type": "AC Technician",
  "location": "G-13",
  "time_text": "kal subah",
  "preferred_day": "tomorrow",
  "preferred_slot": "morning",
  "urgency": "normal",
  "language": "Roman Urdu",
  "issue": "AC service or repair"
}
```

### Service Keyword Mapping

Implement a practical mapping:

```python
SERVICE_KEYWORDS = {
    "AC Technician": [
        "ac", "a/c", "air conditioner", "cooling", "ac wala", "ac technician", "ac repair", "ac service"
    ],
    "Electrician": [
        "electrician", "bijli", "wire", "wiring", "socket", "switch", "spark", "breaker", "electric"
    ],
    "Plumber": [
        "plumber", "pipe", "leak", "leakage", "pani", "geyser", "tap", "washroom", "drain"
    ],
    "Tutor": [
        "tutor", "teacher", "math", "maths", "physics", "chemistry", "grade", "class", "tuition"
    ],
    "Beautician": [
        "beautician", "salon", "makeup", "home salon", "facial", "mehndi", "bridal"
    ]
}
```

### Time Keyword Mapping

```python
TIME_KEYWORDS = {
    "now": ["abhi", "urgent", "jaldi", "right now", "asap", "foran"],
    "today_morning": ["aaj subah", "today morning"],
    "today_evening": ["aaj sham", "today evening", "evening"],
    "tonight": ["raat", "tonight"],
    "tomorrow_morning": ["kal subah", "tomorrow morning"],
    "tomorrow_evening": ["kal sham", "tomorrow evening"],
    "weekend": ["weekend", "saturday", "sunday", "haftay"]
}
```

### Urgency Detection

High urgency if message contains:

```text
spark
fire
jal raha
leak
flood
emergency
urgent
abhi
foran
gas leak
current
```

Output urgency:

```text
low
normal
high
```

---

## 8.3 Location Agent

File:

```text
backend/app/agents/location_agent.py
```

Purpose:

Normalize locations and provide mock coordinates.

Supported locations:

```text
G-13
G-11
G-10
F-10
F-11
Bahria Town
DHA
Rawalpindi
I-8
Blue Area
```

Output:

```json
{
  "raw_location": "G-13",
  "resolved_location": "G-13 Islamabad",
  "lat": 33.6500,
  "lng": 72.9600
}
```

If location is missing:

```json
{
  "requires_clarification": true,
  "message": "Please tell your area, for example: G-13, F-10, Bahria Town."
}
```

---

## 8.4 Provider Discovery Agent

File:

```text
backend/app/agents/provider_agent.py
```

Purpose:

Find matching providers from `providers.json`.

Function:

```python
def find_matching_providers(service_type: str, location: str) -> list:
    ...
```

Rules:

1. Match service type.
2. Match area coverage.
3. Include distance from `distance_map`.
4. Return up to 5 providers.

---

## 8.5 Ranking Agent

File:

```text
backend/app/agents/ranking_agent.py
```

Purpose:

Calculate Trust Score.

Use this formula:

```text
Trust Score = 0.30 * RatingScore
            + 0.25 * AvailabilityScore
            + 0.20 * DistanceScore
            + 0.15 * CompletionRate
            + 0.10 * ResponseSpeedScore
```

### Scoring Rules

RatingScore:

```text
rating / 5 * 100
```

AvailabilityScore:

```text
100 if requested slot is available
90 if same time window is available
70 if alternate slot same day
40 otherwise
```

DistanceScore:

```text
100 if distance <= 1 km
90 if distance <= 2.5 km
80 if distance <= 4 km
60 if distance <= 6 km
40 otherwise
```

CompletionRate:

```text
use provider completion_rate directly
```

ResponseSpeedScore:

```text
100 if response_time_min <= 5
90 if response_time_min <= 10
75 if response_time_min <= 20
60 if response_time_min <= 30
40 otherwise
```

For high urgency requests, modify weights:

```text
Availability: 35%
Distance: 30%
Rating: 15%
Completion: 10%
Response speed: 10%
```

Output:

```json
{
  "provider_id": "p001",
  "trust_score": 92,
  "score_breakdown": {
    "rating_score": 96,
    "availability_score": 100,
    "distance_score": 90,
    "completion_score": 94,
    "response_speed_score": 90
  }
}
```

---

## 8.6 Decision Agent

File:

```text
backend/app/agents/decision_agent.py
```

Purpose:

Select best provider and explain decision.

Output:

```json
{
  "selected_provider_id": "p001",
  "selected_provider_name": "Ali AC Services",
  "reason": "Ali AC Services is nearby, available in the requested morning slot, has a high rating, and has a strong completion record.",
  "why_not_others": [
    {
      "provider": "Umar Cooling",
      "reason": "Good option, but slightly farther and lower trust score."
    }
  ]
}
```

---

## 8.7 Booking Agent

File:

```text
backend/app/agents/booking_agent.py
```

Purpose:

Simulate booking.

Actions:

1. Generate booking ID.
2. Create booking object.
3. Save booking to `bookings.json`.
4. Mark status as `confirmed`.
5. Generate confirmation message.
6. Log booking action.

Booking ID format:

```text
KK-1024
KK-1025
KK-1026
```

Output:

```json
{
  "booking_id": "KK-1024",
  "status": "confirmed",
  "confirmation_message": "Booking Confirmed..."
}
```

---

## 8.8 Follow-Up Agent

File:

```text
backend/app/agents/followup_agent.py
```

Purpose:

Create simulated reminders and follow-up actions.

Reminder types:

```text
user_reminder
provider_status_check
completion_check
rating_request
```

Output:

```json
{
  "reminders": [
    {
      "type": "user_reminder",
      "scheduled_for": "Tomorrow, 9:00 AM",
      "message": "Reminder: Ali AC Services will arrive at 10:00 AM."
    },
    {
      "type": "completion_check",
      "scheduled_for": "Tomorrow, 12:00 PM",
      "message": "Was your AC service completed?"
    }
  ]
}
```

Save reminders to:

```text
reminders.json
```

---

## 8.9 Trace Logger

File:

```text
backend/app/agents/trace_logger.py
```

Purpose:

Record every agent action.

Each log item must include:

```json
{
  "id": "LOG-1001",
  "request_id": "REQ-1001",
  "timestamp": "ISO_TIMESTAMP",
  "agent": "Intent Agent",
  "action": "Extracted request details",
  "input": "Mujhe kal subah G-13 mein AC technician chahiye",
  "output": "service=AC Technician, location=G-13, time=tomorrow morning",
  "status": "success"
}
```

---

# 9. Mock Data Requirements

Create at least 20 mock providers in:

```text
backend/app/data/providers.json
```

Services must include:

- AC Technician
- Electrician
- Plumber
- Tutor
- Beautician

## Sample Provider Schema

```json
{
  "id": "p001",
  "name": "Ali AC Services",
  "service_type": "AC Technician",
  "areas": ["G-13", "G-11", "F-11"],
  "base_location": "G-11 Islamabad",
  "distance_map": {
    "G-13": 2.1,
    "G-11": 0.8,
    "F-11": 3.2
  },
  "rating": 4.8,
  "available_slots": ["9:30 AM", "10:00 AM", "2:00 PM", "5:00 PM"],
  "completion_rate": 94,
  "response_time_min": 8,
  "estimated_charges": "Rs. 1500 - Rs. 2000",
  "emergency_available": false
}
```

## Required Demo Providers

Include these providers:

```json
[
  {
    "id": "p001",
    "name": "Ali AC Services",
    "service_type": "AC Technician",
    "areas": ["G-13", "G-11", "F-11"],
    "base_location": "G-11 Islamabad",
    "distance_map": {
      "G-13": 2.1,
      "G-11": 0.8,
      "F-11": 3.2
    },
    "rating": 4.8,
    "available_slots": ["10:00 AM", "2:00 PM", "5:00 PM"],
    "completion_rate": 94,
    "response_time_min": 8,
    "estimated_charges": "Rs. 1500 - Rs. 2000",
    "emergency_available": false
  },
  {
    "id": "p002",
    "name": "Umar Cooling",
    "service_type": "AC Technician",
    "areas": ["G-13", "G-10", "F-10"],
    "base_location": "G-10 Islamabad",
    "distance_map": {
      "G-13": 3.4,
      "G-10": 1.0,
      "F-10": 2.6
    },
    "rating": 4.6,
    "available_slots": ["9:30 AM", "1:00 PM"],
    "completion_rate": 90,
    "response_time_min": 12,
    "estimated_charges": "Rs. 1200 - Rs. 1800",
    "emergency_available": true
  },
  {
    "id": "p003",
    "name": "Fast Cool Repair",
    "service_type": "AC Technician",
    "areas": ["G-13", "F-10", "F-11"],
    "base_location": "F-11 Islamabad",
    "distance_map": {
      "G-13": 2.8,
      "F-10": 2.2,
      "F-11": 0.7
    },
    "rating": 4.2,
    "available_slots": ["11:00 AM", "3:00 PM"],
    "completion_rate": 82,
    "response_time_min": 18,
    "estimated_charges": "Rs. 1000 - Rs. 1600",
    "emergency_available": false
  }
]
```

---

# 10. Mobile App Requirements

## 10.1 App Flow

The mobile app must follow this flow:

```text
Home Screen
    ↓
AI Understanding Screen
    ↓
Provider Ranking Screen
    ↓
Recommendation Screen
    ↓
Booking Confirmation Screen
    ↓
Follow-Up Screen
    ↓
Agent Trace Screen
```

---

## 10.2 Home Screen

File:

```text
mobile/src/screens/HomeScreen.js
```

Purpose:

User enters natural language service request.

UI Elements:

```text
Title: KaamKarao AI
Subtitle: Bas kaam batao, AI banda dhoond dega.

Input placeholder:
"Aapko kya service chahiye?"

Demo buttons:
- AC Technician Demo
- Emergency Electrician Demo
- Tutor Demo

Main button:
Find Service Provider
```

Demo request values:

```text
AC Technician Demo:
Mujhe kal subah G-13 mein AC technician chahiye

Emergency Electrician Demo:
Aaj electrician chahiye socket spark kar raha hai G-13 mein

Tutor Demo:
Grade 9 maths tutor chahiye near F-10
```

Important:

Add demo buttons so the hackathon demo does not fail due to typing mistakes.

---

## 10.3 Understanding Screen

File:

```text
mobile/src/screens/UnderstandingScreen.js
```

Show:

```text
AI understood your request

Service: AC Technician
Location: G-13 Islamabad
Time: Tomorrow morning
Urgency: Normal
Language: Roman Urdu
Issue: AC service or repair
```

Button:

```text
Find Best Provider
```

If missing fields exist, show friendly clarification message.

---

## 10.4 Provider Ranking Screen

File:

```text
mobile/src/screens/ProviderRankingScreen.js
```

Show top 3 provider cards:

```text
Ali AC Services
2.1 km away
Rating: 4.8
Available: 10:00 AM
Trust Score: 92/100
Estimated Charges: Rs. 1500 - Rs. 2000
```

Each card should display:

- provider name
- service type
- distance
- rating
- available slot
- estimated charges
- trust score
- recommended badge if applicable

Button:

```text
View AI Recommendation
```

---

## 10.5 Recommendation Screen

File:

```text
mobile/src/screens/RecommendationScreen.js
```

Show:

```text
Recommended Provider:
Ali AC Services

Why this provider?
- Nearby: 2.1 km away
- Available tomorrow morning at 10:00 AM
- High rating: 4.8
- Completion rate: 94%
- Fast response time: 8 minutes
```

Also show:

```text
Why not others?
Umar Cooling: Good option, but slightly farther and lower trust score.
Fast Cool Repair: Available, but lower rating and completion rate.
```

Button:

```text
Confirm Booking
```

---

## 10.6 Booking Confirmation Screen

File:

```text
mobile/src/screens/BookingConfirmationScreen.js
```

Show:

```text
Booking Confirmed ✅

Booking ID: KK-1024
Service: AC Technician
Provider: Ali AC Services
Location: G-13 Islamabad
Slot: Tomorrow, 10:00 AM
Estimated Charges: Rs. 1500 - Rs. 2000
Status: Confirmed
```

Show WhatsApp-style confirmation:

```text
Booking Confirmed ✅

Service: AC Technician
Provider: Ali AC Services
Time: Tomorrow, 10:00 AM
Location: G-13 Islamabad
Charges: Rs. 1500 - Rs. 2000
Booking ID: KK-1024

Reminder will be sent 1 hour before visit.
```

Buttons:

```text
Copy Message
View Follow-Up
View Agent Trace
```

Copy Message can simply copy text to clipboard or show an alert if clipboard setup is skipped.

---

## 10.7 Follow-Up Screen

File:

```text
mobile/src/screens/FollowUpScreen.js
```

Show timeline:

```text
Follow-Up Timeline

9:00 AM — Reminder sent to user
9:30 AM — Provider status check
10:00 AM — Appointment time
12:00 PM — Completion confirmation
12:15 PM — Rating request
```

Button:

```text
View Agent Trace
```

---

## 10.8 Agent Trace Screen

File:

```text
mobile/src/screens/AgentTraceScreen.js
```

This is a key judging screen.

Show logs as cards:

```text
[Planner Agent]
Created workflow plan: understand → match → rank → book → follow-up.

[Intent Agent]
Extracted service: AC Technician
Extracted location: G-13 Islamabad
Extracted time: Tomorrow morning

[Provider Discovery Agent]
Found 4 matching providers near G-13.

[Ranking Agent]
Calculated trust scores using distance, availability, rating, completion rate, and response time.

[Decision Agent]
Selected Ali AC Services with score 92/100.

[Booking Agent]
Created booking KK-1024 and reserved 10:00 AM slot.

[Follow-Up Agent]
Scheduled reminder for 9:00 AM.
```

Important:

This screen must make the project look agentic, not like a normal service booking app.

---

# 11. UI Design Guidelines

Keep the UI clean, practical, and mobile-first.

## Visual Style

Use:

```text
White / light background
Green or blue primary color
Rounded cards
Clear spacing
Large readable text
Simple icons if available
```

Do not overuse animations.

## UX Rules

1. User should complete demo in less than 60 seconds.
2. Every screen should have one clear action.
3. Demo buttons must be available.
4. Avoid hidden navigation.
5. Agent trace must be easy to access.
6. Booking confirmation must look visually satisfying.

---

# 12. Edge Case Handling

Implement basic edge cases.

## Missing Location

Input:

```text
Mujhe plumber chahiye
```

Output:

```json
{
  "requires_clarification": true,
  "missing_fields": ["location"],
  "message": "Please tell your area, for example: G-13, F-10, Bahria Town."
}
```

## Missing Time

Input:

```text
G-13 mein AC technician chahiye
```

Output:

```json
{
  "requires_clarification": true,
  "missing_fields": ["time"],
  "message": "When do you need the service? Options: Now, Today evening, Tomorrow morning, Weekend."
}
```

## Unknown Service

Input:

```text
Mujhe ghar ka kaam karwana hai
```

Output:

```json
{
  "requires_clarification": true,
  "missing_fields": ["service_type"],
  "message": "I could not detect the exact service. Please choose: Plumber, Electrician, AC Technician, Tutor, Beautician."
}
```

## No Provider Available

Output:

```json
{
  "message": "No provider is available at your requested time.",
  "alternate_option": {
    "provider": "Umar Cooling",
    "slot": "11:30 AM",
    "reason": "Closest available alternate provider."
  }
}
```

## Emergency Request

Input:

```text
Aaj electrician chahiye socket spark kar raha hai G-13 mein
```

Output:

```json
{
  "urgency": "high",
  "risk": "Electrical safety issue",
  "action": "Prioritizing nearest emergency electricians available now."
}
```

---

# 13. Demo Scenarios

## Main Demo Scenario

Use this as the primary demo:

```text
Mujhe kal subah G-13 mein AC technician chahiye
```

Expected extraction:

```json
{
  "service_type": "AC Technician",
  "location": "G-13",
  "resolved_location": "G-13 Islamabad",
  "preferred_slot": "morning",
  "suggested_slot": "10:00 AM",
  "urgency": "normal",
  "language": "Roman Urdu"
}
```

Expected recommendation:

```text
Ali AC Services
Trust Score: 92/100
Reason: Nearby, available tomorrow morning, high rating, strong completion record.
```

Expected booking:

```text
Booking ID: KK-1024
Slot: Tomorrow, 10:00 AM
Reminder: Tomorrow, 9:00 AM
```

## Secondary Demo Scenario

Use this for wow factor:

```text
Aaj electrician chahiye socket spark kar raha hai G-13 mein
```

Expected:

```text
Urgency: High
Risk: Electrical safety issue
Ranking prioritizes emergency availability and distance.
```

## Third Demo Scenario

Optional:

```text
Grade 9 maths tutor chahiye near F-10
```

Expected:

```text
Service: Tutor
Issue: Grade 9 Maths
Location: F-10
```

---

# 14. Google Antigravity Documentation Requirements

Create:

```text
docs/antigravity-usage.md
```

Include:

```markdown
# How Google Antigravity Was Used

Google Antigravity was used as the core agentic development platform for KaamKarao AI.

We used it to:
1. Plan the full application architecture.
2. Generate backend agent modules.
3. Build the REST API structure.
4. Implement mock provider matching.
5. Implement ranking and booking simulation.
6. Create the React Native mobile app flow.
7. Test API endpoints through terminal/browser workflows.
8. Verify the end-to-end demo.
9. Capture screenshots and execution artifacts.

The application itself follows the same agentic pattern:
Planner Agent → Intent Agent → Location Agent → Provider Discovery Agent → Ranking Agent → Decision Agent → Booking Agent → Follow-Up Agent → Trace Logger.

This ensures the solution demonstrates planning, reasoning, action execution, and traceability.
```

Also include screenshots of:

- Antigravity workspace
- Agent plan
- terminal test
- running backend
- mobile app demo
- agent trace output

If screenshots are not available, create placeholders in docs:

```markdown
![Antigravity Agent Plan](./screenshots/antigravity-agent-plan.png)
![Backend Test Run](./screenshots/backend-test-run.png)
![Mobile Agent Trace](./screenshots/mobile-agent-trace.png)
```

---

# 15. Root README Requirements

Create a professional root `README.md`.

Structure:

```markdown
# KaamKarao AI

## Problem

## Solution

## Key Features

## Demo Scenario

## System Architecture

## Agentic Workflow

## How Google Antigravity Was Used

## Tech Stack

## API Endpoints

## Mock Dataset

## Mobile App Screens

## Booking Simulation

## Follow-Up Automation

## Agent Trace Logs

## Edge Cases

## Assumptions

## Limitations

## Future Scope

## How to Run
```

## README Tone

Make it hackathon-friendly and clear.

Mention:

```text
This is not a simple provider listing app. It is an agentic service orchestration prototype that automates the lifecycle from user intent to booking and follow-up.
```

---

# 16. Demo Video Script File

Create:

```text
docs/demo-script.md
```

Include a 3–5 minute script.

## Script Outline

```markdown
# Demo Video Script

## 0:00–0:30 Problem
Informal service booking happens through WhatsApp, calls, and referrals.

## 0:30–1:00 Solution
KaamKarao AI turns one natural message into a complete booking workflow.

## 1:00–2:00 User Request + AI Understanding
Show: "Mujhe kal subah G-13 mein AC technician chahiye"

## 2:00–2:45 Provider Matching + Ranking
Show ranked providers and trust scores.

## 2:45–3:30 Booking Simulation
Show booking confirmation, booking ID, and WhatsApp-style message.

## 3:30–4:15 Follow-Up
Show reminder and completion-check timeline.

## 4:15–5:00 Agent Trace + Antigravity
Show logs and explain Google Antigravity usage.
```

---

# 17. Testing Requirements

Create simple backend tests manually or through a script.

## Test Inputs

```text
Mujhe kal subah G-13 mein AC technician chahiye
Aaj electrician chahiye socket spark kar raha hai G-13 mein
Need plumber near Bahria Town tonight
Grade 9 maths tutor chahiye near F-10
Sunday ko home salon service chahiye
```

## Expected Test Checks

For each input, verify:

1. Service type is extracted.
2. Location is extracted.
3. Time is extracted or clarification requested.
4. Providers are matched.
5. Providers are ranked.
6. Recommendation is generated.
7. Booking can be simulated.
8. Agent trace is generated.

Create:

```text
backend/test_requests.md
```

or a simple:

```text
backend/scripts/demo_test.py
```

---

# 18. Acceptance Criteria

The project is complete only if all of these work:

## Backend

- [ ] FastAPI server starts successfully.
- [ ] `/api/request` extracts service, location, time, urgency, language.
- [ ] `/api/match` returns ranked providers.
- [ ] Trust score is calculated.
- [ ] Recommended provider is selected.
- [ ] `/api/book` creates booking object.
- [ ] Booking is saved to `bookings.json`.
- [ ] Follow-up reminders are saved to `reminders.json`.
- [ ] Agent logs are saved to `agent_logs.json`.
- [ ] `/api/trace/{request_id}` returns logs.

## Mobile App

- [ ] Home screen works.
- [ ] Demo request button works.
- [ ] AI understanding screen displays extracted fields.
- [ ] Provider ranking screen displays top providers.
- [ ] Recommendation screen explains decision.
- [ ] Booking confirmation screen displays booking details.
- [ ] Follow-up screen displays reminder timeline.
- [ ] Agent trace screen displays logs.

## Documentation

- [ ] Root README exists.
- [ ] Antigravity usage doc exists.
- [ ] Demo script exists.
- [ ] Architecture doc exists.
- [ ] Setup instructions are clear.

---

# 19. Implementation Priority

Build in this order:

## Phase 1 — Backend Core

1. Create FastAPI app.
2. Create mock data files.
3. Build storage helper.
4. Build ID generation helper.
5. Build Planner Agent.
6. Build Intent Agent.
7. Build Location Agent.
8. Build Provider Agent.
9. Build Ranking Agent.
10. Build Decision Agent.
11. Build Booking Agent.
12. Build Follow-Up Agent.
13. Build Trace Logger.
14. Expose APIs.

## Phase 2 — Mobile Core

1. Create Expo app.
2. Build Home Screen.
3. Build API client.
4. Build Understanding Screen.
5. Build Provider Ranking Screen.
6. Build Recommendation Screen.
7. Build Booking Confirmation Screen.
8. Build Follow-Up Screen.
9. Build Agent Trace Screen.

## Phase 3 — Demo Safety

1. Add demo buttons.
2. Add fallback mock responses if backend unavailable.
3. Add loading states.
4. Add error messages.
5. Add reset endpoint.
6. Test main demo flow 5 times.

## Phase 4 — Documentation

1. Root README.
2. Antigravity usage doc.
3. Architecture doc.
4. Demo script.
5. Judging strategy doc.

---

# 20. Important Hackathon Constraints

Follow these strictly:

1. Do not build a complex marketplace.
2. Do not build payment integration.
3. Do not require authentication.
4. Do not use real personal data.
5. Do not depend on real providers.
6. Do not make Google Maps mandatory.
7. Do not overcomplicate the UI.
8. Do not hide agent logs.
9. Do not make the demo dependent on perfect typing.
10. Do not skip booking simulation.

---

# 21. Future Scope Section

Mention these as future improvements, not MVP tasks:

- Google Maps / Places API integration
- WhatsApp Business API integration
- Provider mobile app
- Real-time provider availability
- Digital payments
- User reviews
- Fraud detection
- Service guarantees
- Provider verification
- Multimodal photo-based issue detection
- Voice note transcription
- Dynamic pricing
- AI negotiation with providers

---

# 22. Final Build Goal

The final result should allow this complete flow:

```text
User enters:
"Mujhe kal subah G-13 mein AC technician chahiye"

System shows:
Service: AC Technician
Location: G-13 Islamabad
Time: Tomorrow morning
Urgency: Normal
Language: Roman Urdu

System finds:
Ali AC Services
Umar Cooling
Fast Cool Repair

System ranks:
Ali AC Services — Trust Score 92

System explains:
Ali is nearby, available at 10:00 AM, highly rated, and has strong completion history.

System books:
Booking ID KK-1024
Status Confirmed
Slot Tomorrow 10:00 AM

System follows up:
Reminder at 9:00 AM
Completion check at 12:00 PM
Rating request at 12:15 PM

System logs:
Planner Agent
Intent Agent
Provider Discovery Agent
Ranking Agent
Decision Agent
Booking Agent
Follow-Up Agent
Trace Logger
```

---

# 23. Final Note to Coding Agent

Prioritize a working, reliable, clean demo over extra features.

The winning version should clearly communicate:

```text
This is an agentic AI coordinator for local services.
It turns one informal natural-language request into a complete booking lifecycle.
It is practical, mobile-first, locally relevant, and traceable.
```

Do not stop after building a UI. The most important proof is:

```text
Agent trace + provider ranking + booking state change + follow-up simulation
```

Build those first.