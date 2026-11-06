import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { complaintService, DEPARTMENTS_LIST } from '../../services/complaintService';
import { RoadMap } from '../../components/maps/RoadMap';

export const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [assignDept, setAssignDept] = useState(DEPARTMENTS_LIST[0].id);
  const [assignNotes, setAssignNotes] = useState('');

  const loadComplaint = async () => {
    setLoading(true);
    try {
      const data = await complaintService.getComplaintById(id);
      setComplaint(data);
    } catch (err) {
      console.error('Failed to load complaint:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    if (!complaint) return;
    setStatusUpdating(true);
    try {
      await complaintService.updateStatus(complaint.id, newStatus, remarks || `Status transitioned to ${newStatus}`);
      setRemarks('');
      await loadComplaint();
      alert(`Status updated to ${newStatus}`);
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!complaint) return;
    try {
      await complaintService.assignComplaint(
        complaint.id,
        assignDept,
        '00000000-0000-4000-a000-000000000002',
        assignNotes
      );
      setAssignNotes('');
      await loadComplaint();
      alert('Complaint assigned successfully!');
    } catch (err) {
      alert(`Assignment failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-8 text-center text-sm text-on-surface-variant">
        Loading Docket #{id}...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="w-full p-8 text-center space-y-4">
        <p className="text-sm text-error font-bold">Complaint #{id} not found.</p>
        <Link to="/admin/complaints" className="px-4 py-2 bg-primary text-white rounded text-xs font-bold">
          Return to Queue
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-3 sm:px-margin py-4 sm:py-space-lg space-y-space-md sm:space-y-space-lg max-w-6xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-space-xs sm:pb-space-sm">
        <div className="flex items-center gap-2 text-xs">
          <Link to="/admin/complaints" className="text-secondary hover:underline font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Queue</span>
          </Link>
          <span className="opacity-40">/</span>
          <span className="font-mono font-bold text-primary truncate max-w-[150px]">{complaint.complaint_number}</span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
              complaint.status === 'resolved'
                ? 'bg-emerald-100 text-emerald-900'
                : complaint.status === 'critical' || complaint.severity === 'critical'
                ? 'bg-error text-white'
                : 'bg-primary text-white'
            }`}
          >
            {complaint.status?.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md sm:gap-space-lg">
        {/* Left Column (8 cols): Details, Media, Map */}
        <div className="lg:col-span-8 space-y-space-md sm:space-y-space-lg">
          {/* Card 1: Issue Overview */}
          <div className="bg-surface-container-lowest p-4 sm:p-space-lg rounded-2xl shadow-sm border border-surface-container space-y-space-sm sm:space-y-space-md">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] sm:text-xs uppercase font-bold text-secondary tracking-wider">
                  {complaint.issue_category?.replace('_', ' ')}
                </span>
                <h1 className="text-base sm:text-xl font-bold text-primary mt-0.5">{complaint.issue_title}</h1>
              </div>
              <span
                className={`text-[10px] sm:text-xs font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                  complaint.severity === 'critical' ? 'bg-error text-white' : 'bg-amber-100 text-amber-900'
                }`}
              >
                {complaint.severity} Priority
              </span>
            </div>

            <p className="text-xs sm:text-sm text-on-surface leading-relaxed bg-surface-container-low p-3 sm:p-space-md rounded-xl border border-surface-container">
              {complaint.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-space-sm text-xs">
              <div className="bg-surface-container-low p-2 rounded-lg">
                <span className="text-on-surface-variant block text-[10px]">Ward:</span>
                <span className="font-bold text-primary truncate block">{complaint.ward_name}</span>
              </div>
              <div className="bg-surface-container-low p-2 rounded-lg">
                <span className="text-on-surface-variant block text-[10px]">Street / Area:</span>
                <span className="font-bold text-primary truncate block">{complaint.street_name || complaint.locality}</span>
              </div>
              <div className="bg-surface-container-low p-2 rounded-lg">
                <span className="text-on-surface-variant block text-[10px]">Landmark:</span>
                <span className="font-bold text-primary truncate block">{complaint.landmark || 'None'}</span>
              </div>
              <div className="bg-surface-container-low p-2 rounded-lg">
                <span className="text-on-surface-variant block text-[10px]">Coordinates:</span>
                <span className="font-mono text-secondary font-bold text-[11px] truncate block">
                  {complaint.latitude}° N, {complaint.longitude}° E
                </span>
              </div>
              <div className="bg-surface-container-low p-2 rounded-lg">
                <span className="text-on-surface-variant block text-[10px]">Unit:</span>
                <span className="font-bold text-primary truncate block">{complaint.department_name || 'Unassigned'}</span>
              </div>
              <div className="bg-surface-container-low p-2 rounded-lg">
                <span className="text-on-surface-variant block text-[10px]">SLA:</span>
                <span className="font-bold text-secondary">{complaint.sla_hours || 48} Hours</span>
              </div>
            </div>
          </div>

          {/* Card 2: Attached Photographic Evidence */}
          <div className="bg-surface-container-lowest p-4 sm:p-space-lg rounded-2xl shadow-sm border border-surface-container space-y-space-sm">
            <h2 className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide">
              Photographic Evidence ({complaint.media?.length || 0})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-space-md">
              {(complaint.media || []).map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="rounded-xl overflow-hidden bg-surface-container border border-surface-container shadow-sm flex flex-col"
                >
                  <div className="h-44 sm:h-48 overflow-hidden bg-black/10">
                    <img
                      src={m.storage_path}
                      alt="Defect Evidence"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-2.5 bg-surface-container-lowest flex items-center justify-between text-xs">
                    <span className="font-semibold text-primary capitalize">
                      {m.media_category?.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-on-surface-variant text-[10px]">EXIF Matched</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Interactive Location Map */}
          <div className="bg-surface-container-lowest p-4 sm:p-space-lg rounded-2xl shadow-sm border border-surface-container space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide">
                Geospatial Cadastre Point
              </h2>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${complaint.latitude},${complaint.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-secondary font-bold hover:underline flex items-center gap-1"
              >
                <span>Navigate</span>
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>

            <div className="w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-surface-container">
              <RoadMap
                center={[complaint.latitude || 19.2845, complaint.longitude || 72.8631]}
                zoom={16}
                complaints={[complaint]}
                selectedComplaintId={complaint.id}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Administrative Controls & Timeline */}
        <div className="lg:col-span-4 space-y-space-md sm:space-y-space-lg">
          {/* Action Card: Update Status */}
          <div className="bg-surface-container-lowest p-4 sm:p-space-md rounded-2xl shadow-sm border border-surface-container space-y-2.5">
            <h3 className="font-bold text-xs sm:text-sm text-primary uppercase tracking-wide">
              Manage Status & Verification
            </h3>

            <div className="space-y-1">
              <label className="text-[11px] text-on-surface-variant block font-medium">Audit Remarks:</label>
              <textarea
                rows="2"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Notes on inspection, verification, or closure..."
                className="w-full p-2.5 bg-surface-container-low text-xs rounded-xl border border-outline-variant/40 focus:outline-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                disabled={statusUpdating}
                onClick={() => handleUpdateStatus('under_verification')}
                className="p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors min-h-[42px]"
              >
                Verify
              </button>
              <button
                type="button"
                disabled={statusUpdating}
                onClick={() => handleUpdateStatus('in_progress')}
                className="p-2.5 bg-secondary hover:bg-primary text-white rounded-xl text-xs font-bold transition-colors min-h-[42px]"
              >
                Start Work
              </button>
              <button
                type="button"
                disabled={statusUpdating}
                onClick={() => handleUpdateStatus('resolved')}
                className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors min-h-[42px]"
              >
                Resolve
              </button>
              <button
                type="button"
                disabled={statusUpdating}
                onClick={() => handleUpdateStatus('closed')}
                className="p-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-bold transition-colors min-h-[42px]"
              >
                Close Ticket
              </button>
            </div>
          </div>

          {/* Action Card: Assign Department */}
          <form onSubmit={handleAssign} className="bg-surface-container-lowest p-4 sm:p-space-md rounded-2xl shadow-sm border border-surface-container space-y-2.5 text-xs">
            <h3 className="font-bold text-xs sm:text-sm text-primary uppercase tracking-wide">
              Department Assignment
            </h3>

            <div className="space-y-1">
              <label className="text-[11px] text-on-surface-variant block font-medium">Department:</label>
              <select
                value={assignDept}
                onChange={(e) => setAssignDept(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-semibold min-h-[42px]"
              >
                {DEPARTMENTS_LIST.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.department_name} ({d.department_code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-on-surface-variant block font-medium">Special Instructions:</label>
              <textarea
                rows="2"
                value={assignNotes}
                onChange={(e) => setAssignNotes(e.target.value)}
                placeholder="e.g. Expedite paver block compaction..."
                className="w-full p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 text-xs"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-secondary transition-colors shadow-sm min-h-[42px]"
            >
              Update Assignment
            </button>
          </form>

          {/* Timeline Feed */}
          <div className="bg-surface-container-lowest p-4 sm:p-space-md rounded-2xl shadow-sm border border-surface-container space-y-2">
            <h3 className="font-bold text-xs sm:text-sm text-primary uppercase tracking-wide">
              Status Audit History
            </h3>

            <div className="relative pl-4 space-y-3 pt-1">
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-surface-container"></div>
              {(complaint.timeline || []).map((step, idx) => (
                <div key={step.id || idx} className="relative text-xs">
                  <div className="absolute -left-4 mt-1 w-2.5 h-2.5 rounded-full bg-secondary"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface capitalize">
                      {step.new_status ? step.new_status.replace('_', ' ') : 'Created'}
                    </span>
                    <span className="font-mono text-[10px] text-on-surface-variant">
                      {new Date(step.created_at || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{step.remarks}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
