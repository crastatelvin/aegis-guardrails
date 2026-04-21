import { useCallback, useEffect, useRef, useState } from "react";

import DefenseMetrics from "../components/DefenseMetrics";
import InterceptorDemo from "../components/InterceptorDemo";
import ShieldStatus from "../components/ShieldStatus";
import ThreatFeed from "../components/ThreatFeed";
import ThreatHeatmap from "../components/ThreatHeatmap";
import ThreatRadar from "../components/ThreatRadar";
import useWebSocket from "../hooks/useWebSocket";
import { getStats, getThreats } from "../services/api";

export default function DashboardPage() {
  const [threats, setThreats] = useState([]);
  const [stats, setStats] = useState({});
  const [threatLevel, setThreatLevel] = useState("low");
  const [wsConnected, setWsConnected] = useState(false);
  const [apiHealthy, setApiHealthy] = useState(false);
  const threatResetTimerRef = useRef(null);

  const loadData = useCallback(async () => {
    try {
      const [t, s] = await Promise.all([getThreats(30), getStats()]);
      setThreats(t);
      setStats(s);
      setApiHealthy(true);
    } catch (e) {
      setApiHealthy(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, [loadData]);

  useWebSocket(
    (data) => {
      loadData();
      setThreatLevel(data?.risk_level || "low");
      if (threatResetTimerRef.current) clearTimeout(threatResetTimerRef.current);
      threatResetTimerRef.current = setTimeout(() => setThreatLevel("low"), 5000);
    },
    setWsConnected
  );

  useEffect(
    () => () => {
      if (threatResetTimerRef.current) clearTimeout(threatResetTimerRef.current);
    },
    []
  );

  const connected = wsConnected || apiHealthy;

  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "1.2rem", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
        <div>
          <div className="courier" style={{ fontSize: "0.55rem", color: "rgba(220,38,38,0.6)" }}>AI GUARDRAILS ENGINE</div>
          <h1><span style={{ color: "var(--text)" }}>AE</span><span style={{ color: "#dc2626" }}>GIS</span></h1>
        </div>
        <span className="courier" style={{ color: connected ? "#16a34a" : "#dc2626" }}>
          {connected ? "SHIELDS ONLINE" : "OFFLINE"}
        </span>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <DefenseMetrics stats={stats} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldStatus stats={stats} threatLevel={threatLevel} />
        </div>
        <ThreatFeed threats={threats} />
        <ThreatHeatmap byType={stats?.by_type} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <InterceptorDemo onNewThreat={loadData} />
        <ThreatRadar byType={stats?.by_type} />
      </div>
    </div>
  );
}
