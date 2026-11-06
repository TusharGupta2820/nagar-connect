import React, { useState } from 'react';
import { DEMO_USERS } from '../../services/authService';

export const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: DEMO_USERS.admin.id,
      full_name: DEMO_USERS.admin.full_name,
      email: DEMO_USERS.admin.email,
      role: 'admin',
      designation: DEMO_USERS.admin.designation,
      phone: DEMO_USERS.admin.phone,
      ward: 'All Wards',
      status: 'active',
    },
    {
      id: DEMO_USERS.officer.id,
      full_name: DEMO_USERS.officer.full_name,
      email: DEMO_USERS.officer.email,
      role: 'officer',
      designation: DEMO_USERS.officer.designation,
      phone: DEMO_USERS.officer.phone,
      ward: 'Ward 04 (Kanakia)',
      status: 'active',
    },
    {
      id: DEMO_USERS.field_worker.id,
      full_name: DEMO_USERS.field_worker.full_name,
      email: DEMO_USERS.field_worker.email,
      role: 'field_worker',
      designation: DEMO_USERS.field_worker.designation,
      phone: DEMO_USERS.field_worker.phone,
      ward: 'Ward 04 (QRT)',
      status: 'active',
    },
    {
      id: DEMO_USERS.citizen.id,
      full_name: DEMO_USERS.citizen.full_name,
      email: DEMO_USERS.citizen.email,
      role: 'citizen',
      designation: 'Verified Resident',
      phone: DEMO_USERS.citizen.phone,
      ward: 'Mira Road East',
      status: 'active',
    },
  ]);

  const handleRoleChange = (id, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
    alert('User role updated in profiles table.');
  };

  return (
    <div className="w-full px-3 sm:px-margin py-4 sm:py-space-lg space-y-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-surface-container pb-space-sm">
        <div>
          <h1 className="text-lg sm:font-headline-lg sm:text-headline-lg font-bold text-primary">
            Authorized User & Role Directory
          </h1>
          <p className="text-xs text-on-surface-variant">
            Manage administrative privilege levels, ward assignments, and municipal credentials
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-container">
        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-surface-container">
          {users.map((u) => (
            <div key={u.id} className="p-4 space-y-2.5 hover:bg-surface-container-low transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-primary">{u.full_name}</h3>
                  <p className="text-xs text-on-surface-variant">{u.designation}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase">
                  {u.status}
                </span>
              </div>

              <div className="p-2.5 bg-surface-container-low rounded-xl text-xs space-y-1 font-mono">
                <p className="text-on-surface truncate">{u.email}</p>
                <p className="text-on-surface-variant">{u.phone}</p>
                <p className="text-secondary font-sans font-bold">{u.ward}</p>
              </div>

              <div className="flex items-center justify-between pt-1 gap-2">
                <div className="flex items-center gap-1.5 flex-1">
                  <span className="text-xs text-on-surface-variant font-medium">Role:</span>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant/40 font-bold uppercase text-xs focus:outline-none min-h-[38px]"
                  >
                    <option value="admin">Admin</option>
                    <option value="officer">Officer</option>
                    <option value="field_worker">Field Worker</option>
                    <option value="citizen">Citizen</option>
                  </select>
                </div>

                <button
                  onClick={() => alert(`Password reset trigger sent for ${u.email}`)}
                  className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-secondary rounded-lg text-xs font-semibold min-h-[38px]"
                >
                  Reset
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-bold uppercase tracking-wider border-b border-surface-container">
                <th className="p-3">User & Contact</th>
                <th className="p-3">Designation</th>
                <th className="p-3">Assigned Ward</th>
                <th className="p-3">Role Privilege</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary">{u.full_name}</span>
                      <span className="font-mono text-[11px] text-on-surface-variant">{u.email}</span>
                      <span className="text-[11px] text-outline">{u.phone}</span>
                    </div>
                  </td>
                  <td className="p-3 text-on-surface font-medium">{u.designation}</td>
                  <td className="p-3 text-on-surface-variant">{u.ward}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="px-2 py-1 rounded bg-surface-container-low border border-outline-variant/40 font-bold uppercase text-[11px] focus:outline-none cursor-pointer"
                    >
                      <option value="admin">Admin</option>
                      <option value="officer">Officer</option>
                      <option value="field_worker">Field Worker</option>
                      <option value="citizen">Citizen</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase">
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => alert(`Password reset trigger sent for ${u.email}`)}
                      className="text-secondary hover:underline font-semibold"
                    >
                      Reset Pass
                    </button>
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
