from typing import Dict, Any

def calculate_trust_score(
    rating: float,
    distance_km: float,
    availability_match: str, # "exact", "window", "alternate", "none"
    completion_rate: float,
    response_time_min: int,
    urgency: str = "normal"
) -> Dict[str, Any]:
    """
    Calculates trust score using distance, availability, rating, completion rate, and response speed.
    Supports high urgency weight modifications.
    """
    # 1. Rating Score: rating / 5 * 100
    rating_score = (rating / 5.0) * 100.0

    # 2. Availability Score
    if availability_match == "exact":
        availability_score = 100.0
    elif availability_match == "window":
        availability_score = 90.0
    elif availability_match == "alternate":
        availability_score = 70.0
    else:
        availability_score = 40.0

    # 3. Distance Score
    if distance_km <= 1.0:
        distance_score = 100.0
    elif distance_km <= 2.5:
        distance_score = 90.0
    elif distance_km <= 4.0:
        distance_score = 80.0
    elif distance_km <= 6.0:
        distance_score = 60.0
    else:
        distance_score = 40.0

    # 4. Completion Score (directly completion_rate)
    completion_score = completion_rate

    # 5. Response Speed Score
    if response_time_min <= 5:
        response_speed_score = 100.0
    elif response_time_min <= 10:
        response_speed_score = 90.0
    elif response_time_min <= 20:
        response_speed_score = 75.0
    elif response_time_min <= 30:
        response_speed_score = 60.0
    else:
        response_speed_score = 40.0

    # Formulate Weights
    if urgency == "high":
        # Availability: 35%, Distance: 30%, Rating: 15%, Completion: 10%, Response speed: 10%
        w_avail = 0.35
        w_dist = 0.30
        w_rating = 0.15
        w_compl = 0.10
        w_resp = 0.10
    else:
        # Availability: 25%, Distance: 20%, Rating: 30%, Completion: 15%, Response speed: 10%
        w_rating = 0.30
        w_avail = 0.25
        w_dist = 0.20
        w_compl = 0.15
        w_resp = 0.10

    trust_score = (
        (w_rating * rating_score) +
        (w_avail * availability_score) +
        (w_dist * distance_score) +
        (w_compl * completion_score) +
        (w_resp * response_speed_score)
    )

    # Round to single decimal point or nearest whole number
    trust_score = round(trust_score, 1)

    return {
        "trust_score": trust_score,
        "score_breakdown": {
            "rating_score": round(rating_score, 1),
            "availability_score": round(availability_score, 1),
            "distance_score": round(distance_score, 1),
            "completion_score": round(completion_score, 1),
            "response_speed_score": round(response_speed_score, 1)
        }
    }
