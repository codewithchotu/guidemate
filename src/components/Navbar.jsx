import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { Bell, ChevronDown, User, BookOpen, Settings, LogOut, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Features', href: '/features' },
    { label: 'Contact', href: '/contact' }
  ];

  const handleDashboardClick = () => {
    if (!user) return;
    if (user.role === 'traveler') navigate('/traveler/home');
    else if (user.role === 'guide') navigate('/guide/dashboard');
    else if (user.role === 'supervisor') navigate('/supervisor/dashboard');
  };

  const getFirstName = (name) => {
    if (!name) return 'User';
    return name.split(' ')[0];
  };

  return (
    <nav className="navbar" style={{
      position: 'sticky',
      top: 0,
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #EAEAEA',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      zIndex: 999
    }}>
      <div className="navbar-container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        
        {/* Left Side: Logo */}
        <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <span className="logo-text" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '24px',
            fontWeight: 800,
            color: 'var(--color-maroon)',
            letterSpacing: '-0.5px'
          }}>GuideMate</span>
        </div>

        {/* Center: Menu Items */}
        <div className="navbar-menu" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {navItems.map((item) => (
            <span
              key={item.href}
              onClick={() => { navigate(item.href); setMobileMenuOpen(false); }}
              className="navbar-link"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#444444',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              {item.label}
            </span>
          ))}

          {/* Become a Guide button in navbar menu */}
          {(!isAuthenticated || user?.role !== 'guide') && (
            <span
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/guide/onboarding');
                } else {
                  setAuthModalTab('signup');
                  setAuthModalOpen(true);
                }
              }}
              className="navbar-link"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-accent)',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              Become a Guide
            </span>
          )}

          {isAuthenticated && (
            <span
              onClick={handleDashboardClick}
              className="navbar-link"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-maroon)',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              Dashboard
            </span>
          )}
        </div>

        {/* Right Side: Notifications & Avatar Dropdown */}
        <div className="navbar-cta" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              
              {/* Notification Bell */}
              <button style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#666666',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s'
              }} className="hover-opacity">
                <Bell size={20} />
              </button>

              {/* User Dropdown Trigger */}
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    transition: 'background-color 0.2s',
                    backgroundColor: dropdownOpen ? '#F5F5F5' : 'transparent'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-maroon)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                  }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#2C2C2C'
                  }}>
                    {getFirstName(user.name)}
                  </span>
                  <ChevronDown size={14} style={{
                    transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                    color: '#666'
                  }} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '40px',
                    right: 0,
                    width: '180px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAEAEA',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    padding: '8px 0',
                    zIndex: 1000,
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    <button
                      onClick={() => { handleDashboardClick(); setDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        border: 'none',
                        background: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px',
                        fontFamily: "'Inter', sans-serif",
                        color: '#444444'
                      }}
                      className="dropdown-item"
                    >
                      <User size={16} /> My Profile
                    </button>
                    <button
                      onClick={() => { navigate('/traveler/home'); setDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        border: 'none',
                        background: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px',
                        fontFamily: "'Inter', sans-serif",
                        color: '#444444'
                      }}
                      className="dropdown-item"
                    >
                      <BookOpen size={16} /> My Bookings
                    </button>
                    <button
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        border: 'none',
                        background: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px',
                        fontFamily: "'Inter', sans-serif",
                        color: '#444444'
                      }}
                      className="dropdown-item"
                    >
                      <Settings size={16} /> Settings
                    </button>
                    <div style={{ height: '1px', backgroundColor: '#EAEAEA', margin: '4px 0' }} />
                    <button
                      onClick={() => { logout(); navigate('/'); setDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        border: 'none',
                        background: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px',
                        fontFamily: "'Inter', sans-serif",
                        color: 'var(--color-maroon)',
                        fontWeight: 600
                      }}
                      className="dropdown-item"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => { setAuthModalTab('login'); setAuthModalOpen(true); }}
                style={{ fontSize: '13px', fontWeight: 600 }}
              >
                Sign In
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => { setAuthModalTab('signup'); setAuthModalOpen(true); }}
                style={{ fontSize: '13px', fontWeight: 600 }}
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu" style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #EAEAEA',
          padding: '12px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {navItems.map((item) => (
            <span
              key={item.href}
              onClick={() => { navigate(item.href); setMobileMenuOpen(false); }}
              className="navbar-mobile-link"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#444444',
                padding: '8px 0',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </span>
          ))}
          {(!isAuthenticated || user?.role !== 'guide') && (
            <span
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAuthenticated) {
                  navigate('/guide/onboarding');
                } else {
                  setAuthModalTab('signup');
                  setAuthModalOpen(true);
                }
              }}
              className="navbar-mobile-link"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-accent)',
                padding: '8px 0',
                cursor: 'pointer'
              }}
            >
              Become a Guide
            </span>
          )}
          {isAuthenticated && (
            <span
              onClick={() => { handleDashboardClick(); setMobileMenuOpen(false); }}
              className="navbar-mobile-link"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-maroon)',
                padding: '8px 0',
                cursor: 'pointer'
              }}
            >
              Dashboard
            </span>
          )}
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
        onAuthSuccess={() => {
          const savedRole = localStorage.getItem('userRole');
          if (savedRole === 'traveler') navigate('/traveler/home');
          else if (savedRole === 'guide') navigate('/guide/dashboard');
          else if (savedRole === 'supervisor') navigate('/supervisor/dashboard');
        }}
      />
    </nav>
  );
}