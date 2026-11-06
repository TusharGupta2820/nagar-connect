import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, DEMO_USERS } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session load
    const initAuth = async () => {
      try {
        const { user: initialUser, profile: initialProfile } = await authService.getCurrentSession();
        setUser(initialUser);
        setProfile(initialProfile);
      } catch (err) {
        console.error('Failed to initialize session:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen to auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const userProfile = await authService.getProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { user: loggedUser, profile: loggedProfile } = await authService.signIn(email, password);
      setUser(loggedUser);
      setProfile(loggedProfile);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, metadata) => {
    setLoading(true);
    try {
      const { user: newUser } = await authService.signUp(email, password, metadata);
      setUser(newUser);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Quick switch role (for instant evaluation of Citizen, Admin, Officer, Field Worker)
  const switchRole = (roleKey) => {
    const demo = DEMO_USERS[roleKey] || DEMO_USERS.citizen;
    setUser(demo);
    setProfile(demo);
    localStorage.setItem('nagar_connect_mock_user', JSON.stringify(demo));
  };

  const role = profile?.role || user?.role || 'citizen';

  const value = {
    user,
    profile,
    role,
    loading,
    signIn,
    signUp,
    signOut,
    switchRole,
    isAdmin: role === 'admin',
    isOfficer: role === 'officer',
    isFieldWorker: role === 'field_worker',
    isCitizen: role === 'citizen',
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

