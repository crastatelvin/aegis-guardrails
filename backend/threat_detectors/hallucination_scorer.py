import re


def score_hallucination_risk(response: str, prompt: str = "") -> dict:
    risk_score = 15
    flags = []

    uncertainty = [
        "i think",
        "i believe",
        "probably",
        "might be",
        "could be",
        "i'm not sure",
        "approximately",
        "around",
        "roughly",
        "as far as i know",
    ]
    for phrase in uncertainty:
        if phrase.lower() in response.lower():
            risk_score += 8
            flags.append(f"Uncertainty marker: '{phrase}'")

    fabrication_signals = [
        r"\b(in \d{4}|on (january|february|march|april|may|june|july|august|september|october|november|december))",
        r"\b\d+(\.\d+)?%\b",
        r"\$[\d,]+\b",
        r"\b\d+ (million|billion|trillion)\b",
    ]
    for pattern in fabrication_signals:
        matches = re.findall(pattern, response, re.IGNORECASE)
        if len(matches) > 2:
            risk_score += 10
            flags.append(f"High specificity claims: {len(matches)} numerical facts")

    source_signals = ["according to", "research shows", "studies indicate", "source:", "citation", "https://"]
    has_source = any(s.lower() in response.lower() for s in source_signals)
    if not has_source and len(response.split()) > 50:
        risk_score += 12
        flags.append("No source attribution for detailed claims")

    if len(response.split()) < 15 and len(prompt.split()) > 20:
        risk_score += 15
        flags.append("Unusually brief response to complex prompt")

    risk_score = min(100, risk_score)
    return {
        "risk_score": risk_score,
        "risk_level": "high" if risk_score > 60 else "medium" if risk_score > 35 else "low",
        "flags": flags,
        "severity": "medium" if risk_score > 50 else "low",
    }
