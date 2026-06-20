import React, { useState, useContext } from 'react';
import { COUPONS } from '../data/guideData';
import { AppContext } from '../context/AppContext';

export default function CouponSection() {
  const { applyCoupon, removeCoupon, appliedCoupon } = useContext(AppContext);
  const [couponCode, setCouponCode] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [message, setMessage] = useState('');

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setMessage('Please enter a coupon code');
      return;
    }
    const result = applyCoupon(couponCode);
    if (result.success) {
      setMessage(`✓ Coupon applied! ${result.coupon.discount}${result.coupon.type === 'percentage' ? '%' : '₹'} off`);
      setCouponCode('');
    } else {
      setMessage('✗ Invalid coupon code');
    }
  };

  const displayCoupons = showAll ? COUPONS : COUPONS.slice(0, 3);

  return (
    <div style={{ marginTop: '32px' }}>
      <h2 style={{ marginBottom: '24px' }}>🎟️ Apply Coupon</h2>

      {appliedCoupon && (
        <div className="card" style={{ backgroundColor: 'var(--color-gold-light)', marginBottom: '16px', padding: '16px' }}>
          <div className="flex-between">
            <div>
              <p style={{ margin: 0, fontWeight: 700 }}>✓ Coupon Applied: {appliedCoupon.code}</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--color-text-dark)' }}>
                Saving: {appliedCoupon.discount}{appliedCoupon.type === 'percentage' ? '%' : '₹'}
              </p>
            </div>
            <button 
              className="btn btn-sm btn-ghost"
              onClick={removeCoupon}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '16px', padding: '16px' }}>
        <div className="flex" style={{ gap: '8px' }}>
          <input
            type="text"
            placeholder="Enter coupon code (e.g., WELCOME20)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            style={{ flex: 1 }}
            onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
          />
          <button className="btn btn-primary" onClick={handleApplyCoupon}>
            Apply
          </button>
        </div>
        {message && (
          <p style={{
            marginTop: '8px',
            fontSize: '13px',
            color: message.includes('✓') ? 'var(--color-success)' : 'var(--color-error)'
          }}>
            {message}
          </p>
        )}
      </div>

      <div>
        <h3 style={{ marginBottom: '12px' }}>Available Coupons</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {displayCoupons.map((coupon) => (
            <div key={coupon.id} className="card-flat">
              <div className="flex-between">
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 700 }}>
                    {coupon.code} • Save {coupon.discount}{coupon.type === 'percentage' ? '%' : '₹'}
                  </p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--color-text-light)' }}>
                    {coupon.description}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-light)' }}>
                    Valid for {coupon.expiryDays} days • {coupon.maxUses} uses remaining
                  </p>
                </div>
                <button
                  className="btn btn-sm btn-gold"
                  onClick={() => {
                    setCouponCode(coupon.code);
                    handleApplyCoupon();
                  }}
                >
                  Use
                </button>
              </div>
            </div>
          ))}
        </div>

        {!showAll && COUPONS.length > 3 && (
          <button
            className="btn btn-ghost"
            onClick={() => setShowAll(true)}
            style={{ marginTop: '16px', width: '100%' }}
          >
            View All Coupons ({COUPONS.length})
          </button>
        )}
      </div>
    </div>
  );
}
