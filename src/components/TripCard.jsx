import { Calendar, MapPin, Coffee, Train } from "lucide-react";

export default function TripCard({ itinerary }) {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "12px" }}>
        <Calendar style={{ color: "var(--primary)" }} />
        AI Day-Wise Itinerary
      </h3>

      <div className="timeline-container">
        {itinerary.map((dayPlan, idx) => (
          <div className="timeline-item animate-fade-in" key={dayPlan.day} style={{ animationDelay: `${idx * 0.1}s` }}>
            {/* Dot Indicator */}
            <div className={`timeline-dot ${dayPlan.day % 2 === 0 ? "secondary" : ""}`} />

            <div style={{
              background: "rgba(255, 255, 255, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              borderRadius: "16px",
              padding: "16px",
              marginLeft: "8px"
            }}>
              {/* Day title */}
              <h4 style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--primary)", display: "flex", justifyBetween: "space-between", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                <span>{dayPlan.title}</span>
              </h4>

              {/* Attractions scheduled */}
              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {dayPlan.attractions.map((att, attIdx) => (
                  <div key={attIdx} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <MapPin size={16} style={{ color: "var(--secondary)", marginTop: "3px", flexShrink: 0 }} />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-dark)" }}>{att.name}</span>
                        <span style={{
                          fontSize: "0.7rem",
                          padding: "2px 6px",
                          borderRadius: "10px",
                          background: "rgba(139, 92, 246, 0.08)",
                          color: "var(--secondary)",
                          fontWeight: 700
                        }}>{att.category}</span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>{att.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Food spot */}
              {dayPlan.dining && (
                <div style={{
                  marginTop: "12px",
                  paddingTop: "10px",
                  borderTop: "1px dashed rgba(0, 0, 0, 0.08)",
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                  fontSize: "0.85rem"
                }}>
                  <Coffee size={15} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Recommended Meal: </span>
                    <strong style={{ color: "var(--text-dark)" }}>{dayPlan.dining.name}</strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}> ({dayPlan.dining.cuisine} • {dayPlan.dining.price})</span>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#b91c1c", fontStyle: "italic", marginTop: "1px" }}>
                      🔥 Must Try: {dayPlan.dining.recommendation}
                    </span>
                  </div>
                </div>
              )}

              {/* Local transport tip */}
              <div style={{
                marginTop: "10px",
                padding: "8px 12px",
                background: "rgba(37, 99, 235, 0.04)",
                borderRadius: "8px",
                display: "flex",
                gap: "8px",
                alignItems: "center",
                fontSize: "0.8rem",
                color: "var(--primary)"
              }}>
                <Train size={14} style={{ flexShrink: 0 }} />
                <span>{dayPlan.transportTip}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}