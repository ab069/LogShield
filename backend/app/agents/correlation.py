from datetime import datetime, timezone
from typing import Any

RULES = [
    {"name": "Multiple Failed Logins", "pattern": "failed login", "min_count": 5, "window_minutes": 5, "severity": "high"},
    {"name": "Brute Force Attempt", "pattern": "brute force", "min_count": 3, "window_minutes": 10, "severity": "critical"},
    {"name": "SQL Injection Detected", "pattern": "sql injection", "min_count": 1, "window_minutes": 1, "severity": "critical"},
    {"name": "Port Scan Activity", "pattern": "port scan", "min_count": 2, "window_minutes": 5, "severity": "medium"},
    {"name": "Suspicious Privilege Escalation", "pattern": "privilege escalation", "min_count": 1, "window_minutes": 1, "severity": "high"},
    {"name": "Malware Signature", "pattern": "malware", "min_count": 1, "window_minutes": 1, "severity": "critical"},
    {"name": "Unauthorized Access", "pattern": "unauthorized", "min_count": 2, "window_minutes": 5, "severity": "high"},
    {"name": "Data Exfiltration", "pattern": "exfiltration", "min_count": 1, "window_minutes": 1, "severity": "critical"},
]

def evaluate_logs(recent_logs: list[dict]) -> list[dict]:
    alerts = []
    for rule in RULES:
        matching = [l for l in recent_logs if rule["pattern"].lower() in (l.get("message", "") or "").lower()]
        if len(matching) >= rule["min_count"]:
            alerts.append({
                "rule_name": rule["name"],
                "severity": rule["severity"],
                "title": f"{rule['name']} Detected",
                "description": f"{len(matching)} events matched '{rule['name']}' in the last {rule['window_minutes']} minutes.",
                "correlation_data": {"matched_count": len(matching), "pattern": rule["pattern"], "rule": rule["name"]},
                "source": matching[0].get("source", "unknown") if matching else "unknown",
            })
    return alerts
