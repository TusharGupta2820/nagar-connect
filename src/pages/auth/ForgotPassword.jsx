import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 sm:py-space-xl">
      <div className="bg-surface-container-lowest p-5 sm:p-space-xl rounded-2xl shadow-md border border-surface-container space-y-space-md sm:space-y-space-lg">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center mx-auto shadow-sm">
            <span className="material-symbols-outlined text-2xl">password</span>
          </div>
          <h1 className="text-xl sm:text-headline-lg font-bold text-primary">
            Reset Password
          </h1>
          <p className="text-xs text-on-surface-variant">
            Enter your registered email address to receive password reset instructions
          </p>
        </div>

        {success ? (
          <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl text-xs space-y-2 border border-emerald-200">
            <p className="font-bold">Reset Instructions Dispatched</p>
            <p>
              If an account is associated with <span className="font-semibold">{email}</span>, a secure recovery email has been sent.
            </p>
            <div className="pt-2">
              <Link to="/login" className="font-bold text-primary underline">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-space-md">
            {error && (
              <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs border border-error">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-primary block">Registered Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary min-h-[44px]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-secondary transition-colors text-sm shadow flex items-center justify-center gap-2 disabled:opacity-50 min-h-[46px]"
            >
              {loading && <span className="material-symbols-outlined text-sm animate-spin">sync</span>}
              <span>{loading ? 'Sending Request...' : 'Send Recovery Link'}</span>
            </button>

            <div className="text-center text-xs text-on-surface-variant pt-1">
              Remembered your credentials?{' '}
              <Link to="/login" className="font-bold text-secondary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
