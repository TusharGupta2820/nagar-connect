import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';

export const AssignedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssigned = async () => {
      setLoading(true);
      try {
        const data = await complaintService.getComplaints({ pageSize: 50 });
        setComplaints(data.complaints || []);
      } catch (err) {
        console.error('Failed to load assigned tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssigned();
  }, []);

  const filtered = complaints.filter((c) => {
    if (filter === 'pending') return c.status !== 'resolved' && c.status !== 'closed';
    if (filter === 'resolved') return c.status === 'resolved' || c.status === 'closed';
    return true;
  });

  return (
    <div className="space-y-space-md py-2 sm:py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-2">
        <div>
          <h1 className="font-bold text-primary text-base sm:text-lg">Assigned Inspection Tasks</h1>
          <p className="text-xs text-on-surface-variant">Assigned to your field inspection team</p>
        </div>

        <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold min-h-[36px] ${
              filter === 'all' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold min-h-[36px] ${
              filter === 'pending' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold min-h-[36px] ${
              filter === 'resolved' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-surface-container-lowest p-3.5 sm:p-space-md rounded-2xl shadow-sm border border-surface-container space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">
                #{item.complaint_number}
              </span>
              <span
                className={`text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  item.status === 'resolved'
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {item.status?.replace('_', ' ')}
              </span>
            </div>

            <h3 className="font-bold text-xs sm:text-sm text-on-surface">{item.issue_title}</h3>
            <p className="text-xs text-on-surface-variant">{item.street_name || item.landmark}</p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-surface-container-low gap-2 text-xs">
              <span className="font-mono text-secondary font-bold text-[11px]">
                {item.latitude}° N, {item.longitude}° E
              </span>
              <Link
                to={`/field/complaints/${item.id}`}
                className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-colors text-center min-h-[40px] flex items-center justify-center gap-1"
              >
                <span>Inspect / Action</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
