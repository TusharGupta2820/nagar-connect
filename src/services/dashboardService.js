import { complaintService } from './complaintService';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const dashboardService = {
  /**
   * Get KPI aggregate statistics
   */
  async getStats(wardId = 'all', timeRange = '30d') {
    if (!isSupabaseConfigured()) {
      const { complaints } = await complaintService.getComplaints({ ward: wardId, pageSize: 1000 });
      const total = complaints.length;
      const critical = complaints.filter((c) => c.severity === 'critical' && c.status !== 'resolved' && c.status !== 'closed').length;
      const inProgress = complaints.filter((c) => c.status === 'in_progress' || c.status === 'assigned').length;
      const verification = complaints.filter((c) => c.status === 'under_verification' || c.status === 'submitted').length;
      const resolved = complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length;

      return {
        totalLogged: 4821 + total - 5,
        fieldVerification: 184 + verification - 2,
        activeWorkInProgress: 342 + inProgress - 2,
        resolvedAndVerified: 4198 + resolved - 1,
        criticalSLABreaches: 14 + critical - 2,
        avgTurnaroundHours: 18.4,
        citizenSatisfaction: 87.5,
      };
    }

    // Query real Supabase statistics
    let baseQuery = supabase.from('complaints').select('status, severity', { count: 'exact' });
    if (wardId && wardId !== 'all') {
      baseQuery = baseQuery.eq('ward_id', wardId);
    }

    const { data, count, error } = await baseQuery;
    if (error) throw error;

    const totalLogged = count || 0;
    const critical = data.filter((c) => c.severity === 'critical' && c.status !== 'resolved' && c.status !== 'closed').length;
    const inProgress = data.filter((c) => c.status === 'in_progress' || c.status === 'assigned').length;
    const verification = data.filter((c) => c.status === 'under_verification' || c.status === 'submitted').length;
    const resolved = data.filter((c) => c.status === 'resolved' || c.status === 'closed').length;

    return {
      totalLogged,
      fieldVerification: verification,
      activeWorkInProgress: inProgress,
      resolvedAndVerified: resolved,
      criticalSLABreaches: critical,
      avgTurnaroundHours: 21.2,
      citizenSatisfaction: 88,
    };
  },

  /**
   * Get 7-day complaint inflow vs resolution velocity
   */
  async getInflowVsResolution() {
    return [
      { day: 'Mon', inflow: 110, resolved: 130 },
      { day: 'Tue', inflow: 85, resolved: 105 },
      { day: 'Wed', inflow: 95, resolved: 80 },
      { day: 'Thu', inflow: 50, resolved: 65 },
      { day: 'Fri', inflow: 70, resolved: 55 },
      { day: 'Sat', inflow: 35, resolved: 40 },
      { day: 'Sun', inflow: 60, resolved: 45 },
    ];
  },

  /**
   * Get defect category breakdown distribution
   */
  async getDefectDistribution() {
    return [
      { name: 'Potholes / खड्डे', value: 54, color: '#00162c' },
      { name: 'Paver Blocks / पेव्हर ब्लॉक', value: 22, color: '#325f9b' },
      { name: 'Open Manholes / उघडी गटारे', value: 14, color: '#ba1a1a' },
      { name: 'Utility Trench / चर', value: 10, color: '#d97706' },
    ];
  },

  /**
   * Get ward-wise turnaround time & SLA adherence
   */
  async getWardTurnaroundStats() {
    return [
      { ward: 'Ward 04', name: 'Kanakia & Beverly', hours: 14.2, slaPercentage: 96, status: 'excellent' },
      { ward: 'Ward 01', name: 'Bhayandar West', hours: 18.5, slaPercentage: 91, status: 'excellent' },
      { ward: 'Ward 03', name: 'Mira Road Central', hours: 22.0, slaPercentage: 85, status: 'good' },
      { ward: 'Ward 02', name: 'Bhayandar East', hours: 24.8, slaPercentage: 80, status: 'good' },
      { ward: 'Ward 06', name: 'Ghodbunder Corridor', hours: 29.4, slaPercentage: 73, status: 'warning' },
      { ward: 'Ward 05', name: 'Kashimira Highway', hours: 34.6, slaPercentage: 64, status: 'breach' },
    ];
  },

  /**
   * Export complaints data to CSV
   */
  exportToCSV(complaints) {
    if (!complaints || complaints.length === 0) return;

    const headers = [
      'Complaint ID',
      'Issue Title',
      'Category',
      'Severity',
      'Status',
      'Ward',
      'Locality',
      'Street Name',
      'Landmark',
      'Latitude',
      'Longitude',
      'Citizen Name',
      'Citizen Phone',
      'Submitted At',
      'Assigned Department',
      'Assigned Officer',
    ];

    const rows = complaints.map((c) => [
      c.complaint_number || c.id,
      `"${(c.issue_title || '').replace(/"/g, '""')}"`,
      c.issue_category,
      c.severity,
      c.status,
      c.ward_name || c.ward_number || '',
      `"${(c.locality || '').replace(/"/g, '""')}"`,
      `"${(c.street_name || '').replace(/"/g, '""')}"`,
      `"${(c.landmark || '').replace(/"/g, '""')}"`,
      c.latitude || '',
      c.longitude || '',
      `"${(c.citizen_name || '').replace(/"/g, '""')}"`,
      c.citizen_phone || '',
      c.submitted_at || c.created_at,
      `"${(c.department_name || '').replace(/"/g, '""')}"`,
      `"${(c.officer_name || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MBMC_Complaints_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

