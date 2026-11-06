import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Custom Marker DivIcon generators
const createColoredIcon = (severity = 'medium', isSelected = false) => {
  let color = '#325f9b'; // low: blue
  let glowColor = 'rgba(50, 95, 155, 0.4)';

  if (severity === 'critical') {
    color = '#dc2626'; // red
    glowColor = 'rgba(220, 38, 38, 0.6)';
  } else if (severity === 'high') {
    color = '#ea580c'; // orange
    glowColor = 'rgba(234, 88, 12, 0.5)';
  } else if (severity === 'medium') {
    color = '#ca8a04'; // yellow/amber
    glowColor = 'rgba(202, 138, 4, 0.5)';
  }

  const pulseHtml = severity === 'critical' ? `<span class="animate-ping absolute -top-1 -left-1 w-8 h-8 rounded-full" style="background-color: ${glowColor};"></span>` : '';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer">
        ${pulseHtml}
        <div class="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg ${isSelected ? 'ring-4 ring-primary scale-125' : ''} transition-transform" style="background-color: ${color};">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

// Component to recenter map dynamically when center coordinates change
const ChangeMapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 14);
    }
  }, [center, zoom, map]);
  return null;
};

// Component to handle citizen clicks to pick / adjust GPS coordinates
const LocationPickerEvents = ({ onPositionChange }) => {
  useMapEvents({
    click(e) {
      if (onPositionChange) {
        onPositionChange({
          lat: parseFloat(e.latlng.lat.toFixed(6)),
          lng: parseFloat(e.latlng.lng.toFixed(6)),
        });
      }
    },
  });
  return null;
};

export const RoadMap = ({
  complaints = [],
  selectedComplaintId = null,
  onSelectComplaint = null,
  center = [19.2845, 72.8631], // MBMC Default Center (Mira Road)
  zoom = 13,
  pickerMode = false,
  pickerPosition = null,
  onPickerPositionChange = null,
  className = 'w-full h-full min-h-[260px]',
}) => {
  const [mapCenter, setMapCenter] = useState(center);

  useEffect(() => {
    if (center && center[0] && center[1]) {
      setMapCenter(center);
    }
  }, [center]);

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-inner ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeMapView center={mapCenter} zoom={zoom} />

        {/* Standard OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | MBMC GIS Cadastre'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Interactive Location Picker Mode */}
        {pickerMode && (
          <>
            <LocationPickerEvents onPositionChange={onPickerPositionChange} />
            {pickerPosition && pickerPosition.lat && pickerPosition.lng && (
              <Marker
                position={[pickerPosition.lat, pickerPosition.lng]}
                icon={createColoredIcon('critical', true)}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    if (onPickerPositionChange) {
                      onPickerPositionChange({
                        lat: parseFloat(position.lat.toFixed(6)),
                        lng: parseFloat(position.lng.toFixed(6)),
                      });
                    }
                  },
                }}
              >
                <Popup>
                  <div className="text-xs p-1">
                    <p className="font-bold text-primary">Selected Hazard Location</p>
                    <p className="font-mono text-[11px] text-on-surface-variant">
                      {pickerPosition.lat}° N, {pickerPosition.lng}° E
                    </p>
                    <p className="text-[10px] text-secondary mt-1">Drag marker to refine exact spot</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </>
        )}

        {/* Render Complaint Markers */}
        {!pickerMode &&
          complaints
            .filter((c) => c.latitude && c.longitude && !isNaN(c.latitude) && !isNaN(c.longitude))
            .map((complaint) => {
              const isSelected = selectedComplaintId === complaint.id || selectedComplaintId === complaint.complaint_number;
              const pos = [parseFloat(complaint.latitude), parseFloat(complaint.longitude)];

              return (
                <Marker
                  key={complaint.id}
                  position={pos}
                  icon={createColoredIcon(complaint.severity, isSelected)}
                  eventHandlers={{
                    click: () => {
                      if (onSelectComplaint) {
                        onSelectComplaint(complaint);
                      }
                    },
                  }}
                >
                  <Popup>
                    <div className="p-1 max-w-xs space-y-1">
                      <div className="flex items-center justify-between gap-2 border-b pb-1">
                        <span className="font-mono font-bold text-primary text-xs">
                          {complaint.complaint_number}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-surface-container text-on-surface">
                          {complaint.status?.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-on-surface">{complaint.issue_title}</h4>
                      <p className="text-[11px] text-on-surface-variant truncate">
                        {complaint.street_name || complaint.landmark || complaint.locality}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[10px]">
                        <span className="capitalize font-semibold text-secondary">
                          {complaint.issue_category?.replace('_', ' ')}
                        </span>
                        {onSelectComplaint && (
                          <button
                            onClick={() => onSelectComplaint(complaint)}
                            className="bg-primary text-white px-2 py-0.5 rounded font-semibold hover:bg-secondary cursor-pointer"
                          >
                            Inspect
                          </button>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
      </MapContainer>
    </div>
  );
};
