import React, { useState } from 'react';
import { complaintService } from '../../services/complaintService';
import { exportComplaintsToCSV } from '../../utils/csvExport';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const inflowData = [
    { day: 'Mon', Inflow: 110, Resolved: 130 },
    { day: 'Tue', Inflow: 85, Resolved: 105 },
    { day: 'Wed', Inflow: 95, Resolved: 80 },
    { day: 'Thu', Inflow: 50, Resolved: 65 },
    { day: 'Fri', Inflow: 70, Resolved: 55 },
    { day: 'Sat', Inflow: 35, Resolved: 40 },
    { day: 'Sun', Inflow: 60, Resolved: 45 },
  ];

  const defectData = [
    { name: 'Potholes / खड्डे', value: 54, color: '#00162c' },
    { name: 'Paver Blocks / पेव्हर ब्लॉक', value: 22, color: '#325f9b' },
    { name: 'Open Manholes / उघडी गटारे', value: 14, color: '#ba1a1a' },
    { name: 'Utility Trench / चर', value: 10, color: '#d97706' },
  ];

  const wardSlaData = [
    { ward: 'W 04', hours: 14.2, sla: 96 },
    { ward: 'W 01', hours: 18.5, sla: 91 },
    { ward: 'W 03', hours: 22.0, sla: 85 },
    { ward: 'W 02', hours: 24.8, sla: 80 },
    { ward: 'W 06', hours: 29.4, sla: 73 },
    { ward: 'W 05', hours: 34.6, sla: 64 },
  ];

  const trendData = [
    { week: 'W1', Potholes: 240, Repaired: 220 },
    { week: 'W2', Potholes: 310, Repaired: 290 },
    { week: 'W3', Potholes: 280, Repaired: 300 },
    { week: 'W4', Potholes: 390, Repaired: 410 },
  ];

  return (
    <div className="w-full px-3 sm:px-margin py-space-sm sm:py-space-lg space-y-space-md sm:space-y-space-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-space-sm">
        <div>
          <h1 className="text-lg sm:font-headline-lg sm:text-headline-lg font-bold text-primary">
            Municipal Operational Analytics & SLA Audits
          </h1>
          <p className="text-xs text-on-surface-variant">
            Performance scorecards, contractor turnaround times, and statutory SLA adherence
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-container-low text-xs border border-outline-variant/40 font-semibold min-h-[40px]"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days (Cycle: Nov-Dec)</option>
            <option value="90d">Current Fiscal Q3</option>
            <option value="1y">Full Year 2026</option>
          </select>

          <button
            onClick={async () => {
              try {
                const allData = await complaintService.getAllComplaintsForExport();
                exportComplaintsToCSV(allData, `MBMC_Audit_Citizen_Reports_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
              } catch (err) {
                alert(`Export failed: ${err.message}`);
              }
            }}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm min-h-[40px] cursor-pointer"
            title="Download complete audit dataset in CSV format"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export Audit CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-space-md">
        <div className="bg-surface-container-lowest p-3 sm:p-space-md rounded-xl shadow-sm border border-surface-container space-y-1">
          <span className="text-[10px] sm:text-xs text-on-surface-variant uppercase font-semibold">Total Grievances</span>
          <p className="text-xl sm:text-2xl font-bold font-mono text-primary">4,821</p>
          <span className="text-[10px] sm:text-[11px] text-emerald-800 font-bold block">+12.4% vs last cycle</span>
        </div>

        <div className="bg-surface-container-lowest p-3 sm:p-space-md rounded-xl shadow-sm border border-surface-container space-y-1">
          <span className="text-[10px] sm:text-xs text-on-surface-variant uppercase font-semibold">Turnaround</span>
          <p className="text-xl sm:text-2xl font-bold font-mono text-secondary">18.4 Hrs</p>
          <span className="text-[10px] sm:text-[11px] text-emerald-800 font-bold block">Within statutory SLA</span>
        </div>

        <div className="bg-surface-container-lowest p-3 sm:p-space-md rounded-xl shadow-sm border border-surface-container space-y-1">
          <span className="text-[10px] sm:text-xs text-on-surface-variant uppercase font-semibold">SLA Adherence</span>
          <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-800">89.2%</p>
          <span className="text-[10px] sm:text-[11px] text-emerald-800 font-bold block">+4.1% clearance</span>
        </div>

        <div className="bg-surface-container-lowest p-3 sm:p-space-md rounded-xl shadow-sm border border-surface-container space-y-1">
          <span className="text-[10px] sm:text-xs text-on-surface-variant uppercase font-semibold">Citizen Rating</span>
          <p className="text-xl sm:text-2xl font-bold font-mono text-amber-700">4.4 / 5.0</p>
          <span className="text-[10px] sm:text-[11px] text-on-surface-variant block">Verified surveys</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-space-lg">
        {/* Chart 1: Inflow vs Resolved */}
        <div className="bg-surface-container-lowest p-3 sm:p-space-lg rounded-xl shadow-sm border border-surface-container space-y-2 min-w-0 overflow-hidden">
          <h2 className="font-bold text-xs sm:text-sm text-primary">
            Weekly Grievance Inflow vs Resolution Output
          </h2>
          <div className="w-full h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inflowData}>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} width={30} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Inflow" fill="#00162c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Resolved" fill="#325f9b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Defect Classification */}
        <div className="bg-surface-container-lowest p-3 sm:p-space-lg rounded-xl shadow-sm border border-surface-container space-y-2 min-w-0 overflow-hidden">
          <h2 className="font-bold text-xs sm:text-sm text-primary">
            Hazard Classification Breakdown (%)
          </h2>
          <div className="w-full h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {defectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Ward Turnaround Comparison */}
        <div className="bg-surface-container-lowest p-3 sm:p-space-lg rounded-xl shadow-sm border border-surface-container space-y-2 min-w-0 overflow-hidden">
          <h2 className="font-bold text-xs sm:text-sm text-primary">
            Average Repair Turnaround Hours by Ward Division
          </h2>
          <div className="w-full h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardSlaData} layout="vertical">
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis dataKey="ward" type="category" stroke="#64748B" fontSize={11} width={45} />
                <Tooltip />
                <Bar dataKey="hours" name="Avg Turnaround (Hrs)" fill="#102b46" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Monthly Repair Volume Trends */}
        <div className="bg-surface-container-lowest p-3 sm:p-space-lg rounded-xl shadow-sm border border-surface-container space-y-2 min-w-0 overflow-hidden">
          <h2 className="font-bold text-xs sm:text-sm text-primary">
            Monthly Pothole Patrol & Repair Trend
          </h2>
          <div className="w-full h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <XAxis dataKey="week" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} width={30} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="Potholes" stroke="#00162c" fill="#d2e4ff" />
                <Area type="monotone" dataKey="Repaired" stroke="#325f9b" fill="#eff4ff" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
