// Firebase Authentication Client Service (with fallback support)
let firebaseApp = null;
let firebaseAuth = null;
let googleProvider = null;
const isMocked = true; // Use elegant client-side authentication simulation for instant testing

export const authService = {
  isMocked,

  async loginWithEmail(email, password) {
    console.log(`[Auth] Logging in with email: ${email}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Hardcoded roles for testing convenience
    let role = 'traveler';
    let name = email.split('@')[0];
    name = name.charAt(0).toUpperCase() + name.slice(1);

    if (email.includes('guide')) {
      role = 'guide';
    } else if (email.includes('supervisor') || email.includes('admin')) {
      role = 'supervisor';
    }

    const mockUser = {
      uid: `usr_${Date.now()}`,
      email,
      name,
      photoURL: role === 'guide' ? '👨‍💼' : '🧑',
      role
    };

    // Sync with backend database
    try {
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockUser)
      });
    } catch (e) {
      console.warn('Backend sync failed, running in offline frontend-only mode', e);
    }

    return mockUser;
  },

  async signupWithEmail(email, password, name, role) {
    console.log(`[Auth] Signing up: ${email} as ${role}`);
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockUser = {
      uid: `usr_${Date.now()}`,
      email,
      name,
      photoURL: role === 'guide' ? '👨‍💼' : '🧑',
      role
    };

    // Sync with backend
    try {
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockUser)
      });
    } catch (e) {
      console.warn('Backend sync failed', e);
    }

    return mockUser;
  },

  async loginWithGoogle(role = 'traveler') {
    console.log(`[Auth] Logging in with Google...`);
    await new Promise(resolve => setTimeout(resolve, 700));

    const mockUser = {
      uid: `google_${Date.now()}`,
      email: `${role || 'traveler'}@gmail.com`,
      name: `Google User (${role})`,
      photoURL: 'https://lh3.googleusercontent.com/a/default-user',
      role: role || 'traveler'
    };

    // Sync with backend
    try {
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockUser)
      });
    } catch (e) {
      console.warn('Backend sync failed', e);
    }

    return mockUser;
  },

  async logout() {
    console.log('[Auth] Logging out.');
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }
};
