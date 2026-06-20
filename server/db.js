import pg from 'pg';
import { MongoClient } from 'mongodb';

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
    { uid: 'mock_guide_1', name: 'Raj Kumar', email: 'raj@example.com', role: 'guide', trustScore: 98 },
    { uid: 'mock_guide_2', name: 'Priya Singh', email: 'priya@example.com', role: 'guide', trustScore: 97 },
    { uid: 'mock_guide_3', name: 'Arjun Patel', email: 'arjun@example.com', role: 'guide', trustScore: 99 },
    { uid: 'mock_guide_4', name: 'Anjali Mishra', email: 'anjali@example.com', role: 'guide', trustScore: 96 },
    { uid: 'mock_guide_5', name: 'Marco Silva', email: 'marco@example.com', role: 'guide', trustScore: 99 },
    { uid: 'mock_guide_6', name: 'Vikram Malhotra', email: 'vikram@example.com', role: 'guide', trustScore: 99 },
    { uid: 'mock_guide_7', name: 'Neha Sharma', email: 'neha@example.com', role: 'guide', trustScore: 97 },
    { uid: 'mock_guide_8', name: 'Rohan Deshmukh', email: 'rohan@example.com', role: 'guide', trustScore: 98 },
    { uid: 'mock_guide_9', name: 'Sneha Patil', email: 'sneha@example.com', role: 'guide', trustScore: 96 },
    { uid: 'mock_guide_10', name: 'Kabir Sharma', email: 'kabir@example.com', role: 'guide', trustScore: 98 },
    { uid: 'mock_guide_11', name: 'Meera Bai', email: 'meera@example.com', role: 'guide', trustScore: 97 },
    { uid: 'mock_guide_12', name: 'Rajesh Shastri', email: 'rajesh@example.com', role: 'guide', trustScore: 99 },
    { uid: 'mock_guide_13', name: 'Divya Pandey', email: 'divya@example.com', role: 'guide', trustScore: 98 },
    { uid: 'mock_supervisor_1', name: 'Admin User', email: 'admin@example.com', role: 'supervisor', trustScore: 100 }
  ],
  guides: [
    {
      userId: 'mock_guide_1',
      name: 'Raj Kumar',
      location: 'Delhi',
      rating: 4.8,
      reviews: 247,
      languages: ['Hindi', 'English'],
      specializations: ['Historical', 'Architecture', 'Street Food'],
      packages: ['basic', 'expert', 'premium', 'foreigner_pack'],
      image: '👨‍💼',
      verified: true,
      badge: '⭐ Expert',
      experience: '3 years',
      responseTime: '< 5 min',
      hourlyRate: 600,
      about: 'Passionate about Delhi history. 3 years of experience guiding tourists.',
      availableToday: true,
      online: true,
      lat: 28.6562,
      lng: 77.2410
    },
    {
      userId: 'mock_guide_2',
      name: 'Priya Singh',
      location: 'Mumbai',
      rating: 4.7,
      reviews: 189,
      languages: ['Hindi', 'English', 'Marathi'],
      specializations: ['Culture', 'Art', 'Shopping'],
      packages: ['basic', 'expert', 'premium'],
      image: '👩‍💼',
      verified: true,
      badge: '⭐ Premium',
      experience: '2.5 years',
      responseTime: '< 8 min',
      hourlyRate: 500,
      about: 'Local Mumbaikar exploring city\'s cultural heritage.',
      availableToday: true,
      online: true,
      lat: 18.9220,
      lng: 72.8347
    },
    {
      userId: 'mock_guide_3',
      name: 'Arjun Patel',
      location: 'Jaipur',
      rating: 4.9,
      reviews: 342,
      languages: ['Hindi', 'English', 'French'],
      specializations: ['Palace Tours', 'Architecture', 'Photography'],
      packages: ['expert', 'premium', 'foreigner_pack'],
      image: '👨‍🔬',
      verified: true,
      badge: '⭐ Elite',
      experience: '4 years',
      responseTime: '< 3 min',
      hourlyRate: 800,
      about: 'Expert in Rajasthani culture and palace architecture.',
      availableToday: true,
      online: true,
      lat: 26.9239,
      lng: 75.8267
    },
    {
      userId: 'mock_guide_4',
      name: 'Anjali Mishra',
      location: 'Varanasi',
      rating: 4.6,
      reviews: 156,
      languages: ['Hindi', 'English', 'Sanskrit'],
      specializations: ['Spiritual', 'Religious Sites', 'Cultural'],
      packages: ['basic', 'expert'],
      image: '🧘‍♀️',
      verified: true,
      badge: '⭐ Expert',
      experience: '2 years',
      responseTime: '< 10 min',
      hourlyRate: 400,
      about: 'Spiritual guide with deep knowledge of Varanasi\'s temples and rituals.',
      availableToday: true,
      online: true,
      lat: 25.3076,
      lng: 82.9739
    },
    {
      userId: 'mock_guide_5',
      name: 'Marco Silva',
      location: 'Mumbai',
      rating: 4.9,
      reviews: 298,
      languages: ['English', 'Portuguese', 'Spanish'],
      specializations: ['Nightlife', 'Adventure', 'Beach'],
      packages: ['premium', 'foreigner_pack'],
      image: '🌍',
      verified: true,
      badge: '⭐ Elite Multilingual',
      experience: '5 years',
      responseTime: '< 5 min',
      hourlyRate: 1200,
      about: 'International guide specializing in beach and adventure experiences.',
      availableToday: true,
      online: true,
      lat: 18.9400,
      lng: 72.8250
    },
    {
      userId: 'mock_guide_6',
      name: 'Vikram Malhotra',
      location: 'Delhi',
      rating: 4.9,
      reviews: 312,
      languages: ['Hindi', 'English', 'Punjabi'],
      specializations: ['Historical', 'Photography', 'Heritage Walks'],
      packages: ['basic', 'expert', 'premium'],
      image: '👨‍💼',
      verified: true,
      badge: '⭐ Elite',
      experience: '4 years',
      responseTime: '< 4 min',
      hourlyRate: 800,
      about: 'Photographer and history buff, helping you capture Delhi\'s best moments.',
      availableToday: true,
      online: true,
      lat: 28.6304,
      lng: 77.2177
    },
    {
      userId: 'mock_guide_7',
      name: 'Neha Sharma',
      location: 'Delhi',
      rating: 4.7,
      reviews: 94,
      languages: ['Hindi', 'English'],
      specializations: ['Street Food', 'Shopping', 'Spices Bazaar'],
      packages: ['basic', 'expert'],
      image: '👩‍💼',
      verified: true,
      badge: '⭐ Expert',
      experience: '2 years',
      responseTime: '< 6 min',
      hourlyRate: 500,
      about: 'Food enthusiast ready to guide you through the historic alleys of Chandni Chowk.',
      availableToday: true,
      online: true,
      lat: 28.6590,
      lng: 77.2285
    },
    {
      userId: 'mock_guide_8',
      name: 'Rohan Deshmukh',
      location: 'Mumbai',
      rating: 4.8,
      reviews: 142,
      languages: ['Hindi', 'English', 'Marathi'],
      specializations: ['Bollywood Tours', 'Colonial Buildings', 'Local Life'],
      packages: ['basic', 'expert', 'premium', 'foreigner_pack'],
      image: '👨‍💼',
      verified: true,
      badge: '⭐ Premium',
      experience: '3 years',
      responseTime: '< 5 min',
      hourlyRate: 700,
      about: 'Vibrant local host showcasing real Mumbai street-style lifestyle and cinema history.',
      availableToday: true,
      online: true,
      lat: 19.0596,
      lng: 72.8295
    },
    {
      userId: 'mock_guide_9',
      name: 'Sneha Patil',
      location: 'Mumbai',
      rating: 4.6,
      reviews: 78,
      languages: ['Hindi', 'English', 'Gujarati'],
      specializations: ['Bazaars', 'Street Food', 'Local Trains Guide'],
      packages: ['basic', 'expert'],
      image: '👩‍💼',
      verified: true,
      badge: '⭐ Local',
      experience: '1.5 years',
      responseTime: '< 7 min',
      hourlyRate: 450,
      about: 'Local college grad specializing in budget-friendly walks and shopping hacks in Mumbai.',
      availableToday: true,
      online: true,
      lat: 19.1026,
      lng: 72.8262
    },
    {
      userId: 'mock_guide_10',
      name: 'Kabir Sharma',
      location: 'Jaipur',
      rating: 4.8,
      reviews: 165,
      languages: ['Hindi', 'English'],
      specializations: ['Forts', 'Palace Tours', 'Heritage Walk'],
      packages: ['basic', 'expert', 'premium'],
      image: '👨‍💼',
      verified: true,
      badge: '⭐ Expert',
      experience: '3 years',
      responseTime: '< 5 min',
      hourlyRate: 600,
      about: 'Expert guide on Amber Palace and Jaigarh Fort. Enthusiastic narrator of Rajput history.',
      availableToday: true,
      online: true,
      lat: 26.9855,
      lng: 75.8513
    },
    {
      userId: 'mock_guide_11',
      name: 'Meera Bai',
      location: 'Jaipur',
      rating: 4.7,
      reviews: 82,
      languages: ['Hindi', 'English', 'Spanish'],
      specializations: ['Bazaars', 'Textiles', 'Handicrafts'],
      packages: ['basic', 'expert'],
      image: '👩‍💼',
      verified: true,
      badge: '⭐ Local',
      experience: '2 years',
      responseTime: '< 6 min',
      hourlyRate: 550,
      about: 'Curated shopping trips for block-printing textiles and gemstone jewels in Jaipur markets.',
      availableToday: true,
      online: true,
      lat: 26.9535,
      lng: 75.8455
    },
    {
      userId: 'mock_guide_12',
      name: 'Rajesh Shastri',
      location: 'Varanasi',
      rating: 4.9,
      reviews: 215,
      languages: ['Hindi', 'English', 'Sanskrit'],
      specializations: ['Ganga Aarti', 'Ghats Tour', 'Philosophy'],
      packages: ['basic', 'expert', 'premium'],
      image: '👨‍💼',
      verified: true,
      badge: '⭐ Elite',
      experience: '5 years',
      responseTime: '< 4 min',
      hourlyRate: 600,
      about: 'Vedic scholar with a deep connection to Varanasi\'s ancient traditions and ritual sites.',
      availableToday: true,
      online: true,
      lat: 25.3109,
      lng: 83.0105
    },
    {
      userId: 'mock_guide_13',
      name: 'Divya Pandey',
      location: 'Varanasi',
      rating: 4.8,
      reviews: 104,
      languages: ['Hindi', 'English', 'Bengali'],
      specializations: ['Culture', 'Weaving Villages', 'Sarnath Tour'],
      packages: ['basic', 'expert', 'foreigner_pack'],
      image: '🧘‍♀️',
      verified: true,
      badge: '⭐ Premium',
      experience: '3 years',
      responseTime: '< 5 min',
      hourlyRate: 500,
      about: 'Specialized weaver tours to Banarasi saree clusters, and Sarnath Buddhist ruins excursions.',
      availableToday: true,
      online: true,
      lat: 25.2899,
      lng: 83.0076
    }
  ],
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
