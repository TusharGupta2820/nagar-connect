import React, { useState, useEffect, useRef } from 'react';
import { complaintService, WARDS_LIST, DEPARTMENTS_LIST } from '../../services/complaintService';
import { dashboardService } from '../../services/dashboardService';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [selectedWard, setSelectedWard] = useState('all');
  const [stats, setStats] = useState({
    totalLogged: 4821,
    fieldVerification: 184,
    activeWorkInProgress: 342,
    resolvedAndVerified: 4198,
    criticalSLABreaches: 17,
  });
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [tableFilter, setTableFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignDept, setAssignDept] = useState(DEPARTMENTS_LIST[0].id);
  const [assignNotes, setAssignNotes] = useState('');
  const inspectionDrawerRef = useRef(null);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const statsData = await dashboardService.getStats(selectedWard);
      setStats(statsData);

      const complaintsData = await complaintService.getComplaints({
        ward: selectedWard,
        status: tableFilter === 'all' ? undefined : tableFilter,
        search: searchQuery,
        pageSize: 50,
      });

      setComplaints(complaintsData.complaints || []);
      if (complaintsData.complaints?.length > 0 && !selectedComplaint) {
        setSelectedComplaint(complaintsData.complaints[0]);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedWard, tableFilter]);

  // Real-time updates subscription
  useEffect(() => {
    const sub = complaintService.subscribeToComplaints(() => {
      loadData();
    });
    return () => sub.unsubscribe();
  }, []);

  const handleStatusChange = async (newStatus) => {
    if (!selectedComplaint) return;
    try {
      await complaintService.updateStatus(selectedComplaint.id, newStatus, `Status updated to ${newStatus} via Executive Console`);
      alert(`Status updated to ${newStatus}`);
      loadData();
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    try {
      await complaintService.assignComplaint(
        selectedComplaint.id,
        assignDept,
        '00000000-0000-4000-a000-000000000002',
        assignNotes
      );
      setAssignModalOpen(false);
      alert('Department assigned successfully!');
      loadData();
    } catch (err) {
      alert(`Assignment failed: ${err.message}`);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    if (tableFilter === 'critical') return c.severity === 'critical';
    if (tableFilter === 'assigned') return c.status === 'assigned';
    if (tableFilter === 'verification') return c.status === 'under_verification' || c.status === 'submitted';
    if (tableFilter === 'inspection') return c.status === 'in_progress';
    return true;
  });

  const selectComplaintAndScroll = (c) => {
    setSelectedComplaint(c);
    if (window.innerWidth < 1280 && inspectionDrawerRef.current) {
      inspectionDrawerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full px-3 sm:px-margin py-space-sm sm:py-space-lg">
      <div className="flex flex-col w-full">
        {/* Top National & Civic Hairline Accent */}
        <div className="h-1 w-full flex rounded-full overflow-hidden shadow-sm mb-space-xs sm:mb-space-md">
          <div className="w-1/3 bg-[#FF9933] h-full"></div>
          <div className="w-1/3 bg-surface-container-lowest h-full"></div>
          <div className="w-1/3 bg-[#138808] h-full"></div>
        </div>

        {/* Demo Staging Authority Notice Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 px-3 py-1.5 bg-amber-50 rounded-lg shadow-sm mb-space-md border border-amber-200 text-xs">
          <div className="flex items-center gap-1.5 text-amber-900 truncate">
            <span className="material-symbols-outlined text-sm text-amber-700 shrink-0">verified_user</span>
            <span className="font-label-sm text-[10px] sm:text-xs uppercase tracking-wider font-semibold truncate">
              MBMC NIC-Integrated Gateway Active
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-800 font-code-sm text-[10px] sm:text-xs self-end sm:self-auto">
            <span>NODE: MBMC-ND04</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
          </div>
        </div>

        {/* Dashboard Header & Control Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm sm:gap-space-md mb-space-md sm:mb-space-lg">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="bg-primary-container text-on-primary text-[10px] sm:text-label-sm px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                Engineer Session
              </span>
              <span className="bg-surface-container text-secondary text-[10px] sm:text-label-sm px-2 py-0.5 rounded font-bold">
                डॅशबोर्ड २०२६
              </span>
            </div>
            <h1 className="text-lg sm:font-headline-lg sm:text-headline-lg font-bold text-on-surface tracking-tight">
              MBMC Central Civic Operations & Road Grievance Command
            </h1>
            <p className="text-xs text-on-surface-variant">
              Engineering & Quality Control Wing • Ward Divisions 1 to 6
            </p>
          </div>

          {/* Global Console Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full sm:w-auto bg-surface-container-lowest text-on-surface text-xs font-semibold px-3 py-2 rounded-lg shadow-sm border border-outline-variant/30 focus:outline-none min-h-[40px] cursor-pointer"
              >
                <option value="all">All Wards (W1 to W6)</option>
                {WARDS_LIST.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.ward_name.split('-')[0]}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-1 bg-surface-container-lowest text-on-surface text-xs font-semibold px-3 py-2 rounded-lg shadow-sm hover:bg-surface-container-high transition-colors border border-outline-variant/30 cursor-pointer min-h-[40px]"
            >
              <span className={`material-symbols-outlined text-base text-emerald-700 ${isRefreshing ? 'animate-spin' : ''}`}>
                autorenew
              </span>
              <span>LIVE SYNC</span>
            </button>
          </div>
        </div>

        {/* ==================== 5 GOVERNMENT GRADE TOP KPI CARDS ==================== */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-space-md mb-space-md sm:mb-space-lg">
          {/* KPI 1 */}
          <div className="bg-surface-container-lowest p-3 sm:p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Total Logged
              </span>
              <div className="p-1 rounded bg-primary-fixed text-primary">
                <span className="material-symbols-outlined text-sm sm:text-title-md">fact_check</span>
              </div>
            </div>
            <div className="my-1 sm:my-space-xs">
              <div className="text-xl sm:text-display-lg font-bold text-on-surface">
                {stats.totalLogged.toLocaleString()}
              </div>
              <p className="text-[10px] sm:text-label-sm text-emerald-800 flex items-center gap-0.5 font-semibold">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                <span>+12.4%</span>
              </p>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '78%' }}></div>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-surface-container-lowest p-3 sm:p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Verification
              </span>
              <div className="p-1 rounded bg-amber-100 text-amber-900">
                <span className="material-symbols-outlined text-sm sm:text-title-md">plagiarism</span>
              </div>
            </div>
            <div className="my-1 sm:my-space-xs">
              <div className="text-xl sm:text-display-lg font-bold text-on-surface">
                {stats.fieldVerification}
              </div>
              <p className="text-[10px] sm:text-label-sm text-amber-900 font-semibold truncate">
                Avg: 3.2 hrs
              </p>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-amber-600" style={{ width: '44%' }}></div>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-surface-container-lowest p-3 sm:p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Work In Progress
              </span>
              <div className="p-1 rounded bg-secondary-fixed text-on-secondary-fixed">
                <span className="material-symbols-outlined text-sm sm:text-title-md">engineering</span>
              </div>
            </div>
            <div className="my-1 sm:my-space-xs">
              <div className="text-xl sm:text-display-lg font-bold text-on-surface">
                {stats.activeWorkInProgress}
              </div>
              <p className="text-[10px] sm:text-label-sm text-secondary font-semibold truncate">
                On-track: 91%
              </p>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-secondary" style={{ width: '62%' }}></div>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-surface-container-lowest p-3 sm:p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Resolved
              </span>
              <div className="p-1 rounded bg-emerald-100 text-emerald-900">
                <span className="material-symbols-outlined text-sm sm:text-title-md">verified</span>
              </div>
            </div>
            <div className="my-1 sm:my-space-xs">
              <div className="text-xl sm:text-display-lg font-bold text-emerald-900">
                {stats.resolvedAndVerified.toLocaleString()}
              </div>
              <p className="text-[10px] sm:text-label-sm text-emerald-800 font-semibold truncate">
                SLA Compliance: 94.6%
              </p>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600" style={{ width: '95%' }}></div>
            </div>
          </div>

          {/* KPI 5 */}
          <div className="col-span-2 sm:col-span-1 bg-surface-container-lowest p-3 sm:p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-label-sm uppercase tracking-wider text-error font-semibold">
                Critical SLA
              </span>
              <div className="p-1 rounded bg-red-100 text-red-900">
                <span className="material-symbols-outlined text-sm sm:text-title-md">alarm</span>
              </div>
            </div>
            <div className="my-1 sm:my-space-xs">
              <div className="text-xl sm:text-display-lg font-bold text-error">
                {stats.criticalSLABreaches}
              </div>
              <p className="text-[10px] sm:text-label-sm text-error font-semibold truncate">
                Immediate Action Required
              </p>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-error" style={{ width: '35%' }}></div>
            </div>
          </div>
        </div>

        {/* ==================== LIVE OPERATIONS QUEUE & INSPECTION DRAWER ==================== */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
          {/* LEFT: Complaints Management Queue (8 cols) */}
          <div className="xl:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col border border-surface-container">
            {/* Table Controls */}
            <div className="p-3 sm:p-space-md bg-surface-container-low flex flex-col gap-2 sm:gap-space-sm border-b border-surface-container">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1">
                  <button
                    onClick={() => setTableFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[34px] ${
                      tableFilter === 'all'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    All ({complaints.length})
                  </button>
                  <button
                    onClick={() => setTableFilter('critical')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[34px] ${
                      tableFilter === 'critical'
                        ? 'bg-error text-on-error'
                        : 'bg-red-100 text-red-900 hover:bg-red-200'
                    }`}
                  >
                    Critical ({complaints.filter((c) => c.severity === 'critical').length})
                  </button>
                  <button
                    onClick={() => setTableFilter('assigned')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[34px] ${
                      tableFilter === 'assigned'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    Assigned ({complaints.filter((c) => c.status === 'assigned').length})
                  </button>
                  <button
                    onClick={() => setTableFilter('verification')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[34px] ${
                      tableFilter === 'verification'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    }`}
                  >
                    Verification ({complaints.filter((c) => c.status === 'under_verification' || c.status === 'submitted').length})
                  </button>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => dashboardService.exportToCSV(complaints)}
                    className="flex items-center gap-1 bg-surface-container-lowest text-on-surface px-3 py-1.5 rounded-lg shadow-sm text-xs font-semibold hover:bg-surface-container border border-outline-variant/30 min-h-[36px]"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Search Toolbar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Ticket ID (NC-MBMC-*), Road, or Landmark..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-secondary/40 border border-outline-variant/30 min-h-[40px]"
                  />
                </div>
                <span className="text-xs text-on-surface-variant hidden md:inline">
                  {filteredComplaints.length} records
                </span>
              </div>
            </div>

            {/* Mobile View: Phone friendly Complaint Cards */}
            <div className="block md:hidden divide-y divide-surface-container">
              {filteredComplaints.length === 0 ? (
                <div className="p-8 text-center text-xs text-on-surface-variant">
                  No grievances found.
                </div>
              ) : (
                filteredComplaints.map((c) => {
                  const isSelected = selectedComplaint?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => selectComplaintAndScroll(c)}
                      className={`p-3.5 space-y-2 cursor-pointer transition-colors ${
                        isSelected ? 'bg-surface-container-high/60 border-l-4 border-secondary' : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-primary flex items-center gap-1.5">
                          {c.severity === 'critical' && (
                            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                          )}
                          <span>{c.complaint_number}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                              c.severity === 'critical'
                                ? 'bg-error text-white'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {c.severity}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                              c.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-900'
                                : c.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {c.status?.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-primary">{c.issue_title}</h4>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">
                          Ward {c.ward_number || 4} • {c.street_name || c.locality}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-surface-container text-[11px]">
                        <span className="text-secondary font-mono font-bold">
                          {c.status === 'resolved' ? 'CLOSED' : `${c.sla_hours || 48}h SLA`}
                        </span>
                        <span className="text-xs font-semibold text-primary flex items-center gap-0.5">
                          <span>Inspect</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop View: Full Data Table */}
            <div className="hidden md:block overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-bold uppercase tracking-wider border-b border-surface-container">
                    <th className="py-2.5 px-3">Complaint ID</th>
                    <th className="py-2.5 px-3">Defect & Severity</th>
                    <th className="py-2.5 px-3">Ward & Location</th>
                    <th className="py-2.5 px-3">SLA Status</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filteredComplaints.map((c) => {
                    const isSelected = selectedComplaint?.id === c.id;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedComplaint(c)}
                        className={`hover:bg-surface-container-low transition-colors cursor-pointer ${
                          isSelected ? 'bg-surface-container-high/60 font-medium' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-primary flex items-center gap-1.5">
                          {c.severity === 'critical' && (
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                          )}
                          <span>{c.complaint_number}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-on-surface">{c.issue_title}</span>
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded w-fit uppercase ${
                                c.severity === 'critical'
                                  ? 'text-red-700 bg-red-100'
                                  : 'text-amber-800 bg-amber-100'
                              }`}
                            >
                              {c.severity}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col max-w-[180px]">
                            <span className="font-semibold truncate">
                              Ward {c.ward_number || 4} • {c.street_name || c.locality}
                            </span>
                            <span className="text-[11px] text-on-surface-variant truncate">
                              {c.landmark || 'MBMC Locus'}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div
                            className={`font-mono font-bold px-2 py-0.5 rounded w-fit text-[11px] ${
                              c.severity === 'critical'
                                ? 'text-red-700 bg-red-50'
                                : 'text-emerald-800 bg-emerald-50'
                            }`}
                          >
                            {c.status === 'resolved' ? 'CLOSED' : `${c.sla_hours || 48}h SLA`}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col">
                            <span className="font-semibold truncate">
                              {c.department_name || c.contractor_name || 'MBMC Operations'}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                              c.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-900'
                                : c.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {c.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            className="p-1 rounded hover:bg-surface-container text-secondary"
                            title="Inspect Docket"
                          >
                            <span className="material-symbols-outlined text-base">visibility</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: Quick Inspection Drawer (4 cols) */}
          <div
            ref={inspectionDrawerRef}
            className="xl:col-span-4 bg-surface-container-lowest rounded-xl shadow-sm p-4 sm:p-space-md flex flex-col gap-3 border border-surface-container"
          >
            {selectedComplaint ? (
              <>
                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-primary text-sm sm:text-base">
                      Ticket Inspection
                    </span>
                    <span className="font-code-sm font-bold text-secondary text-xs">
                      #{selectedComplaint.complaint_number}
                    </span>
                  </div>
                  <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded uppercase font-bold text-on-surface">
                    {selectedComplaint.status?.replace('_', ' ')}
                  </span>
                </div>

                {/* Evidence Photo */}
                <div className="h-40 rounded-xl overflow-hidden bg-surface-container shadow-inner">
                  <img
                    src={
                      selectedComplaint.media?.[0]?.storage_path ||
                      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
                    }
                    alt="Inspection Evidence"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-primary text-xs sm:text-sm block">
                    {selectedComplaint.issue_title}
                  </span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {selectedComplaint.description}
                  </p>
                </div>

                <div className="bg-surface-container-low p-2.5 rounded-xl text-xs space-y-1 border border-surface-container">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Ward:</span>
                    <span className="font-bold text-on-surface">{selectedComplaint.ward_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Landmark:</span>
                    <span className="font-bold text-on-surface truncate max-w-[180px]">
                      {selectedComplaint.landmark || selectedComplaint.street_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Coordinates:</span>
                    <span className="font-mono text-secondary font-bold text-[11px]">
                      {selectedComplaint.latitude}° N, {selectedComplaint.longitude}° E
                    </span>
                  </div>
                </div>

                {/* Administrative Operations CTAs */}
                <div className="space-y-2 pt-2 border-t border-surface-container">
                  <span className="text-[11px] uppercase font-bold text-on-surface-variant block">
                    Executive Actions:
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAssignModalOpen(true)}
                      className="px-3 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-1 shadow-sm min-h-[42px]"
                    >
                      <span className="material-symbols-outlined text-sm">assignment_ind</span>
                      <span>Assign Dept</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange('under_verification')}
                      className="px-3 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors flex items-center justify-center gap-1 shadow-sm min-h-[42px]"
                    >
                      <span className="material-symbols-outlined text-sm">verified</span>
                      <span>Verify Issue</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange('in_progress')}
                      className="px-3 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-primary transition-colors flex items-center justify-center gap-1 shadow-sm min-h-[42px]"
                    >
                      <span className="material-symbols-outlined text-sm">construction</span>
                      <span>Start Work</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange('resolved')}
                      className="px-3 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1 shadow-sm min-h-[42px]"
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span>Mark Resolved</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-on-surface-variant text-xs">
                Select a complaint from the table to view inspection details and execute actions.
              </div>
            )}
          </div>
        </div>

        {/* Assignment Modal */}
        {assignModalOpen && selectedComplaint && (
          <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-4 sm:p-space-lg shadow-2xl border border-surface-container space-y-space-md">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-primary text-sm sm:text-base">
                  Assign Docket #{selectedComplaint.complaint_number}
                </span>
                <button
                  onClick={() => setAssignModalOpen(false)}
                  className="text-on-surface-variant hover:text-error text-xl font-bold p-1"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleAssignSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-primary block">Select Responsible Department *</label>
                  <select
                    value={assignDept}
                    onChange={(e) => setAssignDept(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:outline-none min-h-[42px]"
                  >
                    {DEPARTMENTS_LIST.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.department_name} ({d.department_code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary block">Assignment Instructions / SLA Notes</label>
                  <textarea
                    rows="3"
                    value={assignNotes}
                    onChange={(e) => setAssignNotes(e.target.value)}
                    placeholder="e.g. Deploy cold mix bituminous patch immediately. Barricade crater during evening peak traffic."
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:outline-none text-base sm:text-xs"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAssignModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold min-h-[40px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-secondary min-h-[40px]"
                  >
                    Confirm Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
