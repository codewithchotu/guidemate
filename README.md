# 🌍 GuideMate - The Uber of Travel Guides

A comprehensive travel guide booking platform that connects travelers with verified local guides, similar to Uber/Rapido but for trusted human travel experiences.

## 📚 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Key Features](#key-features)
- [Color Theme](#color-theme)
- [Deployment](#deployment)

---

## Overview

GuideMate is a platform that transforms how travelers connect with local guides. Instead of impersonal tour companies, travelers can book verified local people who provide personalized travel experiences - much like how Uber revolutionized transportation.

### The Model:
- **Drivers** in Uber → **Local Guides** in GuideMate
- **Rides** → **Travel Guide Services**
- **Verification & Safety** → Comprehensive guide onboarding & supervisor oversight

---

## 🎯 Features

### Core Platform Features

1. **Guide Discovery**
   - Browse verified local guides near your location
   - Filter by language, specialization, rating
   - View real-time availability

2. **4 Guide Packages** (Like Uber's ride categories)
   - 🗺️ **Basic Local Guide** (₹300/hour)
   - 🏛️ **City Expert** (₹600/hour)
   - 👑 **Premium** (₹1200/hour)
   - 🌍 **Foreigner Pack** (₹2000+/hour)

3. **Booking System**
   - Instant booking with 3-step flow
   - Select package → Choose date/time → Review & pay
   - Real-time price calculation with dynamic pricing

4. **AI-Powered Agents**
   - **Guide Match Agent**: Matches travelers with perfect guides
   - **Travel Planner Agent**: Creates personalized itineraries
   - **Recommendation Agent**: Suggests attractions, hotels, restaurants
   - **Safety Agent**: Provides destination safety assessments
   - **Dynamic Replanning Agent**: Adjusts plans for weather/closures
   - **Pricing Calculator**: Dynamic pricing based on multiple factors

5. **Coupon & Loyalty System**
   - First booking discount (20% off)
   - Referral coupons
   - Festival offers
   - Group booking discounts
   - Loyalty rewards

6. **Safety Features**
   - ✓ Verified guides with background checks
   - ✓ Real-time GPS tracking
   - ✓ Emergency SOS button
   - ✓ Travel insurance included
   - ✓ Transparent review system

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + Vite
- **Routing**: React Router v7
- **Styling**: Custom CSS with luxury theme
- **State Management**: React Context API
- **AI Integration**: Gemini API (ready for integration)

### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── GuideCard.jsx
│   ├── BookingFlow.jsx
│   ├── CouponSection.jsx
│   └── SafetyFeatures.jsx
├── context/            # Global state management
│   ├── AuthContext.jsx
│   └── AppContext.jsx
├── data/              # Data structures & sample data
│   ├── guideData.js   # Comprehensive guide system data
│   └── travelData.js  # Travel destination data
├── pages/             # Page components
│   ├── LandingPage.jsx
│   ├── TravelerHome.jsx
│   ├── GuideOnboarding.jsx
│   ├── SupervisorDash.jsx
│   └── (legacy pages)
├── services/          # Business logic & AI agents
│   └── agents.js      # All AI agents
├── styles/           # Global styles
│   └── theme.css     # Luxury color theme & components
└── App.jsx          # Main routing
```

---

## 💻 Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup

```bash
# Clone repository
cd guidemate

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5174`

---

## 🎭 User Roles

### 1. **Traveler**
- Browse and book guides
- View guide profiles and ratings
- Make payments securely
- Track active bookings with GPS
- Leave reviews and ratings
- Apply coupons and get recommendations

**Routes**: 
- `/` - Landing page
- `/traveler/home` - Guide discovery & booking

### 2. **Guide**
- Complete onboarding process (verification, tests)
- Set language preferences and specializations
- Choose which packages to offer
- Accept/reject booking requests
- Track earnings
- Manage availability

**Routes**:
- `/guide/onboarding` - Multi-step registration & verification

### 3. **Supervisor/Admin**
- Verify new guide applications
- Review background checks and test scores
- Monitor active trips with GPS tracking
- Handle safety alerts and emergency SOS
- Manage disputes and complaints
- Remove guides or travelers if needed

**Routes**:
- `/supervisor/dashboard` - Full admin dashboard

---

## 🎨 Luxury Color Theme

The platform uses a premium, minimalistic design:

- **Primary Colors**
  - Maroon: `#6D2932`
  - Dark Maroon: `#4A1E25`
  
- **Background Colors**
  - Beige: `#F5EFE6`
  - Cream: `#FAF7F2`
  - White: `#FFFFFF`
  
- **Accent Color**
  - Gold: `#C6A969`
  - Gold Light: `#E8DCC8`

**Design Philosophy**: Premium, Minimalistic, Elegant, Modern

---

## 📊 Dynamic Pricing Model

Price = Base Price × Duration × Group Multiplier × Rating Multiplier × Time Multiplier

### Multipliers:
- **Group Size**: 1x to 2x based on number of travelers
- **Guide Rating**: 1x to 1.35x based on 4.0-5.0 rating
- **Booking Time**: 0.85x to 1.0x based on advance booking

### Example:
```
Basic Guide: ₹300/hour
2 people: ₹300 × 1.3 = ₹390
4.8 rated guide: ₹390 × 1.35 = ₹526.50
Booked 7 days in advance: ₹526.50 × 0.9 = ₹473.85
Final: ₹473.85/hour for 2 people
```

---

## 🔐 Guide Onboarding Process

### 8-Step Verification:

1. **Basic Information** - Name, phone, email, DOB
2. **Document Upload** - ID and address proof
3. **Background Check Consent** - Authorization
4. **Knowledge Tests** 
   - Tourism Knowledge Test (20q, 70% pass)
   - Language Proficiency Test (15q, 75% pass)
   - Area Knowledge Test (18q, 70% pass)
5. **Profile Setup** - Languages, specializations, bio
6. **Package Selection** - Choose which packages to offer
7. **Banking Details** - Payment account setup
8. **Supervisor Review** - Final approval (24-48 hours)

---

## 🛡️ Safety Systems

### For Travelers:
- View verified guide badges
- Check guide ratings and reviews
- Real-time GPS tracking during trips
- Emergency SOS button with location sharing
- In-app communication logs for disputes

### For Guides:
- Verified traveler profiles
- Background verified travelers
- Safe payment through platform
- Dispute resolution support

### For Supervisors:
- Live trip monitoring dashboard
- Emergency response system
- Safety alert queue
- Guide/traveler verification history
- Dispute resolution interface

---

## 🤖 AI Agents System

### 1. Guide Match Agent
Matches travelers with best guides based on:
- Language preferences
- Specializations & interests
- Budget constraints
- Guide rating & experience
- Availability

### 2. Travel Planner Agent
Creates personalized itineraries with:
- Day-wise activity planning
- Estimated budget allocation
- Restaurant recommendations
- Transportation tips
- Interest-based prioritization

### 3. Recommendation Agent
Suggests:
- Top attractions (with ratings)
- Hotels (luxury, budget, boutique)
- Restaurants (cuisine, price, rating)
- Hidden gems & local favorites

### 4. Safety Agent
Provides:
- Destination safety score (0-5)
- Area-wise risk assessment
- Safety recommendations
- Emergency contacts
- Travel advisories

### 5. Dynamic Replanning Agent
Automatically updates plans if:
- Weather changes
- Attractions closed
- Guide becomes unavailable
- Suggests alternatives

### 6. Pricing Calculator Agent
Calculates dynamic prices considering:
- Base package price
- Group size
- Guide rating
- Booking timing
- Applied coupons

---

## 🎟️ Coupon System

### Available Coupons:

| Code | Discount | Valid For | Expiry |
|------|----------|-----------|--------|
| WELCOME20 | 20% | First booking | 30 days |
| REFER200 | ₹200 | Referrals | 90 days |
| FESTIVAL30 | 30% | Festival period | 7 days |
| GROUP25 | 25% | 5+ travelers | 60 days |
| LOYAL500 | ₹500 | After 5 bookings | 120 days |

---

## 📱 Mobile-First Design

- Fully responsive layout
- Touch-optimized buttons
- Mobile payment integration ready
- GPS-based guide search
- Simplified booking flow

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options:
- Vercel (recommended for Vite)
- Netlify
- AWS Amplify
- Docker containerization

---

## 🔮 Future Enhancements

1. **Real Gemini API Integration**
   - Live AI trip planning
   - Natural language queries
   - Multi-language support

2. **Payment Gateway**
   - Stripe/Razorpay integration
   - Digital wallet support
   - Refund management

3. **Real-Time Features**
   - WebSocket for live trip updates
   - Live chat between guide and traveler
   - Push notifications

4. **Analytics Dashboard**
   - Guide performance metrics
   - Traveler insights
   - Revenue analytics

5. **Mobile Apps**
   - Native iOS & Android apps
   - Offline map functionality
   - Push notifications

6. **Advanced Safety**
   - AI-powered fraud detection
   - Traveler behavior scoring
   - Predictive safety alerts

7. **Localization**
   - Multi-language support
   - Local currency conversion
   - Regional customization

---

## 📞 Support & Documentation

- **Landing Page**: http://localhost:5174/
- **Traveler Booking**: http://localhost:5174/traveler/home
- **Guide Registration**: http://localhost:5174/guide/onboarding
- **Supervisor Panel**: http://localhost:5174/supervisor/dashboard

---

## 📄 License

Copyright © 2024 GuideMate. All rights reserved.

---

## 👥 Team

Built with ❤️ by GuideMate Team

**Vision**: Making quality local travel experiences accessible to everyone through verified, trusted guides.

---

## 🎯 Quick Start Guide

### For Travelers:
1. Visit landing page (`/`)
2. Click "I'm a Traveler"
3. Search guides by location/language
4. Click "Book Now" on preferred guide
5. Select package and confirm booking
6. Apply coupon for discounts
7. Track trip in real-time

### For Guides:
1. Click "Become a Guide" on landing page
2. Complete 8-step onboarding
3. Pass knowledge tests
4. Set up payment account
5. Submit for supervisor review
6. Start accepting bookings once approved

### For Supervisors:
1. Access supervisor dashboard
2. Review pending guide applications
3. Monitor active trips
4. Handle safety alerts and disputes
5. View analytics and reports

---

**Welcome to GuideMate - Where Every Journey Becomes a Story!** 🌍✨
