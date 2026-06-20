// Real-time WebSocket Service
let ws = null;
const listeners = new Map(); // eventType -> Set of callbacks
const sendQueue = []; // Queue messages sent while connecting

export const wsService = {
  connect(uid, role, initialLat = null, initialLng = null) {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

    // Use direct IPv4 port 5000 when running locally, or relative host for production
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = isLocal ? '127.0.0.1:5000' : window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    console.log(`Connecting to WebSocket server: ${wsUrl}`);
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection established.');
      // Register client on connection
      ws.send(JSON.stringify({
        type: 'register',
        payload: { uid, role, lat: initialLat, lng: initialLng }
      }));

      // Flush send queue
      while (sendQueue.length > 0) {
        const msg = sendQueue.shift();
        console.log(`Flushing queued WebSocket message: ${msg.type}`);
        ws.send(JSON.stringify(msg));
      }
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
      if (listeners.has('match_failed') && sendQueue.length > 0) {
        listeners.get('match_failed').forEach(cb => cb({ reason: 'Connection lost. Matching failed.' }));
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      if (listeners.has('match_failed')) {
        listeners.get('match_failed').forEach(cb => cb({ reason: 'Failed to connect to real-time matchmaking server. Check your network or server status.' }));
      }
    };
  },

  disconnect() {
    if (ws) {
      ws.close();
      ws = null;
    }
    sendQueue.length = 0; // clear queue
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
      console.log(`WebSocket is not open. Queueing message: ${type}`);
      sendQueue.push({ type, payload });
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
