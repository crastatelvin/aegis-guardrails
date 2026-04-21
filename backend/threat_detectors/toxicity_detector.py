import re

TOXIC_CATEGORIES = {
    "hate_speech": [
        r"(?i)\b(hate|despise|exterminate)\s+(all\s+)?(people|group|race|religion)",
        r"(?i)(slur|derogatory term|racial epithet)",
    ],
    "violence": [
        r"(?i)(how to (kill|harm|hurt|attack|murder) (someone|a person|people))",
        r"(?i)(step.by.step.*(bomb|weapon|poison|hurt))",
        r"(?i)(instructions? (for|to) (making|creating|building) (a )?(weapon|explosive|poison))",
    ],
    "self_harm": [
        r"(?i)(how to (hurt|harm|kill) (myself|yourself|oneself))",
        r"(?i)(suicide (method|instruction|how to|plan))",
    ],
    "explicit": [
        r"(?i)(explicit sexual content|pornographic|nsfw content)",
    ],
}


def detect_toxicity(text: str) -> dict:
    found_categories = []
    confidence = 0

    for category, patterns in TOXIC_CATEGORIES.items():
        for pattern in patterns:
            if re.search(pattern, text):
                found_categories.append(category)
                confidence = max(confidence, 85)
                break

    return {
        "detected": len(found_categories) > 0,
        "categories": found_categories,
        "confidence": confidence,
        "severity": "high" if found_categories else "none",
    }
