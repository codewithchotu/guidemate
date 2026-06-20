import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import GuideMap from '../components/GuideMap';
import MatchmakingLoader from '../components/MatchmakingLoader';
import { MapPin, Shield, Sparkles, Clock, DollarSign, Check, Target, Send, Navigation } from 'lucide-react';
import { wsService } from '../services/websocket';
import { generateTripPlan } from '../services/travelPlanner';
import './TravelerHome.css';

// Default coordinates for cities
const cityCoords = {
  'delhi': [28.6139, 77.2090],
  'mumbai': [19.0760, 72.8777],
  'jaipur': [26.9124, 75.7873],
  'hyderabad': [17.3850, 78.4867],
  'bangalore': [12.9716, 77.5946],
  'goa': [15.2993, 74.1240],
  'kolkata': [22.5726, 88.3639],
  'chennai': [13.0827, 80.2707],
  'dubai': [25.2048, 55.2708],
  'singapore': [1.3521, 103.8198],
  'tokyo': [35.6762, 139.6503],
  'paris': [48.8566, 2.3522]
};

// Danger Zones Registry for 12 cities
const dangerZones = {
  'delhi': {
    name: 'Paharganj Crowded Alleyways',
    policeStation: 'Paharganj Police Station',
    lat: 28.6429,
    lng: 77.2150,
    radiusMeters: 500
  },
  'mumbai': {
    name: 'Kamathipura High-Risk Area',
    policeStation: 'Nagpada Police Station',
    lat: 18.9612,
    lng: 72.8267,
    radiusMeters: 500
  },
  'jaipur': {
    name: 'Johari Bazaar Backalleys',
    policeStation: 'Manak Chowk Police Station',
    lat: 26.9196,
    lng: 75.8286,
    radiusMeters: 500
  },
  'hyderabad': {
    name: 'Charminar Congested Corridors',
    policeStation: 'Charminar Police Station',
    lat: 17.3616,
    lng: 78.4747,
    radiusMeters: 500
  },
  'bangalore': {
    name: 'Shivajinagar Market Alleyways',
    policeStation: 'Shivajinagar Police Station',
    lat: 12.9856,
    lng: 77.6044,
    radiusMeters: 500
  },
  'goa': {
    name: 'Anjuna Beach Isolated Headlands',
    policeStation: 'Anjuna Police Station',
    lat: 15.5815,
    lng: 73.7420,
    radiusMeters: 500
  },
  'kolkata': {
    name: 'Sonagachi Congested District',
    policeStation: 'Shyampukur Police Station',
    lat: 22.5888,
    lng: 88.3620,
    radiusMeters: 500
  },
  'chennai': {
    name: 'Kasimedu Outer Docks',
    policeStation: 'Kasimedu Police Station',
    lat: 13.1256,
    lng: 80.2989,
    radiusMeters: 500
  },
  'dubai': {
    name: 'Deira Industrial Backalleys',
    policeStation: 'Naif Police Station',
    lat: 25.2735,
    lng: 55.2995,
    radiusMeters: 500
  },
  'singapore': {
    name: 'Geylang Back alleys',
    policeStation: 'Geylang NPC Station',
    lat: 1.3164,
    lng: 103.8820,
    radiusMeters: 500
  },
  'tokyo': {
    name: 'Kabukicho Backstreets (High Risk)',
    policeStation: 'Shinjuku Police Station',
    lat: 35.6938,
    lng: 139.7034,
    radiusMeters: 500
  },
  'paris': {
    name: 'Pigalle Crime Hotspot Corridor',
    policeStation: '18th Arrondissement Police HQ',
    lat: 48.8825,
    lng: 2.3421,
    radiusMeters: 500
  }
};

// Distance helper (Haversine formula)
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Sound Synthesizers
const playRingSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(480, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 0.6);
    osc2.stop(audioCtx.currentTime + 0.6);
  } catch (e) {
    console.warn("Ring sound error:", e);
  }
};

const playAlarmSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(1000, audioCtx.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    console.warn("Alarm sound error:", e);
  }
};

const speakText = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
};

export default function TravelerHome() {
  const { user } = useContext(AuthContext);
  const { guides, setCurrentBooking } = useContext(AppContext);

  // UI State
  const [activeTab, setActiveTab] = useState('planner'); // 'planner' or 'results'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // AI Planner Form
  const [formData, setFormData] = useState({
    destination: 'Tokyo',
    days: 3,
    budget: 50000,
    interests: ['Culture', 'Photography']
  });

  // Planning Results
  const [planResults, setPlanResults] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);

  // Live Excursion & WebSocket tracking states
  const [activeBooking, setActiveBooking] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [travelerLocation, setTravelerLocation] = useState(null);
  const [customGuideLocation, setCustomGuideLocation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [geoWatchId, setGeoWatchId] = useState(null);

  // Animation & Data synchronization state
  const [pendingResults, setPendingResults] = useState(null); // { type: 'plan' | 'booking', data: object }
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  // GPS Safety Danger Tracker States
  const [safetyCallState, setSafetyCallState] = useState(null); // 'ringing', 'connected', 'dispatched'
  const [safetyTimer, setSafetyTimer] = useState(10);
  const [activeDangerZone, setActiveDangerZone] = useState(null);
  const [dangerAlertTriggered, setDangerAlertTriggered] = useState(false);

  const cities = ['Delhi', 'Mumbai', 'Jaipur', 'Bangalore', 'Hyderabad', 'Goa', 'Kolkata', 'Chennai', 'Dubai', 'Singapore', 'Tokyo', 'Paris'];
  
  const interestOptions = [
    'Culture', 'Food', 'Adventure', 'Photography', 'Historical', 
    'Shopping', 'Nightlife', 'Spiritual', 'Nature', 'Art'
  ];

  // Handle form input changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle interest toggles
  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  // Sync animation completions & loaded payload
  useEffect(() => {
    if (pendingResults && animationComplete) {
      if (pendingResults.type === 'plan') {
        setPlanResults(pendingResults.data);
        setActiveTab('results');
        if (pendingResults.data.guideMatch) {
          setSelectedGuide(pendingResults.data.guideMatch.matchedGuide);
        }
      } else if (pendingResults.type === 'booking') {
        const bk = pendingResults.data;
        setActiveBooking(bk);
        setCurrentBooking(bk); // sync to global AppContext for GuideMateAI
        setShowBookingSuccess(true);
        const guideInfo = guides.find(g => g.id === bk.guideId || g.userId === bk.guideId);
        if (guideInfo) {
          setSelectedGuide(guideInfo);
        }
        setMessages([
          { senderId: 'system', text: `Guide matched! Chat in English, they will receive in Hindi.` }
        ]);
        // Auto-dismiss success banner after 6 seconds
        setTimeout(() => setShowBookingSuccess(false), 6000);
      }
      setPendingResults(null);
      setAnimationComplete(false);
      setLoading(false);
    }
  }, [pendingResults, animationComplete, guides]);

  // Subscribe to live WebSocket tracking channels
  useEffect(() => {
    if (user) {
      const unsubscribeConfirm = wsService.subscribe('match_confirmed', ({ bookingId, booking }) => {
        setPendingResults({ type: 'booking', data: booking });
      });

      const unsubscribeStarted = wsService.subscribe('matching_started', ({ bookingId }) => {
        setBookingId(bookingId);
      });

      const unsubscribeAccept = wsService.subscribe('guide_accepted_request', ({ bookingId, guide }) => {
        // Auto mutual acceptance confirmation
        wsService.respondToMutualAcceptance(bookingId, true, guide.userId);
      });

      const unsubscribeChat = wsService.subscribe('receive_message', ({ message }) => {
        setMessages(prev => [...prev, message]);
      });

      const unsubscribeGuideLoc = wsService.subscribe('guide_location_update', ({ lat, lng }) => {
        setCustomGuideLocation({ lat, lng });
      });

      const unsubscribeFailed = wsService.subscribe('match_failed', ({ reason }) => {
        setError(reason || 'No matching guides available at this time.');
        setLoading(false);
        setAnimationComplete(false);
        setPendingResults(null);
        wsService.disconnect();
      });

      return () => {
        unsubscribeConfirm();
        unsubscribeStarted();
        unsubscribeAccept();
        unsubscribeChat();
        unsubscribeGuideLoc();
        unsubscribeFailed();
      };
    }
  }, [user]);

  // Cleanup geolocation watcher & WebSocket on unmount
  useEffect(() => {
    return () => {
      if (geoWatchId) {
        navigator.geolocation.clearWatch(geoWatchId);
      }
      wsService.disconnect();
    };
  }, [geoWatchId]);

  // Safety Danger Zone Tracker Check
  useEffect(() => {
    if (activeBooking && travelerLocation && !dangerAlertTriggered && !safetyCallState) {
      const cityKey = activeBooking.destination.toLowerCase();
      const zone = dangerZones[cityKey];
      if (zone) {
        const dist = getDistanceMeters(travelerLocation.lat, travelerLocation.lng, zone.lat, zone.lng);
        if (dist <= zone.radiusMeters) {
          setDangerAlertTriggered(true);
          setActiveDangerZone(zone);
          setSafetyCallState('ringing');
          setSafetyTimer(10);
          speakText("Warning: You have entered a high risk area. AI safety tracking initiated.");
        }
      }
    }
  }, [travelerLocation, activeBooking, dangerAlertTriggered, safetyCallState]);

  // Ringing Call countdown
  useEffect(() => {
    let timerId;
    if (safetyCallState === 'ringing') {
      playRingSound();
      timerId = setInterval(() => {
        setSafetyTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            triggerPoliceDispatch();
            return 0;
          }
          playRingSound();
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [safetyCallState]);

  const triggerPoliceDispatch = () => {
    setSafetyCallState('dispatched');
    let count = 0;
    const sirenInterval = setInterval(() => {
      playAlarmSound();
      count++;
      if (count > 6) clearInterval(sirenInterval);
    }, 450);

    const lat = travelerLocation ? travelerLocation.lat : 28.6139;
    const lng = travelerLocation ? travelerLocation.lng : 77.2090;
    
    wsService.triggerSOS(lat, lng);
    speakText("Emergency protocol activated. Automated SMS alert dispatched to police.");
  };

  const simulateEnteringDangerZone = () => {
    const cityKey = formData.destination.toLowerCase();
    const zone = dangerZones[cityKey];
    if (zone) {
      // Pan traveler to the coordinates
      const targetLoc = { lat: zone.lat, lng: zone.lng };
      setTravelerLocation(targetLoc);
      wsService.updateLocation(zone.lat, zone.lng);
      
      // Trigger security hotline call overlay
      setDangerAlertTriggered(true);
      setActiveDangerZone(zone);
      setSafetyCallState('ringing');
      setSafetyTimer(10);
      speakText("Warning: Simulated high risk area entered. GuideMate AI safety call incoming.");
    } else {
      alert("No danger zone found for " + formData.destination);
    }
  };

  // Generate AI Travel Plan
  const handleGeneratePlan = async () => {
    if (!formData.destination || formData.interests.length === 0) {
      setError('Please select destination and at least one interest');
      return;
    }

    setLoading(true);
    setError(null);
    setAnimationComplete(false);

    try {
      // Try the backend server first
      let planData = null;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch('/api/ai/plan-trip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination: formData.destination,
            days: formData.days,
            budget: formData.budget,
            interests: formData.interests
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (response.ok) {
          const data = await response.json();
          planData = data.planning;
        }
      } catch (_serverErr) {
        // Server unavailable — fall through to client-side planner
        console.info('Backend unavailable, using client-side trip planner.');
      }

      // Client-side fallback (always works, no server needed)
      if (!planData) {
        const result = generateTripPlan({
          destination: formData.destination,
          days: formData.days,
          budget: formData.budget,
          interests: formData.interests,
        });
        planData = result.planning;
      }

      setPendingResults({ type: 'plan', data: planData });
    } catch (err) {
      setError('Failed to generate plan: ' + err.message);
      setLoading(false);
    }
  };

  // Initiate real-time matching and browser GPS tracking
  const handleBookGuide = () => {
    if (!user) {
      setError('Please sign in to book a guide');
      return;
    }
    
    setLoading(true); // Trigger loader instantly
    setAnimationComplete(false);
    setDangerAlertTriggered(false);
    setSafetyCallState(null);
    setActiveDangerZone(null);
    
    // Request browser Geolocation access
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setTravelerLocation({ lat, lng });
          startWebSocketMatching(lat, lng);
        },
        (err) => {
          console.warn("Browser GPS permission denied/timed out, using city default:", err.message);
          const fallback = cityCoords[formData.destination.toLowerCase()] || [28.6139, 77.2090];
          setTravelerLocation({ lat: fallback[0], lng: fallback[1] });
          startWebSocketMatching(fallback[0], fallback[1]);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      const fallback = cityCoords[formData.destination.toLowerCase()] || [28.6139, 77.2090];
      setTravelerLocation({ lat: fallback[0], lng: fallback[1] });
      startWebSocketMatching(fallback[0], fallback[1]);
    }
  };

  const startWebSocketMatching = (lat, lng) => {
    // Connect to WebSocket server as traveler with initial coordinates
    wsService.connect(user.uid, 'traveler', lat, lng);
    
    // Watch active GPS movements
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newLat = pos.coords.latitude;
          const newLng = pos.coords.longitude;
          setTravelerLocation({ lat: newLat, lng: newLng });
          wsService.updateLocation(newLat, newLng);
        },
        (err) => console.error('Geolocation watch error:', err),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      setGeoWatchId(watchId);
    }

    // Trigger instant guide matchmaking
    wsService.send('start_match', {
      destination: formData.destination,
      packageType: 'expert',
      language: 'English',
      duration: formData.days,
      groupSize: 1,
      totalPrice: Math.round(formData.budget * 0.1),
      travelerName: user.name || 'Traveler'
    });
  };

  // Complete live excursion
  const handleCompleteExcursion = () => {
    if (geoWatchId) {
      navigator.geolocation.clearWatch(geoWatchId);
      setGeoWatchId(null);
    }
    wsService.disconnect();
    setActiveBooking(null);
    setCurrentBooking(null); // clear from global AppContext
    setBookingId(null);
    setTravelerLocation(null);
    setCustomGuideLocation(null);
    setMessages([]);
    setSafetyCallState(null);
    setActiveDangerZone(null);
    setDangerAlertTriggered(false);
    setShowBookingSuccess(false);
    alert('Excursion completed successfully. Thank you for choosing GuideMate!');
  };

  // Trigger emergency SOS
  const triggerSOS = () => {
    const lat = travelerLocation ? travelerLocation.lat : null;
    const lng = travelerLocation ? travelerLocation.lng : null;
    wsService.triggerSOS(lat, lng);
    alert('🚨 Emergency SOS transmitted to supervisors with your active GPS coordinates.');
  };

  // Send translation chat message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeBooking) return;

    // Send message (under the hood English will be translated to Hindi for the guide)
    wsService.sendMessage(activeBooking.id, activeBooking.guideId, chatInput, 'English');
    
    const newMsg = {
      senderId: user.uid,
      text: chatInput,
      translatedText: chatInput,
      isTranslated: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  // Navigate back to planner
  const handleBackToPlanner = () => {
    setActiveTab('planner');
    setPlanResults(null);
    setSelectedGuide(null);
  };

  return (
    <div className="traveler-home">
      {/* Matchmaking Loader */}
      {loading && <MatchmakingLoader isActive={loading} onComplete={() => setAnimationComplete(true)} />}

      {/* AI Planner Tab */}
      {activeTab === 'planner' && (
        <div className="planner-section">
          <div className="planner-header">
            <div className="header-content">
              <h1><Sparkles size={32} /> AI Trip Planner</h1>
              <p>Let our AI create the perfect personalized travel experience</p>
            </div>
          </div>

          <div className="planner-form">
            {error && <div className="error-alert">{error}</div>}

            {/* Destination Selection */}
            <div className="form-group">
              <label><MapPin size={16} /> Destination</label>
              <select
                value={formData.destination}
                onChange={(e) => handleFormChange('destination', e.target.value)}
                className="form-input select-input"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="form-row">
              <div className="form-group">
                <label><Clock size={16} /> Duration (days)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.days}
                  onChange={(e) => handleFormChange('days', parseInt(e.target.value))}
                  className="form-input"
                />
              </div>

              {/* Budget */}
              <div className="form-group">
                <label><DollarSign size={16} /> Budget (₹)</label>
                <input
                  type="number"
                  min="5000"
                  step="1000"
                  value={formData.budget}
                  onChange={(e) => handleFormChange('budget', parseInt(e.target.value))}
                  className="form-input"
                />
              </div>
            </div>

            {/* Interests */}
            <div className="form-group full-width">
              <label><Target size={16} /> Interests (select at least 1)</label>
              <div className="interests-grid">
                {interestOptions.map(interest => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`interest-chip ${formData.interests.includes(interest) ? 'active' : ''}`}
                  >
                    {interest}
                    {formData.interests.includes(interest) && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleGeneratePlan}
              disabled={loading}
              className="btn btn-primary cta-button"
            >
              {loading ? 'Generating Plan...' : 'Generate My Perfect Trip'}
            </button>
          </div>
        </div>
      )}

      {/* Premium Dashboard Tab */}
      {activeTab === 'results' && planResults && (
        <div className="results-section">
          
          {safetyCallState === 'dispatched' && (
            <div className="police-dispatch-card" style={{
              background: 'linear-gradient(135deg, #FF3B30 0%, #8B0000 100%)',
              color: 'white',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '3px solid #FFF',
              boxShadow: '0 10px 30px rgba(255, 0, 0, 0.3)',
              animation: 'police-flash 1s infinite alternate'
            }}>
              <style>{`
                @keyframes police-flash {
                  0% { box-shadow: 0 0 10px rgba(255,0,0,0.5); border-color: #FFF; }
                  100% { box-shadow: 0 0 35px rgba(255,0,0,0.9); border-color: #FFD700; }
                }
              `}</style>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '40px', animation: 'spin 2s infinite linear' }}>🚨</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    EMERGENCY POLICE DISPATCH PROTOCOL ACTIVATED
                  </h3>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: 1.4, color: '#FEE' }}>
                    GuideMate AI security center detected you entered the high-risk zone <strong>{activeDangerZone?.name || 'Danger Area'}</strong> and were unresponsive to verification calls.
                  </p>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px' }}>
                    <p style={{ margin: '0 0 4px 0' }}><strong>Message Sent to:</strong> {activeDangerZone?.policeStation || 'Nearest Police Station'}</p>
                    <p style={{ margin: '0 0 4px 0' }}><strong>GPS Location:</strong> Latitude {travelerLocation?.lat?.toFixed(5)}, Longitude {travelerLocation?.lng?.toFixed(5)}</p>
                    <p style={{ margin: 0 }}><strong>Alert Details:</strong> "Traveler {user?.name || 'Tourist'} is unresponsive in {activeDangerZone?.name}. Dispatched nearest responder team."</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSafetyCallState(null);
                      setDangerAlertTriggered(false);
                    }}
                    style={{ backgroundColor: 'white', color: '#8B0000', border: 'none', padding: '6px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Close / Clear Emergency Alert
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Excursion Tracking Panel */}
          {activeBooking && (
            <div className="active-mission-card card" style={{
              padding: '24px',
              marginBottom: '32px',
              border: '2px solid var(--color-maroon)',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
            }}>

              {/* ===== Booking Success Banner ===== */}
              {showBookingSuccess && (
                <div style={{
                  background: 'linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%)',
                  border: '1.5px solid #86efac',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  animation: 'bookingSuccessPop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}>
                  <style>{`
                    @keyframes bookingSuccessPop {
                      0% { opacity:0; transform: scale(0.94) translateY(10px); }
                      60% { transform: scale(1.01) translateY(-2px); }
                      100% { opacity:1; transform: scale(1) translateY(0); }
                    }
                    @keyframes successCheckPop {
                      0% { transform: scale(0); }
                      60% { transform: scale(1.2); }
                      100% { transform: scale(1); }
                    }
                  `}</style>
                  <div style={{
                    width: '40px', height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                    animation: 'successCheckPop 0.4s cubic-bezier(0.16,1,0.3,1) 0.1s both',
                  }}>
                    <Check size={20} style={{ color: 'white', strokeWidth: 3 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: '#15803d' }}>
                      Booking Successfully Done!
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#166534', lineHeight: 1.5 }}>
                      🚗 Guide is arriving soon at your pickup spot. Please be ready at your location.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBookingSuccess(false)}
                    style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', padding: '0', flexShrink: 0, fontSize: '16px', lineHeight: 1 }}
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              )}
              {/* ================================== */}

              <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-maroon)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={22} style={{ color: '#27AE60' }} /> Active Guide Excursion Track
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 2fr', gap: '24px' }} className="active-mission-grid">
                
                {/* Details Column */}
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: '#4A1E25' }}>Guide Partner</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '28px' }}>{selectedGuide?.image || '👨‍💼'}</div>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '15px', color: '#2C2C2C' }}>{selectedGuide?.name || 'Local Guide'}</h5>
                      <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>⭐ {selectedGuide?.rating || '4.8'} ({selectedGuide?.reviews || '42'} reviews)</p>
                    </div>
                  </div>
                  
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}><strong>Destination:</strong> {activeBooking.destination}</p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}><strong>Duration:</strong> {activeBooking.duration} Days</p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}><strong>Package Category:</strong> City Expert</p>
                  <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#27AE60', fontWeight: 700 }}><strong>Hourly Rate:</strong> ₹{selectedGuide?.hourlyRate || '600'}/hr</p>
                  
                  {customGuideLocation ? (
                    <div style={{ backgroundColor: 'rgba(39, 174, 96, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '11px', color: '#27AE60', marginBottom: '12px', fontWeight: 600 }}>
                      📡 GPS Linked: Guide approaching in real-time
                    </div>
                  ) : (
                    <div style={{ backgroundColor: 'rgba(243, 156, 18, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '11px', color: '#E67E22', marginBottom: '12px', fontWeight: 600 }}>
                      ⏳ Connecting to Guide GPS feed...
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button 
                      className="btn btn-ghost btn-sm" 
                      style={{ width: '100%' }}
                      onClick={handleCompleteExcursion}
                    >
                      Complete Excursion
                    </button>
                    
                    <button 
                      onClick={simulateEnteringDangerZone}
                      style={{ backgroundColor: '#D35400', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      ⚠️ Simulate Danger Zone
                    </button>

                    <button 
                      onClick={triggerSOS}
                      style={{ backgroundColor: '#C0392B', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      🚨 Trigger SOS
                    </button>
                  </div>
                </div>

                {/* Map View */}
                <div style={{ height: '260px', position: 'relative' }}>
                  <GuideMap 
                    guides={[]} 
                    city={activeBooking.destination} 
                    travelerLocation={travelerLocation}
                    customGuideLocation={customGuideLocation}
                  />
                </div>

                {/* Chat Column */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '260px', border: '1px solid var(--color-maroon)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px', backgroundColor: 'var(--color-maroon)', color: 'white', fontSize: '12px', fontWeight: 600 }}>
                    AI Translator Chat: You (English) ↔ Guide (Hindi)
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
                          maxWidth: '85%',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}
                      >
                        {/* Render original messages */}
                        <div>{m.text}</div>
                        {m.isTranslated && (
                          <div style={{ fontSize: '9px', color: m.senderId === user.uid ? 'rgba(255,255,255,0.7)' : '#888', marginTop: '2px', fontStyle: 'italic' }}>
                            Original: "{m.translatedText}" (Translated by AI)
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendMessage} style={{ display: 'flex', borderTop: '1px solid var(--color-border)' }}>
                    <input
                      type="text"
                      placeholder="Type message in English..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      style={{ flex: 1, padding: '8px 12px', border: 'none', outline: 'none', fontSize: '12px' }}
                    />
                    <button type="submit" style={{ backgroundColor: 'var(--color-maroon)', color: 'white', border: 'none', padding: '0 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Send size={14} />
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}

          <button onClick={handleBackToPlanner} className="btn-back">← Back to Planner</button>

          <div className="dashboard-grid">
            {/* Left Panel: Itinerary & Map */}
            <div className="dashboard-left">
              {/* Itinerary */}
              <div className="dashboard-card itinerary-card">
                <h2>Your {formData.days}-Day Itinerary</h2>
                <div className="itinerary-timeline">
                  {planResults.itinerary.itinerary.map((day, idx) => (
                    <div key={idx} className="timeline-day">
                      <div className="timeline-marker">
                        <div className="timeline-day-number">Day {day.day}</div>
                      </div>
                      <div className="timeline-content">
                        <h4>{day.theme || `Day ${day.day}`}</h4>
                        <div className="day-attractions">
                          {day.attractions && day.attractions.map((attr, i) => (
                            <div key={i} className="attraction">
                              <span className="attr-time">{attr.time}</span>
                              <span className="attr-name">{attr.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map with POIs */}
              <div className="dashboard-card map-card">
                <h3>Interactive Map</h3>
                <div className="map-container">
                  <GuideMap
                    guides={guides.filter(g => g.location === formData.destination)}
                    onSelectGuide={setSelectedGuide}
                    city={formData.destination}
                    poiMarkers={planResults.mapData.pois}
                    travelerLocation={travelerLocation}
                    customGuideLocation={customGuideLocation}
                  />
                </div>
              </div>
            </div>

            {/* Right Panel: Stats & Guide */}
            <div className="dashboard-right">
              {/* Safety Score */}
              <div className="dashboard-card stat-card">
                <div className="stat-header">
                  <Shield size={24} />
                  <h3>Safety Score</h3>
                </div>
                <div className="safety-score">
                  <div className="score-circle">
                    <span className="score-number">
                      {Math.round(planResults.safety.overallSafetyScore)}
                    </span>
                    <span className="score-label">/ 100</span>
                  </div>
                  <div className="score-details">
                    {planResults.safety.recommendations.map((rec, i) => (
                      <div key={i} className="rec-item">
                        <Check size={14} />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Budget Breakdown */}
              <div className="dashboard-card budget-card">
                <h3>Budget Breakdown</h3>
                <div className="budget-items">
                  {Object.entries(planResults.budget.breakdown).map(([key, item]) => (
                    <div key={key} className="budget-item">
                      <div className="budget-label">
                        <span>{item.category}</span>
                        <span className="budget-percentage">{item.percentage}%</span>
                      </div>
                      <div className="budget-bar">
                        <div
                          className="budget-fill"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <div className="budget-amount">₹{item.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div className="budget-total">
                  <strong>Total Budget:</strong>
                  <span>₹{planResults.budget.totalBudget.toLocaleString()}</span>
                </div>
              </div>

              {/* Guide Match Card */}
              {planResults.guideMatch && (
                <div className="dashboard-card guide-match-card">
                  <div className="match-score-badge">
                    {Math.round(planResults.guideMatch.matchScore)}% Match
                  </div>
                  <div className="guide-info">
                    <div className="guide-avatar">{planResults.guideMatch.matchedGuide.image}</div>
                    <div className="guide-details">
                      <h3>{planResults.guideMatch.matchedGuide.name}</h3>
                      <p className="guide-location">📍 {planResults.guideMatch.matchedGuide.location}</p>
                      <div className="guide-rating">
                        <span className="stars">⭐ {planResults.guideMatch.matchedGuide.rating}</span>
                        <span className="reviews">({planResults.guideMatch.matchedGuide.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="match-reason">
                    <h4>Why This Guide?</h4>
                    <p>{planResults.guideMatch.matchReason}</p>
                  </div>
                  <div className="guide-specializations">
                    {planResults.guideMatch.matchedGuide.specializations.map(spec => (
                      <span key={spec} className="spec-badge">{spec}</span>
                    ))}
                  </div>
                  <button 
                    className="btn btn-primary btn-block"
                    onClick={handleBookGuide}
                    disabled={!!activeBooking}
                  >
                    {activeBooking ? 'Booking Confirmed ✓' : 'Book This Guide'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Security Center Call Overlay */}
      {safetyCallState && safetyCallState !== 'dispatched' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Inter, sans-serif'
        }}>
          {safetyCallState === 'ringing' ? (
            <div style={{ textAlign: 'center', padding: '20px', maxWidth: '450px' }}>
              {/* Pulsing Red Dot/Icon */}
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 30px auto',
                animation: 'pulse 1.5s infinite'
              }}>
                <style>{`
                  @keyframes pulse {
                    0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(231, 76, 60, 0); }
                    100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
                  }
                `}</style>
                <div style={{ fontSize: '48px' }}>📞</div>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', letterSpacing: '1px', color: '#E74C3C' }}>
                SECURITY HOTLINE INCOMING
              </h2>
              <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 24px 0', color: '#FFF' }}>
                GuideMate AI Safety Center
              </h3>
              
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(231, 76, 60, 0.3)',
                marginBottom: '40px',
                fontSize: '14px',
                lineHeight: 1.5
              }}>
                <strong>Danger Zone Detected:</strong> {activeDangerZone?.name}<br/>
                Coordinates: {travelerLocation?.lat?.toFixed(5)}, {travelerLocation?.lng?.toFixed(5)}
              </div>

              <p style={{ fontSize: '16px', color: '#AAA', marginBottom: '30px' }}>
                Auto-dispatching police in <strong style={{ color: '#E74C3C', fontSize: '22px' }}>{safetyTimer}</strong> seconds if unanswered...
              </p>

              <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
                {/* Accept Call */}
                <button
                  onClick={() => {
                    setSafetyCallState('connected');
                    speakText("Hello. GuideMate safety center verification call. Please state your status by clicking one of the buttons.");
                  }}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundColor: '#2ECC71',
                    border: 'none',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)'
                  }}
                  title="Answer Call"
                >
                  🟢
                </button>
                
                {/* Decline Call (triggers dispatch instantly) */}
                <button
                  onClick={triggerPoliceDispatch}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundColor: '#E74C3C',
                    border: 'none',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(231, 76, 60, 0.4)'
                  }}
                  title="Decline & SOS"
                >
                  🔴
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', maxWidth: '450px' }}>
              {/* Call in progress waves */}
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '30px', height: '60px', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div 
                    key={i} 
                    style={{
                      width: '6px',
                      height: '40px',
                      backgroundColor: '#2ECC71',
                      borderRadius: '3px',
                      animation: `wave 1.2s infinite ease-in-out alternate`,
                      animationDelay: `${i * 0.15}s`
                    }} 
                  />
                ))}
                <style>{`
                  @keyframes wave {
                    0% { height: 10px; }
                    100% { height: 50px; }
                  }
                `}</style>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#2ECC71' }}>
                CALL CONNECTED
              </h2>
              <p style={{ fontSize: '14px', color: '#888', margin: '0 0 30px 0' }}>
                AI Voice Agent Assistant Active
              </p>

              <div style={{
                background: 'rgba(46, 204, 113, 0.05)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(46, 204, 113, 0.2)',
                marginBottom: '40px',
                fontSize: '15px',
                lineHeight: 1.5,
                color: '#EEE'
              }}>
                "Hello, I am the GuideMate AI Safety Companion. Our GPS tracker notes you entered <strong>{activeDangerZone?.name}</strong>. Please confirm your status immediately."
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button
                  onClick={() => {
                    setSafetyCallState(null);
                    setDangerAlertTriggered(false);
                    speakText("Thank you. Safety confirmed. Excursion monitoring resumed.");
                  }}
                  style={{
                    backgroundColor: '#2ECC71',
                    color: 'white',
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(46, 204, 113, 0.3)'
                  }}
                >
                  🟢 Yes, I am Safe
                </button>
                <button
                  onClick={triggerPoliceDispatch}
                  style={{
                    backgroundColor: '#E74C3C',
                    color: 'white',
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(231, 76, 60, 0.3)'
                  }}
                >
                  🚨 No, I need HELP!
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
