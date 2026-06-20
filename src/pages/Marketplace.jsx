import { useState } from "react";
import Layout from "../components/Layout";
import BuddyCard from "../components/BuddyCard";
import travelData from "../data/travelData";
import { Search, Filter, Star, Globe, Shield, RefreshCw } from "lucide-react";

export default function Marketplace() {
  // Extract all buddies from the central database
  const allBuddies = Object.values(travelData).reduce((all, city) => {
    // Inject city name in each buddy object to ensure it shows up correctly in the flat marketplace
    const buddiesWithCity = city.buddies.map(b => ({ ...b, city: city.name }));
    return [...all, ...buddiesWithCity];
  }, []);

  const [destinationFilter, setDestinationFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("1000"); // hourly price ceiling
  const [ratingFilter, setRatingFilter] = useState("all");

  const resetFilters = () => {
    setDestinationFilter("all");
    setLanguageFilter("all");
    setBudgetFilter("1000");
    setRatingFilter("all");
  };

  // Get distinct list of languages and cities for dropdowns
  const availableCities = Array.from(new Set(allBuddies.map(b => b.city)));
  const availableLanguages = Array.from(new Set(allBuddies.flatMap(b => b.languages)));

  // Filter logic
  const filteredBuddies = allBuddies.filter(buddy => {
    const matchCity = destinationFilter === "all" || buddy.city.toLowerCase() === destinationFilter.toLowerCase();
    const matchLang = languageFilter === "all" || buddy.languages.some(lang => lang.toLowerCase() === languageFilter.toLowerCase());
    const matchBudget = buddy.price <= parseFloat(budgetFilter);
    const matchRating = ratingFilter === "all" || buddy.rating >= parseFloat(ratingFilter);

    return matchCity && matchLang && matchBudget && matchRating;
  });

  return (
    <Layout>
      <div className="container" style={{ padding: "40px 16px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }} className="animate-fade-in">
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800 }}>Meet Our <span className="gradient-text">Local Buddies</span></h1>
          <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
            Explore cities safely and authentically with vetted, multilingual local companions.
          </p>
        </div>

        {/* Search and Filters panel */}
        <div className="glass-panel" style={{ padding: "24px", marginBottom: "32px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            paddingBottom: "12px",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={18} style={{ color: "var(--primary)" }} />
              Filter Buddies
            </h3>
            <button
              onClick={resetFilters}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "transparent",
                border: "none",
                color: "var(--primary)",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              <RefreshCw size={14} />
              Reset Filters
            </button>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px"
          }}>
            {/* Filter Destination */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>City / Destination</label>
              <select
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Cities</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Filter Language */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Language Spoken</label>
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">Any Language</option>
                {availableLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Filter Budget */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Max Hourly Rate</label>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)" }}>₹{budgetFilter}/hr</span>
              </div>
              <input
                type="range"
                min="200"
                max="1000"
                step="50"
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                style={{
                  width: "100%",
                  height: "6px",
                  borderRadius: "3px",
                  background: "#cbd5e1",
                  outline: "none",
                  cursor: "pointer"
                }}
              />
            </div>

            {/* Filter Rating */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Minimum Rating</label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">Any Rating</option>
                <option value="4.9">⭐ 4.9 & above</option>
                <option value="4.8">⭐ 4.8 & above</option>
                <option value="4.5">⭐ 4.5 & above</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "20px" }}>
          Showing <strong>{filteredBuddies.length}</strong> verified buddies matching your criteria.
        </p>

        {/* Buddy list grid */}
        {filteredBuddies.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px"
          }}>
            {filteredBuddies.map(buddy => (
              <div key={buddy.id} className="animate-fade-in">
                <BuddyCard buddy={buddy} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{
            padding: "48px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "1rem"
          }}>
            <Globe size={48} style={{ margin: "0 auto 16px auto", color: "var(--text-muted)", strokeWidth: 1 }} />
            <h3>No Buddies matched your current filters.</h3>
            <p style={{ marginTop: "4px" }}>Try increasing your budget limit or resetting filters.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
