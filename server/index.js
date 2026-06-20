import express from 'express';
import cors from 'cors';
import http from 'http';
import { db, initDb } from './db.js';
import { initSocketServer } from './socket.js';
import { runAgenticTravelCompanion } from './gemini.js';
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
      })).filter(h => h.role === 'user' || h.role === 'assistant');
      formattedHistory.push({ role: 'user', content: message });

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-specdec',
          messages: [
            {
              role: 'system',
              content: `You are GuideMate AI, an elite, warm, and knowledgeable personal travel concierge for Indian and international destinations. You specialize in: travel advice, hidden gems, hotel recommendations, food recommendations, local cultural suggestions, budget advice, itinerary explanations, and guide recommendations. Respond warmly, concisely, and use emojis and bullet points where helpful. Always end with a practical tip.`
            },
            ...formattedHistory
          ],
          max_tokens: 800,
          temperature: 0.75
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

  // ============================================================
  // Intelligent Fallback Concierge (works without API key)
  // ============================================================
  const msgLower = message.toLowerCase();
  let aiResponse;

  if (msgLower.includes('jaipur')) {
    if (msgLower.includes('tonight') || msgLower.includes('evening') || msgLower.includes('night')) {
      aiResponse = '🌙 **Jaipur After Dark — Tonight\'s Guide**\n\n🍽️ **Dinner:**\n• **Chokhi Dhani** — Rajasthani heritage village with folk dance, puppet shows & thali (₹650/person)\n• **Peacock Rooftop Restaurant** — Panoramic views of the Pink City with fairy lights\n\n🏰 **Sightseeing:**\n• **Hawa Mahal lit facade** — Magical for photography after 7 PM\n• **Jal Mahal** — The floating palace glows beautifully at dusk\n\n🛍️ **Shopping:**\n• **Johari Bazaar** — Vibrant evening market for gems, jewelry & textiles\n\n💡 **Pro Tip:** Book a GuideMate City Expert who knows the hidden rooftop cafes and can negotiate at Johari Bazaar!';
    } else if (msgLower.includes('food') || msgLower.includes('eat') || msgLower.includes('restaurant')) {
      aiResponse = '🍛 **Jaipur Food Guide by GuideMate AI**\n\n**Must-Try Street Foods:**\n• **Pyaaz Kachori** at Rawat Mishthan Bhandar — the city\'s iconic breakfast (₹20)\n• **Dal Baati Churma** at Lassiwala — quintessential Rajasthani\n• **Ghewar** (seasonal sweet) from Natraj Restaurant\n\n**Restaurants:**\n• **Suvarna Mahal, Rambagh Palace** — Royal dining in a heritage palace\n• **Niro\'s on MI Road** — 70-year landmark, excellent laal maas\n• **Bar Palladio** — Italian in a stunning blue Mughal garden\n\n💡 **Tip:** Ask your GuideMate guide to take you to the local street food lane behind Badi Chaupar!';
    } else if (msgLower.includes('hidden') || msgLower.includes('gem')) {
      aiResponse = '💎 **Jaipur Hidden Gems — Beyond the Forts**\n\n• **Panna Meena Ka Kund** — Stunning geometric stepwell, almost no tourists\n• **Galta Ji (Monkey Temple)** — Ancient pilgrimage site with natural springs in the Aravalli hills\n• **Sisodiya Rani Garden** — Baroque terraced garden with Rajput murals\n• **Bhangarh Fort** — Mysterious abandoned city 90 mins away (ask your guide!)\n• **Anokhi Museum of Handprinting** — Fascinating textile heritage in Amber village\n\n💡 **Book a Heritage Expert guide** who can unlock the backstories behind these places!';
    } else {
      aiResponse = '🏰 **Jaipur — The Pink City Guide**\n\n**Top Attractions:** Amber Fort, Hawa Mahal, City Palace, Jantar Mantar (UNESCO)\n\n**Best Time:** October–March\n\n**Daily Budget:**\n• Budget: ₹1,500–2,500 | Mid: ₹3,500–6,000 | Luxury: ₹10,000+\n\n💡 **GuideMate Tip:** A City Expert (₹600/hr) knows secret routes, speaks to vendors, and brings every fort to life with real stories!';
    }
  } else if (msgLower.includes('charminar') || msgLower.includes('hyderabad')) {
    if (msgLower.includes('food') || msgLower.includes('eat') || msgLower.includes('biryani')) {
      aiResponse = '🕌 **Hyderabad Food Guide — City of Biryani**\n\n**Near Charminar:**\n• **Hotel Shadab** — Legendary mutton biryani & haleem since 1953 (₹250–350)\n• **Nimrah Cafe & Bakery** — Irani chai + Osmania biscuits next to Charminar\n• **Hameedi Confectioners** — Jouzi Halwa & Lukhmi pastries, 150-year institution\n• **Pista House** — Best haleem in the city, especially during Ramzan\n\n**Fine Dining:**\n• **Bawarchi Restaurant** — Authentic dum pukht biryani (always queue, always worth it)\n\n💡 **Pro Tip:** Your GuideMate guide knows exactly when the Laad Bazaar kebab stalls light up after Maghrib prayer!';
    } else if (msgLower.includes('hidden') || msgLower.includes('gem')) {
      aiResponse = '💎 **Hyderabad Hidden Gems**\n\n• **Taramati Baradari** — Mughal pavilion with stunning night light shows\n• **Moazzam Jahi Market** — 1930s art deco market hall, stunning architecture\n• **Purani Haveli** — The Nizam\'s private palace, less visited than Chowmahalla\n• **Necklace Road at Dawn** — Hussain Sagar lake walk with local chai at sunrise\n\n💡 **Book a GuideMate Old City Expert** for a 3-hour walking tour of the Charminar quarter!';
    } else {
      aiResponse = '🌟 **Hyderabad — City of Pearls & Biryanis**\n\n**Must-Visit:** Charminar, Chowmahalla Palace, Golconda Fort, Salar Jung Museum\n\n**Shopping:** Laad Bazaar (bangles), Abids Market (antiques)\n\n**Best Time:** November–February\n\n💡 **GuideMate Insight:** Hyderabad has two souls — sleek Hitech City and medieval Old City. A local guide bridges both perfectly!';
    }
  } else if (msgLower.includes('delhi')) {
    if (msgLower.includes('hidden') || msgLower.includes('gem') || msgLower.includes('secret')) {
      aiResponse = '🌳 **Delhi\'s Best-Kept Secrets**\n\n• **Agrasen ki Baoli** — 14th century stepwell between Connaught Place skyscrapers\n• **Sunder Nursery** — Restored Mughal garden with migratory birds & art installations\n• **Majnu Ka Tilla (Little Tibet)** — Tibetan colony with incredible momos & monasteries\n• **Lado Sarai Village** — Artist studios in a medieval village absorbed by South Delhi\n• **Mehrauli Archaeological Park** — 100+ medieval monuments, almost zero tourists\n\n💡 **Book a GuideMate Delhi Heritage Expert** — they\'ll take you places Google Maps doesn\'t know!';
    } else if (msgLower.includes('food') || msgLower.includes('eat')) {
      aiResponse = '🍢 **Delhi Street Food Guide**\n\n**Old Delhi (Chandni Chowk):**\n• **Paranthe Wali Gali** — Stuffed parathas with 150 years of flavor\n• **Karim\'s** — Legendary Mughal-era mutton korma & seekh kebabs\n• **Natraj Dahi Bhalle Wala** — Best dahi bhalle in the city since 1940\n\n**South Delhi:**\n• **Hauz Khas Village** — Cafes & rooftop dining by a medieval fort\n• **Dilli Haat** — Food stalls from every Indian state\n\n💡 **Pro Tip:** GuideMate street food guides run exclusive dawn food walks starting at 6 AM!';
    } else {
      aiResponse = '🏛️ **Delhi — India\'s Capital of History & Chaos**\n\n**Essential Sights:** Red Fort, Qutub Minar (UNESCO), Humayun\'s Tomb (UNESCO), India Gate\n\n**Neighborhoods:** Chandni Chowk (Old Delhi), Lodi Colony (street art), Hauz Khas (cafes)\n\n**Day Budget:** ₹1,200–₹8,000 depending on style\n\n💡 **GuideMate Tip:** Delhi\'s Metro has 400 stations — your City Expert knows which exit reaches each monument!';
    }
  } else if (msgLower.includes('mumbai') || msgLower.includes('bombay')) {
    aiResponse = '🌊 **Mumbai — Maximum City Guide**\n\n**Iconic Spots:** Gateway of India, Marine Drive, Elephanta Caves (UNESCO), Dharavi Creative Quarter\n\n**Food:**\n• **Vada Pav** at Kirti College junction — the city\'s soul food (₹15)\n• **Seafood at Mahesh Lunch Home** — coastal fish curry perfection\n• **Bade Miya** in Colaba — late-night kebabs since 1946\n\n💡 **Hidden Gem:** Chor Bazaar on Friday mornings — antique treasures at negotiable prices!';
  } else if (msgLower.includes('goa')) {
    aiResponse = '🏖️ **Goa — Beyond the Beach Parties**\n\n**Hidden Gems:**\n• **Divar Island** — Peaceful Portuguese village via ferry, zero tourists\n• **Fontainhas (Latin Quarter)** — Pastel-colored heritage streets in Panaji\n• **Cabo de Rama Fort** — Dramatic cliffside fort with ocean views\n\n**Food:**\n• **Fisherman\'s Wharf** — Fresh catch on the Sal river\n• **Viva Panjim** — Authentic Goan pork vindaloo in a heritage home\n\n💡 **GuideMate Tip:** Skip crowded Baga — ask your guide to take you to Butterfly Beach, reachable only by boat!';
  } else if (msgLower.includes('varanasi') || msgLower.includes('benaras') || msgLower.includes('kashi')) {
    aiResponse = '🕯️ **Varanasi — The Eternal City**\n\n**Essential Experiences:**\n• **Ganga Aarti at Dashashwamedh Ghat** (7 PM) — India\'s most profound ritual\n• **Boat Ride at Dawn** — watch the city wake up from the river\n• **Kashi Vishwanath Temple** — ancient Shiva temple in old city lanes\n\n**Food:** Banarasi paan, malai lassi at Blue Lassi, thandai, kachori sabzi\n\n💡 **Book a GuideMate Spiritual Expert** for the full Ganga Aarti experience with backstory!';
  } else if (msgLower.includes('budget') || msgLower.includes('cost') || msgLower.includes('cheap') || msgLower.includes('money') || msgLower.includes('expense')) {
    aiResponse = '💰 **Smart Travel Budget Strategy — GuideMate AI**\n\n**Budget Allocation (₹5,000/day example):**\n• 🏨 **Accommodation (35%)** — ₹1,750: Heritage homestays beat chain hotels\n• 🍽️ **Food (20%)** — ₹1,000: Local dhabas + 1 nice restaurant/day\n• 🗺️ **Guide (20%)** — ₹1,000: GuideMate Basic (₹300/hr) or City Expert (₹600/hr)\n• 🚗 **Transport (15%)** — ₹750: Mix metro, Ola/Uber & autos\n• 🎟️ **Entry Fees (10%)** — ₹500: Monuments + experiences\n\n**Money-Saving Secrets:**\n• Visit monuments early morning to beat queues\n• Eat where local workers eat — follow the noon queues\n• Use city metro wherever possible (25x cheaper than Uber)\n\n💡 **Pro Tip:** ₹600/hr for a City Expert saves you ₹2,000+ on entry fees, scams & bad restaurants!';
  } else if (msgLower.includes('hotel') || msgLower.includes('stay') || msgLower.includes('accommodation')) {
    aiResponse = '🏨 **Hotel Recommendations by GuideMate AI**\n\n**Delhi:**\n• Luxury: The Leela Ambience, ITC Maurya\n• Boutique: Haveli Dharampura, The Manor\n• Budget: Zostel Delhi, Bloomrooms\n\n**Jaipur:**\n• Heritage: Rambagh Palace, Samode Haveli\n• Mid-range: Alsisar Haveli\n• Budget: Zostel Jaipur\n\n**Mumbai:**\n• Luxury: Taj Mahal Palace\n• Boutique: Abode Bombay\n• Budget: Backpacker Panda\n\n**Varanasi:**\n• Heritage: BrijRama Palace (Ganga view)\n• Boutique: Suryauday Haveli\n\n💡 **Book early** — heritage properties fill up months ahead, especially in winter!';
  } else if (msgLower.includes('guide') || msgLower.includes('tour') || msgLower.includes('local')) {
    aiResponse = '🙋 **GuideMate Guide Packages**\n\n**1. 🗺️ Basic Local Guide — ₹300/hr**\n   Navigate markets, transport & basic orientation\n\n**2. 🏛️ City Expert — ₹600/hr**\n   Deep historical knowledge, monument storytelling, hidden spots\n\n**3. 👑 Premium Guide — ₹1,200/hr**\n   Luxury experiences, fine dining access, exclusive access\n\n**4. 🌍 Foreigner Pack — ₹2,000+/hr**\n   Multilingual, visa support, full concierge service\n\n**What to ask your guide:**\n• "What\'s the least touristy route to [monument]?"\n• "Where do locals eat near here?"\n• "Any festivals this week?"\n\n💡 All GuideMate guides are verified, background-checked & rated 4.5+!';
  } else if (msgLower.includes('hidden') || msgLower.includes('gem') || msgLower.includes('offbeat')) {
    aiResponse = '💎 **India\'s Best Hidden Gems — GuideMate Exclusive**\n\n• **Hampi, Karnataka** — Surreal boulder landscape with Vijayanagara ruins (UNESCO)\n• **Ziro Valley, Arunachal** — Paddy fields & tribal culture, barely discovered\n• **Mawlynnong, Meghalaya** — Asia\'s cleanest village with living root bridges\n• **Orchha, Madhya Pradesh** — Medieval Bundelkhand town with beautiful ghats\n• **Gokarna, Karnataka** — Sacred temple town with secluded beaches (pre-Goa vibes)\n\n💡 Ask your GuideMate guide about offbeat trails — they know places not on any app!';
  } else if (msgLower.includes('itinerary') || msgLower.includes('plan') || msgLower.includes('days') || msgLower.includes('schedule')) {
    aiResponse = '📅 **Itinerary Planning — GuideMate AI**\n\nTell me more and I\'ll build a personalized plan!\n\n• 📍 **Where** are you going?\n• ⏱️ **How many days** do you have?\n• 💰 **What\'s your budget?**\n• 🎯 **Interests?** (History / Food / Adventure / Photography / Spiritual)\n\n**Quick Frameworks:**\n• **3 days Delhi:** Old Delhi → New Delhi → Agra day trip\n• **5 days Rajasthan:** Jaipur → Pushkar → Jodhpur\n• **4 days Kerala:** Alleppey backwaters → Munnar → Kovalam\n\n💡 Use our **AI Trip Planner** on the dashboard for a full plan + guide match + interactive map!';
  } else {
    aiResponse = '✨ **GuideMate AI — Your Personal Travel Concierge**\n\nI\'m here to help you travel smarter! Ask me about:\n\n• 🗺️ Travel advice for any city\n• 💎 Hidden gems tourists miss\n• 🏨 Hotel recommendations (any budget)\n• 🍽️ Best food spots and local eats\n• 📍 Local cultural tips and customs\n• 💰 Budget planning and cost breakdowns\n• 📅 Day-by-day itinerary help\n• 🙋 Guide packages and recommendations\n\n**Try:** _"What can I do tonight in Jaipur?"_ or _"Best food near Charminar?"_';
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
    
    const availableGuides = await db.getGuides();
    // Orchestrate all 4 AI agents
    const result = await orchestrateTripPlanning(
      { destination, days, budget, interests },
      availableGuides
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
