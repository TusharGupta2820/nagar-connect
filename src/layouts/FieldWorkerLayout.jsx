import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const FieldWorkerLayout = () => {
  const location = useLocation();
  const { user, profile, role, switchRole, signOut } = useAuth();

  const isActive = (path) => {
    if (path === '/field' && location.pathname === '/field') return true;
    if (path !== '/field' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navClass = (path) =>
    `flex flex-col items-center justify-center flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
      isActive(path)
        ? 'text-primary font-bold bg-surface-container-high'
        : 'text-on-surface-variant hover:text-primary'
    }`;

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col pb-20 md:pb-0">
      {/* 3px Sovereign National Stripe */}
      <div className="h-1 w-full flex fixed top-0 left-0 right-0 z-50">
        <div className="w-1/3 bg-[#FF9933] h-full"></div>
        <div className="w-1/3 bg-surface-container-lowest h-full"></div>
        <div className="w-1/3 bg-[#138808] h-full"></div>
      </div>

      {/* Field Worker Header */}
      <header className="fixed top-1 left-0 right-0 h-16 bg-surface-container-lowest shadow-sm z-40 px-3 sm:px-4 flex items-center justify-between border-b border-surface-container">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold shadow-sm shrink-0">
            <span className="material-symbols-outlined text-title-md">engineering</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-primary tracking-tight text-xs sm:text-sm uppercase truncate">
                MBMC DISPATCH
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0">
                QRT
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-on-surface-variant truncate">Ward 04 Unit • Patrol MH-04</p>
          </div>
        </div>

        {/* Action / Role switcher */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <select
            aria-label="Field Worker Role Switcher"
            value={role}
            onChange={(e) => switchRole(e.target.value)}
            className="text-[11px] sm:text-xs bg-surface-container-low text-primary border border-outline-variant/40 rounded px-1.5 sm:px-2 py-1 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="field_worker">Field QRT</option>
            <option value="admin">Admin</option>
            <option value="citizen">Citizen</option>
          </select>

          <Link
            to="/admin"
            className="hidden md:inline-flex items-center gap-1 px-3 py-1 bg-surface-container text-xs font-semibold rounded hover:bg-surface-container-high"
          >
            Admin View
          </Link>

          <button
            onClick={signOut}
            title="Logout"
            className="p-1 text-on-surface-variant hover:text-error rounded"
          >
            <span className="material-symbols-outlined text-lg sm:text-title-md">logout</span>
          </button>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="w-full pt-20 px-3 sm:px-4 flex-1 max-w-5xl mx-auto">
        <Outlet />
      </main>

      {/* Mobile Sticky Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-container shadow-lg z-50 flex items-center justify-around h-16 px-2">
        <Link to="/field" className={navClass('/field')}>
          <span className="material-symbols-outlined text-xl">assignment</span>
          <span className="text-[10px] mt-0.5">Tasks</span>
        </Link>
        <Link to="/field/complaints" className={navClass('/field/complaints')}>
          <span className="material-symbols-outlined text-xl">checklist</span>
          <span className="text-[10px] mt-0.5">Assigned</span>
        </Link>
        <Link to="/admin/map" className={navClass('/admin/map')}>
          <span className="material-symbols-outlined text-xl">map</span>
          <span className="text-[10px] mt-0.5">GIS Map</span>
        </Link>
        <Link to="/" className={navClass('/')}>
          <span className="material-symbols-outlined text-xl">public</span>
          <span className="text-[10px] mt-0.5">Citizen</span>
        </Link>
      </nav>
    </div>
  );
};
