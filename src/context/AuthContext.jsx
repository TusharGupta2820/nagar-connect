import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, DEMO_USERS } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Synchronously initialize from localStorage to prevent unauthenticated redirect on page reload
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('nagar_connect_mock_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('nagar_connect_mock_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial session load
    const initAuth = async () => {
      try {
        const { user: initialUser, profile: initialProfile } = await authService.getCurrentSession();
        if (initialUser) {
          setUser(initialUser);
          setProfile(initialProfile);
        }
      } catch (err) {
        console.error('Failed to initialize session:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen to Supabase and storage auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const userProfile = await authService.getProfile(session.user.id);
        setProfile(userProfile);
      } else if (event === 'SIGNED_OUT') {
        // Explicit logout event
        localStorage.removeItem('nagar_connect_mock_user');
        setUser(null);
        setProfile(null);
      } else {
        // Preserves session on page reload (INITIAL_SESSION with null Supabase session)
        const stored = localStorage.getItem('nagar_connect_mock_user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setProfile(parsed);
          } catch {
            setUser(null);
            setProfile(null);
          }
        }
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
      localStorage.removeItem('nagar_connect_mock_user');
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

