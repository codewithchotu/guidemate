import React, { useState } from 'react';
import { Users, UserPlus, Share2, DollarSign } from 'lucide-react';

export default function GroupTravel({ onGroupUpdate }) {
  const [members, setMembers] = useState([
    { name: 'John Doe (You)', email: 'john@example.com', status: 'owner' },
    { name: 'Sarah Connor', email: 'sarah@example.com', status: 'joined' }
  ]);
  const [emailInput, setEmailInput] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    
    const name = emailInput.split('@')[0];
    const newMember = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: emailInput,
      status: 'pending'
    };

    const updated = [...members, newMember];
    setMembers(updated);
    setEmailInput('');
    setShowInviteForm(false);
    onGroupUpdate?.(updated);
  };

  return (
    <div className="card" style={{ padding: '24px', backgroundColor: 'white' }}>
      <div className="flex-between" style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: 'var(--color-maroon)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={22} /> Group Travel Mode
        </h3>
        <button 
          className="btn btn-ghost btn-sm"
          style={{ padding: '4px 8px', fontSize: '12px' }}
          onClick={() => setShowInviteForm(!showInviteForm)}
        >
          <UserPlus size={16} /> Invite
        </button>
      </div>

      {showInviteForm && (
        <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input 
            type="email"
            placeholder="friend@email.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', outline: 'none' }}
            required
          />
          <button type="submit" className="btn btn-primary btn-sm">Add</button>
        </form>
      )}

      {/* Group Members List */}
      <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
        {members.map((member) => (
          <div key={member.email} className="flex-between" style={{
            padding: '10px 12px',
            backgroundColor: 'var(--color-cream)',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            fontSize: '13px'
          }}>
            <div>
              <span style={{ fontWeight: 600 }}>{member.name}</span>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--color-text-light)' }}>{member.email}</p>
            </div>
            <span style={{
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 600,
              backgroundColor: member.status === 'joined' || member.status === 'owner' ? 'rgba(56, 142, 60, 0.1)' : 'rgba(109, 41, 50, 0.08)',
              color: member.status === 'joined' || member.status === 'owner' ? '#388E3C' : 'var(--color-maroon)'
            }}>
              {member.status}
            </span>
          </div>
        ))}
      </div>

      {/* Cost Split Info */}
      <div className="card-flat" style={{ backgroundColor: 'var(--color-beige)', fontSize: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', fontWeight: 600 }}>
          <DollarSign size={16} style={{ color: 'var(--color-maroon)' }} /> Cost Splitting (Active)
        </div>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
          Guide fees, bookings, and activities costs will be split evenly among all group members. Group Coupon code **GROUP25** (25% off) has been automatically unlocked for your travel bundle!
        </p>
      </div>
    </div>
  );
}
