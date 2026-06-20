import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-section">
            <h4 className="footer-title">GuideMate</h4>
            <p className="footer-desc">
              Connect with verified local guides for authentic travel experiences.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>

          {/* Product */}
          <div className="footer-section">
            <h5 className="footer-heading">Product</h5>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/features">Features</a></li>
              <li><a href="/traveler/home">Book a Guide</a></li>
              <li><a href="/guide/onboarding">Become a Guide</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h5 className="footer-heading">Company</h5>
            <ul className="footer-links">
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h5 className="footer-heading">Support</h5>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Safety Guidelines</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>&copy; 2024 GuideMate Inc. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy</a>
            <span>•</span>
            <a href="#">Terms</a>
            <span>•</span>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
