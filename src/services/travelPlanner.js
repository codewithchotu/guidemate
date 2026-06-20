/**
 * GuideMate - Client-Side Travel Planning Fallback
 * Works entirely in the browser without needing the backend server.
 */

import { SAMPLE_GUIDES } from '../data/guideData.js';

const cityCoords = {
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
  'paris': [48.8566, 2.3522],
};

const cityData = {
  tokyo: {
    safetyScore: 98,
    warnings: ['Beware of overpriced bars in Roppongi.', 'Street solicitation is illegal.', 'Check train schedules — transit stops around midnight.'],
    tips: ['Carry cash for small shops and temples.', 'Stand left on escalators.', 'Get a Suica card for seamless travel.'],
    emergencyInfo: 'Police: 110. Fire/Ambulance: 119.',
    attractions: [
      { name: 'Sensō-ji Temple', rating: 4.8, lat: 35.7148, lng: 139.7967, description: "Tokyo's oldest Buddhist temple in Asakusa." },
      { name: 'Shibuya Crossing', rating: 4.7, lat: 35.6595, lng: 139.7005, description: 'The famous scramble crossing outside Shibuya Station.' },
      { name: 'Meiji Jingu Shrine', rating: 4.6, lat: 35.6764, lng: 139.6993, description: 'Serene Shinto shrine in the city center.' },
    ],
    hotels: [
      { name: 'Park Hyatt Tokyo', rating: 4.9, lat: 35.6856, lng: 139.6908, description: 'Luxury hotel from Lost in Translation.' },
      { name: 'Shibuya Stream Excel Hotel', rating: 4.5, lat: 35.6575, lng: 139.7025, description: 'Modern boutique hotel overlooking Shibuya canal.' },
    ],
    restaurants: [
      { name: 'Ichiran Ramen Shibuya', rating: 4.6, lat: 35.6609, lng: 139.7018, description: 'Famous tonkotsu ramen in solo dining booths.' },
      { name: 'Sushizanmai', rating: 4.4, lat: 35.6655, lng: 139.7712, description: '24/7 sushi hub near Tsukiji outer market.' },
    ],
  },
  paris: {
    safetyScore: 82,
    warnings: ['Watch for pickpockets near Eiffel Tower.', "Avoid 'gold ring' tricks on bridges.", 'Beware of friendship bracelet scams at Sacré-Cœur.'],
    tips: ["Start conversations with 'Bonjour'.", 'Keep your Metro ticket until you exit.', "Ask for 'carafe d'eau' for free water."],
    emergencyInfo: 'Emergency: 112. Police: 17. Medical: 15.',
    attractions: [
      { name: 'Eiffel Tower', rating: 4.8, lat: 48.8584, lng: 2.2945, description: 'Historic wrought-iron tower on Champ de Mars.' },
      { name: 'Louvre Museum', rating: 4.7, lat: 48.8606, lng: 2.3376, description: "World's largest art museum." },
      { name: 'Sacré-Cœur Basilica', rating: 4.7, lat: 48.8867, lng: 2.3431, description: 'White dome basilica at Montmartre summit.' },
    ],
    hotels: [
      { name: 'The Ritz Paris', rating: 4.9, lat: 48.8681, lng: 2.3294, description: 'Legendary luxury hotel at Place Vendôme.' },
      { name: 'Hotel Generator Paris', rating: 4.2, lat: 48.8789, lng: 2.3705, description: 'Trendy budget hostel with rooftop bar.' },
    ],
    restaurants: [
      { name: 'Le Comptoir du Relais', rating: 4.5, lat: 48.8521, lng: 2.3389, description: 'Classic French bistro in Saint-Germain.' },
      { name: 'Angelina Paris', rating: 4.6, lat: 48.8624, lng: 2.3275, description: 'Historic tearoom famous for thick hot chocolate.' },
    ],
  },
  delhi: {
    safetyScore: 78,
    warnings: ['Avoid unofficial tour operators at stations.', 'Use prepaid taxis or apps at night.', 'Watch for pickpockets in Chandni Chowk.'],
    tips: ['Stick to bottled water.', 'Dress modestly at temples.', 'Bargain at Janpath and Sarojini Nagar.'],
    emergencyInfo: 'Police: 112. Ambulance: 102. Tourist: 1800-11-1363.',
    attractions: [
      { name: 'Red Fort', rating: 4.6, lat: 28.6562, lng: 77.2410, description: 'Historic Mughal palace in Old Delhi.' },
      { name: 'Qutub Minar', rating: 4.7, lat: 28.5244, lng: 77.1855, description: '73-meter victory tower built in 1193.' },
      { name: 'India Gate', rating: 4.6, lat: 28.6129, lng: 77.2295, description: 'War memorial arch in New Delhi.' },
    ],
    hotels: [
      { name: 'The Taj Mahal Hotel', rating: 4.8, lat: 28.6045, lng: 77.2230, description: 'Elite luxury in Lutyens Delhi.' },
      { name: 'Bloomrooms @ Link Road', rating: 4.3, lat: 28.5822, lng: 77.2345, description: 'Clean boutique hotel near Metro.' },
    ],
    restaurants: [
      { name: "Karim's Old Delhi", rating: 4.4, lat: 28.6508, lng: 77.2335, description: 'Legendary Mughlai restaurant since 1913.' },
      { name: 'Indian Accent', rating: 4.8, lat: 28.5878, lng: 77.2512, description: 'Award-winning modern Indian fine dining.' },
    ],
  },
  mumbai: {
    safetyScore: 84,
    warnings: ['Watch pockets in local trains.', 'Insist on meter in taxis.', 'Avoid dock areas at night.'],
    tips: ['Travel by local train outside peak hours.', 'Try Vada Pav and Pav Bhaji at busy stalls.', 'Carry umbrella during monsoon.'],
    emergencyInfo: 'Police: 100. Ambulance: 102. Disaster: 1916.',
    attractions: [
      { name: 'Gateway of India', rating: 4.8, lat: 18.9220, lng: 72.8347, description: 'Colonial stone arch facing Arabian Sea.' },
      { name: 'Marine Drive', rating: 4.7, lat: 18.9431, lng: 72.8230, description: "3.6km boulevard along the coast — 'Queen's Necklace'." },
      { name: 'Chhatrapati Shivaji Terminus', rating: 4.8, lat: 18.9400, lng: 72.8353, description: 'UNESCO World Heritage Victorian Gothic railway station.' },
    ],
    hotels: [
      { name: 'The Taj Mahal Palace', rating: 4.9, lat: 18.9217, lng: 72.8330, description: 'Iconic hotel overlooking Gateway of India.' },
      { name: 'Trident Nariman Point', rating: 4.6, lat: 18.9262, lng: 72.8209, description: 'Premium skyscraper hotel with sea views.' },
    ],
    restaurants: [
      { name: 'Leopold Cafe', rating: 4.3, lat: 18.9229, lng: 72.8317, description: 'Historic restaurant open since 1871.' },
      { name: 'Britannia & Co.', rating: 4.5, lat: 18.9376, lng: 72.8385, description: 'Legendary Parsi cafe with famous Berry Pulav.' },
    ],
  },
  jaipur: {
    safetyScore: 88,
    warnings: ['Decline tours from unsolicited auto drivers.', 'Verify pricing for monument guides.', 'Bargain firmly at Johari Bazaar.'],
    tips: ['Buy composite tickets for multiple monuments.', 'Photograph Hawa Mahal when lit at night.', 'Dress modestly at active temples.'],
    emergencyInfo: 'Police: 100. Tourist: 0141-2822822. Ambulance: 108.',
    attractions: [
      { name: 'Hawa Mahal', rating: 4.6, lat: 26.9239, lng: 75.8267, description: "Palace of Winds — pink sandstone honeycomb facade." },
      { name: 'Amer Fort', rating: 4.8, lat: 26.9855, lng: 75.8513, description: 'Magnificent hilltop fort with Rajput artistry.' },
      { name: 'City Palace', rating: 4.5, lat: 26.9258, lng: 75.8237, description: 'Grand royal palace with Mughal-Rajput fusion.' },
    ],
    hotels: [
      { name: 'Rambagh Palace Hotel', rating: 4.9, lat: 26.8981, lng: 75.8078, description: 'Luxurious heritage palace hotel.' },
      { name: 'Umaid Bhawan Castle', rating: 4.4, lat: 26.9317, lng: 75.7958, description: 'Traditional heritage stay.' },
    ],
    restaurants: [
      { name: 'Chokhi Dhani', rating: 4.5, lat: 26.7663, lng: 75.8362, description: 'Open-air cultural village restaurant.' },
      { name: 'Laxmi Mishthan Bhandar', rating: 4.2, lat: 26.9222, lng: 75.8228, description: 'Historic Rajasthani thali and sweets.' },
    ],
  },
  goa: {
    safetyScore: 92,
    warnings: ['Avoid swimming at red-flag beaches.', 'Check rental vehicle papers.', 'Be alert to drink spiking at beach parties.'],
    tips: ['Rent a two-wheeler for flexible travel.', 'Visit Old Goa churches for history.', 'Carry sunscreen in humid weather.'],
    emergencyInfo: 'Police: 100. Tourist: 1363. Ambulance: 108.',
    attractions: [
      { name: 'Basilica of Bom Jesus', rating: 4.7, lat: 15.5009, lng: 73.9116, description: "UNESCO site with St. Francis Xavier's tomb." },
      { name: 'Calangute Beach', rating: 4.3, lat: 15.5441, lng: 73.7554, description: "North Goa's most active sandy beach." },
      { name: 'Dudhsagar Waterfalls', rating: 4.6, lat: 15.3179, lng: 74.3142, description: 'Spectacular four-tiered waterfall on Mandovi River.' },
    ],
    hotels: [
      { name: 'Taj Exotica Resort & Spa', rating: 4.8, lat: 15.2281, lng: 73.9295, description: 'Mediterranean beach resort in South Goa.' },
      { name: 'W Goa', rating: 4.7, lat: 15.6022, lng: 73.7348, description: 'Vibrant beachside luxury resort.' },
    ],
    restaurants: [
      { name: 'Gunpowder', rating: 4.5, lat: 15.5979, lng: 73.7508, description: 'South Indian home-style food in Assagao.' },
      { name: "Fisherman's Wharf", rating: 4.4, lat: 15.1978, lng: 73.9388, description: 'Riverside Goan seafood restaurant.' },
    ],
  },
  hyderabad: {
    safetyScore: 89,
    warnings: ['Crowded Charminar area is pickpocket hotspot.', 'Wary of touts at monuments.', 'Check auto rates beforehand.'],
    tips: ['Visit Golconda Fort in cooler morning hours.', 'Taste Hyderabadi Biryani and Haleem.', 'Visit Laad Bazaar for bangles and pearls.'],
    emergencyInfo: 'Police: 100. Ambulance: 108. Fire: 101.',
    attractions: [
      { name: 'Charminar', rating: 4.6, lat: 17.3616, lng: 78.4747, description: 'Iconic 16th-century mosque with four minarets.' },
      { name: 'Golconda Fort', rating: 4.7, lat: 17.3833, lng: 78.4011, description: 'Historic fortified citadel and diamond trading center.' },
      { name: 'Salar Jung Museum', rating: 4.5, lat: 17.3712, lng: 78.4804, description: 'National Museum housing art collections.' },
    ],
    hotels: [
      { name: 'Taj Falaknuma Palace', rating: 4.9, lat: 17.3303, lng: 78.4674, description: 'Palace hotel 2,000 feet above the city.' },
      { name: 'The Park Hyderabad', rating: 4.4, lat: 17.4243, lng: 78.4619, description: 'Art-deco hotel overlooking Hussain Sagar.' },
    ],
    restaurants: [
      { name: 'Paradise Biryani', rating: 4.3, lat: 17.4435, lng: 78.4883, description: 'World-famous Hyderabadi Biryani.' },
      { name: 'Cafe Bahar', rating: 4.4, lat: 17.3995, lng: 78.4819, description: 'Authentic local dishes and Irani chai.' },
    ],
  },
  bangalore: {
    safetyScore: 90,
    warnings: ['Autos refuse meters — use ride apps.', 'Traffic is heavy and unpredictable.', 'Avoid outskirts late at night.'],
    tips: ['Use Namma Metro to bypass traffic.', 'Visit Cubbon Park early morning.', 'Explore craft brewery culture in Indiranagar.'],
    emergencyInfo: 'Police: 112. Fire: 101. Ambulance: 102.',
    attractions: [
      { name: 'Bangalore Palace', rating: 4.5, lat: 12.9980, lng: 77.5920, description: 'Elegant palace styled after Windsor Castle.' },
      { name: 'Cubbon Park', rating: 4.6, lat: 12.9740, lng: 77.5960, description: 'Massive park in the heart of tech city.' },
      { name: 'Lalbagh Botanical Garden', rating: 4.5, lat: 12.9507, lng: 77.5844, description: 'Historic garden with a famous glass house.' },
    ],
    hotels: [
      { name: 'The Leela Palace Bengaluru', rating: 4.9, lat: 12.9606, lng: 77.6483, description: 'Ultra-luxury hotel inspired by Mysore Palace.' },
      { name: 'ITC Gardenia', rating: 4.8, lat: 12.9680, lng: 77.5975, description: 'Sustainable luxury hotel with garden architecture.' },
    ],
    restaurants: [
      { name: 'Mavalli Tiffin Room (MTR)', rating: 4.5, lat: 12.9554, lng: 77.5859, description: 'Legendary South Indian breakfast restaurant.' },
      { name: 'Toit BeerCo', rating: 4.6, lat: 12.9792, lng: 77.6408, description: 'Iconic microbrewery for food and craft brews.' },
    ],
  },
  kolkata: {
    safetyScore: 91,
    warnings: ['Fast traffic — be careful crossing.', 'Watch in crowded New Market.', 'Avoid street food with unpurified water.'],
    tips: ['Try yellow taxis or the historic tram.', 'Visit Victoria Memorial at sunset.', 'Indulge in Rosogolla and Sandesh at legacy shops.'],
    emergencyInfo: 'Police: 100. Ambulance: 102. Fire: 101.',
    attractions: [
      { name: 'Victoria Memorial', rating: 4.7, lat: 22.5448, lng: 88.3426, description: 'White marble palace memorial to Queen Victoria.' },
      { name: 'Howrah Bridge', rating: 4.7, lat: 22.5851, lng: 88.3468, description: 'Famous cantilever bridge over Hooghly River.' },
      { name: 'Dakshineswar Kali Temple', rating: 4.8, lat: 22.6548, lng: 88.3575, description: 'Historic temple on the riverbank.' },
    ],
    hotels: [
      { name: 'The Oberoi Grand Kolkata', rating: 4.9, lat: 22.5604, lng: 88.3519, description: 'Elegant colonial luxury hotel.' },
      { name: 'Taj Bengal Hotel', rating: 4.7, lat: 22.5358, lng: 88.3308, description: 'Premium hotel in Alipore district.' },
    ],
    restaurants: [
      { name: 'Peter Cat Restaurant', rating: 4.5, lat: 22.5532, lng: 88.3512, description: 'Legendary for Chelo Kebab.' },
      { name: 'Flurys Tea Room', rating: 4.3, lat: 22.5535, lng: 88.3524, description: 'Historic English tearoom with fine cakes.' },
    ],
  },
  chennai: {
    safetyScore: 93,
    warnings: ['Traffic rules loosely followed.', 'Avoid Marina Beach swimming.', 'Beware auto overcharging.'],
    tips: ['Try filter coffee at small local shops.', 'Visit Kapaleeshwarar Temple at dawn.', 'Wear light cotton clothes.'],
    emergencyInfo: 'Police: 100. Ambulance: 108. Fire: 101.',
    attractions: [
      { name: 'Marina Beach', rating: 4.4, lat: 13.0500, lng: 80.2824, description: 'Longest natural urban beach in the country.' },
      { name: 'Kapaleeshwarar Temple', rating: 4.7, lat: 13.0333, lng: 80.2696, description: 'Ancient Dravidian Shiva temple.' },
      { name: 'Fort St. George', rating: 4.3, lat: 13.0792, lng: 80.2878, description: 'First English fortress in India, built 1644.' },
    ],
    hotels: [
      { name: 'Taj Coromandel', rating: 4.8, lat: 13.0592, lng: 80.2483, description: "One of Chennai's most prestigious hotels." },
      { name: 'ITC Grand Chola', rating: 4.9, lat: 13.0101, lng: 80.2206, description: 'Massive hotel in classical Chola style.' },
    ],
    restaurants: [
      { name: 'Saravana Bhavan', rating: 4.2, lat: 13.0416, lng: 80.2625, description: 'Authentic South Indian vegetarian meals.' },
      { name: 'Dakshin Restaurant', rating: 4.7, lat: 13.0101, lng: 80.2206, description: 'Fine dining for traditional South Indian cuisines.' },
    ],
  },
  singapore: {
    safetyScore: 98,
    warnings: ['Heavy fines for littering, spitting, jaywalking.', 'Watch for flash floods during thunderstorms.', 'Keep volume down on public transit.'],
    tips: ["Eat at Hawker Centres for Michelin-level food under $10.", 'Buy an EZ-Link card for the MRT.', 'Stay hydrated in hot humid weather.'],
    emergencyInfo: 'Police: 999. Ambulance/Fire: 995.',
    attractions: [
      { name: 'Gardens by the Bay', rating: 4.8, lat: 1.2816, lng: 103.8636, description: 'Futuristic park with giant Supertrees.' },
      { name: 'Marina Bay Sands SkyPark', rating: 4.7, lat: 1.2828, lng: 103.8609, description: 'Iconic hotel deck overlooking the skyline.' },
      { name: 'Sentosa Island', rating: 4.6, lat: 1.2494, lng: 103.8303, description: 'Island resort with Universal Studios.' },
    ],
    hotels: [
      { name: 'Raffles Hotel Singapore', rating: 4.9, lat: 1.2949, lng: 103.8543, description: 'Legendary 19th-century colonial luxury hotel.' },
      { name: 'Marina Bay Sands', rating: 4.8, lat: 1.2839, lng: 103.8589, description: 'Famous resort with rooftop infinity pool.' },
    ],
    restaurants: [
      { name: 'Lau Pa Sat Hawker Centre', rating: 4.4, lat: 1.2807, lng: 103.8504, description: 'Historic food market with satay and street eats.' },
      { name: 'Jumbo Seafood', rating: 4.5, lat: 1.2891, lng: 103.8473, description: 'Riverside restaurant famous for Singapore Chili Crab.' },
    ],
  },
  dubai: {
    safetyScore: 97,
    warnings: ['Strict laws on behavior, drugs, and alcohol.', 'Verify taxi meter is running.', 'Summer temps cross 45°C — avoid midday outdoors.'],
    tips: ['Respect dress codes at malls.', 'Use the Dubai Metro.', 'Try the Abra boat ride for 1 Dirham.'],
    emergencyInfo: 'Police: 999. Ambulance: 998. Fire: 997.',
    attractions: [
      { name: 'Burj Khalifa', rating: 4.9, lat: 25.1972, lng: 55.2744, description: "World's tallest skyscraper." },
      { name: 'The Dubai Mall', rating: 4.8, lat: 25.1985, lng: 55.2796, description: 'Massive retail and entertainment destination.' },
      { name: 'Palm Jumeirah', rating: 4.7, lat: 25.1124, lng: 55.1326, description: 'Tree-shaped artificial island visible from space.' },
    ],
    hotels: [
      { name: 'Burj Al Arab Jumeirah', rating: 4.9, lat: 25.1412, lng: 55.1852, description: "World's only self-proclaimed 7-star hotel." },
      { name: 'Atlantis The Palm', rating: 4.8, lat: 25.1311, lng: 55.1182, description: 'Ocean-themed resort on Palm Jumeirah.' },
    ],
    restaurants: [
      { name: 'Zuma Dubai', rating: 4.7, lat: 25.2127, lng: 55.2818, description: 'Trendy Japanese restaurant in DIFC.' },
      { name: 'Al Ustad Special Kebab', rating: 4.5, lat: 25.2599, lng: 55.3015, description: 'Family eatery serving legendary Persian kebabs.' },
    ],
  },
};

// ============================================================
// MAIN: Generate a complete travel plan client-side
// ============================================================
export function generateTripPlan({ destination, days, budget, interests }) {
  const key = (destination || 'delhi').toLowerCase().trim();
  const coords = cityCoords[key] || [28.6139, 77.2090];
  const data = cityData[key] || {
    safetyScore: 85,
    warnings: ['Watch your belongings in tourist spots.', 'Use licensed transport only.'],
    tips: ['Dress appropriately at religious sites.', 'Always carry some cash.'],
    emergencyInfo: 'General Emergency: 112',
    attractions: [
      { name: `${destination} Central Monument`, rating: 4.5, lat: coords[0] + 0.01, lng: coords[1] + 0.01, description: 'Iconic landmark of the city.' },
      { name: `${destination} Heritage Park`, rating: 4.4, lat: coords[0] - 0.01, lng: coords[1] + 0.005, description: 'Beautiful heritage area with gardens.' },
      { name: `${destination} Cultural Center`, rating: 4.3, lat: coords[0] + 0.005, lng: coords[1] - 0.01, description: 'Museum showcasing local art and culture.' },
    ],
    hotels: [
      { name: `Grand ${destination} Palace Hotel`, rating: 4.7, lat: coords[0] - 0.01, lng: coords[1] - 0.01, description: 'Luxurious stay in the city center.' },
      { name: 'Heritage Boutique Inn', rating: 4.3, lat: coords[0] + 0.015, lng: coords[1] + 0.02, description: 'Charming rooms with local character.' },
    ],
    restaurants: [
      { name: 'The Local Kitchen', rating: 4.5, lat: coords[0] + 0.02, lng: coords[1] - 0.005, description: 'Top-rated authentic local cuisine.' },
      { name: 'Rooftop Café', rating: 4.3, lat: coords[0] - 0.005, lng: coords[1] + 0.02, description: 'Relaxing café with city views.' },
    ],
  };

  // Build itinerary
  const totalDays = Number(days) || 3;
  const itineraryList = [];
  for (let i = 1; i <= totalDays; i++) {
    const attr = data.attractions[(i - 1) % data.attractions.length];
    const rest = data.restaurants[(i - 1) % data.restaurants.length];
    itineraryList.push({
      day: i,
      theme: `Day ${i}: Exploring ${destination}'s Best`,
      attractions: [
        { time: '09:00 AM', name: `Guided tour of ${attr.name}` },
        { time: '12:30 PM', name: `Lunch at ${rest.name}` },
        { time: '03:00 PM', name: `Heritage walk and shopping in central ${destination}` },
        { time: '06:30 PM', name: `Sunset photography and local experiences with your guide` },
      ],
    });
  }

  // Build budget
  const totalBudget = Number(budget) || 30000;
  const budgetBreakdown = {
    breakdown: {
      hotel: { category: 'Hotel & Accommodation', percentage: 40, amount: Math.round(totalBudget * 0.40) },
      food: { category: 'Food & Dining', percentage: 25, amount: Math.round(totalBudget * 0.25) },
      transport: { category: 'Transport & Commute', percentage: 15, amount: Math.round(totalBudget * 0.15) },
      activities: { category: 'Activities & Sightseeing', percentage: 12, amount: Math.round(totalBudget * 0.12) },
      emergency: { category: 'Emergency Fund', percentage: 8, amount: Math.round(totalBudget * 0.08) },
    },
    totalBudget,
    optimizationTips: [
      `Use metro/public transit to save up to 70% on transport (budget: ₹${Math.round(totalBudget * 0.15)}).`,
      `Boutique hotels near the center save commute time and fit your ₹${Math.round(totalBudget * 0.40)} accommodation budget.`,
      `Book a GuideMate local expert for specialized tours instead of expensive agency packages.`,
    ],
  };

  // Guide match
  const cityGuides = SAMPLE_GUIDES.filter(g => g.location.toLowerCase() === key);
  const matchedGuide = cityGuides[0] || SAMPLE_GUIDES[0];

  return {
    planning: {
      itinerary: { itinerary: itineraryList },
      budget: budgetBreakdown,
      safety: {
        overallSafetyScore: data.safetyScore,
        warnings: data.warnings,
        recommendations: data.tips,
        emergencyInfo: data.emergencyInfo,
      },
      guideMatch: matchedGuide ? {
        matchScore: 94,
        matchedGuide,
        matchReason: `${matchedGuide.name} is a top-rated local expert in ${destination} who matches your interests (${(interests || []).join(', ')}), speaks multiple languages, and fits your budget profile with a rating of ${matchedGuide.rating}.`,
      } : null,
      mapData: {
        pois: {
          attractions: data.attractions,
          hotels: data.hotels,
          restaurants: data.restaurants,
        },
      },
    },
  };
}

// ============================================================
// Client-side AI Chat (fallback when server unreachable)
// ============================================================
export function getAIChatResponse(message) {
  const msg = message.toLowerCase();

  if (msg.includes('jaipur')) {
    if (msg.includes('tonight') || msg.includes('evening') || msg.includes('night'))
      return '🌙 **Jaipur Tonight:**\n\n🍽️ **Dinner:** Chokhi Dhani (Rajasthani village experience, ₹650) or Peacock Rooftop\n🏰 **Sightseeing:** Hawa Mahal lit up after 7 PM · Jal Mahal at dusk\n🛍️ **Shopping:** Johari Bazaar evening market\n\n💡 Book a GuideMate City Expert to know the hidden rooftop cafes!';
    if (msg.includes('food') || msg.includes('eat'))
      return '🍛 **Jaipur Food Guide:**\n\n• **Pyaaz Kachori** at Rawat Mishthan — iconic breakfast (₹20)\n• **Dal Baati Churma** at Lassiwala\n• **Suvarna Mahal** at Rambagh Palace — royal dining\n• **Niro\'s on MI Road** — 70-year landmark\n\n💡 Ask your guide for the street food lane behind Badi Chaupar!';
    if (msg.includes('hidden') || msg.includes('gem'))
      return '💎 **Jaipur Hidden Gems:**\n\n• Panna Meena Ka Kund — geometric stepwell, almost no tourists\n• Galta Ji (Monkey Temple) — natural springs in Aravalli hills\n• Sisodiya Rani Garden — Baroque terraced garden\n• Bhangarh Fort — mysterious ruins 90 mins away\n\n💡 Book a Heritage Expert guide for backstories!';
    return '🏰 **Jaipur:** Amber Fort · Hawa Mahal · City Palace · Jantar Mantar (UNESCO)\n\nBest time: Oct–Mar · Daily budget: ₹1,500–6,000\n\n💡 A City Expert guide (₹600/hr) is the best investment in Jaipur!';
  }

  if (msg.includes('charminar') || msg.includes('hyderabad')) {
    if (msg.includes('food') || msg.includes('biryani'))
      return '🕌 **Hyderabad Food Near Charminar:**\n\n• **Hotel Shadab** — legendary mutton biryani since 1953 (₹250–350)\n• **Nimrah Cafe** — Irani chai + Osmania biscuits right next to Charminar\n• **Hameedi Confectioners** — Jouzi Halwa, 150-year institution\n• **Pista House** — best haleem in the city\n\n💡 Your guide knows when Laad Bazaar kebab stalls light up!';
    return '🌟 **Hyderabad:** Charminar · Chowmahalla Palace · Golconda Fort · Salar Jung Museum\n\nShopping: Laad Bazaar (bangles), Abids Market\nBest time: Nov–Feb\n\n💡 A local guide bridges Old Hyderabad and modern Hitech City perfectly!';
  }

  if (msg.includes('delhi')) {
    if (msg.includes('hidden') || msg.includes('gem'))
      return '🌳 **Delhi Hidden Gems:**\n\n• Agrasen ki Baoli — 14th century stepwell between skyscrapers\n• Sunder Nursery — restored Mughal garden with migratory birds\n• Majnu Ka Tilla (Little Tibet) — momos, monasteries, cafes\n• Mehrauli Archaeological Park — 100+ monuments, zero tourists\n\n💡 Our Heritage Expert takes you to places Google Maps doesn\'t know!';
    if (msg.includes('food'))
      return '🍢 **Delhi Street Food:**\n\n**Old Delhi:** Paranthe Wali Gali · Karim\'s (since 1913) · Natraj Dahi Bhalle\n**South Delhi:** Hauz Khas Village rooftops · Dilli Haat food stalls\n\n💡 GuideMate runs dawn food walks starting 6 AM!';
    return '🏛️ **Delhi:** Red Fort · Qutub Minar (UNESCO) · Humayun\'s Tomb (UNESCO) · India Gate\n\nBest neighborhoods: Chandni Chowk · Lodi Colony (street art) · Hauz Khas\nDay budget: ₹1,200–₹8,000\n\n💡 Your City Expert knows which Metro exit reaches each monument!';
  }

  if (msg.includes('mumbai') || msg.includes('bombay'))
    return '🌊 **Mumbai:** Gateway of India · Marine Drive · Elephanta Caves (UNESCO)\n\n**Food:** Vada Pav (₹15) · Mahesh Lunch Home seafood · Bade Miya kebabs (Colaba)\n**Hidden Gem:** Chor Bazaar Friday mornings — antiques at negotiable prices!\n\n💡 Ask your guide to take you to the Dharavi Creative Quarter!';

  if (msg.includes('goa'))
    return '🏖️ **Goa Beyond Beaches:**\n\n**Hidden:** Divar Island (zero tourists) · Fontainhas Latin Quarter · Cabo de Rama Fort\n**Food:** Fisherman\'s Wharf · Viva Panjim (pork vindaloo)\n\n💡 Skip crowded Baga — ask your guide to take you to Butterfly Beach, only by boat!';

  if (msg.includes('varanasi') || msg.includes('benaras'))
    return '🕯️ **Varanasi:**\n\n• Ganga Aarti at Dashashwamedh Ghat (7 PM) — India\'s most profound ritual\n• Boat ride at dawn — watch the city wake up\n• Kashi Vishwanath Temple · Blue Lassi shop · Banarasi paan\n\n💡 Book a GuideMate Spiritual Expert for the full Ganga Aarti experience!';

  if (msg.includes('budget') || msg.includes('cost') || msg.includes('cheap') || msg.includes('expense'))
    return '💰 **Budget Strategy (₹5,000/day):**\n\n• 🏨 Accommodation (35%) — ₹1,750: Heritage homestays\n• 🍽️ Food (20%) — ₹1,000: Local dhabas + 1 restaurant\n• 🗺️ Guide (20%) — ₹1,000: Basic ₹300/hr or City Expert ₹600/hr\n• 🚗 Transport (15%) — ₹750: Metro + Ola/Uber\n• 🎟️ Entry Fees (10%) — ₹500\n\n💡 A City Expert saves you ₹2,000+ on scams, bad restaurants & entry fees!';

  if (msg.includes('hotel') || msg.includes('stay') || msg.includes('accommodation'))
    return '🏨 **Hotel Picks:**\n\n**Delhi:** Taj Mahal Hotel (luxury) · Haveli Dharampura (boutique) · Zostel (budget)\n**Jaipur:** Rambagh Palace · Samode Haveli · Zostel Jaipur\n**Mumbai:** Taj Mahal Palace · Abode Bombay · Backpacker Panda\n**Varanasi:** BrijRama Palace (Ganga view) · Suryauday Haveli\n\n💡 Heritage properties fill up months ahead — book early!';

  if (msg.includes('guide') || msg.includes('tour') || msg.includes('local'))
    return '🙋 **GuideMate Guide Packages:**\n\n• 🗺️ **Basic Local** — ₹300/hr: Navigation & orientation\n• 🏛️ **City Expert** — ₹600/hr: History, hidden spots, storytelling\n• 👑 **Premium** — ₹1,200/hr: Luxury access & fine dining\n• 🌍 **Foreigner Pack** — ₹2,000+/hr: Multilingual, visa support\n\n💡 All guides are verified, background-checked & rated 4.5+!';

  if (msg.includes('hidden') || msg.includes('gem') || msg.includes('offbeat'))
    return '💎 **India\'s Hidden Gems:**\n\n• Hampi, Karnataka — surreal boulder landscape (UNESCO)\n• Ziro Valley, Arunachal — paddy fields & tribal culture\n• Mawlynnong, Meghalaya — Asia\'s cleanest village\n• Orchha, MP — medieval Bundelkhand town\n• Gokarna, Karnataka — sacred town with secluded beaches\n\n💡 Your GuideMate guide knows trails not on any app!';

  if (msg.includes('itinerary') || msg.includes('plan') || msg.includes('days'))
    return '📅 **Itinerary Help:**\n\nTell me more and I\'ll build a personalized plan!\n\n• 📍 Where are you going?\n• ⏱️ How many days?\n• 💰 What\'s your budget?\n• 🎯 Interests? (History / Food / Adventure / Photography)\n\n**Quick Frameworks:**\n• 3 days Delhi: Old Delhi → Monuments → Agra\n• 5 days Rajasthan: Jaipur → Pushkar → Jodhpur\n• 4 days Kerala: Alleppey → Munnar → Kovalam\n\n💡 Use the AI Trip Planner on your dashboard for a full itinerary!';

  return '✨ **GuideMate AI — Your Personal Travel Concierge**\n\nI can help with:\n• 🗺️ Travel advice for any city\n• 💎 Hidden gems tourists miss\n• 🏨 Hotel recommendations (any budget)\n• 🍽️ Best food spots and local eats\n• 💰 Budget planning\n• 📅 Day-by-day itinerary\n• 🙋 Guide packages\n\n**Try:** "What can I do tonight in Jaipur?" or "Best food near Charminar?"';
}
