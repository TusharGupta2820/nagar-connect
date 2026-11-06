import { supabase, isSupabaseConfigured } from './supabaseClient';

// Built-in Demo accounts for local testing / evaluations when Supabase auth is unprovisioned
export const DEMO_USERS = {
  admin: {
    id: '00000000-0000-4000-a000-000000000001',
    email: 'admin@mbmc.gov.in',
    full_name: 'Er. S. Patil',
    role: 'admin',
    designation: 'Executive Engineer (Roads & Infrastructure)',
    phone: '+91 98201 11223',
    ward_id: null,
  },
  officer: {
    id: '00000000-0000-4000-a000-000000000002',
    email: 'officer.w4@mbmc.gov.in',
    full_name: 'Er. Aniket Joshi',
    role: 'officer',
    designation: 'Junior Engineer (Ward 04)',
    phone: '+91 98202 22334',
    ward_id: 'ward-04-uuid',
  },
  field_worker: {
    id: '00000000-0000-4000-a000-000000000003',
    email: 'field.rajesh@mbmc.gov.in',
    full_name: 'Rajesh Sawant',
    role: 'field_worker',
    designation: 'Field Inspection Lead (QRT Squad 2)',
    phone: '+91 98203 33445',
    ward_id: 'ward-04-uuid',
  },
  citizen: {
    id: '00000000-0000-4000-a000-000000000004',
    email: 'citizen.suresh@gmail.com',
    full_name: 'Suresh Narayan Patil',
    role: 'citizen',
    designation: 'Civic Citizen & Resident',
    phone: '+91 98201 44521',
    ward_id: null,
  },
};

export const authService = {
  async signIn(email, password) {
    if (!isSupabaseConfigured()) {
      // Find matching demo user or default to citizen
      const matched = Object.values(DEMO_USERS).find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      const user = matched || {
        id: 'mock-user-id',
        email,
        full_name: email.split('@')[0],
        role: 'citizen',
      };
      localStorage.setItem('nagar_connect_mock_user', JSON.stringify(user));
      return { user, profile: user, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    const profile = await this.getProfile(data.user.id);
    return { user: data.user, profile, error: null };
  },

  async signUp(email, password, metadata = {}) {
    if (!isSupabaseConfigured()) {
      const newUser = {
        id: `mock-${Date.now()}`,
        email,
        full_name: metadata.fullName || email.split('@')[0],
        phone: metadata.phone || '',
        role: metadata.role || 'citizen',
      };
      localStorage.setItem('nagar_connect_mock_user', JSON.stringify(newUser));
      return { user: newUser, profile: newUser, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.fullName,
          phone: metadata.phone,
          role: metadata.role || 'citizen',
        },
      },
    });

    if (error) throw error;
    return { user: data.user, error: null };
  },

  async signOut() {
    localStorage.removeItem('nagar_connect_mock_user');
    if (!isSupabaseConfigured()) {
      return { error: null };
    }
    return await supabase.auth.signOut();
  },

  async resetPassword(email) {
    if (!isSupabaseConfigured()) {
      return { data: { message: 'Reset email simulated in preview mode' }, error: null };
    }
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },

  async getProfile(userId) {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('nagar_connect_mock_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return DEMO_USERS.citizen;
        }
      }
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*, wards(*), departments(*)')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('Could not fetch user profile:', error.message);
      return null;
    }
    return data;
  },

  async updateProfile(userId, updates) {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('nagar_connect_mock_user');
      const current = stored ? JSON.parse(stored) : DEMO_USERS.citizen;
      const updated = { ...current, ...updates };
      localStorage.setItem('nagar_connect_mock_user', JSON.stringify(updated));
      return { data: updated, error: null };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  },

  onAuthStateChange(callback) {
    if (!isSupabaseConfigured()) {
      // Mock listener
      const checkMock = () => {
        const stored = localStorage.getItem('nagar_connect_mock_user');
        if (stored) {
          try {
            const user = JSON.parse(stored);
            callback('SIGNED_IN', { user });
          } catch {
            callback('SIGNED_OUT', null);
          }
        } else {
          callback('SIGNED_OUT', null);
        }
      };
      window.addEventListener('storage', checkMock);
      return {
        data: {
          subscription: {
            unsubscribe: () => window.removeEventListener('storage', checkMock),
          },
        },
      };
    }

    return supabase.auth.onAuthStateChange(callback);
  },

  async getCurrentSession() {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('nagar_connect_mock_user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          return { user, profile: user };
        } catch {
          return { user: null, profile: null };
        }
      }
      return { user: null, profile: null };
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { user: null, profile: null };

    const profile = await this.getProfile(session.user.id);
    return { user: session.user, profile };
  },
};

