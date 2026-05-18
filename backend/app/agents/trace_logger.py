from datetime import datetime
from app.services.storage import get_agent_logs, save_agent_log
from app.utils.ids import generate_log_id

def log_trace(request_id: str, agent: str, action: str, input_data: str, output_data: str, status: str = "success") -> dict:
    """
    Saves an execution step to the agent trace logs.
    """
    existing_logs = get_agent_logs()
    # Filter logs for the request_id to find sequence index
    seq_index = sum(1 for log in existing_logs if log.get("request_id") == request_id)
    
    log_id = generate_log_id(len(existing_logs))
    
    log_item = {
        "id": log_id,
        "request_id": request_id,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "agent": agent,
        "action": action,
        "input": str(input_data),
        "output": str(output_data),
        "status": status
    }
    
    save_agent_log(log_item)
    return log_item

def get_traces_by_request(request_id: str) -> list:
    """
    Returns trace logs for a specific request.
    """
    logs = get_agent_logs()
    # Filter and sort by sequence/timestamp
    filtered_logs = [log for log in logs if log.get("request_id") == request_id]
    return filtered_logs
