import { motion } from "framer-motion";

export default function ShieldStatus({ stats, threatLevel }) {
  const isUnderAttack = threatLevel === "critical" || threatLevel === "high";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem" }}>
      <motion.div animate={{ scale: isUnderAttack ? [1, 1.08, 1] : 1 }} transition={{ duration: 1.2, repeat: isUnderAttack ? Infinity : 0 }}>
        <svg width="90" height="100" viewBox="0 0 100 110">
          <path d="M50 8 L88 25 L88 55 Q88 85 50 102 Q12 85 12 55 L12 25 Z" fill="rgba(220,38,38,0.08)" stroke="#dc2626" strokeWidth="1.5" />
          <text x="50" y="60" textAnchor="middle" fontSize="22" fill="#dc2626">⬡</text>
        </svg>
      </motion.div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: "700", color: isUnderAttack ? "#dc2626" : "#16a34a" }}>
          {isUnderAttack ? "THREAT DETECTED" : "SHIELDS ACTIVE"}
        </div>
        <div className="courier" style={{ fontSize: "0.6rem", color: "rgba(226,232,240,0.5)" }}>{stats?.block_rate || 0}% BLOCK RATE</div>
      </div>
    </div>
  );
}
