import colors from "../theme/colors";

// Set your computer's local IP address or localhost
const BASE_URL = "http://localhost:8000";

const FALLBACK_EXTRACTED = {
  service_type: "AC Technician",
  location: "G-13",
  resolved_location: "G-13 Islamabad",
  time_text: "kal subah",
  preferred_day: "tomorrow",
  preferred_slot: "morning",
  suggested_slot: "10:00 AM",
  urgency: "normal",
  language: "Roman Urdu",
  issue: "AC service or repair"
};

const FALLBACK_PROVIDERS = [
  {
    id: "p001",
    name: "Ali AC Services",
    service_type: "AC Technician",
    distance_km: 2.1,
    rating: 4.8,
    available_slot: "10:00 AM",
    completion_rate: 94.0,
    response_time_min: 8,
    estimated_charges: "Rs. 1500 - Rs. 2000",
    trust_score: 92.0,
    is_recommended: true
  },
  {
    id: "p002",
    name: "Umar Cooling & AC Repair",
    service_type: "AC Technician",
    distance_km: 3.4,
    rating: 4.6,
    available_slot: "9:30 AM",
    completion_rate: 90.0,
    response_time_min: 12,
    estimated_charges: "Rs. 1200 - Rs. 1800",
    trust_score: 87.0,
    is_recommended: false
  },
  {
    id: "p003",
    name: "Fast Cool Repair",
    service_type: "AC Technician",
    distance_km: 2.8,
    rating: 4.2,
    available_slot: "11:00 AM",
    completion_rate: 82.0,
    response_time_min: 18,
    estimated_charges: "Rs. 1000 - Rs. 1600",
    trust_score: 75.5,
    is_recommended: false
  }
];

export async function submitRequest(message) {
  try {
    const response = await fetch(`${BASE_URL}/api/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    if (response.ok) return await response.json();
  } catch (error) {
    console.warn("Backend unavailable. Using local fallback flow.", error);
  }

  // Robust fallback simulation
  const isEmergency = message.toLowerCase().includes("spark") || message.toLowerCase().includes("emergency") || message.toLowerCase().includes("urgent");
  const isTutor = message.toLowerCase().includes("tutor") || message.toLowerCase().includes("math");
  const isMissingLocation = !message.toLowerCase().includes("g-13") && !message.toLowerCase().includes("f-10") && !message.toLowerCase().includes("bahria");

  if (isMissingLocation) {
    return {
      request_id: "REQ-FALLBACK",
      original_message: message,
      workflow_plan: ["extract_intent", "resolve_location"],
      extracted: null,
      requires_clarification: true,
      missing_fields: ["location"],
      message: "Please tell your area, for example: G-13, F-10, Bahria Town.",
      next_step: "clarify_location"
    };
  }

  return {
    request_id: "REQ-FALLBACK",
    original_message: message,
    workflow_plan: [
      "extract_intent",
      "resolve_location",
      "discover_providers",
      "rank_providers",
      "select_provider",
      "simulate_booking",
      "schedule_followup",
      "log_trace"
    ],
    extracted: {
      ...FALLBACK_EXTRACTED,
      service_type: isTutor ? "Tutor" : (isEmergency ? "Electrician" : "AC Technician"),
      issue: isTutor ? "Grade 9 Maths tuition" : (isEmergency ? "Socket spark hazard" : "AC service or repair"),
      urgency: isEmergency ? "high" : "normal",
      location: message.toLowerCase().includes("g-13") ? "G-13" : "F-10",
      resolved_location: message.toLowerCase().includes("g-13") ? "G-13 Islamabad" : "F-10 Islamabad"
    },
    requires_clarification: false,
    missing_fields: [],
    next_step: "provider_matching"
  };
}

export async function matchProviders(requestId) {
  try {
    const response = await fetch(`${BASE_URL}/api/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: requestId })
    });
    if (response.ok) return await response.json();
  } catch (error) {
    console.warn("Backend unavailable. Using local matching fallback.");
  }

  // Fallback Matching
  return {
    request_id: requestId,
    providers: FALLBACK_PROVIDERS,
    recommended_provider: {
      id: "p001",
      name: "Ali AC Services",
      trust_score: 92,
      reason: "Ali AC Services is nearby, available in the requested morning slot, has a high rating, and has a strong completion record.",
      why_not_others: [
        {
          provider: "Umar Cooling",
          reason: "Good option, but slightly farther and lower trust score."
        },
        {
          provider: "Fast Cool Repair",
          reason: "Available, but lower rating and completion rate."
        }
      ]
    }
  };
}

export async function bookProvider(requestId, providerId) {
  try {
    const response = await fetch(`${BASE_URL}/api/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: requestId, provider_id: providerId })
    });
    if (response.ok) return await response.json();
  } catch (error) {
    console.warn("Backend unavailable. Using local booking fallback.");
  }

  // Fallback Booking
  return {
    booking: {
      booking_id: "KK-1024",
      request_id: requestId,
      provider_id: providerId,
      provider_name: providerId === "p001" ? "Ali AC Services" : "Selected Provider",
      service_type: "AC Technician",
      location: "G-13 Islamabad",
      slot: "Tomorrow, 10:00 AM",
      status: "confirmed",
      estimated_charges: "Rs. 1500 - Rs. 2000",
      created_at: new Date().toISOString()
    },
    confirmation_message: "Booking Confirmed \u2705\n\nService: AC Technician\nProvider: Ali AC Services\nTime: Tomorrow, 10:00 AM\nLocation: G-13 Islamabad\nCharges: Rs. 1500 - Rs. 2000\nBooking ID: KK-1024\n\nReminder will be sent 1 hour before visit.",
    follow_up: {
      reminders: [
        {
          type: "user_reminder",
          scheduled_for: "Tomorrow, 9:00 AM",
          message: "Reminder: Ali AC Services will arrive at 10:00 AM."
        },
        {
          type: "completion_check",
          scheduled_for: "Tomorrow, 12:00 PM",
          message: "Was your AC service completed?"
        },
        {
          type: "rating_request",
          scheduled_for: "Tomorrow, 12:15 PM",
          message: "Please rate your experience with Ali AC Services."
        }
      ]
    }
  };
}

export async function getTrace(requestId) {
  try {
    const response = await fetch(`${BASE_URL}/api/trace/${requestId}`);
    if (response.ok) return await response.json();
  } catch (error) {
    console.warn("Backend unavailable. Using local trace fallback.");
  }

  // Fallback Trace
  return {
    request_id: requestId,
    trace: [
      {
        id: "LOG-1001",
        request_id: requestId,
        timestamp: new Date().toISOString(),
        agent: "Planner Agent",
        action: "Created workflow plan",
        input: "Mujhe kal subah G-13 mein AC technician chahiye",
        output: "8-step workflow plan created",
        status: "success"
      },
      {
        id: "LOG-1002",
        request_id: requestId,
        timestamp: new Date().toISOString(),
        agent: "Intent Agent",
        action: "Extracted request details",
        input: "Mujhe kal subah G-13 mein AC technician chahiye",
        output: "service=AC Technician, location=G-13, time=tomorrow morning",
        status: "success"
      },
      {
        id: "LOG-1003",
        request_id: requestId,
        timestamp: new Date().toISOString(),
        agent: "Location Agent",
        action: "Resolved location",
        input: "G-13",
        output: "location=G-13 Islamabad, lat=33.65, lng=72.96",
        status: "success"
      },
      {
        id: "LOG-1004",
        request_id: requestId,
        timestamp: new Date().toISOString(),
        agent: "Provider Discovery Agent",
        action: "Found matching providers",
        input: "AC Technician near G-13",
        output: "3 matching providers found",
        status: "success"
      },
      {
        id: "LOG-1005",
        request_id: requestId,
        timestamp: new Date().toISOString(),
        agent: "Ranking Agent",
        action: "Calculated trust scores",
        input: "3 providers",
        output: "Ali AC Services ranked highest with score 92",
        status: "success"
      },
      {
        id: "LOG-1006",
        request_id: requestId,
        timestamp: new Date().toISOString(),
        agent: "Decision Agent",
        action: "Selected provider",
        input: "3 candidates",
        output: "Selected Ali AC Services with score 92",
        status: "success"
      },
      {
        id: "LOG-1007",
        request_id: requestId,
        timestamp: new Date().toISOString(),
        agent: "Booking Agent",
        action: "Created booking",
        input: "provider=p001, slot=Tomorrow, 10:00 AM",
        output: "booking_id=KK-1024",
        status: "success"
      },
      {
        id: "LOG-1008",
        request_id: requestId,
        timestamp: new Date().toISOString(),
        agent: "Follow-Up Agent",
        action: "Scheduled reminders",
        input: "booking_id=KK-1024",
        output: "3 follow-up reminders created",
        status: "success"
      }
    ]
  };
}

export async function resetDemo() {
  try {
    const response = await fetch(`${BASE_URL}/api/demo/reset`, { method: "POST" });
    if (response.ok) return await response.json();
  } catch (error) {
    console.warn("Backend unavailable to reset.");
  }
  return { status: "success", message: "Mock local state reset." };
}
