import { useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import travelData from "../data/travelData";
import { Shield, Phone, AlertTriangle, CheckCircle, Info, Landmark } from "lucide-react";

export default function SafetyCenter() {
  const location = useLocation();

  // Pick initial city based on route state or default to tokyo
  const initialCity = location.state?.city || "tokyo";
  const [selectedCity, setSelectedCity] = useState(initialCity);

  const activeCityData = travelData[selectedCity] || travelData["tokyo"];

  const getScoreColor = (score) => {
    if (score >= 90) return "#10b981"; // green
    if (score >= 80) return "#f59e0b"; // orange
    return "#ef4444"; // red
  };

  const citiesList = [
    { key: "dubai", name: "Dubai" },
    { key: "tokyo", name: "Tokyo" },
    { key: "paris", name: "Paris" },
    { key: "hyderabad", name: "Hyderabad" },
    { key: "singapore", name: "Singapore" }
  ];

  return (
    <Layout>
      <div className="container" style={{ padding: "40px 16px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }} className="animate-fade-in">
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800 }}>GuideMate <span className="gradient-text">Safety Center</span></h1>
          <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
            Real-time travel safety ratings, regional scam notices, and official government advisor links.
          </p>
        </div>

        {/* City Select Tabs */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "32px",
          flexWrap: "wrap"
        }}>
          {citiesList.map(c => {
            const isActive = selectedCity === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setSelectedCity(c.key)}
                className="glass-panel"
                style={{
                  padding: "10px 20px",
                  borderRadius: "12px",
                  border: isActive ? "1px solid var(--primary)" : "1px solid rgba(255,255,255,0.4)",
                  background: isActive ? "rgba(37, 99, 235, 0.08)" : "rgba(255,255,255,0.6)",
                  color: isActive ? "var(--primary)" : "var(--text-dark)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Safety Grid */}
        <div className="grid-cols-12" style={{ gap: "24px" }}>
          
          {/* Left Column: Safety Score and Contacts */}
          <div className="col-span-4" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Safety Score Card */}
            <div className="glass-panel" style={{ padding: "32px", textAlign: "center" }}>
              <Shield size={48} style={{ color: getScoreColor(activeCityData.safety.score), margin: "0 auto 12px auto" }} />
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Safety Index</h2>
              
              <div style={{
                fontSize: "3rem",
                fontWeight: 900,
                color: getScoreColor(activeCityData.safety.score),
                margin: "12px 0 4px 0"
              }}>
                {activeCityData.safety.score}
                <span style={{ fontSize: "1.2rem", color: "var(--text-muted)", fontWeight: 500 }}>/100</span>
              </div>

              <span className="badge" style={{
                background: `${getScoreColor(activeCityData.safety.score)}15`,
                color: getScoreColor(activeCityData.safety.score),
                border: `1px solid ${getScoreColor(activeCityData.safety.score)}25`,
                fontWeight: 700
              }}>
                {activeCityData.safety.score >= 90 ? "Highly Secure Hub" : activeCityData.safety.score >= 80 ? "Moderate Security" : "Exercise Vigilance"}
              </span>

              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "16px", lineHeight: "1.4" }}>
                Score compiles regional crime statistics, emergency service density, and tourist feedback.
              </p>
            </div>

            {/* Emergency Hotline Directory */}
            <div className="glass-panel" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Phone size={18} style={{ color: "var(--primary)" }} />
                Emergency Hotline
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>POLICE</span>
                  <strong style={{ fontSize: "0.95rem" }}>{activeCityData.safety.police}</strong>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>AMBULANCE / MEDICAL</span>
                  <strong style={{ fontSize: "0.95rem" }}>{activeCityData.safety.ambulance}</strong>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>US EMBASSY HELPLINE</span>
                  <strong style={{ fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Landmark size={14} style={{ color: "var(--text-muted)" }} />
                    {activeCityData.safety.embassy}
                  </strong>
                </div>
                {activeCityData.safety.touristHelpline && (
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>TOURIST SECURITY SUPPORT</span>
                    <strong style={{ fontSize: "0.95rem" }}>{activeCityData.safety.touristHelpline}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Advisories, Scams & Recommendations */}
          <div className="col-span-8" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Travel Advisories */}
            <div className="glass-panel" style={{ padding: "32px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Info size={20} style={{ color: "var(--primary)" }} />
                Active Travel Advisories
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {activeCityData.safety.advisories.map((adv, idx) => (
                  <div key={idx} style={{
                    background: "rgba(37,99,235,0.04)",
                    borderLeft: "4px solid var(--primary)",
                    padding: "16px",
                    borderRadius: "0 12px 12px 0",
                    fontSize: "0.9rem"
                  }}>
                    {adv}
                  </div>
                ))}
              </div>
            </div>

            {/* Local Scam Alert Board */}
            <div className="glass-panel" style={{ padding: "32px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertTriangle size={20} style={{ color: "#f59e0b" }} />
                Known Regional Scams
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {activeCityData.safety.scams.map((scam, idx) => (
                  <div key={idx} style={{
                    background: "rgba(245, 158, 11, 0.05)",
                    border: "1px solid rgba(245, 158, 11, 0.15)",
                    padding: "16px",
                    borderRadius: "12px",
                    fontSize: "0.9rem",
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start"
                  }}>
                    <AlertTriangle size={18} style={{ color: "#f59e0b", flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      <strong style={{ display: "block", marginBottom: "2px", color: "var(--text-dark)" }}>Caution Advisory #{idx+1}</strong>
                      <span style={{ color: "var(--text-muted)" }}>{scam}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security recommendations Checklist */}
            <div className="glass-panel" style={{ padding: "32px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle size={20} style={{ color: "#10b981" }} />
                Safety Recommendations
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="grid-cols-mobile">
                {activeCityData.safety.recommendations.map((rec, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                    fontSize: "0.85rem"
                  }}>
                    <CheckCircle size={16} style={{ color: "#10b981", flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ color: "var(--text-dark)", lineHeight: "1.4" }}>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
