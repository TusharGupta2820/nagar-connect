import React, { useState } from 'react';

export const AuditLogs = () => {
  const [logs] = useState([
    {
      id: 'log-101',
      actor: 'Er. S. Patil (admin)',
      action: 'ASSIGN_DEPARTMENT',
      entity_type: 'complaints',
      entity_id: 'NC-MBMC-2026-008841',
      metadata: { department: 'MBMC-R&I', officer: 'Er. Aniket Joshi' },
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id: 'log-102',
      actor: 'Rajesh Sawant (field_worker)',
      action: 'RECORD_INSPECTION',
      entity_type: 'field_inspections',
      entity_id: 'NC-MBMC-2026-000914',
      metadata: { result: 'verified_manhole_hazard', depth: '1.4m' },
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    },
    {
      id: 'log-103',
      actor: 'Suresh Patil (citizen)',
      action: 'SUBMIT_COMPLAINT',
      entity_type: 'complaints',
      entity_id: 'NC-MBMC-2026-008841',
      metadata: { category: 'pothole', ward_number: 4 },
      timestamp: new Date(Date.now() - 22 * 3600000).toISOString(),
    },
    {
      id: 'log-104',
      actor: 'System Autonomous Trigger',
      action: 'SLA_BREACH_ESCALATION',
      entity_type: 'complaints',
      entity_id: 'NC-MBMC-2026-008835',
      metadata: { remaining_hours: 1.75, alert_sent: 'Executive Engineer' },
      timestamp: new Date(Date.now() - 23 * 3600000).toISOString(),
    },
  ]);

  return (
    <div className="w-full px-3 sm:px-margin py-4 sm:py-space-lg space-y-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-surface-container pb-space-sm">
        <div>
          <h1 className="text-lg sm:font-headline-lg sm:text-headline-lg font-bold text-primary">
            Statutory Municipal Audit Trail
          </h1>
          <p className="text-xs text-on-surface-variant">
            Immutable system logs recorded for Maharashtra Right to Information compliance
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-container">
        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-surface-container">
          {logs.map((log) => (
            <div key={log.id} className="p-4 space-y-2 hover:bg-surface-container-low transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-primary text-xs">{log.id}</span>
                <span className="font-mono font-bold text-secondary bg-surface-container px-2 py-0.5 rounded text-[10px]">
                  {log.action}
                </span>
              </div>

              <div className="text-xs">
                <span className="font-semibold text-on-surface block">{log.actor}</span>
                <span className="text-[11px] text-on-surface-variant">
                  {new Date(log.timestamp).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="bg-surface-container-low p-2.5 rounded-xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Target Entity:</span>
                  <span className="font-mono font-bold text-primary">{log.entity_id}</span>
                </div>
                <div className="pt-1 border-t border-surface-container-high/40">
                  <code className="text-[10px] text-on-surface-variant font-mono break-all block">
                    {JSON.stringify(log.metadata)}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-bold uppercase tracking-wider border-b border-surface-container">
                <th className="p-3">Log ID & Time</th>
                <th className="p-3">Actor / Officer</th>
                <th className="p-3">Action Event</th>
                <th className="p-3">Target Entity</th>
                <th className="p-3">Metadata Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3">
                    <span className="font-mono font-bold text-primary block">{log.id}</span>
                    <span className="text-[11px] text-on-surface-variant">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-on-surface">{log.actor}</td>
                  <td className="p-3">
                    <span className="font-mono font-bold text-secondary bg-surface-container px-2 py-0.5 rounded text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-mono font-bold text-primary">{log.entity_id}</span>
                    <span className="text-[10px] text-outline block">({log.entity_type})</span>
                  </td>
                  <td className="p-3">
                    <code className="bg-surface-container-low p-1 rounded text-[11px] text-on-surface-variant font-mono">
                      {JSON.stringify(log.metadata)}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
