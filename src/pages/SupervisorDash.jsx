import React, { useState, useEffect } from 'react';
import { wsService } from '../services/websocket';
import GuideMap from '../components/GuideMap';
import { SAMPLE_GUIDES } from '../data/guideData';
import { Shield, Users, Radio, AlertOctagon, TrendingUp, CheckCircle, Activity, Heart, LifeBuoy } from 'lucide-react';

export default function SupervisorDashboard() {
  const [activeTab, setActiveTab] = useState('verification');
  const [guides, setGuides] = useState(SAMPLE_GUIDES);
  const [selectedGuide, setSelectedGuide] = useState(null);
  
  // Real-time states
  const [activeTrips, setActiveTrips] = useState([
    { id: 'booking_1', travelerName: 'John Doe', destination: 'Delhi', packageType: 'premium', status: 'accepted', totalPrice: 9600 },
    { id: 'booking_2', travelerName: 'Amit Sharma', destination: 'Jaipur', packageType: 'expert', status: 'accepted', totalPrice: 4800 }
  ]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [metrics, setMetrics] = useState({
    activeTrips: 2,
    pendingVerifications: 1,
    totalRevenue: 14400,
    platformCommission: 2160,
    health: '100% Operational',
    bookingsData: []
  });

  // Load metrics
  useEffect(() => {
    fetch('/api/supervisor/metrics')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error('Failed to load metrics:', err));
  }, [activeTrips]);

  // Connect WebSockets
  useEffect(() => {
    // Connect as Supervisor
    wsService.connect('supervisor_admin', 'supervisor');

    // Subscribe to Active Trips updates
    const unsubscribeTrips = wsService.subscribe('active_trips_update', (trips) => {
      setActiveTrips(trips);
    });

    // Subscribe to live SOS alerts
    const unsubscribeSOS = wsService.subscribe('sos_alert', (sos) => {
      setSosAlerts(prev => {
        // Prevent duplicate alerts
        if (prev.some(a => a.uid === sos.uid)) return prev;
        return [...prev, sos];
      });
      alert(`⚠️ SOS EMERGENCY: SOS alert received from ${sos.name} (${sos.role.toUpperCase()})!`);
    });

    return () => {
      unsubscribeTrips();
      unsubscribeSOS();
      wsService.disconnect();
    };
  }, []);

  const handleApproveGuide = (guideId) => {
    setGuides(guides.map(g => g.id === guideId ? { ...g, verified: true } : g));
    alert('✓ Guide approved successfully!');
  };

  const handleResolveSOS = (uid) => {
    setSosAlerts(prev => prev.filter(alert => alert.uid !== uid));
    alert('✓ SOS alert marked as resolved.');
  };

  const handleAdjustTrust = (userId, amount) => {
    alert(`Adjusted trust score for user ${userId} by ${amount} points.`);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh' }}>
      
      {/* Header bar */}
      <div style={{ backgroundColor: 'var(--color-maroon)', color: 'white', padding: '24px 20px' }}>
        <div className="container">
          <div className="flex-between">
            <div>
              <h1 style={{ margin: '0 0 4px 0', fontSize: '28px', color: 'white' }}>👮‍♂️ Supervisor Command Center</h1>
              <p style={{ margin: 0, opacity: 0.9 }}>Monitor live safety alerts, track active excursions, and verify guide credentials</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>System Health: <strong style={{ color: 'var(--color-accent)' }}>{metrics.health}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Numerical Stats overview */}
      <div style={{ padding: '24px 20px', backgroundColor: 'white', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="card-flat">
              <div className="flex-between">
                <div>
                  <p style={{ color: 'var(--color-text-light)', margin: 0, fontSize: '13px' }}>Active Excursions</p>
                  <h3 style={{ color: 'var(--color-maroon)', margin: '8px 0 0 0' }}>{activeTrips.length}</h3>
                </div>
                <Radio size={28} style={{ color: 'var(--color-maroon)' }} />
              </div>
            </div>
            <div className="card-flat">
              <div className="flex-between">
                <div>
                  <p style={{ color: 'var(--color-text-light)', margin: 0, fontSize: '13px' }}>Pending Onboarding</p>
                  <h3 style={{ color: 'var(--color-gold)', margin: '8px 0 0 0' }}>{metrics.pendingVerifications}</h3>
                </div>
                <Users size={28} style={{ color: 'var(--color-gold)' }} />
              </div>
            </div>
            <div className="card-flat">
              <div className="flex-between">
                <div>
                  <p style={{ color: 'var(--color-text-light)', margin: 0, fontSize: '13px' }}>Total Platform Booking Stream</p>
                  <h3 style={{ color: '#27AE60', margin: '8px 0 0 0' }}>₹{metrics.totalRevenue.toLocaleString()}</h3>
                </div>
                <TrendingUp size={28} style={{ color: '#27AE60' }} />
              </div>
            </div>
            <div className="card-flat">
              <div className="flex-between">
                <div>
                  <p style={{ color: 'var(--color-text-light)', margin: 0, fontSize: '13px' }}>Platform Commission (15%)</p>
                  <h3 style={{ color: 'var(--color-maroon)', margin: '8px 0 0 0' }}>₹{metrics.platformCommission.toLocaleString()}</h3>
                </div>
                <Heart size={28} style={{ color: 'var(--color-maroon)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '24px 20px' }}>
        <div className="container">
          
          {/* Real-time SOS emergencies warning queue */}
          {sosAlerts.length > 0 && (
            <div className="card" style={{
              backgroundColor: '#FDEDEC',
              border: '2px solid #E74C3C',
              color: '#C0392B',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#C0392B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertOctagon size={22} /> Active SOS Distress Queue ({sosAlerts.length})
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {sosAlerts.map(alert => (
                  <div key={alert.uid} className="card-flat" style={{ backgroundColor: 'white', border: '1px solid #F5B7B1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#C0392B' }}>{alert.name} ({alert.role.toUpperCase()})</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>
                        GPS Position: [{alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}] • Triggered: {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleResolveSOS(alert.uid)}
                      style={{ backgroundColor: '#27AE60', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Resolve Emergency
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
            {[
              { id: 'verification', label: '✓ Onboarding Verifications' },
              { id: 'tracking', label: '🛡️ GPS Command Map' },
              { id: 'disputes', label: '⚖️ Dispute logs & Trust Monitor' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: activeTab === tab.id ? 'var(--color-maroon)' : 'var(--color-text-light)',
                  fontWeight: activeTab === tab.id ? 700 : 400,
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '3px solid var(--color-maroon)' : 'none',
                  marginBottom: '-1px'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content: Onboarding */}
          {activeTab === 'verification' && (
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ color: 'var(--color-maroon)', marginBottom: '16px' }}>Guide Onboarding Queue</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {guides.filter(g => !g.verified).map(guide => (
                  <div key={guide.id} className="card-flat" style={{ borderLeft: '4px solid var(--color-gold)' }}>
                    <div className="flex-between">
                      <div>
                        <h4 style={{ margin: '0 0 4px 0' }}>{guide.name}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-light)' }}>
                          Location: {guide.location} | Hourly rate: ₹{guide.hourlyRate}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleApproveGuide(guide.id)}
                          style={{ backgroundColor: '#27AE60', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Approve
                        </button>
                        <button className="btn btn-ghost btn-sm">Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
                {guides.filter(g => !g.verified).length === 0 && (
                  <p style={{ margin: 0, color: 'var(--color-text-light)', fontStyle: 'italic' }}>
                    No pending guide applications in verification queue.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tab Content: GPS COMMAND MAP */}
          {activeTab === 'tracking' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
              <div className="card" style={{ padding: '24px', height: '450px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ color: 'var(--color-maroon)', marginBottom: '16px' }}>Active Escorts Tracking Radar</h3>
                <div style={{ flex: 1 }}>
                  <GuideMap key={activeTab} guides={SAMPLE_GUIDES} city="Delhi" onSelectGuide={() => {}} />
                </div>
              </div>
              
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ color: 'var(--color-maroon)', marginBottom: '16px' }}>Excursion Logs</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {activeTrips.map(trip => (
                    <div key={trip.id} className="card-flat" style={{ fontSize: '13px' }}>
                      <div className="flex-between" style={{ fontWeight: 600, marginBottom: '6px' }}>
                        <span>Traveler: {trip.travelerName}</span>
                        <span style={{ color: '#27AE60' }}>Active</span>
                      </div>
                      <p style={{ margin: '0 0 4px 0' }}>Destination: {trip.destination}</p>
                      <p style={{ margin: 0 }}>Revenue value: ₹{trip.totalPrice}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Disputes & Trust Monitoring */}
          {activeTab === 'disputes' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              
              {/* Trust Score Monitor */}
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ color: 'var(--color-maroon)', marginBottom: '16px' }}>Trust Score Dashboard Monitor</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[
                    { id: 'mock_guide_1', name: 'Raj Kumar (Guide)', score: 98, badge: 'Elite' },
                    { id: 'mock_guide_2', name: 'Priya Singh (Guide)', score: 92, badge: 'Trusted' },
                    { id: 'mock_traveler_1', name: 'John Doe (Traveler)', score: 95, badge: 'Elite' },
                    { id: 'mock_traveler_2', name: 'Amit Sharma (Traveler)', score: 58, badge: 'Needs Review' }
                  ].map(usr => (
                    <div key={usr.id} className="card-flat flex-between">
                      <div>
                        <strong style={{ fontSize: '13px' }}>{usr.name}</strong>
                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--color-text-light)' }}>Badge: {usr.badge}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge" style={{
                          backgroundColor: usr.score >= 90 ? 'rgba(39, 174, 96, 0.1)' : usr.score >= 70 ? 'rgba(243, 156, 18, 0.1)' : 'rgba(192, 57, 43, 0.1)',
                          color: usr.score >= 90 ? '#27AE60' : usr.score >= 70 ? '#F39C12' : '#C0392B'
                        }}>
                          {usr.score} Score
                        </span>
                        <button 
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '2px 6px', fontSize: '10px' }}
                          onClick={() => handleAdjustTrust(usr.id, -10)}
                        >
                          Deduct
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complaints & disputes logs */}
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ color: 'var(--color-maroon)', marginBottom: '16px' }}>Complaints Queue</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div className="card-flat" style={{ borderLeft: '4px solid #E74C3C' }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>Guide Deviation Report</h4>
                    <p style={{ margin: '4px 0', fontSize: '12px', color: 'var(--color-text-light)' }}>
                      Reported by traveler Amit Sharma against Guide Arjun Patel.
                    </p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px' }}>
                      <em>"Guide arrived late and refused to go to the palace."</em>
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-ghost btn-sm">Dismiss</button>
                      <button className="btn btn-primary btn-sm" style={{ backgroundColor: '#E74C3C', border: 'none' }}>Suspend Guide</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
