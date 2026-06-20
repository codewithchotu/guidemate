import React from 'react';
import { SAFETY_FEATURES } from '../data/guideData';

export default function SafetyFeatures() {
  return (
    <div style={{ marginTop: '32px', backgroundColor: 'var(--color-white)', padding: '32px 0', marginLeft: '-50vw', marginRight: '-50vw', paddingLeft: '50vw', paddingRight: '50vw' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>🛡️ Your Safety is Our Priority</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          <SafetyFeatureCard
            icon="📍"
            title="Real-time GPS Tracking"
            description="Both traveler and guide locations are tracked in real-time for safety verification"
          />
          <SafetyFeatureCard
            icon="🚨"
            title="Emergency SOS Button"
            description="One-tap emergency alert directly to supervisors with location sharing"
          />
          <SafetyFeatureCard
            icon="✓"
            title="Verified Guides"
            description="Every guide undergoes comprehensive background checks and tourism knowledge tests"
          />
          <SafetyFeatureCard
            icon="💬"
            title="In-App Communication"
            description="All messages logged and monitored for accountability and dispute resolution"
          />
          <SafetyFeatureCard
            icon="🏥"
            title="Travel Insurance"
            description="Basic insurance coverage included with every premium booking"
          />
          <SafetyFeatureCard
            icon="⭐"
            title="Review & Rating System"
            description="Transparent feedback system ensures guides maintain high standards"
          />
        </div>

        <div style={{ marginTop: '32px', backgroundColor: 'var(--color-beige)', padding: '24px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '16px', color: 'var(--color-text-dark)' }}>
            <strong>Need Help?</strong> Emergency Hotline: <span style={{ color: 'var(--color-maroon)', fontWeight: 700 }}>+91-999-999-9999</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function SafetyFeatureCard({ icon, title, description }) {
  return (
    <div className="card">
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>{icon}</div>
      <h4 style={{ marginBottom: '8px' }}>{title}</h4>
      <p style={{ color: 'var(--color-text-light)', fontSize: '14px', margin: 0 }}>
        {description}
      </p>
    </div>
  );
}
