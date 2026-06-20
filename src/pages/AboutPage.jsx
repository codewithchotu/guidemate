import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Users, Shield, Zap, Sparkles, MapPin, DollarSign, Award } from 'lucide-react';
import './AboutPage.css';

export default function AboutPage() {
  const navigate = useNavigate();

  const advantages = [
    {
      icon: <Sparkles size={24} style={{ color: 'var(--color-accent)' }} />,
      title: 'Collaborative AI Planning',
      description: 'Generates weather-aware, budget-tracked custom itineraries dynamically.'
    },
    {
      icon: <Shield size={24} style={{ color: 'var(--color-maroon)' }} />,
      title: 'Identity & BG Verified',
      description: 'Every partner guide completes local identity tests and background audits.'
    },
    {
      icon: <Zap size={24} style={{ color: 'var(--color-maroon)' }} />,
      title: 'Instant Rapido Matching',
      description: 'One click pairs you with nearby online local guides in under 15 seconds.'
    },
    {
      icon: <Award size={24} style={{ color: 'var(--color-accent)' }} />,
      title: 'SaaS Trust System',
      description: 'Transparent 0-100 rating badges for travelers and guides for ultimate reliability.'
    }
  ];

  return (
    <div className="about-page" style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Hero Section */}
      <section style={{
        padding: '80px 20px',
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
        borderBottom: '1px solid #EAEAEA'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 700, display: 'block', marginBottom: '12px' }}>
            Our Journey
          </span>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '44px',
            fontWeight: 800,
            color: 'var(--color-maroon)',
            margin: '0 0 16px 0',
            lineHeight: 1.2
          }}>
            Connecting Travelers with Local Experts
          </h1>
          <p style={{ margin: 0, color: '#666666', fontSize: '18px', lineHeight: '1.6' }}>
            We combine collaborative AI agents with trusted local guide networks to deliver personalized, safe, and authentic travel experiences worldwide.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-maroon)', fontSize: '32px', fontWeight: 800, margin: '0 0 20px 0' }}>
              Our Mission
            </h2>
            <p style={{ fontSize: '15px', color: '#444444', lineHeight: '1.7', marginBottom: '16px' }}>
              At GuideMate, our purpose is simple: transform how you discover new cities. Instead of choosing generic bus packages or isolated navigation, we empower travelers to hire trusted local guide partners instantly.
            </p>
            <p style={{ fontSize: '15px', color: '#444444', lineHeight: '1.7', margin: 0 }}>
              By merging smart weather-aware planning, interactive budget controls, and direct WebSocket matching, we make hiring local experts as simple as calling a cab.
            </p>
          </div>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #EAEAEA',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            textAlign: 'center'
          }}>
            <Compass size={48} style={{ color: 'var(--color-maroon)', marginBottom: '16px' }} />
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--color-maroon)' }}>SaaS Travel Standard</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
              Integrating Groq AI, real-time safety indices, and WebSocket alerts to safeguard every tour step.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ padding: '80px 20px', backgroundColor: '#FFFFFF', borderTop: '1px solid #EAEAEA', borderBottom: '1px solid #EAEAEA' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-maroon)', fontSize: '32px', fontWeight: 800, textAlign: 'center', margin: '0 0 48px 0' }}>
            Why GuideMate?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {advantages.map((adv, idx) => (
              <div key={idx} style={{
                backgroundColor: '#FAF7F2',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #EAEAEA',
                display: 'flex',
                gap: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  flexShrink: 0
                }}>
                  {adv.icon}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: 'var(--color-maroon)', fontSize: '16px', fontWeight: 700 }}>{adv.title}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.5' }}>{adv.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-maroon)', fontSize: '32px', fontWeight: 800, textAlign: 'center', margin: '0 0 48px 0' }}>
            How It Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { num: '01', title: 'Plan Your Profile', text: 'Input target destination, dates, and budget details. Collaborative AI builds recommendations.' },
              { num: '02', title: 'Instant Partner Match', text: 'Launch guide matchmaking. Local guides receive notifications via sockets and accept within 15 seconds.' },
              { num: '03', title: 'Explore Safely', text: 'Start active excursions. Track routes in real-time, leverage translation logs, and use SOS triggers if needed.' }
            ].map(step => (
              <div key={step.num} style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-accent)', opacity: 0.5, display: 'block', marginBottom: '8px' }}>
                  {step.num}
                </span>
                <h4 style={{ margin: '0 0 10px 0', color: 'var(--color-maroon)', fontSize: '16px', fontWeight: 700 }}>{step.title}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.6' }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ padding: '80px 20px', backgroundColor: '#FFFFFF', borderTop: '1px solid #EAEAEA' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-maroon)', fontSize: '32px', fontWeight: 800, textAlign: 'center', margin: '0 0 48px 0' }}>
            SaaS Member Benefits
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            <div>
              <h4 style={{ color: 'var(--color-maroon)', borderBottom: '2px solid var(--color-maroon)', paddingBottom: '10px', marginBottom: '20px', fontWeight: 700 }}>
                For Travelers
              </h4>
              <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px', lineHeight: '2', color: '#444' }}>
                <li>Dynamic cost split options during Group mode.</li>
                <li>Live translation helper logs automatically.</li>
                <li>Emergency safety insurance coverage included.</li>
                <li>Verified badges and real-time rating assessments.</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--color-maroon)', borderBottom: '2px solid var(--color-maroon)', paddingBottom: '10px', marginBottom: '20px', fontWeight: 700 }}>
                For Partner Guides
              </h4>
              <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px', lineHeight: '2', color: '#444' }}>
                <li>Online/offline toggles to control matching requests.</li>
                <li>Gig analytics showing weekly earnings and rates.</li>
                <li>Secure escrow payments processed weekly.</li>
                <li>Auto-translator matching language boundaries.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-maroon)', fontSize: '32px', fontWeight: 800, textAlign: 'center', margin: '0 0 16px 0' }}>
            Meet the Team
          </h2>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '15px', marginBottom: '48px' }}>
            Engineers and travel innovators building the future of local excursions.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { name: 'Founder & CEO', role: 'Strategic Operations', initials: 'SO' },
              { name: 'CTO', role: 'Machine Learning & AI', initials: 'MA' },
              { name: 'Head of Growth', role: 'Partner Onboarding', initials: 'PO' },
              { name: 'Compliance Lead', role: 'Safety Operations', initials: 'SL' }
            ].map((member, idx) => (
              <div key={idx} style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #EAEAEA',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-maroon)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}>
                  {member.initials}
                </div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: 'var(--color-maroon)' }}>{member.name}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 20px',
        backgroundColor: 'var(--color-maroon)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 800, color: 'white', margin: '0 0 16px 0' }}>
            Ready to Discover Authenticity?
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6', marginBottom: '32px' }}>
            Register or sign in now. Configure your destinations and pair with premium guides instantly.
          </p>
          <button 
            onClick={() => navigate('/traveler/home')}
            style={{
              backgroundColor: 'var(--color-accent)',
              color: '#2C2C2C',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            Start Your Journey Today
          </button>
        </div>
      </section>

    </div>
  );
}
