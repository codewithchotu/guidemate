// Real-time WebSocket Service
let ws = null;
const listeners = new Map(); // eventType -> Set of callbacks

export const wsService = {
  connect(uid, role, initialLat = null, initialLng = null) {
    if (ws && ws.readyState === WebSocket.OPEN) return;

    // Use current host for websocket connection (relative proxy configuration)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    console.log(`Connecting to WebSocket server: ${wsUrl}`);
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection established.');
      // Register client on connection
      ws.send(JSON.stringify({
        type: 'register',
        payload: { uid, role, lat: initialLat, lng: initialLng }
      }));
    };

    ws.onmessage = (event) => {
      try {
        const packet = JSON.parse(event.data);
        const { type, payload } = packet;
        console.log(`WebSocket received type: ${type}`, payload);

        if (listeners.has(type)) {
          listeners.get(type).forEach(cb => cb(payload));
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed.');
      ws = null;
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  },

  disconnect() {
    if (ws) {
      ws.close();
      ws = null;
    }
  },

  subscribe(type, callback) {
    if (!listeners.has(type)) {
      listeners.set(type, new Set());
    }
    listeners.get(type).add(callback);
    
    // Return unsubscribe function
    return () => {
      if (listeners.has(type)) {
        listeners.get(type).delete(callback);
      }
    };
  },

  send(type, payload) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket is not open. Message not sent:', type);
    }
  },

  updateLocation(lat, lng) {
    this.send('update_location', { lat, lng });
  },

  startMatch(matchParams) {
    this.send('start_match', matchParams);
  },

  respondToMatchRequest(bookingId, accepted) {
    this.send('guide_respond', { bookingId, accepted });
  },

  respondToMutualAcceptance(bookingId, accepted, guideId) {
    this.send('traveler_respond', { bookingId, accepted, guideId });
  },

  triggerSOS(lat = null, lng = null) {
    this.send('trigger_sos', { lat, lng });
  },

  sendMessage(bookingId, recipientId, text, language = 'English') {
    this.send('send_message', { bookingId, recipientId, text, language });
  }
};
