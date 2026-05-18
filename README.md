# KaamKarao AI 🚀
### *Bas kaam batao, AI banda dhoond dega.*

KaamKarao AI is a mobile-first **Agentic AI Service Orchestrator** for Pakistan's informal economy. Built during a fast-paced hackathon, this project demonstrates how a single natural language request in Urdu, Roman Urdu, or English is parsed, planned, matched, scored, and automated throughout a service booking lifecycle.

---

## 📌 Problem Statement
In informal and developing economies, services like plumbing, electrical work, home salon beauty, and tutoring are booked via fragmented mechanisms:
- Clunky, uncurated WhatsApp groups.
- Endorsement-dependent phone call referrals.
- Manual availability checking and constant follow-ups.
- No trace records, no trust scoring, and no automation.

This results in a highly inefficient system, missed opportunities, and poor overall customer satisfaction.

## 💡 Solution
KaamKarao AI solves this by acting as an **agentic coordinator** rather than a simple listing directory. The user simply types or speaks their request:
```text
Mujhe kal subah G-13 mein AC technician chahiye
```
The AI backend choreographs an 8-stage agent workflow to extract terms, resolve location coordinates, discover candidate providers, calculate a customized trust score, explain the recommended match, book the provider, schedule automation checkups, and record logs for transparency.

---

## 🛠️ System Architecture

```text
               React Native Mobile App
                         |
                         | REST API (FastAPI)
                         v
                  FastAPI Backend
                         |
          [ Agentic Orchestration Layer ]
                         |
     ┌───────────────────┼───────────────────┐
     |                   |                   |
 Planner Agent      Intent Agent       Location Agent
     |                   |                   |
Discovery Agent    Ranking Agent      Decision Agent
     |                   |                   |
Booking Agent      Follow-Up Agent     Trace Logger
     └───────────────────┼───────────────────┘
                         |
                         v
                Mock JSON Database
```

### Modular Orchestrator Agents:
1. **Planner Agent:** Creates an 8-step workflow plan to satisfy user intent.
2. **Intent Agent:** Parses Urdu, Roman Urdu, and English keywords to extract the core service, time window, and language.
3. **Location Agent:** Resolves spatial coordinates for Islamabad sectors and coordinates clarifications if the location is missing.
4. **Provider Discovery Agent:** Filters the active database for coverage capabilities.
5. **Ranking Agent:** Formulates comparative **Trust Scores** utilizing ratings, slot match overlap, completion rates, and distance.
6. **Decision Agent:** Highlights the AI Recommended candidate and explains the contrasting rationale.
7. **Booking Agent:** Performs slot reservations and outputs a WhatsApp-style shareable message.
8. **Follow-Up Agent:** Coordinates simulated user reminders, completion checkups, and reviews.
9. **Trace Logger:** Logs all structured steps in the agent pipeline.

---

## ⚡ How Google Antigravity Was Used
Google Antigravity acted as the central engine for:
1. **Architecting & Scaffold Generation:** Scaffolded the entire modular folder structure and initial package configurations.
2. **Deterministic Agent Code Generation:** Formulated rule-based regex and math formulas for Urdu keyword extraction and multi-weighted Trust Scoring.
3. **End-to-End API Verification:** Created and executed a fully testable local request simulation.
4. **Branding Assets Synthesis:** Synthesized professional and visually stunning brand elements including a high-end application icon and a sleek splash screen.

---

## 💻 Tech Stack
- **Mobile Client:** React Native + Expo (Vibrant Slate/Emerald high-contrast dark mode).
- **Backend Framework:** FastAPI + Uvicorn + Pydantic (Python).
- **Storage:** Mock JSON file databases (`providers.json`, `requests.json`, `bookings.json`, `reminders.json`, `agent_logs.json`).

---

## 🚀 How to Run

### 1. Run the Backend
Ensure you have Python 3 installed. Navigate to the backend directory:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*Your FastAPI backend is now running at `http://localhost:8000`.*

### 2. Run the Mobile App
Ensure you have Node.js and Expo installed. Navigate to the mobile directory:
```bash
cd mobile
npm install
npm run web  # For browser testing, or npm run android / npm run ios
```

---

## 🧠 Trust Score Formula
The system uses a smart formula that dynamically adjusts weights when **high-urgency** hazards (e.g. spark, emergency, leak) are identified:

| Parameter | Weight (Normal) | Weight (High Urgency) |
|---|---|---|
| **Rating Score** | 30% | 15% |
| **Availability Overlap** | 25% | 35% |
| **Distance (km)** | 20% | 30% |
| **Completion Rate** | 15% | 10% |
| **Response Speed** | 10% | 10% |

---

## 🛡️ Edge Cases Handled
- **Missing Location:** e.g., *"Mujhe plumber chahiye"* triggers a Location Clarification Form.
- **Urgent Hazard:** e.g., *"Aaj electrician chahiye socket spark kar raha hai"* triggers a shift to Urgency Scoring, placing emphasis on nearest available emergency electricians.
- **Zero Slot Availabilities:** Automatically triggers an alternative candidate suggestion regardless of exact requested slot overlaps.

---

*This project was developed for a hackathon. The most important proof is the real-time agent reasoning trace visibility.*
