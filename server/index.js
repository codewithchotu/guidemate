import express from 'express';
import cors from 'cors';
import http from 'http';
import { db, initDb } from './db.js';
import { initSocketServer } from './socket.js';
import axios from 'axios';
import { orchestrateTripPlanning } from './gemini.js';
import { SAMPLE_GUIDES } from '../src/data/guideData.js';

// Load environment variables if .env file exists
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize DBs
await initDb();

// Port
const PORT = process.env.PORT || 5000;

// Root Endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    firebase: 'ready',
    postgres: process.env.DATABASE_URL ? 'connected' : 'running (mock database fallback)',
    mongodb: process.env.MONGODB_URI ? 'connected' : 'running (mock database fallback)',
    websockets: 'active'
  });
});

// Authentication Sync route
app.post('/api/auth/sync', async (req, res) => {
  const { uid, name, email, role } = req.body;
  if (!uid || !role) {
    return res.status(400).json({ error: 'Missing UID or role' });
  }
  try {
    const syncedUser = await db.saveUser({ uid, name, email, role });
    res.json({ success: true, user: syncedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Guide Onboarding Sync route
app.post('/api/guide/onboard', async (req, res) => {
  const { userId, location, hourlyRate, packages, about } = req.body;
  try {
    await db.saveGuide({ userId, location, hourlyRate, packages, about });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OpenWeather API Proxy / Fallback
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  const normalizedCity = (city || 'Delhi').toLowerCase().trim();
  
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (apiKey) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${normalizedCity}&appid=${apiKey}&units=metric`
      );
      const data = response.data;
      return res.json({
        city: data.name,
        temp: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        rainProbability: data.rain ? (data.rain['1h'] || 10) * 10 : 0,
        alerts: data.wind.speed > 10 ? 'Windy weather conditions warning' : null
      });
    } catch (err) {
      console.error('Weather API error, using mock data:', err.message);
    }
  }

  // Weather fallback simulation
  const mockWeather = {
    delhi: { city: 'Delhi', temp: 36, description: 'clear sky', humidity: 45, rainProbability: 0, alerts: null },
    jaipur: { city: 'Jaipur', temp: 39, description: 'sunny', humidity: 30, rainProbability: 0, alerts: null },
    mumbai: { city: 'Mumbai', temp: 31, description: 'moderate rain', humidity: 85, rainProbability: 75, alerts: 'Monsoon Alert: High Rainfall Expected' },
    varanasi: { city: 'Varanasi', temp: 34, description: 'scattered clouds', humidity: 60, rainProbability: 15, alerts: null }
  };

  const weather = mockWeather[normalizedCity] || {
    city: city || 'Local Area',
    temp: 28,
    description: 'scattered clouds',
    humidity: 50,
    rainProbability: 10,
    alerts: null
  };

  res.json(weather);
});

// Groq API Chat Concierge / Fallback
app.post('/api/ai/chat', async (req, res) => {
  const { message, history } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  if (apiKey) {
    try {
      const formattedHistory = (history || []).map(h => ({
        role: h.sender === 'user' ? 'user' : 'assistant',
        content: h.text
      }));
      formattedHistory.push({ role: 'user', content: message });

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-specdec',
          messages: [
            {
              role: 'system',
              content: 'You are GuideMate AI, an elite travel concierge assistant. Provide tailored recommendations on attractions, hotels, food spots, local culture, hidden gems, and budget advice. Keep descriptions elegant and concise.'
            },
            ...formattedHistory
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return res.json({ response: response.data.choices[0].message.content });
    } catch (err) {
      console.error('Groq API error, using mock assistant:', err.message);
    }
  }

  // Concierge simulation router
  const msgLower = message.toLowerCase();
  let aiResponse = "I'm here as your GuideMate Travel Concierge. I can suggest local cuisines, itinerary tips, hidden highlights, or budget allocation charts! Tell me where you are traveling.";

  if (msgLower.includes('jaipur')) {
    aiResponse = `🏰 **Jaipur Travel Guide by GuideMate AI**\n\nHere is what you can do tonight in Jaipur:\n- Visit **Chokhi Dhani** for an authentic Rajasthani heritage village and culinary experience.\n- Walk around the lit-up **Hawa Mahal** facades (stunning for photography after dusk).\n- Enjoy a quiet rooftop drink at **The Peacock Rooftop Restaurant**.\n\n*Pro-tip:* Ask for your GuideMate City Expert Guide to handle transport and bargain with local vendors!`;
  } else if (msgLower.includes('charminar') || msgLower.includes('hyderabad')) {
    aiResponse = `🕌 **Hyderabad Delights by GuideMate AI**\n\nTop food spots near Charminar:\n1. **Hotel Shadab:** Famous for its authentic Hyderabadi Mutton Biryani and Haleem.\n2. **Nimrah Cafe and Bakery:** Enjoy hot Irani Chai with Osmania biscuits right next to Charminar.\n3. **Hameedi Confectioners:** Historic sweet shop serving legendary Jouzi Halwa.`;
  } else if (msgLower.includes('delhi') || msgLower.includes('hidden gem')) {
    aiResponse = `🌳 **Delhi Hidden Gems by GuideMate AI**\n\nSkip the standard crowds and check out:\n- **Agrasen ki Baoli:** An ancient stepwell tucked between high-rise buildings in CP.\n- **Sunder Nursery:** Beautifully restored Mughal garden complex with lakes and quiet trails.\n- **Majnu ka Tilla:** Delhi's vibrant Little Tibet, perfect for momos, cafes, and peaceful temple visits.`;
  } else if (msgLower.includes('budget')) {
    aiResponse = `📊 **Budget Strategy Recommendations**:\n- **Accommodations (40%):** Look for heritage boutique hotels instead of luxury chains for local character.\n- **Guide Services (20%):** Stick to *Basic Guides* for navigation, upgrade to *City Experts* for specialized monuments.\n- **Dining (25%):** Ask your guide to take you to hygienic local street food hubs for authentic eats at 1/10th hotel cost.`;
  }

  res.json({ response: aiResponse });
});

// Guide earnings & dashboard metrics
app.get('/api/guide/:userId/metrics', async (req, res) => {
  const { userId } = req.params;
  // Dynamic mock analytics per guide
  res.json({
    today: 2400,
    weekly: 16800,
    monthly: 62000,
    tripsCompleted: 42,
    hoursWorked: 84,
    acceptanceRate: 95,
    cancellationRate: 2,
    trustScore: 98,
    ratings: 4.9,
    topDestinations: ['Red Fort, Delhi', 'Qutub Minar', 'Chandni Chowk'],
    earningsData: [
      { name: 'Mon', earnings: 1200 },
      { name: 'Tue', earnings: 2400 },
      { name: 'Wed', earnings: 1800 },
      { name: 'Thu', earnings: 3000 },
      { name: 'Fri', earnings: 2500 },
      { name: 'Sat', earnings: 4200 },
      { name: 'Sun', earnings: 1700 }
    ]
  });
});

// Supervisor Dashboard Data route
app.get('/api/supervisor/metrics', async (req, res) => {
  const allBookings = await db.getBookings();
  const allGuides = await db.getGuides();
  
  const revenue = allBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const commission = Math.round(revenue * 0.15); // 15% platform split

  res.json({
    activeTrips: allBookings.filter(b => b.status === 'accepted' || b.status === 'in_progress').length,
    pendingVerifications: allGuides.filter(g => !g.verified).length,
    totalRevenue: revenue,
    platformCommission: commission,
    sosCount: 0,
    health: '100% Operational',
    bookingsData: [
      { name: 'Week 1', bookings: 5 },
      { name: 'Week 2', bookings: 12 },
      { name: 'Week 3', bookings: 18 },
      { name: 'Week 4', bookings: 25 }
    ]
  });
});

// ============================================
// AI TRIP PLANNING ENDPOINT
// ============================================

app.post('/api/ai/plan-trip', async (req, res) => {
  try {
    const { destination, days, budget, interests } = req.body;
    
    if (!destination || !days || !budget || !interests || interests.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required fields: destination, days, budget, interests' 
      });
    }
    
    console.log(`\n📍 Planning trip to ${destination} for ${days} days with budget ₹${budget}`);
    
    // Orchestrate all 4 AI agents
    const result = await orchestrateTripPlanning(
      { destination, days, budget, interests },
      SAMPLE_GUIDES
    );
    
    res.json(result);
  } catch (err) {
    console.error('Trip planning error:', err);
    res.status(500).json({ error: 'Failed to generate travel plan', details: err.message });
  }
});

// Start Express server + WebSocket server
const server = http.createServer(app);
initSocketServer(server);

server.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 GuideMate Server listening on port ${PORT}`);
  console.log(`🌍 Health: http://localhost:${PORT}/api/status`);
  console.log(`=================================================`);
});
