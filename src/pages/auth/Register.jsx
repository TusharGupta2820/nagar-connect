import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const result = await signUp(email, password, {
      fullName,
      phone: `+91 ${phone}`,
      role: 'citizen',
    });

    setLoading(false);

    if (result.success) {
      alert('Registration successful! You are now logged in as a citizen.');
      navigate('/');
    } else {
      setErrorMessage(result.error || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 sm:py-space-xl">
      <div className="bg-surface-container-lowest p-5 sm:p-space-xl rounded-2xl shadow-md border border-surface-container space-y-space-md sm:space-y-space-lg">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center mx-auto shadow-sm">
            <span className="material-symbols-outlined text-2xl">person_add</span>
          </div>
          <h1 className="text-xl sm:text-headline-lg font-bold text-primary">
            Citizen Registration
          </h1>
          <p className="text-xs text-on-surface-variant">
            Create an official citizen profile for easy complaint management
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs flex items-center gap-2 border border-error">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-space-md">
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary block">Full Name *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Suresh N. Patil"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary min-h-[44px]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-primary block">Mobile Number (10 digits) *</label>
            <div className="flex gap-2">
              <span className="px-3 py-2.5 bg-surface-container rounded-xl text-xs font-bold flex items-center text-primary">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98201 44521"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary min-h-[44px]"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-primary block">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary min-h-[44px]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-primary block">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary min-h-[44px]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-primary block">Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary min-h-[44px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-secondary text-on-primary font-bold rounded-xl transition-colors shadow-md disabled:opacity-50 text-sm min-h-[46px]"
          >
            {loading ? 'Registering Account...' : 'Create Citizen Account'}
          </button>
        </form>

        <div className="text-center text-xs text-on-surface-variant pt-2">
          Already registered?{' '}
          <Link to="/login" className="text-secondary font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
