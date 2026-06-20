import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/firebase';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'traveler', 'guide', 'supervisor'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('userRole');
    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser));
      setUserRole(savedRole);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await authService.loginWithEmail(email, password);
      setUser(loggedUser);
      setUserRole(loggedUser.role);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      localStorage.setItem('userRole', loggedUser.role);
      return loggedUser;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (email, password, name, role) => {
    setLoading(true);
    try {
      const registeredUser = await authService.signupWithEmail(email, password, name, role);
      setUser(registeredUser);
      setUserRole(registeredUser.role);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      localStorage.setItem('userRole', registeredUser.role);
      return registeredUser;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (role) => {
    setLoading(true);
    try {
      const loggedUser = await authService.loginWithGoogle(role);
      setUser(loggedUser);
      setUserRole(loggedUser.role);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      localStorage.setItem('userRole', loggedUser.role);
      return loggedUser;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserRole = useCallback((newRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      setUserRole(newRole);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('userRole', newRole);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      userRole,
      isAuthenticated,
      loading,
      login,
      signup,
      loginWithGoogle,
      logout,
      updateUserRole
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

