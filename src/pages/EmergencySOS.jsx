import { useState } from "react";
import Layout from "../components/Layout";
import travelData from "../data/travelData";
import { AlertCircle, PhoneCall, ShieldAlert, Heart, Landmark, HelpCircle, MapPin, Check } from "lucide-react";

export default function EmergencySOS() {
  const [selectedCity, setSelectedCity] = useState("tokyo");
  const [sosTriggered, setSosTriggered] = useState(false);
  const [gpsMockLocation, setGpsMockLocation] = useState("35.6762° N, 139.6503° E (Tokyo Metro District)");

  const activeCityData = travelData[selectedCity] || travelData["tokyo"];

  // Mock emergency details specific to cities
  const localEmergencyInfo = {
    tokyo: {
      hospitals: [
        { name: "St. Luke's International Hospital", phone: "03-3541-5151", address: "9-1 Akashicho, Chuo City, Tokyo" },
        { name: "Tokyo Metropolitan Hiroo Hospital", phone: "03-3444-1181", address: "2-34-10 Ebisu, Shibuya City, Tokyo" }
      ],
      embassy: { name: "US Embassy Tokyo", phone: "03-3224-5000", address: "1-10-5 Akasaka, Minato City, Tokyo" },
      emergencyBuddy: { name: "Hiroto Sato (GuideMate Emergency Responder)", phone: "+81-90-8877-6655" }
    },
    dubai: {
      hospitals: [
        { name: "Rashid Hospital", phone: "+971-4-219 2000", address: "Oud Metha Road, Dubai" },
        { name: "Dubai Hospital", phone: "+971-4-219 5000", address: "Al Khaleej Road, Deira, Dubai" }
      ],
      embassy: { name: "US Consulate General Dubai", phone: "+971-4-311-6000", address: "Al Seef Street, Bur Dubai" },
      emergencyBuddy: { name: "Zaid Al-Mansoori (GuideMate Emergency Responder)", phone: "+971-50-9988-776" }
    },
    paris: {
      hospitals: [
        { name: "Hôpital Necker-Enfants Malades", phone: "01-44-49-40-00", address: "149 Rue de Sèvres, 75015 Paris" },
        { name: "Hôpital Lariboisière", phone: "01-49-95-65-65", address: "2 Rue Ambroise Paré, 75010 Paris" }
      ],
      embassy: { name: "US Embassy Paris", phone: "01-43-12-22-22", address: "2 Avenue Gabriel, 75008 Paris" },
      emergencyBuddy: { name: "Amelie Laurent (GuideMate Emergency Responder)", phone: "+33-6-1122-3344" }
    },
    hyderabad: {
      hospitals: [
        { name: "Apollo Hospitals Jubilee Hills", phone: "+91-40-2360 7777", address: "Road No 72, Jubilee Hills, Hyderabad" },
        { name: "KIMS Hospitals Secunderabad", phone: "+91-40-4488 5000", address: "Minister Road, Secunderabad" }
      ],
      embassy: { name: "US Consulate General Hyderabad", phone: "+91-40-4033 8300", address: "Paigah Palace, Chiran Fort Club Road, Secunderabad" },
      emergencyBuddy: { name: "Vikram Reddy (GuideMate Emergency Responder)", phone: "+91-99887 76655" }
    },
    singapore: {
      hospitals: [
        { name: "Singapore General Hospital (SGH)", phone: "+65-6222-3322", address: "Outram Road, Singapore 169608" },
        { name: "Raffles Hospital", phone: "+65-6311-1111", address: "585 North Bridge Road, Singapore 188770" }
      ],
      embassy: { name: "US Embassy Singapore", phone: "+65-6476-9100", address: "27 Napier Rd, Singapore 258508" },
      emergencyBuddy: { name: "Chuan Tan (GuideMate Emergency Responder)", phone: "+65-9988-7722" }
    }
  };

  const activeEmergency = localEmergencyInfo[selectedCity] || localEmergencyInfo["tokyo"];

  const handleTriggerSOS = () => {
    // Set GPS coordinates mock
    const coords = {
      tokyo: "35.6762° N, 139.6503° E (Shinjuku District)",
      dubai: "25.2048° N, 55.2708° E (Downtown Burj District)",
      paris: "48.8566° N, 2.3522° E (1st Arrondissement)",
      hyderabad: "17.3850° N, 78.4867° E (Charminar Precinct)",
      singapore: "1.3521° N, 103.8198° E (Marina Bay District)"
    };
    setGpsMockLocation(coords[selectedCity] || coords["tokyo"]);
    setSosTriggered(true);
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
        
        {/* Banner Alert Warning */}
        <div style={{
          background: "rgba(239, 68, 68, 0.08)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          borderRadius: "16px",
          padding: "16px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginBottom: "32px",
          color: "#b91c1c",
          fontSize: "0.9rem"
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>
            <strong>SOS Emergency System:</strong> Use this page only in case of direct safety threats, medical accidents, or lost documents.
          </span>
        </div>

        {/* SOS Grid */}
        <div className="grid-cols-12" style={{ gap: "32px" }}>
          
          {/* LEFT: Giant SOS Trigger Button */}
          <div className="col-span-5" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
            <div className="glass-panel" style={{
              padding: "40px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              textAlign: "center"
            }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Instant SOS Broadcast</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", lineHeight: "1.4" }}>
                Hold the trigger to ping local police, GuideMate support, and your active Buddy with GPS coordinates.
              </p>

              {/* SOS Pulsing Trigger */}
              <button
                onClick={handleTriggerSOS}
                className="sos-pulse-btn"
                style={{
                  background: sosTriggered 
                    ? "radial-gradient(circle, #10b981 0%, #059669 100%)" 
                    : "radial-gradient(circle, #ef4444 0%, #dc2626 100%)"
                }}
              >
                {sosTriggered ? <Check size={48} strokeWidth={3} /> : "SOS"}
              </button>

              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: sosTriggered ? "#10b981" : "#ef4444" }}>
                {sosTriggered ? "EMERGENCY BROADCAST ACTIVE" : "TAP TO TRIGGER ALERT"}
              </span>

              {sosTriggered && (
                <div style={{
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px dashed rgba(16, 185, 129, 0.2)",
                  padding: "16px",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  color: "#065f46",
                  width: "100%",
                  textAlign: "left",
                  marginTop: "10px",
                  animation: "fadeIn 0.4s ease"
                }}>
                  <strong style={{ display: "block", marginBottom: "4px" }}>📡 Signals Dispatched:</strong>
                  <ul style={{ paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <li>Police Broadcast Pinged</li>
                    <li>GPS Mock Coordinate Logged: <br /><strong>{gpsMockLocation}</strong></li>
                    <li>GuideMate Support Operator Dialing In...</li>
                    <li>Emergency Buddy contacted: <strong>{activeEmergency.emergencyBuddy.name}</strong></li>
                  </ul>
                </div>
              )}
            </div>

            {/* City Selector widget */}
            <div className="glass-panel" style={{ padding: "20px", width: "100%" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px" }}>
                Select Current City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSosTriggered(false); // reset SOS state on city change
                }}
                className="input-field"
              >
                {citiesList.map(c => (
                  <option key={c.key} value={c.key}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* RIGHT: Local Emergency Directory details */}
          <div className="col-span-7" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Quick hotlines */}
            <div className="glass-panel" style={{ padding: "32px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldAlert size={20} style={{ color: "#ef4444" }} />
                {activeCityData.name} Emergency Services
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="grid-cols-mobile">
                <a href={`tel:${activeCityData.safety.police}`} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "rgba(239, 68, 68, 0.05)",
                  border: "1px solid rgba(239, 68, 68, 0.15)",
                  padding: "16px",
                  borderRadius: "12px",
                  color: "#ef4444"
                }}>
                  <PhoneCall size={20} />
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>DIAL POLICE</span>
                    <strong style={{ fontSize: "1.1rem" }}>{activeCityData.safety.police.split(" ")[0]}</strong>
                  </div>
                </a>

                <a href={`tel:${activeCityData.safety.ambulance}`} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "rgba(239, 68, 68, 0.05)",
                  border: "1px solid rgba(239, 68, 68, 0.15)",
                  padding: "16px",
                  borderRadius: "12px",
                  color: "#ef4444"
                }}>
                  <PhoneCall size={20} />
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>DIAL AMBULANCE</span>
                    <strong style={{ fontSize: "1.1rem" }}>{activeCityData.safety.ambulance}</strong>
                  </div>
                </a>
              </div>
            </div>

            {/* Emergency Buddy Match */}
            <div className="glass-panel" style={{ padding: "32px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Heart size={20} style={{ color: "var(--secondary)" }} />
                Your Emergency Buddy Contact
              </h3>
              
              <div style={{
                background: "rgba(139, 92, 246, 0.05)",
                border: "1px solid rgba(139, 92, 246, 0.15)",
                padding: "20px",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px"
              }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: "1.1rem" }}>{activeEmergency.emergencyBuddy.name}</h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    GuideMate certified disaster relief & emergency escort responder.
                  </p>
                </div>
                <a href={`tel:${activeEmergency.emergencyBuddy.phone}`} className="gradient-btn" style={{ padding: "10px 20px", fontSize: "0.85rem" }}>
                  <PhoneCall size={14} />
                  Call Buddy
                </a>
              </div>
            </div>

            {/* Embassy Details */}
            <div className="glass-panel" style={{ padding: "32px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Landmark size={20} style={{ color: "var(--primary)" }} />
                Embassy Consulate Location
              </h3>

              <div style={{
                background: "rgba(255, 255, 255, 0.4)",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}>
                <h4 style={{ fontWeight: 700, fontSize: "1.05rem" }}>{activeEmergency.embassy.name}</h4>
                <div style={{ display: "flex", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  <MapPin size={16} style={{ flexShrink: 0 }} />
                  <span>{activeEmergency.embassy.address}</span>
                </div>
                <div style={{ display: "flex", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  <PhoneCall size={16} style={{ flexShrink: 0 }} />
                  <span>Call Support Desk: <strong>{activeEmergency.embassy.phone}</strong></span>
                </div>
              </div>
            </div>

            {/* Nearest Hospitals */}
            <div className="glass-panel" style={{ padding: "32px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <HelpCircle size={20} style={{ color: "#10b981" }} />
                Nearby Tourist-Friendly Hospitals
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {activeEmergency.hospitals.map((hospital, idx) => (
                  <div key={idx} style={{
                    background: "rgba(255, 255, 255, 0.4)",
                    padding: "16px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap"
                  }}>
                    <div>
                      <strong style={{ display: "block", fontSize: "0.9rem", color: "var(--text-dark)" }}>{hospital.name}</strong>
                      <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        📍 {hospital.address}
                      </span>
                    </div>
                    <a href={`tel:${hospital.phone}`} className="btn-secondary" style={{ padding: "8px 14px", fontSize: "0.8rem" }}>
                      <PhoneCall size={12} />
                      {hospital.phone}
                    </a>
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
