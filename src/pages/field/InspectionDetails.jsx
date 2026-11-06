import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { uploadInspectionEvidence, uploadResolutionEvidence } from '../../services/storageService';
import { RoadMap } from '../../components/maps/RoadMap';

export const InspectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  // Field Inspection Form
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [inspectionResult, setInspectionResult] = useState('verified_defect');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actionTab, setActionTab] = useState('inspect'); // 'inspect' | 'resolve'
  const [uploading, setUploading] = useState(false);
  const [inspectionPhotos, setInspectionPhotos] = useState([]);
  const [resolutionPhotos, setResolutionPhotos] = useState([]);

  const loadData = async () => {
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
    loadData();
  }, [id]);

  const handleInspectionPhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const uploaded = await uploadInspectionEvidence(file, `inspection_${complaint.complaint_number}`);
        setInspectionPhotos((prev) => [...prev, uploaded]);
      }
    } catch (err) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleResolutionPhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const uploaded = await uploadResolutionEvidence(file, `resolution_${complaint.complaint_number}`);
        setResolutionPhotos((prev) => [...prev, uploaded]);
      }
    } catch (err) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveInspection = async (e) => {
    e.preventDefault();
    if (!inspectionNotes.trim()) {
      alert('Please provide inspection notes.');
      return;
    }
    try {
      await complaintService.submitInspection(complaint.id, {
        inspectorId: '00000000-0000-4000-a000-000000000003',
        notes: inspectionNotes,
        result: inspectionResult,
        latitude: complaint.latitude,
        longitude: complaint.longitude,
        media: inspectionPhotos,
      });
      alert('Field inspection recorded successfully!');
      loadData();
    } catch (err) {
      alert(`Failed to save inspection: ${err.message}`);
    }
  };

  const handleCompleteResolution = async (e) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) {
      alert('Please enter completion remarks.');
      return;
    }
    try {
      await complaintService.submitResolution(complaint.id, {
        notes: resolutionNotes,
        media: resolutionPhotos,
      });
      alert('Resolution certified & submitted to Executive Engineer!');
      navigate('/field');
    } catch (err) {
      alert(`Failed to mark resolution: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs">Loading task #{id}...</div>;
  }

  if (!complaint) {
    return <div className="p-8 text-center text-xs text-error font-bold">Complaint not found.</div>;
  }

  return (
    <div className="space-y-space-md py-2 sm:py-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-container pb-2">
        <Link to="/field" className="text-xs text-secondary font-bold hover:underline flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Back to Tasks</span>
        </Link>
        <span className="font-mono text-xs font-bold text-primary">
          #{complaint.complaint_number}
        </span>
      </div>

      {/* Task Summary Card */}
      <div className="bg-surface-container-lowest p-4 sm:p-space-md rounded-2xl shadow-sm border border-surface-container space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h1 className="font-bold text-sm sm:text-base text-primary">{complaint.issue_title}</h1>
          <span
            className={`text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
              complaint.severity === 'critical' ? 'bg-error text-white' : 'bg-amber-100 text-amber-900'
            }`}
          >
            {complaint.severity} Priority
          </span>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          {complaint.description}
        </p>

        <div className="p-2.5 bg-surface-container-low rounded-xl text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Ward:</span>
            <span className="font-bold text-primary">{complaint.ward_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Spot Landmark:</span>
            <span className="font-bold text-primary truncate max-w-[180px]">{complaint.landmark || complaint.street_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Geocode:</span>
            <span className="font-mono text-secondary font-bold text-[11px]">
              {complaint.latitude}° N, {complaint.longitude}° E
            </span>
          </div>
        </div>

        {/* Turn-by-Turn GPS Navigation CTA */}
        <div className="pt-1">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${complaint.latitude},${complaint.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 bg-secondary text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-primary transition-colors shadow-sm min-h-[46px]"
          >
            <span className="material-symbols-outlined text-sm">navigation</span>
            <span>Launch GPS Navigation to Spot</span>
          </a>
        </div>
      </div>

      {/* Map Node */}
      <div className="w-full h-44 sm:h-48 rounded-xl overflow-hidden border border-surface-container shadow-sm">
        <RoadMap
          center={[complaint.latitude || 19.2845, complaint.longitude || 72.8631]}
          zoom={16}
          complaints={[complaint]}
          selectedComplaintId={complaint.id}
          className="w-full h-full"
        />
      </div>

      {/* Citizen Evidence Review */}
      <div className="bg-surface-container-lowest p-4 sm:p-space-md rounded-2xl shadow-sm border border-surface-container space-y-2">
        <h3 className="font-bold text-primary text-xs uppercase tracking-wide">
          Citizen Submitted Evidence ({complaint.media?.length || 0})
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {(complaint.media || []).map((m, idx) => (
            <div key={m.id || idx} className="rounded-xl overflow-hidden h-28 sm:h-32 bg-surface-container">
              <img src={m.storage_path} alt="Evidence" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Action Tabs: Conduct Inspection OR Complete Work */}
      <div className="bg-surface-container-lowest p-4 sm:p-space-md rounded-2xl shadow-md border border-surface-container space-y-3">
        <div className="flex border-b border-surface-container">
          <button
            type="button"
            onClick={() => setActionTab('inspect')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors min-h-[44px] ${
              actionTab === 'inspect'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant'
            }`}
          >
            1. Field Inspection
          </button>
          <button
            type="button"
            onClick={() => setActionTab('resolve')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors min-h-[44px] ${
              actionTab === 'resolve'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-on-surface-variant'
            }`}
          >
            2. Resolution Proof
          </button>
        </div>

        {actionTab === 'inspect' && (
          <form onSubmit={handleSaveInspection} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-primary block mb-1">Inspection Finding *</label>
              <select
                value={inspectionResult}
                onChange={(e) => setInspectionResult(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-semibold min-h-[42px]"
              >
                <option value="verified_defect">Defect Verified On-Site (Active Hazard)</option>
                <option value="dispatched_barricade">Safety Barricades Placed Around Hazard</option>
                <option value="utility_excavation">Confirmed Utility Excavation Trench</option>
                <option value="false_alarm">No Hazard Found / Resolved Previously</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-primary block mb-1">Inspection Measurements & Notes *</label>
              <textarea
                rows="3"
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                placeholder="e.g. Crater depth 14cm, diameter 1.2m across middle lane. Deployed 2 safety drums and cautionary ribbon."
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-base sm:text-xs"
                required
              ></textarea>
            </div>

            {/* Upload Inspection Photo (Supports native camera) */}
            <div>
              <label className="font-bold text-primary block mb-1">Capture Inspection Photo (Geotagged)</label>
              <label className="p-3 bg-surface-container-low rounded-xl border border-dashed border-outline-variant flex items-center justify-center gap-2 cursor-pointer hover:bg-surface-container min-h-[48px]">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  capture="environment"
                  onChange={handleInspectionPhotoUpload}
                  className="sr-only"
                />
                <span className="material-symbols-outlined text-secondary text-lg">photo_camera</span>
                <span className="font-semibold text-secondary">
                  {uploading ? 'Uploading...' : 'Take Camera Photo on Site'}
                </span>
              </label>

              {inspectionPhotos.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {inspectionPhotos.map((p, i) => (
                    <img key={i} src={p.url} alt="Insp" className="w-16 h-16 rounded-lg object-cover border" />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary transition-colors shadow-sm min-h-[46px]"
            >
              Record Field Inspection
            </button>
          </form>
        )}

        {actionTab === 'resolve' && (
          <form onSubmit={handleCompleteResolution} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-primary block mb-1">Work Completion Summary *</label>
              <textarea
                rows="3"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="e.g. Bituminous cold-mix patch filled and compacted with heavy roller. Traffic lane restored safely."
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-base sm:text-xs"
                required
              ></textarea>
            </div>

            {/* Upload Resolution Photo */}
            <div>
              <label className="font-bold text-primary block mb-1">Capture Resolution Proof Photo *</label>
              <label className="p-3 bg-emerald-50 rounded-xl border border-dashed border-emerald-300 flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-100 min-h-[48px]">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  capture="environment"
                  onChange={handleResolutionPhotoUpload}
                  className="sr-only"
                />
                <span className="material-symbols-outlined text-emerald-800 text-lg">verified</span>
                <span className="font-bold text-emerald-900">
                  {uploading ? 'Uploading...' : 'Take Live Resolution Photo'}
                </span>
              </label>

              {resolutionPhotos.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {resolutionPhotos.map((p, i) => (
                    <img key={i} src={p.url} alt="Res" className="w-16 h-16 rounded-lg object-cover border border-emerald-400" />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-colors min-h-[46px]"
            >
              Certify & Mark Grievance Resolved
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
