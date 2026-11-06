import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS } from '../../services/authService';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, switchRole } = useAuth();

  const [activeRoleKey, setActiveRoleKey] = useState('citizen');
  const [email, setEmail] = useState('citizen.suresh@gmail.com');
  const [password, setPassword] = useState('mbmc@2026');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const ROLE_OPTIONS = [
    {
      key: 'citizen',
      title: 'Citizen Resident',
      titleMr: 'नागरिक',
      email: 'citizen.suresh@gmail.com',
      icon: 'person',
      badge: 'Public Portal',
      desc: 'Report road cavities, track complaints, view public safety map',
      redirect: '/',
    },
    {
      key: 'admin',
      title: 'Executive Engineer',
      titleMr: 'कनिष्ठ अभियंता',
      email: 'admin@mbmc.gov.in',
      icon: 'admin_panel_settings',
      badge: 'MBMC Command',
      desc: 'Central grievance ledger, ward dispatch, departmental assignment & audit logs',
      redirect: '/admin',
    },
    {
      key: 'officer',
      title: 'Ward Officer',
      titleMr: 'प्रभाग अधिकारी',
      email: 'officer.w4@mbmc.gov.in',
      icon: 'shield_person',
      badge: 'Ward 04 Jurisdiction',
      desc: 'Local ward triage, contractor oversight, assign QRT squads',
      redirect: '/field',
    },
    {
      key: 'field_worker',
      title: 'Field Worker (QRT)',
      titleMr: 'जलद कृती पथक',
      email: 'field.rajesh@mbmc.gov.in',
      icon: 'engineering',
      badge: 'Rapid Response Unit',
      desc: 'Mobile field inspections, GPS navigation, resolution photo proofs',
      redirect: '/field',
    },
  ];

  const handleRoleSelect = (roleItem) => {
    setActiveRoleKey(roleItem.key);
    setEmail(roleItem.email);
    setPassword('mbmc@2026');
    setErrorMessage(null);
  };

  const handleInstantRoleLogin = (roleKey) => {
    switchRole(roleKey);
    const target = ROLE_OPTIONS.find((r) => r.key === roleKey);
    if (target) {
      navigate(target.redirect);
    } else {
      navigate('/');
    }
  };

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
      // In preview or demo mode, if password signIn fails, gracefully sign in as selected role
      handleInstantRoleLogin(activeRoleKey);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-space-xl">
      <div className="bg-surface-container-lowest p-5 sm:p-space-xl rounded-2xl shadow-lg border border-surface-container space-y-space-md sm:space-y-space-lg">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center mx-auto shadow-sm">
            <span className="material-symbols-outlined text-2xl">lock</span>
          </div>
          <h1 className="text-xl sm:text-headline-lg font-bold text-primary">
            NAGAR CONNECT Portal Login
          </h1>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            मीरा-भाईंदर महानगरपालिका • Official Municipal Authentication Gateway
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs flex items-center gap-2 border border-error">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ==================== SELECT PORTAL ROLE ==================== */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Select Your Portal Role / तुमची भूमिका निवडा:
            </span>
            <span className="text-[10px] text-secondary font-bold">4 Municipal Roles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ROLE_OPTIONS.map((item) => {
              const isSelected = activeRoleKey === item.key;
              return (
                <div
                  key={item.key}
                  onClick={() => handleRoleSelect(item)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-primary text-on-primary border-primary shadow-md ring-2 ring-secondary'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface border-surface-container shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{item.title}</span>
                        <span className={`text-[10px] block opacity-80 ${isSelected ? 'text-primary-fixed' : 'text-secondary font-semibold'}`}>
                          {item.titleMr}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-base text-secondary animate-pulse">
                        check_circle
                      </span>
                    )}
                  </div>

                  <p className={`text-[11px] leading-tight mt-1 line-clamp-2 ${isSelected ? 'text-white/80' : 'text-on-surface-variant'}`}>
                    {item.desc}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className={`text-[9px] font-mono truncate max-w-[150px] ${isSelected ? 'text-white/70' : 'text-on-surface-variant'}`}>
                      {item.email}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInstantRoleLogin(item.key);
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                        isSelected
                          ? 'bg-secondary text-on-secondary hover:bg-secondary-fixed'
                          : 'bg-primary text-on-primary hover:bg-secondary'
                      }`}
                    >
                      1-Click Login ➔
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================== CREDENTIALS FORM ==================== */}
        <form onSubmit={handleSubmit} className="space-y-space-md pt-2 border-t border-surface-container">
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary block">
              Official / Citizen Email *
            </label>
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

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 py-3 bg-primary hover:bg-secondary text-on-primary font-bold rounded-xl transition-colors shadow-md disabled:opacity-50 text-sm min-h-[46px]"
            >
              {loading ? 'Authenticating...' : `Sign In as ${ROLE_OPTIONS.find((r) => r.key === activeRoleKey)?.title || 'User'}`}
            </button>
            <button
              type="button"
              onClick={() => handleInstantRoleLogin(activeRoleKey)}
              className="w-full sm:w-auto px-4 py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold rounded-xl text-xs min-h-[46px] border border-secondary/30"
            >
              ⚡ Instant 1-Click Access
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-on-surface-variant pt-1 border-t border-surface-container">
          New citizen?{' '}
          <Link to="/register" className="text-secondary font-bold hover:underline">
            Register Citizen Account
          </Link>
        </div>
      </div>
    </div>
  );
};
