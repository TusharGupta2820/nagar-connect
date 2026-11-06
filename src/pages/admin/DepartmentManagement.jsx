import React, { useState, useEffect } from 'react';
import { complaintService, DEPARTMENTS_LIST } from '../../services/complaintService';

export const DepartmentManagement = () => {
  const [departments, setDepartments] = useState(DEPARTMENTS_LIST);
  const [modalOpen, setModalOpen] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
    const loadDepts = async () => {
      const list = await complaintService.getDepartments();
      if (list && list.length > 0) setDepartments(list);
    };
    loadDepts();
  }, []);

  const handleAddDept = (e) => {
    e.preventDefault();
    if (!deptName || !deptCode) return;
    const newDept = {
      id: `dept-${Date.now()}`,
      department_name: deptName,
      department_code: deptCode,
      contact_email: contactEmail || `${deptCode.toLowerCase()}@mbmc.gov.in`,
      is_active: true,
    };
    setDepartments((prev) => [...prev, newDept]);
    setDeptName('');
    setDeptCode('');
    setContactEmail('');
    setModalOpen(false);
    alert('Department registered successfully!');
  };

  return (
    <div className="w-full px-3 sm:px-margin py-4 sm:py-space-lg space-y-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-surface-container pb-space-sm">
        <div>
          <h1 className="text-lg sm:font-headline-lg sm:text-headline-lg font-bold text-primary">
            Municipal Department Cadre
          </h1>
          <p className="text-xs text-on-surface-variant">
            Official municipal departments responsible for road maintenance, drainage, and emergency response
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-semibold hover:bg-secondary flex items-center gap-1 shadow-sm min-h-[40px]"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Add Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-space-md">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-surface-container-lowest p-4 sm:p-space-md rounded-2xl shadow-sm border border-surface-container space-y-2 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-secondary bg-surface-container px-2 py-0.5 rounded-lg">
                  {dept.department_code}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                  Active Unit
                </span>
              </div>
              <h3 className="font-bold text-sm text-primary">{dept.department_name}</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Contact: <span className="font-mono text-secondary">{dept.contact_email}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-surface-container-low text-xs flex justify-between items-center text-on-surface-variant">
              <span>Authority: MBMC Civil</span>
              <span className="text-emerald-700 font-bold">24x7 Ready</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-4 sm:p-space-lg shadow-2xl border border-surface-container space-y-space-md">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-primary text-sm sm:text-base">Register Municipal Department</span>
              <button
                onClick={() => setModalOpen(false)}
                className="text-on-surface-variant hover:text-error text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddDept} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-primary block">Department Name *</label>
                <input
                  type="text"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="e.g. Storm Water Drainage & Pumping Wing"
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-base sm:text-xs min-h-[42px]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary block">Department Code *</label>
                <input
                  type="text"
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  placeholder="e.g. SWD-MBMC"
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-base sm:text-xs min-h-[42px]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary block">Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="department@mbmc.gov.in"
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-base sm:text-xs min-h-[42px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-secondary min-h-[40px]"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
