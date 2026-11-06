import React, { useState, useEffect } from 'react';
import { complaintService, WARDS_LIST } from '../../services/complaintService';
import { RoadMap } from '../../components/maps/RoadMap';

export const RoadIssueMap = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [activeLayer, setActiveLayer] = useState('all');
  const [activeWard, setActiveWard] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sheetDismissed, setSheetDismissed] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await complaintService.getComplaints({
        ward: activeWard,
        category: activeLayer === 'all' ? undefined : activeLayer,
        pageSize: 100,
      });
      setComplaints(data.complaints || []);
      if (data.complaints?.length > 0 && !selectedComplaint) {
        setSelectedComplaint(data.complaints[0]);
      }
    } catch (err) {
      console.error('Failed to load GIS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [activeLayer, activeWard]);

  return (
    <div className="w-full px-3 sm:px-margin py-space-sm sm:py-space-lg space-y-space-md">
      {/* Top Operational Banner & Telemetry Ribbon */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-surface-container-low p-3 sm:p-space-md rounded-xl shadow-sm border border-surface-container">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md shrink-0">
            <span className="material-symbols-outlined text-2xl sm:text-display-lg">satellite_alt</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-headline-md text-primary font-bold tracking-tight">
                GIS Geo-Spatial Cadastre & Rapid Dispatch
              </h1>
              <span className="bg-error-container text-on-error-container text-[10px] sm:text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Active Sector
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Mira-Bhayandar Boundary (W1 to W6) • GPS Telemetry Stream
            </p>
          </div>
        </div>

        {/* Quick Stats Metric Capsule */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <div className="bg-surface-container-lowest px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2 border border-surface-container flex-1 md:flex-initial">
            <span className="material-symbols-outlined text-error text-base">crisis_alert</span>
            <div>
              <span className="text-[10px] text-on-surface-variant block uppercase font-semibold">
                Critical
              </span>
              <span className="text-xs sm:text-sm font-bold text-on-surface font-mono">
                {complaints.filter((c) => c.severity === 'critical').length || 14} Spots
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2 border border-surface-container flex-1 md:flex-initial">
            <span className="material-symbols-outlined text-secondary text-base">local_shipping</span>
            <div>
              <span className="text-[10px] text-on-surface-variant block uppercase font-semibold">
                Patrols
              </span>
              <span className="text-xs sm:text-sm font-bold text-on-surface font-mono">
                8 Teams
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2 border border-surface-container flex-1 md:flex-initial">
            <span className="material-symbols-outlined text-primary text-base">timer</span>
            <div>
              <span className="text-[10px] text-on-surface-variant block uppercase font-semibold">
                Response
              </span>
              <span className="text-xs sm:text-sm font-bold text-on-surface font-mono">
                22.4m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Spatial Map Canvas with Overlays */}
      <div className="relative w-full h-[420px] sm:h-[520px] lg:h-[620px] rounded-xl overflow-hidden shadow-xl border border-surface-container">
        {/* Layer Controls Floating Header */}
        <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-auto">
          {/* Scrollable layer pills on mobile */}
          <div className="flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur-md p-1 rounded-xl shadow-md border border-surface-container overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                activeLayer === 'all' ? 'bg-primary text-on-primary font-bold' : 'hover:bg-surface-container text-on-surface'
              }`}
            >
              All Layers
            </button>
            <button
              onClick={() => setActiveLayer('pothole')}
              className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all flex items-center gap-1 ${
                activeLayer === 'pothole' ? 'bg-primary text-on-primary font-bold' : 'hover:bg-surface-container text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-xs">grain</span>
              <span>Potholes</span>
            </button>
            <button
              onClick={() => setActiveLayer('open_manhole')}
              className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all flex items-center gap-1 ${
                activeLayer === 'open_manhole' ? 'bg-error text-white font-bold' : 'hover:bg-surface-container text-error'
              }`}
            >
              <span className="material-symbols-outlined text-xs">report</span>
              <span>Manholes</span>
            </button>
            <button
              onClick={() => setActiveLayer('incomplete_road_work')}
              className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all flex items-center gap-1 ${
                activeLayer === 'incomplete_road_work' ? 'bg-secondary text-white font-bold' : 'hover:bg-surface-container text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-xs">construction</span>
              <span>Work Zones</span>
            </button>
          </div>

          {/* Ward & Telemetry Badge */}
          <div className="flex items-center justify-between sm:justify-start gap-2 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-surface-container self-start sm:self-auto">
            <select
              value={activeWard}
              onChange={(e) => setActiveWard(e.target.value)}
              className="bg-transparent text-xs font-bold text-primary focus:outline-none cursor-pointer"
            >
              <option value="all">WARD: ALL JURISDICTIONS</option>
              {WARDS_LIST.map((w) => (
                <option key={w.id} value={w.id}>
                  WARD 0{w.ward_number}
                </option>
              ))}
            </select>
            <div className="h-4 w-px bg-outline-variant"></div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs text-on-surface font-bold uppercase">LIVE</span>
          </div>
        </div>

        {/* Map Engine */}
        <RoadMap
          complaints={complaints}
          selectedComplaintId={selectedComplaint?.id}
          onSelectComplaint={(c) => {
            setSelectedComplaint(c);
            setSheetDismissed(false);
          }}
          center={[19.2845, 72.8631]}
          zoom={13}
          className="w-full h-full"
        />

        {/* Floating Selected Defect Inspector Card */}
        {selectedComplaint && !sheetDismissed && (
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-30 pointer-events-auto bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-3 sm:p-space-md shadow-2xl border border-surface-container">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white shadow-sm ${
                    selectedComplaint.severity === 'critical' ? 'bg-error' : 'bg-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">warning</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-primary">
                      #{selectedComplaint.complaint_number}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-bold tracking-wide ${
                        selectedComplaint.severity === 'critical'
                          ? 'bg-error text-white'
                          : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      {selectedComplaint.severity}
                    </span>
                    <span className="bg-surface-container text-on-surface-variant text-[10px] px-1.5 py-0.2 rounded font-semibold truncate max-w-[120px]">
                      {selectedComplaint.ward_name}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-on-surface truncate mt-0.5">
                    {selectedComplaint.issue_title}
                  </h3>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSheetDismissed(true)}
                className="p-1 text-on-surface-variant hover:bg-surface-container rounded-full"
                title="Dismiss inspector card"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <p className="text-[11px] text-on-surface-variant truncate mb-2">
              {selectedComplaint.landmark || selectedComplaint.street_name} • Lat: {selectedComplaint.latitude}° N, Long: {selectedComplaint.longitude}° E
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 border-t border-surface-container">
              <div className="bg-surface-container-low px-2.5 py-1.5 rounded-lg flex items-center justify-between sm:justify-start gap-2">
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold">
                  Nearest QRT:
                </span>
                <span className="text-xs font-bold text-secondary">0.8 km (Beta-4 En Route)</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedComplaint.latitude},${selectedComplaint.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-3 py-2 bg-secondary text-white rounded-lg text-xs font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-1 min-h-[38px]"
                >
                  <span className="material-symbols-outlined text-sm">navigation</span>
                  <span>Navigate</span>
                </a>
                <button
                  type="button"
                  onClick={() => alert(`Rapid dispatch command issued to QRT Unit for #${selectedComplaint.complaint_number}`)}
                  className="flex-1 sm:flex-initial px-3 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-secondary transition-colors min-h-[38px]"
                >
                  Dispatch QRT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
