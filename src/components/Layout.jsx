import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="layout-container">
      {/* Background blobs for premium glassmorphism effect */}
      <div className="bg-blobs">
        <div className="blob blob-primary" />
        <div className="blob blob-secondary" />
        <div className="blob blob-accent" />
      </div>

      {/* Header / Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="main-content" style={{ minHeight: "calc(100vh - 300px)" }}>
        {children}
      </main>

      {/* Premium Startup Footer */}
      <footer style={{
        background: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.3)",
        padding: "48px 24px 24px 24px"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "32px",
          marginBottom: "40px"
        }}>
          <div>
            <h3 className="gradient-text" style={{ fontWeight: 800, fontSize: "1.25rem", marginBottom: "16px" }}>
              🌍 GuideMate
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Connecting travelers with local multilingual companions to explore destinations safely, affordably, and authentically.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "16px", color: "var(--text-dark)" }}>
              Explore
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
              <li><a href="/" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "var(--primary)"} onMouseOut={(e) => e.target.style.color = "inherit"}>Search Destinations</a></li>
              <li><a href="/planner" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "var(--primary)"} onMouseOut={(e) => e.target.style.color = "inherit"}>AI Planner Agent</a></li>
              <li><a href="/buddies" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "var(--primary)"} onMouseOut={(e) => e.target.style.color = "inherit"}>Buddy Marketplace</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "16px", color: "var(--text-dark)" }}>
              Support & Safety
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
              <li><a href="/safety" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "var(--primary)"} onMouseOut={(e) => e.target.style.color = "inherit"}>Safety Center</a></li>
              <li><a href="/sos" style={{ transition: "color 0.2s", color: "#ef4444", fontWeight: 600 }} onMouseOver={(e) => e.target.style.filter = "brightness(1.2)"} onMouseOut={(e) => e.target.style.filter = "none"}>Emergency SOS</a></li>
              <li><a href="#" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "var(--primary)"} onMouseOut={(e) => e.target.style.color = "inherit"}>Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "16px", color: "var(--text-dark)" }}>
              Contact
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
              <li>support@guidemate.com</li>
              <li>+1 (555) 234-5678</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
        </div>

        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          borderTop: "1px solid rgba(0, 0, 0, 0.05)",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          fontSize: "0.85rem",
          color: "var(--text-muted)"
        }}>
          <p>© {new Date().getFullYear()} GuideMate Inc. All rights reserved.</p>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="#" style={{ textDecoration: "underline" }}>Privacy Policy</a>
            <a href="#" style={{ textDecoration: "underline" }}>Cookie Settings</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
