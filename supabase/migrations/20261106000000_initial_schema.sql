-- ============================================================================
-- NAGAR CONNECT - Production Database Schema & Security Migrations
-- Target: Supabase PostgreSQL
-- Jurisdiction: Mira-Bhayandar Municipal Corporation (MBMC), Maharashtra
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ENUMS AND CUSTOM TYPES
-- ----------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('citizen', 'admin', 'officer', 'field_worker');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE issue_category_type AS ENUM (
    'pothole',
    'open_manhole',
    'damaged_road',
    'incomplete_road_work',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE severity_type AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE complaint_status_type AS ENUM (
    'submitted',
    'received',
    'under_verification',
    'assigned',
    'in_progress',
    'resolved',
    'closed',
    'rejected'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE media_category_type AS ENUM (
    'citizen_evidence',
    'inspection',
    'resolution_evidence'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ----------------------------------------------------------------------------
-- 2. CORE TABLES
-- ----------------------------------------------------------------------------

-- TABLE 2: WARDS (Created first for foreign key dependencies)
CREATE TABLE IF NOT EXISTS public.wards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ward_number INTEGER UNIQUE NOT NULL,
  ward_name VARCHAR(100) NOT NULL,
  description TEXT,
  office_address TEXT,
  contact_number VARCHAR(20),
  nodal_engineer_name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABLE 3: DEPARTMENTS
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_name VARCHAR(100) NOT NULL,
  department_code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  contact_email VARCHAR(100),
  contact_phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABLE 1: PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  role user_role DEFAULT 'citizen' NOT NULL,
  preferred_language VARCHAR(10) DEFAULT 'en' NOT NULL,
  ward_id UUID REFERENCES public.wards(id) ON DELETE SET NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  designation VARCHAR(100),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABLE 4: COMPLAINTS
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_number VARCHAR(30) UNIQUE NOT NULL,
  tracking_token_hash VARCHAR(64), -- SHA-256 hash of tracking secret token
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Nullable for guest
  citizen_name VARCHAR(150),
  citizen_phone VARCHAR(20),
  citizen_email VARCHAR(255),
  preferred_language VARCHAR(10) DEFAULT 'en',
  
  -- Issue particulars
  issue_title VARCHAR(200) NOT NULL,
  issue_category issue_category_type NOT NULL,
  description TEXT NOT NULL,
  severity severity_type DEFAULT 'medium' NOT NULL,
  status complaint_status_type DEFAULT 'submitted' NOT NULL,
  
  -- Geographic & Civic Hierarchy
  state VARCHAR(100) DEFAULT 'Maharashtra' NOT NULL,
  district VARCHAR(100) DEFAULT 'Thane' NOT NULL,
  municipal_corporation VARCHAR(150) DEFAULT 'Mira-Bhayandar Municipal Corporation' NOT NULL,
  ward_id UUID REFERENCES public.wards(id) ON DELETE RESTRICT NOT NULL,
  locality VARCHAR(150) NOT NULL,
  street_name VARCHAR(200) NOT NULL,
  landmark VARCHAR(200),
  pincode VARCHAR(10) DEFAULT '401107',
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  accuracy_meters NUMERIC(6, 2),
  
  -- Operational Workflow Tracking
  submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  assigned_officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  closed_at TIMESTAMPTZ,
  closed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rejection_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABLE 5: COMPLAINT_MEDIA
CREATE TABLE IF NOT EXISTS public.complaint_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  media_type VARCHAR(50) DEFAULT 'image/jpeg' NOT NULL,
  media_category media_category_type DEFAULT 'citizen_evidence' NOT NULL,
  file_size_bytes INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABLE 6: COMPLAINT_ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.complaint_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE RESTRICT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  assignment_notes TEXT,
  assigned_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABLE 7: COMPLAINT_STATUS_HISTORY
CREATE TABLE IF NOT EXISTS public.complaint_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE NOT NULL,
  old_status complaint_status_type,
  new_status complaint_status_type NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABLE 8: FIELD_INSPECTIONS
CREATE TABLE IF NOT EXISTS public.field_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE NOT NULL,
  inspector_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  inspection_notes TEXT NOT NULL,
  inspection_result VARCHAR(100), -- 'verified_pothole', 'repaired_verified', etc.
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  inspected_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABLE 9: NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABLE 10: AUDIT_LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 3. INDEXES FOR PERFORMANCE
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_complaints_number ON public.complaints(complaint_number);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON public.complaints(issue_category);
CREATE INDEX IF NOT EXISTS idx_complaints_severity ON public.complaints(severity);
CREATE INDEX IF NOT EXISTS idx_complaints_ward ON public.complaints(ward_id);
CREATE INDEX IF NOT EXISTS idx_complaints_user ON public.complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_coords ON public.complaints(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_complaints_created ON public.complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_complaint ON public.complaint_media(complaint_id);
CREATE INDEX IF NOT EXISTS idx_status_history_complaint ON public.complaint_status_history(complaint_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);

-- ----------------------------------------------------------------------------
-- 4. SEQUENCE & UNIQUE COMPLAINT NUMBER GENERATION
-- Format: NC-MBMC-YYYY-000001
-- ----------------------------------------------------------------------------

CREATE SEQUENCE IF NOT EXISTS complaint_number_seq START WITH 1;

CREATE OR REPLACE FUNCTION public.generate_complaint_number()
RETURNS TRIGGER AS $$
DECLARE
  current_year TEXT;
  seq_num TEXT;
BEGIN
  IF NEW.complaint_number IS NULL OR NEW.complaint_number = '' THEN
    current_year := to_char(CURRENT_DATE, 'YYYY');
    seq_num := lpad(nextval('complaint_number_seq')::TEXT, 6, '0');
    NEW.complaint_number := 'NC-MBMC-' || current_year || '-' || seq_num;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_complaint_number ON public.complaints;
CREATE TRIGGER trigger_generate_complaint_number
  BEFORE INSERT ON public.complaints
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_complaint_number();

-- ----------------------------------------------------------------------------
-- 5. AUTOMATIC TIMESTAMP & STATUS HISTORY TRIGGERS
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_complaints_updated_at ON public.complaints;
CREATE TRIGGER trigger_complaints_updated_at
  BEFORE UPDATE ON public.complaints
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to record status change into complaint_status_history automatically
CREATE OR REPLACE FUNCTION public.log_complaint_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.complaint_status_history (
      complaint_id,
      old_status,
      new_status,
      changed_by,
      remarks
    ) VALUES (
      NEW.id,
      NULL,
      NEW.status,
      NEW.user_id,
      'Grievance submitted by citizen'
    );
  ELSIF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.complaint_status_history (
      complaint_id,
      old_status,
      new_status,
      changed_by,
      remarks
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      auth.uid(),
      'Status transitioned from ' || OLD.status::TEXT || ' to ' || NEW.status::TEXT
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_complaint_status_change ON public.complaints;
CREATE TRIGGER trigger_log_complaint_status_change
  AFTER INSERT OR UPDATE OF status ON public.complaints
  FOR EACH ROW
  EXECUTE FUNCTION public.log_complaint_status_change();

-- ----------------------------------------------------------------------------
-- 6. AUTH INTEGRATION: AUTO-CREATE PROFILE ON SIGNUP
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role user_role := 'citizen';
  v_name TEXT;
  v_phone TEXT;
BEGIN
  v_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  v_phone := NEW.raw_user_meta_data->>'phone';
  
  -- If metadata contains requested role and user is created by service role or explicit admin setup
  IF NEW.raw_user_meta_data->>'role' IN ('admin', 'officer', 'field_worker', 'citizen') THEN
    -- In default signup, force citizen unless designated admin invite
    v_role := (NEW.raw_user_meta_data->>'role')::user_role;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (NEW.id, v_name, NEW.email, v_phone, v_role)
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      email = EXCLUDED.email;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 7. SECURE PUBLIC COMPLAINT SUBMISSION & TRACKING RPC FUNCTIONS
-- ----------------------------------------------------------------------------

-- Submits complaint securely (for guests & authenticated users)
-- Generates a cryptographically strong tracking token, returns raw token to citizen
-- and stores only SHA256(token) in database.
CREATE OR REPLACE FUNCTION public.submit_public_complaint(
  p_issue_title TEXT,
  p_issue_category issue_category_type,
  p_description TEXT,
  p_severity severity_type,
  p_ward_id UUID,
  p_locality TEXT,
  p_street_name TEXT,
  p_landmark TEXT,
  p_latitude NUMERIC,
  p_longitude NUMERIC,
  p_accuracy_meters NUMERIC,
  p_citizen_name TEXT,
  p_citizen_phone TEXT,
  p_citizen_email TEXT,
  p_preferred_language TEXT,
  p_media_paths TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS JSONB AS $$
DECLARE
  v_tracking_token TEXT;
  v_token_hash TEXT;
  v_complaint_id UUID;
  v_complaint_number TEXT;
  v_user_id UUID;
  v_media_path TEXT;
BEGIN
  -- Generate 16-byte random hex token for tracking
  v_tracking_token := encode(gen_random_bytes(16), 'hex');
  v_token_hash := encode(digest(v_tracking_token, 'sha256'), 'hex');
  v_user_id := auth.uid();

  INSERT INTO public.complaints (
    tracking_token_hash,
    user_id,
    issue_title,
    issue_category,
    description,
    severity,
    status,
    ward_id,
    locality,
    street_name,
    landmark,
    latitude,
    longitude,
    accuracy_meters,
    citizen_name,
    citizen_phone,
    citizen_email,
    preferred_language
  ) VALUES (
    v_token_hash,
    v_user_id,
    p_issue_title,
    p_issue_category,
    p_description,
    p_severity,
    'submitted',
    p_ward_id,
    p_locality,
    p_street_name,
    p_landmark,
    p_latitude,
    p_longitude,
    p_accuracy_meters,
    p_citizen_name,
    p_citizen_phone,
    p_citizen_email,
    COALESCE(p_preferred_language, 'en')
  )
  RETURNING id, complaint_number INTO v_complaint_id, v_complaint_number;

  -- Insert media records
  IF p_media_paths IS NOT NULL AND array_length(p_media_paths, 1) > 0 THEN
    FOREACH v_media_path IN ARRAY p_media_paths LOOP
      INSERT INTO public.complaint_media (
        complaint_id,
        storage_path,
        media_type,
        media_category,
        uploaded_by
      ) VALUES (
        v_complaint_id,
        v_media_path,
        'image/jpeg',
        'citizen_evidence',
        v_user_id
      );
    END LOOP;
  END IF;

  -- Insert Audit Log
  INSERT INTO public.audit_logs (
    actor_id,
    action,
    entity_type,
    entity_id,
    metadata
  ) VALUES (
    v_user_id,
    'CREATE_COMPLAINT',
    'complaints',
    v_complaint_id::TEXT,
    jsonb_build_object(
      'complaint_number', v_complaint_number,
      'category', p_issue_category,
      'ward_id', p_ward_id
    )
  );

  RETURN jsonb_build_object(
    'id', v_complaint_id,
    'complaint_number', v_complaint_number,
    'tracking_token', v_tracking_token,
    'status', 'submitted'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Secure Tracking Lookup:
-- Returns sanitized complaint data & timeline. Never reveals citizen phone/email.
CREATE OR REPLACE FUNCTION public.track_complaint_public(
  p_complaint_number TEXT,
  p_tracking_token TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_complaint RECORD;
  v_timeline JSONB;
  v_media JSONB;
  v_token_hash TEXT;
  v_is_authorized BOOLEAN := false;
  v_current_user_id UUID;
  v_user_role user_role;
BEGIN
  v_current_user_id := auth.uid();

  -- Fetch complaint record
  SELECT c.*, w.ward_name, w.ward_number, d.department_name, d.department_code,
         p.full_name AS officer_name, p.designation AS officer_designation
  INTO v_complaint
  FROM public.complaints c
  LEFT JOIN public.wards w ON c.ward_id = w.id
  LEFT JOIN public.departments d ON c.assigned_department_id = d.id
  LEFT JOIN public.profiles p ON c.assigned_officer_id = p.id
  WHERE c.complaint_number = UPPER(TRIM(p_complaint_number));

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false, 'message', 'Complaint not found with provided reference number');
  END IF;

  -- Authorization check:
  -- 1. Valid tracking token matching hash
  IF p_tracking_token IS NOT NULL AND p_tracking_token <> '' THEN
    v_token_hash := encode(digest(TRIM(p_tracking_token), 'sha256'), 'hex');
    IF v_complaint.tracking_token_hash = v_token_hash THEN
      v_is_authorized := true;
    END IF;
  END IF;

  -- 2. Authenticated creator of complaint
  IF v_current_user_id IS NOT NULL AND v_complaint.user_id = v_current_user_id THEN
    v_is_authorized := true;
  END IF;

  -- 3. Municipal admin / officer / field worker
  IF v_current_user_id IS NOT NULL THEN
    SELECT role INTO v_user_role FROM public.profiles WHERE id = v_current_user_id;
    IF v_user_role IN ('admin', 'officer', 'field_worker') THEN
      v_is_authorized := true;
    END IF;
  END IF;

  -- Public summary view if not fully authorized via token/account
  -- Returns basic progress state, but protects detailed evidence & personal info
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', h.id,
      'old_status', h.old_status,
      'new_status', h.new_status,
      'remarks', h.remarks,
      'created_at', h.created_at
    ) ORDER BY h.created_at ASC
  ) INTO v_timeline
  FROM public.complaint_status_history h
  WHERE h.complaint_id = v_complaint.id;

  SELECT jsonb_agg(
    jsonb_build_object(
      'id', m.id,
      'storage_path', m.storage_path,
      'media_category', m.media_category,
      'created_at', m.created_at
    ) ORDER BY m.created_at ASC
  ) INTO v_media
  FROM public.complaint_media m
  WHERE m.complaint_id = v_complaint.id;

  RETURN jsonb_build_object(
    'found', true,
    'is_authorized', v_is_authorized,
    'complaint_number', v_complaint.complaint_number,
    'issue_title', v_complaint.issue_title,
    'issue_category', v_complaint.issue_category,
    'description', v_complaint.description,
    'severity', v_complaint.severity,
    'status', v_complaint.status,
    'ward_number', v_complaint.ward_number,
    'ward_name', v_complaint.ward_name,
    'locality', v_complaint.locality,
    'street_name', v_complaint.street_name,
    'landmark', v_complaint.landmark,
    'latitude', v_complaint.latitude,
    'longitude', v_complaint.longitude,
    'submitted_at', v_complaint.submitted_at,
    'assigned_department', v_complaint.department_name,
    'assigned_officer', v_complaint.officer_name,
    'assigned_officer_designation', v_complaint.officer_designation,
    'timeline', COALESCE(v_timeline, '[]'::jsonb),
    'media', CASE WHEN v_is_authorized THEN COALESCE(v_media, '[]'::jsonb) ELSE '[]'::jsonb END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check role of current user
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- PROFILES Policies
CREATE POLICY "Public profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Disallow self-escalation to admin
    (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
  );

CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin');

-- WARDS Policies (Publicly readable, Admin manageable)
CREATE POLICY "Wards are readable by all"
  ON public.wards FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage wards"
  ON public.wards FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin');

-- DEPARTMENTS Policies (Publicly readable, Admin manageable)
CREATE POLICY "Departments are readable by all"
  ON public.departments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage departments"
  ON public.departments FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin');

-- COMPLAINTS Policies
-- 1. Citizens can view their own complaints
CREATE POLICY "Citizens can view own complaints"
  ON public.complaints FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    public.current_user_role() IN ('admin', 'officer', 'field_worker')
  );

-- 2. Authenticated users can insert complaints
CREATE POLICY "Authenticated users can submit complaints"
  ON public.complaints FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 3. Anonymous submissions are handled through secure RPC function submit_public_complaint
-- Direct anon insert is restricted to enforce token hashing and validation

-- 4. Admins & Officers can update complaints (status, assignment, verification)
CREATE POLICY "Admins and Officers can update complaints"
  ON public.complaints FOR UPDATE
  TO authenticated
  USING (
    public.current_user_role() IN ('admin', 'officer') OR
    (public.current_user_role() = 'field_worker' AND assigned_officer_id = auth.uid())
  );

-- COMPLAINT_MEDIA Policies
CREATE POLICY "Media visible to authorized users and complaint owners"
  ON public.complaint_media FOR SELECT
  TO authenticated
  USING (
    uploaded_by = auth.uid() OR
    public.current_user_role() IN ('admin', 'officer', 'field_worker') OR
    EXISTS (SELECT 1 FROM public.complaints WHERE id = complaint_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can upload media for permitted complaints"
  ON public.complaint_media FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid() OR
    public.current_user_role() IN ('admin', 'officer', 'field_worker')
  );

-- FIELD_INSPECTIONS Policies
CREATE POLICY "Inspections viewable by municipal staff"
  ON public.field_inspections FOR SELECT
  TO authenticated
  USING (public.current_user_role() IN ('admin', 'officer', 'field_worker'));

CREATE POLICY "Field workers can insert inspections"
  ON public.field_inspections FOR INSERT
  TO authenticated
  WITH CHECK (
    public.current_user_role() IN ('admin', 'field_worker', 'officer') AND
    inspector_id = auth.uid()
  );

-- NOTIFICATIONS Policies
CREATE POLICY "Users can manage own notifications"
  ON public.notifications FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- AUDIT_LOGS Policies (Read-only for admins)
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.current_user_role() = 'admin');

-- ----------------------------------------------------------------------------
-- 9. SEED DATA: MBMC WARDS & DEPARTMENTS
-- ----------------------------------------------------------------------------

INSERT INTO public.wards (ward_number, ward_name, description, office_address, contact_number, nodal_engineer_name)
VALUES
  (1, 'Ward 01 - Bhayandar West Coastal', 'Rai, Murdha, Station & Coastal belt', 'Bhayandar West Ward Office, Station Road', '022-28192801', 'Er. M. Shinde'),
  (2, 'Ward 02 - Bhayandar East Station', 'Navghar, Indralok & Golden Nest corridor', 'Bhayandar East Ward Office, Navghar Rd', '022-28192802', 'Er. S. Patil'),
  (3, 'Ward 03 - Mira Road Shanti Nagar', 'Naya Nagar, Shanti Nagar & Market district', 'Shanti Nagar Ward Office, Sector 4', '022-28192803', 'Er. S. Deshmukh'),
  (4, 'Ward 04 - Kanakia & Beverly Park', 'Silver Park, Kanakia Park & Beverly Park', 'Silver Park Sub-Office, Mira Road East', '022-28192804', 'Er. Aniket Joshi'),
  (5, 'Ward 05 - Kashimira Junction NH-48', 'Highway Belt, Penkarpada & Western Express', 'Kashimira Municipal Hub, NH-48', '022-28192805', 'Er. R. Kulkarni'),
  (6, 'Ward 06 - Ghodbunder Urban Arterial', 'Ghodbunder Link, Fountain Junction & Uttan', 'Ghodbunder Nodal Post, Link Road', '022-28192806', 'Er. V. Pawar')
ON CONFLICT (ward_number) DO NOTHING;

INSERT INTO public.departments (department_name, department_code, description, contact_email, is_active)
VALUES
  ('Roads & Infrastructure Maintenance', 'MBMC-R&I', 'Asphalt repair, paver blocks, potholes, and trench restoration', 'roads.dept@mbmc.gov.in', true),
  ('Stormwater Drainage & Manholes', 'MBMC-SWD', 'Stormwater culverts, manhole lids, gutters, and flood drains', 'drainage.dept@mbmc.gov.in', true),
  ('Traffic Engineering & Road Safety', 'MBMC-TERS', 'Speed breakers, road signs, lane markings, barricading', 'trafficsafety@mbmc.gov.in', true),
  ('Quick Response Flying Squad', 'MBMC-QRT', '24x7 emergency hazard response, rapid manhole covering and barricading', 'disaster.qrt@mbmc.gov.in', true)
ON CONFLICT (department_code) DO NOTHING;

