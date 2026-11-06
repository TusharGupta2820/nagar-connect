import React, { useState, useEffect } from 'react';
import { complaintService, WARDS_LIST } from '../../services/complaintService';
import { dashboardService } from '../../services/dashboardService';
import { exportComplaintsToCSV } from '../../utils/csvExport';
import { Link } from 'react-router-dom';

export const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await complaintService.getComplaints({
        ward: selectedWard,
        status: selectedStatus,
        severity: selectedSeverity,
        search,
        page,
        pageSize: 15,
      });
      setComplaints(data.complaints || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedWard, selectedStatus, selectedSeverity, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchComplaints();
  };

  return (
    <div className="w-full px-3 sm:px-margin py-space-sm sm:py-space-lg space-y-space-md">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-surface-container pb-space-sm">
        <div>
          <h1 className="text-lg sm:font-headline-lg sm:text-headline-lg font-bold text-primary">
            Ward Dispatch & Complaint Queue
          </h1>
          <p className="text-xs text-on-surface-variant">
            Comprehensive municipal intake ledger across MBMC Wards 1 to 6
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={async () => {
              try {
                const allReports = await complaintService.getAllComplaintsForExport({
                  ward: selectedWard,
                  status: selectedStatus,
                  severity: selectedSeverity,
                });
                exportComplaintsToCSV(allReports, `MBMC_Citizen_Reports_Export_${new Date().toISOString().split('T')[0]}.csv`);
              } catch (err) {
                alert(`Export failed: ${err.message}`);
              }
            }}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm min-h-[40px] cursor-pointer"
            title="Download complete spreadsheet of citizen reports"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export Citizen CSV</span>
          </button>
          <Link
            to="/report"
            className="px-3 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-secondary flex items-center gap-1 shadow-sm min-h-[40px]"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Manual Docket</span>
          </Link>
        </div>
      </div>

      {/* Parametric Filter Toolbar */}
      <div className="bg-surface-container-lowest p-3 sm:p-space-md rounded-xl shadow-sm border border-surface-container space-y-space-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-2 sm:gap-space-sm items-stretch md:items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Docket Number, Road, Citizen Name, or Landmark..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-container-low text-xs border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary min-h-[42px]"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={selectedWard}
              onChange={(e) => {
                setSelectedWard(e.target.value);
                setPage(1);
              }}
              className="bg-surface-container-low text-xs font-semibold px-2.5 py-2.5 rounded-lg border border-outline-variant/40 focus:outline-none min-h-[42px]"
            >
              <option value="all">All Wards</option>
              {WARDS_LIST.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.ward_name.split('-')[0]}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="bg-surface-container-low text-xs font-semibold px-2.5 py-2.5 rounded-lg border border-outline-variant/40 focus:outline-none min-h-[42px]"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_verification">Under Verification</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => {
                setSelectedSeverity(e.target.value);
                setPage(1);
              }}
              className="bg-surface-container-low text-xs font-semibold px-2.5 py-2.5 rounded-lg border border-outline-variant/40 focus:outline-none min-h-[42px]"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-secondary min-h-[42px]"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Main Container: Mobile Cards (< md) + Desktop Table (>= md) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container">
        {/* Mobile View: Phone friendly Cards */}
        <div className="block md:hidden divide-y divide-surface-container">
          {complaints.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant text-xs">
              {loading ? 'Loading dockets...' : 'No grievances match the specified criteria.'}
            </div>
          ) : (
            complaints.map((c) => (
              <div key={c.id} className="p-3.5 space-y-2 hover:bg-surface-container-low transition-colors">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/admin/complaints/${c.id}`}
                    className="font-mono text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
                  >
                    {c.severity === 'critical' && (
                      <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                    )}
                    <span>{c.complaint_number}</span>
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                        c.severity === 'critical'
                          ? 'bg-error text-white'
                          : c.severity === 'high'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-surface-container text-on-surface'
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
                    {c.ward_name || `Ward ${c.ward_number}`} • {c.street_name || c.landmark}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-surface-container text-[11px]">
                  <span className="text-on-surface-variant font-mono">
                    {new Date(c.submitted_at || Date.now()).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                  <Link
                    to={`/admin/complaints/${c.id}`}
                    className="px-3 py-1.5 bg-secondary text-white rounded-lg text-xs font-semibold hover:bg-primary transition-colors flex items-center gap-1 min-h-[34px]"
                  >
                    <span>Inspect</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Full Data Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-bold uppercase tracking-wider border-b border-surface-container">
                <th className="p-3">Reference No</th>
                <th className="p-3">Category & Title</th>
                <th className="p-3">Ward & Street</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Status</th>
                <th className="p-3">Submission Date</th>
                <th className="p-3">Department</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-on-surface-variant">
                    {loading ? 'Loading dockets...' : 'No grievances match the specified criteria.'}
                  </td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-3 font-mono font-bold text-primary">
                      <Link to={`/admin/complaints/${c.id}`} className="hover:underline">
                        {c.complaint_number}
                      </Link>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-primary">{c.issue_title}</span>
                        <span className="text-[11px] text-on-surface-variant capitalize">
                          {c.issue_category?.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col max-w-[160px]">
                        <span className="font-semibold">{c.ward_name || `Ward ${c.ward_number}`}</span>
                        <span className="text-[11px] text-on-surface-variant truncate">
                          {c.street_name || c.landmark}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-1.5 py-0.5 rounded font-bold uppercase text-[10px] ${
                          c.severity === 'critical'
                            ? 'bg-error text-white'
                            : c.severity === 'high'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-surface-container text-on-surface'
                        }`}
                      >
                        {c.severity}
                      </span>
                    </td>
                    <td className="p-3">
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
                    <td className="p-3 text-on-surface-variant font-mono">
                      {new Date(c.submitted_at || Date.now()).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3 text-on-surface-variant">
                      {c.department_name || 'Pending'}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/admin/complaints/${c.id}`}
                        className="px-2 py-1 bg-surface-container-high hover:bg-secondary hover:text-white rounded font-semibold text-[11px] transition-colors"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="p-3 bg-surface-container-low border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-on-surface-variant">
          <span>
            Total: <strong>{totalCount}</strong> grievances (Page {page} of {totalPages})
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container disabled:opacity-40 min-h-[36px]"
            >
              Previous
            </button>
            <span className="font-bold text-primary">{page}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container disabled:opacity-40 min-h-[36px]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
