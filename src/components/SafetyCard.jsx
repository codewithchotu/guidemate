import { Link } from "react-router-dom";
import { Shield, AlertTriangle, HelpCircle, CheckCircle } from "lucide-react";

export default function SafetyCard({ safety, city }) {
  if (!safety) return null;

  const getScoreColor = (score) => {
    if (score >= 90) return "#10b981"; // green
    if (score >= 80) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  return (
    <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
          <Shield style={{ color: getScoreColor(safety.score) }} />
          Safety Assessment
        </h3>
        <span className="badge badge-blue">{city}</span>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "center", background: "rgba(255, 255, 255, 0.4)", padding: "16px", borderRadius: "16px" }}>
        {/* Score Ring */}
        <div style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          border: `5px solid ${getScoreColor(safety.score)}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          boxShadow: `0 0 15px ${getScoreColor(safety.score)}20`
        }}>
          <span style={{ fontSize: "1.3rem", fontWeight: 800 }}>{safety.score}</span>
          <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "-2px" }}>/100</span>
        </div>

        <div>
          <h4 style={{ fontWeight: 700, fontSize: "0.95rem" }}>
            {safety.score >= 90 ? "Excellent Safety Index" : safety.score >= 80 ? "Moderate Safety Level" : "Caution Recommended"}
          </h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
            Monitored by local authorities and GuideMate agents.
          </p>
        </div>
      </div>

      {/* Advisory Snippet */}
      <div>
        <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
          Top Scam Warning
        </h4>
        <div style={{
          display: "flex",
          gap: "8px",
          background: "rgba(245, 158, 11, 0.08)",
          border: "1px solid rgba(245, 158, 11, 0.15)",
          padding: "12px",
          borderRadius: "12px",
          fontSize: "0.85rem",
          color: "#9a3412"
        }}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
          <span>{safety.scams[0] || "Avoid carrying large sums of cash in crowded spaces."}</span>
        </div>
      </div>

      {/* Checklist recommendations */}
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
          Key Guidelines
        </h4>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem" }}>
          {safety.recommendations.slice(0, 2).map((rec, index) => (
            <li key={index} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <CheckCircle size={15} style={{ color: "#10b981", flexShrink: 0, marginTop: "3px" }} />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
          <HelpCircle size={14} />
          Need immediate support?
        </span>
        <Link to="/safety" state={{ city: city.toLowerCase() }} style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", hover: { textDecoration: "underline" } }}>
          Open Safety Center →
        </Link>
      </div>
    </div>
  );
}