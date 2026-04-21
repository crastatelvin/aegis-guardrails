import { useState } from "react";
import { interceptPrompt, runDemoAttack } from "../services/api";

const DEMO_ATTACKS = [
  { type: "injection", label: "INJECTION", color: "#ef4444" },
  { type: "jailbreak", label: "JAILBREAK", color: "#f97316" },
  { type: "pii", label: "PII LEAK", color: "#eab308" },
  { type: "toxic", label: "TOXIC", color: "#ec4899" },
  { type: "benign", label: "BENIGN", color: "#22c55e" },
];

export default function InterceptorDemo({ onNewThreat }) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    try {
      const res = await interceptPrompt(prompt.trim());
      setResult(res);
      onNewThreat?.(res);
    } catch (e) {
      setResult({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (type) => {
    setLoading(true);
    try {
      const res = await runDemoAttack(type);
      setResult(res);
      onNewThreat?.(res);
    } catch (e) {
      setResult({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="courier" style={{ color: "#f87171", marginBottom: "0.9rem", letterSpacing: "1px" }}>LIVE INTERCEPTOR</div>
      <div style={{ display: "flex", gap: "0.55rem", marginBottom: "0.9rem", flexWrap: "wrap" }}>
        {DEMO_ATTACKS.map((a) => (
          <button
            className="demo-option-btn"
            key={a.type}
            onClick={() => handleDemo(a.type)}
            disabled={loading}
            style={{
              border: `1px solid ${a.color}66`,
              color: "#e5e7eb",
              background: `linear-gradient(180deg, ${a.color}22 0%, rgba(15,23,42,0.58) 100%)`,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.55 : 1,
            }}
          >
            {a.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center" }}>
        <input
          className="demo-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Try a custom prompt..."
          style={{
            flex: 1,
            height: "2.1rem",
            borderRadius: "10px",
            border: "1px solid rgba(148,163,184,0.35)",
            background: "rgba(15,23,42,0.55)",
            color: "#e2e8f0",
            padding: "0 0.78rem",
            outline: "none",
            fontSize: "0.9rem",
          }}
        />
        <button
          className="demo-test-btn"
          onClick={handleTest}
          disabled={loading || !prompt.trim()}
          style={{
            height: "2.1rem",
            minWidth: "4.6rem",
            borderRadius: "10px",
            border: "1px solid rgba(248,113,113,0.5)",
            background: loading || !prompt.trim() ? "rgba(148,163,184,0.24)" : "linear-gradient(180deg, rgba(248,113,113,0.35) 0%, rgba(220,38,38,0.35) 100%)",
            color: "#f8fafc",
            fontWeight: "700",
            letterSpacing: "0.7px",
            cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "..." : "TEST"}
        </button>
      </div>
      {result && !result.error && (
        <div style={{ marginTop: "0.8rem" }}>
          <div>{result.blocked ? "BLOCKED" : "PASSED"} - Risk {result.risk_score}/100</div>
          <div className="courier" style={{ fontSize: "0.75rem" }}>{result.threat_count} threats</div>
        </div>
      )}
    </div>
  );
}
