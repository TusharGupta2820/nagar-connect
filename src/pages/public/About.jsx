import React from 'react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-margin py-6 sm:py-space-xl space-y-space-lg sm:space-y-space-xl">
      {/* Header */}
      <div className="space-y-2 border-b border-surface-container pb-space-md sm:pb-space-lg">
        <span className="font-label-sm text-xs sm:text-label-sm uppercase font-bold text-secondary tracking-wider">
          MUNICIPAL INITIATIVE • नागरिक सनद
        </span>
        <h1 className="text-2xl sm:text-display-lg font-bold text-primary">
          About NAGAR CONNECT
        </h1>
        <p className="text-sm sm:text-body-lg text-on-surface-variant leading-relaxed">
          NAGAR CONNECT is the official Smart Civic Infrastructure and Road Issue Reporting Platform under the jurisdiction of the Mira-Bhayandar Municipal Corporation (MBMC), Government of Maharashtra.
        </p>
      </div>

      {/* SLA Guarantees under Citizen Charter */}
      <section className="bg-surface-container-lowest p-4 sm:p-space-lg rounded-2xl shadow-sm border border-surface-container space-y-space-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-2xl">verified_user</span>
          <h2 className="text-base sm:text-headline-md font-bold text-primary">
            Citizen Charter & SLA Guarantees (Rule 12)
          </h2>
        </div>
        <p className="text-xs sm:text-body-md text-on-surface-variant leading-relaxed">
          Under the Maharashtra Public Services Guarantee Act 2015, MBMC is legally committed to redressing public road defects within the following guaranteed turnaround times:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-space-md pt-space-xs">
          <div className="p-4 bg-error-container/40 rounded-xl border-l-4 border-error space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-error text-xs sm:text-sm uppercase">Open Manholes & Chambers</span>
              <span className="font-mono text-xs font-bold text-error bg-error-container px-2 py-0.5 rounded">
                12h SLA
              </span>
            </div>
            <p className="text-xs text-on-error-container leading-relaxed">
              Immediate safety barricading within 2 hours. Replacement of reinforced chamber lid completed within 12 hours.
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-600 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 text-xs sm:text-sm uppercase">Potholes & Asphalt Craters</span>
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                48h SLA
              </span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Site inspection within 12 hours. Cold-mix or hot-mix bituminous filling and roller compaction within 48 hours.
            </p>
          </div>

          <div className="p-4 bg-surface-container-low rounded-xl border-l-4 border-secondary space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary text-xs sm:text-sm uppercase">Damaged Paver Blocks</span>
              <span className="font-mono text-xs font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
                72h SLA
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Re-bedding of sunken subbase sand and replacement of dislodged interlocking pavers within 72 hours.
            </p>
          </div>

          <div className="p-4 bg-surface-container-low rounded-xl border-l-4 border-secondary space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary text-xs sm:text-sm uppercase">Utility Pipeline Trenching</span>
              <span className="font-mono text-xs font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
                48h SLA
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Statutory notice issued to executing agency (gas, telecom, MSEB) with mandatory reinstatement penalty.
            </p>
          </div>
        </div>
      </section>

      {/* Whistleblower & Privacy Protection */}
      <section className="bg-surface-container-lowest p-4 sm:p-space-lg rounded-2xl shadow-sm border border-surface-container space-y-2">
        <h3 className="text-base sm:text-title-lg font-bold text-primary">
          Whistleblower Privacy & Citizen Security
        </h3>
        <p className="text-xs sm:text-body-md text-on-surface-variant leading-relaxed">
          NAGAR CONNECT enforces zero-knowledge citizen privacy standards. When citizens report road hazards, personal contact details (such as phone numbers and emails) are encrypted at rest under Section 8 of the Right to Information Act. Only the geo-location, road hazard description, and photographic evidence are published on public municipal transparency dashboards.
        </p>
      </section>

      {/* CTA */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/report"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary text-on-primary font-bold hover:bg-secondary transition-colors text-center text-sm shadow-md"
        >
          File a Road Issue
        </Link>
        <Link
          to="/contact"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors text-center text-sm"
        >
          Municipal Helplines
        </Link>
      </div>
    </div>
  );
};
