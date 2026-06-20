import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { wsService } from '../services/websocket';
import WeatherWidget from '../components/WeatherWidget';
import GuideMap from '../components/GuideMap';
import { Sparkles, Power, Award, TrendingUp, CheckCircle, Clock, Percent, Shield, Send, AlertOctagon } from 'lucide-react';

export default function GuideDashboard() {
  const { user } = useContext(AuthContext);
  
  // Dashboard Metrics State
  const [metrics, setMetrics] = useState({
    today: 0,
    weekly: 0,
    monthly: 0,
    tripsCompleted: 0,
    hoursWorked: 0,
    acceptanceRate: 100,
    cancellationRate: 0,
    trustScore: 98,
    ratings: 4.9,
    topDestinations: []
  });

  // Online / Offline Status (similar to Uber Driver mode)
  const [online, setOnline] = useState(false);
  const [matchingRequest, setMatchingRequest] = useState(null);
  const [countdown, setCountdown] = useState(15);
  const [activeBooking, setActiveBooking] = useState(null);
  const [travelerLocation, setTravelerLocation] = useState(null);
  
  // Chat States
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  
  // Weather
  const [city, setCity] = useState('Delhi');

  // Load metrics from backend
  useEffect(() => {
    if (user) {
      fetch(`/api/guide/${user.uid}/metrics`)
        .then(res => res.json())
        .then(data => setMetrics(data))
        .catch(err => console.error('Failed to load metrics:', err));
    }
  }, [user]);

  // Connect WebSocket when online
  useEffect(() => {
    if (user && online) {
      // Connect as guide with Delhi starting position
      wsService.connect(user.uid, 'guide', 28.6139, 77.2090);

      // Listen for incoming matching requests
      const unsubscribeRequest = wsService.subscribe('incoming_match_request', (request) => {
        setMatchingRequest(request);
        setCountdown(15);
      });

      const unsubscribeTimeout = wsService.subscribe('match_request_timeout', () => {
        setMatchingRequest(null);
      });

      const unsubscribeConfirm = wsService.subscribe('match_confirmed', ({ bookingId, booking }) => {
        setMatchingRequest(null);
        setActiveBooking(booking);
        setMessages([
          { senderId: 'system', text: `Trip confirmed with traveler! Use the translator companion to chat.` }
        ]);
      });

      const unsubscribeChat = wsService.subscribe('receive_message', ({ message }) => {
        setMessages(prev => [...prev, message]);
      });

      // Geolocation watch for guide reporting to traveler
      let watchId = null;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            wsService.updateLocation(pos.coords.latitude, pos.coords.longitude);
          },
          (err) => console.log('Geolocation initial error:', err)
        );

        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            wsService.updateLocation(pos.coords.latitude, pos.coords.longitude);
          },
          (err) => console.log('Geolocation watch error:', err),
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      }

      // Listen for traveler location updates
      const unsubscribeTravelerLoc = wsService.subscribe('traveler_location_update', ({ lat, lng }) => {
        console.log('Received traveler location update:', lat, lng);
        setTravelerLocation({ lat, lng });
      });

      return () => {
        unsubscribeRequest();
        unsubscribeTimeout();
        unsubscribeConfirm();
        unsubscribeChat();
        unsubscribeTravelerLoc();
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
        }
        wsService.disconnect();
      };
    }
  }, [user, online]);

  // Countdown timer for matching requests
  useEffect(() => {
    if (!matchingRequest) return;
    if (countdown <= 0) {
      setMatchingRequest(null);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [matchingRequest, countdown]);

  const handleOnlineToggle = () => {
    const newStatus = !online;
    setOnline(newStatus);
    if (!newStatus) {
      wsService.disconnect();
      setMatchingRequest(null);
      setActiveBooking(null);
    }
  };

  const handleAcceptRequest = () => {
    if (matchingRequest) {
      wsService.respondToMatchRequest(matchingRequest.bookingId, true);
    }
  };

  const handleRejectRequest = () => {
    if (matchingRequest) {
      wsService.respondToMatchRequest(matchingRequest.bookingId, false);
      setMatchingRequest(null);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeBooking) return;

    // Simulate Guide speaks Hindi (AI Translator companion converts it for Traveler)
    wsService.sendMessage(activeBooking.id, activeBooking.travelerId, chatInput, 'Hindi');
    setChatInput('');
  };

  const triggerSOS = () => {
    wsService.triggerSOS();
    alert('🚨 Emergency SOS transmitted to supervisors.');
  };

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        
        {/* Header Row with Online/Offline Toggle */}
        <div className="flex-between" style={{ marginBottom: '32px' }}>
          <div>
            <h1 style={{ color: 'var(--color-maroon)', margin: '0 0 4px 0' }}>💼 Guide Dashboard</h1>
            <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
              Welcome back, <strong style={{ color: 'var(--color-maroon)' }}>{user?.name || 'Partner'}</strong>!
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleOnlineToggle}
              style={{
                backgroundColor: online ? '#27AE60' : '#E74C3C',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: online ? '0 4px 12px rgba(39, 174, 96, 0.2)' : '0 4px 12px rgba(231, 76, 60, 0.2)',
                transition: 'all 0.2s'
              }}
            >
              <Power size={18} />
              {online ? '🟢 ONLINE' : '🔴 OFFLINE'}
            </button>

            <button 
              onClick={triggerSOS}
              style={{ backgroundColor: '#C0392B', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              <AlertOctagon size={18} /> SOS
            </button>
          </div>
        </div>

        {/* Live Trip Active */}
        {activeBooking && (
          <div className="card" style={{ padding: '24px', marginBottom: '32px', border: '2px solid var(--color-maroon)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-maroon)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={22} /> Active Guide Mission
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 2fr', gap: '24px' }}>
              <div>
                <p style={{ margin: '0 0 8px 0' }}><strong>Destination:</strong> {activeBooking.destination}</p>
                <p style={{ margin: '0 0 8px 0' }}><strong>Duration:</strong> {activeBooking.duration} Days</p>
                <p style={{ margin: '0 0 8px 0' }}><strong>Group Size:</strong> {activeBooking.groupSize} Traveler(s)</p>
                <p style={{ margin: '0 0 12px 0', color: '#27AE60', fontWeight: 700 }}><strong>Expected Earnings:</strong> ₹{Math.round(activeBooking.totalPrice * 0.85).toLocaleString()}</p>
                
                {travelerLocation ? (
                  <div style={{ backgroundColor: 'rgba(39, 174, 96, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '11px', color: '#27AE60', marginBottom: '12px', fontWeight: 600 }}>
                    📡 GPS Linked: Live tracking traveler in real-time
                  </div>
                ) : (
                  <div style={{ backgroundColor: 'rgba(243, 156, 18, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '11px', color: '#E67E22', marginBottom: '12px', fontWeight: 600 }}>
                    ⏳ Awaiting traveler browser GPS stream...
                  </div>
                )}

                <button 
                  className="btn btn-ghost btn-sm" 
                  style={{ marginTop: '4px', width: '100%' }}
                  onClick={() => { setActiveBooking(null); setMessages([]); setTravelerLocation(null); }}
                >
                  Complete Excursion
                </button>
              </div>

              {/* Live tracking map column */}
              <div style={{ height: '240px', position: 'relative' }}>
                <GuideMap 
                  guides={[]} 
                  city={activeBooking.destination} 
                  travelerLocation={travelerLocation} 
                />
              </div>

              {/* Chat translation module */}
              <div style={{ display: 'flex', flexDirection: 'column', height: '240px', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--color-maroon)', color: 'white', fontSize: '12px', fontWeight: 600 }}>
                  AI Translator Chat: Traveler (English) ↔ You (Hindi)
                </div>
                <div style={{ flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#FAF7F2' }}>
                  {messages.map((m, idx) => (
                    <div 
                      key={idx}
                      style={{
                        alignSelf: m.senderId === user.uid ? 'flex-end' : m.senderId === 'system' ? 'center' : 'flex-start',
                        backgroundColor: m.senderId === user.uid ? 'var(--color-maroon)' : m.senderId === 'system' ? '#e5e5e5' : 'white',
                        color: m.senderId === user.uid ? 'white' : 'var(--color-text)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        maxWidth: '85%'
                      }}
                    >
                      {/* Show translated text to guide */}
                      <div>{m.senderId === user.uid ? m.text : m.translatedText}</div>
                      {m.isTranslated && (
                        <div style={{ fontSize: '9px', color: m.senderId === user.uid ? 'rgba(255,255,255,0.7)' : '#888', marginTop: '2px', fontStyle: 'italic' }}>
                          Translated by GuideMate AI
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', borderTop: '1px solid var(--color-border)' }}>
                  <input
                    type="text"
                    placeholder="Type message in Hindi (e.g. मैं आ रहा हूँ)..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', border: 'none', outline: 'none', fontSize: '12px' }}
                  />
                  <button type="submit" style={{ backgroundColor: 'var(--color-maroon)', color: 'white', border: 'none', padding: '0 16px', cursor: 'pointer' }}>
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Analytics grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '32px' }}>
          
          {/* Sidebar */}
          <div>
            <div style={{ marginBottom: '32px' }}>
              <WeatherWidget city={city} />
            </div>

            {/* Profile trust stats */}
            <div className="card" style={{ padding: '20px', backgroundColor: 'white' }}>
              <h4 style={{ margin: '0 0 16px 0', color: 'var(--color-maroon)' }}>Trust & Rating Profile</h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div className="flex-between">
                  <span style={{ fontSize: '13px' }}>Trust Score:</span>
                  <span className="badge" style={{ backgroundColor: '#27AE60', color: 'white' }}>
                    {metrics.trustScore} Elite
                  </span>
                </div>
                <div className="flex-between">
                  <span style={{ fontSize: '13px' }}>Customer Rating:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-gold)' }}>⭐ {metrics.ratings}</span>
                </div>
                <div className="flex-between">
                  <span style={{ fontSize: '13px' }}>Response Time:</span>
                  <span style={{ fontWeight: 600 }}>&lt; 5 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Analytics dashboard */}
          <div>
            
            {/* Numeric Indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
              <div className="card-flat" style={{ textAlign: 'center', padding: '20px', borderTop: '4px solid var(--color-maroon)' }}>
                <h5 style={{ margin: '0 0 6px 0', color: 'var(--color-text-light)' }}>Today's Earnings</h5>
                <h3 style={{ margin: 0, color: 'var(--color-maroon)' }}>₹{metrics.today}</h3>
              </div>
              <div className="card-flat" style={{ textAlign: 'center', padding: '20px', borderTop: '4px solid var(--color-gold)' }}>
                <h5 style={{ margin: '0 0 6px 0', color: 'var(--color-text-light)' }}>Weekly Earnings</h5>
                <h3 style={{ margin: 0, color: 'var(--color-maroon)' }}>₹{metrics.weekly}</h3>
              </div>
              <div className="card-flat" style={{ textAlign: 'center', padding: '20px', borderTop: '4px solid var(--color-accent)' }}>
                <h5 style={{ margin: '0 0 6px 0', color: 'var(--color-text-light)' }}>Completed Excursions</h5>
                <h3 style={{ margin: 0 }}>{metrics.tripsCompleted}</h3>
              </div>
            </div>

            {/* Gig Performance Graph & details */}
            <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--color-maroon)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={22} /> Weekly Earnings Stream (INR)
              </h3>
              
              {/* Custom SVG Bar Graph */}
              <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '10px', paddingTop: '20px', borderBottom: '1px solid var(--color-border)', marginBottom: '16px' }}>
                {[
                  { day: 'Mon', amount: 1200 },
                  { day: 'Tue', amount: 2400 },
                  { day: 'Wed', amount: 1800 },
                  { day: 'Thu', amount: 3000 },
                  { day: 'Fri', amount: 2500 },
                  { day: 'Sat', amount: 4200 },
                  { day: 'Sun', amount: 1700 }
                ].map((item, idx) => {
                  const height = `${(item.amount / 5000) * 100}%`;
                  return (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-maroon)', fontWeight: 600, marginBottom: '4px' }}>₹{item.amount}</span>
                      <div style={{ width: '100%', height, backgroundColor: 'var(--color-maroon)', borderRadius: '4px 4px 0 0', minHeight: '10px' }} />
                      <span style={{ fontSize: '11px', color: 'var(--color-text-light)', marginTop: '8px' }}>{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gig Economy stats list */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ margin: '0 0 16px 0', color: 'var(--color-maroon)' }}>Efficiency Logs</h4>
                <div style={{ display: 'grid', gap: '12px', fontSize: '13px' }}>
                  <div className="flex-between">
                    <span>Acceptance Rate:</span>
                    <span>{metrics.acceptanceRate}%</span>
                  </div>
                  <div className="flex-between">
                    <span>Cancellation Rate:</span>
                    <span>{metrics.cancellationRate}%</span>
                  </div>
                  <div className="flex-between">
                    <span>Active Working Hours:</span>
                    <span>{metrics.hoursWorked} hrs</span>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ margin: '0 0 16px 0', color: 'var(--color-maroon)' }}>Favorite Excursion Destinations</h4>
                <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8' }}>
                  <li>Red Fort, Old Delhi</li>
                  <li>Sunder Nursery Gardens</li>
                  <li>Chandni Chowk Market tour</li>
                </ol>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Rapido Matching Incoming Request Dialog */}
      {matchingRequest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(74, 30, 37, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--color-cream)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '440px',
            border: '1px solid var(--color-border)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            padding: '32px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: 'var(--color-maroon)', marginBottom: '8px' }}>⚡ Incoming Match Request</h3>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-gold)', marginBottom: '24px' }}>
              Expires in: {countdown}s
            </div>

            <div style={{ textAlign: 'left', backgroundColor: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '24px', fontSize: '14px' }}>
              <p style={{ margin: '0 0 8px 0' }}><strong>Traveler:</strong> {matchingRequest.travelerName}</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>Destination:</strong> {matchingRequest.destination}</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>Duration:</strong> {matchingRequest.duration} Days</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>Package Tier:</strong> {matchingRequest.packageType.toUpperCase()}</p>
              <p style={{ margin: 0, color: '#27AE60', fontWeight: 600 }}><strong>Expected Earnings:</strong> ₹{matchingRequest.expectedEarnings.toLocaleString()}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleRejectRequest} className="btn btn-ghost" style={{ flex: 1 }}>
                Reject
              </button>
              <button onClick={handleAcceptRequest} className="btn btn-primary" style={{ flex: 1 }}>
                Accept Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
