import re

INJECTION_PATTERNS = [
    r"(?i)(ignore (all |previous |above |prior )(instructions?|prompts?|rules?|context))",
    r"(?i)(disregard (your|all|the) (instructions?|training|rules?|guidelines?))",
    r"(?i)(you (are|must|should|will) now (act as|pretend|roleplay|simulate|be))",
    r"(?i)(jailbreak|dan mode|developer mode|unrestricted mode|god mode)",
    r"(?i)(do anything now|no restrictions|without limitations|no ethical)",
    r"(?i)(system prompt|system message|hidden instruction)",
    r"(?i)(\[INST\]|\[SYS\]|<\|system\|>|<system>)",
    r"(?i)(forget (you are|your|all|previous))",
    r"(?i)(new persona|alternative personality|evil twin|shadow self)",
    r"(?i)(bypass (safety|filter|restriction|guardrail|policy))",
]

JAILBREAK_PATTERNS = [
    r"(?i)(pretend (you have no|there are no|without) (restrictions?|limits?|rules?))",
    r"(?i)(for (educational|research|fictional|hypothetical) purposes?,? (tell|show|explain|describe) (me |how to |how |the )?(make|create|build|hack|attack|harm))",
    r"(?i)(as a fictional character.*?(tell|explain|describe|show))",
    r"(?i)(in a story where.*?(bomb|weapon|hack|kill|harm))",
    r"(?i)(my (grandmother|aunt|friend) used to (tell|read|explain).*?(weapon|exploit|harm))",
    r"(?i)(write (a story|fiction|roleplay) where (someone|a character|the protagonist) (explains?|teaches?|shows?))",
]


def detect_injection(text: str) -> dict:
    threats = []
    confidence = 0

    for pattern in INJECTION_PATTERNS:
        match = re.search(pattern, text)
        if match:
            threats.append({"type": "PROMPT_INJECTION", "matched": match.group(0), "confidence": 92})
            confidence = max(confidence, 92)

    for pattern in JAILBREAK_PATTERNS:
        match = re.search(pattern, text)
        if match:
            threats.append({"type": "JAILBREAK_ATTEMPT", "matched": match.group(0), "confidence": 88})
            confidence = max(confidence, 88)

    return {
        "detected": len(threats) > 0,
        "threats": threats,
        "confidence": confidence,
        "severity": "critical" if confidence >= 85 else "high" if confidence >= 60 else "low",
    }
