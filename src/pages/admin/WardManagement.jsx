import React, { useState, useEffect } from 'react';
import { complaintService, WARDS_LIST } from '../../services/complaintService';
import { QRCodeSVG } from 'qrcode.react';

export const WardManagement = () => {
  const [wards, setWards] = useState(WARDS_LIST);
  const [selectedWardForQR, setSelectedWardForQR] = useState(null);
  const [poleIdInput, setPoleIdInput] = useState('');
  const [streetInput, setStreetInput] = useState('');

  useEffect(() => {
    const loadLiveWards = async () => {
      try {
        const live = await complaintService.getWards();
        if (live && live.length) setWards(live);
      } catch (e) {
        console.warn('Fallback to local wards list:', e);
      }
    };
    loadLiveWards();
  }, []);

  const openQRModal = (ward) => {
    setSelectedWardForQR(ward);
    const wardNum = String(ward.ward_number || 1).padStart(2, '0');
    setPoleIdInput(`POLE-MBMC-${wardNum}-${Math.floor(100 + Math.random() * 900)}`);
    setStreetInput(ward.office?.split(',')[0] || 'Main Municipal Arterial Road');
  };

  const generatedQRUrl = selectedWardForQR
    ? `${window.location.origin}/report?ward=${selectedWardForQR.ward_number || selectedWardForQR.id}&pole=${encodeURIComponent(poleIdInput)}&street=${encodeURIComponent(streetInput)}`
    : '';

  return (
    <div className="w-full px-3 sm:px-margin py-4 sm:py-space-lg space-y-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-surface-container pb-space-sm">
        <div>
          <h1 className="text-lg sm:font-headline-lg sm:text-headline-lg font-bold text-primary">
            MBMC Ward Operational Jurisdictions & GIS QR Hub
          </h1>
          <p className="text-xs text-on-surface-variant">
            Administrative division boundaries, designated sub-offices, and printable utility pole QR generator
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
              <p className="text-xs text-on-surface-variant leading-relaxed">{ward.office || ward.office_address}</p>
            </div>

            <div className="pt-2 border-t border-surface-container-low text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Control Desk:</span>
                <span className="font-mono text-secondary font-bold">
                  {ward.contact_number || `022-2819-280${ward.ward_number}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Patrol SLA:</span>
                <span className="font-bold text-primary">12h - 48h Mandate</span>
              </div>

              <button
                type="button"
                onClick={() => openQRModal(ward)}
                className="w-full mt-2 py-2 px-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-secondary/20 min-h-[38px]"
              >
                <span className="material-symbols-outlined text-base">qr_code_2</span>
                <span>Generate QR Pole Placard</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Production Pole QR Placard Modal */}
      {selectedWardForQR && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl border border-surface-container overflow-hidden space-y-space-md p-5 sm:p-space-lg">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">qr_code_scanner</span>
                <h3 className="font-bold text-sm sm:text-base text-primary">
                  Official MBMC Pole QR Placard Generator
                </h3>
              </div>
              <button
                onClick={() => setSelectedWardForQR(null)}
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Inputs for customization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="font-bold text-primary block mb-0.5">Pole / Asset Identifier *</label>
                <input
                  type="text"
                  value={poleIdInput}
                  onChange={(e) => setPoleIdInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/40 font-mono text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-primary block mb-0.5">Street / Junction Location *</label>
                <input
                  type="text"
                  value={streetInput}
                  onChange={(e) => setStreetInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-xs"
                />
              </div>
            </div>

            {/* Physical Placard Preview Box (Designed like real municipal sign board) */}
            <div
              id="printable-placard"
              className="bg-white p-4 rounded-xl border-4 border-[#00162C] shadow-md flex flex-col items-center text-center space-y-2"
            >
              <div className="w-full border-b-2 border-[#00162C] pb-1.5">
                <div className="h-1 w-full flex rounded-full overflow-hidden mb-1">
                  <div className="w-1/3 bg-[#FF9933] h-full"></div>
                  <div className="w-1/3 bg-white h-full"></div>
                  <div className="w-1/3 bg-[#138808] h-full"></div>
                </div>
                <h4 className="font-bold text-xs text-[#00162C] uppercase tracking-wide">
                  मीरा-भाईंदर महानगरपालिका | MIRA-BHAYANDAR MUNICIPAL CORP.
                </h4>
                <p className="text-[10px] text-gray-700 font-semibold">
                  रस्ते तक्रार नोंदणी प्रणाली • Smart Road Grievance Redressal
                </p>
              </div>

              <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-300">
                <QRCodeSVG
                  id="modal-placard-qr"
                  value={generatedQRUrl}
                  size={140}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="space-y-0.5">
                <span className="font-mono text-sm font-bold text-[#00162C] bg-gray-100 px-3 py-0.5 rounded border border-gray-300 inline-block">
                  {poleIdInput}
                </span>
                <p className="text-[11px] font-bold text-gray-900 mt-1">
                  Ward {selectedWardForQR.ward_number} • {streetInput}
                </p>
                <p className="text-[10px] text-gray-600 max-w-xs mx-auto leading-tight">
                  स्कॅन करा आणि थेट तक्रार नोंदवा | Scan with any smartphone camera to report road defects directly.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => {
                  const svg = document.getElementById('modal-placard-qr');
                  if (svg) {
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                    const svgUrl = URL.createObjectURL(svgBlob);
                    const downloadLink = document.createElement('a');
                    downloadLink.href = svgUrl;
                    downloadLink.download = `${poleIdInput}_MBMC_Sticker.svg`;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    URL.revokeObjectURL(svgUrl);
                  }
                }}
                className="w-full sm:w-auto px-4 py-2 bg-secondary text-on-secondary rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm min-h-[40px]"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download SVG Placard</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedWardForQR(null)}
                className="w-full sm:w-auto px-4 py-2 bg-surface-container text-on-surface rounded-xl text-xs font-semibold hover:bg-surface-container-high min-h-[40px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
