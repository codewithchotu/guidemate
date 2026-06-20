import dotenv from 'dotenv';
dotenv.config();

// Conditionally import @google/generative-ai if available
let genAI = null;
try {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
} catch (err) {
  console.log('Google Generative AI not installed or API key not set. Using mock fallback engine.');
}

// ============================================
// CITY COORDINATES & POI DATABASE
// ============================================

const CITY_COORDINATES = {
  'Delhi': { lat: 28.6139, lng: 77.2090 },
  'Mumbai': { lat: 18.9520, lng: 72.8202 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Goa': { lat: 15.2993, lng: 73.8243 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Dubai': { lat: 25.2048, lng: 55.2708 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Tokyo': { lat: 35.6762, lng: 139.6503 },
  'Paris': { lat: 48.8566, lng: 2.3522 }
};

const CITY_POIS = {
  'Delhi': {
    attractions: [
      { name: 'Taj Mahal Adjacent', category: 'Monument', rating: 4.8, lat: 28.6134, lng: 77.1755, description: 'Historical marvel' },
      { name: 'Red Fort', category: 'Monument', rating: 4.7, lat: 28.6562, lng: 77.2410, description: 'Historic fort and museum' },
      { name: 'Chandni Chowk', category: 'Market', rating: 4.6, lat: 28.6505, lng: 77.2303, description: 'Historic street market' }
    ],
    hotels: [
      { name: 'Taj Palace New Delhi', category: 'Hotel', rating: 4.8, lat: 28.5921, lng: 77.2016, description: 'Luxury hotel' },
      { name: 'Oberoi Delhi', category: 'Hotel', rating: 4.7, lat: 28.5890, lng: 77.2040, description: 'Premium hotel' }
    ],
    restaurants: [
      { name: 'Karim\'s Restaurant', category: 'Restaurant', rating: 4.6, lat: 28.6505, lng: 77.2303, description: 'Mughlai cuisine' },
      { name: 'Dilli Haat', category: 'Food', rating: 4.5, lat: 28.5245, lng: 77.1846, description: 'Local food bazaar' }
    ]
  },
  'Mumbai': {
    attractions: [
      { name: 'Gateway of India', category: 'Monument', rating: 4.8, lat: 18.9220, lng: 72.8347, description: 'Iconic monument' },
      { name: 'Marine Drive', category: 'Beach', rating: 4.7, lat: 18.9432, lng: 72.8236, description: 'Scenic beach road' },
      { name: 'Chhatrapati Station', category: 'Monument', rating: 4.6, lat: 18.9340, lng: 72.8260, description: 'UNESCO heritage station' }
    ],
    hotels: [
      { name: 'Taj Mahal Palace', category: 'Hotel', rating: 4.9, lat: 18.9242, lng: 72.8289, description: 'Iconic luxury hotel' },
      { name: 'JW Marriott Mumbai', category: 'Hotel', rating: 4.7, lat: 18.9356, lng: 72.8210, description: 'Premium hotel' }
    ],
    restaurants: [
      { name: 'Mahesh Lunch Home', category: 'Restaurant', rating: 4.7, lat: 18.9432, lng: 72.8236, description: 'Seafood restaurant' },
      { name: 'Sukanya Foods', category: 'Food', rating: 4.5, lat: 18.9220, lng: 72.8347, description: 'Local street food' }
    ]
  },
  'Jaipur': {
    attractions: [
      { name: 'Amber Palace', category: 'Palace', rating: 4.9, lat: 26.9855, lng: 75.8513, description: 'Majestic palace complex' },
      { name: 'City Palace', category: 'Palace', rating: 4.8, lat: 26.9244, lng: 75.8247, description: 'Royal residence' },
      { name: 'Hawa Mahal', category: 'Monument', rating: 4.7, lat: 26.9245, lng: 75.8231, description: 'Palace of Winds' }
    ],
    hotels: [
      { name: 'Rambagh Palace', category: 'Hotel', rating: 4.9, lat: 26.9124, lng: 75.7873, description: 'Royal palace hotel' },
      { name: 'Jai Mahal Palace', category: 'Hotel', rating: 4.8, lat: 26.8245, lng: 75.7890, description: 'Luxury palace hotel' }
    ],
    restaurants: [
      { name: 'Niros Restaurant', category: 'Restaurant', rating: 4.6, lat: 26.9124, lng: 75.7873, description: 'Rajasthani cuisine' },
      { name: 'Chokhi Dhani', category: 'Food', rating: 4.5, lat: 26.8650, lng: 75.7234, description: 'Heritage village experience' }
    ]
  },
  'Tokyo': {
    attractions: [
      { name: 'Senso-ji Temple', category: 'Temple', rating: 4.8, lat: 35.7148, lng: 139.7967, description: 'Ancient Buddhist temple' },
      { name: 'Meiji Shrine', category: 'Shrine', rating: 4.9, lat: 35.6762, lng: 139.6974, description: 'Shinto shrine' },
      { name: 'Tokyo Tower', category: 'Monument', rating: 4.7, lat: 35.6595, lng: 139.7454, description: 'Iconic tower' }
    ],
    hotels: [
      { name: 'Park Hyatt Tokyo', category: 'Hotel', rating: 4.8, lat: 35.6814, lng: 139.7298, description: 'Luxury hotel' },
      { name: 'Peninsula Tokyo', category: 'Hotel', rating: 4.9, lat: 35.6764, lng: 139.7589, description: 'Premium hotel' }
    ],
    restaurants: [
      { name: 'Tsukiji Outer Market', category: 'Food', rating: 4.7, lat: 35.6659, lng: 139.7738, description: 'Fresh seafood market' },
      { name: 'Ichiran Ramen', category: 'Restaurant', rating: 4.6, lat: 35.6650, lng: 139.7300, description: 'Traditional ramen' }
    ]
  },
  'Paris': {
    attractions: [
      { name: 'Eiffel Tower', category: 'Monument', rating: 4.9, lat: 48.8584, lng: 2.2945, description: 'Iconic iron lattice tower' },
      { name: 'Louvre Museum', category: 'Museum', rating: 4.8, lat: 48.8606, lng: 2.3352, description: 'World\'s largest art museum' },
      { name: 'Notre-Dame', category: 'Cathedral', rating: 4.7, lat: 48.8530, lng: 2.3499, description: 'Historic cathedral' }
    ],
    hotels: [
      { name: 'Ritz Paris', category: 'Hotel', rating: 4.9, lat: 48.8687, lng: 2.3261, description: 'Legendary luxury hotel' },
      { name: 'Le Bristol Paris', category: 'Hotel', rating: 4.8, lat: 48.8693, lng: 2.3086, description: 'Premium palace hotel' }
    ],
    restaurants: [
      { name: 'L\'Astrance', category: 'Restaurant', rating: 4.8, lat: 48.8550, lng: 2.2951, description: 'Michelin-starred restaurant' },
      { name: 'Café de Flore', category: 'Café', rating: 4.6, lat: 48.8540, lng: 2.3306, description: 'Historic café' }
    ]
  }
};

// ============================================
// MOCK FALLBACK DATASETS
// ============================================

const MOCK_ITINERARY = (city, days, budget, interests) => ({
  city,
  duration: days,
  budget,
  interests,
  itinerary: Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    theme: interests[i % interests.length] || 'Exploration',
    attractions: [
      { name: `${city} Landmark ${i + 1}`, time: '09:00 AM', duration: '2 hours', description: 'Must-see attraction' },
      { name: `${city} Hidden Gem ${i + 1}`, time: '12:00 PM', duration: '2 hours', description: 'Local favorite spot' },
      { name: `${city} Restaurant ${i + 1}`, time: '07:00 PM', duration: '2 hours', description: 'Authentic local cuisine' }
    ],
    estimatedCost: Math.round(budget / days)
  })),
  totalEstimatedCost: budget,
  highlights: [
    'Visit major attractions during off-peak hours',
    'Try authentic local cuisine',
    'Connect with local guides for insider tips',
    'Capture photography moments at golden hour'
  ]
});

const MOCK_SAFETY_ASSESSMENT = (city) => ({
  city,
  overallSafetyScore: 75 + Math.random() * 20,
  safetyAreas: [
    { area: `${city} Central District`, score: 85, description: 'Very safe, high police presence' },
    { area: `${city} Tourist Zone`, score: 80, description: 'Safe for tourists, well-monitored' },
    { area: `${city} Local Market`, score: 70, description: 'Generally safe, use caution after dark' }
  ],
  commonScams: [
    'Overcharging by auto-rickshaws (always use meter or pre-arrange fare)',
    'Unofficial tour guides (use verified guides only)',
    'Counterfeit goods at night markets (shop during day)',
    'Unsolicited money exchange (use official channels)'
  ],
  emergencyContacts: {
    police: '100',
    ambulance: '102',
    fire: '101',
    touristPolice: '1090',
    embassy: '+91-11-XXXX-XXXX'
  },
  recommendations: [
    'Carry copies of important documents',
    'Share your itinerary with someone',
    'Use official transportation',
    'Keep valuables in hotel safe',
    'Stay aware of your surroundings'
  ]
});

const MOCK_BUDGET_BREAKDOWN = (totalBudget, days) => ({
  totalBudget,
  duration: days,
  breakdown: {
    accommodation: {
      category: 'Hotel (3-star avg)',
      amount: Math.round(totalBudget * 0.35),
      percentage: 35,
      daily: Math.round((totalBudget * 0.35) / days),
      tips: 'Book hotels in central areas for convenience'
    },
    food: {
      category: 'Food & Dining',
      amount: Math.round(totalBudget * 0.25),
      percentage: 25,
      daily: Math.round((totalBudget * 0.25) / days),
      tips: 'Mix fine dining with street food for authentic experience'
    },
    transportation: {
      category: 'Local Transport & Transfers',
      amount: Math.round(totalBudget * 0.15),
      percentage: 15,
      daily: Math.round((totalBudget * 0.15) / days),
      tips: 'Use local metro/buses for cost-effective travel'
    },
    activities: {
      category: 'Activities & Tours',
      amount: Math.round(totalBudget * 0.15),
      percentage: 15,
      daily: Math.round((totalBudget * 0.15) / days),
      tips: 'Book activities in advance for better rates'
    },
    contingency: {
      category: 'Emergency & Misc',
      amount: Math.round(totalBudget * 0.10),
      percentage: 10,
      daily: Math.round((totalBudget * 0.10) / days),
      tips: 'Always keep emergency reserves'
    }
  },
  optimizationTips: [
    'Travel during off-season for better hotel rates',
    'Use public transportation instead of taxis',
    'Eat at local restaurants for authentic meals at lower prices',
    'Book combo packages for multiple attractions',
    'Consider group discounts if traveling with others'
  ]
});

// ============================================
// AI AGENT FUNCTIONS
// ============================================

/**
 * Planner Agent - Creates day-wise itinerary
 */
export async function plannerAgent(destination, days, interests) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `
        Create a detailed ${days}-day travel itinerary for ${destination} for someone interested in: ${interests.join(', ')}.
        Format as JSON with the structure:
        {
          "city": "${destination}",
          "duration": ${days},
          "itinerary": [
            { "day": 1, "theme": "...", "attractions": [...], "meals": [...], "estimatedCost": ... }
          ],
          "highlights": [...],
          "totalEstimatedCost": ...
        }
      `;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.log('Planner agent API error, using mock:', err.message);
    }
  }
  
  // Mock fallback
  return MOCK_ITINERARY(destination, days, 50000, interests);
}

/**
 * Guide Match Agent - Finds best guide and calculates match score
 */
export async function guideMatchAgent(destination, interests, budget, guides) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const guidesJson = JSON.stringify(guides);
      const prompt = `
        Find the best matching guide from this list for a traveler visiting ${destination} 
        interested in ${interests.join(', ')} with budget ${budget}:
        ${guidesJson}
        
        Return JSON: {
          "matchedGuide": { ...guide details },
          "matchScore": 95,
          "matchReason": "This guide specializes in... and has... experience"
        }
      `;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.log('Guide match agent API error, using mock:', err.message);
    }
  }
  
  // Mock fallback - find best guide for destination
  const destinationGuides = guides.filter(g => 
    g.location.toLowerCase() === destination.toLowerCase() ||
    destination.toLowerCase().includes(g.location.toLowerCase())
  );
  
  const bestGuide = destinationGuides.length > 0 
    ? destinationGuides.reduce((a, b) => (a.rating > b.rating ? a : b))
    : guides[0];
  
  return {
    matchedGuide: bestGuide,
    matchScore: 85 + Math.random() * 15,
    matchReason: `${bestGuide.name} specializes in ${bestGuide.specializations.join(', ')} with ${bestGuide.experience} of experience and ${bestGuide.reviews} positive reviews. Speaks ${bestGuide.languages.join(', ')}.`,
    compatibility: interests.filter(i => 
      bestGuide.specializations.some(s => s.toLowerCase().includes(i.toLowerCase()))
    ).length / interests.length * 100
  };
}

/**
 * Safety Agent - Assesses city safety
 */
export async function safetyAgent(destination) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `
        Provide a safety assessment for travelers visiting ${destination}.
        Return JSON: {
          "city": "${destination}",
          "overallSafetyScore": 80,
          "safeAreas": [...],
          "commonScams": [...],
          "emergencyContacts": {...},
          "recommendations": [...]
        }
      `;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.log('Safety agent API error, using mock:', err.message);
    }
  }
  
  // Mock fallback
  return MOCK_SAFETY_ASSESSMENT(destination);
}

/**
 * Budget Agent - Allocates expenses
 */
export async function budgetAgent(totalBudget, days, destination) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `
        Create a detailed budget allocation for a ${days}-day trip to ${destination} with total budget ₹${totalBudget}.
        Return JSON: {
          "totalBudget": ${totalBudget},
          "duration": ${days},
          "breakdown": {
            "accommodation": { "category": "...", "amount": ..., "percentage": ..., "tips": "..." },
            "food": { ... },
            "transportation": { ... },
            "activities": { ... },
            "contingency": { ... }
          },
          "optimizationTips": [...]
        }
      `;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.log('Budget agent API error, using mock:', err.message);
    }
  }
  
  // Mock fallback
  return MOCK_BUDGET_BREAKDOWN(totalBudget, days);
}

// ============================================
// ORCHESTRATION FUNCTION
// ============================================

/**
 * Master trip planning orchestration
 */
export async function orchestrateTripPlanning(options, guides) {
  const { destination, days, budget, interests } = options;
  
  console.log(`\n🎯 Orchestrating AI trip planning for ${destination}...`);
  
  const [itinerary, guideMatch, safety, budget_] = await Promise.all([
    plannerAgent(destination, days, interests),
    guideMatchAgent(destination, interests, budget, guides),
    safetyAgent(destination),
    budgetAgent(budget, days, destination)
  ]);
  
  // Get POI data
  const pois = CITY_POIS[destination] || CITY_POIS['Delhi'];
  const cityCoords = CITY_COORDINATES[destination] || CITY_COORDINATES['Delhi'];
  
  return {
    success: true,
    planning: {
      itinerary,
      guideMatch,
      safety,
      budget: budget_,
      mapData: {
        center: cityCoords,
        pois,
        guideLat: guideMatch.matchedGuide.lat,
        guideLng: guideMatch.matchedGuide.lng
      }
    }
  };
}

export { CITY_COORDINATES, CITY_POIS };
