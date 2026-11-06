import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

export const Home = () => {
  const navigate = useNavigate();
  const [quickTrackId, setQuickTrackId] = useState('');

  const MBMC_POLES = [
    { wardNum: 1, poleId: 'POLE-MBMC-01-042', wardName: 'Ward 01 - Bhayandar (W)', lat: 19.3015, lng: 72.8521, locality: 'Station Road, Bhayandar West', street: 'Station Road' },
    { wardNum: 2, poleId: 'POLE-MBMC-02-108', wardName: 'Ward 02 - Bhayandar (E)', lat: 19.2988, lng: 72.8582, locality: 'Navghar Corridor, Golden Nest', street: 'Navghar Road' },
    { wardNum: 3, poleId: 'POLE-MBMC-03-074', wardName: 'Ward 03 - Shanti Nagar', lat: 19.2882, lng: 72.8599, locality: 'Sector 4, Shanti Nagar', street: 'Main Market Road' },
    { wardNum: 4, poleId: 'POLE-MBMC-04-188', wardName: 'Ward 04 - Beverly Park', lat: 19.2812, lng: 72.8561, locality: 'Beverly Park, Mira Road East', street: 'Kanakia Road' },
    { wardNum: 5, poleId: 'POLE-MBMC-05-019', wardName: 'Ward 05 - Kashimira NH-48', lat: 19.2710, lng: 72.8640, locality: 'Kashimira Highway Junction', street: 'Western Express Highway' },
    { wardNum: 6, poleId: 'POLE-MBMC-06-033', wardName: 'Ward 06 - Ghodbunder', lat: 19.2625, lng: 72.8710, locality: 'Ghodbunder Link Road', street: 'Fountain Junction' },
  ];

  const [selectedPoleIndex, setSelectedPoleIndex] = useState(3); // Default Ward 4
  const activePole = MBMC_POLES[selectedPoleIndex];

  const handleQuickTrack = (e) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      navigate(`/track?id=${encodeURIComponent(quickTrackId.trim())}`);
    }
  };

  const qrReportingUrl = `${window.location.origin}/report?ward=${activePole.wardNum}&pole=${activePole.poleId}&lat=${activePole.lat}&lng=${activePole.lng}&locality=${encodeURIComponent(activePole.locality)}&street=${encodeURIComponent(activePole.street)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-margin py-space-sm sm:py-space-md">
      <div className="flex flex-col w-full space-y-space-xl sm:space-y-space-2xl">
        {/* ==================== HERO SECTION ==================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface-container-lowest to-surface rounded-xl shadow-sm p-4 sm:p-space-lg lg:p-space-2xl border border-surface-container">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-fixed/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-space-md sm:space-y-space-lg">
              <div className="inline-flex items-center gap-space-xs bg-surface-container-high text-primary px-3 py-1 rounded-full shadow-sm max-w-full">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shrink-0"></span>
                <span className="font-label-sm text-[11px] sm:text-label-sm uppercase tracking-wider font-semibold truncate">
                  MBMC • CIVIC GRIEVANCE REDRESSAL
                </span>
              </div>

              <div className="space-y-space-xs sm:space-y-space-sm">
                <h1 className="text-2xl sm:text-4xl lg:text-display-lg text-primary tracking-tight font-bold leading-tight">
                  Better Roads Begin With Your Report.
                </h1>
                <p className="text-sm sm:text-headline-md text-on-surface-variant font-medium">
                  रस्ते दुरुस्तीसाठी नागरिकांचा थेट सहभाग | Direct Citizen Redressal for Wards 1 to 6
                </p>
              </div>

              <p className="text-sm sm:text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Report potholes, damaged roads, open manholes and incomplete road works directly to the concerned municipal authorities. Help create safer, flood-resilient, and better-connected communities across MBMC Wards 1 to 6.
              </p>

              {/* CTAs (Full width on mobile phones) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-space-md pt-space-xs">
                <Link
                  to="/report"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm bg-primary text-on-primary px-6 py-3.5 rounded-xl font-label-lg text-base sm:text-label-lg shadow-md hover:bg-secondary transition-all"
                >
                  <span className="material-symbols-outlined text-title-lg">add_a_photo</span>
                  <span>Report a Road Issue</span>
                </Link>

                <a
                  href="#quick-tracking"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm bg-surface-container-lowest text-primary px-6 py-3.5 rounded-xl font-label-lg text-base sm:text-label-lg shadow-sm hover:bg-surface-container transition-all border border-outline-variant/40"
                >
                  <span className="material-symbols-outlined text-title-lg">manage_search</span>
                  <span>Track Your Docket</span>
                </a>
              </div>

              {/* Live Ticker */}
              <div className="bg-surface-container-lowest/90 backdrop-blur rounded-lg p-2.5 sm:p-space-sm shadow-sm flex items-center gap-2 sm:gap-space-sm border border-surface-container">
                <div className="flex items-center gap-1 px-2 py-0.5 bg-secondary/10 rounded text-secondary font-label-sm text-[10px] sm:text-label-sm font-semibold shrink-0">
                  <span className="material-symbols-outlined text-sm sm:text-body-md animate-spin" style={{ animationDuration: '4s' }}>
                    sync
                  </span>
                  <span>LIVE DISPATCH</span>
                </div>
                <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant truncate">
                  <strong className="text-on-surface">Last resolved:</strong> Pothole repaired at Beverly Park, Ward 4 (42m ago) •{' '}
                  <span className="text-secondary font-medium">SLA: 36h</span>
                </p>
              </div>
            </div>

            {/* Right Column: Interactive QR Showcase */}
            <div className="lg:col-span-5 mt-4 lg:mt-0">
              <div className="bg-surface-container-lowest rounded-xl shadow-md p-4 sm:p-space-lg space-y-space-md border border-surface-container">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-title-lg text-secondary">qr_code_scanner</span>
                    <span className="font-title-md text-sm sm:text-title-md text-primary font-bold">Scan. Report. Track.</span>
                  </div>
                  <span className="bg-surface-container-high text-on-primary-fixed-variant px-1.5 py-0.5 rounded font-code-sm text-[10px] uppercase font-semibold">
                    GIS POLE LOCATOR
                  </span>
                </div>

                {/* Stylized QR Module Display */}
                <div className="bg-surface-container-low rounded-xl p-3 sm:p-space-md flex flex-col sm:flex-row items-center gap-space-md">
                  {/* Real Dynamic QR Code SVG */}
                  <div className="bg-surface-container-lowest p-2.5 rounded-lg shadow-sm shrink-0 flex flex-col items-center border border-surface-container">
                    <QRCodeSVG
                      value={qrReportingUrl}
                      size={116}
                      level="M"
                      includeMargin={false}
                    />
                    <span className="font-mono text-[10px] text-secondary mt-1.5 font-bold tracking-wider">
                      {activePole.poleId}
                    </span>
                  </div>

                  <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1">
                      <span className="inline-block bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px] px-1.5 py-0.2 rounded font-semibold">
                        LIVE MUNICIPAL GIS POLE
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        Ward {activePole.wardNum}
                      </span>
                    </div>
                    <p className="font-title-md text-sm sm:text-title-md font-bold text-primary truncate">
                      {activePole.locality}
                    </p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Scan directly from your mobile camera to auto-fetch GPS coordinates and Ward dispatch queue.
                    </p>
                    <div className="pt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <Link
                        to={`/report?ward=${activePole.wardNum}&pole=${activePole.poleId}&lat=${activePole.lat}&lng=${activePole.lng}&locality=${encodeURIComponent(activePole.locality)}&street=${encodeURIComponent(activePole.street)}`}
                        className="text-secondary font-bold text-xs hover:underline inline-flex items-center gap-1 bg-surface-container-lowest px-2.5 py-1 rounded-md border border-secondary/20 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-xs">qr_code_scanner</span>
                        <span>Test Scan This Pole</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Interactive Ward Coverage Selector Pills */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold block">
                      Select Ward Pole to Preview QR:
                    </span>
                    <span className="text-[10px] text-secondary font-bold">Wards 1 – 6</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {MBMC_POLES.map((pole, idx) => (
                      <button
                        key={pole.poleId}
                        type="button"
                        onClick={() => setSelectedPoleIndex(idx)}
                        className={`px-2 py-1.5 rounded-lg text-left text-[11px] font-medium transition-all border ${
                          selectedPoleIndex === idx
                            ? 'bg-secondary text-on-secondary font-bold border-secondary shadow-xs scale-[1.02]'
                            : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-transparent'
                        }`}
                      >
                        <span className="block truncate">{pole.wardName}</span>
                        <span className="block text-[9px] opacity-80 font-mono">{pole.poleId}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CORE SERVICE CATEGORIES ==================== */}
        <section className="space-y-space-md sm:space-y-space-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-xs sm:gap-space-sm">
            <div>
              <span className="font-label-md text-xs sm:text-label-md uppercase text-secondary font-bold tracking-wider">
                Grievance Classification • नागरी तक्रार प्रकार
              </span>
              <h2 className="text-xl sm:text-headline-lg font-bold text-primary">
                Core Citizen Road Services
              </h2>
            </div>
            <p className="text-xs sm:text-body-md text-on-surface-variant max-w-md">
              Select a category below to launch the pre-configured geo-reporting wizard with municipal SLA guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {/* Card 1: Potholes */}
            <Link
              to="/report?category=pothole"
              className="group bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all p-4 sm:p-space-lg flex flex-col justify-between space-y-space-md border border-surface-container active:scale-[0.99]"
            >
              <div className="space-y-space-md">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl sm:text-display-lg">report</span>
                  </div>
                  <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-label-sm text-[11px] font-semibold uppercase">
                    SLA: 48 Hrs
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-title-lg text-lg text-primary font-bold group-hover:text-secondary transition-colors">
                    Report Potholes
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    खड्डे आणि रस्त्यावरील भेगा
                  </p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Asphalt cracking, crater depth estimation, surface erosion, and urgent two-wheeler skidding hazards.
                  </p>
                </div>
              </div>
              <div className="pt-space-sm border-t border-surface-container-low">
                <div className="flex items-center justify-between font-label-md text-xs sm:text-label-md text-secondary font-semibold">
                  <span>Initiate Report</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 2: Open Manholes */}
            <Link
              to="/report?category=open_manhole"
              className="group bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all p-4 sm:p-space-lg flex flex-col justify-between space-y-space-md relative overflow-hidden border border-surface-container active:scale-[0.99]"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-error"></div>
              <div className="space-y-space-md">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-error-container text-on-error-container flex items-center justify-center group-hover:bg-error group-hover:text-on-error transition-colors">
                    <span className="material-symbols-outlined text-2xl sm:text-display-lg">warning</span>
                  </div>
                  <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded font-label-sm text-[10px] font-bold uppercase animate-pulse">
                    CRITICAL HAZARD
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-title-lg text-lg text-primary font-bold group-hover:text-error transition-colors">
                    Open Manholes
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    उघडी गटारे व मॅनहोल
                  </p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Missing chamber covers, broken slab grates, immediate barricading dispatch, and monsoon flood drain alerts.
                  </p>
                </div>
              </div>
              <div className="pt-space-sm border-t border-surface-container-low">
                <div className="flex items-center justify-between font-label-md text-xs sm:text-label-md text-error font-semibold">
                  <span>Instant Dispatch (12h SLA)</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 3: Damaged Roads */}
            <Link
              to="/report?category=damaged_road"
              className="group bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all p-4 sm:p-space-lg flex flex-col justify-between space-y-space-md border border-surface-container active:scale-[0.99]"
            >
              <div className="space-y-space-md">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl sm:text-display-lg">texture</span>
                  </div>
                  <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-label-sm text-[11px] font-semibold uppercase">
                    SLA: 72 Hrs
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-title-lg text-lg text-primary font-bold group-hover:text-secondary transition-colors">
                    Damaged Roads
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    खचलेले पेव्हर ब्लॉक व रस्ते
                  </p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Paver block subsidence, uneven road gradients, waterlogging depressions, and tar peeling along junctions.
                  </p>
                </div>
              </div>
              <div className="pt-space-sm border-t border-surface-container-low">
                <div className="flex items-center justify-between font-label-md text-xs sm:text-label-md text-secondary font-semibold">
                  <span>Initiate Report</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 4: Incomplete Trenching */}
            <Link
              to="/report?category=incomplete_road_work"
              className="group bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all p-4 sm:p-space-lg flex flex-col justify-between space-y-space-md border border-surface-container active:scale-[0.99]"
            >
              <div className="space-y-space-md">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl sm:text-display-lg">construction</span>
                  </div>
                  <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-label-sm text-[11px] font-semibold uppercase">
                    SLA: 48 Hrs
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-title-lg text-lg text-primary font-bold group-hover:text-secondary transition-colors">
                    Incomplete Road Work
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    अपूर्ण रस्ते कामे व चर
                  </p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Unfilled utility trenches (gas, telecom, MSEB), hazardous road debris, unlevel metal sheeting, and missing warning boards.
                  </p>
                </div>
              </div>
              <div className="pt-space-sm border-t border-surface-container-low">
                <div className="flex items-center justify-between font-label-md text-xs sm:text-label-md text-secondary font-semibold">
                  <span>Initiate Report</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ==================== QUICK TRACKING COMPONENT ==================== */}
        <section id="quick-tracking" className="bg-surface-container-lowest p-4 sm:p-space-lg rounded-xl shadow-md border border-surface-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md sm:gap-space-lg items-center">
            <div className="lg:col-span-7 flex flex-col gap-space-sm">
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary font-bold">
                  तक्रार स्थिती व मागोवा पोर्टल
                </span>
                <span className="opacity-30">•</span>
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                  Instant Grievance Docket Tracker
                </span>
              </div>

              <form onSubmit={handleQuickTrack} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-3 flex items-center text-outline">
                    <span className="material-symbols-outlined text-title-md">search</span>
                  </span>
                  <input
                    type="text"
                    value={quickTrackId}
                    onChange={(e) => setQuickTrackId(e.target.value)}
                    placeholder="Reference Docket (e.g. NC-MBMC-2026-008841)"
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low font-code-sm text-sm text-on-surface font-semibold rounded-xl focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-secondary text-on-primary rounded-xl font-label-lg text-sm font-semibold flex items-center justify-center gap-space-xs transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-title-md">sync</span>
                  <span>Track Status</span>
                </button>
              </form>
              <p className="text-xs text-on-surface-variant flex flex-wrap items-center gap-1">
                <span>Try demo dockets:</span>
                <button type="button" onClick={() => setQuickTrackId('NC-MBMC-2026-008841')} className="font-mono text-secondary underline">
                  008841
                </button>
                <span>or</span>
                <button type="button" onClick={() => setQuickTrackId('NC-MBMC-2026-000914')} className="font-mono text-secondary underline">
                  000914
                </button>
              </p>
            </div>

            <div className="lg:col-span-5 bg-surface-container-low p-4 rounded-xl flex flex-col justify-between gap-space-sm border border-surface-container">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-2xl shrink-0 mt-0.5">phonelink_lock</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-on-surface font-bold">
                      Citizen Confidentiality Protocol
                    </p>
                    <span className="bg-surface-container text-on-surface-variant text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      Sec 8 RTI
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Your personal mobile number and identity remain encrypted at rest. Status history, engineer dispatch logs, and completion photos are publicly visible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 4-STEP CITIZEN FLOW ==================== */}
        <section className="bg-surface-container-low rounded-xl p-4 sm:p-space-xl border border-surface-container">
          <div className="text-center max-w-2xl mx-auto mb-space-lg sm:mb-space-xl space-y-1">
            <span className="font-label-sm text-xs sm:text-label-sm uppercase tracking-wider text-secondary font-bold">
              कार्यपद्धती • Operational Workflow
            </span>
            <h2 className="text-xl sm:text-headline-lg font-bold text-primary">
              How NAGAR CONNECT Resolves Road Grievances
            </h2>
            <p className="text-on-surface-variant text-xs sm:text-sm">
              From mobile camera capture to municipal certification under Maharashtra Public Services Guarantee.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-space-lg">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-primary">Capture & Geotag</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Citizen clicks live site photos. Browser GPS detects latitude & longitude with ±3m accuracy.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-primary">Auto Ward Routing</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                System assigns issue to the respective MBMC Ward Junior Engineer and relevant contractor cell.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-primary">Field Inspection</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                QRT road squad inspects site, deploys safety barricades for manholes, and starts bituminous repairs.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="text-base font-bold text-secondary">Verified Closure</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Engineer uploads resolution proof. Docket is marked resolved and citizen receives update notification.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
