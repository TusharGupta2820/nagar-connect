import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS } from '../../services/authService';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, switchRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      if (email.includes('admin')) {
        navigate('/admin');
      } else if (email.includes('field') || email.includes('officer')) {
        navigate('/field');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } else {
      setErrorMessage(result.error || 'Invalid credentials.');
    }
  };

  const handleQuickDemoLogin = (roleKey) => {
    switchRole(roleKey);
    if (roleKey === 'admin') navigate('/admin');
    else if (roleKey === 'field_worker' || roleKey === 'officer') navigate('/field');
    else navigate('/');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 sm:py-space-xl">
      <div className="bg-surface-container-lowest p-5 sm:p-space-xl rounded-2xl shadow-md border border-surface-container space-y-space-md sm:space-y-space-lg">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center mx-auto shadow-sm">
            <span className="material-symbols-outlined text-2xl">lock</span>
          </div>
          <h1 className="text-xl sm:text-headline-lg font-bold text-primary">
            NAGAR CONNECT Login
          </h1>
          <p className="text-xs text-on-surface-variant">
            Official Authentication Gateway for Citizens & Municipal Officers
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs flex items-center gap-2 border border-error">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Standard Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-space-md">
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary block">Official / Citizen Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@mbmc.gov.in or citizen@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary min-h-[44px]"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-primary block">Password *</label>
              <Link to="/forgot-password" className="text-xs text-secondary hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary min-h-[44px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-secondary text-on-primary font-bold rounded-xl transition-colors shadow-md disabled:opacity-50 text-sm min-h-[46px]"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        {/* 1-Click Evaluation Accounts */}
        <div className="space-y-2 pt-2 border-t border-surface-container">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block text-center">
            Instant 1-Click Role Access:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('citizen')}
              className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary border border-surface-container min-h-[42px]"
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary border border-surface-container min-h-[42px]"
            >
              Admin (JE)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('officer')}
              className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-secondary border border-surface-container min-h-[42px]"
            >
              Ward Officer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('field_worker')}
              className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-emerald-800 border border-surface-container min-h-[42px]"
            >
              Field Squad (QRT)
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-on-surface-variant pt-2">
          New citizen?{' '}
          <Link to="/register" className="text-secondary font-bold hover:underline">
            Register Citizen Account
          </Link>
        </div>
      </div>
    </div>
  );
};
