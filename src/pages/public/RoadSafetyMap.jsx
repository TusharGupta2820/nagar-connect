import React, { useState, useEffect } from 'react';
import { complaintService, WARDS_LIST } from '../../services/complaintService';
import { RoadMap } from '../../components/maps/RoadMap';

export const RoadSafetyMap = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [sheetDismissed, setSheetDismissed] = useState(false);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const data = await complaintService.getComplaints({
        ward: selectedWard,
        severity: selectedSeverity,
        category: selectedCategory,
        pageSize: 100,
      });
      setComplaints(data.complaints || []);
      if (data.complaints && data.complaints.length > 0 && !selectedComplaint) {
        setSelectedComplaint(data.complaints[0]);
      }
    } catch (err) {
      console.error('Failed to load map data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [selectedWard, selectedSeverity, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-margin py-space-sm sm:py-space-md">
      <div className="flex flex-col w-full space-y-space-sm sm:space-y-space-md">
        {/* Banner */}
        <div className="bg-surface-container-low p-3 sm:p-space-md rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md shrink-0">
              <span className="material-symbols-outlined text-2xl sm:text-display-lg">map</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-headline-md text-primary font-bold">
                  MBMC GIS Road Cadastre & Safety Map
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                  Live Stream
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Real-time mapping of reported potholes, open manholes, paver collapses, and ongoing road repairs.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="bg-surface-container-lowest px-3 py-1 rounded-lg border border-surface-container text-center flex-1 md:flex-initial">
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Active Hazards</span>
              <p className="text-base sm:text-lg font-bold text-primary font-mono">{complaints.length}</p>
            </div>
            <div className="bg-surface-container-lowest px-3 py-1 rounded-lg border border-surface-container text-center flex-1 md:flex-initial">
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Critical</span>
              <p className="text-base sm:text-lg font-bold text-error font-mono">
                {complaints.filter((c) => c.severity === 'critical').length}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-surface-container flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
            {/* Ward Filter */}
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-surface-container-low text-xs font-semibold px-3 py-2.5 rounded-lg border border-outline-variant/40 focus:outline-none min-h-[42px]"
            >
              <option value="all">All Wards (W1 to W6)</option>
              {WARDS_LIST.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.ward_name}
                </option>
              ))}
            </select>

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-surface-container-low text-xs font-semibold px-3 py-2.5 rounded-lg border border-outline-variant/40 focus:outline-none min-h-[42px]"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Hazards</option>
              <option value="high">High Severity</option>
              <option value="medium">Medium</option>
              <option value="low">Low Impact</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-surface-container-low text-xs font-semibold px-3 py-2.5 rounded-lg border border-outline-variant/40 focus:outline-none min-h-[42px]"
            >
              <option value="all">All Hazard Types</option>
              <option value="pothole">Potholes</option>
              <option value="open_manhole">Open Manholes</option>
              <option value="damaged_road">Damaged Roads</option>
              <option value="incomplete_road_work">Incomplete Trenching</option>
            </select>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs justify-start md:justify-end pt-1 md:pt-0">
            <span className="flex items-center gap-1 font-semibold text-error">
              <span className="w-2 h-2 rounded-full bg-error"></span> Critical
            </span>
            <span className="flex items-center gap-1 font-semibold text-[#ea580c]">
              <span className="w-2 h-2 rounded-full bg-[#ea580c]"></span> High
            </span>
            <span className="flex items-center gap-1 font-semibold text-[#ca8a04]">
              <span className="w-2 h-2 rounded-full bg-[#ca8a04]"></span> Medium
            </span>
            <span className="flex items-center gap-1 font-semibold text-secondary">
              <span className="w-2 h-2 rounded-full bg-secondary"></span> Low
            </span>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[580px] rounded-xl overflow-hidden shadow-md border border-surface-container">
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
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-30 bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-3 sm:p-space-md shadow-2xl border border-surface-container">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-sm shrink-0 ${
                      selectedComplaint.severity === 'critical' ? 'bg-error' : 'bg-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {selectedComplaint.issue_category === 'open_manhole' ? 'warning' : 'report'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-code-sm text-xs font-bold text-primary">
                      #{selectedComplaint.complaint_number}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        selectedComplaint.severity === 'critical'
                          ? 'bg-error text-white'
                          : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      {selectedComplaint.severity}
                    </span>
                    <span className="text-[10px] bg-surface-container-high px-1.5 py-0.2 rounded font-semibold text-primary truncate max-w-[120px]">
                      {selectedComplaint.ward_name}
                    </span>
                  </div>
                </div>

                {/* Dismiss button */}
                <button
                  type="button"
                  onClick={() => setSheetDismissed(true)}
                  className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container"
                  title="Minimize card"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <div className="mb-3">
                <h3 className="font-bold text-primary text-xs sm:text-sm truncate">
                  {selectedComplaint.issue_title}
                </h3>
                <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                  {selectedComplaint.landmark || selectedComplaint.street_name} • Lat: {selectedComplaint.latitude}° N, Long: {selectedComplaint.longitude}° E
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedComplaint.latitude},${selectedComplaint.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 bg-secondary text-white text-xs font-semibold rounded-lg hover:bg-primary transition-colors flex items-center justify-center gap-1 min-h-[40px]"
                >
                  <span className="material-symbols-outlined text-sm">navigation</span>
                  <span>Navigate</span>
                </a>
                <button
                  onClick={() => {
                    window.location.href = `/track?id=${selectedComplaint.complaint_number}`;
                  }}
                  className="flex-1 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-secondary transition-colors min-h-[40px]"
                >
                  Status Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
