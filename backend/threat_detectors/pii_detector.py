import re

PII_PATTERNS = {
    "email": (r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", "Email address"),
    "phone": (r"\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b", "Phone number"),
    "ssn": (r"\b\d{3}-\d{2}-\d{4}\b", "Social Security Number"),
    "credit_card": (r"\b(?:\d{4}[-\s]?){3}\d{4}\b", "Credit card number"),
    "ip_address": (r"\b(?:\d{1,3}\.){3}\d{1,3}\b", "IP address"),
    "api_key": (r"(?i)(api[_-]?key|secret[_-]?key|access[_-]?token)\s*[:=]\s*[\"']?[\w\-]{10,}", "API key/secret"),
    "password": (r"(?i)(password|passwd|pwd)\s*[:=]\s*[\"']?\S+", "Password"),
    "aadhaar": (r"\b\d{4}\s?\d{4}\s?\d{4}\b", "Aadhaar number"),
}


def detect_pii(text: str) -> dict:
    found = []

    for pii_type, (pattern, label) in PII_PATTERNS.items():
        matches = re.findall(pattern, text)
        if matches:
            found.append({"type": pii_type, "label": label, "count": len(matches), "redacted": f"[{label} REDACTED]"})

    return {
        "detected": len(found) > 0,
        "pii_found": found,
        "confidence": 95 if found else 0,
        "severity": "high" if found else "none",
        "redacted_text": _redact_pii(text) if found else text,
    }


def _redact_pii(text: str) -> str:
    for _, (pattern, label) in PII_PATTERNS.items():
        text = re.sub(pattern, f"[{label.upper()} REDACTED]", text)
    return text
