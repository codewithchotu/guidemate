import React, { useState } from 'react';

export default function GuideCard({ guide, onSelect, onBook }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="card" style={{ marginBottom: '16px', cursor: 'pointer' }}>
      <div className="flex-between" onClick={() => setShowDetails(!showDetails)}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '40px' }}>{guide.image}</span>
            <div>
              <h3 style={{ margin: '0 0 4px 0' }}>{guide.name}</h3>
              <p style={{ color: 'var(--color-text-light)', margin: 0, fontSize: '14px' }}>
                📍 {guide.location}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
              ⭐ {guide.rating} ({guide.reviews} reviews)
            </span>
            {guide.verified && <span className="badge">✓ Verified</span>}
            <span className="badge" style={{ backgroundColor: 'var(--color-gold-light)' }}>
              {guide.badge}
            </span>
          </div>

          <p style={{ color: 'var(--color-text-light)', margin: '0 0 8px 0', fontSize: '14px' }}>
            🗣️ Languages: {guide.languages.join(', ')} | ⏱️ Response: {guide.responseTime}
          </p>

          <div style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
            💼 Specializations: {guide.specializations.join(', ')}
          </div>
        </div>

        <div style={{ marginLeft: '16px', textAlign: 'right' }}>
          <div style={{ fontSize: '24px', color: 'var(--color-maroon)', fontWeight: 700 }}>
            ₹{guide.hourlyRate}
            <p style={{ fontSize: '12px', color: 'var(--color-text-light)', margin: 0 }}>/hour</p>
          </div>
          <button className="btn btn-primary btn-sm" style={{ marginTop: '8px' }} onClick={() => onBook(guide)}>
            Book Now
          </button>
        </div>
      </div>

      {showDetails && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
          <p style={{ marginBottom: '12px' }}>{guide.about}</p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
            ✓ Experience: {guide.experience} | Available: {guide.availableToday ? '✅ Today' : '❌ Not today'}
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
            Packages: {guide.packages.map(p => p.toUpperCase()).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
