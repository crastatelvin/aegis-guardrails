export default function DefenseMetrics({ stats }) {
  const metrics = [
    { label: "TOTAL REQUESTS", value: stats?.total_requests || 0, color: "#e2e8f0" },
    { label: "THREATS DETECTED", value: stats?.threats_detected || 0, color: "#d97706" },
    { label: "BLOCKED", value: stats?.blocked || 0, color: "#dc2626" },
    { label: "BLOCK RATE", value: `${stats?.block_rate || 0}%`, color: "#dc2626" },
    { label: "THREAT RATE", value: `${stats?.threat_rate || 0}%`, color: "#d97706" },
    { label: "PASSED CLEAN", value: (stats?.total_requests || 0) - (stats?.threats_detected || 0), color: "#16a34a" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "0.6rem" }}>
      {metrics.map((m) => (
        <div key={m.label} className="card" style={{ textAlign: "center", borderColor: `${m.color}20` }}>
          <div style={{ fontSize: "1.2rem", fontWeight: "800", color: m.color }}>{m.value}</div>
          <div className="courier" style={{ fontSize: "0.55rem", color: "rgba(226,232,240,0.5)" }}>{m.label}</div>
        </div>
      ))}
    </div>
  );
}
