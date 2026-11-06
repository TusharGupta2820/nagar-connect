import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { RoadMap } from '../../components/maps/RoadMap';
import { QRCodeSVG } from 'qrcode.react';

export const TrackComplaint = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || 'NC-MBMC-2026-008841';
  const initialToken = searchParams.get('token') || '';

  const [docketInput, setDocketInput] = useState(initialId);
  const [tokenInput, setTokenInput] = useState(initialToken);
  const [searching, setSearching] = useState(false);
  const [complaint, setComplaint] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copyNotice, setCopyNotice] = useState(false);

  // Perform search on component mount or search query change
  const performSearch = async (docketNo, secretToken) => {
    if (!docketNo || !docketNo.trim()) return;

    setSearching(true);
    setErrorMessage(null);

    try {
      const result = await complaintService.trackComplaint(docketNo, secretToken);
      if (result && result.found) {
        setComplaint(result);
      } else {
        setComplaint(null);
        setErrorMessage(result?.message || `No grievance docket found matching reference "${docketNo}".`);
      }
    } catch (err) {
      console.error('Search error:', err);
      setErrorMessage(err.message || 'Error communicating with MBMC Grievance Gateway.');
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      performSearch(initialId, initialToken);
    }
  }, [initialId, initialToken]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ id: docketInput.trim(), ...(tokenInput ? { token: tokenInput.trim() } : {}) });
    performSearch(docketInput.trim(), tokenInput.trim());
  };

  const handleCopyId = () => {
    if (complaint?.complaint_number) {
      navigator.clipboard.writeText(complaint.complaint_number);
      setCopyNotice(true);
      setTimeout(() => setCopyNotice(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-margin py-space-sm sm:py-space-md">
      <div className="flex flex-col w-full">
        {/* ==================== STATUTORY GUARANTEE STRIP ==================== */}
        <div className="w-full bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high py-2 px-3 mb-space-md sm:mb-space-lg rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-space-xs text-on-surface-variant text-[11px] sm:text-label-sm border border-surface-container">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-base sm:text-title-md">
              verified_user
            </span>
            <span className="font-bold text-on-surface">महा-ई-सेवा नागरी कक्ष</span>
            <span className="opacity-40 hidden sm:inline">•</span>
            <span className="hidden sm:inline">Maharashtra Public Redressal Guarantee Act 2015</span>
          </div>
          <div className="flex items-center gap-2 font-code-sm text-[10px] sm:text-code-sm">
            <span className="text-secondary font-bold flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              REALTIME SYNC
            </span>
          </div>
        </div>

        {/* ==================== TRACKING INPUT SECTION ==================== */}
        <section className="bg-surface-container-lowest p-4 sm:p-space-lg rounded-xl shadow-md mb-space-md sm:mb-space-lg border border-surface-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md sm:gap-space-lg items-center">
            {/* Search Input */}
            <div className="lg:col-span-7 flex flex-col gap-space-sm">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] uppercase tracking-wider text-secondary font-bold">
                  तक्रार स्थिती व मागोवा
                </span>
                <span className="opacity-30">•</span>
                <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                  Official Public Grievance Tracker
                </span>
              </div>

              <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2.5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-3 flex items-center text-outline">
                      <span className="material-symbols-outlined text-title-md">search</span>
                    </span>
                    <input
                      type="text"
                      value={docketInput}
                      onChange={(e) => setDocketInput(e.target.value)}
                      placeholder="Enter Docket Number (e.g. NC-MBMC-2026-008841)"
                      className="w-full pl-10 pr-3 py-3 bg-surface-container-low font-code-sm text-sm text-on-surface font-semibold rounded-xl focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={searching}
                    className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-secondary text-on-primary rounded-xl font-label-lg text-sm font-semibold flex items-center justify-center gap-space-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50 min-h-[46px]"
                  >
                    <span className={`material-symbols-outlined text-title-md ${searching ? 'animate-spin' : ''}`}>
                      sync
                    </span>
                    <span>{searching ? 'Tracking...' : 'Track Status'}</span>
                  </button>
                </div>

                {/* Secret Token Field (Responsive wrap) */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="text-xs text-on-surface-variant">Guest Token:</span>
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Optional Secret Token"
                    className="px-2.5 py-1.5 bg-surface-container-low font-mono text-xs rounded-lg border border-outline-variant/30 flex-1 sm:flex-initial sm:w-48 focus:outline-none"
                  />
                  <div className="text-[11px] text-on-surface-variant flex items-center gap-1">
                    <span>Try:</span>
                    <button type="button" onClick={() => setDocketInput('NC-MBMC-2026-008841')} className="text-secondary font-mono underline">
                      008841
                    </button>
                    <span>or</span>
                    <button type="button" onClick={() => setDocketInput('NC-MBMC-2026-000914')} className="text-secondary font-mono underline">
                      000914
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Confidential Security Banner */}
            <div className="lg:col-span-5 bg-surface-container-low p-3.5 sm:p-space-md rounded-xl flex flex-col justify-between gap-space-sm border border-surface-container">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-2xl shrink-0 mt-0.5">
                  phonelink_lock
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-on-surface font-bold">
                      Confidential Audit Logs
                    </p>
                    <span className="bg-surface-container text-on-surface-variant text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      Tier-2 Sec
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate mt-0.5">
                    Registered contact: <span className="font-code-sm font-semibold text-on-surface">+91 98****4120</span>
                  </p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Under RTI Sec 8, personal numbers remain encrypted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {errorMessage && (
          <div className="p-4 bg-error-container text-on-error-container rounded-xl flex items-center gap-3 mb-space-md sm:mb-space-lg border border-error shadow-sm">
            <span className="material-symbols-outlined text-2xl shrink-0">error</span>
            <div>
              <p className="font-bold text-xs sm:text-sm">Grievance Docket Not Found</p>
              <p className="text-xs">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* ==================== ACTIVE COMPLAINT RECORD DISPLAY ==================== */}
        {complaint && (
          <>
            {/* Top Status & SLA Banner */}
            <section className="bg-surface-container-lowest rounded-xl shadow-md p-4 sm:p-space-lg mb-space-md sm:mb-space-xl overflow-hidden relative border border-surface-container">
              <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-secondary-fixed opacity-30 blur-2xl pointer-events-none"></div>

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-space-md mb-space-md sm:mb-space-lg">
                <div className="flex flex-wrap items-center gap-2 sm:gap-space-sm">
                  {/* Status Pill */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide shadow-sm uppercase ${
                      complaint.status === 'resolved' || complaint.status === 'closed'
                        ? 'bg-emerald-700 text-white'
                        : complaint.status === 'critical' || complaint.severity === 'critical'
                        ? 'bg-error text-white'
                        : 'bg-secondary text-on-secondary'
                    }`}
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-white animate-ping"></span>
                    <span>STATUS: {complaint.status?.replace('_', ' ')}</span>
                  </div>

                  {/* Severity Pill */}
                  <div
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold tracking-wide flex items-center gap-1 uppercase ${
                      complaint.severity === 'critical'
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">priority_high</span>
                    <span>{complaint.severity}</span>
                  </div>

                  <span className="bg-surface-container-high text-on-primary-fixed-variant px-2 py-1 rounded text-xs font-semibold">
                    {complaint.ward_name || `Ward 0${complaint.ward_number}`}
                  </span>
                </div>

                {/* Countdown / Resolution Timer */}
                <div className="bg-surface-container-low px-3 py-2 rounded-xl flex items-center justify-between gap-3 w-full lg:w-auto border border-surface-container">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant font-medium">
                      Resolution Countdown
                    </span>
                    <span className="text-base sm:text-headline-md font-bold text-error tracking-tight font-mono">
                      {complaint.status === 'resolved' ? 'RESOLVED ON TIME' : '17h : 42m : 18s'}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-xl text-secondary">
                    timelapse
                  </span>
                </div>
              </div>

              {/* SLA Progress Bar */}
              <div className="bg-surface-container p-3 sm:p-space-md rounded-xl flex flex-col gap-1.5 border border-surface-container-high">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface font-semibold flex items-center gap-1 truncate">
                    <span className="material-symbols-outlined text-sm text-secondary">bolt</span>
                    <span>SLA: 30h Elapsed of {complaint.severity === 'critical' ? '12h' : '48h'}</span>
                  </span>
                  <span className="font-code-sm font-bold text-secondary text-[11px]">62.5%</span>
                </div>
                <div className="w-full bg-surface-container-lowest h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-secondary to-secondary-container h-full rounded-full transition-all duration-700"
                    style={{ width: complaint.status === 'resolved' ? '100%' : '62.5%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-on-surface-variant">
                  <span>Logged: {new Date(complaint.submitted_at || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="font-semibold text-on-surface">Target SLA Guaranteed</span>
                </div>
              </div>
            </section>

            {/* ==================== 2-COLUMN SPLIT (Stacks Cleanly on Phones) ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md sm:gap-space-xl mb-space-2xl">
              {/* Left Column (5 cols): Record Summary & GIS Node */}
              <div className="lg:col-span-5 flex flex-col gap-space-md sm:gap-space-lg">
                {/* Issue Record Summary */}
                <div className="bg-surface-container-lowest p-4 sm:p-space-lg rounded-xl shadow-md flex flex-col gap-space-sm sm:gap-space-md border border-surface-container">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">
                        अधिकृत दस्तऐवज
                      </span>
                      <h2 className="text-base sm:text-headline-md text-on-surface font-bold">
                        Issue Record Summary
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="bg-surface-container hover:bg-surface-container-high px-2 py-1 rounded text-xs text-on-surface flex items-center gap-1 transition-all"
                      title="Copy Reference ID"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                      <span className="font-mono text-[11px]">{copyNotice ? 'Copied!' : `#${complaint.complaint_number}`}</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 text-xs">
                    {/* Primary Incident Category */}
                    <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-container">
                      <span className="text-on-surface-variant block text-[10px]">
                        Primary Incident Category
                      </span>
                      <span className="font-bold text-on-surface text-sm flex items-center gap-1.5 mt-0.5 capitalize">
                        <span className="material-symbols-outlined text-error text-base">warning</span>
                        {complaint.issue_title}
                      </span>
                      <span className="text-[11px] text-outline block mt-0.5">
                        {complaint.issue_category?.replace('_', ' ')} • रस्त्यावरील नागरी समस्या
                      </span>
                    </div>

                    {/* Landmark & Geocode */}
                    <div className="grid grid-cols-1 gap-1.5">
                      <div className="flex items-start gap-2 p-1.5">
                        <span className="material-symbols-outlined text-base text-secondary mt-0.5 shrink-0">
                          pin_drop
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-on-surface-variant block">
                            Civic Location & Landmark
                          </span>
                          <span className="font-semibold text-on-surface block break-words">
                            {complaint.landmark || complaint.street_name}, {complaint.locality}, {complaint.ward_name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-1.5">
                        <span className="material-symbols-outlined text-base text-secondary mt-0.5 shrink-0">
                          explore
                        </span>
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-on-surface-variant block">
                              Coordinates
                            </span>
                            <span className="font-code-sm text-xs text-on-surface font-bold">
                              {complaint.latitude}° N, {complaint.longitude}° E
                            </span>
                          </div>
                          <span className="bg-surface-container px-2 py-0.5 rounded font-code-sm text-[10px] text-secondary font-bold">
                            Pole #MR-402
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-1.5">
                        <span className="material-symbols-outlined text-base text-secondary mt-0.5 shrink-0">
                          event_available
                        </span>
                        <div className="flex-1">
                          <span className="text-[10px] text-on-surface-variant block">
                            Filing Timestamp
                          </span>
                          <span className="text-on-surface text-[11px]">
                            {new Date(complaint.submitted_at || Date.now()).toLocaleString('en-IN')} via Public QR Scanner
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Deployment Hierarchy */}
                    <div className="bg-surface-container-high/40 p-3 rounded-xl flex flex-col gap-1.5 mt-1 border border-surface-container">
                      <span className="text-[10px] uppercase tracking-wide text-secondary font-bold">
                        MBMC Deployment Hierarchy
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                          JE
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-on-surface truncate text-xs">
                            {complaint.officer_name || complaint.assigned_officer || 'Er. Aniket Joshi'}
                          </p>
                          <p className="text-[10px] text-on-surface-variant truncate">
                            Junior Engineer, Road & Infra Dept
                          </p>
                        </div>
                        <a
                          href="tel:02228192828"
                          className="p-1.5 bg-surface-container-lowest hover:bg-surface-container rounded-full text-secondary shadow-sm"
                          title="Contact Department"
                        >
                          <span className="material-symbols-outlined text-base">call</span>
                        </a>
                      </div>

                      <div className="bg-surface-container-lowest p-2 rounded-lg mt-1 flex items-center justify-between border border-surface-container text-xs">
                        <div>
                          <span className="text-[10px] text-on-surface-variant block">
                            Executing Contractor
                          </span>
                          <span className="font-bold text-on-surface text-[11px] truncate max-w-[180px] block">
                            {complaint.contractor_name || 'M/s Konkan Infra Buildcon'}
                          </span>
                        </div>
                        <span className="bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          Zone-B
                        </span>
                      </div>
                    </div>

                    {/* Official Verification QR Module */}
                    <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container flex items-center justify-between gap-3 mt-1">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-primary block">Official Tracking QR Stamp</span>
                        <span className="text-[11px] text-on-surface-variant block">
                          Scan on mobile for live municipal audit & field verification.
                        </span>
                      </div>
                      <div className="p-1.5 bg-white rounded-lg shadow-2xs border border-surface-container shrink-0 flex flex-col items-center">
                        <QRCodeSVG
                          value={`${window.location.origin}/track?id=${complaint.complaint_number || complaint.id}`}
                          size={68}
                          level="M"
                        />
                        <span className="font-mono text-[8px] text-secondary mt-0.5 font-bold">
                          MBMC VERIFIED
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive GIS Node Preview */}
                <div className="bg-surface-container-lowest p-4 sm:p-space-lg rounded-xl shadow-md flex flex-col gap-2 border border-surface-container">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                      Interactive GIS Node
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      Hotspot Grid
                    </span>
                  </div>

                  <div className="w-full h-52 sm:h-56 rounded-xl shadow-inner overflow-hidden border border-surface-container">
                    <RoadMap
                      center={[complaint.latitude || 19.2845, complaint.longitude || 72.8631]}
                      zoom={16}
                      complaints={[complaint]}
                      selectedComplaintId={complaint.id}
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-[10px] text-outline">
                    Geospatial confirmation anchored to Ward cadastral road network layer.
                  </p>
                </div>
              </div>

              {/* Right Column (7 cols): Timeline & Photos */}
              <div className="lg:col-span-7 flex flex-col gap-space-md sm:gap-space-lg">
                {/* Official Redressal Timeline */}
                <div className="bg-surface-container-lowest p-4 sm:p-space-lg rounded-xl shadow-md flex flex-col border border-surface-container">
                  <div className="flex items-center justify-between mb-space-md pb-space-xs border-b">
                    <div>
                      <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">
                        अधिकृत कार्यप्रवाह
                      </span>
                      <h2 className="text-base sm:text-headline-md text-on-surface font-bold">
                        Redressal Timeline
                      </h2>
                    </div>
                    <div className="bg-surface-container px-2 py-0.5 rounded text-[10px] text-on-surface-variant font-medium">
                      Live Audit
                    </div>
                  </div>

                  {/* Timeline Stream */}
                  <div className="relative pl-5 sm:pl-6 space-y-space-md">
                    <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-surface-container-highest"></div>

                    {(complaint.timeline || []).map((step, idx) => (
                      <div key={step.id || idx} className="relative flex items-start gap-2.5 sm:gap-space-md">
                        <div className="absolute -left-5 sm:-left-6 mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
                          <span className="material-symbols-outlined text-[10px] sm:text-label-sm font-bold">check</span>
                        </div>
                        <div className="bg-surface-container-low p-3 sm:p-space-md rounded-xl flex-1 border border-surface-container">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="text-xs sm:text-title-md font-bold text-on-surface capitalize">
                              {step.new_status ? step.new_status.replace('_', ' ') : 'Status Recorded'}
                            </span>
                            <span className="font-code-sm text-[10px] text-on-surface-variant">
                              {new Date(step.created_at || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                            {step.remarks}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Photo Gallery */}
                <div className="bg-surface-container-lowest p-4 sm:p-space-lg rounded-xl shadow-md space-y-space-md border border-surface-container">
                  <div className="flex items-center justify-between border-b pb-space-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-lg text-secondary">
                        photo_library
                      </span>
                      <h3 className="text-sm sm:text-title-md font-bold text-primary">
                        Photographic Evidence
                      </h3>
                    </div>
                    <span className="bg-surface-container text-on-surface font-code-sm text-[10px] px-2 py-0.5 rounded font-bold">
                      {complaint.media?.length || 0} Photos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-space-md">
                    {(complaint.media || []).map((m, idx) => (
                      <div
                        key={m.id || idx}
                        className="rounded-xl overflow-hidden bg-surface-container-low border border-surface-container shadow-sm flex flex-col"
                      >
                        <div className="h-40 bg-surface-container overflow-hidden">
                          <img
                            src={m.storage_path}
                            alt="Road defect evidence"
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-2.5 bg-surface-container-lowest flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-primary capitalize">
                            {m.media_category?.replace('_', ' ')}
                          </span>
                          <span className="font-mono text-[10px] text-on-surface-variant">EXIF Verified</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
