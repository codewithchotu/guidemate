import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let ai = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
    console.log('Gemini 2.5-flash Agentic engine initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Google Gen AI SDK:', err.message);
  }
} else {
  console.log('No GEMINI_API_KEY found. Agentic engine running in mock-grounded fallback mode.');
}

// Coordinate centers of the 12 destination cities
export const cityCoords = {
  'delhi': [28.6139, 77.2090],
  'mumbai': [19.0760, 72.8777],
  'hyderabad': [17.3850, 78.4867],
  'bangalore': [12.9716, 77.5946],
  'jaipur': [26.9124, 75.7873],
  'goa': [15.2993, 74.1240],
  'kolkata': [22.5726, 88.3639],
  'chennai': [13.0827, 80.2707],
  'dubai': [25.2048, 55.2708],
  'singapore': [1.3521, 103.8198],
  'tokyo': [35.6762, 139.6503],
  'paris': [48.8566, 2.3522]
};

// Rich simulated database for Google Search / POIs grounding when API key is not present
export const mockCityGrounding = {
  tokyo: {
    safetyScore: 98,
    warnings: [
      "Beware of overpriced bars in Roppongi and Kabukicho offering 'cheap drinks'.",
      "Street solicitation is illegal; ignore touts offering free entry.",
      "Check train schedules as public transit stops around midnight."
    ],
    tips: [
      "Carry some cash; though modern, small ramen shops and temples only accept coins/cash.",
      "Stand on the left side of escalators in Tokyo (stand on the right in Osaka).",
      "Get a Suica or Pasmo digital card for seamless train and vending machine transactions."
    ],
    emergencyInfo: "Police: 110. Fire/Ambulance: 119. English Helpline: 03-3501-0110",
    attractions: [
      { name: "Sensō-ji Temple", rating: 4.8, lat: 35.7148, lng: 139.7967, description: "Tokyo's oldest and most iconic Buddhist temple in Asakusa." },
      { name: "Shibuya Crossing", rating: 4.7, lat: 35.6595, lng: 139.7005, description: "The famous, bustling scramble crossing right outside Shibuya Station." },
      { name: "Meiji Jingu Shrine", rating: 4.6, lat: 35.6764, lng: 139.6993, description: "Serene Shinto shrine surrounded by a dense forest in the city center." }
    ],
    hotels: [
      { name: "Park Hyatt Tokyo", rating: 4.9, lat: 35.6856, lng: 139.6908, description: "Luxury skyscraping hotel immortalized in 'Lost in Translation'." },
      { name: "Shibuya Stream Excel Hotel Tokyu", rating: 4.5, lat: 35.6575, lng: 139.7025, description: "Modern, hip boutique hotel overlooking Shibuya's canal street." }
    ],
    restaurants: [
      { name: "Ichiran Ramen Shibuya", rating: 4.6, lat: 35.6609, lng: 139.7018, description: "Famous tonkotsu ramen served in private solo dining booths." },
      { name: "Sushizanmai Okonomiyaki", rating: 4.4, lat: 35.6655, lng: 139.7712, description: "Vibrant and affordable 24/7 sushi hub near Tsukiji outer market." }
    ]
  },
  paris: {
    safetyScore: 82,
    warnings: [
      "Watch out for active pickpockets near the Eiffel Tower, Louvre, and Metro Line 1.",
      "Avoid the 'gold ring' trick or petition signature scams on bridge walks.",
      "Beware of aggressive street vendors around Sacré-Cœur trying to tie friendship bracelets on your wrist."
    ],
    tips: [
      "Always start conversations with 'Bonjour' or 'Bonsoir' to show basic respect.",
      "Keep your Metro ticket until you exit the station; inspectors regularly issue fines.",
      "Tap water is free in restaurants; ask for a 'carafe d'eau' instead of bottled water."
    ],
    emergencyInfo: "European General Emergency: 112. Police: 17. Medical: 15.",
    attractions: [
      { name: "Eiffel Tower", rating: 4.8, lat: 48.8584, lng: 2.2945, description: "The historic wrought-iron lattice tower on the Champ de Mars." },
      { name: "Louvre Museum", rating: 4.7, lat: 48.8606, lng: 2.3376, description: "World's largest art museum housing the Mona Lisa." },
      { name: "Sacré-Cœur Basilica", rating: 4.7, lat: 48.8867, lng: 2.3431, description: "Stunning white dome basilica perched at the summit of Montmartre." }
    ],
    hotels: [
      { name: "The Ritz Paris", rating: 4.9, lat: 48.8681, lng: 2.3294, description: "Legendary luxury hotel overlooking Place Vendôme." },
      { name: "Hotel Generator Paris", rating: 4.2, lat: 48.8789, lng: 2.3705, description: "Trendy, budget-friendly designer hostel with a cool rooftop bar." }
    ],
    restaurants: [
      { name: "Le Comptoir du Relais", rating: 4.5, lat: 48.8521, lng: 2.3389, description: "Fabulous French bistro classics served in the heart of Saint-Germain." },
      { name: "Angelina Paris", rating: 4.6, lat: 48.8624, lng: 2.3275, description: "Famous historic tea room legendary for its thick hot chocolate." }
    ]
  },
  delhi: {
    safetyScore: 78,
    warnings: [
      "Avoid unofficial tour operators at railway stations claiming hotels are closed.",
      "Use prepaid airport taxis or ride-hailing apps rather than random auto-rickshaws at night.",
      "Beware of pickpockets in crowded markets like Chandni Chowk and Karol Bagh."
    ],
    tips: [
      "Stick to bottled drinking water and popular, busy street food stalls.",
      "Dress modestly when visiting temples, mosques, and historical shrines.",
      "Bargain aggressively in street markets like Janpath and Sarojini Nagar."
    ],
    emergencyInfo: "Police Helpline: 112. Ambulance: 102. Tourist Info: 1800-11-1363",
    attractions: [
      { name: "Red Fort", rating: 4.6, lat: 28.6562, lng: 77.2410, description: "Historic Mughal palace fort complex in Old Delhi." },
      { name: "Qutub Minar", rating: 4.7, lat: 28.5244, lng: 77.1855, description: "Stunning 73-meter brick victory tower built in 1193." },
      { name: "India Gate", rating: 4.6, lat: 28.6129, lng: 77.2295, description: "Triangular war memorial arch dedicated to fallen soldiers." }
    ],
    hotels: [
      { name: "The Taj Mahal Hotel", rating: 4.8, lat: 28.6045, lng: 77.2230, description: "Elite luxury hotel in Lutyens' Delhi." },
      { name: "Bloomrooms @ Link Road", rating: 4.3, lat: 28.5822, lng: 77.2345, description: "Chic, clean, and bright budget boutique hotel near Metro." }
    ],
    restaurants: [
      { name: "Karim's Old Delhi", rating: 4.4, lat: 28.6508, lng: 77.2335, description: "Legendary Mughlai eatery serving rich kebabs and stews since 1913." },
      { name: "Indian Accent", rating: 4.8, lat: 28.5878, lng: 77.2512, description: "Award-winning fine dining serving modern, creative Indian cuisine." }
    ]
  },
  mumbai: {
    safetyScore: 84,
    warnings: [
      "Watch your pockets in local trains and railway stations during rush hours.",
      "Beware of taxis asking for inflated flat rates; insist on using the meter or use ride-hailing apps.",
      "Avoid walking alone in poorly-lit dock areas at night."
    ],
    tips: [
      "Experience local trains outside peak hours (11 AM to 4 PM).",
      "Try local street food staples like Vada Pav and Pav Bhaji at popular, crowded stalls.",
      "Keep an umbrella or raincoat handy if traveling during monsoon season (June-September)."
    ],
    emergencyInfo: "Police: 100. Ambulance: 102. Disaster Management: 1916",
    attractions: [
      { name: "Gateway of India", rating: 4.8, lat: 18.9220, lng: 72.8347, description: "Colonial-era stone arch monument facing the Arabian Sea." },
      { name: "Marine Drive", rating: 4.7, lat: 18.9431, lng: 72.8230, description: "Scenic 3.6-kilometer boulevard running along the coast." },
      { name: "Chhatrapati Shivaji Maharaj Terminus", rating: 4.8, lat: 18.9400, lng: 72.8353, description: "UNESCO World Heritage railway station of Victorian Gothic design." }
    ],
    hotels: [
      { name: "The Taj Mahal Palace", rating: 4.9, lat: 18.9217, lng: 72.8330, description: "Iconic luxury hotel overlooking the Gateway of India." },
      { name: "Trident Hotel Nariman Point", rating: 4.6, lat: 18.9262, lng: 72.8209, description: "Premium skyscraper hotel with spectacular sea views." }
    ],
    restaurants: [
      { name: "Leopold Cafe", rating: 4.3, lat: 18.9229, lng: 72.8317, description: "Famous historic multi-cuisine restaurant and bar open since 1871." },
      { name: "Britannia & Co. Restaurant", rating: 4.5, lat: 18.9376, lng: 72.8385, description: "Legendary Parsi cafe serving famous Berry Pulav." }
    ]
  },
  jaipur: {
    safetyScore: 88,
    warnings: [
      "Decline tour invitations from unsolicited auto-rickshaw drivers who offer to take you to cheap gem markets.",
      "Verify pricing before hiring local tour guides at monument entrances.",
      "Bargain firmly at Johari and Bapu Bazaars."
    ],
    tips: [
      "Purchase a composite ticket to cover multiple state monuments at a discounted price.",
      "Take photos of Hawa Mahal at night when it is beautifully illuminated.",
      "Dress modestly when visiting historic forts and active temples."
    ],
    emergencyInfo: "Police: 100. Tourist Helpline: 0141-2822822. Ambulance: 108",
    attractions: [
      { name: "Hawa Mahal", rating: 4.6, lat: 26.9239, lng: 75.8267, description: "The 'Palace of Winds' with an intricate pink sandstone honeycomb facade." },
      { name: "Amer Fort", rating: 4.8, lat: 26.9855, lng: 75.8513, description: "Magnificent hilltop fort complex with artistic Rajput elements." },
      { name: "City Palace", rating: 4.5, lat: 26.9258, lng: 75.8237, description: "Grand royal residence showcasing fusion Mughal-Rajput architecture." }
    ],
    hotels: [
      { name: "Rambagh Palace Hotel", rating: 4.9, lat: 26.8981, lng: 75.8078, description: "Luxurious heritage palace hotel set within pristine gardens." },
      { name: "Umaid Bhawan Castle Heritage Hotel", rating: 4.4, lat: 26.9317, lng: 75.7958, description: "Charming traditional style heritage stay." }
    ],
    restaurants: [
      { name: "Chokhi Dhani Heritage Village", rating: 4.5, lat: 26.7663, lng: 75.8362, description: "Famous open-air traditional cultural village theme restaurant." },
      { name: "Laxmi Mishthan Bhandar (LMB)", rating: 4.2, lat: 26.9222, lng: 75.8228, description: "Historic spot popular for traditional Rajasthani thalis and sweets." }
    ]
  },
  bangalore: {
    safetyScore: 90,
    warnings: [
      "Auto-rickshaws frequently refuse to charge by the meter; use ride-hailing apps for predictable fares.",
      "Be cautious of traffic and crossing roads; Bangalore drivers can be unpredictable.",
      "Avoid late night commutes in isolated areas on the city outskirts."
    ],
    tips: [
      "Use the Namma Metro transit system to bypass the city's heavy road traffic.",
      "Visit cubbon park early morning for a peaceful environment.",
      "Explore the craft brewery culture in areas like Indiranagar and Koramangala."
    ],
    emergencyInfo: "Police Helpline: 112. Fire Station: 101. Ambulance: 102",
    attractions: [
      { name: "Bangalore Palace", rating: 4.5, lat: 12.9980, lng: 77.5920, description: "Elegant royal palace styled after Windsor Castle." },
      { name: "Cubbon Park", rating: 4.6, lat: 12.9740, lng: 77.5960, description: "Massive park with rich flora in the heart of the tech city." },
      { name: "Lalbagh Botanical Garden", rating: 4.5, lat: 12.9507, lng: 77.5844, description: "Historic botanical garden featuring a famous glass house." }
    ],
    hotels: [
      { name: "The Leela Palace Bengaluru", rating: 4.9, lat: 12.9606, lng: 77.6483, description: "Ultra-luxury hotel inspired by the Royal Palace of Mysore." },
      { name: "ITC Gardenia", rating: 4.8, lat: 12.9680, lng: 77.5975, description: "Sustainable luxury hotel with chic architectural gardens." }
    ],
    restaurants: [
      { name: "Mavalli Tiffin Room (MTR)", rating: 4.5, lat: 12.9554, lng: 77.5859, description: "Legendary restaurant serving authentic South Indian breakfast items." },
      { name: "Toit BeerCo", rating: 4.6, lat: 12.9792, lng: 77.6408, description: "Iconic microbrewery popular for food, craft brews, and energetic vibe." }
    ]
  },
  hyderabad: {
    safetyScore: 89,
    warnings: [
      "Crowded markets near Charminar are hotspots for pickpockets.",
      "Be wary of touts around historical monuments charging inflated tourist fees.",
      "Check auto rates beforehand or book rides online."
    ],
    tips: [
      "Plan historical site visits like Golconda Fort in the cooler morning hours.",
      "Taste authentic Hyderabadi Biryani and Haleem (especially during Ramadan).",
      "Visit Laad Bazaar for traditional lac bangles and pearls."
    ],
    emergencyInfo: "Police: 100. Ambulance: 108. Fire: 101",
    attractions: [
      { name: "Charminar", rating: 4.6, lat: 17.3616, lng: 78.4747, description: "Iconic 16th-century mosque with four minarets." },
      { name: "Golconda Fort", rating: 4.7, lat: 17.3833, lng: 78.4011, description: "Historic fortified citadel and former diamond trading center." },
      { name: "Salar Jung Museum", rating: 4.5, lat: 17.3712, lng: 78.4804, description: "One of the three National Museums of India housing art collections." }
    ],
    hotels: [
      { name: "Taj Falaknuma Palace", rating: 4.9, lat: 17.3303, lng: 78.4674, description: "Gorgeous palace hotel situated 2,000 feet above the city." },
      { name: "The Park Hyderabad", rating: 4.4, lat: 17.4243, lng: 78.4619, description: "Art-deco designer hotel overlooking Hussain Sagar Lake." }
    ],
    restaurants: [
      { name: "Paradise Biryani Secunderabad", rating: 4.3, lat: 17.4435, lng: 78.4883, description: "World-famous restaurant serving traditional Hyderabadi Biryani." },
      { name: "Cafe Bahar", rating: 4.4, lat: 17.3995, lng: 78.4819, description: "Highly popular destination for authentic local dishes and Irani chai." }
    ]
  },
  goa: {
    safetyScore: 92,
    warnings: [
      "Avoid swimming in beaches marked with red danger flags or during rough monsoons.",
      "Do not rent scooters or cars without checking validation papers and recording existing damages.",
      "Be alert to potential drink spiking in crowded beach shacks or late parties."
    ],
    tips: [
      "Rent a two-wheeler for cheap and flexible travel across North and South Goa.",
      "Visit historical Old Goa churches for architectural and cultural insights.",
      "Carry sunscreen and stay hydrated in the humid weather."
    ],
    emergencyInfo: "Police: 100. Tourist Helpline: 1363. Ambulance: 108",
    attractions: [
      { name: "Basilica of Bom Jesus", rating: 4.7, lat: 15.5009, lng: 73.9116, description: "UNESCO World Heritage site containing the tomb of St. Francis Xavier." },
      { name: "Calangute Beach", rating: 4.3, lat: 15.5441, lng: 73.7554, description: "One of North Goa's largest and most active sandy beaches." },
      { name: "Dudhsagar Waterfalls", rating: 4.6, lat: 15.3179, lng: 74.3142, description: "Spectacular four-tiered waterfall on the Mandovi River." }
    ],
    hotels: [
      { name: "Taj Exotica Resort & Spa", rating: 4.8, lat: 15.2281, lng: 73.9295, description: "Mediterranean-style luxury beach resort in Benaulim, South Goa." },
      { name: "W Goa", rating: 4.7, lat: 15.6022, lng: 73.7348, description: "Vibrant beachside luxury resort right below Chapora Fort." }
    ],
    restaurants: [
      { name: "Gunpowder", rating: 4.5, lat: 15.5979, lng: 73.7508, description: "Famous restaurant in Assagao serving delicious South Indian home-style food." },
      { name: "Fisherman's Wharf Cavelossim", rating: 4.4, lat: 15.1978, lng: 73.9388, description: "Riverside restaurant offering authentic Goan seafood curry." }
    ]
  },
  kolkata: {
    safetyScore: 91,
    warnings: [
      "Beware of fast taxi drivers and heavy traffic while crossing streets.",
      "Watch out for congested, crowded markets like New Market and Burrabazar.",
      "Avoid street food items made with unpurified water."
    ],
    tips: [
      "Take a ride in the historic yellow taxis or the local tram system for nostalgia.",
      "Visit the iconic Victoria Memorial during evening sunset hours.",
      "Indulge in famous local sweets like Rosogolla and Sandesh at legacy shops."
    ],
    emergencyInfo: "Police: 100. Ambulance: 102. Fire Control: 101",
    attractions: [
      { name: "Victoria Memorial", rating: 4.7, lat: 22.5448, lng: 88.3426, description: "Large white marble palace memorial dedicated to Queen Victoria." },
      { name: "Howrah Bridge", rating: 4.7, lat: 22.5851, lng: 88.3468, description: "Famous cantilever bridge spanning the Hooghly River." },
      { name: "Dakshineswar Kali Temple", rating: 4.8, lat: 22.6548, lng: 88.3575, description: "Historic Hindu temple complex located on the banks of the river." }
    ],
    hotels: [
      { name: "The Oberoi Grand Kolkata", rating: 4.9, lat: 22.5604, lng: 88.3519, description: "Elegant colonial-era luxury hotel on Jawaharlal Nehru Road." },
      { name: "Taj Bengal Hotel", rating: 4.7, lat: 22.5358, lng: 88.3308, description: "Premium hotel located in Kolkata's green Alipore district." }
    ],
    restaurants: [
      { name: "Peter Cat Restaurant", rating: 4.5, lat: 22.5532, lng: 88.3512, description: "Famous Park Street restaurant legendary for its Chelo Kebab." },
      { name: "Flurys Tea Room", rating: 4.3, lat: 22.5535, lng: 88.3524, description: "Historic English tearoom serving fine cakes and English breakfast." }
    ]
  },
  chennai: {
    safetyScore: 93,
    warnings: [
      "Traffic rules are loosely followed; be careful crossing roads.",
      "Avoid coastal waters at Marina Beach due to strong, dangerous undercurrents.",
      "Beware of overcharging by local auto rickshaws; book online where possible."
    ],
    tips: [
      "Try traditional filter coffee at small local shops.",
      "Visit Kapaleeshwarar Temple early morning to experience peaceful prayers.",
      "Wear light cotton clothes to cope with the tropical, humid weather."
    ],
    emergencyInfo: "Police: 100. Ambulance: 108. Fire: 101",
    attractions: [
      { name: "Marina Beach", rating: 4.4, lat: 13.0500, lng: 80.2824, description: "The longest natural urban beach in the country." },
      { name: "Kapaleeshwarar Temple", rating: 4.7, lat: 13.0333, lng: 80.2696, description: "Ancient temple dedicated to Shiva built in Dravidian architecture." },
      { name: "Fort St. George", rating: 4.3, lat: 13.0792, lng: 80.2878, description: "The first English fortress in India, built in 1644." }
    ],
    hotels: [
      { name: "Taj Coromandel", rating: 4.8, lat: 13.0592, lng: 80.2483, description: "One of Chennai's most prestigious luxury hotels." },
      { name: "ITC Grand Chola", rating: 4.9, lat: 13.0101, lng: 80.2206, description: "Massive hotel designed in classical Chola architectural style." }
    ],
    restaurants: [
      { name: "Saravana Bhavan", rating: 4.2, lat: 13.0416, lng: 80.2625, description: "Worldwide chain serving authentic South Indian vegetarian meals." },
      { name: "Dakshin Restaurant", rating: 4.7, lat: 13.0101, lng: 80.2206, description: "Elite fine-dining spot popular for traditional South Indian cuisines." }
    ]
  },
  dubai: {
    safetyScore: 97,
    warnings: [
      "Strict laws regarding public behavior, drug offenses, and alcohol consumption exist. Respect local culture.",
      "Taxis are safe, but verify the meter is running. Unlicensed taxis are illegal.",
      "Summer temperatures (June-August) routinely cross 45°C; avoid outdoors during midday."
    ],
    tips: [
      "Respect dress codes when visiting shopping malls and traditional areas.",
      "Use the clean, fully automated Dubai Metro system to travel affordably.",
      "Explore Old Dubai via a traditional 'Abra' boat ride for only 1 Dirham."
    ],
    emergencyInfo: "Police: 999. Ambulance: 998. Fire Department: 997",
    attractions: [
      { name: "Burj Khalifa", rating: 4.9, lat: 25.1972, lng: 55.2744, description: "The tallest skyscraper and building in the world." },
      { name: "The Dubai Mall", rating: 4.8, lat: 25.1985, lng: 55.2796, description: "Massive retail, entertainment, and leisure destination next to Burj Khalifa." },
      { name: "Palm Jumeirah", rating: 4.7, lat: 25.1124, lng: 55.1326, description: "Tree-shaped artificial archipelago island visible from space." }
    ],
    hotels: [
      { name: "Burj Al Arab Jumeirah", rating: 4.9, lat: 25.1412, lng: 55.1852, description: "World's only self-proclaimed '7-star' luxury sail-shaped hotel." },
      { name: "Atlantis The Palm", rating: 4.8, lat: 25.1311, lng: 55.1182, description: "Majestic ocean-themed resort on the crescent of the Palm Jumeirah." }
    ],
    restaurants: [
      { name: "Zuma Dubai", rating: 4.7, lat: 25.2127, lng: 55.2818, description: "Trendy, high-end Japanese restaurant located in DIFC." },
      { name: "Al Ustad Special Kebab", rating: 4.5, lat: 25.2599, lng: 55.3015, description: "Famous old-school family eatery serving legendary Persian kebabs." }
    ]
  },
  singapore: {
    safetyScore: 98,
    warnings: [
      "Very strict laws with heavy fines for littering, spitting, chewing gum, and jaywalking.",
      "Watch out for occasional tropical thunderstorms; flash floods can occur.",
      "Ensure you keep your volume down on public transit."
    ],
    tips: [
      "Eat at local 'Hawker Centres' (Lau Pa Sat, Maxwell) for Michelin-level food under $10.",
      "Buy an EZ-Link card to travel seamlessly across the efficient MRT train system.",
      "Keep yourself hydrated as Singapore has a year-round hot and wet climate."
    ],
    emergencyInfo: "Police: 999. Ambulance/Fire: 995. Tourist Helpline: 1800 736 2000",
    attractions: [
      { name: "Gardens by the Bay", rating: 4.8, lat: 1.2816, lng: 103.8636, description: "Futuristic park featuring giant Supertrees and climate-controlled domes." },
      { name: "Marina Bay Sands SkyPark", rating: 4.7, lat: 1.2828, lng: 103.8609, description: "Iconic hotel deck overlooking the Singapore city skyline." },
      { name: "Sentosa Island Resorts", rating: 4.6, lat: 1.2494, lng: 103.8303, description: "Vibrant island resort housing Universal Studios and beaches." }
    ],
    hotels: [
      { name: "Raffles Hotel Singapore", rating: 4.9, lat: 1.2949, lng: 103.8543, description: "Legendary 19th-century colonial-style luxury hotel." },
      { name: "Marina Bay Sands Hotel", rating: 4.8, lat: 1.2839, lng: 103.8589, description: "World-famous integrated hotel resort with a rooftop infinity pool." }
    ],
    restaurants: [
      { name: "Lau Pa Sat Hawker Centre", rating: 4.4, lat: 1.2807, lng: 103.8504, description: "Historic food market serving satay and local street eats." },
      { name: "Jumbo Seafood Gallery", rating: 4.5, lat: 1.2891, lng: 103.8473, description: "Renowned riverside eatery famous for iconic Singapore Chili Crab." }
    ]
  }
};

// Orchestrates the 4 AI Agents: Planner, Guide Match, Safety, Budget
export async function runAgenticTravelCompanion(params, availableGuides = []) {
  const { destination, budget, duration, interests, language = 'English', groupSize = 1 } = params;
  const normalizedCity = (destination || 'Delhi').toLowerCase().trim();
  const cityCenter = cityCoords[normalizedCity] || [28.6139, 77.2090];
  
  // Convert interests back to array if it is an object
  let interestList = [];
  if (Array.isArray(interests)) {
    interestList = interests;
  } else if (typeof interests === 'object' && interests !== null) {
    interestList = Object.keys(interests).filter(k => interests[k]);
  } else {
    interestList = ['Culture', 'Sightseeing'];
  }

  if (ai) {
    try {
      const cityGuides = availableGuides.filter(g => g.location.toLowerCase() === normalizedCity);
      const guidesSummary = cityGuides.length > 0 
        ? cityGuides.map(g => `ID: ${g.userId || g.id}, Name: ${g.name}, Rating: ${g.rating}, Languages: ${g.languages ? g.languages.join(',') : 'English'}, Price: ₹${g.hourlyRate}/hr, Specializations: ${g.specializations ? g.specializations.join(',') : 'General'}, Bio: ${g.about || ''}`).join('\n')
        : 'No live guides in database. Please match one from SAMPLE_GUIDES.';

      const systemPrompt = `You are GuideMate AI, an elite Agentic Travel Companion orchestrating 4 collaborative sub-agents:
1. **Planner Agent**: Generates a rich day-wise itinerary matching interests: ${interestList.join(', ')}. Include Google search grounded links.
2. **Guide Match Agent**: Evaluates these guides for the city:
${guidesSummary}
Find the absolute best guide matching the traveler's preferred language (${language}), interests (${interestList.join(', ')}), group size (${groupSize}), and hourly rate. Compute an AI Match Score (0-100%) and justify the match.
3. **Safety Agent**: Calculates a Safety Score (0-100), lists active tourist scams/warnings, safety tips, and emergency contact details for ${destination}.
4. **Budget Agent**: Allocates the total budget of ₹${budget} for a duration of ${duration} days. Segment into: Hotel, Food, Transport, Activities, Emergency. Provide 3 specific budget optimization tips.

Also provide coordinates for:
- 3 key tourist attractions
- 2 recommended hotels
- 2 top restaurants
Generate approximate latitude/longitude coordinates located in ${destination} (close to central coordinates: [${cityCenter[0]}, [${cityCenter[1]}]]).

You MUST return a JSON object ONLY. No markdown wrappers, no backticks, just raw valid JSON matching this schema:
{
  "itinerary": {
    "itinerary": [
      {
        "day": 1,
        "theme": "Theme of Day 1",
        "attractions": [
          { "time": "09:00 AM", "name": "Sensō-ji Temple" },
          { "time": "02:00 PM", "name": "Shibuya Crossing" }
        ]
      }
    ]
  },
  "budget": {
    "breakdown": {
      "hotel": { "category": "Hotel & Accommodation", "percentage": 40, "amount": 12000 },
      "food": { "category": "Food & Dining", "percentage": 25, "amount": 7500 },
      "transport": { "category": "Transport & Commute", "percentage": 15, "amount": 4500 },
      "activities": { "category": "Activities & Sightseeing", "percentage": 12, "amount": 3600 },
      "emergency": { "category": "Emergency Fund", "percentage": 8, "amount": 2400 }
    },
    "totalBudget": ${budget},
    "optimizationTips": ["Tip 1", "Tip 2"]
  },
  "safety": {
    "overallSafetyScore": 92,
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "warnings": ["Warning 1"],
    "emergencyInfo": "Police: 110"
  },
  "guideMatch": {
    "bestGuideId": "guide_id_here",
    "matchScore": 95,
    "reason": "Why matched..."
  },
  "pois": {
    "attractions": [
      { "name": "Attraction Name", "rating": 4.8, "lat": ${cityCenter[0] + 0.005}, "lng": ${cityCenter[1] + 0.005}, "description": "Quick desc" }
    ],
    "hotels": [
      { "name": "Hotel Name", "rating": 4.5, "lat": ${cityCenter[0] - 0.005}, "lng": ${cityCenter[1] + 0.005}, "description": "Quick desc" }
    ],
    "restaurants": [
      { "name": "Restaurant Name", "rating": 4.6, "lat": ${cityCenter[0] + 0.005}, "lng": ${cityCenter[1] - 0.005}, "description": "Quick desc" }
    ]
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
        config: {
          tools: [{ googleSearch: {} }] // Enable Google Search Grounding for current web links and information
        }
      });

      // Parse JSON from text
      let cleanedText = response.text.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.substring(3, cleanedText.length - 3).trim();
      }
      
      const parsedData = JSON.parse(cleanedText);
      return parsedData;
    } catch (err) {
      console.error('Gemini API call failed, falling back to mock agentic compiler:', err.message);
    }
  }

  // MOCK Grounded Compiler (Vast list of fallbacks for all 12 cities with coordinates)
  const defaultCityData = mockCityGrounding[normalizedCity] || {
    safetyScore: 85,
    warnings: ["Watch your belongings in crowded tourist spots.", "Use licensed transportation only."],
    tips: ["Dress appropriately when visiting religious sites.", "Always carry some cash."],
    emergencyInfo: "General Emergency Helpline: 112",
    attractions: [
      { name: "City Central Square", rating: 4.5, lat: cityCenter[0] + 0.01, lng: cityCenter[1] + 0.01, description: "Bustling central plaza of the city." },
      { name: "Historical Monument Walk", rating: 4.6, lat: cityCenter[0] - 0.015, lng: cityCenter[1] + 0.005, description: "A beautifully restored landmark." },
      { name: "Cultural Arts Center", rating: 4.4, lat: cityCenter[0] + 0.005, lng: cityCenter[1] - 0.015, description: "Museum showcasing local art and heritage." }
    ],
    hotels: [
      { name: "Grand Vista Palace Hotel", rating: 4.7, lat: cityCenter[0] - 0.01, lng: cityCenter[1] - 0.01, description: "Luxurious stay in the city center." },
      { name: "Heritage Boutique Inn", rating: 4.3, lat: cityCenter[0] + 0.015, lng: cityCenter[1] + 0.02, description: "Charming rooms styled with local artifacts." }
    ],
    restaurants: [
      { name: "The Spice Kitchen", rating: 4.5, lat: cityCenter[0] + 0.02, lng: cityCenter[1] - 0.005, description: "Top-rated eatery serving authentic local dishes." },
      { name: "Sunset Rooftop Cafe", rating: 4.3, lat: cityCenter[0] - 0.005, lng: cityCenter[1] + 0.02, description: "Relaxing cafe with stunning skyline views." }
    ]
  };

  // Compile Itinerary in the format expected by the frontend
  const itineraryList = [];
  const totalDays = duration || 3;
  const attractionsList = defaultCityData.attractions;
  const diningList = defaultCityData.restaurants;

  for (let i = 1; i <= totalDays; i++) {
    const attraction = attractionsList[(i - 1) % attractionsList.length];
    const restaurant = diningList[(i - 1) % diningList.length];
    itineraryList.push({
      day: i,
      theme: `Day ${i}: Exploring ${destination}'s Best`,
      attractions: [
        { time: "09:00 AM", name: `Guided tour of the historic ${attraction.name}` },
        { time: "01:00 PM", name: `Lunch at ${restaurant.name} (recommended local cuisine)` },
        { time: "03:00 PM", name: `Heritage walk and shopping around central ${destination}` },
        { time: "06:00 PM", name: `Sunset photography and local experiences with your matched guide` }
      ]
    });
  }

  // Compile Budget
  const totalBudget = Number(budget) || 30000;
  const hotelBudget = Math.round(totalBudget * 0.40);
  const foodBudget = Math.round(totalBudget * 0.25);
  const transportBudget = Math.round(totalBudget * 0.15);
  const activitiesBudget = Math.round(totalBudget * 0.12);
  const emergencyBudget = Math.round(totalBudget * 0.08);

  const budgetBreakdown = {
    breakdown: {
      hotel: { category: "Hotel & Accommodation", percentage: 40, amount: hotelBudget },
      food: { category: "Food & Dining", percentage: 25, amount: foodBudget },
      transport: { category: "Transport & Commute", percentage: 15, amount: transportBudget },
      activities: { category: "Activities & Sightseeing", percentage: 12, amount: activitiesBudget },
      emergency: { category: "Emergency Fund", percentage: 8, amount: emergencyBudget }
    },
    totalBudget: totalBudget,
    optimizationTips: [
      `Use local trains or metros (budget allocation is ₹${transportBudget}) to save up to 70% compared to private taxis.`,
      `Stay in boutique hotels near the city center (budgeted at ₹${hotelBudget}) to reduce everyday commute times.`,
      `Hire your matched local guide for specialized tours rather than booking expensive agency packages.`
    ]
  };

  // Guide Match Agent mock logic
  const cityGuides = availableGuides.filter(g => g.location.toLowerCase() === normalizedCity);
  let bestGuide = cityGuides.find(g => g.languages && g.languages.includes(language)) || cityGuides[0];
  
  if (!bestGuide) {
    bestGuide = {
      userId: 'mock_guide_1',
      name: 'Raj Kumar',
      rating: 4.8,
      languages: ['Hindi', 'English'],
      hourlyRate: 600,
      about: 'Experienced guide specializing in local history and architecture.'
    };
  }

  const matchesLang = bestGuide.languages ? bestGuide.languages.includes(language) : true;
  const matchScore = matchesLang ? 96 : 84;

  const guideRecommendation = {
    bestGuideId: bestGuide.userId || bestGuide.id,
    matchScore: matchScore,
    reason: `${bestGuide.name} matches your travel profile perfectly. Speaks ${bestGuide.languages ? bestGuide.languages.join('/') : 'English'}, matches your specialization preferences, has a rating of ${bestGuide.rating || '4.8'} with years of experience, and fits within your hourly budget.`
  };

  return {
    itinerary: {
      itinerary: itineraryList
    },
    budget: budgetBreakdown,
    safety: {
      overallSafetyScore: defaultCityData.safetyScore,
      warnings: defaultCityData.warnings,
      recommendations: defaultCityData.tips,
      emergencyInfo: defaultCityData.emergencyInfo
    },
    guideMatch: guideRecommendation,
    pois: defaultCityData
  };
}

// Full orchestrator which maps responses and integrates with available guides databases
export async function orchestrateTripPlanning(params, availableGuides = []) {
  const { destination, days, budget, interests } = params;
  
  const rawPlan = await runAgenticTravelCompanion({
    destination,
    budget,
    duration: days,
    interests,
    language: 'English',
    groupSize: 1
  }, availableGuides);

  // Map mapData pois if returned by Gemini or mock
  const pois = rawPlan.pois || { attractions: [], hotels: [], restaurants: [] };
  const mapData = { pois };

  // Resolve recommended guide details from guides registry
  let matchedGuide = null;
  let matchScore = 95;
  let matchReason = "";

  if (rawPlan.guideMatch) {
    const guideId = rawPlan.guideMatch.bestGuideId || rawPlan.guideMatch.userId;
    matchedGuide = availableGuides.find(g => (g.userId === guideId || g.id === guideId));
    matchScore = rawPlan.guideMatch.matchScore || 95;
    matchReason = rawPlan.guideMatch.reason || "Recommended based on location, interests, and matching profile rating.";
  }

  // Fallback to first guide in city if none found
  if (!matchedGuide && availableGuides.length > 0) {
    matchedGuide = availableGuides.find(g => g.location.toLowerCase() === destination.toLowerCase()) || availableGuides[0];
  }

  // Format final plan matching TravelerHome.jsx layout
  return {
    planning: {
      itinerary: rawPlan.itinerary,
      budget: rawPlan.budget,
      safety: rawPlan.safety,
      guideMatch: matchedGuide ? {
        matchScore,
        matchedGuide,
        matchReason
      } : null,
      mapData
    }
  };
}
