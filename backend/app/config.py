import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# File Paths for storage
PROVIDERS_FILE = DATA_DIR / "providers.json"
REQUESTS_FILE = DATA_DIR / "requests.json"
BOOKINGS_FILE = DATA_DIR / "bookings.json"
REMINDERS_FILE = DATA_DIR / "reminders.json"
AGENT_LOGS_FILE = DATA_DIR / "agent_logs.json"
