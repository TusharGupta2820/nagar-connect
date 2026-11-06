import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { complaintService, WARDS_LIST } from '../../services/complaintService';
import { uploadComplaintEvidence, validateImageFile } from '../../services/storageService';
import { RoadMap } from '../../components/maps/RoadMap';
import { QRCodeSVG } from 'qrcode.react';

const STEP_ITEMS = [
  { num: 1, label: 'Issue Details' },
  { num: 2, label: 'Location & Ward' },
  { num: 3, label: 'Photo Evidence' },
  { num: 4, label: 'Citizen Info' },
  { num: 5, label: 'Review & Submit' },
];

export const ReportIssue = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // Active step in the form (1 to 5)
  const [currentStep, setCurrentStep] = useState(1);
  const [previewDrawerOpen, setPreviewDrawerOpen] = useState(false);

  // Form State
  const [issueCategory, setIssueCategory] = useState(searchParams.get('category') || 'pothole');
  const [issueTitle, setIssueTitle] = useState('Deep crater & asphalt collapse near Shanti Park Signal');
  const [description, setDescription] = useState(
    'The crater spans approximately 1.2 meters across the middle north-bound lane heading towards Beverly Park. Bikers are swerving abruptly to avoid falling, causing severe near-miss collisions during rush hour.'
  );
  const [severity, setSeverity] = useState('high');

  // Location State
  const initialWard = searchParams.get('ward') || 'w4-uuid';
  const [wardId, setWardId] = useState(initialWard);
  const [streetName, setStreetName] = useState('Sheetal Nagar Main Road');
  const [landmark, setLandmark] = useState('Opposite Apna Bazar, near Pillar #42');
  const [locality, setLocality] = useState('Mira Road Central');
  const [coords, setCoords] = useState({ lat: 19.2812, lng: 72.8561 });
  const [gpsAccuracy, setGpsAccuracy] = useState(3.1);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  // Photographic Evidence State
  const [mediaList, setMediaList] = useState([
    {
      id: 'pre-1',
      name: 'IMG_20261106_114201.jpg',
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      size: 3400000,
      timestamp: 'Today, 11:42 AM',
      depthTag: '18 cm crater',
    },
    {
      id: 'pre-2',
      name: 'IMG_20261106_114322.jpg',
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      size: 4100000,
      timestamp: 'Today, 11:43 AM',
      depthTag: '1.2m Diameter',
    },
  ]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // Citizen Details State
  const [citizenName, setCitizenName] = useState(profile?.full_name || 'Suresh Narayan Patil');
  const [citizenPhone, setCitizenPhone] = useState(profile?.phone || '98201 44521');
  const [citizenEmail, setCitizenEmail] = useState(user?.email || 'sn.patil.mira@gmail.com');
  const [smsLang, setSmsLang] = useState('marathi');
  const [consentDeclaration, setConsentDeclaration] = useState(true);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Pre-load query params if present
  useEffect(() => {
    const qCategory = searchParams.get('category');
    if (qCategory) setIssueCategory(qCategory);
    const qWard = searchParams.get('ward');
    if (qWard) setWardId(qWard);
  }, [searchParams]);

  // Handle GPS coordinate detection
  const acquireGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setCoords({ lat, lng });
        setGpsAccuracy(parseFloat(pos.coords.accuracy.toFixed(1)));
        setGpsLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGpsError('GPS permission was denied or timed out. Defaulted to Ward 04 coordinates.');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle file uploads
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (mediaList.length + files.length > 4) {
      alert('Maximum 4 photographs permitted per complaint docket.');
      return;
    }

    setUploadingFiles(true);
    try {
      const newItems = [];
      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          alert(validation.error);
          continue;
        }

        const uploaded = await uploadComplaintEvidence(file, 'citizen_uploads');
        newItems.push({
          id: `media-${Date.now()}-${Math.random()}`,
          name: file.name,
          url: uploaded.url,
          path: uploaded.path,
          size: file.size,
          timestamp: 'Just now',
          depthTag: 'AI Verified',
        });
      }
      setMediaList((prev) => [...prev, ...newItems]);
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingFiles(false);
      // Reset input value so same photo can be re-selected if removed
      e.target.value = '';
    }
  };

  const removeMedia = (id) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  // Submit Complaint
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consentDeclaration) {
      alert('Please check the statutory declaration before submitting.');
      return;
    }
    if (!citizenName.trim() || !citizenPhone.trim()) {
      alert('Please provide citizen name and mobile number.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await complaintService.submitComplaint({
        issueTitle,
        issueCategory,
        description,
        severity,
        wardId,
        locality,
        streetName,
        landmark,
        latitude: coords.lat,
        longitude: coords.lng,
        accuracyMeters: gpsAccuracy,
        citizenName,
        citizenPhone,
        citizenEmail,
        preferredLanguage: smsLang,
        mediaFiles: mediaList,
      });

      setSubmissionSuccess(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitError(err.message || 'Failed to submit grievance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedWardObj = WARDS_LIST.find((w) => w.id === wardId) || WARDS_LIST[3];

  // If submitted successfully, show confirmation screen
  if (submissionSuccess) {
    const docketNumber = submissionSuccess.complaint_number;
    const trackingToken = submissionSuccess.tracking_token;
    const trackingLink = `${window.location.origin}/track?id=${docketNumber}&token=${trackingToken}`;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-margin py-space-md sm:py-space-xl">
        <div className="bg-surface-container-lowest p-4 sm:p-space-xl rounded-2xl shadow-lg border border-surface-container space-y-space-md sm:space-y-space-lg text-center">
          {/* Success Check Pill */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-md">
            <span className="material-symbols-outlined text-3xl sm:text-4xl">check_circle</span>
          </div>

          <div className="space-y-1">
            <span className="font-label-sm text-[11px] sm:text-label-sm uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded inline-block">
              DOCKET LOGGED UNDER MAHARASHTRA PUBLIC SERVICES GUARANTEE
            </span>
            <h1 className="text-xl sm:text-display-lg font-bold text-primary">
              Grievance Submitted Successfully!
            </h1>
            <p className="text-xs sm:text-body-md text-on-surface-variant max-w-lg mx-auto">
              Your road complaint has been registered in the MBMC Central Operations Cadre and dispatched to the designated Ward Junior Engineer.
            </p>
          </div>

          {/* Reference & Tracking Token Box */}
          <div className="bg-surface-container-low p-4 sm:p-space-lg rounded-xl max-w-xl mx-auto space-y-space-md border border-surface-container text-left">
            <div className="flex items-center justify-between border-b pb-space-xs">
              <span className="text-[11px] uppercase font-bold text-on-surface-variant">
                Official Reference ID
              </span>
              <span className="font-code-sm text-[10px] font-bold text-secondary bg-surface-container-lowest px-2 py-0.5 rounded">
                STATE AUDIT STAMP
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs text-on-surface-variant block">Grievance Docket Number:</span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-primary tracking-wide break-all">
                  {docketNumber}
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(docketNumber);
                  alert('Docket ID copied to clipboard!');
                }}
                className="w-full sm:w-auto px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-secondary flex items-center justify-center gap-1 min-h-[40px]"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                <span>Copy ID</span>
              </button>
            </div>

            {/* Secret Tracking Token */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-700 text-lg mt-0.5 shrink-0">key</span>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-xs text-amber-900 block">
                    Confidential Tracking Token:
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-800 break-all select-all block mt-0.5">
                    {trackingToken}
                  </span>
                  <p className="text-[11px] text-amber-800 mt-1">
                    Save this secret token to track your docket without exposing private contact info.
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code for instant tracking */}
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-primary">Scan to Track on Mobile:</span>
                <p className="text-[11px] text-on-surface-variant">
                  Bookmark this docket on your phone
                </p>
              </div>
              <div className="p-1 bg-white rounded shadow-sm shrink-0">
                <QRCodeSVG value={trackingLink} size={72} />
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-space-md pt-space-xs">
            <Link
              to={`/track?id=${docketNumber}&token=${trackingToken}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-md hover:bg-secondary transition-colors inline-flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span className="material-symbols-outlined text-title-md">manage_search</span>
              <span>Track Docket Live</span>
            </Link>

            <button
              onClick={() => {
                setSubmissionSuccess(null);
                setMediaList([]);
                setCurrentStep(1);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-colors min-h-[48px]"
              type="button"
            >
              Report Another Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-margin py-space-sm sm:py-space-md">
      <div className="flex flex-col w-full pb-space-2xl">
        {/* ==================== OFFICIAL HEADER CONTEXT ==================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-md sm:mb-space-xl">
          <div>
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-code-sm text-[10px] sm:text-code-sm uppercase tracking-wider font-bold">
                FORM 04-A
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-primary-fixed-variant text-[10px] sm:text-label-sm font-semibold truncate">
                MAHARASHTRA PUBLIC CONVENIENCE
              </span>
            </div>
            <h1 className="text-xl sm:text-display-lg font-bold text-primary tracking-tight">
              Citizen Road Grievance Redressal Form
            </h1>
            <p className="text-xs sm:text-body-md text-on-surface-variant mt-0.5">
              मिरा-भाईंदर महानगरपालिका रस्ते व पायाभूत सुविधा तक्रार निवारण पोर्टल • Unified MBMC Road Safety Intake
            </p>
          </div>

          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-xl shadow-sm border border-surface-container self-start md:self-auto">
            <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shrink-0"></div>
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-label-sm uppercase font-semibold text-secondary">
                {selectedWardObj.ward_name.split('-')[0]} Quick Dispatch Mode
              </span>
              <span className="font-code-sm text-[10px] sm:text-code-sm text-on-surface-variant">
                Live Road Patrol SLA: {severity === 'critical' ? '12 Hrs' : '48 Hrs'}
              </span>
            </div>
          </div>
        </div>

        {/* ==================== 5-STEPPER WIDGET ==================== */}
        {/* Desktop View: Full 5-column grid */}
        <div className="bg-surface-container-lowest p-3 sm:p-space-lg rounded-xl shadow-md mb-space-md sm:mb-space-xl border border-surface-container">
          <div className="hidden md:grid md:grid-cols-5 gap-space-sm items-center relative">
            {STEP_ITEMS.map((step) => {
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className="flex items-center gap-space-sm text-left focus:outline-none cursor-pointer"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md font-bold shadow-sm transition-colors ${
                      isCurrent
                        ? 'bg-primary text-on-primary ring-2 ring-secondary'
                        : isDone
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {isDone ? (
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    ) : (
                      step.num
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-[11px] text-secondary font-bold uppercase tracking-wider">
                      Step 0{step.num}
                    </span>
                    <span
                      className={`text-xs font-semibold truncate ${
                        isCurrent ? 'text-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile View: Compact Touch Stepper */}
          <div className="md:hidden flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center">
                  {currentStep}
                </span>
                <span className="text-xs font-bold text-primary">
                  Step {currentStep} of 5: <span className="text-secondary">{STEP_ITEMS[currentStep - 1].label}</span>
                </span>
              </div>
              <span className="text-[11px] font-code-sm text-on-surface-variant font-bold">
                {Math.round((currentStep / 5) * 100)}% Complete
              </span>
            </div>

            {/* Quick Tap Circles for mobile */}
            <div className="flex items-center justify-between gap-1 pt-1">
              {STEP_ITEMS.map((s) => (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setCurrentStep(s.num)}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center text-xs font-bold transition-all min-h-[38px] ${
                    currentStep === s.num
                      ? 'bg-primary text-on-primary shadow-sm ring-2 ring-secondary'
                      : currentStep > s.num
                      ? 'bg-secondary/20 text-secondary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {currentStep > s.num ? (
                    <span className="material-symbols-outlined text-sm">check</span>
                  ) : (
                    <span>0{s.num}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-2 sm:mt-space-md overflow-hidden">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Mobile Toggle for Live Preview Docket */}
        <div className="lg:hidden mb-space-md">
          <button
            type="button"
            onClick={() => setPreviewDrawerOpen(!previewDrawerOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-surface-container-low rounded-xl border border-surface-container shadow-sm text-primary font-bold text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">receipt_long</span>
              <span>{previewDrawerOpen ? 'Hide Live Grievance Preview' : 'Show Live Grievance Preview'}</span>
            </div>
            <span className="material-symbols-outlined text-base">
              {previewDrawerOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        {/* ==================== FORM GRID (8 Cols Form + 4 Cols Live Preview Drawer) ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Main Form Intake Area (8 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 flex flex-col gap-space-md sm:gap-space-xl">
            {submitError && (
              <div className="p-space-md bg-error-container text-on-error-container rounded-xl flex items-center gap-space-sm border border-error">
                <span className="material-symbols-outlined text-xl">error</span>
                <span className="text-xs sm:text-sm">{submitError}</span>
              </div>
            )}

            {/* ==================== SECTION 1: ISSUE CLASSIFICATION ==================== */}
            <section className="bg-surface-container-lowest p-4 sm:p-space-xl rounded-xl shadow-md space-y-space-md sm:space-y-space-lg relative overflow-hidden border border-surface-container">
              <div className="flex items-center justify-between border-b pb-space-sm">
                <div className="flex items-center gap-2 sm:gap-space-sm">
                  <span className="material-symbols-outlined text-2xl sm:text-headline-lg text-secondary">
                    category
                  </span>
                  <div>
                    <h2 className="text-base sm:text-headline-lg font-bold text-primary">
                      1. Issue Classification / तक्रारीचे वर्गीकरण
                    </h2>
                    <p className="text-xs sm:text-body-sm text-on-surface-variant">
                      Identify the physical road hazard accurately to route directly to the designated MBMC Junior Engineer.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-surface-container-high text-on-primary-fixed-variant rounded text-[10px] sm:text-label-sm font-semibold shrink-0">
                  MANDATORY
                </span>
              </div>

              {/* Rich Category Cards */}
              <div className="space-y-space-xs">
                <label className="text-xs sm:text-label-lg font-semibold text-primary block">
                  Select Primary Hazard Type *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-space-md">
                  {/* Category: Pothole */}
                  <div
                    onClick={() => setIssueCategory('pothole')}
                    className={`relative flex flex-col p-3 sm:p-space-md rounded-xl cursor-pointer transition-all min-h-[110px] ${
                      issueCategory === 'pothole'
                        ? 'bg-primary text-on-primary shadow-md ring-2 ring-secondary'
                        : 'bg-surface-container-low text-on-surface shadow-sm hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="material-symbols-outlined text-2xl sm:text-headline-lg">landslide</span>
                      {issueCategory === 'pothole' && (
                        <span className="material-symbols-outlined text-primary-fixed text-lg">
                          check_circle
                        </span>
                      )}
                    </div>
                    <span className="text-sm sm:text-title-md font-bold">Pothole / खड्डा</span>
                    <p className="text-[11px] sm:text-body-sm opacity-80 mt-0.5 mb-2">
                      Crater, asphalt breakdown, sunken tarmac cavity on vehicular road.
                    </p>
                    <div className="mt-auto flex items-center justify-between bg-black/20 px-2 py-0.5 rounded text-[10px]">
                      <span className="opacity-80">Default SLA:</span>
                      <span className="font-bold">48 Hours</span>
                    </div>
                  </div>

                  {/* Category: Open Manhole */}
                  <div
                    onClick={() => setIssueCategory('open_manhole')}
                    className={`relative flex flex-col p-3 sm:p-space-md rounded-xl cursor-pointer transition-all min-h-[110px] ${
                      issueCategory === 'open_manhole'
                        ? 'bg-primary text-on-primary shadow-md ring-2 ring-secondary'
                        : 'bg-surface-container-low text-on-surface shadow-sm hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="material-symbols-outlined text-2xl sm:text-headline-lg text-error">warning</span>
                      {issueCategory === 'open_manhole' && (
                        <span className="material-symbols-outlined text-primary-fixed text-lg">
                          check_circle
                        </span>
                      )}
                    </div>
                    <span className="text-sm sm:text-title-md font-bold text-error">
                      Open Manhole / मॅनहोल
                    </span>
                    <p className="text-[11px] sm:text-body-sm opacity-80 mt-0.5 mb-2">
                      Missing gutter lid, damaged storm water frame, life safety risk.
                    </p>
                    <div className="mt-auto flex items-center justify-between bg-error/20 text-error px-2 py-0.5 rounded text-[10px] font-bold">
                      <span>CRITICAL SLA:</span>
                      <span>12 Hours</span>
                    </div>
                  </div>

                  {/* Category: Damaged Road */}
                  <div
                    onClick={() => setIssueCategory('damaged_road')}
                    className={`relative flex flex-col p-3 sm:p-space-md rounded-xl cursor-pointer transition-all min-h-[110px] ${
                      issueCategory === 'damaged_road'
                        ? 'bg-primary text-on-primary shadow-md ring-2 ring-secondary'
                        : 'bg-surface-container-low text-on-surface shadow-sm hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="material-symbols-outlined text-2xl sm:text-headline-lg">grid_view</span>
                      {issueCategory === 'damaged_road' && (
                        <span className="material-symbols-outlined text-primary-fixed text-lg">
                          check_circle
                        </span>
                      )}
                    </div>
                    <span className="text-sm sm:text-title-md font-bold">
                      Damaged Road / पेव्हर ब्लॉक
                    </span>
                    <p className="text-[11px] sm:text-body-sm opacity-80 mt-0.5 mb-2">
                      Dislodged, sunken, or uneven interlocking blocks and road surface.
                    </p>
                    <div className="mt-auto flex items-center justify-between bg-black/20 px-2 py-0.5 rounded text-[10px]">
                      <span className="opacity-80">Default SLA:</span>
                      <span className="font-bold">72 Hours</span>
                    </div>
                  </div>

                  {/* Category: Incomplete Trenching */}
                  <div
                    onClick={() => setIssueCategory('incomplete_road_work')}
                    className={`relative flex flex-col p-3 sm:p-space-md rounded-xl cursor-pointer transition-all min-h-[110px] ${
                      issueCategory === 'incomplete_road_work'
                        ? 'bg-primary text-on-primary shadow-md ring-2 ring-secondary'
                        : 'bg-surface-container-low text-on-surface shadow-sm hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="material-symbols-outlined text-2xl sm:text-headline-lg">construction</span>
                      {issueCategory === 'incomplete_road_work' && (
                        <span className="material-symbols-outlined text-primary-fixed text-lg">
                          check_circle
                        </span>
                      )}
                    </div>
                    <span className="text-sm sm:text-title-md font-bold">
                      Incomplete Trenching / चर
                    </span>
                    <p className="text-[11px] sm:text-body-sm opacity-80 mt-0.5 mb-2">
                      Unfilled utility excavation by telecom, gas, or MSEB contractors.
                    </p>
                    <div className="mt-auto flex items-center justify-between bg-black/20 px-2 py-0.5 rounded text-[10px]">
                      <span className="opacity-80">Default SLA:</span>
                      <span className="font-bold">48 Hours</span>
                    </div>
                  </div>

                  {/* Category: Other */}
                  <div
                    onClick={() => setIssueCategory('other')}
                    className={`relative flex flex-col p-3 sm:p-space-md rounded-xl cursor-pointer transition-all sm:col-span-2 min-h-[110px] ${
                      issueCategory === 'other'
                        ? 'bg-primary text-on-primary shadow-md ring-2 ring-secondary'
                        : 'bg-surface-container-low text-on-surface shadow-sm hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="material-symbols-outlined text-2xl sm:text-headline-lg">report_problem</span>
                      {issueCategory === 'other' && (
                        <span className="material-symbols-outlined text-primary-fixed text-lg">
                          check_circle
                        </span>
                      )}
                    </div>
                    <span className="text-sm sm:text-title-md font-bold">
                      Other Civic Hazard / इतर नागरी समस्या
                    </span>
                    <p className="text-[11px] sm:text-body-sm opacity-80 mt-0.5">
                      Waterlogging, unauthorized speed breaker, oil spill, or road debris blocking lane.
                    </p>
                  </div>
                </div>
              </div>

              {/* Severity Assessment */}
              <div className="space-y-space-xs pt-1">
                <label className="text-xs sm:text-label-lg font-semibold text-primary block">
                  Hazard Severity Assessment *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { val: 'low', title: 'Low', desc: 'Cosmetic defect' },
                    { val: 'medium', title: 'Medium', desc: 'Traffic slowed' },
                    { val: 'high', title: 'High', desc: 'Vehicle damage' },
                    { val: 'critical', title: 'Critical', desc: 'Life danger' },
                  ].map((s) => (
                    <div
                      key={s.val}
                      onClick={() => setSeverity(s.val)}
                      className={`flex flex-col p-2.5 rounded-xl cursor-pointer transition-all min-h-[56px] justify-center ${
                        severity === s.val
                          ? s.val === 'critical'
                            ? 'bg-error text-on-error shadow-md ring-2 ring-error'
                            : 'bg-primary text-on-primary shadow-sm ring-2 ring-secondary'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span className="font-bold text-xs">{s.title}</span>
                      <span className="text-[10px] opacity-80 truncate">{s.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Title & Description (text-base on mobile prevents iOS zoom) */}
              <div className="space-y-1">
                <label className="text-xs sm:text-label-lg font-semibold text-primary flex items-center justify-between">
                  <span>Issue Headline / शीर्षक *</span>
                  <span className="text-[11px] text-on-surface-variant">Keep brief</span>
                </label>
                <input
                  type="text"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  placeholder="e.g. Deep pothole near Shanti Park Signal"
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm shadow-inner focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-label-lg font-semibold text-primary">
                    Detailed Description / सविस्तर माहिती *
                  </label>
                  <span className="font-code-sm text-[11px] text-secondary font-semibold">
                    {description.length} / 1000
                  </span>
                </div>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe approximate depth, vehicle lane obstructed, and if rainwater accumulates inside..."
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm shadow-inner focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                  required
                ></textarea>
              </div>
            </section>

            {/* ==================== SECTION 2: LOCATION & WARD ==================== */}
            <section className="bg-surface-container-lowest p-4 sm:p-space-xl rounded-xl shadow-md space-y-space-md sm:space-y-space-lg border border-surface-container">
              <div className="flex items-center justify-between border-b pb-space-sm">
                <div className="flex items-center gap-2 sm:gap-space-sm">
                  <span className="material-symbols-outlined text-2xl sm:text-headline-lg text-secondary">
                    pin_drop
                  </span>
                  <div>
                    <h2 className="text-base sm:text-headline-lg font-bold text-primary">
                      2. Location Details / ठिकाणाचा तपशील
                    </h2>
                    <p className="text-xs sm:text-body-sm text-on-surface-variant">
                      Municipal civic hierarchy for accurate Ward Engineer geo-dispatch.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-surface-container-high text-on-primary-fixed-variant rounded text-[10px] sm:text-label-sm font-semibold shrink-0">
                  GIS-VERIFIED
                </span>
              </div>

              {/* Administrative Jurisdiction Pills */}
              <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-2.5 sm:p-space-md rounded-xl text-center sm:text-left">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-on-surface-variant block">
                    State
                  </label>
                  <div className="text-xs sm:text-sm font-bold text-on-surface truncate">
                    Maharashtra
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-on-surface-variant block">
                    District
                  </label>
                  <div className="text-xs sm:text-sm font-bold text-on-surface truncate">
                    Thane
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-on-surface-variant block">
                    ULB
                  </label>
                  <div className="text-xs sm:text-sm font-bold text-on-surface truncate">
                    MBMC
                  </div>
                </div>
              </div>

              {/* Ward Selector & Street Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-space-md">
                <div className="space-y-1">
                  <label className="text-xs sm:text-label-lg font-semibold text-primary block">
                    Administrative Ward *
                  </label>
                  <select
                    value={wardId}
                    onChange={(e) => setWardId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    {WARDS_LIST.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.ward_name} ({w.office})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-label-lg font-semibold text-primary block">
                    Street / Road Name *
                  </label>
                  <input
                    type="text"
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                    placeholder="e.g. Sheetal Nagar Main Road"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
              </div>

              {/* Landmark & Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-space-md">
                <div className="space-y-1">
                  <label className="text-xs sm:text-label-lg font-semibold text-primary block">
                    Landmark / खूण *
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Opposite Apna Bazar, Pillar #42"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs sm:text-label-lg font-semibold text-primary block">
                    Locality / परिसर *
                  </label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Beverly Park / Shanti Nagar"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
              </div>

              {/* Geolocation Device Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-space-md bg-surface-container-low rounded-xl">
                <button
                  type="button"
                  onClick={acquireGps}
                  disabled={gpsLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-secondary text-on-secondary px-4 py-3 rounded-xl hover:bg-primary transition-all shadow-sm min-h-[46px] cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-lg ${gpsLoading ? 'animate-spin' : ''}`}>
                    {gpsLoading ? 'sync' : 'my_location'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold">
                    {gpsLoading ? 'Acquiring GPS...' : 'Acquire Device GPS'}
                  </span>
                </button>

                <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-2 rounded-xl shadow-sm">
                  <span className="material-symbols-outlined text-secondary text-lg">gps_fixed</span>
                  <div className="flex flex-col">
                    <span className="font-code-sm text-xs font-bold text-primary">
                      {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      Precision: ±{gpsAccuracy}m
                    </span>
                  </div>
                </div>
              </div>
              {gpsError && <p className="text-xs text-amber-700">{gpsError}</p>}

              {/* Interactive GIS Leaflet Map with draggable marker */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span className="font-semibold uppercase">
                    Map Pin (Click or Drag Marker)
                  </span>
                  <span className="font-code-sm text-secondary">
                    Grid: MBMC-W04
                  </span>
                </div>

                <div className="w-full h-56 sm:h-64 rounded-xl overflow-hidden shadow-inner border border-surface-container">
                  <RoadMap
                    center={[coords.lat, coords.lng]}
                    zoom={15}
                    pickerMode={true}
                    pickerPosition={coords}
                    onPickerPositionChange={(pos) => setCoords(pos)}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </section>

            {/* ==================== SECTION 3: PHOTO EVIDENCE ==================== */}
            <section className="bg-surface-container-lowest p-4 sm:p-space-xl rounded-xl shadow-md space-y-space-md sm:space-y-space-lg border border-surface-container">
              <div className="flex items-center justify-between border-b pb-space-sm">
                <div className="flex items-center gap-2 sm:gap-space-sm">
                  <span className="material-symbols-outlined text-2xl sm:text-headline-lg text-secondary">
                    add_a_photo
                  </span>
                  <div>
                    <h2 className="text-base sm:text-headline-lg font-bold text-primary">
                      3. Photographic Evidence / फोटो पुरावा
                    </h2>
                    <p className="text-xs sm:text-body-sm text-on-surface-variant">
                      Live municipal verification requires real-time camera metadata or unedited gallery uploads.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant rounded text-[10px] sm:text-label-sm font-semibold shrink-0">
                  AI READY
                </span>
              </div>

              {/* Mobile Phone Friendly Upload Triggers */}
              <div className="p-4 sm:p-space-lg rounded-xl bg-surface-container-low flex flex-col items-center justify-center text-center shadow-inner border-2 border-dashed border-outline-variant">
                {/* Hidden input for Native Camera Capture on Smartphones */}
                <input
                  id="mobile-camera-capture"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="sr-only"
                />

                {/* Hidden input for Gallery / File selection */}
                <input
                  id="gallery-file-input"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="sr-only"
                />

                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container mb-2">
                  <span className="material-symbols-outlined text-2xl">photo_camera</span>
                </div>
                <h3 className="text-sm sm:text-title-md font-bold text-primary">
                  {uploadingFiles ? 'Uploading photographs...' : 'Upload Live Photo from Road Site'}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 max-w-md">
                  Click live photographs with your phone camera or select from gallery. AI automatically checks crater depth.
                </p>

                {/* Dual Touch-friendly Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mt-4 w-full sm:w-auto">
                  {/* Camera Button (Triggers Mobile Camera Directly) */}
                  <label
                    htmlFor="mobile-camera-capture"
                    className="cursor-pointer inline-flex items-center justify-center gap-2 bg-secondary text-on-secondary px-5 py-3 rounded-xl text-xs sm:text-sm font-bold hover:bg-primary transition-colors shadow-md min-h-[46px]"
                  >
                    <span className="material-symbols-outlined text-lg">photo_camera</span>
                    <span>Take Photo (Camera)</span>
                  </label>

                  {/* Gallery Button */}
                  <label
                    htmlFor="gallery-file-input"
                    className="cursor-pointer inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-xl text-xs sm:text-sm font-bold hover:bg-secondary transition-colors shadow-md min-h-[46px]"
                  >
                    <span className="material-symbols-outlined text-lg">folder_open</span>
                    <span>Browse Gallery (Max 4)</span>
                  </label>
                </div>

                <p className="text-[11px] text-on-surface-variant mt-3">
                  Supports JPG, PNG, WEBP up to 10MB per image.
                </p>
              </div>

              {/* Uploaded Evidence Previews */}
              <div className="space-y-space-xs">
                <span className="text-xs sm:text-label-lg font-semibold text-primary block">
                  Attached Evidence ({mediaList.length} of 4 Uploaded)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-space-md">
                  {mediaList.map((m) => (
                    <div
                      key={m.id}
                      className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm flex flex-col border border-surface-container"
                    >
                      <div className="relative h-40 bg-surface-container">
                        <img
                          src={m.url}
                          alt="Road Evidence"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-primary/80 backdrop-blur text-on-primary px-1.5 py-0.5 rounded text-[10px] font-code-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-secondary-fixed">
                            verified
                          </span>
                          <span>EXIF VERIFIED</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMedia(m.id)}
                          aria-label="Remove Image"
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center hover:opacity-90 shadow-md cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                      <div className="p-2.5 flex flex-col gap-1 bg-surface-container-lowest">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-primary truncate max-w-[180px]">
                            {m.name}
                          </span>
                          <span className="font-code-sm text-[10px] text-on-surface-variant">
                            {(m.size / (1024 * 1024)).toFixed(1)} MB
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 text-[10px] mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-primary-fixed-variant">
                            {m.timestamp || 'Today'}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-secondary font-bold">
                            {m.depthTag || 'Verified'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ==================== SECTION 4 & 5: CITIZEN INFORMATION & SUBMIT ==================== */}
            <section className="bg-surface-container-lowest p-4 sm:p-space-xl rounded-xl shadow-md space-y-space-md sm:space-y-space-lg border border-surface-container">
              <div className="flex items-center justify-between border-b pb-space-sm">
                <div className="flex items-center gap-2 sm:gap-space-sm">
                  <span className="material-symbols-outlined text-2xl sm:text-headline-lg text-secondary">
                    badge
                  </span>
                  <div>
                    <h2 className="text-base sm:text-headline-lg font-bold text-primary">
                      4 & 5. Citizen Details & Submission / माहिती
                    </h2>
                    <p className="text-xs sm:text-body-sm text-on-surface-variant">
                      Required for official SMS updates, Engineer callback, and MBMC audit verification.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-surface-container-high text-on-primary-fixed-variant rounded text-[10px] sm:text-label-sm font-semibold shrink-0">
                  SECURE AUTH
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-space-md">
                <div className="space-y-1">
                  <label className="text-xs sm:text-label-lg font-semibold text-primary block">
                    Full Name / नाव *
                  </label>
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="e.g. Suresh Narayan Patil"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-label-lg font-semibold text-primary block">
                    Mobile Number (WhatsApp linked) *
                  </label>
                  <div className="flex gap-1.5">
                    <span className="px-3 py-2.5 rounded-xl bg-surface-container font-code-sm text-xs text-primary flex items-center font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      placeholder="10-digit number"
                      className="flex-1 px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-label-lg font-semibold text-primary block">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={citizenEmail}
                    onChange={(e) => setCitizenEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base sm:text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-label-lg font-semibold text-primary block">
                    Preferred Language for Redressal SMS *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSmsLang('marathi')}
                      className={`flex items-center justify-center gap-1 p-2.5 rounded-xl cursor-pointer transition-colors min-h-[44px] ${
                        smsLang === 'marathi'
                          ? 'bg-primary text-on-primary shadow-sm font-bold'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {smsLang === 'marathi' ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span className="text-xs font-semibold">मराठी (Marathi)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSmsLang('english')}
                      className={`flex items-center justify-center gap-1 p-2.5 rounded-xl cursor-pointer transition-colors min-h-[44px] ${
                        smsLang === 'english'
                          ? 'bg-primary text-on-primary shadow-sm font-bold'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {smsLang === 'english' ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span className="text-xs font-semibold">English</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy Guarantee Banner */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="material-symbols-outlined text-xl text-secondary shrink-0 mt-0.5">
                  verified_user
                </span>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-primary">
                    Privacy & Whistleblower Protection Guarantee
                  </p>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Your personal identity and mobile number are encrypted at rest under MBMC Civic Information Norms (Section 8 RTI Compliant).
                  </p>
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={consentDeclaration}
                  onChange={(e) => setConsentDeclaration(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-primary focus:ring-secondary cursor-pointer"
                />
                <label
                  htmlFor="declaration"
                  className="text-xs text-on-surface-variant cursor-pointer select-none leading-relaxed"
                >
                  I hereby certify that the photographic evidence uploaded was captured in good faith within the territorial boundaries of Mira-Bhayandar Municipal Corporation and portrays authentic road conditions.
                </label>
              </div>

              {/* Submit Action Group */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-space-sm border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => alert('Draft saved locally in browser memory!')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-surface-container text-on-surface text-xs sm:text-sm font-semibold hover:bg-surface-container-high transition-colors min-h-[46px]"
                >
                  Save as Draft Docket
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-xl hover:bg-secondary transition-all hover:scale-[1.01] disabled:opacity-50 min-h-[48px] cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-lg ${submitting ? 'animate-spin' : ''}`}>
                    {submitting ? 'sync' : 'send'}
                  </span>
                  <span>
                    {submitting ? 'Submitting to MBMC...' : 'Submit Grievance / तक्रार दाखल करा'}
                  </span>
                </button>
              </div>
            </section>
          </form>

          {/* ==================== SIDE LIVE PREVIEW DRAWER (4 cols) ==================== */}
          <aside
            className={`lg:col-span-4 flex flex-col gap-space-md sm:gap-space-lg lg:sticky lg:top-36 ${
              previewDrawerOpen ? 'block' : 'hidden lg:flex'
            }`}
          >
            {/* Live Grievance Ticket Preview Card */}
            <div className="bg-surface-container-lowest p-4 sm:p-space-lg rounded-xl shadow-md space-y-space-md border border-surface-container">
              <div className="flex items-center justify-between border-b pb-space-xs">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg text-secondary">
                    receipt_long
                  </span>
                  <span className="font-bold text-primary text-sm sm:text-base">
                    Live Grievance Preview
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-code-sm text-[10px] font-semibold">
                  PRE-DISPATCH
                </span>
              </div>

              {/* Docket ID Token */}
              <div className="p-3 rounded-xl bg-primary text-on-primary flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-surface-variant uppercase">
                    Proposed Docket ID
                  </span>
                  <span className="text-base sm:text-lg font-bold font-code-sm tracking-wide">
                    NC-MBMC-2026-AUTO
                  </span>
                </div>
                <span className="material-symbols-outlined text-2xl text-primary-fixed">
                  qr_code_2
                </span>
              </div>

              {/* Key Parameters */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Class:</span>
                  <span className="font-semibold text-primary capitalize">
                    {issueCategory.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Assigned Ward:</span>
                  <span className="font-semibold text-primary truncate max-w-[180px]">
                    {selectedWardObj.ward_name}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Priority Tier:</span>
                  <span
                    className={`font-semibold uppercase ${
                      severity === 'critical' ? 'text-error font-bold' : 'text-primary'
                    }`}
                  >
                    {severity}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Geocode:</span>
                  <span className="font-code-sm text-[11px] font-semibold text-secondary">
                    {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Evidence Count:</span>
                  <span className="font-semibold text-primary">
                    {mediaList.length} Photograph{mediaList.length === 1 ? '' : 's'}
                  </span>
                </div>
              </div>

              {/* SLA Guarantee Box */}
              <div className="p-3 rounded-xl bg-surface-container-low space-y-1.5 border border-surface-container">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase font-bold text-on-surface-variant text-[10px]">
                    Guaranteed Redressal SLA
                  </span>
                  <span className="font-code-sm font-bold text-secondary">
                    {severity === 'critical' ? '12 Hours' : '48 Hours'}
                  </span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-secondary h-full rounded-full transition-all"
                    style={{ width: severity === 'critical' ? '100%' : '75%' }}
                  ></div>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  Under MBMC Citizen Charter Rule 12, Potholes reported with valid EXIF coordinates must be inspected within 12h and patched within 48h.
                </p>
              </div>

              {/* Assigned Ward Office */}
              <div className="pt-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                  Designated Redressal Unit
                </span>
                <div className="flex items-center gap-2 p-2.5 bg-surface-container-low rounded-xl border border-surface-container">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold shrink-0">
                    <span className="material-symbols-outlined text-base">engineering</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-primary truncate">
                      {selectedWardObj.ward_name.split('-')[0]} Division
                    </span>
                    <span className="text-[11px] text-on-surface-variant truncate">
                      {selectedWardObj.office}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Escalation Help Card */}
            <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex items-start gap-2.5 border border-surface-container">
              <span className="material-symbols-outlined text-xl text-secondary shrink-0 mt-0.5">
                headset_mic
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-primary">
                  Need Grievance Assistance?
                </span>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Facing difficulty pin-pointing location or taking live photos?
                </p>
                <a
                  className="text-xs font-bold text-secondary hover:underline mt-1"
                  href="tel:02228192828"
                >
                  Helpline: 022-2819-2828
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
