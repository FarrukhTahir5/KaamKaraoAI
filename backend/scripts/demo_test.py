import json
from fastapi.testclient import TestClient
from app.main import app
from app.services.storage import reset_all_data

client = TestClient(app)

def run_tests():
    print("==================================================")
    print("STARTING KAAMKARAO AI AGENTIC BACKEND TEST SUITE")
    print("==================================================")

    # 1. Reset database
    print("\n[TEST 1] Resetting demo data...")
    res = client.post("/api/demo/reset")
    print("Response:", res.json())
    assert res.status_code == 200

    # 2. Main Demo Scenario: AC Technician kal subah in G-13
    print("\n[TEST 2] Submitting Main Demo request...")
    payload = {"message": "Mujhe kal subah G-13 mein AC technician chahiye"}
    res = client.post("/api/request", json=payload)
    print("Response status:", res.status_code)
    req_data = res.json()
    print("Request ID:", req_data["request_id"])
    print("Extracted Details:", json.dumps(req_data["extracted"], indent=2))
    assert req_data["requires_clarification"] is False
    assert req_data["extracted"]["service_type"] == "AC Technician"
    assert req_data["extracted"]["location"] == "G-13"
    assert req_data["extracted"]["preferred_day"] == "tomorrow"

    req_id = req_data["request_id"]

    # Match providers
    print("\nMatching Providers...")
    res = client.post("/api/match", json={"request_id": req_id})
    match_data = res.json()
    print("Providers found count:", len(match_data["providers"]))
    print("Recommended Provider:", match_data["recommended_provider"]["name"])
    print("Recommendation Reason:", match_data["recommended_provider"]["reason"])
    assert len(match_data["providers"]) > 0
    assert match_data["recommended_provider"]["name"] == "Ali AC Services"

    # Confirm Booking
    print("\nSimulating Booking Confirmation...")
    book_payload = {
        "request_id": req_id,
        "provider_id": match_data["recommended_provider"]["id"]
    }
    res = client.post("/api/book", json=book_payload)
    book_data = res.json()
    print("Booking ID:", book_data["booking"]["booking_id"])
    print("Confirmation Msg:\n", book_data["confirmation_message"])
    print("Follow up schedule count:", len(book_data["follow_up"]["reminders"]))
    assert book_data["booking"]["status"] == "confirmed"

    # Retrieve Trace logs
    print("\nRetrieving Agent Trace Log...")
    res = client.get(f"/api/trace/{req_id}")
    trace_data = res.json()
    print(f"Total agent trace sequence logs: {len(trace_data['trace'])}")
    for trace in trace_data["trace"]:
        print(f" -> [{trace['agent']}] {trace['action']}: {trace['output']}")
    assert len(trace_data["trace"]) >= 6

    # 3. Urgency Test: Electrician socket spark aaj in G-13
    print("\n[TEST 3] Submitting Emergency Spark request...")
    payload = {"message": "Aaj electrician chahiye socket spark kar raha hai G-13 mein"}
    res = client.post("/api/request", json=payload)
    req_data = res.json()
    print("Extracted Urgency:", req_data["extracted"]["urgency"])
    print("Extracted Issue:", req_data["extracted"]["issue"])
    assert req_data["extracted"]["urgency"] == "high"
    assert "spark" in req_data["extracted"]["issue"].lower()

    # Match providers for emergency (should rank Sajid Electrician or emergency available high score first)
    req_id_urg = req_data["request_id"]
    res = client.post("/api/match", json={"request_id": req_id_urg})
    match_data = res.json()
    print("Recommended Emergency Provider:", match_data["recommended_provider"]["name"])
    print("Recommendation Reason:", match_data["recommended_provider"]["reason"])

    # 4. Edge Case: Missing Location
    print("\n[TEST 4] Submitting request with missing location...")
    payload = {"message": "Mujhe plumber chahiye"}
    res = client.post("/api/request", json=payload)
    req_data = res.json()
    print("Requires Clarification?", req_data["requires_clarification"])
    print("Missing Fields:", req_data["missing_fields"])
    print("Clarification Message:", req_data["message"])
    assert req_data["requires_clarification"] is True
    assert "location" in req_data["missing_fields"]

    print("\n==================================================")
    print("ALL AGENTIC BACKEND TESTS COMPLETED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
