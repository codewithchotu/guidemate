import pg from 'pg';
import { MongoClient } from 'mongodb';
import { SAMPLE_GUIDES } from '../src/data/guideData.js';

// Check if environment variables are provided
const hasPg = !!process.env.DATABASE_URL;
const hasMongo = !!process.env.MONGODB_URI;

let pgPool = null;
let mongoClient = null;
let mongoDb = null;

// Simulated/In-memory fallback databases
const mockDb = {
  users: [
    { uid: 'mock_traveler_1', name: 'John Doe', email: 'john@example.com', role: 'traveler', trustScore: 92 },
    { uid: 'mock_supervisor_1', name: 'Admin User', email: 'admin@example.com', role: 'supervisor', trustScore: 100 },
    ...SAMPLE_GUIDES.map(g => ({
      uid: g.id,
      name: g.name,
      email: `${g.name.toLowerCase().replace(/ /g, '')}@example.com`,
      role: 'guide',
      trustScore: Math.round(g.rating * 20)
    }))
  ],
  guides: SAMPLE_GUIDES.map(g => ({
    ...g,
    userId: g.id, // Map frontend 'id' to backend 'userId'
    online: true  // Keep all mock guides online for real-time match demos
  })),
  bookings: [],
  reviews: [],
  trustScores: {},
  coupons: [
    { code: 'WELCOME20', discount: 20, type: 'percentage' },
    { code: 'REFER200', discount: 200, type: 'fixed' },
    { code: 'FESTIVAL30', discount: 30, type: 'percentage' }
  ],
  transactions: [],
  earnings: {
    today: 1800,
    weekly: 12500,
    monthly: 48000,
    tripsCompleted: 34,
    hoursWorked: 68,
    acceptanceRate: 92,
    cancellationRate: 4
  },
  supervisorLogs: [],
  chats: {},
  itineraries: {}
};

// Database Initialization
export async function initDb() {
  if (hasPg) {
    try {
      console.log('Connecting to PostgreSQL database...');
      pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
      
      // Create tables if they do not exist
      await pgPool.query(`
        CREATE TABLE IF NOT EXISTS users (
          uid VARCHAR(128) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          role VARCHAR(32) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS guides (
          user_id VARCHAR(128) REFERENCES users(uid) PRIMARY KEY,
          location VARCHAR(255) NOT NULL,
          rating DECIMAL(3,2) DEFAULT 5.0,
          hourly_rate INT NOT NULL,
          packages TEXT[] NOT NULL,
          verified BOOLEAN DEFAULT FALSE,
          online BOOLEAN DEFAULT FALSE,
          lat DECIMAL(9,6),
          lng DECIMAL(9,6),
          about TEXT
        );

        CREATE TABLE IF NOT EXISTS bookings (
          id VARCHAR(128) PRIMARY KEY,
          traveler_id VARCHAR(128) REFERENCES users(uid),
          guide_id VARCHAR(128) REFERENCES users(uid),
          package VARCHAR(64) NOT NULL,
          status VARCHAR(64) NOT NULL,
          destination VARCHAR(255) NOT NULL,
          duration INT NOT NULL,
          group_size INT DEFAULT 1,
          total_price INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          booking_id VARCHAR(128) REFERENCES bookings(id),
          rating INT NOT NULL,
          comment TEXT,
          target VARCHAR(32) NOT NULL, -- 'guide' or 'traveler'
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS trust_scores (
          user_id VARCHAR(128) PRIMARY KEY,
          score INT DEFAULT 100,
          badge VARCHAR(32) DEFAULT 'Elite',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS coupons (
          code VARCHAR(32) PRIMARY KEY,
          discount INT NOT NULL,
          type VARCHAR(32) NOT NULL,
          min_travelers INT DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS transactions (
          id SERIAL PRIMARY KEY,
          booking_id VARCHAR(128) REFERENCES bookings(id),
          amount INT NOT NULL,
          status VARCHAR(32) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS earnings (
          guide_id VARCHAR(128) REFERENCES users(uid) PRIMARY KEY,
          today INT DEFAULT 0,
          weekly INT DEFAULT 0,
          monthly INT DEFAULT 0,
          trips_completed INT DEFAULT 0,
          hours_worked INT DEFAULT 0,
          acceptance_rate INT DEFAULT 100,
          cancellation_rate INT DEFAULT 0
        );
      `);
      console.log('PostgreSQL tables initialized.');
    } catch (err) {
      console.error('Failed to initialize PostgreSQL. Falling back to Mock DB.', err.message);
      pgPool = null;
    }
  } else {
    console.log('No DATABASE_URL found. Running with Mock PostgreSQL fallback.');
  }

  if (hasMongo) {
    try {
      console.log('Connecting to MongoDB database...');
      mongoClient = new MongoClient(process.env.MONGODB_URI);
      await mongoClient.connect();
      mongoDb = mongoClient.db('guidemate');
      console.log('MongoDB connection initialized.');
    } catch (err) {
      console.error('Failed to initialize MongoDB. Falling back to Mock DB.', err.message);
      mongoClient = null;
    }
  } else {
    console.log('No MONGODB_URI found. Running with Mock MongoDB fallback.');
  }
}

// Database Helper APIs
export const db = {
  // Users API
  async saveUser(user) {
    if (pgPool) {
      await pgPool.query(
        'INSERT INTO users (uid, name, email, role) VALUES ($1, $2, $3, $4) ON CONFLICT (uid) DO UPDATE SET name = $2, role = $4',
        [user.uid, user.name, user.email, user.role]
      );
      // Initialize trust score
      await pgPool.query(
        'INSERT INTO trust_scores (user_id, score, badge) VALUES ($1, 100, \'Elite\') ON CONFLICT DO NOTHING',
        [user.uid]
      );
      return user;
    } else {
      const idx = mockDb.users.findIndex(u => u.uid === user.uid);
      if (idx !== -1) {
        mockDb.users[idx] = { ...mockDb.users[idx], ...user };
      } else {
        mockDb.users.push({ ...user, trustScore: 100 });
      }
      return user;
    }
  },

  async getUser(uid) {
    if (pgPool) {
      const res = await pgPool.query(
        'SELECT u.*, t.score as trust_score, t.badge as trust_badge FROM users u LEFT JOIN trust_scores t ON u.uid = t.user_id WHERE u.uid = $1',
        [uid]
      );
      if (res.rows.length === 0) return null;
      const row = res.rows[0];
      return { uid: row.uid, name: row.name, email: row.email, role: row.role, trustScore: row.trust_score, trustBadge: row.trust_badge };
    } else {
      return mockDb.users.find(u => u.uid === uid) || null;
    }
  },

  // Guides API
  async getGuides() {
    if (pgPool) {
      const res = await pgPool.query(`
        SELECT u.uid as user_id, u.name, u.email, g.location, g.rating, g.hourly_rate, g.packages, g.verified, g.online, g.lat, g.lng, g.about, t.score as trust_score
        FROM guides g
        JOIN users u ON g.user_id = u.uid
        LEFT JOIN trust_scores t ON g.user_id = t.user_id
      `);
      return res.rows.map(r => ({
        userId: r.user_id,
        name: r.name,
        email: r.email,
        location: r.location,
        rating: parseFloat(r.rating || 5),
        hourlyRate: r.hourly_rate,
        packages: r.packages,
        verified: r.verified,
        online: r.online,
        lat: parseFloat(r.lat || 0),
        lng: parseFloat(r.lng || 0),
        about: r.about,
        trustScore: r.trust_score || 100
      }));
    } else {
      return mockDb.guides;
    }
  },

  async updateGuideStatus(userId, online, lat = null, lng = null) {
    if (pgPool) {
      await pgPool.query(
        'UPDATE guides SET online = $1, lat = COALESCE($2, lat), lng = COALESCE($3, lng) WHERE user_id = $4',
        [online, lat, lng, userId]
      );
    } else {
      const guide = mockDb.guides.find(g => g.userId === userId);
      if (guide) {
        guide.online = online;
        if (lat) guide.lat = lat;
        if (lng) guide.lng = lng;
      }
    }
  },

  async saveGuide(guideDetails) {
    const { userId, location, hourlyRate, packages, about } = guideDetails;
    if (pgPool) {
      await pgPool.query(
        'INSERT INTO guides (user_id, location, hourly_rate, packages, about, verified) VALUES ($1, $2, $3, $4, $5, TRUE) ON CONFLICT (user_id) DO UPDATE SET location = $2, hourly_rate = $3, packages = $4, about = $5',
        [userId, location, hourlyRate, packages, about]
      );
    } else {
      const existing = mockDb.guides.find(g => g.userId === userId);
      const user = mockDb.users.find(u => u.uid === userId);
      if (existing) {
        existing.location = location;
        existing.hourlyRate = hourlyRate;
        existing.packages = packages;
        existing.about = about;
      } else {
        mockDb.guides.push({
          userId,
          name: user ? user.name : 'Guide User',
          location,
          rating: 5.0,
          reviews: 0,
          languages: ['English', 'Hindi'],
          specializations: ['Culture', 'Historical'],
          packages,
          image: '👨‍💼',
          verified: true,
          badge: '⭐ Local',
          experience: '1 year',
          responseTime: '< 5 min',
          hourlyRate,
          about,
          availableToday: true,
          online: false,
          lat: 28.6139,
          lng: 77.2090
        });
      }
    }
  },

  // Bookings API
  async createBooking(booking) {
    const { id, travelerId, guideId, packageType, destination, duration, groupSize, totalPrice } = booking;
    if (pgPool) {
      await pgPool.query(
        'INSERT INTO bookings (id, traveler_id, guide_id, package, status, destination, duration, group_size, total_price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [id, travelerId, guideId, packageType, 'pending', destination, duration, groupSize, totalPrice]
      );
      return booking;
    } else {
      const newBooking = { ...booking, id, status: 'pending', createdAt: new Date() };
      mockDb.bookings.push(newBooking);
      return newBooking;
    }
  },

  async updateBookingStatus(id, status) {
    if (pgPool) {
      await pgPool.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, id]);
    } else {
      const b = mockDb.bookings.find(booking => booking.id === id);
      if (b) {
        b.status = status;
        b.updatedAt = new Date();
      }
    }
  },

  async getBookings() {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM bookings ORDER BY created_at DESC');
      return res.rows;
    } else {
      return mockDb.bookings;
    }
  },

  // Trust Scores API
  async updateTrustScore(userId, change) {
    if (pgPool) {
      const res = await pgPool.query('SELECT score FROM trust_scores WHERE user_id = $1', [userId]);
      let currentScore = 100;
      if (res.rows.length > 0) {
        currentScore = res.rows[0].score;
      }
      const newScore = Math.max(0, Math.min(100, currentScore + change));
      let badge = 'Average';
      if (newScore >= 95) badge = 'Elite';
      else if (newScore >= 80) badge = 'Trusted';
      else if (newScore < 60) badge = 'Needs Review';

      await pgPool.query(
        'INSERT INTO trust_scores (user_id, score, badge, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) ON CONFLICT (user_id) DO UPDATE SET score = $2, badge = $3, updated_at = CURRENT_TIMESTAMP',
        [userId, newScore, badge]
      );
    } else {
      const user = mockDb.users.find(u => u.uid === userId);
      if (user) {
        const currentScore = user.trustScore || 100;
        const newScore = Math.max(0, Math.min(100, currentScore + change));
        user.trustScore = newScore;
        let badge = 'Average';
        if (newScore >= 95) badge = 'Elite';
        else if (newScore >= 80) badge = 'Trusted';
        else if (newScore < 60) badge = 'Needs Review';
        user.trustBadge = badge;
      }
    }
  },

  // MongoDB Responsibilities (Fallback to Mock Memory)
  async saveChat(bookingId, messages) {
    if (mongoDb) {
      await mongoDb.collection('chats').updateOne(
        { bookingId },
        { $set: { messages, updatedAt: new Date() } },
        { upsert: true }
      );
    } else {
      mockDb.chats[bookingId] = messages;
    }
  },

  async getChat(bookingId) {
    if (mongoDb) {
      const chatDoc = await mongoDb.collection('chats').findOne({ bookingId });
      return chatDoc ? chatDoc.messages : [];
    } else {
      return mockDb.chats[bookingId] || [];
    }
  },

  async saveItinerary(bookingId, itinerary) {
    if (mongoDb) {
      await mongoDb.collection('itineraries').updateOne(
        { bookingId },
        { $set: { itinerary, updatedAt: new Date() } },
        { upsert: true }
      );
    } else {
      mockDb.itineraries[bookingId] = itinerary;
    }
  },

  async getItinerary(bookingId) {
    if (mongoDb) {
      const itDoc = await mongoDb.collection('itineraries').findOne({ bookingId });
      return itDoc ? itDoc.itinerary : null;
    } else {
      return mockDb.itineraries[bookingId] || null;
    }
  }
};
