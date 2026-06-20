import React, { useState } from 'react';
import { GUIDE_PACKAGES } from '../data/guideData';
import { PricingCalculatorAgent } from '../services/agents';

export default function BookingFlow({ guide, onClose, onConfirm }) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    selectedPackage: 'basic',
    date: '',
    time: '',
    duration: 1,
    groupSize: 1,
    specialRequests: ''
  });
  const [priceInfo, setPriceInfo] = useState(null);

  const handleNext = () => {
    if (step === 2) {
      // Calculate price
      const pkg = GUIDE_PACKAGES[bookingData.selectedPackage.toUpperCase()];
      const pricing = PricingCalculatorAgent.calculateDynamicPrice(
        pkg.basePrice,
        {
          groupSize: bookingData.groupSize,
          guideRating: guide.rating,
          duration: bookingData.duration,
          timeOfBooking: 'instant'
        }
      );
      setPriceInfo(pricing);
    }
    setStep(step + 1);
  };

  const handlePrevious = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const handleConfirm = () => {
    onConfirm({
      ...bookingData,
      guide,
      totalPrice: priceInfo?.finalPrice,
      pricingBreakdown: priceInfo?.breakdown
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0 }}>Book {guide.name}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Step 1: Package Selection */}
        {step === 1 && (
          <div>
            <h3>Step 1: Select Package</h3>
            <div style={{ marginBottom: '24px' }}>
              {guide.packages.map(pkgId => {
                const pkg = GUIDE_PACKAGES[pkgId.toUpperCase()];
                if (!pkg) return null;
                return (
                  <div
                    key={pkgId}
                    onClick={() => setBookingData({ ...bookingData, selectedPackage: pkgId })}
                    style={{
                      padding: '16px',
                      marginBottom: '12px',
                      border: bookingData.selectedPackage === pkgId ? '2px solid var(--color-maroon)' : '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer',
                      backgroundColor: bookingData.selectedPackage === pkgId ? 'var(--color-beige)' : 'transparent'
                    }}
                  >
                    <div className="flex-between">
                      <div>
                        <h4 style={{ margin: '0 0 4px 0' }}>{pkg.icon} {pkg.name}</h4>
                        <p style={{ color: 'var(--color-text-light)', fontSize: '14px', margin: 0 }}>
                          {pkg.description}
                        </p>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--color-gold)', fontSize: '18px' }}>
                        ₹{pkg.basePrice}/h
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '8px' }}>
                      Includes: {pkg.includes.slice(0, 2).join(', ')}...
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Booking Details */}
        {step === 2 && (
          <div>
            <h3>Step 2: Booking Details</h3>
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" value={bookingData.date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="time" name="time" value={bookingData.time} onChange={handleChange} />
            </div>
            <div className="flex" style={{ gap: '12px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Duration (hours)</label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  value={bookingData.duration}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Group Size</label>
                <select name="groupSize" value={bookingData.groupSize} onChange={handleChange}>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Special Requests</label>
              <textarea
                name="specialRequests"
                rows="3"
                value={bookingData.specialRequests}
                onChange={handleChange}
                placeholder="Any special requirements or preferences?"
              />
            </div>
          </div>
        )}

        {/* Step 3: Review & Payment */}
        {step === 3 && priceInfo && (
          <div>
            <h3>Step 3: Review & Payment</h3>
            
            <div className="card-flat" style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0' }}>Booking Summary</h4>
              <div style={{ fontSize: '14px' }}>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <span>Guide:</span>
                  <span style={{ fontWeight: 600 }}>{guide.name}</span>
                </div>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <span>Package:</span>
                  <span style={{ fontWeight: 600 }}>{bookingData.selectedPackage}</span>
                </div>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <span>Date & Time:</span>
                  <span style={{ fontWeight: 600 }}>{bookingData.date} {bookingData.time}</span>
                </div>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <span>Duration:</span>
                  <span style={{ fontWeight: 600 }}>{bookingData.duration} hours</span>
                </div>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <span>Group Size:</span>
                  <span style={{ fontWeight: 600 }}>{bookingData.groupSize} {bookingData.groupSize === 1 ? 'person' : 'people'}</span>
                </div>
              </div>
            </div>

            <div className="card-flat" style={{ backgroundColor: 'var(--color-gold-light)', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0' }}>Price Breakdown</h4>
              <div style={{ fontSize: '14px' }}>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <span>Base Cost:</span>
                  <span>₹{priceInfo.breakdown.baseCost}</span>
                </div>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <span>Group Adjustment:</span>
                  <span>{priceInfo.breakdown.groupAdjustment}</span>
                </div>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <span>Quality Premium:</span>
                  <span>{priceInfo.breakdown.qualityPremium}</span>
                </div>
                <div className="flex-between" style={{ paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                  <span style={{ fontWeight: 700 }}>Total Price:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-dark-maroon)', fontSize: '18px' }}>
                    ₹{priceInfo.finalPrice}
                  </span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginBottom: '16px' }}>
              ✓ Payment will be secured. Guide verification complete. Safe booking guaranteed.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-between" style={{ marginTop: '24px' }}>
          <button
            className="btn btn-ghost"
            onClick={handlePrevious}
            style={{ display: step === 1 ? 'none' : 'block' }}
          >
            ← Previous
          </button>
          <div className="flex" style={{ gap: '12px' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            {step < 3 ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button className="btn btn-primary btn-gold" onClick={handleConfirm}>
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
