import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';

export const FieldDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const data = await complaintService.getComplaints({ pageSize: 10 });
        setComplaints(data.complaints || []);
      } catch (err) {
        console.error('Failed to load field tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const urgentTasks = complaints.filter(
    (c) => c.status !== 'resolved' && c.status !== 'closed'
  );

  return (
    <div className="space-y-space-md py-2 sm:py-4">
      {/* Field Worker Header Card */}
      <div className="bg-primary text-on-primary p-4 sm:p-space-md rounded-2xl shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-primary-fixed uppercase font-bold text-[10px] sm:text-xs tracking-wider">
            MBMC QRT Patrol Squad 02
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <h1 className="text-lg sm:text-xl font-bold">Field Dispatch Command</h1>
        <p className="text-xs text-surface-variant">
          Ward 04 Sector: Kanakia, Beverly Park, Shanti Nagar & Western Express
        </p>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-primary-container text-center">
          <div className="bg-primary-container p-2 rounded-xl">
            <span className="text-base sm:text-lg font-bold font-mono">{urgentTasks.length}</span>
            <span className="text-[10px] text-surface-variant block uppercase">Pending</span>
          </div>
          <div className="bg-primary-container p-2 rounded-xl">
            <span className="text-base sm:text-lg font-bold font-mono text-error">
              {urgentTasks.filter((c) => c.severity === 'critical').length}
            </span>
            <span className="text-[10px] text-surface-variant block uppercase">Critical</span>
          </div>
          <div className="bg-primary-container p-2 rounded-xl">
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">
              {complaints.filter((c) => c.status === 'resolved').length}
            </span>
            <span className="text-[10px] text-surface-variant block uppercase">Resolved</span>
          </div>
        </div>
      </div>

      {/* Task List Header */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="font-bold text-primary text-xs sm:text-sm uppercase tracking-wide">
          Urgent Action Queue ({urgentTasks.length})
        </h2>
        <Link to="/field/complaints" className="text-xs text-secondary font-bold hover:underline">
          View All Tasks →
        </Link>
      </div>

      {/* Urgent Cards Feed */}
      <div className="space-y-3 sm:space-y-space-md">
        {urgentTasks.map((task) => (
          <div
            key={task.id}
            className="bg-surface-container-lowest p-3.5 sm:p-space-md rounded-2xl shadow-sm border border-surface-container space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-primary block">
                  #{task.complaint_number}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-on-surface mt-0.5">{task.issue_title}</h3>
              </div>
              <span
                className={`text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                  task.severity === 'critical' ? 'bg-error text-white' : 'bg-amber-100 text-amber-900'
                }`}
              >
                {task.severity}
              </span>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              {task.description}
            </p>

            <div className="p-2.5 bg-surface-container-low rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1 font-semibold text-primary">
                <span className="material-symbols-outlined text-sm text-secondary">pin_drop</span>
                <span className="truncate">{task.street_name || task.landmark}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between text-[11px] text-on-surface-variant pl-4 gap-0.5">
                <span>Lat: {task.latitude}° N, Long: {task.longitude}° E</span>
                <span className="font-mono font-bold text-error">{task.sla_hours || 48}h SLA</span>
              </div>
            </div>

            {/* Actions for Field Worker (Large touch targets for phones) */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${task.latitude},${task.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-surface-container text-on-surface text-xs font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors min-h-[44px]"
              >
                <span className="material-symbols-outlined text-sm">turn_sharp_right</span>
                <span>Navigate</span>
              </a>

              <Link
                to={`/field/complaints/${task.id}`}
                className="flex-1 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-secondary transition-colors shadow-sm min-h-[44px]"
              >
                <span className="material-symbols-outlined text-sm">engineering</span>
                <span>Inspect</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
