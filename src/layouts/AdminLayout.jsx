import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
  const location = useLocation();
  const { user, profile, role, switchRole, signOut } = useAuth();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItemClass = (path) =>
    `flex items-center gap-space-sm px-space-md py-space-sm font-label-lg text-label-lg rounded transition-colors ${
      isActive(path)
        ? 'bg-secondary text-on-secondary font-semibold'
        : 'text-primary-fixed hover:bg-secondary/40 hover:text-on-primary'
    }`;

  const closeSidebarOnMobile = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
      {/* ===================== MOBILE BACKDROP SCRIM ===================== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===================== SIDEBAR ===================== */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-primary-container text-on-primary z-50 flex flex-col justify-between shadow-[0_1px_12px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col overflow-y-auto">
          {/* National Tricolor 3px Accent */}
          <div className="h-1 w-full flex shrink-0">
            <div className="w-1/3 bg-[#FF9933] h-full"></div>
            <div className="w-1/3 bg-surface-container-lowest h-full"></div>
            <div className="w-1/3 bg-[#138808] h-full"></div>
          </div>

          {/* Logo Banner */}
          <div className="px-space-md py-space-lg flex items-center justify-between border-b border-primary/20">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
                <span className="material-symbols-outlined text-title-lg">shield</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-primary uppercase">
                  NAGAR CONNECT
                </span>
                <span className="font-label-sm text-label-sm text-primary-fixed">
                  MBMC Operations
                </span>
              </div>
            </div>

            {/* Close Button on Mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-full text-on-primary hover:bg-secondary/40"
              aria-label="Close sidebar"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Section: Operations Command */}
          <div className="px-space-md pt-space-md pb-space-xs">
            <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-wider font-semibold">
              Operations Command
            </span>
          </div>

          <nav className="px-space-md space-y-1">
            <Link to="/admin" onClick={closeSidebarOnMobile} className={navItemClass('/admin')}>
              <span className="material-symbols-outlined text-title-md">grid_view</span>
              <span>Executive Console</span>
            </Link>

            <Link to="/admin/complaints" onClick={closeSidebarOnMobile} className={navItemClass('/admin/complaints')}>
              <span className="material-symbols-outlined text-title-md">assignment_turned_in</span>
              <span>Ward Dispatch Queue</span>
            </Link>

            <Link to="/admin/map" onClick={closeSidebarOnMobile} className={navItemClass('/admin/map')}>
              <span className="material-symbols-outlined text-title-md">map</span>
              <span>GIS Road Cadastre</span>
            </Link>

            <Link to="/admin/analytics" onClick={closeSidebarOnMobile} className={navItemClass('/admin/analytics')}>
              <span className="material-symbols-outlined text-title-md">leaderboard</span>
              <span>Performance Analytics</span>
            </Link>

            <Link to="/admin/wards" onClick={closeSidebarOnMobile} className={navItemClass('/admin/wards')}>
              <span className="material-symbols-outlined text-title-md">location_city</span>
              <span>Ward Management</span>
            </Link>

            <Link to="/admin/departments" onClick={closeSidebarOnMobile} className={navItemClass('/admin/departments')}>
              <span className="material-symbols-outlined text-title-md">corporate_fare</span>
              <span>Departments</span>
            </Link>

            <Link to="/admin/users" onClick={closeSidebarOnMobile} className={navItemClass('/admin/users')}>
              <span className="material-symbols-outlined text-title-md">manage_accounts</span>
              <span>User & Role Admin</span>
            </Link>

            <Link to="/admin/audit-logs" onClick={closeSidebarOnMobile} className={navItemClass('/admin/audit-logs')}>
              <span className="material-symbols-outlined text-title-md">history</span>
              <span>Audit Trail Logs</span>
            </Link>
          </nav>

          {/* Section: Field Worker & Citizen Feeds */}
          <div className="px-space-md pt-space-lg pb-space-xs">
            <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-wider font-semibold">
              External & Citizen Feeds
            </span>
          </div>

          <nav className="px-space-md space-y-1 mb-space-lg">
            <Link to="/field" onClick={closeSidebarOnMobile} className={navItemClass('/field')}>
              <span className="material-symbols-outlined text-title-md">engineering</span>
              <span>Field Worker Console</span>
            </Link>

            <Link to="/" onClick={closeSidebarOnMobile} className={navItemClass('/')}>
              <span className="material-symbols-outlined text-title-md">public</span>
              <span>Citizen Public Portal</span>
            </Link>

            <Link to="/track" onClick={closeSidebarOnMobile} className={navItemClass('/track')}>
              <span className="material-symbols-outlined text-title-md">manage_search</span>
              <span>Docket Search</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Shift Status Capsule */}
        <div className="p-space-md bg-tertiary-container text-on-primary space-y-space-xs border-t border-primary/20">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase font-semibold">
              Ward 04 Active Control
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="font-body-sm text-body-sm font-semibold truncate">
            {profile?.full_name || 'Er. S. Patil'}
          </p>
          <div className="flex items-center justify-between text-on-tertiary-container text-label-sm">
            <span>Shift: 08:00 - 20:00 IST</span>
            <span className="text-emerald-400 font-bold">Online</span>
          </div>
        </div>
      </aside>

      {/* ===================== MAIN WRAPPER ===================== */}
      <div className="pl-0 lg:pl-72 transition-[padding] duration-300">
        {/* Fixed Top Administrative Header */}
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.06)] z-30 px-3 sm:px-margin flex items-center justify-between border-b border-surface-container">
          <div className="flex items-center gap-2 sm:gap-space-md">
            {/* Hamburger Toggle Button for Mobile/Tablet */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-primary hover:bg-surface-container focus:outline-none"
              aria-label="Open sidebar"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            <div className="flex items-center gap-1 sm:gap-space-xs truncate">
              <span className="font-title-md text-sm sm:text-title-md font-semibold text-primary truncate">
                MBMC
              </span>
              <span className="bg-surface-container text-on-surface-variant font-label-sm text-[10px] sm:text-label-sm px-1.5 py-0.5 rounded font-bold uppercase">
                Officer Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-space-md">
            <div className="hidden xl:flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded text-on-surface-variant">
              <span className="material-symbols-outlined text-title-md text-secondary">support_agent</span>
              <span className="font-label-sm text-label-sm">Control: 1800-22-3844</span>
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-1.5 sm:p-space-xs text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container relative"
                type="button"
                title="Municipal Alerts"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container p-space-sm z-50">
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <span className="font-label-md text-label-md font-bold text-primary">
                      Official Notifications (2)
                    </span>
                    <button
                      onClick={() => setNotificationOpen(false)}
                      className="text-xs text-on-surface-variant hover:text-primary"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-error-container/30 rounded border-l-2 border-error">
                      <p className="font-bold text-error">SLA Escalation Alert</p>
                      <p className="text-on-surface-variant">
                        Complaint #NC-MBMC-2026-008841 (Ward 4) has 1h 45m left to deadline.
                      </p>
                    </div>
                    <div className="p-2 bg-surface-container-low rounded border-l-2 border-secondary">
                      <p className="font-bold text-primary">New Pothole Registered</p>
                      <p className="text-on-surface-variant">
                        Navghar Road geocoded complaint received via Citizen QR scanner.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Role Switcher */}
            <div className="flex items-center gap-1 bg-surface-container-low px-1.5 sm:px-2 py-1 rounded border border-outline-variant/30">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant hidden sm:inline">Role:</span>
              <select
                aria-label="Admin View Role Switcher"
                value={role}
                onChange={(e) => switchRole(e.target.value)}
                className="bg-transparent text-[11px] sm:text-xs font-semibold text-primary focus:outline-none cursor-pointer"
              >
                <option value="admin">Admin</option>
                <option value="officer">Officer</option>
                <option value="field_worker">Field</option>
                <option value="citizen">Citizen</option>
              </select>
            </div>

            {/* Officer Profile Capsule */}
            <div className="flex items-center gap-1 sm:gap-space-sm pl-1 sm:pl-space-sm border-l border-surface-container">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                SP
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="font-label-md text-label-md font-semibold text-on-surface truncate">
                  {profile?.full_name || 'Er. S. Patil'}
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant truncate">
                  {profile?.designation || 'Executive Engineer'}
                </span>
              </div>

              <button
                onClick={signOut}
                title="Logout"
                className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-error"
              >
                <span className="material-symbols-outlined text-title-md">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="relative pt-16 bg-surface min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
