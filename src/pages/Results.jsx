import { useLocation, Link } from "react-router-dom";
import Layout from "../components/Layout";
import TripCard from "../components/TripCard";
import SafetyCard from "../components/SafetyCard";
import { runTripPlanningAgents } from "../services/agents";
import { CloudRain, CloudSun, Sun, DollarSign, UserCheck, Star, Sparkles, Building, Landmark, ShoppingBag, Utensils, Navigation } from "lucide-react";

export default function Results() {
  const location = useLocation();

  // Load compiled payload from state or run defaults for Tokyo if directly accessed
  const tripData = location.state?.tripPayload || runTripPlanningAgents({
    destination: "tokyo",
    budget: 50000,
    language: "English",
    duration: 3,
    interests: ["food", "culture", "nature"]
  });

  const {
    destination,
    country,
    description,
    currency,
    weather,
    buddy,
    budget,
    itinerary,
    safety,
    hotels,
    restaurants,
    shopping,
    attractions
  } = tripData;

  // Weather icon mapping
  const getWeatherIcon = (cond) => {
    switch (cond?.toLowerCase()) {
      case "sunny": return <Sun size={32} style={{ color: "#f59e0b" }} />;
      case "rainy": return <CloudRain size={32} style={{ color: "#475569" }} />;
      default: return <CloudSun size={32} style={{ color: "#8b5cf6" }} />;
    }
  };

  return (
    <Layout>
      <div className="container" style={{ padding: "40px 16px" }}>
        
        {/* Dashboard Header */}
        <div className="glass-panel" style={{
          padding: "32px",
          marginBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="badge badge-purple" style={{ textTransform: "uppercase" }}>AI Generated Trip Results</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", color: "#10b981", fontWeight: 700 }}>
                <Sparkles size={14} /> Active Agents Verified
              </span>
            </div>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginTop: "8px" }}>
              {destination}, <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>{country}</span>
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "600px", marginTop: "6px" }}>
              {description}
            </p>
          </div>

          {/* Quick Stats Header widget */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {/* Weather widget */}
            <div style={{
              background: "rgba(255, 255, 255, 0.5)",
              padding: "16px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              border: "1px solid rgba(255, 255, 255, 0.4)"
            }}>
              {getWeatherIcon(weather.condition)}
              <div>
                <span style={{ fontSize: "1.2rem", fontWeight: 800, display: "block" }}>{weather.temp}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{weather.condition} • {weather.desc}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid-cols-12" style={{ gap: "24px" }}>
          
          {/* LEFT COLUMN: ITINERARY TIMELINE (8 cols) */}
          <div className="col-span-8">
            <TripCard itinerary={itinerary} />
          </div>

          {/* RIGHT COLUMN: AGENT WIDGET STACK (4 cols) */}
          <div className="col-span-4" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* 1. SAFETY SCORE CARD WIDGET */}
            <SafetyCard safety={safety} city={destination} />

            {/* 2. BUDGET TRACKER WIDGET */}
            <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                <DollarSign size={20} style={{ color: "#10b981" }} />
                Budget Allocation
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Visual Bar Breakdown */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                    <span>Lodging (45%)</span>
                    <strong>₹{budget.hotel.toLocaleString()}</strong>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "rgba(0,0,0,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: "45%", height: "100%", background: "var(--primary)" }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                    <span>Local Companion (Buddy)</span>
                    <strong>₹{budget.companion.toLocaleString()}</strong>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "rgba(0,0,0,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, Math.round((budget.companion / budget.total) * 100))}%`, height: "100%", background: "var(--secondary)" }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                    <span>Dining (20%)</span>
                    <strong>₹{budget.food.toLocaleString()}</strong>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "rgba(0,0,0,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: "20%", height: "100%", background: "#ec4899" }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                    <span>Activities & Shopping</span>
                    <strong>₹{budget.activities.toLocaleString()}</strong>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "rgba(0,0,0,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: "15%", height: "100%", background: "#10b981" }} />
                  </div>
                </div>

                <div style={{
                  marginTop: "8px",
                  paddingTop: "12px",
                  borderTop: "1px dashed rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.95rem",
                  fontWeight: 800
                }}>
                  <span>Total Budget Limit</span>
                  <span style={{ color: "var(--primary)" }}>₹{budget.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 3. BUDDY RECOMMENDATION CARD WIDGET */}
            <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                <UserCheck size={20} style={{ color: "var(--secondary)" }} />
                Your Recommended Buddy
              </h3>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: 800,
                  fontSize: "1.1rem"
                }}>
                  {buddy.name.charAt(0)}
                </div>

                <div>
                  <h4 style={{ fontWeight: 700, fontSize: "1rem" }}>{buddy.name}</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                    <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
                    <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>{buddy.rating}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>({buddy.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
                Matches your language (<strong>{buddy.languages.join(", ")}</strong>) and interests. Fluent local companion ready to guide you.
              </p>

              <div style={{ display: "flex", gap: "8px", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "12px", marginTop: "4px" }}>
                <Link to={`/buddy/${buddy.id}`} className="gradient-btn" style={{ flex: 1, padding: "8px", fontSize: "0.8rem" }}>
                  Book Now
                </Link>
                <Link to="/buddies" className="btn-secondary" style={{ flex: 1, padding: "8px", fontSize: "0.8rem" }}>
                  Browse All
                </Link>
              </div>
            </div>

            {/* 4. POPULAR ATTRACTIONS & LOCAL DIRECTORY */}
            <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                <Landmark size={20} style={{ color: "var(--primary)" }} />
                Local Directory Recommendations
              </h3>

              {/* Hotels */}
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                  <Building size={14} />
                  Lodging Options
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {hotels.map((h, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", background: "rgba(255,255,255,0.3)", padding: "6px 10px", borderRadius: "8px" }}>
                      <span>{h.name} <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>({h.type})</span></span>
                      <strong>{h.price}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dining */}
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                  <Utensils size={14} />
                  Top Restaurant Picks
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {restaurants.map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", background: "rgba(255,255,255,0.3)", padding: "6px 10px", borderRadius: "8px" }}>
                      <span>{r.name} <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>({r.cuisine})</span></span>
                      <strong>{r.price}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shopping */}
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                  <ShoppingBag size={14} />
                  Shopping Destinations
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {shopping.map((s, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", fontSize: "0.8rem", background: "rgba(255,255,255,0.3)", padding: "6px 10px", borderRadius: "8px", gap: "2px" }}>
                      <strong style={{ color: "var(--text-dark)" }}>{s.name} <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: "0.75rem" }}>({s.type})</span></strong>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.description}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}