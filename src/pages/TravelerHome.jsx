import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import GuideMap from '../components/GuideMap';
import MatchmakingLoader from '../components/MatchmakingLoader';
import { MapPin, Shield, Sparkles, Clock, DollarSign, Check, Target } from 'lucide-react';
import './TravelerHome.css';

export default function TravelerHome() {
  const { user } = useContext(AuthContext);
  const { guides } = useContext(AppContext);

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

  // Generate AI Travel Plan
  const handleGeneratePlan = async () => {
    if (!formData.destination || formData.interests.length === 0) {
      setError('Please select destination and at least one interest');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: formData.destination,
          days: formData.days,
          budget: formData.budget,
          interests: formData.interests
        })
      });

      if (!response.ok) throw new Error('Failed to generate plan');
      
      const data = await response.json();
      setPlanResults(data.planning);
      setActiveTab('results');
      
      // Auto-select the best matched guide
      if (data.planning.guideMatch) {
        setSelectedGuide(data.planning.guideMatch.matchedGuide);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      {loading && <MatchmakingLoader isActive={loading} onComplete={() => {}} />}

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
                  <button className="btn btn-primary btn-block">Book This Guide</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
