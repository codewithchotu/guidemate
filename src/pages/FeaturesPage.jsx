import React from 'react';
import { Sparkles, Users, MapPin, Shield, Zap, Radio } from 'lucide-react';
import './FeaturesPage.css';

export default function FeaturesPage() {
  const features = [
    {
      icon: <Sparkles size={40} />,
      title: 'AI Trip Planner',
      description: 'Our advanced AI analyzes your preferences, budget, and travel style to create perfectly tailored itineraries. Get day-by-day plans with attractions, restaurants, and hidden gems personalized just for you.',
      benefits: ['Smart itinerary generation', 'Budget optimization', 'Preference learning', 'Real-time adjustments']
    },
    {
      icon: <Users size={40} />,
      title: 'Perfect Guide Matching',
      description: 'Find the ideal guide with our intelligent matching algorithm. We consider languages, specializations, reviews, availability, and your specific interests to pair you with the best local expert.',
      benefits: ['Language matching', 'Expertise alignment', 'Rating-based selection', 'Availability sync']
    },
    {
      icon: <MapPin size={40} />,
      title: 'Hidden Gems Discovery',
      description: 'Go beyond typical tourist attractions. Our guides know the authentic local spots - hidden restaurants, secret viewpoints, and cultural experiences that most tourists never discover.',
      benefits: ['Local insider knowledge', 'Off-the-beaten-path locations', 'Cultural authenticity', 'Photo-worthy moments']
    },
    {
      icon: <Shield size={40} />,
      title: 'Safety Intelligence',
      description: 'Travel with confidence. Real-time safety scores for every destination, verified guide backgrounds, emergency SOS buttons, and 24/7 support in your language.',
      benefits: ['Real-time safety alerts', 'Emergency support', 'GPS tracking', 'Insurance coverage']
    },
    {
      icon: <Zap size={40} />,
      title: 'Dynamic Replanning',
      description: 'Plans change. Our AI monitors weather, event closures, and traffic, automatically adjusting your itinerary in real-time to keep your day on track and enjoyable.',
      benefits: ['Weather awareness', 'Closure monitoring', 'Traffic optimization', 'Auto-adjustments']
    },
    {
      icon: <Radio size={40} />,
      title: 'Multilingual Support',
      description: 'Communication is key. Connect with guides in 30+ languages, get real-time translations, and access support in your native language anytime, anywhere.',
      benefits: ['30+ languages', 'Real-time translation', 'Native speakers', 'Global support']
    }
  ];

  const packages = [
    {
      name: 'Basic Local',
      price: '₹300/hour',
      description: 'Perfect for navigation and popular sightseeing',
      features: ['Local navigation', 'Tourist sites', 'Basic tips', 'Photo stops']
    },
    {
      name: 'City Expert',
      price: '₹600/hour',
      description: 'Deep dive into history, culture, and local life',
      features: ['Historical insights', 'Cultural experience', 'Local dining', 'Authentic stories']
    },
    {
      name: 'Premium',
      price: '₹1,200/hour',
      description: 'Fully personalized experience with all amenities',
      features: ['Custom itinerary', 'VIP experiences', 'Meal arrangements', 'Photography']
    },
    {
      name: 'Foreigner Pack',
      price: '₹2,000+/hour',
      description: 'Complete support for international travelers',
      features: ['Concierge service', 'Language support', 'Insurance', 'Priority support']
    }
  ];

  return (
    <div className="features-page">
      {/* Hero Section */}
      <section className="features-hero">
        <div className="container">
          <h1>Powerful Features for Unforgettable Travel</h1>
          <p>Everything you need for authentic, personalized adventures</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-list">
        <div className="container">
          {features.map((feature, index) => (
            <div key={index} className="feature-detail">
              <div className="feature-visual">
                <div className="feature-icon-large">
                  {feature.icon}
                </div>
              </div>
              <div className="feature-content">
                <h2>{feature.title}</h2>
                <p className="feature-description">{feature.description}</p>
                <div className="benefits-list">
                  {feature.benefits.map((benefit, i) => (
                    <span key={i} className="benefit-badge">✓ {benefit}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packages Section */}
      <section className="packages-section">
        <div className="container">
          <h2>Guide Packages</h2>
          <p>Choose the perfect package for your travel needs</p>
          <div className="packages-grid">
            {packages.map((pkg, index) => (
              <div key={index} className="package-card">
                <h3>{pkg.name}</h3>
                <p className="package-price">{pkg.price}</p>
                <p className="package-desc">{pkg.description}</p>
                <ul className="package-features">
                  {pkg.features.map((feature, i) => (
                    <li key={i}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why GuideMate */}
      <section className="why-guidemate">
        <div className="container">
          <h2>Why GuideMate?</h2>
          <div className="comparison">
            <div className="comparison-col">
              <h4>Traditional Tours</h4>
              <ul className="comparison-list">
                <li>❌ Generic group experiences</li>
                <li>❌ No personalization</li>
                <li>❌ Standard itineraries</li>
                <li>❌ Limited flexibility</li>
                <li>❌ Language barriers</li>
              </ul>
            </div>
            <div className="comparison-col highlight">
              <h4>GuideMate</h4>
              <ul className="comparison-list">
                <li>✓ Personalized itineraries</li>
                <li>✓ AI-powered matching</li>
                <li>✓ Authentic experiences</li>
                <li>✓ Complete flexibility</li>
                <li>✓ 30+ languages</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
