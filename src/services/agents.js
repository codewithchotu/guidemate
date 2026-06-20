import { SAMPLE_GUIDES, GUIDE_PACKAGES, PRICING_MULTIPLIERS } from '../data/guideData';
import travelData from "../data/travelData";

// ============================================
// GUIDE MATCH AGENT
// ============================================

export const GuideMatchAgent = {
  async findBestMatch(travelerPreferences) {
    const {
      language,
      budget,
      interests,
      location,
      packageType,
      groupSize,
      duration,
      rating
    } = travelerPreferences;

    let candidates = SAMPLE_GUIDES.filter(guide => {
      const langMatch = guide.languages.some(lang =>
        lang.toLowerCase().includes(language?.toLowerCase() || 'english')
      );
      const locationMatch = guide.location.toLowerCase().includes(location?.toLowerCase() || '');
      const packageMatch = !packageType || guide.packages.includes(packageType);
      const ratingMatch = !rating || guide.rating >= rating;
      
      return langMatch && locationMatch && packageMatch && ratingMatch;
    });

    const scored = candidates.map(guide => {
      let score = guide.rating * 20;
      const sharedInterests = guide.specializations.filter(spec =>
        interests?.some(int => int.toLowerCase() === spec.toLowerCase())
      ).length;
      score += sharedInterests * 15;
      score += (guide.languages.length - 1) * 5;
      if (guide.responseTime.includes('< 5')) score += 10;
      else if (guide.responseTime.includes('< 8')) score += 5;
      const yearsExp = parseFloat(guide.experience);
      score += yearsExp * 3;
      return { guide, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return {
      topMatch: scored[0]?.guide || null,
      recommendations: scored.slice(0, 3).map(s => s.guide),
      matchScore: scored[0]?.score || 0
    };
  }
};

// ============================================
// TRAVEL PLANNER AGENT
// ============================================

export const TravelPlannerAgent = {
  async createItinerary(travelDetails) {
    const {
      destination,
      duration,
      interests,
      travelStyle,
      budget
    } = travelDetails;

    const activities = {
      'Historical': ['Visit ancient temples', 'Tour historical monuments', 'Museum visit'],
      'Culture': ['Cultural workshops', 'Local art galleries', 'Traditional performances'],
      'Adventure': ['Hiking trips', 'Water sports', 'Outdoor activities'],
      'Food': ['Food walking tours', 'Local markets', 'Cooking classes'],
      'Shopping': ['Local markets', 'Boutique stores', 'Night bazaars']
    };

    const days = [];
    for (let i = 1; i <= duration; i++) {
      const dayActivities = [];
      
      interests?.slice(0, 2).forEach(interest => {
        const actList = activities[interest] || [];
        if (actList.length > 0) {
          dayActivities.push(actList[Math.floor(Math.random() * actList.length)]);
        }
      });

      days.push({
        day: i,
        title: `Day ${i} - ${destination}`,
        activities: dayActivities,
        estimatedBudget: budget / duration,
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        transportation: 'Local guides will manage'
      });
    }

    return {
      destination,
      duration,
      itinerary: days,
      totalBudget: budget,
      highlights: interests,
      bestTimeToVisit: 'October to March',
      tips: [
        'Book guides in advance for better rates',
        'Carry local currency for small transactions',
        'Stay hydrated and use sunscreen',
        'Respect local customs and traditions'
      ]
    };
  }
};

// ============================================
// RECOMMENDATION AGENT
// ============================================

export const RecommendationAgent = {
  async getRecommendations(destination, interests) {
    return {
      destination,
      interests,
      attractions: [
        { name: 'Historical Monument', rating: 4.8, type: 'Historical' },
        { name: 'Art Museum', rating: 4.6, type: 'Culture' },
        { name: 'Adventure Park', rating: 4.5, type: 'Adventure' },
        { name: 'Local Market', rating: 4.7, type: 'Shopping' }
      ],
      hotels: [
        { name: 'Heritage Hotel', price: 3000, rating: 4.6, type: 'Luxury' },
        { name: 'Budget Inn', price: 1000, rating: 4.3, type: 'Budget' },
        { name: 'Boutique Resort', price: 5000, rating: 4.9, type: 'Premium' }
      ],
      restaurants: [
        { name: 'Local Cuisine', cuisine: 'Traditional', rating: 4.8, price: 'Low' },
        { name: 'Fine Dining', cuisine: 'Multi-cuisine', rating: 4.7, price: 'High' },
        { name: 'Street Food Hub', cuisine: 'Street Food', rating: 4.6, price: 'Low' }
      ],
      hiddenGems: [
        { name: 'Secret Garden Cafe', description: 'Local favorite', rating: 4.9 },
        { name: 'Artisan Workshop', description: 'Local crafts', rating: 4.7 },
        { name: 'Sunset Viewpoint', description: 'Best sunset spot', rating: 4.8 }
      ]
    };
  }
};

// ============================================
// SAFETY AGENT
// ============================================

export const SafetyAgent = {
  async assessSafety(destination) {
    return {
      overallScore: 4.5,
      safetyAreas: {
        petty_crime: 3,
        traffic: 4,
        weather: 4,
        health: 4,
        political: 5
      },
      recommendations: [
        '✅ Keep valuables in hotel safe',
        '✅ Avoid walking alone at night',
        '✅ Use authorized taxis or guides',
        '✅ Carry copies of important documents',
        '✅ Stay updated on local news',
        '✅ Follow guide instructions',
        '✅ Emergency contact: +91-999-999-9999'
      ],
      emergencyContacts: {
        police: '100',
        ambulance: '102',
        tourism_helpline: '1800-11-1363'
      },
      bestTimeToVisit: 'October to March',
      worstTimeToVisit: 'May to September'
    };
  }
};

// ============================================
// DYNAMIC REPLANNING AGENT
// ============================================

export const DynamicReplanningAgent = {
  async checkAndReplan(currentItinerary, parameters) {
    const { weather, closedPlaces, guideAvailability } = parameters;
    let needsReplanning = false;
    const issues = [];

    if (weather === 'rain') {
      needsReplanning = true;
      issues.push('Rainy weather - suggests indoor activities');
    }

    if (closedPlaces?.length > 0) {
      needsReplanning = true;
      issues.push(`Some places closed: ${closedPlaces.join(', ')}`);
    }

    if (!guideAvailability) {
      needsReplanning = true;
      issues.push('Guide unavailable - finding alternative');
    }

    if (needsReplanning) {
      return {
        needsReplanning: true,
        issues,
        updatedItinerary: {
          ...currentItinerary,
          activities: ['Indoor museum tour', 'Local market visit', 'Restaurant dinner']
        },
        alternativeGuides: SAMPLE_GUIDES.slice(0, 3)
      };
    }

    return {
      needsReplanning: false,
      issues: [],
      updatedItinerary: currentItinerary
    };
  }
};

// ============================================
// PRICING CALCULATOR AGENT
// ============================================

export const PricingCalculatorAgent = {
  calculateDynamicPrice(basePrice, parameters) {
    const { groupSize = 1, guideRating = 4.0, duration = 1, timeOfBooking = 'instant' } = parameters;

    const groupMultiplier = {
      1: 1.0, 2: 1.3, 3: 1.5, 4: 1.7, 5: 2.0
    }[Math.min(groupSize, 5)] || 2.0;

    const ratingMultiplier = guideRating >= 4.8 ? 1.35 : guideRating >= 4.5 ? 1.15 : 1.0;

    const timeMultiplier = {
      'instant': 1.0,
      'scheduled_1_day': 0.95,
      'scheduled_7_day': 0.90,
      'scheduled_30_day': 0.85
    }[timeOfBooking] || 1.0;

    const finalPrice = basePrice * duration * groupMultiplier * ratingMultiplier * timeMultiplier;

    return {
      basePrice,
      duration,
      groupMultiplier,
      ratingMultiplier,
      timeMultiplier,
      finalPrice: Math.round(finalPrice),
      breakdown: {
        baseCost: basePrice * duration,
        groupAdjustment: `${((groupMultiplier - 1) * 100).toFixed(0)}%`,
        qualityPremium: `${((ratingMultiplier - 1) * 100).toFixed(0)}%`,
        bookingDiscount: `${((1 - timeMultiplier) * 100).toFixed(0)}%`
      }
    };
  }
};

// ============================================
// LEGACY: TRIP PLANNING AGENTS (for backward compatibility)
// ============================================

export function runTripPlanningAgents({ destination, budget, language, duration, interests }) {
  const cityKey = destination.toLowerCase().trim();
  const city = travelData[cityKey] || travelData["tokyo"];

  const matchingBuddies = city.buddies.map(b => {
    let score = b.rating * 10;
    const speaksLanguage = b.languages.some(lang => lang.toLowerCase() === language.toLowerCase());
    if (speaksLanguage) score += 30;
    const sharedInterests = b.specializations.filter(spec => 
      interests.some(int => int.toLowerCase() === spec.toLowerCase())
    );
    score += sharedInterests.length * 10;
    if (b.price * 8 * duration <= budget) {
      score += 20;
    } else {
      score -= 20;
    }
    return { buddy: b, score };
  }).sort((a, b) => b.score - a.score);

  const matchedBuddy = matchingBuddies[0]?.buddy || city.buddies[0];

  const parsedBudget = parseFloat(budget) || 40000;
  const days = parseInt(duration) || 3;
  const hotelBudget = Math.round(parsedBudget * 0.45);
  const foodBudget = Math.round(parsedBudget * 0.20);
  const activitiesBudget = Math.round(parsedBudget * 0.15);
  const companionBudget = Math.round(matchedBuddy.price * 6 * days);
  const localTransportBudget = Math.round(parsedBudget * 0.10);
  const emergencyReserve = Math.round(parsedBudget - (hotelBudget + foodBudget + activitiesBudget + companionBudget + localTransportBudget));

  let preferredAttractions = city.attractions.filter(att => 
    interests.some(int => {
      if (int.toLowerCase() === "culture" && (att.category.toLowerCase() === "culture" || att.category.toLowerCase() === "history")) return true;
      if (int.toLowerCase() === "nature" && att.category.toLowerCase() === "nature") return true;
      if (int.toLowerCase() === "adventure" && att.category.toLowerCase() === "adventure") return true;
      if (int.toLowerCase() === "shopping" && att.category.toLowerCase() === "shopping") return true;
      return att.category.toLowerCase() === int.toLowerCase();
    })
  );

  if (preferredAttractions.length === 0) {
    preferredAttractions = [...city.attractions];
  }

  const itinerary = [];
  for (let i = 1; i <= days; i++) {
    const dayAttractions = [];
    if (preferredAttractions.length > 0) {
      dayAttractions.push(preferredAttractions.shift());
    }
    if (preferredAttractions.length > 0) {
      dayAttractions.push(preferredAttractions.shift());
    }
    if (dayAttractions.length === 0) {
      const idx = (i - 1) % city.attractions.length;
      dayAttractions.push(city.attractions[idx]);
    }

    const restIdx = (i - 1) % city.restaurants.length;
    const foodSpot = city.restaurants[restIdx];

    itinerary.push({
      day: i,
      title: `Day ${i}: Explore ${city.name}`,
      attractions: dayAttractions,
      dining: foodSpot,
      transportTip: i === 1 
        ? "Use local metro / public transit. Highly cost-effective." 
        : `Explore on foot with your local Buddy, ${matchedBuddy.name}.`
    });
  }

  const safetyStatus = {
    score: city.safety.score,
    police: city.safety.police,
    ambulance: city.safety.ambulance,
    embassy: city.safety.embassy,
    touristHelpline: city.safety.touristHelpline,
    advisories: city.safety.advisories,
    scams: city.safety.scams,
    recommendations: city.safety.recommendations
  };

  return {
    destination: city.name,
    country: city.country,
    description: city.description,
    currency: city.currency,
    weather: city.weather,
    buddy: matchedBuddy,
    budget: {
      total: parsedBudget,
      hotel: hotelBudget,
      food: foodBudget,
      activities: activitiesBudget,
      companion: companionBudget,
      transport: localTransportBudget,
      reserve: Math.max(0, emergencyReserve)
    },
    itinerary,
    safety: safetyStatus,
    hotels: city.hotels,
    restaurants: city.restaurants,
    shopping: city.shopping,
    attractions: city.attractions,
    simulationSteps: [
      {
        agent: "Guide Matching Agent",
        status: "Analyzing availability and language skills...",
        detail: `Scanning guides in ${city.name} fluent in ${language}. Matched with ${matchedBuddy.name} (${matchedBuddy.rating}★).`
      }
    ]
  };
}
