import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";

export default function ThreatRadar({ byType }) {
  const data = [
    { threat: "Injection", value: byType?.PROMPT_INJECTION || 0 },
    { threat: "Jailbreak", value: byType?.JAILBREAK_ATTEMPT || 0 },
    { threat: "Toxic", value: byType?.TOXIC_CONTENT || 0 },
    { threat: "PII", value: byType?.PII_DETECTED || 0 },
    { threat: "Hallucination", value: byType?.HALLUCINATION_RISK || 0 },
    { threat: "Schema", value: byType?.SCHEMA_VIOLATION || 0 },
  ];

  return (
    <div className="card">
      <div className="courier" style={{ marginBottom: "0.5rem" }}>THREAT RADAR</div>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(220,38,38,0.1)" />
          <PolarAngleAxis dataKey="threat" tick={{ fill: "rgba(226,232,240,0.5)", fontSize: 10 }} />
          <Radar dataKey="value" stroke="#dc2626" fill="#dc2626" fillOpacity={0.15} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
