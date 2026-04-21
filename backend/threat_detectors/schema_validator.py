import json
import re


def validate_schema(response: str, expected_schema: dict = None) -> dict:
    issues = []

    if expected_schema is None:
        return {"valid": True, "issues": [], "severity": "none"}

    expected_type = expected_schema.get("type", "any")

    if expected_type == "json":
        json_match = re.search(r"\{.*\}", response, re.DOTALL)
        if not json_match:
            issues.append("Expected JSON output but none found")
        else:
            try:
                parsed = json.loads(json_match.group(0))
                required = expected_schema.get("required_fields", [])
                for field in required:
                    if field not in parsed:
                        issues.append(f"Missing required field: {field}")
            except json.JSONDecodeError as e:
                issues.append(f"Invalid JSON: {str(e)[:50]}")
    elif expected_type == "list":
        if not any(marker in response for marker in ["\n-", "\n*", "\n1.", "•"]):
            issues.append("Expected list format but response appears to be prose")
    elif expected_type == "short":
        word_count = len(response.split())
        max_words = expected_schema.get("max_words", 50)
        if word_count > max_words:
            issues.append(f"Response too long: {word_count} words (max {max_words})")

    return {"valid": len(issues) == 0, "issues": issues, "severity": "low" if issues else "none"}
