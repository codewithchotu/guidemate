import Layout from "../components/Layout";
import SearchForm from "../components/SearchForm";
import { ShieldCheck, Compass, DollarSign, Users, Star, ArrowRight, Activity, Smile } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const features = [
    {
      icon: <Users size={28} style={{ color: "var(--primary)" }} />,
      title: "Verified Local Companions",
      desc: "Connect with screened, multilingual local companions who know their city inside out and ensure you stay safe and comfortable."
    },
    {
      icon: <Compass size={28} style={{ color: "var(--secondary)" }} />,
      title: "Agentic AI Planner",
      desc: "Four specialized agents (Planner, Buddy Matcher, Safety, Budget) collaborate in real time to assemble your optimal journey."
    },
    {
      icon: <DollarSign size={28} style={{ color: "#10b981" }} />,
      title: "Budget Optimization",
      desc: "Enjoy authentic experiences without the tourist tax. Our agent dynamically manages cost allotments and prevents scams."
    }
  ];

  const howItWorks = [
    { step: "01", title: "Select Destination", desc: "Choose from our featured hubs and specify your travel duration, language, and budget limits." },
    { step: "02", title: "Collaborating Agents", desc: "Watch the Planner, Buddy, Budget, and Safety agents run risk checks and custom cost splits." },
    { step: "03", title: "Meet Your Buddy", desc: "Connect with a verified local companion matched directly to your language and interests." },
    { step: "04", title: "Explore Safely", desc: "Set off with an interactive day-by-day itinerary, live local contacts, and a 24/7 SOS safety center." }
  ];

  const testimonials = [
    {
      name: "Jessica Miller",
      role: "Solo Traveler",
      avatarBg: "linear-gradient(135deg, #f472b6, #ec4899)",
      quote: "As a female solo traveler visiting Tokyo, having Akira as my companion was a game changer. I felt completely safe and visited incredible spots I couldn't have found on my own!",
      rating: 5
    },
    {
      name: "Marcus Vance",
      role: "Culinary Blogger",
      avatarBg: "linear-gradient(135deg, #60a5fa, #3b82f6)",
      quote: "The street food crawl Abdul organized for us in Hyderabad was phenomenal. GuideMate's budget agent kept everything within what we planned, and we ate like royalty.",
      rating: 5
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section style={{
        padding: "80px 24px 60px 24px",
        textAlign: "center",
        position: "relative"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Announcement Badge */}
          <div style={{ display: "inline-flex", justifyContent: "center" }}>
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.6)",
              border: "1px solid rgba(37, 99, 235, 0.15)",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--primary)"
            }}>
              <ShieldCheck size={14} />
              Verified Local Companions & Realtime AI Routing
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em"
          }}>
            Travel Smarter with <span className="gradient-text">Local Buddies</span>
          </h1>

          <p style={{
            fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
            color: "var(--text-muted)",
            maxWidth: "640px",
            margin: "0 auto",
            fontWeight: 500,
            lineHeight: 1.5
          }}>
            GuideMate connects you with verified multilingual companions called "Buddies" who help you explore safely, affordably, and authentically.
          </p>

          {/* Glass Search Panel */}
          <div className="glass-panel-heavy animate-fade-in" style={{
            padding: "32px",
            marginTop: "30px",
            textAlign: "left"
          }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Compass size={20} className="gradient-text" style={{ strokeWidth: 3 }} />
              Plan Your Adventure
            </h2>
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "80px 24px", background: "rgba(255, 255, 255, 0.3)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--secondary)", textTransform: "uppercase" }}>Core Values</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>Why Choose GuideMate?</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px"
          }}>
            {features.map((feat, index) => (
              <div key={index} className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.8)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.02)"
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{feat.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: "80px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>Process Flow</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>How GuideMate Works</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px"
          }}>
            {howItWorks.map((step, index) => (
              <div key={index} className="glass-card" style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <span className="gradient-text" style={{
                  fontSize: "3rem",
                  fontWeight: 900,
                  opacity: 0.15,
                  position: "absolute",
                  top: "12px",
                  right: "20px"
                }}>
                  {step.step}
                </span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-dark)", marginTop: "20px" }}>{step.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 24px", background: "rgba(255, 255, 255, 0.3)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--secondary)", textTransform: "uppercase" }}>Real Experiences</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>What Travelers Say</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px"
          }}>
            {testimonials.map((test, index) => (
              <div key={index} className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" stroke="#fbbf24" />
                  ))}
                </div>

                <p style={{ fontStyle: "italic", fontSize: "0.95rem", color: "var(--text-dark)", flex: 1 }}>
                  "{test.quote}"
                </p>

                <div style={{ display: "flex", gap: "12px", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "12px" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: test.avatarBg,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.9rem"
                  }}>
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.9rem", fontWeight: 700 }}>{test.name}</h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini CTA Callout */}
      <section style={{ padding: "60px 24px", textAlign: "center" }}>
        <div className="glass-panel" style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "12px" }}>Ready to Explore Like a Local?</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px", maxWidth: "500px", margin: "0 auto 24px auto" }}>
            Plan a personalized, safe trip designed to match your budget and connect with multilingual local buddies.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/planner" className="gradient-btn">
              Go to AI Trip Planner
              <ArrowRight size={16} />
            </Link>
            <Link to="/buddies" className="btn-secondary">
              Browse Buddies
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}