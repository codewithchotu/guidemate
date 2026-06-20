import { WebSocketServer } from 'ws';
import { db } from './db.js';

const connectedClients = new Map(); // uid -> { ws, role, lat, lng }
const activeMatchingRequests = new Map(); // bookingId -> matchState

export function initSocketServer(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws) => {
    let clientUid = null;
    console.log('New WebSocket client connected.');

    ws.on('message', async (data) => {
      try {
        const messageString = data.toString();
        console.log(`[Socket Server] Received packet raw: ${messageString}`);
        const packet = JSON.parse(messageString);
        const { type, payload } = packet;

        switch (type) {
          case 'register': {
            clientUid = payload.uid;
            connectedClients.set(clientUid, {
              ws,
              role: payload.role,
              lat: payload.lat || null,
              lng: payload.lng || null
            });
            console.log(`Registered client ${clientUid} as ${payload.role}`);
            
            // If they are a guide, update their online status in the database
            if (payload.role === 'guide') {
              await db.updateGuideStatus(clientUid, true, payload.lat, payload.lng);
              broadcastOnlineGuides();
            }
            break;
          }

          case 'update_location': {
            if (clientUid && connectedClients.has(clientUid)) {
              const client = connectedClients.get(clientUid);
              client.lat = payload.lat;
              client.lng = payload.lng;
              
              if (client.role === 'guide') {
                await db.updateGuideStatus(clientUid, true, payload.lat, payload.lng);
                broadcastOnlineGuides();

                // Send live location update to the active traveler if in a current trip
                const bookings = await db.getBookings();
                const activeBooking = bookings.find(b => 
                  b.guideId === clientUid && 
                  (b.status === 'accepted' || b.status === 'in_progress' || b.status === 'guide_arriving')
                );
                if (activeBooking) {
                  const travelerClient = connectedClients.get(activeBooking.travelerId);
                  if (travelerClient) {
                    travelerClient.ws.send(JSON.stringify({
                      type: 'guide_location_update',
                      payload: {
                        bookingId: activeBooking.id,
                        lat: payload.lat,
                        lng: payload.lng
                      }
                    }));
                  }
                }
              }

              if (client.role === 'traveler') {
                // Send live location update to the matched guide if in an active trip
                const bookings = await db.getBookings();
                const activeBooking = bookings.find(b => 
                  b.travelerId === clientUid && 
                  (b.status === 'accepted' || b.status === 'in_progress' || b.status === 'guide_arriving')
                );
                if (activeBooking) {
                  const guideClient = connectedClients.get(activeBooking.guideId);
                  if (guideClient) {
                    guideClient.ws.send(JSON.stringify({
                      type: 'traveler_location_update',
                      payload: {
                        bookingId: activeBooking.id,
                        lat: payload.lat,
                        lng: payload.lng
                      }
                    }));
                  }
                }
              }
            }
            break;
          }

          case 'start_match': {
            // Traveler initiated an instant guide match
            const { destination, packageType, language, duration, groupSize, totalPrice, travelerName } = payload;
            const bookingId = `booking_${Date.now()}`;
            console.log(`Starting match for booking ${bookingId} (Traveler: ${travelerName})`);

            // Fetch all online guides
            const allGuides = await db.getGuides();
            const onlineGuides = allGuides.filter(g => {
              const client = connectedClients.get(g.userId);
              return client && client.role === 'guide';
            });

            // Filter & score guides
            const candidates = onlineGuides.filter(guide => {
              const hasPackage = guide.packages.includes(packageType);
              const locationMatch = !destination || guide.location.toLowerCase().includes(destination.toLowerCase()) || true; // loose for simulation
              return hasPackage && locationMatch;
            });

            // Rank by trustScore * rating
            let sortedCandidates = candidates.sort((a, b) => {
              const scoreA = (a.rating || 5) * (a.trustScore || 100);
              const scoreB = (b.rating || 5) * (b.trustScore || 100);
              return scoreB - scoreA;
            });

            if (sortedCandidates.length === 0) {
              console.log(`No online guides found for destination ${destination}. Simulating offline guide pairing for hackathon demo.`);
              const cityGuides = allGuides.filter(g => !destination || g.location.toLowerCase() === destination.toLowerCase());
              const fallbackGuides = cityGuides.length > 0 ? cityGuides : allGuides;
              sortedCandidates = fallbackGuides.slice(0, 3).map(g => ({
                ...g,
                userId: g.userId || g.id,
                online: true
              }));
            }

            if (sortedCandidates.length === 0) {
              ws.send(JSON.stringify({ type: 'match_failed', payload: { reason: 'No matching guides available' } }));
              break;
            }

            // Store matching state
            const matchState = {
              bookingId,
              travelerUid: clientUid,
              travelerName,
              destination,
              packageType,
              duration,
              groupSize,
              totalPrice,
              candidates: sortedCandidates,
              currentIndex: 0,
              timeoutId: null,
              guideResponse: null
            };

            activeMatchingRequests.set(bookingId, matchState);
            ws.send(JSON.stringify({ type: 'matching_started', payload: { bookingId } }));
            
            // Query the first candidate
            queryNextGuide(bookingId);
            break;
          }

          case 'guide_respond': {
            const { bookingId, accepted } = payload;
            const state = activeMatchingRequests.get(bookingId);
            if (state) {
              clearTimeout(state.timeoutId);
              if (accepted) {
                console.log(`Guide ${clientUid} accepted matching request ${bookingId}`);
                state.guideResponse = 'accepted';
                
                // Notify traveler
                const travelerWs = connectedClients.get(state.travelerUid)?.ws;
                const guideProfile = await db.getGuides().then(list => list.find(g => g.userId === clientUid));
                if (travelerWs) {
                  travelerWs.send(JSON.stringify({
                    type: 'guide_accepted_request',
                    payload: {
                      bookingId,
                      guide: {
                        userId: clientUid,
                        name: guideProfile?.name || 'Local Guide',
                        rating: guideProfile?.rating || 5.0,
                        trustScore: guideProfile?.trustScore || 100,
                        languages: guideProfile?.languages || ['English'],
                        packages: guideProfile?.packages || ['basic'],
                        eta: '5-10 mins'
                      }
                    }
                  }));
                }
              } else {
                console.log(`Guide ${clientUid} rejected matching request ${bookingId}`);
                state.currentIndex++;
                queryNextGuide(bookingId);
              }
            }
            break;
          }

          case 'traveler_respond': {
            const { bookingId, accepted, guideId } = payload;
            const state = activeMatchingRequests.get(bookingId);
            if (state) {
              if (accepted) {
                console.log(`Traveler mutually confirmed matching request ${bookingId}`);
                // Create booking in database
                const booking = await db.createBooking({
                  id: bookingId,
                  travelerId: state.travelerUid,
                  guideId,
                  packageType: state.packageType,
                  destination: state.destination,
                  duration: state.duration,
                  groupSize: state.groupSize,
                  totalPrice: state.totalPrice
                });

                // Update booking status
                await db.updateBookingStatus(bookingId, 'accepted');

                // Notify both
                const travelerWs = connectedClients.get(state.travelerUid)?.ws;
                const guideWs = connectedClients.get(guideId)?.ws;
                
                const successPayload = { bookingId, booking };
                if (travelerWs) travelerWs.send(JSON.stringify({ type: 'match_confirmed', payload: successPayload }));
                if (guideWs) guideWs.send(JSON.stringify({ type: 'match_confirmed', payload: successPayload }));

                // If guide is offline (simulated), trigger movement simulation
                if (!guideWs) {
                  console.log(`Starting live GPS simulation for guide ${guideId} towards traveler ${state.travelerUid}`);
                  simulateGuideMovement(bookingId, state.travelerUid, guideId);
                }

                activeMatchingRequests.delete(bookingId);
                broadcastSupervisorTrips();
              } else {
                // Traveler rejected - restart search or fail
                console.log(`Traveler rejected guide, querying next guide...`);
                state.currentIndex++;
                queryNextGuide(bookingId);
              }
            }
            break;
          }

          case 'trigger_sos': {
            // Trigger SOS for traveler/guide
            console.log(`🚨 SOS Triggered by client ${clientUid}!`);
            const client = connectedClients.get(clientUid);
            const user = await db.getUser(clientUid);
            const alertPayload = {
              uid: clientUid,
              name: user?.name || 'Unknown User',
              role: client?.role || 'traveler',
              lat: payload.lat || client?.lat || 28.6139,
              lng: payload.lng || client?.lng || 77.2090,
              timestamp: new Date()
            };

            // Broadcast to all supervisors
            for (const [uid, conn] of connectedClients.entries()) {
              if (conn.role === 'supervisor') {
                conn.ws.send(JSON.stringify({ type: 'sos_alert', payload: alertPayload }));
              }
            }
            break;
          }

          case 'send_message': {
            const { bookingId, recipientId, text, language } = payload;
            // Simulated Translation System (AI Language Companion)
            const targetLanguages = {
              'guide': 'Hindi',
              'traveler': 'English'
            };
            const recipientRole = connectedClients.get(recipientId)?.role || 'traveler';
            const targetLang = targetLanguages[recipientRole] || 'English';

            // Custom translations for matching simulation
            let translatedText = text;
            if (language !== targetLang) {
              const translations = {
                "Hello! Where should we meet?": "नमस्ते! हमें कहाँ मिलना चाहिए?",
                "नमस्ते! हमें कहाँ मिलना चाहिए?": "Hello! Where should we meet?",
                "I am near the main entrance.": "मैं मुख्य प्रवेश द्वार के पास हूँ।",
                "मैं मुख्य प्रवेश द्वार के पास हूँ।": "I am near the main entrance.",
                "Okay, I will be there in 5 minutes.": "ठीक है, मैं 5 मिनट में वहाँ पहुँचूँगा।",
                "ठीक है, मैं 5 मिनट में वहाँ पहुँचूँगा।": "Okay, I will be there in 5 minutes."
              };
              translatedText = translations[text] || `[Translated to ${targetLang} by GuideMate AI]: ${text}`;
            }

            const msgObj = {
              senderId: clientUid,
              text,
              translatedText,
              isTranslated: language !== targetLang,
              timestamp: new Date()
            };

            // Retrieve existing chat, append, and save
            const messages = await db.getChat(bookingId);
            messages.push(msgObj);
            await db.saveChat(bookingId, messages);

            // Send to recipient
            const recClient = connectedClients.get(recipientId);
            if (recClient) {
              recClient.ws.send(JSON.stringify({
                type: 'receive_message',
                payload: { bookingId, message: msgObj }
              }));
            }
            
            // Also echo back to sender to confirm
            ws.send(JSON.stringify({
              type: 'receive_message',
              payload: { bookingId, message: msgObj }
            }));
            break;
          }
        }
      } catch (err) {
        console.error('WebSocket message parsing error:', err.message);
      }
    });

    ws.on('close', async () => {
      if (clientUid) {
        const client = connectedClients.get(clientUid);
        if (client) {
          if (client.simulationInterval) {
            clearInterval(client.simulationInterval);
            console.log(`Cleared simulation interval for client ${clientUid}`);
          }
          if (client.role === 'guide') {
            await db.updateGuideStatus(clientUid, false);
            broadcastOnlineGuides();
          }
        }
        connectedClients.delete(clientUid);
        console.log(`Client ${clientUid} disconnected.`);
      }
    });
  });

  // Query next guide loop
  async function queryNextGuide(bookingId) {
    const state = activeMatchingRequests.get(bookingId);
    if (!state) return;

    if (state.currentIndex >= state.candidates.length) {
      // Out of guides
      const travelerWs = connectedClients.get(state.travelerUid)?.ws;
      if (travelerWs) {
        travelerWs.send(JSON.stringify({ type: 'match_failed', payload: { reason: 'No guides accepted the request' } }));
      }
      activeMatchingRequests.delete(bookingId);
      return;
    }

    const currentGuide = state.candidates[state.currentIndex];
    const guideWs = connectedClients.get(currentGuide.userId || currentGuide.id)?.ws;

    if (!guideWs) {
      console.log(`Simulating match request acceptance for guide ${currentGuide.name} (Offline fallback mode)`);
      
      // Send guide accepted message to the traveler after 1.5 seconds to feel realistic
      setTimeout(async () => {
        const travelerWs = connectedClients.get(state.travelerUid)?.ws;
        if (travelerWs) {
          travelerWs.send(JSON.stringify({
            type: 'guide_accepted_request',
            payload: {
              bookingId,
              guide: {
                userId: currentGuide.userId || currentGuide.id,
                name: currentGuide.name,
                rating: currentGuide.rating || 4.8,
                trustScore: currentGuide.trustScore || 98,
                languages: currentGuide.languages || ['English'],
                packages: currentGuide.packages || ['basic'],
                eta: '5-10 mins'
              }
            }
          }));
        }
      }, 1500);
      return;
    }

    console.log(`Querying Guide ${currentGuide.name} (index: ${state.currentIndex}) for booking ${bookingId}`);

    // Send match request to guide
    guideWs.send(JSON.stringify({
      type: 'incoming_match_request',
      payload: {
        bookingId,
        travelerName: state.travelerName,
        destination: state.destination,
        duration: state.duration,
        packageType: state.packageType,
        expectedEarnings: Math.round(state.totalPrice * 0.85) // 15% platform fee
      }
    }));

    // Start 15s timeout
    state.timeoutId = setTimeout(() => {
      console.log(`Guide ${currentGuide.name} request timed out for booking ${bookingId}`);
      // Notify guide of timeout
      guideWs.send(JSON.stringify({ type: 'match_request_timeout', payload: { bookingId } }));
      // Try next guide
      state.currentIndex++;
      queryNextGuide(bookingId);
    }, 15000);
  }

  // Helper: Broadcast online guides to all online travelers
  async function broadcastOnlineGuides() {
    const allGuides = await db.getGuides();
    const onlineGuides = allGuides.filter(g => g.online);
    
    const packet = JSON.stringify({ type: 'online_guides_update', payload: onlineGuides });
    for (const [uid, client] of connectedClients.entries()) {
      if (client.role === 'traveler') {
        client.ws.send(packet);
      }
    }
  }

  // Helper: Broadcast active trips to supervisors
  async function broadcastSupervisorTrips() {
    const activeTrips = await db.getBookings().then(list => list.filter(b => b.status === 'accepted' || b.status === 'in_progress'));
    const packet = JSON.stringify({ type: 'active_trips_update', payload: activeTrips });
    for (const [uid, client] of connectedClients.entries()) {
      if (client.role === 'supervisor') {
        client.ws.send(packet);
      }
    }
  }

  // Helper: Simulate guide GPS coordinate movements closer to traveler
  function simulateGuideMovement(bookingId, travelerUid, guideId) {
    let step = 0;
    const maxSteps = 10;
    
    db.getGuides().then(allGuides => {
      const guide = allGuides.find(g => g.userId === guideId || g.id === guideId);
      if (!guide) return;
      
      let guideLat = parseFloat(guide.lat) || 28.6139;
      let guideLng = parseFloat(guide.lng) || 77.2090;
      
      const intervalId = setInterval(async () => {
        const travelerClient = connectedClients.get(travelerUid);
        if (!travelerClient) {
          console.log(`Simulation traveler ${travelerUid} disconnected. Stopping GPS simulator.`);
          clearInterval(intervalId);
          return;
        }
        
        const targetLat = travelerClient.lat || 28.6139;
        const targetLng = travelerClient.lng || 77.2090;
        
        // Move 10% closer on each step
        guideLat = guideLat + (targetLat - guideLat) * 0.15;
        guideLng = guideLng + (targetLng - guideLng) * 0.15;
        
        travelerClient.ws.send(JSON.stringify({
          type: 'guide_location_update',
          payload: {
            bookingId,
            lat: guideLat,
            lng: guideLng
          }
        }));
        
        step++;
        if (step >= maxSteps) {
          console.log(`Simulation complete. Guide has arrived near traveler.`);
          clearInterval(intervalId);
        }
      }, 4000);
      
      const client = connectedClients.get(travelerUid);
      if (client) {
        client.simulationInterval = intervalId;
      }
    });
  }
}
