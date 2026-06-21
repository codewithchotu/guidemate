import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { runTripPlanningAgents } from "../services/agents";
import { Sparkles, CheckSquare, Square, Terminal, ArrowRight, ShieldCheck, Heart, Info } from "lucide-react";

export default function Planner() {
  const location = useLocation();
  const navigate = useNavigate();

  // Load state if user searched on home page
  const initialSearch = location.state || {};

  const [destination, setDestination] = useState(initialSearch.destination || "tokyo");
  const [budget, setBudget] = useState(initialSearch.budget || "50000");
  const [language, setLanguage] = useState(initialSearch.language || "English");
  const [duration, setDuration] = useState(initialSearch.days || "3");
  
  // Interests state
  const [interests, setInterests] = useState({
    food: true,
    shopping: false,
    adventure: true,
    culture: true,
    nature: false
  });

  // Agent Running Simulation State
  const [isRunningAgents, setIsRunningAgents] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [agentLogs, setAgentLogs] = useState([]);
  const [finalPayload, setFinalPayload] = useState(null);

  const interestOptions = [
    { key: "food", label: "Food & Gastronomy" },
    { key: "shopping", label: "Shopping & Markets" },
    { key: "adventure", label: "Adventure & Thrills" },
    { key: "culture", label: "Culture & History" },
    { key: "nature", label: "Nature & Parks" }
  ];

  const destinationsList = [
    { value: "dubai", label: "Dubai, UAE" },
    { value: "tokyo", label: "Tokyo, Japan" },
    { value: "paris", label: "Paris, France" },
    { value: "hyderabad", label: "Hyderabad, India" },
    { value: "singapore", label: "Singapore" }
  ];

  const languagesList = ["English", "Arabic", "Hindi", "Japanese", "French", "Spanish", "Mandarin", "Malay", "Telugu"];

  const toggleInterest = (key) => {
    setInterests(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartPlanning = (e) => {
    if (e) e.preventDefault();

    const selectedInterests = Object.keys(interests).filter(key => interests[key]);
    if (selectedInterests.length === 0) {
      alert("Please select at least one interest to help our agents customize your trip!");
      return;
    }

    // Run agents to compile payload
    const payload = runTripPlanningAgents({
      destination,
      budget: parseFloat(budget),
      language,
      duration: parseInt(duration),
      interests: selectedInterests
    });

    setFinalPayload(payload);
    setAgentLogs([]);
    setIsRunningAgents(true);
    setCurrentStepIndex(0);
  };

  // Check if we navigated here with autoStart from the landing page
  useEffect(() => {
    if (initialSearch.autoStart) {
      // Small timeout to allow state to settle
      const t = setTimeout(() => {
        handleStartPlanning();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [location.state]);

  // Handle agent log typing simulation
  useEffect(() => {
    if (!isRunningAgents || !finalPayload) return;

    const steps = finalPayload.simulationSteps;
    if (currentStepIndex >= 0 && currentStepIndex < steps.length) {
      const timer = setTimeout(() => {
        setAgentLogs(prev => [...prev, steps[currentStepIndex]]);
        setCurrentStepIndex(prev => prev + 1);
      }, 1000); // 1 second per agent analysis
      return () => clearTimeout(timer);
    } else if (currentStepIndex === steps.length) {
      const timer = setTimeout(() => {
        // Automatically navigate to Results Dashboard with final payload
        navigate("/results", { state: { tripPayload: finalPayload } });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isRunningAgents, currentStepIndex, finalPayload]);

  return (
    <Layout>
      <div className="container" style={{ padding: "40px 16px" }}>
        {!isRunningAgents ? (
          <div className="grid-cols-12 animate-fade-in" style={{ gap: "32px" }}>
            {/* Header info card */}
            <div className="col-span-12" style={{ textAlign: "center", marginBottom: "20px" }}>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 800 }}>AI Trip <span className="gradient-text">Planner</span></h1>
              <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                Provide details below. Our four specialized AI agents will collaborate to customize your entire travel profile.
              </p>
            </div>

            {/* Left Column: Form */}
            <div className="col-span-8">
              <div className="glass-panel" style={{ padding: "32px" }}>
                <form onSubmit={handleStartPlanning} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="grid-cols-mobile">
                    {/* Destination */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-dark)" }}>
                        Destination
                      </label>
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="input-field"
                      >
                        {destinationsList.map(dest => (
                          <option key={dest.value} value={dest.value}>{dest.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Travel Duration */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-dark)" }}>
                        Travel Duration (Days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="input-field"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                      />
                    </div>

                    {/* Budget */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-dark)" }}>
                        Budget Limit (INR equivalent)
                      </label>
                      <input
                        type="number"
                        min="5000"
                        step="1000"
                        className="input-field"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        required
                      />
                    </div>

                    {/* Language */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-dark)" }}>
                        Preferred Buddy Language
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
                  </div>

                  {/* Interests checklist */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "12px", color: "var(--text-dark)" }}>
                      Interests (Select all that apply)
                    </label>
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "12px"
                    }}>
                      {interestOptions.map(opt => {
                        const isChecked = interests[opt.key];
                        return (
                          <button
                            type="button"
                            key={opt.key}
                            onClick={() => toggleInterest(opt.key)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "10px 16px",
                              borderRadius: "12px",
                              border: "1px solid",
                              borderColor: isChecked ? "var(--primary)" : "rgba(0,0,0,0.08)",
                              background: isChecked ? "rgba(37, 99, 235, 0.08)" : "rgba(255, 255, 255, 0.5)",
                              color: isChecked ? "var(--primary)" : "var(--text-muted)",
                              fontWeight: 600,
                              fontSize: "0.85rem",
                              cursor: "pointer",
                              transition: "all 0.2s ease"
                            }}
                          >
                            {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="gradient-btn"
                    style={{
                      width: "100%",
                      padding: "16px",
                      fontSize: "1rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <Sparkles size={18} />
                    Start Agentic Trip Compilation
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Explainer */}
            <div className="col-span-4" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="glass-panel" style={{ padding: "24px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShieldCheck style={{ color: "var(--primary)" }} size={20} />
                  Agentic AI System
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  GuideMate compiles your plan through a series of automated sub-agents working in a secure collaborative pipeline:
                </p>
                
                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)" }}>🗺 Planner Agent</h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>Creates custom day-by-day itineraries tailored to your category preferences.</p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)" }}>🤝 Buddy Matcher Agent</h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>Identifies best local companions based on budget, ratings, and language requirements.</p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)" }}>💰 Budget Optimizer Agent</h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>Calculates a safe expenditure allotment, avoiding typical tourist traps.</p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)" }}>🛡 Safety Agent</h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>Performs live safety index assessments and scam advisory checks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Live AI Agent Consultation Simulation Screen */
          <div className="animate-fade-in" style={{
            maxWidth: "700px",
            margin: "40px auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Agentic Collaborative Workspace</h2>
              <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                Four specialized sub-agents are building your profile for <strong>{destination.charAt(0).toUpperCase() + destination.slice(1)}</strong>.
              </p>
            </div>

            {/* Simulated Agent Workspace Console */}
            <div style={{
              background: "#0f172a",
              borderRadius: "20px",
              boxShadow: "0 20px 50px rgba(15, 23, 42, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "24px",
              color: "#38bdf8",
              fontFamily: 'Consolas, Monaco, "Lucida Console", Courier, monospace',
              fontSize: "0.85rem",
              minHeight: "360px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "12px",
                marginBottom: "8px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Terminal size={16} />
                  <span>guidemate_agent_broker_v1.0.sh</span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#eab308" }} />
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }} />
                </div>
              </div>

              {/* Loader indicator if thinking */}
              {currentStepIndex < finalPayload.simulationSteps.length && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#a78bfa" }}>
                  <span style={{
                    width: "12px",
                    height: "12px",
                    border: "2px solid #a78bfa",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "pulse-ring 1s infinite"
                  }} />
                  <span>Agent Broker is dispatching tasks...</span>
                </div>
              )}

              {/* Render simulated outputs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {agentLogs.map((log, index) => (
                  <div key={index} style={{
                    animation: "fadeIn 0.3s ease forwards",
                    borderLeft: `3px solid ${index === 0 ? "#8B4545" : index === 1 ? "#10b981" : index === 2 ? "#a78bfa" : "#ec4899"}`,
                    paddingLeft: "12px"
                  }}>
                    <strong style={{
                      color: index === 0 ? "#0F172A" : index === 1 ? "#10b981" : index === 2 ? "#a78bfa" : "#ec4899",
                      fontSize: "0.9rem",
                      fontWeight: 700
                    }}>
                      [{log.agent}]
                    </strong>
                    <span style={{ color: "#94a3b8", display: "block", fontSize: "0.8rem", marginTop: "2px" }}>
                      Status: {log.status}
                    </span>
                    <p style={{ color: "#f8fafc", marginTop: "4px", fontSize: "0.85rem" }}>
                      &gt; {log.detail}
                    </p>
                  </div>
                ))}
              </div>

              {currentStepIndex === finalPayload.simulationSteps.length && (
                <div style={{
                  marginTop: "auto",
                  padding: "12px",
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  borderRadius: "8px",
                  color: "#4ade80",
                  fontWeight: 700,
                  textAlign: "center",
                  animation: "fadeIn 0.4s ease forwards"
                }}>
                  🎉 All Agents Approved. Finalizing Dashboard Results...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .grid-cols-mobile {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </Layout>
  );
}
