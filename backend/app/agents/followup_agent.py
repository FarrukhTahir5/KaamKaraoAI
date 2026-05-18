from app.services.storage import save_reminders
from app.agents.trace_logger import log_trace

def schedule_followups(request_id: str, booking_id: str, provider_name: str, service_type: str, slot_text: str) -> dict:
    """
    Creates automated scheduler objects for reminders, completion checks, and reviews.
    """
    # Slot text could be e.g. "Tomorrow, 10:00 AM" or "Today, 5:00 PM"
    day = "Tomorrow"
    time_part = "10:00 AM"
    
    if "," in slot_text:
        parts = slot_text.split(",")
        day = parts[0].strip()
        time_part = parts[1].strip()
        
    # Build standard offsets for reminders
    reminders = [
        {
            "booking_id": booking_id,
            "request_id": request_id,
            "type": "user_reminder",
            "scheduled_for": f"{day}, 9:00 AM" if "10:00" in time_part else f"{day}, 1 hour before visit",
            "message": f"Reminder: {provider_name} will arrive at {time_part} for your {service_type} booking."
        },
        {
            "booking_id": booking_id,
            "request_id": request_id,
            "type": "completion_check",
            "scheduled_for": f"{day}, 12:00 PM" if "10:00" in time_part else f"{day}, 2 hours after visit",
            "message": f"Was your {service_type} service completed by {provider_name}?"
        },
        {
            "booking_id": booking_id,
            "request_id": request_id,
            "type": "rating_request",
            "scheduled_for": f"{day}, 12:15 PM" if "10:00" in time_part else f"{day}, 2 hours 15 mins after visit",
            "message": f"Please rate your experience with {provider_name}."
        }
    ]
    
    save_reminders(reminders)
    
    log_trace(
        request_id=request_id,
        agent="Follow-Up Agent",
        action="Scheduled reminders",
        input_data=f"booking_id={booking_id}",
        output_data="3 follow-up reminders created",
        status="success"
    )
    
    return {
        "reminders": reminders
    }
