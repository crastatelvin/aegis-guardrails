import os
from datetime import datetime

from gemini_service import ai_threat_analysis, safe_completion
from threat_detectors.hallucination_scorer import score_hallucination_risk
from threat_detectors.injection_detector import detect_injection
from threat_detectors.pii_detector import detect_pii
from threat_detectors.schema_validator import validate_schema
from threat_detectors.toxicity_detector import detect_toxicity

BLOCK_ON_CRITICAL = os.getenv("BLOCK_ON_CRITICAL", "true").lower() == "true"
BLOCK_ON_HIGH = os.getenv("BLOCK_ON_HIGH", "false").lower() == "true"


async def intercept_prompt(prompt: str, config: dict = {}) -> dict:
    threats = []
    blocked = False
    block_reason = ""

    injection_result = detect_injection(prompt)
    toxicity_result = detect_toxicity(prompt)
    pii_result = detect_pii(prompt)

    if injection_result["detected"]:
        for t in injection_result["threats"]:
            threats.append(
                {
                    "type": t["type"],
                    "severity": injection_result["severity"],
                    "confidence": t["confidence"],
                    "detail": t["matched"][:100],
                    "layer": "pattern",
                }
            )

    if toxicity_result["detected"]:
        threats.append(
            {
                "type": "TOXIC_CONTENT",
                "severity": "high",
                "confidence": toxicity_result["confidence"],
                "detail": f"Categories: {', '.join(toxicity_result['categories'])}",
                "layer": "pattern",
            }
        )

    if pii_result["detected"]:
        threats.append(
            {
                "type": "PII_DETECTED",
                "severity": "high",
                "confidence": pii_result["confidence"],
                "detail": f"Found: {', '.join(p['label'] for p in pii_result['pii_found'])}",
                "layer": "pattern",
            }
        )

    ai_analysis = {}
    if not any(t["severity"] == "critical" for t in threats):
        ai_analysis = ai_threat_analysis(prompt)
        if ai_analysis.get("injection_risk", 0) > 70:
            threats.append(
                {
                    "type": "AI_INJECTION_RISK",
                    "severity": "critical",
                    "confidence": ai_analysis["injection_risk"],
                    "detail": ai_analysis.get("reasoning", "")[:100],
                    "layer": "ai",
                }
            )
        if ai_analysis.get("jailbreak_risk", 0) > 70:
            threats.append(
                {
                    "type": "AI_JAILBREAK_RISK",
                    "severity": "critical",
                    "confidence": ai_analysis["jailbreak_risk"],
                    "detail": ai_analysis.get("reasoning", "")[:100],
                    "layer": "ai",
                }
            )

    has_critical = any(t["severity"] == "critical" for t in threats)
    has_high = any(t["severity"] == "high" for t in threats)

    if has_critical and BLOCK_ON_CRITICAL:
        blocked = True
        block_reason = f"Critical threat detected: {threats[0]['type']}"
    elif has_high and BLOCK_ON_HIGH:
        blocked = True
        block_reason = f"High severity threat: {threats[0]['type']}"

    response = None
    if not blocked:
        response = safe_completion(pii_result.get("redacted_text", prompt), config.get("system_context", ""))

    risk_score = max((t["confidence"] for t in threats), default=0)
    return {
        "id": f"req_{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}",
        "timestamp": datetime.utcnow().isoformat(),
        "prompt": prompt[:200],
        "prompt_length": len(prompt),
        "threats": threats,
        "threat_count": len(threats),
        "blocked": blocked,
        "block_reason": block_reason,
        "risk_score": risk_score,
        "risk_level": "critical" if risk_score > 85 else "high" if risk_score > 65 else "medium" if risk_score > 35 else "low",
        "ai_intent": ai_analysis.get("intent", "benign"),
        "pii_redacted": pii_result["detected"],
        "response": response,
        "layers_checked": ["pattern_matching", "ai_analysis"],
    }


async def intercept_response(response_text: str, original_prompt: str = "", schema: dict = None) -> dict:
    threats = []
    pii_result = detect_pii(response_text)
    if pii_result["detected"]:
        threats.append(
            {
                "type": "RESPONSE_PII_LEAK",
                "severity": "high",
                "confidence": 90,
                "detail": f"Response contains: {', '.join(p['label'] for p in pii_result['pii_found'])}",
                "layer": "response",
            }
        )

    hall_result = score_hallucination_risk(response_text, original_prompt)
    if hall_result["risk_score"] > 50:
        threats.append(
            {
                "type": "HALLUCINATION_RISK",
                "severity": hall_result["severity"],
                "confidence": hall_result["risk_score"],
                "detail": "; ".join(hall_result["flags"][:2]),
                "layer": "response",
            }
        )

    if schema:
        schema_result = validate_schema(response_text, schema)
        if not schema_result["valid"]:
            threats.append(
                {
                    "type": "SCHEMA_VIOLATION",
                    "severity": "low",
                    "confidence": 80,
                    "detail": "; ".join(schema_result["issues"]),
                    "layer": "response",
                }
            )

    return {
        "threats": threats,
        "blocked": False,
        "pii_redacted": pii_result["detected"],
        "clean_response": pii_result.get("redacted_text", response_text),
        "hallucination_risk": hall_result["risk_score"],
    }
