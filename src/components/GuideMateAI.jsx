import React, { useState, useEffect, useRef, useContext } from 'react';
import { Sparkles, X, Send, Bot, User, MapPin, Utensils, Hotel, Compass, Wallet, Calendar, Star, ChevronDown } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { getAIChatResponse } from '../services/travelPlanner';

const CAPABILITIES = [
  { icon: '🗺️', label: 'Travel Advice' },
  { icon: '💎', label: 'Hidden Gems' },
  { icon: '🏨', label: 'Hotels' },
  { icon: '🍽️', label: 'Food Spots' },
  { icon: '📍', label: 'Local Tips' },
  { icon: '💰', label: 'Budget Help' },
  { icon: '📅', label: 'Itinerary' },
  { icon: '🙋', label: 'Guide Help' },
];

const SAMPLE_QUESTIONS = [
  "What can I do tonight in Jaipur?",
  "Best food spots near Charminar?",
  "Suggest hidden gems in Delhi.",
  "Budget tips for Mumbai trip.",
  "Top hotels in Varanasi?",
  "Hidden cafés in Bangalore?",
];

// Global animation styles
const ANIMATION_STYLES = `
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-6px); opacity: 1; }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(10px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes aiPulse {
    0% { box-shadow: 0 0 0 0 rgba(109,41,50,0.4); }
    70% { box-shadow: 0 0 0 12px rgba(109,41,50,0); }
    100% { box-shadow: 0 0 0 0 rgba(109,41,50,0); }
  }
  @keyframes drawerIn {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes successPop {
    0% { opacity:0; transform: scale(0.92) translateY(8px); }
    60% { transform: scale(1.02) translateY(-2px); }
    100% { opacity:1; transform: scale(1) translateY(0); }
  }
`;

function TypingIndicator() {
  return (
    <div style={{
      alignSelf: 'flex-start',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      backgroundColor: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(8px)',
      padding: '10px 16px',
      borderRadius: '16px 16px 16px 4px',
      border: '1px solid rgba(109,41,50,0.1)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#F59E0B',
              animation: `bounce 1.2s infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: '11px', color: '#888', fontStyle: 'italic' }}>GuideMate AI is typing...</span>
    </div>
  );
}

function MessageBubble({ msg, index }) {
  const isUser = msg.sender === 'user';
  const isSystem = msg.sender === 'system';

  if (isSystem) {
    return (
      <div style={{
        alignSelf: 'center',
        backgroundColor: 'rgba(198,169,105,0.12)',
        border: '1px solid rgba(198,169,105,0.3)',
        borderRadius: '20px',
        padding: '6px 14px',
        fontSize: '11px',
        color: '#8B6914',
        fontWeight: 600,
        animation: 'fadeSlideIn 0.4s ease forwards',
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
      }}>
        {msg.text}
      </div>
    );
  }

  return (
    <div
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '88%',
        animation: 'fadeSlideIn 0.4s ease forwards',
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
      }}
    >
      {!isUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <div style={{
            width: '22px', height: '22px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #111111, #1A1A1A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '11px' }}>✨</span>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#6D2932', textTransform: 'uppercase', letterSpacing: '0.5px' }}>GuideMate AI</span>
        </div>
      )}
      <div
        style={{
          backgroundColor: isUser
            ? 'linear-gradient(135deg, #6D2932, #4A1E25)'
            : 'rgba(255,255,255,0.95)',
          background: isUser
            ? 'linear-gradient(135deg, #6D2932, #4A1E25)'
            : 'rgba(255,255,255,0.95)',
          color: isUser ? 'white' : '#1A1A1A',
          padding: '10px 14px',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          fontSize: '13px',
          lineHeight: '1.55',
          boxShadow: isUser
            ? '0 4px 12px rgba(109,41,50,0.3)'
            : '0 2px 8px rgba(0,0,0,0.06)',
          border: isUser ? 'none' : '1px solid rgba(109,41,50,0.08)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {msg.text}
      </div>
    </div>
  );
}

export default function GuideMateAI() {
  const { currentBooking } = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '✨ Hello! I\'m GuideMate AI — your personal travel concierge.\n\nAsk me anything about travel, hidden gems, hotels, food, local tips, budget advice, or guide recommendations across India and beyond!',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCapabilities, setShowCapabilities] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  // When booking is confirmed, inject a system message in concierge
  useEffect(() => {
    if (currentBooking) {
      const alreadyNotified = messages.some(m => m.sender === 'system' && m.text.includes('arriving soon'));
      if (!alreadyNotified) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'system',
            text: '🎉 Booking confirmed — guide is arriving soon!',
          },
          {
            sender: 'ai',
            text: `✅ Your booking has been successfully done! Your guide is arriving soon at your pickup spot.\n\nWould you like local tips, restaurant suggestions, or safety advice for your destination?`,
          }
        ]);
        setIsOpen(true);
      }
    }
  }, [currentBooking]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text) return;
    if (!textToSend) setInput('');

    setMessages(prev => [...prev, { sender: 'user', text }]);
    setLoading(true);

    try {
      // Try backend first with a 4-second timeout
      let aiResponse = null;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: messages }),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (response.ok) {
          const data = await response.json();
          aiResponse = data.response;
        }
      } catch (_serverErr) {
        // Server unavailable — fall through to client-side response
        console.info('Backend unavailable, using client-side AI response.');
      }

      // Client-side AI fallback (always works, no server needed)
      if (!aiResponse) {
        aiResponse = getAIChatResponse(text);
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: "I'm having trouble right now. Please try again shortly! 🌍" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasActiveBooking = !!currentBooking;
  const isFirstMessage = messages.length === 1;

  return (
    <>
      <style>{ANIMATION_STYLES}</style>
      {/* ============================================ */}
      {/* Floating Toggle Button */}
      {/* ============================================ */}
      {!isOpen && (
        <button
          id="guidemate-ai-toggle"
          onClick={() => setIsOpen(true)}
          title="Open GuideMate AI"
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            background: 'linear-gradient(135deg, #000000, #111111)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '62px',
            height: '62px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1px',
            zIndex: 9999,
            animation: 'aiPulse 2.5s infinite',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)';
          }}
        >
          <Sparkles size={22} style={{ color: '#F59E0B' }} />
          <span style={{ fontSize: '7px', fontWeight: 800, letterSpacing: '0.5px', color: 'rgba(255,255,255,0.9)' }}>AI</span>

          {/* Active booking badge */}
          {hasActiveBooking && (
            <div style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#27AE60',
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
            }}>
              ✓
            </div>
          )}
        </button>
      )}

      {/* ============================================ */}
      {/* Slide-out Concierge Drawer */}
      {/* ============================================ */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            right: '20px',
            bottom: '20px',
            width: '400px',
            maxWidth: 'calc(100vw - 32px)',
            background: 'linear-gradient(160deg, rgba(249,250,251,0.97) 0%, rgba(255,255,255,0.99) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(17,17,17,0.12)',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(17,17,17,0.12), 0 4px 20px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9998,
            overflow: 'hidden',
            animation: 'drawerIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* ---- Header ---- */}
          <div style={{
            background: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px',
                borderRadius: '50%',
                background: 'rgba(245,158,11,0.15)',
                border: '1.5px solid rgba(245,158,11,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={17} style={{ color: '#F59E0B' }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'white', letterSpacing: '0.2px' }}>
                  GuideMate AI
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(245,158,11,0.9)', fontWeight: 500 }}>
                  Powered by Groq • Personal Travel Concierge
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setShowCapabilities(v => !v)}
                title="View Capabilities"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(17,17,17,0.15)',
                  borderRadius: '6px',
                  color: 'white',
                  width: '28px', height: '28px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', transition: 'background 0.2s',
                }}
              >
                <ChevronDown size={14} style={{ transform: showCapabilities ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(198,169,105,0.25)',
                  borderRadius: '6px',
                  color: 'white',
                  width: '28px', height: '28px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* ---- Booking Confirmed Banner ---- */}
          {hasActiveBooking && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(39,174,96,0.12), rgba(39,174,96,0.05))',
              borderBottom: '1px solid rgba(39,174,96,0.25)',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              flexShrink: 0,
              animation: 'successPop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}>
              <div style={{
                width: '28px', height: '28px',
                borderRadius: '50%',
                backgroundColor: '#27AE60',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                fontSize: '14px',
              }}>
                ✓
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '12px', color: '#1E7A45', marginBottom: '2px' }}>
                  Booking Successfully Done!
                </div>
                <div style={{ fontSize: '11px', color: '#2D9954', lineHeight: 1.4 }}>
                  Guide is arriving soon at your pickup spot. Safe travels! 🚗
                </div>
              </div>
            </div>
          )}

          {/* ---- Capabilities Panel ---- */}
          {showCapabilities && (
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(245,158,11,0.1)',
              flexShrink: 0,
              backgroundColor: 'rgba(245,158,11,0.08)',
            }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                What I can help with
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {CAPABILITIES.map(cap => (
                  <span
                    key={cap.label}
                    style={{
                      backgroundColor: 'rgba(245,158,11,0.08)',
                      border: '1px solid rgba(245,158,11,0.18)',
                      borderRadius: '20px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#92400E',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    {cap.icon} {cap.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ---- Messages Body ---- */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(245,158,11,0.15) transparent',
          }}>
            {messages.map((msg, index) => (
              <MessageBubble key={index} msg={msg} index={index} />
            ))}

            {loading && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {/* ---- Quick Suggestions (first message only) ---- */}
          {isFirstMessage && !loading && (
            <div style={{
              padding: '0 14px 10px 14px',
              flexShrink: 0,
            }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                Try asking...
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {SAMPLE_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    style={{
                      backgroundColor: '#F59E0B',
                      border: '1px solid #F59E0B',
                      borderRadius: '20px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      color: 'white',
                      fontWeight: 600,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#D97706';
                      e.currentTarget.style.borderColor = '#D97706';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#F59E0B';
                      e.currentTarget.style.borderColor = '#F59E0B';
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---- Input Footer ---- */}
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid rgba(245,158,11,0.1)',
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(8px)',
            flexShrink: 0,
          }}>
            <form
              onSubmit={e => { e.preventDefault(); handleSend(); }}
              style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask about travel, food, hotels, hidden gems..."
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '1.5px solid rgba(245,158,11,0.25)',
                  borderRadius: '14px',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: 'rgba(250,247,242,0.9)',
                  color: '#1A1A1A',
                  resize: 'none',
                  fontFamily: 'inherit',
                  lineHeight: '1.4',
                  maxHeight: '80px',
                  overflow: 'auto',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = '#F59E0B'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(245,158,11,0.2)'; }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                style={{
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg, #000000, #111111)'
                    : 'rgba(200,200,200,0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  boxShadow: input.trim() && !loading ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                <Send size={15} />
              </button>
            </form>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '8px',
              gap: '4px',
            }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#000000' }} />
              <span style={{ fontSize: '10px', color: '#888' }}>Powered by Groq LLaMA 3.3 · Press Enter to send</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
