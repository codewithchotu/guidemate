import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import './ContactPage.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! A GuideMate supervisor will contact you within 2-4 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page" style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '60px 20px', fontFamily: "'Inter', sans-serif" }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header Block */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 700, display: 'block', marginBottom: '12px' }}>
            Support Desk
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', fontWeight: 800, color: 'var(--color-maroon)', margin: '0 0 12px 0' }}>
            Get in Touch
          </h1>
          <p style={{ margin: 0, color: '#666666', fontSize: '16px' }}>
            Have questions about guide onboarding, corporate events, or billing? Write to us.
          </p>
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '48px', alignItems: 'start' }}>
          
          {/* Left Column: Contact details */}
          <div style={{ display: 'grid', gap: '32px' }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAEAEA', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-maroon)', fontSize: '20px', fontWeight: 700, margin: '0 0 24px 0' }}>
                Contact Information
              </h3>

              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                  <MapPin size={20} style={{ color: 'var(--color-maroon)', marginTop: '2px' }} />
                  <div>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 700, color: '#333' }}>Location</h5>
                    <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
                      123 Travel Street, Connaught Place,<br />New Delhi, India 110001
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                  <Phone size={20} style={{ color: 'var(--color-maroon)', marginTop: '2px' }} />
                  <div>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 700, color: '#333' }}>Direct Helpline</h5>
                    <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>+91 (11) 4567-8900</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                  <Mail size={20} style={{ color: 'var(--color-maroon)', marginTop: '2px' }} />
                  <div>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 700, color: '#333' }}>Support Email</h5>
                    <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>support@guidemate.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAEAEA', borderRadius: '16px', padding: '24px 32px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 700, color: 'var(--color-maroon)' }}>Follow GuideMate</h4>
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                <a href="#" style={{ color: 'var(--color-maroon)', fontWeight: 600, textDecoration: 'none' }}>LinkedIn</a>
                <span style={{ color: '#DDD' }}>|</span>
                <a href="#" style={{ color: 'var(--color-maroon)', fontWeight: 600, textDecoration: 'none' }}>Twitter</a>
                <span style={{ color: '#DDD' }}>|</span>
                <a href="#" style={{ color: 'var(--color-maroon)', fontWeight: 600, textDecoration: 'none' }}>Instagram</a>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAEAEA', borderRadius: '16px', padding: '40px 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-maroon)', fontSize: '22px', fontWeight: 700, margin: '0 0 24px 0' }}>
              Send Message
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#666', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #DDD', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#666', display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #DDD', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#666', display: 'block', marginBottom: '6px' }}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we assist you?"
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #DDD', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#666', display: 'block', marginBottom: '6px' }}>Message Details</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your comments here..."
                  rows="5"
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #DDD', borderRadius: '8px', outline: 'none', fontSize: '13px', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'var(--color-maroon)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(109, 41, 50, 0.15)'
                }}
              >
                <Send size={16} /> Send Message
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
