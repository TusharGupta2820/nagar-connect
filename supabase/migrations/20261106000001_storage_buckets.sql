-- ============================================================================
-- NAGAR CONNECT - Storage Buckets & Policies Migration
-- Buckets: complaint-evidence, inspection-evidence, resolution-evidence
-- ============================================================================

-- Create storage buckets if not already present
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('complaint-evidence', 'complaint-evidence', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
  ('inspection-evidence', 'inspection-evidence', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
  ('resolution-evidence', 'resolution-evidence', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies for complaint-evidence
CREATE POLICY "Public read complaint images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'complaint-evidence');

CREATE POLICY "Anyone can upload complaint evidence"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'complaint-evidence');

-- Storage Policies for inspection-evidence
CREATE POLICY "Authorized staff read inspection images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'inspection-evidence');

CREATE POLICY "Authorized staff upload inspection evidence"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'inspection-evidence' AND
    auth.role() = 'authenticated'
  );

-- Storage Policies for resolution-evidence
CREATE POLICY "Public and staff read resolution images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resolution-evidence');

CREATE POLICY "Authorized staff upload resolution evidence"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resolution-evidence' AND
    auth.role() = 'authenticated'
  );

