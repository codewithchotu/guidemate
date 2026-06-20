import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';

export default function GuideMateAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I am GuideMate AI, your personal travel concierge. Ask me for recommendations on places, hotels, street foods, hidden secrets, or budget tips!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput('');
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I am having trouble connecting to the concierge service right now. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "What can I do tonight in Jaipur?",
    "Best food spots near Charminar?",
    "Suggest hidden gems in Delhi.",
    "Give me budget tips."
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: 'var(--color-maroon)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          boxShadow: '0 8px 24px rgba(109, 41, 50, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        className="hover-scale"
      >
        <Sparkles size={26} style={{ color: 'var(--color-accent)' }} />
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: '80px', // Below Navbar
          right: '30px',
          bottom: '100px',
          width: '380px',
          backgroundColor: 'var(--color-cream)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          boxShadow: '0 12px 36px rgba(74, 30, 37, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 998,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--color-maroon)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={22} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontWeight: 700, fontSize: '16px' }}>GuideMate AI Concierge</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((msg, index) => (
              <div 
                key={index}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  backgroundColor: msg.sender === 'user' ? 'var(--color-maroon)' : 'white',
                  color: msg.sender === 'user' ? 'white' : 'var(--color-text)',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--color-border)',
                  fontSize: '13px',
                  lineHeight: '1.4',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                  whiteSpace: 'pre-line'
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                backgroundColor: 'white',
                padding: '10px 14px',
                borderRadius: '12px 12px 12px 0',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                color: 'var(--color-text-light)'
              }}>
                Typing suggestions...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions / Suggestions */}
          {messages.length === 1 && (
            <div style={{ padding: '0 16px 8px 16px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {sampleQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid var(--color-border)',
                    borderRadius: '20px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    color: 'var(--color-maroon)',
                    fontWeight: 600,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{
              padding: '12px',
              borderTop: '1px solid var(--color-border)',
              backgroundColor: 'white',
              display: 'flex',
              gap: '8px'
            }}
          >
            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '1px solid var(--color-border)',
                borderRadius: '24px',
                fontSize: '13px',
                outline: 'none',
                backgroundColor: 'var(--color-cream)'
              }}
            />
            <button 
              type="submit"
              style={{
                backgroundColor: 'var(--color-maroon)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
