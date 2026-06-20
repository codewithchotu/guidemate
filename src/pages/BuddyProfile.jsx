import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/Layout";
import travelData from "../data/travelData";
import { ShieldCheck, Star, Calendar, Clock, BookOpen, ChevronLeft, MapPin, BadgePercent, Check } from "lucide-react";

export default function BuddyProfile() {
  const { id } = useParams();

  // Find the buddy in the centralized travelData database
  const allBuddies = Object.values(travelData).reduce((all, city) => {
    const buddiesWithCity = city.buddies.map(b => ({ ...b, city: city.name }));
    return [...all, ...buddiesWithCity];
  }, []);

  const buddy = allBuddies.find(b => b.id === id) || allBuddies[0];

  // Booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("10:00");
  const [bookingHours, setBookingHours] = useState("4");
  const [isBooked, setIsBooked] = useState(false);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsBooked(true);
  };

  const totalPrice = buddy.price * parseInt(bookingHours);

  return (
    <Layout>
      <div className="container" style={{ padding: "40px 16px" }}>
        {/* Back Link */}
        <Link to="/buddies" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "24px", fontWeight: 600 }}>
          <ChevronLeft size={16} />
          Back to Marketplace
        </Link>

        <div className="grid-cols-12" style={{ gap: "32px" }}>
          {/* Left Column: Profile Card */}
          <div className="col-span-4">
            <div className="glass-panel" style={{ padding: "32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              {/* Profile Avatar */}
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontWeight: 800,
                fontSize: "2.5rem",
                boxShadow: "0 8px 24px rgba(37,99,235,0.18)"
              }}>
                {buddy.name.charAt(0)}
              </div>

              {/* Name & Verification */}
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{buddy.name}</h2>
                  <ShieldCheck size={22} style={{ color: "var(--primary)" }} />
                </div>
                <span className="badge badge-green" style={{ display: "flex", width: "max-content", margin: "6px auto 0 auto", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
                  {buddy.availability}
                </span>
              </div>

              {/* Details table */}
              <div style={{ width: "100%", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "16px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "12px", textAlign: "left", fontSize: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Location</span>
                  <strong style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <MapPin size={14} style={{ color: "var(--primary)" }} />
                    {buddy.city}
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Languages</span>
                  <strong>{buddy.languages.join(", ")}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Experience</span>
                  <strong>{buddy.experience || "3 years"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Hourly Rate</span>
                  <strong style={{ color: "var(--primary)", fontSize: "1.1rem" }}>₹{buddy.price}/hr</strong>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="gradient-btn"
                style={{ width: "100%", padding: "14px", marginTop: "10px", fontSize: "0.95rem" }}
              >
                <Calendar size={18} />
                Book {buddy.name}
              </button>
            </div>
          </div>

          {/* Right Column: Bio & Reviews */}
          <div className="col-span-8" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {/* About Section */}
            <div className="glass-panel" style={{ padding: "32px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "16px" }}>About Me</h3>
              <p style={{ color: "var(--text-dark)", fontSize: "0.95rem", lineHeight: "1.7", marginBottom: "20px" }}>
                {buddy.bio || `Hi! I'm ${buddy.name}, a verified local companion living in ${buddy.city}. I specialize in helping travelers navigate local areas safely and affordably. I look forward to taking you on an authentic tour of my city!`}
              </p>

              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px" }}>
                My Specializations
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {buddy.specializations.map(spec => (
                  <span key={spec} className="badge badge-purple" style={{ fontSize: "0.85rem" }}>
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="glass-panel" style={{ padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "16px", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Traveler Reviews</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Star size={20} fill="#fbbf24" stroke="#fbbf24" />
                  <span style={{ fontSize: "1.2rem", fontWeight: 800 }}>{buddy.rating}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>({buddy.reviewCount || 10} reviews)</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {buddy.reviews && buddy.reviews.length > 0 ? (
                  buddy.reviews.map((rev, idx) => (
                    <div key={idx} style={{
                      background: "rgba(255, 255, 255, 0.4)",
                      padding: "16px",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.4)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <strong style={{ fontSize: "0.95rem" }}>{rev.author}</strong>
                        <div style={{ display: "flex", gap: "2px" }}>
                          {[...Array(Math.floor(rev.rating))].map((_, i) => (
                            <Star key={i} size={14} fill="#fbbf24" stroke="#fbbf24" />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                        "{rev.text}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No reviews available yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px"
        }}>
          <div className="glass-panel animate-fade-in" style={{
            background: "white",
            padding: "32px",
            maxWidth: "480px",
            width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
            position: "relative"
          }}>
            {!isBooked ? (
              <>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "4px" }}>Schedule a Session</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "20px" }}>
                  Reserve hours with <strong>{buddy.name}</strong> to explore {buddy.city}.
                </p>

                <form onSubmit={handleBookingSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Start Time</label>
                      <input
                        type="time"
                        className="input-field"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Duration (Hours)</label>
                      <select
                        className="input-field"
                        value={bookingHours}
                        onChange={(e) => setBookingHours(e.target.value)}
                      >
                        <option value="2">2 Hours</option>
                        <option value="4">4 Hours</option>
                        <option value="6">6 Hours</option>
                        <option value="8">8 Hours (Full Day)</option>
                      </select>
                    </div>
                  </div>

                  {/* Pricing Overview */}
                  <div style={{
                    background: "var(--bg-light)",
                    padding: "16px",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "8px",
                    fontSize: "0.9rem"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Hourly Rate</span>
                      <strong>₹{buddy.price}/hr</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Hours Requested</span>
                      <strong>{bookingHours} hrs</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed rgba(0,0,0,0.1)", paddingTop: "8px", fontWeight: 800 }}>
                      <span>Estimated Total</span>
                      <span style={{ color: "var(--primary)", fontSize: "1.1rem" }}>₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                    <button
                      type="button"
                      onClick={() => setIsBookingOpen(false)}
                      className="btn-secondary"
                      style={{ flex: 1, padding: "12px" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="gradient-btn"
                      style={{ flex: 2, padding: "12px" }}
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Success Screen */
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "16px 0" }} className="animate-fade-in">
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "2px solid #10b981",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#10b981",
                  marginBottom: "8px"
                }}>
                  <Check size={32} strokeWidth={3} />
                </div>

                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-dark)" }}>Booking Requested!</h3>
                
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.6" }}>
                  A reservation request has been dispatched to <strong>{buddy.name}</strong> for <strong>{bookingDate}</strong> at <strong>{bookingTime}</strong>. 
                  They will confirm via SMS shortly.
                </p>

                <div style={{
                  background: "rgba(16, 185, 129, 0.05)",
                  border: "1px dashed rgba(16, 185, 129, 0.2)",
                  padding: "12px",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  width: "100%",
                  color: "#065f46"
                }}>
                  💰 Order Reference: GM-BOOK-{Math.floor(100000 + Math.random() * 900000)}
                </div>

                <button
                  onClick={() => {
                    setIsBooked(false);
                    setIsBookingOpen(false);
                  }}
                  className="gradient-btn"
                  style={{ width: "100%", padding: "12px", marginTop: "12px" }}
                >
                  Return to Profile
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
