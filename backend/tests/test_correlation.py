from app.agents.correlation import evaluate_logs, RULES

def test_rule_count():
    assert len(RULES) == 8

def test_no_match():
    logs = [{"message": "normal operation", "source": "app"}]
    assert evaluate_logs(logs) == []

def test_brute_force_match():
    logs = [{"message": "failed login attempt from 10.0.0.1", "source": "auth"} for _ in range(5)]
    alerts = evaluate_logs(logs)
    assert any(a["rule_name"] == "Multiple Failed Logins" for a in alerts)

def test_sql_injection():
    logs = [{"message": "SQL injection detected in query params", "source": "waf"}]
    alerts = evaluate_logs(logs)
    assert any(a["severity"] == "critical" for a in alerts)

def test_data_exfiltration():
    logs = [{"message": "possible exfiltration event", "source": "ids"}]
    alerts = evaluate_logs(logs)
    assert any(a["rule_name"] == "Data Exfiltration" for a in alerts)
