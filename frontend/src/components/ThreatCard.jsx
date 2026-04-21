export default function ThreatCard({ threat }) {
  return (
    <div className="card">
      <div className="courier">{threat?.type || "THREAT"}</div>
      <div>{threat?.detail || "No details"}</div>
    </div>
  );
}
