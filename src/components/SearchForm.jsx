import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, MapPin, DollarSign, Globe, Calendar } from "lucide-react";

export default function SearchForm({ initialData = {} }) {
  const navigate = useNavigate();
  const [destination, setDestination] = useState(initialData.destination || "tokyo");
  const [budget, setBudget] = useState(initialData.budget || "50000");
  const [language, setLanguage] = useState(initialData.language || "English");
  const [days, setDays] = useState(initialData.days || "3");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to planner with state, which will display the live agent visualization screen and trigger results compilation
    navigate("/planner", {
      state: {
        destination,
        budget,
        language,
        days,
        autoStart: true // starts running agents immediately
      }
    });
  };

  const destinationsList = [
    { value: "dubai", label: "Dubai, UAE" },
    { value: "tokyo", label: "Tokyo, Japan" },
    { value: "paris", label: "Paris, France" },
    { value: "hyderabad", label: "Hyderabad, India" },
    { value: "singapore", label: "Singapore" }
  ];

  const languagesList = ["English", "Arabic", "Hindi", "Japanese", "French", "Spanish", "Mandarin", "Malay", "Telugu"];

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px"
      }}>
        {/* Destination */}
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "var(--text-dark)" }}>
            <MapPin size={14} style={{ color: "var(--primary)" }} />
            Destination
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="input-field"
            style={{ appearance: "none" }}
          >
            {destinationsList.map(dest => (
              <option key={dest.value} value={dest.value}>{dest.label}</option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "var(--text-dark)" }}>
            <DollarSign size={14} style={{ color: "var(--primary)" }} />
            Budget limit (INR equivalent)
          </label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="input-field"
            placeholder="e.g. ₹50,000"
            min="5000"
            step="1000"
            required
          />
        </div>

        {/* Language */}
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "var(--text-dark)" }}>
            <Globe size={14} style={{ color: "var(--primary)" }} />
            Preferred Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field"
          >
            {languagesList.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Days */}
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px", color: "var(--text-dark)" }}>
            <Calendar size={14} style={{ color: "var(--primary)" }} />
            Number of Days
          </label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="input-field"
            min="1"
            max="10"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="gradient-btn"
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "1rem"
        }}
      >
        <Sparkles size={18} />
        Generate My Trip
      </button>
    </form>
  );
}
