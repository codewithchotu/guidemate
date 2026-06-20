export const travelData = {
  "dubai": {
    name: "Dubai",
    country: "United Arab Emirates",
    description: "A futuristic metropolis in the desert, known for luxury shopping, ultramodern architecture, and a lively nightlife scene.",
    currency: "AED",
    weather: { temp: "38°C", condition: "Sunny", desc: "Clear sky and warm wind" },
    safety: {
      score: 92,
      police: "+971-901 (Non-Emergency) or 999 (Emergency)",
      ambulance: "998",
      embassy: "+971-2-414 2200 (US Embassy, Abu Dhabi)",
      touristHelpline: "800-4438",
      advisories: [
        "Expect extremely high temperatures during midday summer hours. Stay hydrated.",
        "Respect local laws regarding public behavior and attire, especially near religious sites."
      ],
      scams: [
        "Unofficial airport taxi operators charging inflated flat rates.",
        "Overpriced gemstone and fake designer watch sellers in souks.",
        "Aggressive street perfume sellers offering 'special promotional items'."
      ],
      recommendations: [
        "Always use official RTA taxis (cream-colored) with active meters or ride-hailing apps.",
        "Ensure your shoulders and knees are covered when visiting mosques and public governmental zones.",
        "Limit outdoor activities between 11 AM and 4 PM during June-September."
      ]
    },
    buddies: [
      {
        id: "dxb-b1",
        name: "Ahmed Al-Mansoori",
        languages: ["Arabic", "English"],
        rating: 4.9,
        reviewCount: 48,
        price: 450, // hourly in currency/INR equivalent (let's standardize to INR / USD equivalents: say, INR values like ₹500/hr)
        city: "Dubai",
        specializations: ["Culture", "Adventure", "History"],
        experience: "4 years",
        availability: "Available",
        bio: "Emirati local who loves sharing the rich history behind the glitter of modern Dubai. Let's explore the hidden spice souks, traditional wind towers, and desert dunes!",
        reviews: [
          { author: "Sarah L.", rating: 5, text: "Ahmed was an amazing guide! He took us to the oldest part of Dubai and we had the best authentic Emirati meal." },
          { author: "Mark T.", rating: 4.8, text: "Very friendly and knowledgeable. The desert safari recommendation was top notch!" }
        ]
      },
      {
        id: "dxb-b2",
        name: "Rahul Verma",
        languages: ["Hindi", "English", "Urdu"],
        rating: 4.8,
        reviewCount: 92,
        price: 350,
        city: "Dubai",
        specializations: ["Shopping", "Food", "Modern City"],
        experience: "6 years",
        availability: "Available",
        bio: "Dubai resident for 15 years. Specializes in finding the best deals in gold and spice souks, as well as secret street-food joints in Deira.",
        reviews: [
          { author: "Priya S.", rating: 5, text: "Highly recommend Rahul for shopping! He negotiated excellent prices for gold jewelry for us." }
        ]
      },
      {
        id: "dxb-b3",
        name: "Fatima Khan",
        languages: ["English", "Arabic", "Urdu"],
        rating: 5.0,
        reviewCount: 14,
        price: 500,
        city: "Dubai",
        specializations: ["Luxury Experience", "Shopping", "Culture"],
        experience: "3 years",
        availability: "Busy",
        bio: "Passionate about local art, luxury spots, and women-only groups looking for a comfortable and safe companion around Dubai.",
        reviews: [
          { author: "Elena R.", rating: 5, text: "Fatima made our girls' trip so safe and incredibly fun. A absolute gem!" }
        ]
      }
    ],
    attractions: [
      { name: "Burj Khalifa", category: "Culture", rating: 4.9, fee: "₹3,500", details: "The world's tallest building, offering stunning 360 views from the 124th and 148th floors." },
      { name: "The Dubai Mall", category: "Shopping", rating: 4.8, fee: "Free Entry", details: "Massive retail, leisure and entertainment destination featuring an indoor aquarium and Olympic-sized ice rink." },
      { name: "Desert Safari Dunes", category: "Adventure", rating: 4.9, fee: "₹2,500", details: "Thrilling dune bashing, camel rides, traditional belly dancing, and a barbecue dinner under the desert stars." },
      { name: "Al Fahidi Historical District", category: "Culture", rating: 4.7, fee: "Free Entry", details: "Historic neighborhood showcasing mid-19th century life, winding alleys, and traditional wind-tower architecture." },
      { name: "Dubai Marina Yacht Cruise", category: "Nature", rating: 4.8, fee: "₹1,800", details: "Scenic cruise showing off Dubai's sparkling skyscrapers and luxurious yachts." }
    ],
    hotels: [
      { name: "Atlantis The Palm", rating: 4.9, price: "₹35,000/night", type: "Luxury" },
      { name: "Rove Downtown", rating: 4.6, price: "₹8,000/night", type: "Mid-range" },
      { name: "Citymax Hotel Bur Dubai", rating: 4.1, price: "₹4,000/night", type: "Budget" }
    ],
    restaurants: [
      { name: "Al Ustadadi Special Kebab", rating: 4.8, price: "$", cuisine: "Iranian / Middle Eastern", recommendation: "Famous garlic chicken kebabs" },
      { name: "Arabian Tea House", rating: 4.7, price: "$$", cuisine: "Emirati / Arabic", recommendation: "Traditional Emirati Breakfast tray" },
      { name: "Ossiano at Atlantis", rating: 4.9, price: "$$$", cuisine: "Seafood / Fine Dining", recommendation: "Caviar and underwater dining view" }
    ],
    shopping: [
      { name: "Gold Souk Deira", type: "Market", description: "Traditional market with hundreds of shops selling glittering gold chains, rings, and bangles." },
      { name: "Mall of the Emirates", type: "Mall", description: "Home to Ski Dubai, luxury fashion stores, and a huge selection of international boutiques." }
    ]
  },
  "tokyo": {
    name: "Tokyo",
    country: "Japan",
    description: "Japan's bustling capital, mixing ultramodern skyscrapers with historic Shinto shrines and gorgeous cherry blossoms.",
    currency: "JPY",
    weather: { temp: "22°C", condition: "Cloudy", desc: "Mild temperature, slight chance of rain" },
    safety: {
      score: 98,
      police: "110 (Emergency)",
      ambulance: "119",
      embassy: "+81-3-3224-5000 (US Embassy, Minato City)",
      touristHelpline: "050-3816-2720",
      advisories: [
        "Be aware of occasional minor earthquakes. Know your hotel's evacuation assembly zones.",
        "Trains stop running around midnight. Plan your return trips accordingly to avoid expensive taxi fares."
      ],
      scams: [
        "Kabukicho (Shinjuku) bar touts promising 'cheap drinks' then adding massive hidden table charges.",
        "Overpriced photography requests by strangers who demand payment for taking their picture.",
        "Fake charity monks offering brass medallions in exchange for large cash donations near temples."
      ],
      recommendations: [
        "Avoid any bar promoted by street touts, particularly in Shinjuku and Roppongi.",
        "Keep your passport with you at all times as required by Japanese law.",
        "Download offline maps and metro apps; Tokyo's underground system is complex but highly efficient."
      ]
    },
    buddies: [
      {
        id: "hnd-b1",
        name: "Akira Tanaka",
        languages: ["Japanese", "English"],
        rating: 5.0,
        reviewCount: 37,
        price: 600,
        city: "Tokyo",
        specializations: ["Food", "Culture", "Nature"],
        experience: "5 years",
        availability: "Available",
        bio: "Born and raised in Tokyo. Let me show you the quiet temples in Yanaka, secret Izakayas in Yurakucho, and the perfect sushi spots in Tsukiji!",
        reviews: [
          { author: "Danielle K.", rating: 5, text: "Akira was stellar! We went to a hidden retro alleyway that we would never have found on our own. Outstanding!" },
          { author: "Kenji M.", rating: 5, text: "Excellent guide. Highly recommended for a customized food tour." }
        ]
      },
      {
        id: "hnd-b2",
        name: "Yuki Sato",
        languages: ["Japanese", "English", "Mandarin"],
        rating: 4.9,
        reviewCount: 56,
        price: 550,
        city: "Tokyo",
        specializations: ["Shopping", "Anime & Pop Culture", "Modern City"],
        experience: "3 years",
        availability: "Available",
        bio: "Pop culture enthusiast. I can guide you through the best retro gaming shops in Akihabara, vintage shopping in Shimokitazawa, and fashion in Harajuku.",
        reviews: [
          { author: "Wei L.", rating: 4.9, text: "Yuki helped me find rare anime figures at incredible prices. She was super friendly!" }
        ]
      },
      {
        id: "hnd-b3",
        name: "Kenji Sato",
        languages: ["Japanese", "Spanish", "English"],
        rating: 4.8,
        reviewCount: 22,
        price: 500,
        city: "Tokyo",
        specializations: ["History", "Photography", "Culture"],
        experience: "7 years",
        availability: "Offline",
        bio: "Professional photographer and history buff. Let's capture the best neon night shots of Shibuya Crossing and learn about the Edo period history.",
        reviews: [
          { author: "Maria G.", rating: 5, text: "Kenji was fantastic. He took professional-quality photos of us during our walk. Well worth it!" }
        ]
      }
    ],
    attractions: [
      { name: "Shibuya Crossing & Hachiko", category: "Modern City", rating: 4.8, fee: "Free", details: "The famous, world's busiest pedestrian crossing surrounded by neon advertisements and giant video screens." },
      { name: "Senso-ji Temple (Asakusa)", category: "Culture", rating: 4.9, fee: "Free Entry", details: "Tokyo's oldest and most iconic Buddhist temple, approached via the historic Nakamise shopping street." },
      { name: "Akihabara Electric Town", category: "Shopping", rating: 4.7, fee: "Free", details: "The global hub for electronics, anime, gaming subcultures, and themed cafes." },
      { name: "Shinjuku Gyoen National Garden", category: "Nature", rating: 4.9, fee: "₹300", details: "One of Tokyo's largest and most beautiful parks, combining formal French, English, and traditional Japanese designs." },
      { name: "Meiji Jingu Shrine", category: "Culture", rating: 4.8, fee: "Free Entry", details: "Serene Shinto shrine dedicated to Emperor Meiji, nestled within a massive lush forest in the middle of Tokyo." }
    ],
    hotels: [
      { name: "Park Hyatt Tokyo", rating: 4.9, price: "₹45,000/night", type: "Luxury" },
      { name: "Hotel Gracery Shinjuku", rating: 4.5, price: "₹12,000/night", type: "Mid-range" },
      { name: "Nine Hours capsule Shinjuku", rating: 4.2, price: "₹3,500/night", type: "Budget" }
    ],
    restaurants: [
      { name: "Ichiran Ramen Shibuya", rating: 4.7, price: "$", cuisine: "Ramen", recommendation: "Tonkotsu Ramen with custom spice blend" },
      { name: "Harajuku Gyozaro", rating: 4.6, price: "$", cuisine: "Gyoza", recommendation: "Pan-fried and steamed garlic leek gyoza" },
      { name: "Sushizanmai Shinjuku", rating: 4.5, price: "$$", cuisine: "Sushi", recommendation: "Tuna platter and fresh salmon sashimi" }
    ],
    shopping: [
      { name: "Nakamise Shopping Street", type: "Market", description: "Dozens of traditional stalls selling souvenirs, fans, and street snacks like sweet red-bean cakes." },
      { name: "Shibuya 109", type: "Mall", description: "Iconic multi-story fashion mall catering to Tokyo's trendy youth cultures." }
    ]
  },
  "paris": {
    name: "Paris",
    country: "France",
    description: "A global center for art, fashion, gastronomy, and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.",
    currency: "EUR",
    weather: { temp: "18°C", condition: "Rainy", desc: "Cool breeze, drizzling" },
    safety: {
      score: 80,
      police: "17 (Emergency)",
      ambulance: "15",
      embassy: "+33-1-43-12-22-22 (US Embassy, Paris)",
      touristHelpline: "+33-1-49-52-42-63",
      advisories: [
        "Pickpocketing is extremely common around tourist hotspots like the Eiffel Tower, Louvre, and Sacre-Coeur.",
        "Protests and strikes (manifestations) occur frequently. Check local news to avoid major blockages."
      ],
      scams: [
        "The string/friendship bracelet scam at Sacre-Coeur where sellers tie strings on your wrist and demand payment.",
        "The 'gold ring' trick where a stranger pretends to find a valuable ring on the floor and asks you for cash.",
        "The fake petition scam, where teenagers pretend to be deaf/mute and collect cash donations while pickpocketing you."
      ],
      recommendations: [
        "Never sign any paper petitions or talk to people carrying clipboards near tourist centers.",
        "Keep your backpack zipped and carry it in front of you when riding crowded metro lines.",
        "Avoid buying tickets or merchandise from street vendors who do not have permanent metal booths."
      ]
    },
    buddies: [
      {
        id: "cdg-b1",
        name: "Chloe Dubois",
        languages: ["French", "English", "Spanish"],
        rating: 4.9,
        reviewCount: 65,
        price: 500,
        city: "Paris",
        specializations: ["Culture", "History", "Food"],
        experience: "5 years",
        availability: "Available",
        bio: "Art historian and Parisian native. I love showing visitors the secrets of Montmartre, local art galleries in Marais, and the absolute best butter croissants in town!",
        reviews: [
          { author: "James P.", rating: 5, text: "Chloe's knowledge of French art history made our trip to Montmartre so memorable. It felt like walking with a friend!" }
        ]
      },
      {
        id: "cdg-b2",
        name: "Jean-Pierre",
        languages: ["French", "English"],
        rating: 4.7,
        reviewCount: 30,
        price: 450,
        city: "Paris",
        specializations: ["Food", "History", "Nature"],
        experience: "8 years",
        availability: "Available",
        bio: "Wine lover and foodie. Let's stroll along the Seine, learn how to pair local cheese with fine Bordeaux, and discover hidden passageways.",
        reviews: [
          { author: "Sophie A.", rating: 4.8, text: "The wine and cheese tasting tour JP organized was fabulous. We learned so much!" }
        ]
      }
    ],
    attractions: [
      { name: "Eiffel Tower", category: "Culture", rating: 4.8, fee: "₹2,200", details: "The iconic wrought-iron lattice tower on the Champ de Mars, offering breathtaking views of the city." },
      { name: "The Louvre Museum", category: "Culture", rating: 4.9, fee: "₹1,800", details: "The world's largest art museum, home to the Mona Lisa and Venus de Milo." },
      { name: "Sacre-Coeur & Montmartre", category: "Culture", rating: 4.8, fee: "Free Entry", details: "Stunning white Basilica set on the highest point in Paris, overlooking an artistic neighborhood." },
      { name: "Seine River Cruise", category: "Nature", rating: 4.7, fee: "₹1,200", details: "Relaxing boat tour passing under famous bridges and showing off historic monuments like Notre-Dame." },
      { name: "Jardin du Luxembourg", category: "Nature", rating: 4.9, fee: "Free Entry", details: "Grand 17th-century public gardens featuring gravel paths, fountains, statues, and toy sailboat basins." }
    ],
    hotels: [
      { name: "The Ritz Paris", rating: 5.0, price: "₹65,000/night", type: "Luxury" },
      { name: "Hotel Le Regent Paris", rating: 4.4, price: "₹15,000/night", type: "Mid-range" },
      { name: "Generator Hostel Paris", rating: 4.1, price: "₹3,000/night", type: "Budget" }
    ],
    restaurants: [
      { name: "L'As du Fallafel", rating: 4.7, price: "$", cuisine: "Middle Eastern", recommendation: "Special Falafel pita wrap" },
      { name: "Bouillon Pigalle", rating: 4.5, price: "$$", cuisine: "Traditional French", recommendation: "Escargot, steak frites, and profiteroles" },
      { name: "Le Jules Verne", rating: 4.9, price: "$$$", cuisine: "Modern French Gastronomy", recommendation: "Multi-course tasting menu on Eiffel Tower" }
    ],
    shopping: [
      { name: "Galeries Lafayette", type: "Mall", description: "Stunning historical department store under an ornate glass dome, offering high-end fashion and food halls." },
      { name: "Rue de Rivoli", type: "Market", description: "Bustling street with famous fashion chain stores and tourist souvenir shops." }
    ]
  },
  "hyderabad": {
    name: "Hyderabad",
    country: "India",
    description: "Capital of southern India's Telangana state. A historic center of the pearl trade, globally famous for its authentic Dum Biryani.",
    currency: "INR",
    weather: { temp: "30°C", condition: "Humid", desc: "Warm and partly cloudy" },
    safety: {
      score: 89,
      police: "100 (Emergency) or +91-40-2785 2435",
      ambulance: "108",
      embassy: "+91-40-4033 8300 (US Consulate General, Nanakramguda)",
      touristHelpline: "1800-425-46464",
      advisories: [
        "Be careful when walking on roads with heavy traffic. Traffic rules are often loosely followed.",
        "Drink only bottled mineral water. Avoid ice or raw salad from local street-side vendors."
      ],
      scams: [
        "Auto-rickshaws refusing to run on meters and charging high fixed rates to tourists.",
        "Local street jewelers selling fake pearls claiming they are genuine Basra pearls.",
        "Overpriced guides around Golconda Fort who do not hold official tourist board licenses."
      ],
      recommendations: [
        "Book autos and cabs through apps like Ola, Uber, or Rapido to avoid fare negotiations.",
        "Look for the government-approved 'Telangana Tourism' badges when hiring guides at Golconda Fort.",
        "Keep change (₹10, ₹20 notes) handy for entrance tickets and small street snacks."
      ]
    },
    buddies: [
      {
        id: "hyd-b1",
        name: "Syed Abdul",
        languages: ["English", "Urdu", "Telugu", "Hindi"],
        rating: 4.9,
        reviewCount: 78,
        price: 250,
        city: "Hyderabad",
        specializations: ["Food", "History", "Culture"],
        experience: "6 years",
        availability: "Available",
        bio: "Old City expert and food fanatic. Let me take you on a culinary journey for the best Irani Chai, Osmania biscuits, authentic Hyderabadi Biryani, and explore Charminar's secrets!",
        reviews: [
          { author: "Anil K.", rating: 5, text: "Abdul knows the Old City inside out. We had amazing biryani and some incredible street food. A must-book guide!" }
        ]
      },
      {
        id: "hyd-b2",
        name: "Lekha Reddy",
        languages: ["English", "Telugu", "Hindi"],
        rating: 4.8,
        reviewCount: 34,
        price: 200,
        city: "Hyderabad",
        specializations: ["Shopping", "Culture", "Modern City"],
        experience: "3 years",
        availability: "Available",
        bio: "Fashion student and pearl expert. Let's shop for gorgeous glass bangles at Laad Bazaar, find authentic pearls, and visit Shilparamam crafts village.",
        reviews: [
          { author: "Emily J.", rating: 5, text: "Lekha was wonderful! She helped me select beautiful pearls and haggled with shopkeepers to save me money." }
        ]
      }
    ],
    attractions: [
      { name: "Charminar", category: "Culture", rating: 4.8, fee: "₹40", details: "Historic mosque built in 1591, featuring four grand arches, situated in the heart of Hyderabad's old market." },
      { name: "Golconda Fort", category: "History", rating: 4.9, fee: "₹80", details: "A massive, acoustics-designed medieval fortress famed for its military architecture and sound & light show." },
      { name: "Chowmahalla Palace", category: "Culture", rating: 4.8, fee: "₹100", details: "Stunning palace complex of the Nizams, featuring grand courtyards, vintage cars, and ornate chandeliers." },
      { name: "Hussain Sagar & Buddha Statue", category: "Nature", rating: 4.6, fee: "₹100", details: "A large heart-shaped lake featuring a massive monolithic Buddha statue carved from single white granite stone." },
      { name: "Laad Bazaar (Choodi Bazaar)", category: "Shopping", rating: 4.7, fee: "Free Entry", details: "Bustling, colorful bazaar famous for lacquer bangles studded with artificial diamonds and pearls." }
    ],
    hotels: [
      { name: "Taj Falaknuma Palace", rating: 4.9, price: "₹40,000/night", type: "Luxury" },
      { name: "ITC Kohenur", rating: 4.7, price: "₹10,000/night", type: "Mid-range" },
      { name: "Red Fox Hotel HITEC City", rating: 4.0, price: "₹3,000/night", type: "Budget" }
    ],
    restaurants: [
      { name: "Cafe Bahar", rating: 4.6, price: "$", cuisine: "Hyderabadi / Mughlai", recommendation: "Hyderabadi Dum Biryani and Haleem" },
      { name: "Nimrah Cafe and Bakery", rating: 4.8, price: "$", cuisine: "Irani Cafe", recommendation: "Irani Chai and Osmania Biscuits" },
      { name: "Jewel of Nizams", rating: 4.8, price: "$$$", cuisine: "Royal Hyderabadi", recommendation: "Barkas Patthar ka Gosht and Kheer" }
    ],
    shopping: [
      { name: "Laad Bazaar", type: "Market", description: "Narrow lane near Charminar famous for colorful traditional bridal bangles and pearls." },
      { name: "Inorbit Mall Hyderabad", type: "Mall", description: "Modern mall in the tech hub overlooking Durgam Cheruvu lake, featuring global brands." }
    ]
  },
  "singapore": {
    name: "Singapore",
    country: "Singapore",
    description: "A global financial center and clean city-state, known for its tropical climate, botanical gardens, and mixed multicultural cuisines.",
    currency: "SGD",
    weather: { temp: "31°C", condition: "Sunny", desc: "Warm and humid breeze" },
    safety: {
      score: 97,
      police: "999 (Emergency)",
      ambulance: "995",
      embassy: "+65-6476-9100 (US Embassy, Singapore)",
      touristHelpline: "1800-736-2000",
      advisories: [
        "Littering, spitting, chewing gum imports, and jaywalking attract heavy fines. Strictly adhere to cleanliness rules.",
        "Tropical thunderstorms can start suddenly in the afternoon. Keep an umbrella handy."
      ],
      scams: [
        "Sim Lim Square tech sellers using aggressive sales tactics and bait-and-switch pricing on gadgets.",
        "Overpriced seafood restaurants near tourist spots charging market-rate fees that run into hundreds of dollars.",
        "Fake rental property advertisements aiming to steal deposit money from long-term visitors."
      ],
      recommendations: [
        "Order seafood at places with clear printed per-kilogram prices. Avoid 'seasonal price' traps.",
        "Use Singapore's incredibly clean MRT subway system; it reaches almost all major attractions.",
        "Use bins for trash; trash drop fines can easily exceed SGD 300 for first offenders."
      ]
    },
    buddies: [
      {
        id: "sin-b1",
        name: "Darren Lim",
        languages: ["English", "Mandarin", "Hokkien"],
        rating: 4.9,
        reviewCount: 42,
        price: 550,
        city: "Singapore",
        specializations: ["Food", "Nature", "Modern City"],
        experience: "4 years",
        availability: "Available",
        bio: "Food blogger and hiking fan. Let me show you the best hawker stalls in Maxwell Food Centre, walk the Southern Ridges, and guide you around Marina Bay!",
        reviews: [
          { author: "Clarissa W.", rating: 5, text: "Darren guided us to the best chicken rice and satay stalls. He saved us so much time waiting in lines!" }
        ]
      },
      {
        id: "sin-b2",
        name: "Aisha Ibrahim",
        languages: ["English", "Malay", "Tamil"],
        rating: 4.8,
        reviewCount: 29,
        price: 480,
        city: "Singapore",
        specializations: ["Culture", "Shopping", "History"],
        experience: "5 years",
        availability: "Available",
        bio: "History graduate. I specialize in explaining Singapore's multi-ethnic districts: Chinatown, Little India, and Kampong Glam.",
        reviews: [
          { author: "Roberto F.", rating: 5, text: "Aisha is very smart and told us incredible stories about early Singapore. Fantastic guide." }
        ]
      }
    ],
    attractions: [
      { name: "Gardens by the Bay", category: "Nature", rating: 4.9, fee: "₹1,800", details: "Massive futuristic park with gigantic Supertrees, indoor glass biomes, and a 35-meter tall indoor waterfall." },
      { name: "Marina Bay Sands SkyPark", category: "Modern City", rating: 4.8, fee: "₹1,500", details: "An iconic surfboard-shaped sky terrace offering views of Singapore's skyline." },
      { name: "Sentosa Island & Universal Studios", category: "Adventure", rating: 4.8, fee: "₹4,500", details: "Action-packed resort island featuring sandy beaches, luxury resorts, theme parks, and cable car rides." },
      { name: "Chinatown & Buddha Tooth Relic Temple", category: "Culture", rating: 4.7, fee: "Free Entry", details: "Vibrant ethnic enclave featuring historic shophouses, street food, and a massive gold Buddhist temple." },
      { name: "Singapore Botanic Gardens", category: "Nature", rating: 4.9, fee: "Free Entry", details: "A 160-year-old tropical garden listed as a UNESCO World Heritage site, featuring the National Orchid Garden." }
    ],
    hotels: [
      { name: "Marina Bay Sands", rating: 4.9, price: "₹42,000/night", type: "Luxury" },
      { name: "Hotel G Singapore", rating: 4.3, price: "₹10,000/night", type: "Mid-range" },
      { name: "Capsule Pod Boutique Hostel", rating: 4.0, price: "₹2,800/night", type: "Budget" }
    ],
    restaurants: [
      { name: "Maxwell Food Centre", rating: 4.8, price: "$", cuisine: "Local Hawker Food", recommendation: "Tian Tian Hainanese Chicken Rice" },
      { name: "Lau Pa Sat", rating: 4.6, price: "$$", cuisine: "Singaporean", recommendation: "Satay skewers under the stars" },
      { name: "Jumbo Seafood (East Coast)", rating: 4.7, price: "$$$", cuisine: "Local Seafood", recommendation: "Chilli Crab with fried mantou buns" }
    ],
    shopping: [
      { name: "Orchard Road", type: "Mall", description: "Grand 2-kilometer boulevard packed with luxury malls, flagship stores, and gourmet restaurants." },
      { name: "Chinatown Street Market", type: "Market", description: "Bustling stalls selling souvenirs, clothing, street snacks, and Chinese calligraphy." }
    ]
  }
};

export default travelData;
