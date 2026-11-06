import React from 'react';
import { WARDS_LIST } from '../../services/complaintService';

export const Contact = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-margin py-6 sm:py-space-xl space-y-space-lg sm:space-y-space-xl">
      <div className="space-y-2 border-b border-surface-container pb-space-md sm:pb-space-lg">
        <span className="font-label-sm text-xs sm:text-label-sm uppercase font-bold text-secondary tracking-wider">
          MUNICIPAL DIRECTORY • संपर्क केंद्र
        </span>
        <h1 className="text-2xl sm:text-display-lg font-bold text-primary">
          Ward Offices & Helplines
        </h1>
        <p className="text-sm sm:text-body-lg text-on-surface-variant">
          Mira-Bhayandar Municipal Corporation (MBMC) Ward Control Rooms and 24x7 Road Maintenance Flying Squads.
        </p>
      </div>

      {/* Emergency Helplines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-space-lg">
        <div className="p-4 sm:p-space-lg bg-primary text-on-primary rounded-2xl shadow-md space-y-2">
          <span className="text-primary-fixed uppercase font-bold text-[10px] sm:text-xs">24x7 Disaster Management Cell</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono">022-2819-2828</p>
          <p className="text-xs text-surface-variant leading-relaxed">
            For critical road cave-ins, open manholes during monsoon, waterlogging, or fallen trees.
          </p>
          <a
            href="tel:02228192828"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-container text-primary-fixed rounded-lg text-xs font-bold hover:bg-secondary mt-1"
          >
            <span className="material-symbols-outlined text-sm">call</span>
            <span>Dial Now</span>
          </a>
        </div>

        <div className="p-4 sm:p-space-lg bg-secondary text-on-secondary rounded-2xl shadow-md space-y-2">
          <span className="text-secondary-fixed uppercase font-bold text-[10px] sm:text-xs">Toll-Free Civic Helpdesk</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono">1800-22-3844</p>
          <p className="text-xs text-surface-variant leading-relaxed">
            General civic complaints, status queries, and citizen charter compliance information.
          </p>
          <a
            href="tel:1800223844"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-bold hover:bg-primary mt-1"
          >
            <span className="material-symbols-outlined text-sm">call</span>
            <span>Dial Toll-Free</span>
          </a>
        </div>
      </div>

      {/* Ward Directory */}
      <section className="bg-surface-container-lowest p-4 sm:p-space-lg rounded-2xl shadow-sm border border-surface-container space-y-space-md">
        <h2 className="text-base sm:text-title-lg font-bold text-primary">
          MBMC Ward Engineering Offices
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-space-md">
          {WARDS_LIST.map((ward) => (
            <div
              key={ward.id}
              className="p-3.5 sm:p-space-md bg-surface-container-low rounded-xl border border-surface-container space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-primary">{ward.ward_name}</span>
                <span className="font-mono text-[10px] bg-surface-container px-1.5 py-0.5 rounded font-bold text-secondary">
                  Ward {ward.ward_number}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">{ward.office}</p>
              <div className="pt-1 text-xs flex items-center justify-between">
                <span className="text-on-surface-variant">Desk Phone:</span>
                <a href={`tel:0222819280${ward.ward_number}`} className="font-mono text-secondary font-bold hover:underline">
                  022-2819-280{ward.ward_number}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
