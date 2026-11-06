import React, { useState } from 'react';
import { WARDS_LIST } from '../../services/complaintService';

export const WardManagement = () => {
  const [wards] = useState(WARDS_LIST);

  return (
    <div className="w-full px-3 sm:px-margin py-4 sm:py-space-lg space-y-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-surface-container pb-space-sm">
        <div>
          <h1 className="text-lg sm:font-headline-lg sm:text-headline-lg font-bold text-primary">
            MBMC Ward Operational Jurisdictions
          </h1>
          <p className="text-xs text-on-surface-variant">
            Administrative division boundaries, designated sub-offices, and Junior Engineers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-space-md">
        {wards.map((ward) => (
          <div
            key={ward.id}
            className="bg-surface-container-lowest p-4 sm:p-space-md rounded-2xl shadow-sm border border-surface-container space-y-2.5 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-lg">
                  MBMC-W0{ward.ward_number}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                  Active Cadastre
                </span>
              </div>
              <h3 className="font-bold text-sm text-primary">{ward.ward_name}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{ward.office}</p>
            </div>

            <div className="pt-2 border-t border-surface-container-low text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Control Desk:</span>
                <span className="font-mono text-secondary font-bold">022-2819-280{ward.ward_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Patrol SLA:</span>
                <span className="font-bold text-primary">12h - 48h Mandate</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
