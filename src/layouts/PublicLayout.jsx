import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PublicLayout = () => {
  const location = useLocation();
  const { user, role, switchRole, signOut } = useAuth();
  const [lang, setLang] = useState('en');
  const [fontSizeOffset, setFontSizeOffset] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path) =>
    `px-space-sm py-space-xs font-label-lg text-label-lg transition-colors ${
      isActive(path)
        ? 'bg-surface-container-high text-on-surface font-semibold rounded'
        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded'
    }`;

  const mobileNavLinkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-colors ${
      isActive(path)
        ? 'bg-primary text-on-primary font-bold shadow-sm'
        : 'text-on-surface hover:bg-surface-container'
    }`;

  const bottomNavClass = (path) =>
    `flex flex-col items-center justify-center flex-1 py-1.5 transition-colors ${
      isActive(path) ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
    }`;

  return (
    <div
      className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col"
      style={{ fontSize: `${14 + fontSizeOffset}px` }}
    >
      {/* ===================== FIXED HEADER ===================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
        {/* National 3px Tricolor Strip */}
        <div className="h-1 w-full flex">
          <div className="w-1/3 bg-[#FF9933] h-full"></div>
          <div className="w-1/3 bg-surface-container-lowest h-full"></div>
          <div className="w-1/3 bg-[#138808] h-full"></div>
        </div>

        {/* Top Sovereign Institutional Bar */}
        <div className="bg-primary text-on-primary py-1 px-3 sm:px-margin">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-label-sm">
            <div className="flex items-center gap-2 sm:gap-space-md truncate">
              <span className="tracking-wider uppercase font-semibold truncate">
                महाराष्ट्र शासन | MBMC
              </span>
              <span className="opacity-40 hidden sm:inline">|</span>
              <span className="hidden sm:inline">Mira-Bhayandar Municipal Corporation</span>
              <span className="hidden lg:inline-block bg-primary-container text-primary-fixed px-1.5 py-0.2 rounded font-code-sm text-[10px]">
                ULB: MBMC-MH-08
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-space-lg shrink-0">
              {/* Official App Download Link */}
              <a
                href="/NagarConnect.apk"
                download="NagarConnect.apk"
                className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded font-bold text-[11px] transition-colors"
                title="Download Official Android APK (3.7 MB)"
              >
                <span className="material-symbols-outlined text-xs">android</span>
                <span>Download App</span>
              </a>

              <div className="flex items-center gap-1">
                <span className="text-surface-variant hidden md:inline">Helpline:</span>
                <a className="text-primary-fixed font-bold hover:underline" href="tel:1800223844">
                  1800-22-3844
                </a>
              </div>

              {/* Text Size Controls (Desktop) */}
              <div className="hidden md:flex items-center gap-0.5">
                <button
                  onClick={() => setFontSizeOffset(-1)}
                  className="px-1.5 py-0.5 bg-primary-container text-on-primary rounded hover:bg-secondary text-xs"
                  type="button"
                  title="Decrease font size"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSizeOffset(0)}
                  className="px-1.5 py-0.5 bg-primary-container text-on-primary rounded hover:bg-secondary text-xs"
                  type="button"
                  title="Normal font size"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSizeOffset(1)}
                  className="px-1.5 py-0.5 bg-primary-container text-on-primary rounded hover:bg-secondary text-xs"
                  type="button"
                  title="Increase font size"
                >
                  A+
                </button>
              </div>

              {/* Bilingual Selectors */}
              <div className="flex items-center gap-1 font-label-sm text-xs">
                <button
                  onClick={() => setLang('en')}
                  className={`px-1 rounded ${lang === 'en' ? 'font-bold text-primary-fixed bg-primary-container' : 'text-on-primary hover:text-primary-fixed'}`}
                  type="button"
                >
                  EN
                </button>
                <span className="opacity-40">|</span>
                <button
                  onClick={() => setLang('mr')}
                  className={`px-1 rounded ${lang === 'mr' ? 'font-bold text-primary-fixed bg-primary-container' : 'text-on-primary hover:text-primary-fixed'}`}
                  type="button"
                >
                  मराठी
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Logo & Navigation Bar */}
        <div className="h-16 sm:h-20 max-w-7xl mx-auto px-3 sm:px-margin flex items-center justify-between gap-space-md">
          <Link to="/" className="flex items-center gap-2 sm:gap-space-md text-left min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded bg-primary-container flex items-center justify-center text-primary-fixed font-bold text-lg sm:text-xl shadow-sm shrink-0">
              <span className="material-symbols-outlined text-xl sm:text-2xl">signpost</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:font-headline-md sm:text-headline-md font-bold tracking-tight text-primary uppercase truncate">
                  NAGAR CONNECT
                </span>
                <span className="bg-surface-container-high text-on-primary-fixed-variant px-1.5 py-0.2 rounded text-[10px] font-bold tracking-wide hidden lg:inline">
                  MBMC CIVIC
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant font-medium hidden sm:inline truncate">
                मिरा-भाईंदर महानगरपालिका नागरी समस्या निवारण
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-space-xs">
            <Link to="/" className={navLinkClass('/')}>
              Home
            </Link>
            <Link to="/report" className={navLinkClass('/report')}>
              Report an Issue
            </Link>
            <Link to="/track" className={navLinkClass('/track')}>
              Track Complaint
            </Link>
            <Link to="/road-safety-map" className={navLinkClass('/road-safety-map')}>
              Road Safety
            </Link>
            <Link to="/admin" className={navLinkClass('/admin')}>
              Authority Dashboard
            </Link>
            <Link to="/about" className={navLinkClass('/about')}>
              About & Initiative
            </Link>
          </nav>

          {/* Desktop Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-space-md">
            <Link
              to="/report"
              className="hidden sm:inline-flex items-center gap-space-xs bg-primary text-on-primary px-3 sm:px-space-md py-2 rounded font-label-lg text-xs sm:text-label-lg hover:bg-secondary transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-base sm:text-title-md">report_problem</span>
              <span>File Grievance</span>
            </Link>

            {/* User Session Profile / Sign In */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2 bg-surface-container-low px-2.5 py-1.5 rounded-xl border border-outline-variant/30">
                <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0">
                  {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="font-bold text-xs text-primary leading-tight truncate max-w-[120px]">
                    {user.full_name || user.email?.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-secondary font-semibold uppercase tracking-wider">
                    {role.replace('_', ' ')}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  title="Logout session"
                  className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-primary font-bold px-3.5 py-2 rounded-xl text-xs border border-outline-variant/40 transition-colors shadow-2xs min-h-[38px]"
              >
                <span className="material-symbols-outlined text-base">login</span>
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-primary hover:bg-surface-container focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Demonstration Notice Strip (Hidden on mobile phones to save vertical space) */}
        <div className="hidden md:block bg-surface-container-low px-margin py-1 text-center border-t border-b border-surface-container text-xs text-on-surface-variant">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-secondary">info</span>
            <span>
              Official Instance: MBMC Smart City Mission Framework. Road emergencies, dial Ward Helpline 1800-22-3844.
            </span>
          </div>
        </div>
      </header>

      {/* ===================== MOBILE SLIDE-OUT DRAWER ===================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* Backdrop Scrim */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-surface-container-lowest shadow-2xl p-5 flex flex-col justify-between overflow-y-auto z-50">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">signpost</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-sm uppercase">NAGAR CONNECT</h3>
                    <p className="text-[10px] text-on-surface-variant">MBMC Civic Portal</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLinkClass('/')}
                >
                  <span className="material-symbols-outlined text-xl">home</span>
                  <span>Home</span>
                </Link>
                <Link
                  to="/report"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLinkClass('/report')}
                >
                  <span className="material-symbols-outlined text-xl">add_a_photo</span>
                  <span>Report Road Issue</span>
                </Link>
                <Link
                  to="/track"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLinkClass('/track')}
                >
                  <span className="material-symbols-outlined text-xl">manage_search</span>
                  <span>Track Complaint</span>
                </Link>
                <Link
                  to="/road-safety-map"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLinkClass('/road-safety-map')}
                >
                  <span className="material-symbols-outlined text-xl">map</span>
                  <span>Road Safety Map</span>
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLinkClass('/admin')}
                >
                  <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                  <span>Authority Dashboard</span>
                </Link>
                <Link
                  to="/field"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLinkClass('/field')}
                >
                  <span className="material-symbols-outlined text-xl">engineering</span>
                  <span>Field Worker QRT</span>
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLinkClass('/about')}
                >
                  <span className="material-symbols-outlined text-xl">info</span>
                  <span>About & Initiative</span>
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLinkClass('/contact')}
                >
                  <span className="material-symbols-outlined text-xl">contacts</span>
                  <span>Helpline & Wards</span>
                </Link>
              </nav>

              {/* Mobile User Profile / Sign In Link */}
              {user ? (
                <div className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between border border-surface-container">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                      {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-primary truncate max-w-[150px]">{user.full_name || user.email}</p>
                      <span className="text-[10px] text-secondary uppercase font-semibold">{role.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="p-1.5 text-error hover:bg-error-container/30 rounded-lg text-xs flex items-center gap-1 font-bold"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 rounded-xl text-xs font-bold shadow-sm min-h-[42px]"
                >
                  <span className="material-symbols-outlined text-base">login</span>
                  <span>Sign In / Select Portal Role</span>
                </Link>
              )}

              {/* Official App Download (APK) */}
              <a
                href="/NagarConnect.apk"
                download="NagarConnect.apk"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm border border-white/20"
              >
                <span className="material-symbols-outlined text-base">android</span>
                <span>Download Android App (APK 3.7MB)</span>
              </a>

              {/* Emergency Hotline Button */}
              <a
                href="tel:1800223844"
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">call</span>
                <span>Dial Toll-Free: 1800-22-3844</span>
              </a>
            </div>

            {/* Drawer Bottom Session Actions */}
            <div className="pt-4 border-t border-surface-container">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-primary truncate">{user.email}</span>
                    <span className="text-[10px] text-on-surface-variant">Active Session</span>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 text-error hover:bg-error-container/20 rounded-lg"
                    title="Logout"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 rounded-xl text-xs font-bold shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">login</span>
                  <span>Citizen / Officer Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================== MAIN OUTLET ===================== */}
      {/* Responsive padding: pt-20 on mobile, pt-32 on desktop, pb-20 on mobile for sticky bottom bar */}
      <main className="w-full pt-20 sm:pt-28 md:pt-32 pb-20 md:pb-0 bg-surface flex-1">
        <Outlet />
      </main>

      {/* ===================== MOBILE PHONE STICKY BOTTOM NAV BAR ===================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/30 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] flex items-center justify-around h-16 px-1">
        <Link to="/" className={bottomNavClass('/')}>
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        <Link to="/track" className={bottomNavClass('/track')}>
          <span className="material-symbols-outlined text-2xl">manage_search</span>
          <span className="text-[10px] mt-0.5">Track</span>
        </Link>

        {/* Elevated Center Action Button for Report */}
        <Link
          to="/report"
          className="relative -top-3 flex flex-col items-center justify-center"
        >
          <div className="w-13 h-13 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg ring-4 ring-surface-container-lowest hover:bg-secondary transition-all">
            <span className="material-symbols-outlined text-2xl">add_a_photo</span>
          </div>
          <span className="text-[10px] font-bold text-primary mt-0.5">Report</span>
        </Link>

        <Link to="/road-safety-map" className={bottomNavClass('/road-safety-map')}>
          <span className="material-symbols-outlined text-2xl">map</span>
          <span className="text-[10px] mt-0.5">Safety Map</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1.5 text-on-surface-variant hover:text-on-surface focus:outline-none"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
          <span className="text-[10px] mt-0.5">Menu</span>
        </button>
      </nav>

      {/* ===================== MUNICIPAL AUTHORITY FOOTER ===================== */}
      <footer className="w-full bg-primary text-on-primary mt-space-2xl pt-space-xl sm:pt-space-2xl pb-24 md:pb-space-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-margin">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-space-xl">
            {/* Column 1: MBMC Brand */}
            <div className="space-y-space-sm sm:space-y-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="font-headline-md text-xl sm:text-headline-md font-bold uppercase tracking-tight text-on-primary">
                  NAGAR CONNECT
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-surface-variant leading-relaxed">
                Official Grievance Redressal and Urban Infrastructure Monitoring Portal under the jurisdiction of Mira-Bhayandar Municipal Corporation (MBMC), Government of Maharashtra.
              </p>
              <div className="flex items-start gap-space-xs font-label-sm text-label-sm text-surface-variant">
                <span className="material-symbols-outlined text-title-md text-primary-fixed mt-0.5 shrink-0">location_on</span>
                <span>Chhatrapati Shivaji Maharaj Marg, Bhayandar West, Thane, 401101</span>
              </div>
            </div>

            {/* Column 2: Citizen Services */}
            <div className="space-y-space-sm">
              <h3 className="font-title-md text-title-md text-primary-fixed uppercase tracking-wider font-semibold">
                Citizen Services
              </h3>
              <ul className="space-y-space-xs font-body-sm text-body-sm text-surface-variant">
                <li>
                  <Link to="/report" className="hover:text-on-primary hover:underline">
                    Report Road Pothole / Crater
                  </Link>
                </li>
                <li>
                  <Link to="/track" className="hover:text-on-primary hover:underline">
                    Live Docket & Ward Status
                  </Link>
                </li>
                <li>
                  <Link to="/road-safety-map" className="hover:text-on-primary hover:underline">
                    Municipal Road Quality Index
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-on-primary hover:underline">
                    MBMC Ward Directory & Engineers
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-on-primary hover:underline">
                    Citizen Charter & SLA Timelines
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Administrative & RTI */}
            <div className="space-y-space-sm">
              <h3 className="font-title-md text-title-md text-primary-fixed uppercase tracking-wider font-semibold">
                Administrative & RTI
              </h3>
              <ul className="space-y-space-xs font-body-sm text-body-sm text-surface-variant">
                <li>
                  <Link to="/admin" className="hover:text-on-primary hover:underline">
                    Engineer Dispatch & Resolution Log
                  </Link>
                </li>
                <li>
                  <Link to="/field" className="hover:text-on-primary hover:underline">
                    Field Worker Inspection Console
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-on-primary hover:underline">
                    Right to Information (RTI) Cell
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-on-primary hover:underline">
                    Maharashtra Public Records Act
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-on-primary hover:underline">
                    Disaster Management Cell MBMC
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Emergency Contacts */}
            <div className="space-y-space-sm">
              <h3 className="font-title-md text-title-md text-primary-fixed uppercase tracking-wider font-semibold">
                Emergency Ward Contacts
              </h3>
              <div className="p-space-md bg-primary-container rounded space-y-space-xs">
                <p className="font-label-md text-label-md text-primary-fixed uppercase font-semibold">
                  MBMC Disaster Control Room
                </p>
                <p className="font-title-lg text-title-lg font-bold text-on-primary font-code-sm">
                  022-2819-2828
                </p>
                <p className="font-body-sm text-body-sm text-surface-variant">
                  24x7 Road Maintenance Flying Squad
                </p>
                <p className="font-label-sm text-label-sm text-secondary-container">
                  nodal.engineer@mbmc.gov.in
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Hairline & Legal */}
          <div className="pt-space-lg border-t border-primary-container flex flex-col md:flex-row items-center justify-between gap-space-md font-body-sm text-xs sm:text-body-sm text-surface-variant text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-space-md">
              <span>© {new Date().getFullYear()} Mira-Bhayandar Municipal Corporation.</span>
              <span className="opacity-40 hidden sm:inline">•</span>
              <span>NIC Layout Standards Compliant</span>
            </div>
            <div className="flex items-center justify-center gap-space-md font-label-md text-xs sm:text-label-md">
              <Link to="/about" className="hover:text-on-primary hover:underline">
                Privacy
              </Link>
              <Link to="/about" className="hover:text-on-primary hover:underline">
                Terms
              </Link>
              <Link to="/contact" className="hover:text-on-primary hover:underline">
                Help Manual
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
