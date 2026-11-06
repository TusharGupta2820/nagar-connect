/**
 * NAGAR CONNECT - Municipal CSV Export Utility
 * Generates and downloads RFC 4180-compliant CSV files containing citizen complaint dossiers.
 * Includes UTF-8 BOM (\uFEFF) to guarantee correct rendering of Devanagari (Marathi/Hindi) characters in Microsoft Excel.
 */

export const exportComplaintsToCSV = (complaints = [], customFilename = null) => {
  if (!complaints || !complaints.length) {
    alert('No citizen grievance records available to export.');
    return;
  }

  const headers = [
    'Docket Reference ID',
    'Submission Date & Time (IST)',
    'Current Status',
    'Severity Level',
    'Issue Category',
    'Issue Title',
    'Detailed Description',
    'Citizen Full Name',
    'Citizen Mobile Phone',
    'Citizen Email Address',
    'Preferred SMS Language',
    'Ward Number',
    'Ward Name',
    'Locality / Area',
    'Street Name',
    'Landmark',
    'Pincode',
    'GPS Latitude',
    'GPS Longitude',
    'GPS Accuracy (Meters)',
    'Assigned Department',
    'Assigned Department Code',
    'Nodal Officer / Contractor',
    'SLA Benchmark (Hours)',
    'Verified At',
    'Resolved At',
    'Photo Evidence Count',
    'Photo Evidence URLs',
    'Municipal Corporation',
  ];

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '""';
    const stringVal = String(value).replace(/"/g, '""');
    return `"${stringVal}"`;
  };

  const rows = complaints.map((c) => {
    // Parse photos
    const photoUrls = (c.media || [])
      .map((m) => m.storage_path || m.url || '')
      .filter(Boolean)
      .join(' | ');

    const submittedDate = c.submitted_at || c.created_at
      ? new Date(c.submitted_at || c.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      : 'N/A';

    const verifiedDate = c.verified_at
      ? new Date(c.verified_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      : 'Pending Verification';

    const resolvedDate = c.resolved_at
      ? new Date(c.resolved_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      : 'In Progress';

    return [
      escapeCSV(c.complaint_number || c.id),
      escapeCSV(submittedDate),
      escapeCSV((c.status || 'submitted').toUpperCase()),
      escapeCSV((c.severity || 'medium').toUpperCase()),
      escapeCSV(c.issue_category || 'pothole'),
      escapeCSV(c.issue_title || ''),
      escapeCSV(c.description || ''),
      escapeCSV(c.citizen_name || 'Anonymous Citizen'),
      escapeCSV(c.citizen_phone || 'N/A'),
      escapeCSV(c.citizen_email || 'N/A'),
      escapeCSV(c.preferred_language || 'Marathi'),
      escapeCSV(c.ward_number || (c.wards && c.wards.ward_number) || 'N/A'),
      escapeCSV(c.ward_name || (c.wards && c.wards.ward_name) || 'N/A'),
      escapeCSV(c.locality || ''),
      escapeCSV(c.street_name || ''),
      escapeCSV(c.landmark || ''),
      escapeCSV(c.pincode || '401107'),
      escapeCSV(c.latitude || ''),
      escapeCSV(c.longitude || ''),
      escapeCSV(c.accuracy_meters || '3.0'),
      escapeCSV(c.department_name || (c.departments && c.departments.department_name) || 'Pending Assignment'),
      escapeCSV(c.department_code || (c.departments && c.departments.department_code) || 'MBMC-GEN'),
      escapeCSV(c.officer_name || c.contractor_name || 'Junior Engineer Nodal Pool'),
      escapeCSV(c.sla_hours || 48),
      escapeCSV(verifiedDate),
      escapeCSV(resolvedDate),
      escapeCSV((c.media && c.media.length) || 0),
      escapeCSV(photoUrls),
      escapeCSV('Mira-Bhayandar Municipal Corporation (MBMC)'),
    ].join(',');
  });

  // Include UTF-8 BOM (\uFEFF) for Devanagari text compatibility in Excel
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

  // Trigger browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);

  const today = new Date().toISOString().split('T')[0];
  const filename = customFilename || `MBMC_Citizen_Road_Complaints_${today}.csv`;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
