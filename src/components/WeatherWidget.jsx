import React, { useEffect, useState } from 'react';
import { Sun, CloudRain, Cloud, Thermometer, AlertTriangle } from 'lucide-react';

export default function WeatherWidget({ city = 'Delhi', onWeatherAlert }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
        // Trigger alert callbacks (e.g. if rainy -> adapt itineraries)
        if (data.rainProbability > 50 || data.alerts) {
          onWeatherAlert?.(data);
        }
      })
      .catch(err => {
        console.error('Error fetching weather:', err);
        setLoading(false);
      });
  }, [city]);

  if (loading) {
    return (
      <div className="card-flat" style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>Fetching local forecast...</p>
      </div>
    );
  }

  if (!weather) return null;

  const renderIcon = () => {
    if (weather.description.includes('rain')) return <CloudRain size={32} style={{ color: '#4A90E2' }} />;
    if (weather.description.includes('cloud')) return <Cloud size={32} style={{ color: '#888' }} />;
    return <Sun size={32} style={{ color: 'var(--color-accent)' }} />;
  };

  return (
    <div className="card-flat" style={{
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid var(--color-border)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
    }}>
      <div className="flex-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--color-maroon)' }}>Weather in {weather.city}</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
            <Thermometer size={18} style={{ color: 'var(--color-maroon)' }} />
            <span style={{ fontSize: '24px', fontWeight: 700 }}>{Math.round(weather.temp)}°C</span>
          </div>
          <p style={{ margin: 0, textTransform: 'capitalize', fontSize: '13px', color: 'var(--color-text-light)' }}>
            {weather.description} • Rain: {weather.rainProbability}%
          </p>
        </div>
        <div>
          {renderIcon()}
        </div>
      </div>

      {weather.alerts && (
        <div style={{
          marginTop: '12px',
          padding: '10px',
          backgroundColor: 'rgba(109, 41, 50, 0.08)',
          borderRadius: '8px',
          borderLeft: '4px solid var(--color-maroon)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <AlertTriangle size={16} style={{ color: 'var(--color-maroon)' }} />
          <span style={{ fontSize: '11px', color: 'var(--color-maroon)', fontWeight: 600 }}>
            {weather.alerts}
          </span>
        </div>
      )}
    </div>
  );
}
