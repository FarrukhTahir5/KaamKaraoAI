import random

def generate_request_id(existing_count: int = 0) -> str:
    """Generates request IDs starting from REQ-1001."""
    return f"REQ-{1001 + existing_count}"

def generate_booking_id(existing_count: int = 0) -> str:
    """Generates booking IDs starting from KK-1024."""
    return f"KK-{1024 + existing_count}"

def generate_log_id(existing_count: int = 0) -> str:
    """Generates log IDs starting from LOG-1001."""
    return f"LOG-{1001 + existing_count}"
