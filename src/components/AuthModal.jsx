import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X, Mail, Lock, User, Shield, LogIn } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, defaultTab = 'login' }) {
  const { login, signup, loginWithGoogle } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(defaultTab); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('traveler'); // 'traveler', 'guide', 'supervisor'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) throw new Error('Please enter your name');
        await signup(email, password, name, role);
      }
      onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(role);
      onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(74, 30, 37, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--color-cream)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '440px',
        border: '1px solid var(--color-border)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'white'
        }}>
          <h3 style={{ margin: 0, color: 'var(--color-maroon)', fontSize: '20px', fontWeight: 700 }}>
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-light)',
              display: 'flex',
              alignItems: 'center',
              padding: 0
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div style={{
              backgroundColor: '#FADBD8',
              color: 'var(--color-maroon)',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px',
              borderLeft: '4px solid var(--color-maroon)'
            }}>
              {error}
            </div>
          )}

          {/* Mode Selector Tab */}
          <div style={{
            display: 'flex',
            backgroundColor: 'rgba(109, 41, 50, 0.05)',
            padding: '4px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'login' ? 'white' : 'transparent',
                color: activeTab === 'login' ? 'var(--color-maroon)' : 'var(--color-text-light)',
                fontWeight: activeTab === 'login' ? 600 : 500,
                boxShadow: activeTab === 'login' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('signup'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'signup' ? 'white' : 'transparent',
                color: activeTab === 'signup' ? 'var(--color-maroon)' : 'var(--color-text-light)',
                fontWeight: activeTab === 'signup' ? 600 : 500,
                boxShadow: activeTab === 'signup' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Sign Up
            </button>
          </div>

          {activeTab === 'signup' && (
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-light)' }} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                />
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-light)' }} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                required
              />
            </div>
            {activeTab === 'login' && (
              <p style={{ fontSize: '11px', color: 'var(--color-text-light)', margin: '4px 0 0 0' }}>
                💡 Tip: Use <strong style={{ color: 'var(--color-maroon)' }}>guide@example.com</strong> or <strong style={{ color: 'var(--color-maroon)' }}>admin@example.com</strong> to mock respective roles automatically.
              </p>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-light)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                required
              />
            </div>
          </div>

          {/* Role Selection for Sign Up & Google Auth */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>
              {activeTab === 'signup' ? 'I want to register as a:' : 'Sign in/Up Role (Google/Mock Auth):'}
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['traveler', 'guide', 'supervisor'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    border: '1px solid',
                    borderColor: role === r ? 'var(--color-maroon)' : 'var(--color-border)',
                    borderRadius: '8px',
                    backgroundColor: role === r ? 'var(--color-maroon)' : 'white',
                    color: role === r ? 'white' : 'var(--color-text)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'var(--color-maroon)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(109, 41, 50, 0.2)',
              opacity: loading ? 0.8 : 1
            }}
          >
            {loading ? 'Please wait...' : activeTab === 'login' ? 'Sign In' : 'Create Account'}
            {!loading && <LogIn size={18} />}
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
            color: 'var(--color-text-light)',
            fontSize: '13px'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
            <span style={{ padding: '0 12px' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
          </div>

          {/* Google Login button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'white',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.6Z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.33-1.58-5.04-3.7H1.02v2.33A9 9 0 0 0 9 18Z" />
              <path fill="#FBBC05" d="M3.96 10.7a5.4 5.4 0 0 1 0-3.4V4.97H1.02a9 9 0 0 0 0 8.06l2.94-2.33Z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.1A9 9 0 0 0 1.02 4.97l2.94 2.33c.7-2.12 2.7-3.7 5.04-3.7Z" />
            </svg>
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
