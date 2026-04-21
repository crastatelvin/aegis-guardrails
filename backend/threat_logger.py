from collections import defaultdict, deque
from datetime import datetime

threat_log = deque(maxlen=500)
stats = defaultdict(int)


def log_threat(intercept_result: dict):
    entry = {
        "id": intercept_result.get("id", ""),
        "timestamp": intercept_result.get("timestamp", datetime.utcnow().isoformat()),
        "prompt_preview": intercept_result.get("prompt", "")[:80],
        "threat_count": intercept_result.get("threat_count", 0),
        "blocked": intercept_result.get("blocked", False),
        "risk_level": intercept_result.get("risk_level", "low"),
        "risk_score": intercept_result.get("risk_score", 0),
        "threats": intercept_result.get("threats", []),
        "ai_intent": intercept_result.get("ai_intent", "benign"),
    }
    threat_log.appendleft(entry)

    stats["total_requests"] += 1
    if intercept_result.get("blocked"):
        stats["blocked"] += 1
    if intercept_result.get("threat_count", 0) > 0:
        stats["threats_detected"] += 1
    for threat in intercept_result.get("threats", []):
        stats[f"type_{threat['type']}"] += 1


def get_recent_threats(limit: int = 50) -> list:
    return list(threat_log)[:limit]


def get_stats() -> dict:
    total = stats.get("total_requests", 1)
    return {
        "total_requests": stats["total_requests"],
        "blocked": stats["blocked"],
        "threats_detected": stats["threats_detected"],
        "block_rate": round(stats["blocked"] / max(total, 1) * 100, 1),
        "threat_rate": round(stats["threats_detected"] / max(total, 1) * 100, 1),
        "by_type": {k.replace("type_", ""): v for k, v in stats.items() if k.startswith("type_")},
    }
