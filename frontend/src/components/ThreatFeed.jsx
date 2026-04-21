const SEV_COLORS = { critical: "#dc2626", high: "#d97706", medium: "#ca8a04", low: "#0891b2", none: "#16a34a" };

export default function ThreatFeed({ threats }) {
  return (
    <div className="card" style={{ height: "340px", overflowY: "auto" }}>
      <div className="courier" style={{ color: "#dc2626", marginBottom: "0.6rem" }}>
        LIVE INTERCEPT FEED
      </div>
      {threats.length === 0 ? (
        <div className="courier" style={{ color: "#16a34a" }}>&gt; AEGIS ONLINE. AWAITING INTERCEPTS...</div>
      ) : (
        threats.map((t, i) => (
          <div key={t.id || i} style={{ padding: "0.4rem 0.6rem", borderLeft: `2px solid ${t.blocked ? "#dc2626" : "#16a34a"}`, marginBottom: "0.35rem" }}>
            <div className="courier" style={{ display: "flex", gap: "0.5rem", fontSize: "0.7rem" }}>
              <span style={{ color: t.blocked ? "#dc2626" : "#16a34a" }}>{t.blocked ? "[BLOCKED]" : "[PASSED]"}</span>
              <span style={{ color: SEV_COLORS[t.risk_level] }}>{t.risk_level?.toUpperCase()}</span>
            </div>
            <div className="courier" style={{ color: "rgba(226,232,240,0.6)", fontSize: "0.65rem" }}>{t.prompt_preview}</div>
          </div>
        ))
      )}
    </div>
  );
}
