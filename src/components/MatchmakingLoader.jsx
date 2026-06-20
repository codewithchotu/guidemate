import React, { useEffect, useState } from 'react';
import './MatchmakingLoader.css';

export default function MatchmakingLoader({ isActive, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { number: 1, label: 'Analyzing Interests', icon: '🎯' },
    { number: 2, label: 'Matching Guides', icon: '👥' },
    { number: 3, label: 'Planning Itinerary', icon: '📅' },
    { number: 4, label: 'Calculating Budget', icon: '💰' },
    { number: 5, label: 'Assessing Safety', icon: '🛡️' }
  ];

  useEffect(() => {
    if (!isActive) return;

    let stepInterval;
    let completeTimeout;

    // Progress through steps
    stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    // Complete after all steps are done
    completeTimeout = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, steps.length * 600 + 500);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(completeTimeout);
    };
  }, [isActive, steps.length, onComplete]);

  if (!isActive) return null;

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="matchmaking-loader-overlay">
      <div className="matchmaking-loader-container">
        <div className="loader-header">
          <h2>Creating Your Perfect Travel Plan</h2>
          <p>Our AI is working its magic...</p>
        </div>

        <div className="loader-steps">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`loader-step ${
                index < currentStep ? 'completed' : index === currentStep ? 'active' : 'pending'
              }`}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-label">{step.label}</div>
              {index < currentStep && <div className="step-checkmark">✓</div>}
            </div>
          ))}
        </div>

        <div className="loader-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="progress-text">{Math.round(progressPercentage)}%</p>
        </div>

        <div className="loader-animation">
          <div className="animated-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
