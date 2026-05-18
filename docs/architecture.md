# KaamKarao AI — System Architecture 🏗️

KaamKarao AI is designed as a modular, event-driven, agentic orchestrator. The backend decouples standard API processing from agent thinking pipelines, enabling clear auditability and ease of scaling.

---

## 🗺️ Logical Architecture Diagram

```mermaid
graph TD
    subgraph Client App
        M[React Native + Expo Client]
    end

    subgraph FastAPI Gateways
        G1[POST /api/request]
        G2[POST /api/match]
        G3[POST /api/book]
        G4[GET /api/trace/{id}]
    end

    subgraph Orchestration Agents
        PL[Planner Agent]
        IT[Intent Agent]
        LO[Location Agent]
        DI[Discovery Agent]
        RK[Ranking Agent]
        DE[Decision Agent]
        BO[Booking Agent]
        FL[Follow-Up Agent]
    end

    subgraph Data Stores
        D1[(providers.json)]
        D2[(requests.json)]
        D3[(bookings.json)]
        D4[(reminders.json)]
        D5[(agent_logs.json)]
    end

    M -->|HTTP Requests| FastAPI Gateways
    G1 --> PL
    G1 --> IT
    G1 --> LO
    G2 --> DI
    G2 --> RK
    G2 --> DE
    G3 --> BO
    G3 --> FL
    
    PL -.->|Write Log| D5
    IT -.->|Write Log| D5
    LO -.->|Write Log| D5
    DI -.->|Write Log| D5
    RK -.->|Write Log| D5
    DE -.->|Write Log| D5
    BO -.->|Write Log| D5
    FL -.->|Write Log| D5

    LO -->|Save Request| D2
    DI -->|Read Providers| D1
    BO -->|Save Booking| D3
    FL -->|Save Reminders| D4
    G4 -->|Read Logs| D5
```

---

## 🕵️ Micro-Agent Responsibilities

### 1. Planning Layer (`planner_agent.py`)
Determines the sequence of operations required based on request complexity. Returns an array of execution steps (e.g. intent extraction, location normalization, discovery).

### 2. NLP Extraction Layer (`intent_agent.py`)
Responsible for understanding language queries:
- **English & Roman Urdu Regex Maps:** Scans keywords representing services (AC, bijli, plumber, tuition, beautician) and times (*kal subah, aaj sham, abhi*).
- **Urgency Scanners:** Identifies high-risk issues like *spark, fire, current, gas leak*.

### 3. Spatial Layer (`location_agent.py`)
Standardizes colloquial area strings into formal sectors (e.g., "G13" -> "G-13 Islamabad"). Maps centroid latitude and longitude values for distance calculators. Evaluates if missing values require user prompt interruptions.

### 4. Search Layer (`provider_agent.py`)
Filters providers based on location coordinates and capabilities. Calculates distance offsets from providers' baseline base sector maps.

### 5. Scoring Layer (`ranking_agent.py` & `scoring.py`)
Formulates comparative Trust Scores using a dynamic weighted score matrix:
- **Standard Mode:** Focused heavily on long-term ratings (30%) and slot availability (25%).
- **Emergency Urgency Mode:** Shifts weights to prioritize speed of dispatch—emphasizing slot overlaps (35%) and proximity distance (30%).

### 6. Rationale Explainability Layer (`decision_agent.py`)
Formulates reasoning outputs describing the recommended candidate's exact merits, and compares them with up to two alternatives.

### 7. Execution Reservation Layer (`booking_agent.py`)
Generates standardized booking entries (`KK-xxxx`), marks the slot as reserved, and formats copyable SMS confirmation text.

### 8. Reminder Coordinator (`followup_agent.py`)
Sets up simulated automation schedules inside the mock database, representing offline reminders and checks.

### 9. Logger (`trace_logger.py`)
Acts as the central trace recorder. Every agent push includes sequence parameters, status states, inputs received, and output reasoning.

---

## 🗄️ Database Schemas (Mock JSON)

### Providers Registry (`providers.json`)
```json
{
  "id": "p001",
  "name": "Ali AC Services",
  "service_type": "AC Technician",
  "areas": ["G-13", "G-11", "F-11"],
  "distance_map": {
    "G-13": 2.1,
    "G-11": 0.8
  },
  "rating": 4.8,
  "available_slots": ["10:00 AM", "2:00 PM"],
  "completion_rate": 94,
  "response_time_min": 8,
  "estimated_charges": "Rs. 1500 - Rs. 2000"
}
```

### Bookings Records (`bookings.json`)
```json
{
  "booking_id": "KK-1024",
  "request_id": "REQ-1001",
  "provider_id": "p001",
  "provider_name": "Ali AC Services",
  "slot": "Tomorrow, 10:00 AM",
  "status": "confirmed",
  "estimated_charges": "Rs. 1500 - Rs. 2000",
  "created_at": "2026-05-18T10:00:00Z"
}
```
