const THREAT_TYPES = [
  { key: "PROMPT_INJECTION", label: "Prompt Injection", color: "#dc2626" },
  { key: "JAILBREAK_ATTEMPT", label: "Jailbreak", color: "#dc2626" },
  { key: "TOXIC_CONTENT", label: "Toxic Content", color: "#d97706" },
  { key: "PII_DETECTED", label: "PII Leakage", color: "#d97706" },
  { key: "AI_INJECTION_RISK", label: "AI Injection", color: "#dc2626" },
  { key: "HALLUCINATION_RISK", label: "Hallucination", color: "#ca8a04" },
  { key: "SCHEMA_VIOLATION", label: "Schema Error", color: "#0891b2" },
];

export default function ThreatHeatmap({ byType }) {
  const maxCount = Math.max(...Object.values(byType || {}), 1);
  return (
    <div className="card">
      <div className="courier" style={{ marginBottom: "0.7rem" }}>THREAT DISTRIBUTION</div>
      {THREAT_TYPES.map((type) => {
        const count = byType?.[type.key] || 0;
        const pct = (count / maxCount) * 100;
        return (
          <div key={type.key} style={{ marginBottom: "0.5rem" }}>
            <div className="courier" style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem" }}>
              <span>{type.label}</span>
              <span>{count}</span>
            </div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.06)" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: type.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
