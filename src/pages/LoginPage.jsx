import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Shield, MapPin, Compass } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const { loginWithGoogle, isAuthenticated, user } = useContext(AuthContext);
  const [role, setRole] = useState('traveler'); // 'traveler' or 'guide'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'traveler') navigate('/traveler/home');
      else if (user.role === 'guide') navigate('/guide/dashboard');
      else if (user.role === 'supervisor') navigate('/supervisor/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const loggedUser = await loginWithGoogle(role);
      if (loggedUser) {
        if (loggedUser.role === 'traveler') navigate('/traveler/home');
        else if (loggedUser.role === 'guide') navigate('/guide/onboarding');
        else if (loggedUser.role === 'supervisor') navigate('/supervisor/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Google Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        
        {/* Logo and Brand */}
        <div className="login-header">
          <div className="login-logo">
            <Compass className="logo-icon" size={40} />
            <h2>GuideMate</h2>
          </div>
          <p className="login-subtitle">AI-Powered Agentic Travel Companion</p>
        </div>

        {/* Welcome Message */}
        <div className="welcome-section">
          <h3>Welcome Back</h3>
          <p>Sign in to unlock personalized day-wise itineraries, local guide matchmaking, translation chat, and live GPS safety features.</p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}

        {/* Role Selector */}
        <div className="role-selector-group">
          <label className="section-label">Select Your Account Type</label>
          <div className="role-options">
            <button
              onClick={() => setRole('traveler')}
              className={`role-btn ${role === 'traveler' ? 'active' : ''}`}
            >
              <Compass size={18} />
              <span>Traveler</span>
            </button>
            <button
              onClick={() => setRole('guide')}
              className={`role-btn ${role === 'guide' ? 'active' : ''}`}
            >
              <MapPin size={18} />
              <span>Local Guide</span>
            </button>
          </div>
        </div>

        {/* Google Authentication Trigger */}
        <div className="auth-trigger-section">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn btn-primary google-login-btn"
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.79 5.79 0 0 1 8.2 12.79a5.79 5.79 0 0 1 5.79-5.79c2.516 0 4.39 1.13 5.348 2.063l3.243-3.243C20.59 3.86 17.589 2.2 14 2.2a9.79 9.79 0 0 0-9.79 9.79A9.79 9.79 0 0 0 14 21.78c5.44 0 9.79-4.35 9.79-9.79 0-.613-.061-1.22-.18-1.705H12.24Z" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Trust Badges */}
        <div className="login-trust-badges">
          <div className="badge-item">
            <Shield size={14} />
            <span>Secure SSL Encryption</span>
          </div>
          <div className="badge-item">
            <Sparkles size={14} />
            <span>Agentic AI Grounding</span>
          </div>
        </div>

      </div>
    </div>
  );
}
