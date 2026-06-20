import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Users, Globe, Sparkles, Lock, Navigation, Lightbulb, Zap, Shield, Radio } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { login, logout, isAuthenticated, userRole } = useContext(AuthContext);

  const features = [
    {
      icon: <Sparkles size={28} />,
      title: 'AI Trip Planner',
      description: 'Smart itineraries tailored to your interests, budget, and travel style'
    },
    {
      icon: <Users size={28} />,
      title: 'Perfect Guide Match',
      description: 'AI-powered matching based on languages, specializations, and interests'
    },
    {
      icon: <MapPin size={28} />,
      title: 'Hidden Gems',
      description: 'Discover authentic locations unknown to typical tourists'
    },
    {
      icon: <Shield size={28} />,
      title: 'Safety Intelligence',
      description: 'Real-time safety scores and verified guide verification'
    },
    {
      icon: <Zap size={28} />,
      title: 'Dynamic Replanning',
      description: 'Automatic adjustments for weather, closures, and preferences'
    },
    {
      icon: <Radio size={28} />,
      title: 'Multilingual Support',
      description: 'Connect with guides in 30+ languages worldwide'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Travelers' },
    { number: '1K+', label: 'Verified Guides' },
    { number: '50+', label: 'Countries' },
    { number: '4.9★', label: 'Rating' }
  ];

  const steps = [
    {
      number: '1',
      title: 'Plan Your Journey',
      description: 'Tell us your destination, budget, and interests'
    },
    {
      number: '2',
      title: 'Get AI Recommendations',
      description: 'AI finds the perfect guide matches for you'
    },
    {
      number: '3',
      title: 'Connect & Communicate',
      description: 'Chat with guides and customize your itinerary'
    },
    {
      number: '4',
      title: 'Experience the Adventure',
      description: 'Explore with local expertise and safety support'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Travel Like a <span className="highlight">Local</span>
            </h1>
            <p className="hero-subtitle">
              Meet verified local guides, experience authentic adventures, and explore the world like never before. Powered by AI, backed by safety.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/traveler/home')}>
                <MapPin size={20} />
                Find a Guide
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/guide/onboarding')}>
                <Lightbulb size={20} />
                Become a Guide
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-content">
                <div className="hero-icon-group">
                  <div className="hero-mini-card">
                    <Star size={24} style={{ color: 'var(--color-accent)' }} />
                    <p>4.9★ Rating</p>
                  </div>
                  <div className="hero-mini-card">
                    <Users size={24} style={{ color: 'var(--color-primary)' }} />
                    <p>Expert Guides</p>
                  </div>
                </div>
                <div className="hero-preview">
                  <div className="preview-guide-card">
                    <div className="preview-guide-header">
                      <div className="preview-avatar" style={{ background: 'linear-gradient(135deg, #C6A969, #6D2932)' }}></div>
                      <div>
                        <p className="preview-name">Rajesh Kumar</p>
                        <p className="preview-title">Delhi Heritage Expert</p>
                      </div>
                    </div>
                    <div className="preview-guide-stats">
                      <span>📍 Delhi</span>
                      <span>🗣️ English, Hindi</span>
                      <span>⭐ 150+ reviews</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <p className="stat-number">{stat.number}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose GuideMate?</h2>
            <p>Experience travel the way it's meant to be discovered</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Four simple steps to your perfect travel experience</p>
          </div>

          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
                {index < steps.length - 1 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore?</h2>
            <p>Join thousands of travelers discovering authentic experiences</p>
            <button className="btn btn-accent btn-lg" onClick={() => navigate('/traveler/home')}>
              Start Your Journey Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
