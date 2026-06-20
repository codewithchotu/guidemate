// ============================================
// GUIDE PACKAGES - Uber-like categories
// ============================================

export const GUIDE_PACKAGES = {
  BASIC: {
    id: 'basic',
    name: 'Basic Local Guide',
    description: 'Local sightseeing, navigation, basic city info',
    icon: '🗺️',
    basePrice: 300, // ₹/hour
    includes: [
      'Local sightseeing',
      'Navigation help',
      'Basic city information'
    ],
    requirements: {
      test: true,
      background: true,
      experience: 'No experience required'
    }
  },
  EXPERT: {
    id: 'expert',
    name: 'City Expert Guide',
    description: 'Historical info, famous attractions, cultural explanations',
    icon: '🏛️',
    basePrice: 600, // ₹/hour
    includes: [
      'Historical information',
      'Famous attractions',
      'Cultural explanations',
      'Better recommendations'
    ],
    requirements: {
      test: true,
      background: true,
      experience: 'Minimum 6 months experience'
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium Guide',
    description: 'Personalized tours, multiple attractions, premium experience',
    icon: '👑',
    basePrice: 1200, // ₹/hour
    includes: [
      'Personalized tours',
      'Better communication',
      'Multiple attraction planning',
      'Premium experience',
      'Priority support'
    ],
    requirements: {
      test: true,
      background: true,
      experience: 'Minimum 1 year experience',
      rating: 4.7
    }
  },
  FOREIGNER_PACK: {
    id: 'foreigner_pack',
    name: 'Foreigner Pack (Premium)',
    description: 'Multilingual, airport assist, cultural guidance, emergency support',
    icon: '🌍',
    basePrice: 2000, // ₹/hour (minimum)
    includes: [
      'Multilingual support',
      'Airport assistance',
      'Cultural guidance',
      'Currency & payment help',
      'Local safety support',
      'Tourist problem solving',
      'Emergency assistance',
      'Complete local companion experience',
      '24/7 support'
    ],
    requirements: {
      test: true,
      background: true,
      experience: 'Minimum 2 years',
      rating: 4.8,
      languages: 'Minimum 2 languages'
    }
  }
};

// ============================================
// PRICING MULTIPLIERS
// ============================================

export const PRICING_MULTIPLIERS = {
  // Based on number of travelers
  groupSize: {
    1: 1.0,
    2: 1.3,
    3: 1.5,
    4: 1.7,
    5: 2.0
  },
  
  // Guide rating multiplier (impact on price)
  ratingMultiplier: {
    3: 0.9,
    4: 1.0,
    4.5: 1.15,
    4.8: 1.35,
    5: 1.5
  },
  
  // Time of booking
  timeMultiplier: {
    instant: 1.0,
    scheduled_1_day: 0.95,
    scheduled_7_day: 0.90,
    scheduled_30_day: 0.85
  }
};

// ============================================
// GUIDE VERIFICATION TESTS
// ============================================

export const VERIFICATION_TESTS = {
  TOURISM_KNOWLEDGE: {
    id: 'tourism_knowledge',
    name: 'Tourism Knowledge Test',
    duration: 30, // minutes
    questions: 20,
    passingScore: 70,
    description: 'Test on local attractions, history, culture'
  },
  LANGUAGE_TEST: {
    id: 'language_test',
    name: 'Language Proficiency Test',
    duration: 20,
    questions: 15,
    passingScore: 75,
    description: 'Test on communication skills and language proficiency'
  },
  AREA_KNOWLEDGE: {
    id: 'area_knowledge',
    name: 'Area Knowledge Test',
    duration: 25,
    questions: 18,
    passingScore: 70,
    description: 'Test on local geography, transport, neighborhoods'
  }
};

// ============================================
// COUPON CODES
// ============================================

export const COUPONS = [
  {
    id: 'first_booking_20',
    code: 'WELCOME20',
    discount: 20,
    type: 'percentage',
    maxUses: 10000,
    description: '20% off on first booking',
    validFor: ['basic', 'expert'],
    expiryDays: 30
  },
  {
    id: 'referral_200',
    code: 'REFER200',
    discount: 200,
    type: 'fixed',
    maxUses: 5000,
    description: '₹200 off when you refer a friend',
    validFor: ['basic', 'expert', 'premium'],
    expiryDays: 90
  },
  {
    id: 'festival_offer_30',
    code: 'FESTIVAL30',
    discount: 30,
    type: 'percentage',
    maxUses: 5000,
    description: '30% off during festivals',
    validFor: ['all'],
    expiryDays: 7
  },
  {
    id: 'group_discount_25',
    code: 'GROUP25',
    discount: 25,
    type: 'percentage',
    minTravelers: 5,
    description: '25% off for groups of 5+ travelers',
    validFor: ['premium', 'foreigner_pack'],
    expiryDays: 60
  },
  {
    id: 'loyalty_500',
    code: 'LOYAL500',
    discount: 500,
    type: 'fixed',
    minBookings: 5,
    description: '₹500 off after 5 bookings (loyalty)',
    validFor: ['all'],
    expiryDays: 120
  }
];

// ============================================
// SAMPLE GUIDES DATA - 30+ GUIDES ACROSS 12 CITIES
// ============================================

export const SAMPLE_GUIDES = [
  // DELHI (3)
  {
    id: 'guide_001',
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
    about: 'Passionate about Delhi history. 3 years of experience guiding tourists from around the world.',
    availableToday: true,
    lat: 28.6562,
    lng: 77.2410
  },
  {
    id: 'guide_006',
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
    lat: 28.6304,
    lng: 77.2177
  },
  {
    id: 'guide_007',
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
    lat: 28.6590,
    lng: 77.2285
  },
  
  // MUMBAI (4)
  {
    id: 'guide_002',
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
    about: 'Local Mumbaikar exploring city\'s cultural heritage and modern vibe.',
    availableToday: true,
    lat: 18.9220,
    lng: 72.8347
  },
  {
    id: 'guide_005',
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
    about: 'International guide specializing in beach and adventure experiences. Expert in tourist logistics.',
    availableToday: true,
    lat: 18.9400,
    lng: 72.8250
  },
  {
    id: 'guide_008',
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
    lat: 19.0596,
    lng: 72.8295
  },
  {
    id: 'guide_009',
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
    lat: 19.1026,
    lng: 72.8262
  },
  
  // JAIPUR (3)
  {
    id: 'guide_003',
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
    about: 'Expert in Rajasthani culture and palace architecture. Multilingual guide for international tourists.',
    availableToday: true,
    lat: 26.9239,
    lng: 75.8267
  },
  {
    id: 'guide_010',
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
    lat: 26.9855,
    lng: 75.8513
  },
  {
    id: 'guide_011',
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
    lat: 26.9535,
    lng: 75.8455
  },
  
  // VARANASI (3) - used as 4th Indian city
  {
    id: 'guide_004',
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
    lat: 25.3076,
    lng: 82.9739
  },
  {
    id: 'guide_012',
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
    lat: 25.3109,
    lng: 83.0105
  },
  {
    id: 'guide_013',
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
    lat: 25.2899,
    lng: 83.0076
  },
  
  // HYDERABAD (3)
  {
    id: 'guide_014',
    name: 'Aravind Kumar',
    location: 'Hyderabad',
    rating: 4.9,
    reviews: 278,
    languages: ['Telugu', 'English', 'Hindi'],
    specializations: ['Historical', 'Biryani Tours', 'Old City'],
    packages: ['basic', 'expert', 'premium', 'foreigner_pack'],
    image: '👨‍💼',
    verified: true,
    badge: '⭐ Elite',
    experience: '4 years',
    responseTime: '< 4 min',
    hourlyRate: 700,
    about: 'Expert on Charminar history and authentic Hyderabadi cuisine. Fluent in multiple languages.',
    availableToday: true,
    lat: 17.3850,
    lng: 78.4867
  },
  {
    id: 'guide_015',
    name: 'Swetha Reddy',
    location: 'Hyderabad',
    rating: 4.7,
    reviews: 156,
    languages: ['Telugu', 'English', 'Tamil'],
    specializations: ['Shopping', 'Bazaars', 'Food Tours'],
    packages: ['basic', 'expert'],
    image: '👩‍💼',
    verified: true,
    badge: '⭐ Expert',
    experience: '2.5 years',
    responseTime: '< 6 min',
    hourlyRate: 550,
    about: 'Local shopper\'s guide through Hyderabad\'s famous bazaars and food streets.',
    availableToday: true,
    lat: 17.3723,
    lng: 78.4736
  },
  {
    id: 'guide_016',
    name: 'Mohammed Hasan',
    location: 'Hyderabad',
    rating: 4.8,
    reviews: 142,
    languages: ['Urdu', 'English', 'Hindi'],
    specializations: ['Cultural Heritage', 'Architecture', 'Monuments'],
    packages: ['expert', 'premium', 'foreigner_pack'],
    image: '👨‍💼',
    verified: true,
    badge: '⭐ Premium',
    experience: '3.5 years',
    responseTime: '< 5 min',
    hourlyRate: 750,
    about: 'Historian specializing in Nizams era and Indo-Islamic architecture.',
    availableToday: true,
    lat: 17.3829,
    lng: 78.4759
  },
  
  // BANGALORE (3)
  {
    id: 'guide_017',
    name: 'Ravi Iyer',
    location: 'Bangalore',
    rating: 4.8,
    reviews: 189,
    languages: ['Kannada', 'English', 'Tamil'],
    specializations: ['Tech Tours', 'Nightlife', 'Coffee Culture'],
    packages: ['basic', 'expert', 'premium'],
    image: '👨‍💻',
    verified: true,
    badge: '⭐ Expert',
    experience: '3 years',
    responseTime: '< 5 min',
    hourlyRate: 600,
    about: 'IT professional turned guide. Specialist in Bangalore\'s startup ecosystem and happening nightlife.',
    availableToday: true,
    lat: 12.9716,
    lng: 77.5946
  },
  {
    id: 'guide_018',
    name: 'Anjana Mehta',
    location: 'Bangalore',
    rating: 4.7,
    reviews: 123,
    languages: ['Hindi', 'English', 'Marathi'],
    specializations: ['Gardens', 'Heritage Sites', 'Weekend Trips'],
    packages: ['basic', 'expert', 'foreigner_pack'],
    image: '👩‍💼',
    verified: true,
    badge: '⭐ Expert',
    experience: '2.5 years',
    responseTime: '< 7 min',
    hourlyRate: 500,
    about: 'Nature lover guiding travelers through Bangalore\'s gardens and heritage sites.',
    availableToday: true,
    lat: 12.9352,
    lng: 77.6245
  },
  {
    id: 'guide_019',
    name: 'Karthik Sharma',
    location: 'Bangalore',
    rating: 4.6,
    reviews: 98,
    languages: ['Kannada', 'English'],
    specializations: ['Street Food', 'Markets', 'Shopping'],
    packages: ['basic', 'expert'],
    image: '👨‍💼',
    verified: true,
    badge: '⭐ Local',
    experience: '1.5 years',
    responseTime: '< 8 min',
    hourlyRate: 450,
    about: 'Young local exploring Bangalore\'s street food scene and vibrant markets.',
    availableToday: true,
    lat: 12.9698,
    lng: 77.7499
  },
  
  // GOA (2)
  {
    id: 'guide_020',
    name: 'David Fernandes',
    location: 'Goa',
    rating: 4.9,
    reviews: 267,
    languages: ['English', 'Portuguese', 'Konkani'],
    specializations: ['Beach Tours', 'Water Sports', 'Nightlife'],
    packages: ['basic', 'expert', 'premium', 'foreigner_pack'],
    image: '🏄‍♂️',
    verified: true,
    badge: '⭐ Elite',
    experience: '5 years',
    responseTime: '< 4 min',
    hourlyRate: 900,
    about: 'Beach expert and water sports enthusiast. Perfect for adventure seekers.',
    availableToday: true,
    lat: 15.4909,
    lng: 73.8278
  },
  {
    id: 'guide_021',
    name: 'Maria Costa',
    location: 'Goa',
    rating: 4.8,
    reviews: 145,
    languages: ['English', 'Portuguese', 'Hindi'],
    specializations: ['Heritage Sites', 'Church Tours', 'Portuguese Culture'],
    packages: ['basic', 'expert', 'premium'],
    image: '👩‍💼',
    verified: true,
    badge: '⭐ Premium',
    experience: '3.5 years',
    responseTime: '< 6 min',
    hourlyRate: 700,
    about: 'Heritage specialist exploring Goa\'s unique Portuguese-Indian culture.',
    availableToday: true,
    lat: 15.5017,
    lng: 73.8335
  },
  
  // KOLKATA (2)
  {
    id: 'guide_022',
    name: 'Amitabh Mukherjee',
    location: 'Kolkata',
    rating: 4.7,
    reviews: 134,
    languages: ['Bengali', 'English', 'Hindi'],
    specializations: ['Literary Tours', 'Colonial Architecture', 'Culture'],
    packages: ['expert', 'premium', 'foreigner_pack'],
    image: '👨‍🎓',
    verified: true,
    badge: '⭐ Expert',
    experience: '3 years',
    responseTime: '< 5 min',
    hourlyRate: 650,
    about: 'Literature enthusiast exploring Tagore\'s Bengal and colonial heritage.',
    availableToday: true,
    lat: 22.5726,
    lng: 88.3639
  },
  {
    id: 'guide_023',
    name: 'Priya Das',
    location: 'Kolkata',
    rating: 4.6,
    reviews: 89,
    languages: ['Bengali', 'English'],
    specializations: ['Food Tours', 'Bazaars', 'Street Culture'],
    packages: ['basic', 'expert'],
    image: '👩‍💼',
    verified: true,
    badge: '⭐ Local',
    experience: '2 years',
    responseTime: '< 7 min',
    hourlyRate: 500,
    about: 'Street food guide uncovering Kolkata\'s authentic culinary heritage.',
    availableToday: true,
    lat: 22.5448,
    lng: 88.3476
  },
  
  // CHENNAI (2)
  {
    id: 'guide_024',
    name: 'Sanjay Kumar',
    location: 'Chennai',
    rating: 4.8,
    reviews: 167,
    languages: ['Tamil', 'English', 'Telugu'],
    specializations: ['Temple Tours', 'Classical Arts', 'Heritage'],
    packages: ['basic', 'expert', 'premium', 'foreigner_pack'],
    image: '👨‍💼',
    verified: true,
    badge: '⭐ Premium',
    experience: '4 years',
    responseTime: '< 5 min',
    hourlyRate: 700,
    about: 'Temple expert and Bharatanatyam dancer. Specialist in South Indian culture.',
    availableToday: true,
    lat: 13.0827,
    lng: 80.2707
  },
  {
    id: 'guide_025',
    name: 'Lakshmi Iyer',
    location: 'Chennai',
    rating: 4.7,
    reviews: 112,
    languages: ['Tamil', 'English', 'Kannada'],
    specializations: ['Beach Walks', 'Shopping', 'Local Cuisine'],
    packages: ['basic', 'expert'],
    image: '👩‍💼',
    verified: true,
    badge: '⭐ Expert',
    experience: '2.5 years',
    responseTime: '< 6 min',
    hourlyRate: 600,
    about: 'Local explorer of Chennai\'s beaches, bazaars, and authentic restaurants.',
    availableToday: true,
    lat: 13.0827,
    lng: 80.2707
  },
  
  // DUBAI (2)
  {
    id: 'guide_026',
    name: 'Ahmed Al-Mansouri',
    location: 'Dubai',
    rating: 4.9,
    reviews: 456,
    languages: ['Arabic', 'English', 'Hindi'],
    specializations: ['Shopping', 'Luxury Experiences', 'Desert Safari'],
    packages: ['expert', 'premium', 'foreigner_pack'],
    image: '👨‍💼',
    verified: true,
    badge: '⭐ Elite Multilingual',
    experience: '6 years',
    responseTime: '< 3 min',
    hourlyRate: 1500,
    about: 'Luxury guide specializing in Dubai\'s finest shopping, dining, and desert experiences.',
    availableToday: true,
    lat: 25.2048,
    lng: 55.2708
  },
  {
    id: 'guide_027',
    name: 'Raj Patel',
    location: 'Dubai',
    rating: 4.8,
    reviews: 298,
    languages: ['English', 'Hindi', 'Urdu'],
    specializations: ['Adventure', 'Beach', 'Nightlife'],
    packages: ['basic', 'expert', 'premium', 'foreigner_pack'],
    image: '🏄‍♂️',
    verified: true,
    badge: '⭐ Premium',
    experience: '4 years',
    responseTime: '< 5 min',
    hourlyRate: 1000,
    about: 'Adventure specialist handling water sports, dune bashing, and vibrant nightlife.',
    availableToday: true,
    lat: 25.1972,
    lng: 55.2744
  },
  
  // SINGAPORE (2)
  {
    id: 'guide_028',
    name: 'Kevin Tan',
    location: 'Singapore',
    rating: 4.9,
    reviews: 389,
    languages: ['English', 'Mandarin', 'Malay'],
    specializations: ['Heritage', 'Food Tours', 'Modern Singapore'],
    packages: ['expert', 'premium', 'foreigner_pack'],
    image: '👨‍💼',
    verified: true,
    badge: '⭐ Elite Multilingual',
    experience: '5 years',
    responseTime: '< 4 min',
    hourlyRate: 1200,
    about: 'Bilingual guide exploring Singapore\'s multicultural heritage and modern attractions.',
    availableToday: true,
    lat: 1.3521,
    lng: 103.8198
  },
  {
    id: 'guide_029',
    name: 'Priya Sharma',
    location: 'Singapore',
    rating: 4.8,
    reviews: 267,
    languages: ['English', 'Hindi', 'Tamil'],
    specializations: ['Shopping', 'Gardens', 'Street Food'],
    packages: ['basic', 'expert', 'premium'],
    image: '👩‍💼',
    verified: true,
    badge: '⭐ Premium',
    experience: '3.5 years',
    responseTime: '< 5 min',
    hourlyRate: 900,
    about: 'Local Indian guide helping travelers navigate Singapore\'s diverse neighborhoods.',
    availableToday: true,
    lat: 1.3521,
    lng: 103.8198
  },
  
  // TOKYO (2)
  {
    id: 'guide_030',
    name: 'Yuki Tanaka',
    location: 'Tokyo',
    rating: 4.9,
    reviews: 512,
    languages: ['Japanese', 'English', 'Mandarin'],
    specializations: ['Tea Ceremony', 'Traditional Culture', 'Photography'],
    packages: ['expert', 'premium', 'foreigner_pack'],
    image: '🎎',
    verified: true,
    badge: '⭐ Elite Multilingual',
    experience: '6 years',
    responseTime: '< 3 min',
    hourlyRate: 1500,
    about: 'Cultural expert specializing in traditional Japanese experiences and photography tours.',
    availableToday: true,
    lat: 35.6762,
    lng: 139.6503
  },
  {
    id: 'guide_031',
    name: 'Hiroshi Yamamoto',
    location: 'Tokyo',
    rating: 4.8,
    reviews: 378,
    languages: ['Japanese', 'English', 'Korean'],
    specializations: ['Tech Tours', 'Gaming Culture', 'Modern Tokyo'],
    packages: ['basic', 'expert', 'premium'],
    image: '👨‍💻',
    verified: true,
    badge: '⭐ Premium',
    experience: '4 years',
    responseTime: '< 5 min',
    hourlyRate: 1100,
    about: 'Tech-savvy guide exploring Tokyo\'s cutting-edge technology and gaming scenes.',
    availableToday: true,
    lat: 35.6895,
    lng: 139.6917
  },
  
  // PARIS (2)
  {
    id: 'guide_032',
    name: 'Jean-Pierre Moreau',
    location: 'Paris',
    rating: 4.9,
    reviews: 623,
    languages: ['French', 'English', 'Spanish'],
    specializations: ['Art & Museums', 'Historical Sites', 'Local Life'],
    packages: ['expert', 'premium', 'foreigner_pack'],
    image: '🎨',
    verified: true,
    badge: '⭐ Elite Multilingual',
    experience: '7 years',
    responseTime: '< 3 min',
    hourlyRate: 1600,
    about: 'Art historian guiding through Louvre, Versailles, and authentic Parisian neighborhoods.',
    availableToday: true,
    lat: 48.8566,
    lng: 2.3522
  },
  {
    id: 'guide_033',
    name: 'Marie Dubois',
    location: 'Paris',
    rating: 4.8,
    reviews: 456,
    languages: ['French', 'English', 'Italian'],
    specializations: ['Gastronomy', 'Wine Tours', 'Parisian Culture'],
    packages: ['basic', 'expert', 'premium', 'foreigner_pack'],
    image: '👩‍🍳',
    verified: true,
    badge: '⭐ Premium',
    experience: '5 years',
    responseTime: '< 4 min',
    hourlyRate: 1300,
    about: 'Culinary expert offering wine tasting and food tours through Paris\' finest establishments.',
    availableToday: true,
    lat: 48.8606,
    lng: 2.2936
  }
];

// ============================================
// SAMPLE TRAVELERS DATA
// ============================================

export const SAMPLE_TRAVELERS = [
  {
    id: 'traveler_001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-555-0101',
    country: 'USA',
    bookings: 5,
    totalSpent: 15000,
    reviews: 5,
    averageRating: 4.8,
    isForeigner: true
  },
  {
    id: 'traveler_002',
    name: 'Amit Sharma',
    email: 'amit@example.com',
    phone: '+91-98765-43210',
    country: 'India',
    bookings: 12,
    totalSpent: 8500,
    reviews: 12,
    averageRating: 4.6,
    isForeigner: false
  }
];

// ============================================
// ONBOARDING STEPS
// ============================================

export const GUIDE_ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Provide your personal details',
    fields: ['name', 'phone', 'email', 'birthDate']
  },
  {
    id: 2,
    title: 'Identity Verification',
    description: 'Upload government ID and address proof',
    fields: ['idProof', 'addressProof']
  },
  {
    id: 3,
    title: 'Background Check',
    description: 'Complete background verification (processed by supervisors)',
    fields: ['backgroundConsent']
  },
  {
    id: 4,
    title: 'Knowledge Tests',
    description: 'Take tourism knowledge and language proficiency tests',
    tests: ['tourism_knowledge', 'language_test', 'area_knowledge']
  },
  {
    id: 5,
    title: 'Profile Setup',
    description: 'Create your guide profile and set languages',
    fields: ['languages', 'specializations', 'bio', 'photo']
  },
  {
    id: 6,
    title: 'Package Selection',
    description: 'Choose which guide packages you want to offer',
    fields: ['packages']
  },
  {
    id: 7,
    title: 'Banking Details',
    description: 'Set up payment account for earnings',
    fields: ['bankAccount', 'accountNumber', 'ifsc']
  },
  {
    id: 8,
    title: 'Supervisor Review',
    description: 'Your application is under supervisor review',
    automatic: true
  }
];

// ============================================
// BOOKING STATUS
// ============================================

export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  GUIDE_ARRIVING: 'guide_arriving',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
  DISPUTE: 'dispute'
};

// ============================================
// SAFETY FEATURES
// ============================================

export const SAFETY_FEATURES = {
  TRIP_SHARING: 'Share trip details with emergency contacts',
  REAL_TIME_TRACKING: 'Real-time GPS tracking for both traveler and guide',
  EMERGENCY_BUTTON: 'One-tap emergency SOS alert to supervisors',
  TRAVELER_VERIFICATION: 'Verify traveler identity before booking',
  GUIDE_VERIFICATION: 'Comprehensive background check on guides',
  REVIEW_SYSTEM: 'Transparent review system for accountability',
  INSURANCE: 'Travel guide insurance coverage included'
};
