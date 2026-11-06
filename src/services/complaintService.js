import { supabase, isSupabaseConfigured } from './supabaseClient';

// Realistic MBMC initial seed complaints (mirrors production DB seed and Google Stitch designs)
export const INITIAL_MBMC_COMPLAINTS = [
  {
    id: 'c0000001-0000-4000-a000-000000000001',
    complaint_number: 'NC-MBMC-2026-008841',
    tracking_token_hash: 'mock_token_hash_8841',
    issue_title: 'Severe Craters & Rutting (40m stretch)',
    issue_category: 'pothole',
    description: 'Multiple deep asphalt craters (depth ~85mm) spanning 40 meters. Severe risk of two-wheeler skidding during rush hour.',
    severity: 'critical',
    status: 'in_progress',
    state: 'Maharashtra',
    district: 'Thane',
    municipal_corporation: 'Mira-Bhayandar Municipal Corporation',
    ward_id: 'w4-uuid',
    ward_number: 4,
    ward_name: 'Ward 04 - Kanakia & Beverly Park',
    locality: 'Beverly Park, Mira Road East',
    street_name: 'Kanakia Road, Opp. Cinemax',
    landmark: 'Opposite Cinemax Theatre, Beverly Park Signal',
    pincode: '401107',
    latitude: 19.2812,
    longitude: 72.8561,
    accuracy_meters: 3.2,
    citizen_name: 'Suresh Narayan Patil',
    citizen_phone: '+91 98201 44521',
    citizen_email: 'sn.patil.mira@gmail.com',
    preferred_language: 'marathi',
    submitted_at: new Date(Date.now() - 22 * 3600000).toISOString(),
    verified_at: new Date(Date.now() - 20 * 3600000).toISOString(),
    assigned_department_id: 'dept-road',
    department_name: 'Roads & Infrastructure Maintenance',
    department_code: 'MBMC-R&I',
    assigned_officer_id: '00000000-0000-4000-a000-000000000002',
    officer_name: 'Er. Aniket Joshi',
    officer_designation: 'Junior Engineer (Civil), Ward 04',
    contractor_name: 'Apex Infra Project Ltd.',
    sla_hours: 48,
    elapsed_hours: 22,
    media: [
      {
        id: 'm1',
        storage_path: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        media_type: 'image/jpeg',
        media_category: 'citizen_evidence',
        file_size_bytes: 3400000,
        metadata: { exif_match: true, depth: '85mm' },
      },
      {
        id: 'm2',
        storage_path: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        media_type: 'image/jpeg',
        media_category: 'citizen_evidence',
        file_size_bytes: 4100000,
        metadata: { exif_match: true, depth: '85mm' },
      },
    ],
    timeline: [
      {
        id: 'th1',
        old_status: null,
        new_status: 'submitted',
        remarks: 'Issue registered via Public Citizen QR Pole #MR-402 with 2 geotagged images',
        created_at: new Date(Date.now() - 22 * 3600000).toISOString(),
      },
      {
        id: 'th2',
        old_status: 'submitted',
        new_status: 'under_verification',
        remarks: 'MBMC AI Vision engine classified severity as Critical. Ward 04 boundary confirmed.',
        created_at: new Date(Date.now() - 20 * 3600000).toISOString(),
      },
      {
        id: 'th3',
        old_status: 'under_verification',
        new_status: 'assigned',
        remarks: 'Assigned to Ward 04 Engineering Division & Apex Infra Project Ltd.',
        created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
      },
      {
        id: 'th4',
        old_status: 'assigned',
        new_status: 'in_progress',
        remarks: 'Excavation and sub-base cold patch work initiated on site.',
        created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
      },
    ],
  },
  {
    id: 'c0000001-0000-4000-a000-000000000002',
    complaint_number: 'NC-MBMC-2026-000914',
    tracking_token_hash: 'mock_token_hash_0914',
    issue_title: 'Dangerous Open Stormwater Manhole',
    issue_category: 'open_manhole',
    description: 'Missing reinforced cement concrete chamber lid on pedestrian crossing. Highly hazardous during evening hours.',
    severity: 'critical',
    status: 'in_progress',
    state: 'Maharashtra',
    district: 'Thane',
    municipal_corporation: 'Mira-Bhayandar Municipal Corporation',
    ward_id: 'w3-uuid',
    ward_number: 3,
    ward_name: 'Ward 03 - Mira Road Shanti Nagar',
    locality: 'Navghar Road, Sector 4',
    street_name: 'Navghar Road',
    landmark: 'Opp. S.V. Garden Gate 2, near Pillar #42',
    pincode: '401107',
    latitude: 19.3015,
    longitude: 72.8540,
    accuracy_meters: 2.5,
    citizen_name: 'Pooja Sharma',
    citizen_phone: '+91 98334 11220',
    citizen_email: 'pooja.sharma@gmail.com',
    preferred_language: 'english',
    submitted_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    verified_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    assigned_department_id: 'dept-drainage',
    department_name: 'Stormwater Drainage & Manholes',
    department_code: 'MBMC-SWD',
    assigned_officer_id: '00000000-0000-4000-a000-000000000003',
    officer_name: 'Rajesh Sawant',
    officer_designation: 'Field Inspection Lead, QRT Squad 2',
    contractor_name: 'MBMC Stormwater Cell',
    sla_hours: 12,
    elapsed_hours: 6,
    media: [
      {
        id: 'm3',
        storage_path: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?auto=format&fit=crop&w=800&q=80',
        media_type: 'image/jpeg',
        media_category: 'citizen_evidence',
        file_size_bytes: 2800000,
        metadata: { exif_match: true },
      },
    ],
    timeline: [
      {
        id: 'th21',
        old_status: null,
        new_status: 'submitted',
        remarks: 'Registered via Mobile QR Scan by Citizen',
        created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
      },
      {
        id: 'th22',
        old_status: 'submitted',
        new_status: 'assigned',
        remarks: 'Critical SLA triage: Emergency QRT dispatch deployed for safety barricading',
        created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
      },
      {
        id: 'th23',
        old_status: 'assigned',
        new_status: 'in_progress',
        remarks: 'Safety cone & perimeter tape erected; replacement cast-iron cover en route',
        created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
      },
    ],
  },
  {
    id: 'c0000001-0000-4000-a000-000000000003',
    complaint_number: 'NC-MBMC-2026-008839',
    tracking_token_hash: 'mock_token_hash_8839',
    issue_title: 'Sunken Interlocking Paver Blocks',
    issue_category: 'damaged_road',
    description: 'Uneven sub-base failure causing pavers to cave in by 12cm. Water collects and splash hazards to sidewalk pedestrians.',
    severity: 'high',
    status: 'under_verification',
    state: 'Maharashtra',
    district: 'Thane',
    municipal_corporation: 'Mira-Bhayandar Municipal Corporation',
    ward_id: 'w1-uuid',
    ward_number: 1,
    ward_name: 'Ward 01 - Bhayandar West Coastal',
    locality: '150 Feet Road, Bhayandar West',
    street_name: '150 Feet Road',
    landmark: 'Near Maxus Mall Entrance',
    pincode: '401101',
    latitude: 19.3089,
    longitude: 72.8488,
    accuracy_meters: 4.1,
    citizen_name: 'Mahesh Kulkarni',
    citizen_phone: '+91 97665 43210',
    citizen_email: 'mahesh.k@yahoo.com',
    preferred_language: 'marathi',
    submitted_at: new Date(Date.now() - 19 * 3600000).toISOString(),
    verified_at: null,
    assigned_department_id: 'dept-road',
    department_name: 'Roads & Infrastructure Maintenance',
    department_code: 'MBMC-R&I',
    assigned_officer_id: null,
    officer_name: 'Er. M. Shinde',
    officer_designation: 'Junior Engineer, Ward 01',
    contractor_name: 'R.K. Civil Works',
    sla_hours: 48,
    elapsed_hours: 19,
    media: [
      {
        id: 'm4',
        storage_path: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
        media_type: 'image/jpeg',
        media_category: 'citizen_evidence',
        file_size_bytes: 3100000,
        metadata: { exif_match: true },
      },
    ],
    timeline: [
      {
        id: 'th31',
        old_status: null,
        new_status: 'submitted',
        remarks: 'Registered via Web Portal',
        created_at: new Date(Date.now() - 19 * 3600000).toISOString(),
      },
      {
        id: 'th32',
        old_status: 'submitted',
        new_status: 'under_verification',
        remarks: 'Dispatched to Ward 01 Junior Engineer for field inspection',
        created_at: new Date(Date.now() - 17 * 3600000).toISOString(),
      },
    ],
  },
  {
    id: 'c0000001-0000-4000-a000-000000000004',
    complaint_number: 'NC-MBMC-2026-008829',
    tracking_token_hash: 'mock_token_hash_8829',
    issue_title: 'Unfilled Utility Pipeline Trench',
    issue_category: 'incomplete_road_work',
    description: '15m longitudinal utility trench excavated by gas agency left unpaved with sharp debris on shoulder.',
    severity: 'medium',
    status: 'assigned',
    state: 'Maharashtra',
    district: 'Thane',
    municipal_corporation: 'Mira-Bhayandar Municipal Corporation',
    ward_id: 'w3-uuid',
    ward_number: 3,
    ward_name: 'Ward 03 - Mira Road Shanti Nagar',
    locality: 'Sector 4, Shanti Nagar',
    street_name: 'Main Market Road',
    landmark: 'Opposite Apna Bazar',
    pincode: '401107',
    latitude: 19.2882,
    longitude: 72.8599,
    accuracy_meters: 3.5,
    citizen_name: 'Ramesh Gupta',
    citizen_phone: '+91 98212 99887',
    citizen_email: 'ramesh.gupta@gmail.com',
    preferred_language: 'hindi',
    submitted_at: new Date(Date.now() - 13 * 3600000).toISOString(),
    verified_at: new Date(Date.now() - 11 * 3600000).toISOString(),
    assigned_department_id: 'dept-road',
    department_name: 'Roads & Infrastructure Maintenance',
    department_code: 'MBMC-R&I',
    assigned_officer_id: null,
    officer_name: 'Er. S. Deshmukh',
    officer_designation: 'Junior Engineer, Ward 03',
    contractor_name: 'MGL Restoration Unit',
    sla_hours: 72,
    elapsed_hours: 13,
    media: [
      {
        id: 'm5',
        storage_path: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
        media_type: 'image/jpeg',
        media_category: 'citizen_evidence',
        file_size_bytes: 2500000,
        metadata: { exif_match: true },
      },
    ],
    timeline: [
      {
        id: 'th41',
        old_status: null,
        new_status: 'submitted',
        remarks: 'Registered by citizen',
        created_at: new Date(Date.now() - 13 * 3600000).toISOString(),
      },
      {
        id: 'th42',
        old_status: 'submitted',
        new_status: 'assigned',
        remarks: 'Notice issued to utility contractor with 48h restoration deadline',
        created_at: new Date(Date.now() - 11 * 3600000).toISOString(),
      },
    ],
  },
  {
    id: 'c0000001-0000-4000-a000-000000000005',
    complaint_number: 'NC-MBMC-2026-008812',
    tracking_token_hash: 'mock_token_hash_8812',
    issue_title: 'Asphalt Delamination & Gravel Spillage',
    issue_category: 'damaged_road',
    description: 'Hot-mix overlay peeled off over 25m resulting in loose gravel throwing risk from tires.',
    severity: 'low',
    status: 'resolved',
    state: 'Maharashtra',
    district: 'Thane',
    municipal_corporation: 'Mira-Bhayandar Municipal Corporation',
    ward_id: 'w6-uuid',
    ward_number: 6,
    ward_name: 'Ward 06 - Ghodbunder Urban Arterial',
    locality: 'Fountain Hotel Junction',
    street_name: 'Ghodbunder Link Road',
    landmark: 'Fountain Junction Triangle',
    pincode: '401107',
    latitude: 19.2675,
    longitude: 72.8802,
    accuracy_meters: 5.0,
    citizen_name: 'Amitabh Sen',
    citizen_phone: '+91 98190 77665',
    citizen_email: 'amitabh.sen@hotmail.com',
    preferred_language: 'english',
    submitted_at: new Date(Date.now() - 40 * 3600000).toISOString(),
    verified_at: new Date(Date.now() - 36 * 3600000).toISOString(),
    resolved_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    assigned_department_id: 'dept-road',
    department_name: 'Roads & Infrastructure Maintenance',
    department_code: 'MBMC-R&I',
    assigned_officer_id: null,
    officer_name: 'Er. V. Pawar',
    officer_designation: 'Junior Engineer, Ward 06',
    contractor_name: 'Shree Sai Infra Tech',
    sla_hours: 72,
    elapsed_hours: 36,
    media: [
      {
        id: 'm6',
        storage_path: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
        media_type: 'image/jpeg',
        media_category: 'citizen_evidence',
        file_size_bytes: 2900000,
        metadata: { exif_match: true },
      },
      {
        id: 'm7',
        storage_path: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?auto=format&fit=crop&w=800&q=80',
        media_type: 'image/jpeg',
        media_category: 'resolution_evidence',
        file_size_bytes: 3300000,
        metadata: { certified_resolution: true },
      },
    ],
    timeline: [
      {
        id: 'th51',
        old_status: null,
        new_status: 'submitted',
        remarks: 'Registered via Public Portal',
        created_at: new Date(Date.now() - 40 * 3600000).toISOString(),
      },
      {
        id: 'th52',
        old_status: 'submitted',
        new_status: 'assigned',
        remarks: 'Assigned to Shree Sai Infra Tech',
        created_at: new Date(Date.now() - 36 * 3600000).toISOString(),
      },
      {
        id: 'th53',
        old_status: 'assigned',
        new_status: 'resolved',
        remarks: 'Hot-mix bituminous patching completed and compacted by roller. Certified by Er. V. Pawar.',
        created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
      },
    ],
  },
];

export const WARDS_LIST = [
  { id: 'w1-uuid', ward_number: 1, ward_name: 'Ward 01 - Bhayandar West Coastal', office: 'Bhayandar West Ward Office, Station Road' },
  { id: 'w2-uuid', ward_number: 2, ward_name: 'Ward 02 - Bhayandar East Station', office: 'Bhayandar East Ward Office, Navghar Rd' },
  { id: 'w3-uuid', ward_number: 3, ward_name: 'Ward 03 - Mira Road Shanti Nagar', office: 'Shanti Nagar Ward Office, Sector 4' },
  { id: 'w4-uuid', ward_number: 4, ward_name: 'Ward 04 - Kanakia & Beverly Park', office: 'Silver Park Sub-Office, Mira Road East' },
  { id: 'w5-uuid', ward_number: 5, ward_name: 'Ward 05 - Kashimira Junction NH-48', office: 'Kashimira Municipal Hub, NH-48' },
  { id: 'w6-uuid', ward_number: 6, ward_name: 'Ward 06 - Ghodbunder Urban Arterial', office: 'Ghodbunder Nodal Post, Link Road' },
];

export const DEPARTMENTS_LIST = [
  { id: 'dept-road', department_name: 'Roads & Infrastructure Maintenance', department_code: 'MBMC-R&I' },
  { id: 'dept-drainage', department_name: 'Stormwater Drainage & Manholes', department_code: 'MBMC-SWD' },
  { id: 'dept-traffic', department_name: 'Traffic Engineering & Road Safety', department_code: 'MBMC-TERS' },
  { id: 'dept-qrt', department_name: 'Quick Response Flying Squad', department_code: 'MBMC-QRT' },
];

// Helper to access in-memory store when working locally before Supabase is live
const getStoredComplaints = () => {
  const stored = localStorage.getItem('nagar_connect_complaints');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_MBMC_COMPLAINTS;
    }
  }
  return INITIAL_MBMC_COMPLAINTS;
};

const saveStoredComplaints = (list) => {
  localStorage.setItem('nagar_connect_complaints', JSON.stringify(list));
};

export const complaintService = {
  async getWards() {
    if (!isSupabaseConfigured()) {
      return WARDS_LIST;
    }
    const { data, error } = await supabase
      .from('wards')
      .select('*')
      .order('ward_number', { ascending: true });
    if (error) {
      console.warn('Fallback to local wards list:', error);
      return WARDS_LIST;
    }
    return data && data.length > 0 ? data : WARDS_LIST;
  },

  async getDepartments() {
    if (!isSupabaseConfigured()) {
      return DEPARTMENTS_LIST;
    }
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('is_active', true)
      .order('department_name');
    if (error) {
      console.warn('Fallback to local departments list:', error);
      return DEPARTMENTS_LIST;
    }
    return data && data.length > 0 ? data : DEPARTMENTS_LIST;
  },

  /**
   * Submit citizen complaint with photographic evidence and GPS geocode
   */
  async submitComplaint(formData) {
    const {
      issueTitle,
      issueCategory,
      description,
      severity = 'medium',
      wardId,
      locality,
      streetName,
      landmark,
      latitude,
      longitude,
      accuracyMeters,
      citizenName,
      citizenPhone,
      citizenEmail,
      preferredLanguage = 'en',
      mediaFiles = [],
    } = formData;

    if (!isSupabaseConfigured()) {
      // Create local production-shaped complaint with unique NC-MBMC identifier
      const currentList = getStoredComplaints();
      const currentYear = new Date().getFullYear();
      const nextSeq = String(currentList.length + 8850).padStart(6, '0');
      const complaintNumber = `NC-MBMC-${currentYear}-${nextSeq}`;
      const trackingToken = Math.random().toString(36).substring(2, 18);
      const newId = `c0000001-0000-4000-a000-${Date.now().toString(16).padStart(12, '0')}`;

      const wardObj = WARDS_LIST.find((w) => w.id === wardId) || WARDS_LIST[3];

      const newComplaint = {
        id: newId,
        complaint_number: complaintNumber,
        tracking_token_hash: 'mock_hash_' + trackingToken,
        issue_title: issueTitle,
        issue_category: issueCategory,
        description,
        severity,
        status: 'submitted',
        state: 'Maharashtra',
        district: 'Thane',
        municipal_corporation: 'Mira-Bhayandar Municipal Corporation',
        ward_id: wardObj.id,
        ward_number: wardObj.ward_number,
        ward_name: wardObj.ward_name,
        locality,
        street_name: streetName,
        landmark,
        pincode: '401107',
        latitude: latitude ? parseFloat(latitude) : 19.2812,
        longitude: longitude ? parseFloat(longitude) : 72.8561,
        accuracy_meters: accuracyMeters || 3.0,
        citizen_name: citizenName,
        citizen_phone: citizenPhone,
        citizen_email: citizenEmail,
        preferred_language: preferredLanguage,
        submitted_at: new Date().toISOString(),
        verified_at: null,
        assigned_department_id: null,
        assigned_officer_id: null,
        department_name: 'Pending Assignment',
        department_code: 'UNASSIGNED',
        officer_name: 'Pending Verification',
        sla_hours: severity === 'critical' ? 12 : severity === 'high' ? 48 : 72,
        elapsed_hours: 0,
        media: mediaFiles.map((m, idx) => ({
          id: `media-${Date.now()}-${idx}`,
          storage_path: m.url || m.path || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
          media_type: m.type || 'image/jpeg',
          media_category: 'citizen_evidence',
          file_size_bytes: m.size || 2048000,
          metadata: { fileName: m.name || `photo_${idx + 1}.jpg` },
        })),
        timeline: [
          {
            id: `th-${Date.now()}`,
            old_status: null,
            new_status: 'submitted',
            remarks: 'Citizen grievance submitted successfully with verified coordinates and photo evidence.',
            created_at: new Date().toISOString(),
          },
        ],
      };

      const updatedList = [newComplaint, ...currentList];
      saveStoredComplaints(updatedList);

      return {
        id: newId,
        complaint_number: complaintNumber,
        tracking_token: trackingToken,
        status: 'submitted',
      };
    }

    // Call Supabase RPC submit_public_complaint
    const mediaPaths = mediaFiles.map((m) => m.path || m.url).filter(Boolean);

    const { data, error } = await supabase.rpc('submit_public_complaint', {
      p_issue_title: issueTitle,
      p_issue_category: issueCategory,
      p_description: description,
      p_severity: severity,
      p_ward_id: wardId,
      p_locality: locality,
      p_street_name: streetName,
      p_landmark: landmark,
      p_latitude: latitude ? parseFloat(latitude) : null,
      p_longitude: longitude ? parseFloat(longitude) : null,
      p_accuracy_meters: accuracyMeters ? parseFloat(accuracyMeters) : null,
      p_citizen_name: citizenName,
      p_citizen_phone: citizenPhone,
      p_citizen_email: citizenEmail,
      p_preferred_language: preferredLanguage,
      p_media_paths: mediaPaths,
    });

    if (error) {
      console.error('Supabase submission error:', error);
      throw error;
    }

    return data;
  },

  /**
   * Track complaint with token or number
   */
  async trackComplaint(complaintNumber, trackingToken = null) {
    const cleanNumber = (complaintNumber || '').trim().toUpperCase();

    if (!isSupabaseConfigured()) {
      const list = getStoredComplaints();
      const matched = list.find((c) =>
        c.complaint_number.toUpperCase().includes(cleanNumber) ||
        cleanNumber.includes(c.complaint_number.toUpperCase()) ||
        c.id === cleanNumber
      );

      if (!matched) {
        return { found: false, message: 'No grievance record found with this reference number.' };
      }

      return {
        found: true,
        is_authorized: true,
        ...matched,
      };
    }

    const { data, error } = await supabase.rpc('track_complaint_public', {
      p_complaint_number: cleanNumber,
      p_tracking_token: trackingToken,
    });

    if (error) {
      console.error('Track complaint error:', error);
      throw error;
    }

    return data;
  },

  /**
   * Fetch complaints list with filters (ward, status, severity, category, search)
   */
  async getComplaints(filters = {}) {
    const {
      ward,
      status,
      severity,
      category,
      search,
      page = 1,
      pageSize = 20,
    } = filters;

    if (!isSupabaseConfigured()) {
      let list = getStoredComplaints();

      if (ward && ward !== 'all') {
        list = list.filter((c) =>
          String(c.ward_number) === String(ward).replace('w', '') ||
          c.ward_id === ward
        );
      }
      if (status && status !== 'all') {
        list = list.filter((c) => c.status === status);
      }
      if (severity && severity !== 'all') {
        list = list.filter((c) => c.severity === severity);
      }
      if (category && category !== 'all') {
        list = list.filter((c) => c.issue_category === category);
      }
      if (search && search.trim()) {
        const query = search.trim().toLowerCase();
        list = list.filter(
          (c) =>
            c.complaint_number.toLowerCase().includes(query) ||
            c.issue_title.toLowerCase().includes(query) ||
            (c.street_name && c.street_name.toLowerCase().includes(query)) ||
            (c.locality && c.locality.toLowerCase().includes(query)) ||
            (c.contractor_name && c.contractor_name.toLowerCase().includes(query))
        );
      }

      const totalCount = list.length;
      const startIndex = (page - 1) * pageSize;
      const paginated = list.slice(startIndex, startIndex + pageSize);

      return {
        complaints: paginated,
        total: totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      };
    }

    let query = supabase
      .from('complaints')
      .select('*, wards(ward_name, ward_number), departments(department_name, department_code), profiles:assigned_officer_id(full_name, designation), complaint_media(*)', { count: 'exact' });

    if (ward && ward !== 'all') {
      query = query.eq('ward_id', ward);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (severity && severity !== 'all') {
      query = query.eq('severity', severity);
    }
    if (category && category !== 'all') {
      query = query.eq('issue_category', category);
    }
    if (search && search.trim()) {
      query = query.or(`complaint_number.ilike.%${search}%,issue_title.ilike.%${search}%,street_name.ilike.%${search}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      complaints: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  },

  /**
   * Get single complaint by ID
   */
  async getComplaintById(id) {
    if (!isSupabaseConfigured()) {
      const list = getStoredComplaints();
      const item = list.find((c) => c.id === id || c.complaint_number === id);
      return item || null;
    }

    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        wards (*),
        departments (*),
        assigned_officer:assigned_officer_id (*),
        complaint_media (*),
        complaint_status_history (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update complaint status with audit remarks
   */
  async updateStatus(complaintId, newStatus, remarks = '') {
    if (!isSupabaseConfigured()) {
      const list = getStoredComplaints();
      const updatedList = list.map((c) => {
        if (c.id === complaintId || c.complaint_number === complaintId) {
          const oldStatus = c.status;
          const newHistory = {
            id: `th-${Date.now()}`,
            old_status: oldStatus,
            new_status: newStatus,
            remarks: remarks || `Status changed from ${oldStatus} to ${newStatus}`,
            created_at: new Date().toISOString(),
          };
          return {
            ...c,
            status: newStatus,
            timeline: [...(c.timeline || []), newHistory],
            updated_at: new Date().toISOString(),
          };
        }
        return c;
      });
      saveStoredComplaints(updatedList);
      return { success: true };
    }

    const { error } = await supabase
      .from('complaints')
      .update({ status: newStatus })
      .eq('id', complaintId);

    if (error) throw error;

    // Record audit remark
    await supabase.from('complaint_status_history').insert({
      complaint_id: complaintId,
      new_status: newStatus,
      remarks,
    });

    return { success: true };
  },

  /**
   * Assign department and officer to a complaint
   */
  async assignComplaint(complaintId, departmentId, officerId, notes = '') {
    if (!isSupabaseConfigured()) {
      const list = getStoredComplaints();
      const dept = DEPARTMENTS_LIST.find((d) => d.id === departmentId) || DEPARTMENTS_LIST[0];
      const updatedList = list.map((c) => {
        if (c.id === complaintId || c.complaint_number === complaintId) {
          return {
            ...c,
            status: 'assigned',
            assigned_department_id: departmentId,
            department_name: dept.department_name,
            department_code: dept.department_code,
            assigned_officer_id: officerId,
            officer_name: 'Er. Aniket Joshi (Assigned)',
            timeline: [
              ...(c.timeline || []),
              {
                id: `th-${Date.now()}`,
                old_status: c.status,
                new_status: 'assigned',
                remarks: `Assigned to ${dept.department_name}. Notes: ${notes || 'Immediate field dispatch'}`,
                created_at: new Date().toISOString(),
              },
            ],
          };
        }
        return c;
      });
      saveStoredComplaints(updatedList);
      return { success: true };
    }

    const { error } = await supabase
      .from('complaints')
      .update({
        assigned_department_id: departmentId,
        assigned_officer_id: officerId,
        status: 'assigned',
      })
      .eq('id', complaintId);

    if (error) throw error;

    await supabase.from('complaint_assignments').insert({
      complaint_id: complaintId,
      department_id: departmentId,
      assigned_to: officerId,
      assignment_notes: notes,
    });

    return { success: true };
  },

  /**
   * Field Worker submits inspection report with coordinates and notes
   */
  async submitInspection(complaintId, inspectionData) {
    const { inspectorId, notes, result, latitude, longitude, media = [] } = inspectionData;

    if (!isSupabaseConfigured()) {
      const list = getStoredComplaints();
      const updatedList = list.map((c) => {
        if (c.id === complaintId || c.complaint_number === complaintId) {
          return {
            ...c,
            status: 'in_progress',
            timeline: [
              ...(c.timeline || []),
              {
                id: `th-${Date.now()}`,
                old_status: c.status,
                new_status: 'in_progress',
                remarks: `Field inspection conducted: ${notes}. Result: ${result}`,
                created_at: new Date().toISOString(),
              },
            ],
            media: [
              ...(c.media || []),
              ...media.map((m, i) => ({
                id: `m-insp-${Date.now()}-${i}`,
                storage_path: m.url || m.path,
                media_type: 'image/jpeg',
                media_category: 'inspection',
                metadata: { notes },
              })),
            ],
          };
        }
        return c;
      });
      saveStoredComplaints(updatedList);
      return { success: true };
    }

    const { data, error } = await supabase.from('field_inspections').insert({
      complaint_id: complaintId,
      inspector_id: inspectorId,
      inspection_notes: notes,
      inspection_result: result,
      latitude,
      longitude,
    }).select().single();

    if (error) throw error;

    // Update complaint status
    await this.updateStatus(complaintId, 'in_progress', `Inspection recorded: ${notes}`);

    return data;
  },

  /**
   * Field Worker marks complaint resolved and uploads resolution proof
   */
  async submitResolution(complaintId, resolutionData) {
    const { notes, media = [] } = resolutionData;

    if (!isSupabaseConfigured()) {
      const list = getStoredComplaints();
      const updatedList = list.map((c) => {
        if (c.id === complaintId || c.complaint_number === complaintId) {
          return {
            ...c,
            status: 'resolved',
            resolved_at: new Date().toISOString(),
            timeline: [
              ...(c.timeline || []),
              {
                id: `th-${Date.now()}`,
                old_status: c.status,
                new_status: 'resolved',
                remarks: `Work completed by field team. Notes: ${notes}`,
                created_at: new Date().toISOString(),
              },
            ],
            media: [
              ...(c.media || []),
              ...media.map((m, i) => ({
                id: `m-res-${Date.now()}-${i}`,
                storage_path: m.url || m.path,
                media_type: 'image/jpeg',
                media_category: 'resolution_evidence',
                metadata: { notes },
              })),
            ],
          };
        }
        return c;
      });
      saveStoredComplaints(updatedList);
      return { success: true };
    }

    const { error } = await supabase
      .from('complaints')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
      })
      .eq('id', complaintId);

    if (error) throw error;

    await supabase.from('complaint_status_history').insert({
      complaint_id: complaintId,
      old_status: 'in_progress',
      new_status: 'resolved',
      remarks: `Resolution submitted: ${notes}`,
    });

    return { success: true };
  },

  /**
   * Subscribe to real-time complaint updates
   */
  subscribeToComplaints(callback) {
    if (!isSupabaseConfigured()) {
      return {
        unsubscribe: () => {},
      };
    }

    const channel = supabase
      .channel('public:complaints')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'complaints' },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  },
};

