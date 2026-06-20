import React, { useEffect, useRef, useState } from 'react';

// Leaflet CDN links
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

export default function GuideMap({ guides, onSelectGuide, city = 'Delhi', poiMarkers = null }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const poiMarkersRef = useRef([]);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState('all'); // 'all', 'guides', 'attractions', 'hotels', 'restaurants'

  // Load Leaflet dynamically
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = LEAFLET_CSS;
    
    link.onload = () => {
      const script = document.createElement('script');
      script.src = LEAFLET_JS;
      script.onload = () => {
        setLeafletLoaded(true);
      };
      document.head.appendChild(script);
    };
    
    document.head.appendChild(link);

    return () => {
      try {
        document.head.removeChild(link);
      } catch (e) {}
    };
  }, []);

  // Comprehensive city coordinates for all 12 cities
  const cityCoords = {
    'delhi': [28.6139, 77.2090],
    'mumbai': [19.0760, 72.8777],
    'jaipur': [26.9124, 75.7873],
    'varanasi': [25.3176, 82.9739],
    'hyderabad': [17.3850, 78.4867],
    'bangalore': [12.9716, 77.5946],
    'goa': [15.2993, 73.8243],
    'kolkata': [22.5726, 88.3639],
    'chennai': [13.0827, 80.2707],
    'dubai': [25.2048, 55.2708],
    'singapore': [1.3521, 103.8198],
    'tokyo': [35.6762, 139.6503],
    'paris': [48.8566, 2.3522]
  };

  const currentCoords = cityCoords[city.toLowerCase().trim()] || [28.6139, 77.2090];

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const L = window.L;
    const map = L.map(mapContainerRef.current).setView(currentCoords, 13);
    mapInstanceRef.current = map;

    const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || import.meta.env.VITE_MAP_API_KEY || window.MAPBOX_ACCESS_TOKEN || '';
    
    let tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    let tileOptions = {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20
    };

    if (mapboxToken) {
      tileUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`;
      tileOptions = {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
        tileSize: 512,
        zoomOffset: -1
      };
    }

    L.tileLayer(tileUrl, tileOptions).addTo(map);

    const t = setTimeout(() => {
      map.invalidateSize();
    }, 400);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded, city]);

  // Render guide markers
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Clear old guide markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Only show guides if layer is 'all' or 'guides'
    if (selectedLayer === 'all' || selectedLayer === 'guides') {
      guides.forEach((guide) => {
        const lat = (guide.lat && guide.lat !== 0) ? guide.lat : (currentCoords[0] + (Math.random() - 0.5) * 0.04);
        const lng = (guide.lng && guide.lng !== 0) ? guide.lng : (currentCoords[1] + (Math.random() - 0.5) * 0.04);

        let markerColor = '#6D2932';
        if (guide.packages.includes('foreigner_pack')) markerColor = '#4A1E25';
        else if (guide.packages.includes('premium')) markerColor = '#C6A969';

        const customIcon = L.divIcon({
          className: 'custom-guide-marker',
          html: `<div style="
            width: 40px; 
            height: 40px; 
            background-color: white; 
            border: 3px solid ${markerColor}; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            cursor: pointer;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">${guide.image || '👨'}</div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
        
        const popupContent = `
          <div style="font-family: inherit; min-width: 180px;">
            <h4 style="margin: 0 0 4px 0; color: #4A1E25;">${guide.name}</h4>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">📍 ${guide.location}</p>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">⭐ ${guide.rating || '5.0'} (${guide.reviews || '95'} reviews)</p>
            <button id="book-btn-${guide.id}" style="
              background-color: #6D2932;
              color: white;
              border: none;
              border-radius: 6px;
              padding: 6px 12px;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              width: 100%;
            ">View Details</button>
          </div>
        `;

        marker.bindPopup(popupContent);
        
        marker.on('popupopen', () => {
          const btn = document.getElementById(`book-btn-${guide.id}`);
          if (btn) {
            btn.addEventListener('click', () => {
              onSelectGuide(guide);
            });
          }
        });

        markersRef.current.push(marker);
      });
    }
  }, [leafletLoaded, guides, city, selectedLayer]);

  // Render POI markers
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current || !poiMarkers) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Clear old POI markers
    poiMarkersRef.current.forEach(m => m.remove());
    poiMarkersRef.current = [];

    // Helper function to create POI marker icon
    const createPoiIcon = (category, color) => {
      return L.divIcon({
        className: `poi-marker-${category}`,
        html: `<div style="
          width: 32px; 
          height: 32px; 
          background-color: ${color}; 
          border: 2px solid white; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.2);
          cursor: pointer;
        ">${getCategoryIcon(category)}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    // Show attractions if layer is 'all' or 'attractions'
    if ((selectedLayer === 'all' || selectedLayer === 'attractions') && poiMarkers.attractions) {
      poiMarkers.attractions.forEach(poi => {
        const marker = L.marker([poi.lat, poi.lng], { 
          icon: createPoiIcon('attraction', '#FF6B6B') 
        }).addTo(map);
        
        marker.bindPopup(`
          <div style="min-width: 140px;">
            <h4 style="margin: 0 0 4px 0; color: #FF6B6B;">${poi.name}</h4>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">⭐ ${poi.rating}</p>
            <p style="margin: 0; font-size: 11px; color: #999;">${poi.description}</p>
          </div>
        `);
        poiMarkersRef.current.push(marker);
      });
    }

    // Show hotels if layer is 'all' or 'hotels'
    if ((selectedLayer === 'all' || selectedLayer === 'hotels') && poiMarkers.hotels) {
      poiMarkers.hotels.forEach(poi => {
        const marker = L.marker([poi.lat, poi.lng], { 
          icon: createPoiIcon('hotel', '#4ECDC4') 
        }).addTo(map);
        
        marker.bindPopup(`
          <div style="min-width: 140px;">
            <h4 style="margin: 0 0 4px 0; color: #4ECDC4;">🏨 ${poi.name}</h4>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">⭐ ${poi.rating}</p>
            <p style="margin: 0; font-size: 11px; color: #999;">${poi.description}</p>
          </div>
        `);
        poiMarkersRef.current.push(marker);
      });
    }

    // Show restaurants if layer is 'all' or 'restaurants'
    if ((selectedLayer === 'all' || selectedLayer === 'restaurants') && poiMarkers.restaurants) {
      poiMarkers.restaurants.forEach(poi => {
        const marker = L.marker([poi.lat, poi.lng], { 
          icon: createPoiIcon('restaurant', '#F4A261') 
        }).addTo(map);
        
        marker.bindPopup(`
          <div style="min-width: 140px;">
            <h4 style="margin: 0 0 4px 0; color: #F4A261;">🍽️ ${poi.name}</h4>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">⭐ ${poi.rating}</p>
            <p style="margin: 0; font-size: 11px; color: #999;">${poi.description}</p>
          </div>
        `);
        poiMarkersRef.current.push(marker);
      });
    }
  }, [leafletLoaded, poiMarkers, selectedLayer]);

  // Helper function to get category icons
  const getCategoryIcon = (category) => {
    const icons = {
      'attraction': '🎭',
      'hotel': '🏨',
      'restaurant': '🍽️',
      'temple': '🕉️',
      'palace': '👑',
      'market': '🛍️',
      'cafe': '☕'
    };
    return icons[category.toLowerCase()] || '📍';
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* POI Layer Control */}
      {poiMarkers && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 999,
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          maxWidth: '300px'
        }}>
          {[
            { id: 'all', label: 'All', icon: '📍' },
            { id: 'guides', label: 'Guides', icon: '👤' },
            { id: 'attractions', label: 'Attractions', icon: '🎭', color: '#FF6B6B' },
            { id: 'hotels', label: 'Hotels', icon: '🏨', color: '#4ECDC4' },
            { id: 'restaurants', label: 'Restaurants', icon: '🍽️', color: '#F4A261' }
          ].map(layer => (
            <button
              key={layer.id}
              onClick={() => setSelectedLayer(layer.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: selectedLayer === layer.id ? '2px solid #6D2932' : '1px solid #ddd',
                backgroundColor: selectedLayer === layer.id ? '#FAF7F2' : 'white',
                color: '#4A1E25',
                fontSize: '12px',
                fontWeight: selectedLayer === layer.id ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {layer.icon} {layer.label}
            </button>
          ))}
        </div>
      )}

      {!leafletLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#FAF7F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-maroon)',
          fontWeight: 600,
          zIndex: 10
        }}>
          Loading Map Views...
        </div>
      )}
      <div 
        ref={mapContainerRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          zIndex: 1
        }} 
      />
    </div>
  );
}
