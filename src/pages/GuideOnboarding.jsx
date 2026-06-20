import React, { useState, useContext } from 'react';
import { GUIDE_ONBOARDING_STEPS, VERIFICATION_TESTS, GUIDE_PACKAGES } from '../data/guideData';
import { AuthContext } from '../context/AuthContext';

export default function GuideOnboarding() {
  const { user, updateUserRole } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    location: 'Delhi',
    languages: [],
    specializations: [],
    bio: '',
    packages: [],
    bankAccount: ''
  });

  const step = GUIDE_ONBOARDING_STEPS[currentStep - 1];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleNext = () => {
    if (currentStep < GUIDE_ONBOARDING_STEPS.length) {
      if (currentStep === 7) {
        // Sync role change to guide on backend and local context
        if (user) {
          fetch('/api/guide/onboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.uid,
              location: formData.location || 'Delhi',
              hourlyRate: 600,
              packages: formData.packages.length > 0 ? formData.packages : ['basic', 'expert'],
              about: formData.bio || 'GuideMate local partner guide.'
            })
          }).catch(err => console.error('Failed to sync onboard guide:', err));
          updateUserRole('guide');
        }
      }
      setCurrentStep(currentStep + 1);
    } else {
      alert('✅ Application submitted! Your profile is under supervisor review.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>🎯 Become a GuideMate Guide</h1>

        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {GUIDE_ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: index + 1 <= currentStep ? 'var(--color-maroon)' : 'var(--color-border)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              onClick={() => index + 1 < currentStep && setCurrentStep(index + 1)}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* Current Step */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h2 style={{ marginBottom: '8px' }}>{step.title}</h2>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '24px' }}>
            {step.description}
          </p>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Operational City</label>
                <select name="location" value={formData.location} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #DDD', borderRadius: '8px', outline: 'none' }}>
                  <option value="Delhi">Delhi</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Varanasi">Varanasi</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Document Upload */}
          {currentStep === 2 && (
            <div>
              <div className="form-group">
                <label>Government ID (Photo)</label>
                <input type="file" accept="image/*" />
                <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '8px' }}>
                  Upload a clear photo of your government ID (Aadhar, Passport, DL, etc.)
                </p>
              </div>
              <div className="form-group">
                <label>Address Proof (Photo)</label>
                <input type="file" accept="image/*" />
                <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '8px' }}>
                  Upload address proof (Electricity bill, Rent agreement, etc.)
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Background Check Consent */}
          {currentStep === 3 && (
            <div>
              <div className="card-flat" style={{ marginBottom: '16px', backgroundColor: 'var(--color-gold-light)' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  We perform comprehensive background checks on all guides for safety. This includes:
                </p>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>Police verification</li>
                  <li>Reference checks</li>
                  <li>Public records review</li>
                </ul>
              </div>
              <label style={{ display: 'flex', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" required />
                <span>I authorize GuideMate to conduct a background check</span>
              </label>
            </div>
          )}

          {/* Step 4: Knowledge Tests */}
          {currentStep === 4 && (
            <div>
              <div style={{ display: 'grid', gap: '16px' }}>
                {VERIFICATION_TESTS && Object.values(VERIFICATION_TESTS).map((test) => (
                  <div key={test.id} className="card-flat" style={{ cursor: 'pointer' }}>
                    <div className="flex-between">
                      <div>
                        <h4 style={{ margin: '0 0 4px 0' }}>{test.name}</h4>
                        <p style={{ color: 'var(--color-text-light)', fontSize: '13px', margin: 0 }}>
                          {test.duration} min • {test.questions} questions • {test.passingScore}% pass score
                        </p>
                        <p style={{ color: 'var(--color-text-light)', fontSize: '13px', margin: '4px 0 0 0' }}>
                          {test.description}
                        </p>
                      </div>
                      <button className="btn btn-gold btn-sm">Start Test</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Profile Setup */}
          {currentStep === 5 && (
            <div>
              <div className="form-group">
                <label>Languages</label>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {['English', 'Hindi', 'Spanish', 'French', 'German', 'Portuguese'].map(lang => (
                    <label key={lang} style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(lang)}
                        onChange={() => handleMultiSelect('languages', lang)}
                      />
                      <span>{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Specializations</label>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {['Historical', 'Culture', 'Adventure', 'Food', 'Shopping', 'Spiritual', 'Photography'].map(spec => (
                    <label key={spec} style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.specializations.includes(spec)}
                        onChange={() => handleMultiSelect('specializations', spec)}
                      />
                      <span>{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>About You</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell travelers about yourself, your experience, and what makes you unique"
                  rows="4"
                />
              </div>
            </div>
          )}

          {/* Step 6: Package Selection */}
          {currentStep === 6 && (
            <div>
              <p style={{ marginBottom: '16px', color: 'var(--color-text-light)' }}>
                Select which packages you want to offer to travelers:
              </p>
              <div style={{ display: 'grid', gap: '12px' }}>
                {Object.entries(GUIDE_PACKAGES).map(([key, pkg]) => (
                  <label key={key} style={{
                    display: 'flex',
                    gap: '12px',
                    cursor: 'pointer',
                    padding: '12px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: formData.packages.includes(pkg.id) ? 'var(--color-beige)' : 'transparent'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.packages.includes(pkg.id)}
                      onChange={() => handleMultiSelect('packages', pkg.id)}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{pkg.icon} {pkg.name}</div>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-light)', margin: 0 }}>
                        {pkg.description}
                      </p>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--color-gold)' }}>₹{pkg.basePrice}/h</div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Banking */}
          {currentStep === 7 && (
            <div>
              <div className="form-group">
                <label>Bank Account Number</label>
                <input
                  type="text"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleInputChange}
                  placeholder="Enter account number"
                />
              </div>
              <div className="form-group">
                <label>IFSC Code</label>
                <input
                  type="text"
                  placeholder="Enter IFSC code"
                />
              </div>
              <div className="card-flat" style={{ backgroundColor: 'var(--color-success)', color: 'white' }}>
                <p style={{ margin: 0 }}>✓ Your earnings will be transferred weekly to this account</p>
              </div>
            </div>
          )}

          {/* Step 8: Supervisor Review */}
          {currentStep === 8 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
              <h3>Under Review</h3>
              <p style={{ color: 'var(--color-text-light)', marginBottom: '16px' }}>
                Your application is being reviewed by our supervisors. This usually takes 24-48 hours.
              </p>
              <div className="card-flat" style={{ marginBottom: '16px' }}>
                <p style={{ margin: 0 }}>You'll receive an email when your profile is approved or if we need more information.</p>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  window.location.href = '/guide/dashboard';
                }}
                style={{ width: '100%', marginTop: '16px', backgroundColor: 'var(--color-maroon)', border: 'none', color: 'white', fontWeight: 600, padding: '10px 0', borderRadius: '8px', cursor: 'pointer' }}
              >
                Go to Guide Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex-between">
          <button
            className="btn btn-ghost"
            onClick={handlePrevious}
            style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
          >
            ← Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={currentStep === 8}
            style={{ opacity: currentStep === 8 ? 0.5 : 1, cursor: currentStep === 8 ? 'default' : 'pointer' }}
          >
            {currentStep === 8 ? '✓ Submitted' : currentStep === GUIDE_ONBOARDING_STEPS.length ? 'Submit Application' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
