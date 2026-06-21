import React, { useState } from 'react';
import { IndianRupee, PieChart, TrendingUp, Plus } from 'lucide-react';

export default function BudgetTracker() {
  const [budget, setBudget] = useState({
    allocated: 35000,
    guide: 7200,
    hotel: 14000,
    food: 4500,
    transport: 3000,
    activities: 2500
  });

  const totalUsed = budget.guide + budget.hotel + budget.food + budget.transport + budget.activities;
  const remaining = budget.allocated - totalUsed;
  const percentUsed = Math.min(100, Math.round((totalUsed / budget.allocated) * 100));

  const items = [
    { name: 'Guide Services', value: budget.guide, color: 'var(--color-maroon)', key: 'guide' },
    { name: 'Hotel Lodging', value: budget.hotel, color: 'var(--color-accent)', key: 'hotel' },
    { name: 'Dining & Street Food', value: budget.food, color: '#689F38', key: 'food' },
    { name: 'Local Transport', value: budget.transport, color: '#8B4545', key: 'transport' },
    { name: 'Sightseeing Activities', value: budget.activities, color: '#7B1FA2', key: 'activities' }
  ];

  return (
    <div className="card" style={{ padding: '24px', backgroundColor: 'white' }}>
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: 'var(--color-maroon)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={22} /> Travel Budget Tracker
        </h3>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-light)' }}>
          Allocated: ₹{budget.allocated.toLocaleString()}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div className="flex-between" style={{ fontSize: '14px', marginBottom: '8px' }}>
          <span style={{ fontWeight: 600 }}>Used: ₹{totalUsed.toLocaleString()}</span>
          <span style={{ color: remaining >= 0 ? '#388E3C' : '#D32F2F', fontWeight: 600 }}>
            {remaining >= 0 ? `Remaining: ₹${remaining.toLocaleString()}` : `Overbudget: ₹${Math.abs(remaining).toLocaleString()}`}
          </span>
        </div>
        <div style={{ height: '12px', backgroundColor: 'var(--color-border)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
          {items.map((item) => {
            const width = `${(item.value / budget.allocated) * 100}%`;
            return (
              <div 
                key={item.name}
                style={{ 
                  width, 
                  backgroundColor: item.color, 
                  height: '100%',
                  transition: 'width 0.4s ease'
                }} 
                title={`${item.name}: ₹${item.value}`}
              />
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-light)', marginTop: '4px' }}>
          <span>0%</span>
          <span>{percentUsed}% Used</span>
          <span>100%</span>
        </div>
      </div>

      {/* Budget Breakdown List */}
      <div style={{ display: 'grid', gap: '12px' }}>
        {items.map((item) => (
          <div key={item.name} className="flex-between" style={{ fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color }} />
              <span style={{ color: 'var(--color-text)' }}>{item.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600 }}>₹{item.value.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
