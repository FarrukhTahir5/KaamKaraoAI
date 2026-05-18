from datetime import datetime
from app.services.storage import get_bookings, save_booking, get_providers
from app.utils.ids import generate_booking_id
from app.agents.trace_logger import log_trace

def book_provider(request_id: str, provider_id: str, extracted_details: dict) -> dict:
    """
    Simulates booking confirmation, writes state into bookings.json, and compiles SMS text.
    """
    existing_bookings = get_bookings()
    booking_id = generate_booking_id(len(existing_bookings))
    
    # Retrieve provider info
    all_providers = get_providers()
    provider_name = "Selected Provider"
    estimated_charges = "Rs. 1500 - Rs. 2000"
    
    for p in all_providers:
        if p["id"] == provider_id:
            provider_name = p["name"]
            estimated_charges = p["estimated_charges"]
            break
            
    location = extracted_details.get("resolved_location", "G-13 Islamabad")
    slot = extracted_details.get("suggested_slot", "10:00 AM")
    preferred_day = extracted_details.get("preferred_day", "tomorrow").capitalize()
    
    slot_text = f"{preferred_day}, {slot}"
    
    booking_obj = {
        "booking_id": booking_id,
        "request_id": request_id,
        "provider_id": provider_id,
        "provider_name": provider_name,
        "service_type": extracted_details.get("service_type", "AC Technician"),
        "location": location,
        "slot": slot_text,
        "status": "confirmed",
        "estimated_charges": estimated_charges,
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    
    save_booking(booking_obj)
    
    confirmation_message = (
        f"Booking Confirmed \u2705\n\n"
        f"Service: {booking_obj['service_type']}\n"
        f"Provider: {provider_name}\n"
        f"Time: {slot_text}\n"
        f"Location: {location}\n"
        f"Charges: {estimated_charges}\n"
        f"Booking ID: {booking_id}\n\n"
        f"Reminder will be sent 1 hour before visit."
    )
    
    log_trace(
        request_id=request_id,
        agent="Booking Agent",
        action="Created booking",
        input_data=f"provider_id={provider_id}, slot={slot_text}",
        output_data=f"booking_id={booking_id}",
        status="success"
    )
    
    return {
        "booking": booking_obj,
        "confirmation_message": confirmation_message
    }
