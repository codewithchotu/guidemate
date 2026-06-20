import { Link } from "react-router-dom";
import { Star, ShieldCheck, Languages, MapPin } from "lucide-react";

export default function BuddyCard({ buddy }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available": return "#10b981"; // green
      case "busy": return "#f59e0b"; // orange
      default: return "#94a3b8"; // slate
    }
  };

  return (
    <div className="glass-card" style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* City tag */}
      <div style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        background: "rgba(255, 255, 255, 0.8)",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "0.75rem",
        fontWeight: 700,
        color: "var(--primary)",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>
        <MapPin size={12} />
        {buddy.city}
      </div>

      {/* Profile Graphic / Info */}
      <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}>
        {/* Mock Avatar */}
        <div style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, var(--primary-light) 0%, var(--secondary) 100%)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontWeight: 700,
          fontSize: "1.3rem",
          boxShadow: "0 4px 12px rgba(37,99,235,0.15)",
          position: "relative"
        }}>
          {buddy.name.charAt(0)}
          {/* Status Dot */}
          <span style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: getStatusColor(buddy.availability),
            border: "2px solid white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }} title={buddy.availability} />
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-dark)" }}>{buddy.name}</h3>
            <span style={{ color: "#2563eb", display: "inline-flex" }} title="Verified Buddy">
              <ShieldCheck size={18} />
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
            <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)" }}>{buddy.rating}</span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>({buddy.reviewCount || 10} reviews)</span>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "16px" }}>
        <Languages size={15} style={{ color: "var(--text-muted)", marginTop: "3px" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {buddy.languages.map(lang => (
            <span key={lang} style={{
              fontSize: "0.75rem",
              background: "rgba(0,0,0,0.04)",
              padding: "2px 8px",
              borderRadius: "4px",
              fontWeight: 500
            }}>
              {lang}
            </span>
          ))}
        </div>
      </div>

      <p style={{
        fontSize: "0.85rem",
        color: "var(--text-muted)",
        marginBottom: "20px",
        flex: "1",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}>
        {buddy.bio || `${buddy.name} is a verified companion guide specialized in local attractions and cultural history in ${buddy.city}.`}
      </p>

      {/* Price and Action */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid rgba(0, 0, 0, 0.05)",
        paddingTop: "12px",
        marginTop: "auto"
      }}>
        <div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>HOURLY RATE</span>
          <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--primary)" }}>₹{buddy.price}</span>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>/hr</span>
        </div>

        <Link
          to={`/buddy/${buddy.id}`}
          className="gradient-btn"
          style={{
            padding: "8px 16px",
            fontSize: "0.85rem",
            borderRadius: "10px"
          }}
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}