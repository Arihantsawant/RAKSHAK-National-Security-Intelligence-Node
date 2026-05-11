import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

// Import MarkerCluster CSS
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { AlertTriangle, MapPin, Maximize2, ShieldCheck, Crosshair, Navigation, Activity, History } from 'lucide-react';

// Custom Pulsating Icon for User Location
const UserLocationIcon = L.divIcon({
  className: 'user-marker-container',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-12 h-12 bg-blue-500 rounded-full animate-ping opacity-10"></div>
      <div class="relative bg-blue-600 p-1.5 border-2 border-white rounded-full shadow-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1"><circle cx="12" cy="12" r="10"/></svg>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});
import { INDIAN_STATES, DISTRICT_COORDINATES } from '../constants';

// Fix for default marker icons in React-Leaflet
// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MarkerAny = Marker as any;
const PopupAny = Popup as any;
const CircleAny = Circle as any;
const PolylineAny = Polyline as any;

// Custom Pulsating Icon for Interceptions
const InterceptIcon = L.divIcon({
  className: 'intercept-marker-container',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
      <div class="absolute w-6 h-6 bg-emerald-500 rounded-full animate-pulse opacity-40"></div>
      <div class="relative bg-rakshak-ink p-1 border border-white rounded-full shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface Vehicle {
  id: string;
  vehicle_number: string;
  lat: number;
  lng: number;
  location: string;
  threatLevel?: 'Red' | 'Orange' | 'Yellow' | 'Green';
  isIntercepted?: boolean;
  trajectory?: [number, number][];
}

interface MapControllerProps {
  detections: Vehicle[];
  user?: any;
  locationMode: 'GPS' | 'JURISDICTION';
}

const MapController = ({ detections, user, locationMode }: MapControllerProps) => {
  const map = useMap();
  const [isAutoCenterEnabled, setIsAutoCenterEnabled] = useState(true);
  const [gpsPosition, setGpsPosition] = useState<[number, number] | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const prevLocationMode = useRef<string>(locationMode);
  const watchId = useRef<number | null>(null);

  useMapEvents({
    dragstart: () => setIsAutoCenterEnabled(false),
    zoomstart: () => setIsAutoCenterEnabled(false),
  });

  // Handle GPS Tracking
  useEffect(() => {
    if (locationMode === 'GPS' && "geolocation" in navigator) {
      setIsAutoCenterEnabled(true);
      setGpsError(null);
      
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          setGpsPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("GPS Access Denied:", error);
          setGpsError(error.code === 1 ? "PERMISSION_DENIED" : "SYSTEM_ERROR");
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      setGpsPosition(null);
    }

    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [locationMode]);

  useEffect(() => {
    if (locationMode !== prevLocationMode.current) {
      setIsAutoCenterEnabled(true);
      prevLocationMode.current = locationMode;
    }
  }, [locationMode]);

  // View Logic - Only trigger on mode change or manual re-center
  useEffect(() => {
    if (!isAutoCenterEnabled) return;

    if (locationMode === 'GPS' && gpsPosition) {
      map.flyTo(gpsPosition, 16, { duration: 1.5 });
    } else if (locationMode === 'JURISDICTION' && user) {
      const stateName = user.state || 'National';
      const districtName = user.district;
      const stateInfo = INDIAN_STATES.find(s => s.name.toLowerCase() === stateName.toLowerCase());
      
      if (stateInfo) {
        const zoomLevel = districtName ? 13 : stateInfo.zoom;
        
        // Find best match for district coordinates
        const normalizedDistrict = districtName?.toLowerCase().trim();
        const districtCoordKey = Object.keys(DISTRICT_COORDINATES).find(
          k => k.toLowerCase() === normalizedDistrict
        );

        if (districtCoordKey && DISTRICT_COORDINATES[districtCoordKey]) {
          map.flyTo(DISTRICT_COORDINATES[districtCoordKey], zoomLevel, { duration: 2 });
        } else {
          // Fallback to state level if no specific district match
          map.flyTo([stateInfo.lat, stateInfo.lng], zoomLevel, { duration: 2 });
        }
      }
    }
  }, [user, map, locationMode, gpsPosition, isAutoCenterEnabled]);

  return (
    <>
      {!isAutoCenterEnabled && (
        <div className="absolute top-20 right-6 z-[1000]">
          <button 
            onClick={() => setIsAutoCenterEnabled(true)}
            className="bg-rakshak-ink text-white px-4 py-2 text-[10px] font-bold uppercase flex items-center gap-2 hover:bg-rakshak-accent transition-all shadow-xl border border-white/20 active:scale-95"
          >
            <Maximize2 size={12} /> Re-center {locationMode === 'GPS' ? 'GPS' : 'Area'}
          </button>
        </div>
      )}
      {gpsError && locationMode === 'GPS' && (
        <div className="absolute top-20 right-6 z-[1000] bg-red-600 text-white px-4 py-2 text-[10px] font-bold uppercase flex items-center gap-2 shadow-xl border border-white/20">
          <AlertTriangle size={12} /> {gpsError === 'PERMISSION_DENIED' ? 'Geolocation Permission Denied' : 'GPS Signal Lost'}
        </div>
      )}
      {gpsPosition && (
        <MarkerAny position={gpsPosition} icon={UserLocationIcon}>
          <PopupAny>
            <div className="font-mono text-[10px] p-2 bg-white">
              <div className="flex items-center gap-2 text-blue-600 font-bold mb-1">
                <Navigation size={10} /> CURRENT_LOCATION
              </div>
              <p className="opacity-60 tabular-nums">{gpsPosition[0].toFixed(5)}, {gpsPosition[1].toFixed(5)}</p>
            </div>
          </PopupAny>
        </MarkerAny>
      )}
    </>
  );
};


export default function SurveillanceMap({ 
  detections, 
  historyOffset, 
  onHistoryChange,
  user
}: { 
  detections: Vehicle[], 
  historyOffset?: number, 
  onHistoryChange?: (minutes: number) => void,
  user?: any
}) {
  const [locationMode, setLocationMode] = useState<'GPS' | 'JURISDICTION'>('JURISDICTION');
  const [trajectoryVehicleId, setTrajectoryVehicleId] = useState<string | null>(null);
  const [trajectoryFilter, setTrajectoryFilter] = useState<string[]>(['Red']);
  const [showLegend, setShowLegend] = useState(true);
  const [showPlayback, setShowPlayback] = useState(true);

  const getMarkerColor = (level?: string) => {
    switch (level) {
      case 'Red': return '#ef4444';
      case 'Orange': return '#f97316';
      case 'Yellow': return '#eab308';
      default: return '#3b82f6';
    }
  };

  const minutesAgo = historyOffset || 0;

  const MapContainerAny = MapContainer as any;
  const TileLayerAny = TileLayer as any;

  // Default focus
  const defaultFocus = user?.state 
    ? INDIAN_STATES.find(s => s.name === user.state) || INDIAN_STATES.find(s => s.name === 'National')!
    : INDIAN_STATES.find(s => s.name === 'National')!;

  return (
    <div id="surveillance-map-container" className="h-full w-full border-2 border-rakshak-line relative overflow-hidden">
      <MapContainerAny 
        center={[defaultFocus.lat, defaultFocus.lng]} 
        zoom={defaultFocus.zoom} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <MapController detections={detections} user={user} locationMode={locationMode} />
        <TileLayerAny
          attribution='&copy; Esri World Imagery'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          opacity={0.5}
        />
        <TileLayerAny
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={0.9}
        />
        {/* High contrast labels for villages/roads - using Voyager labels for better visibility */}
        <TileLayerAny
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{y}/{x}.png"
          opacity={1}
        />
        <TileLayerAny
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{y}/{x}.png"
          opacity={1}
        />
        
        {/* Render Trajectory Lines */}
        {detections.filter(d => 
          (trajectoryVehicleId === d.id) || 
          (d.threatLevel && trajectoryFilter.includes(d.threatLevel))
        ).map(d => (
          <PolylineAny 
            key={`traj-${d.id}`}
            positions={[
              ...(d.trajectory || []),
              [d.lat, d.lng]
            ]}
            pathOptions={{ 
              color: getMarkerColor(d.threatLevel),
              weight: (trajectoryVehicleId === d.id) ? 4 : 2,
              opacity: (trajectoryVehicleId === d.id) ? 0.8 : 0.4,
              dashArray: (trajectoryVehicleId === d.id) ? '10, 10' : '5, 5'
            }}
          />
        ))}

        <MarkerClusterGroup>
          {detections.map((d) => (
            <MarkerAny 
              key={d.id} 
              position={[d.lat, d.lng]}
              icon={d.isIntercepted ? InterceptIcon : undefined}
            >
              <PopupAny>
                <div className="text-rakshak-ink font-mono text-[11px] p-1 min-w-[140px]">
                  <div className="flex items-center justify-between mb-2 pb-1 border-b border-rakshak-line">
                    <span className="font-bold text-[12px]">{d.vehicle_number}</span>
                    <span className={`text-[8px] px-1 py-0.5 border font-bold uppercase`} style={{ color: getMarkerColor(d.threatLevel), borderColor: getMarkerColor(d.threatLevel) }}>
                      {d.threatLevel}
                    </span>
                  </div>
                  
                  {d.isIntercepted && (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold mb-2 animate-pulse text-[9px]">
                      <ShieldCheck size={10} /> INTERCEPTED
                    </div>
                  )}

                  <div className="space-y-2 mb-3">
                    <p className="flex items-center gap-1.5 opacity-70">
                      <MapPin size={10} /> {d.location}
                    </p>
                    <p className="flex items-center gap-1.5 opacity-50 tabular-nums">
                      <Activity size={10} /> {d.lat.toFixed(4)}, {d.lng.toFixed(4)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 border-t border-dashed border-rakshak-line pt-2">
                    <button 
                      onClick={() => setTrajectoryVehicleId(trajectoryVehicleId === d.id ? null : d.id)}
                      className={`w-full py-2 px-2 text-[9px] font-bold uppercase flex items-center justify-center gap-2 transition-all shadow-sm ${
                        trajectoryVehicleId === d.id 
                          ? 'bg-rakshak-ink text-white ring-1 ring-white/20' 
                          : 'bg-rakshak-bg text-rakshak-ink hover:bg-rakshak-line border border-rakshak-line'
                      }`}
                    >
                      {trajectoryVehicleId === d.id ? <History size={12} className="animate-pulse" /> : <Activity size={12} />}
                      {trajectoryVehicleId === d.id ? 'Hide Active Path' : 'Show Recent Trajectory'}
                    </button>
                  </div>
                </div>
              </PopupAny>
            </MarkerAny>
          ))}
        </MarkerClusterGroup>

        {detections.map((d) => (
          <CircleAny 
            key={`circle-${d.id}`}
            center={[d.lat, d.lng]} 
            radius={d.isIntercepted ? 20000 : 10000} 
            pathOptions={{ 
              color: d.isIntercepted ? '#10b981' : getMarkerColor(d.threatLevel), 
              fillColor: d.isIntercepted ? '#10b981' : getMarkerColor(d.threatLevel), 
              fillOpacity: d.isIntercepted ? 0.1 : 0.05,
              weight: d.isIntercepted ? 2 : 1,
              dashArray: d.isIntercepted ? '5, 10' : undefined
            }} 
          />
        ))}
      </MapContainerAny>
      
      {/* Location Mode Toggle */}
      <div className="absolute top-6 right-6 z-[1000] flex bg-white border-2 border-rakshak-ink shadow-2xl overflow-hidden rounded-sm">
        <button 
          onClick={() => setLocationMode('JURISDICTION')}
          className={`px-4 py-2 text-[10px] font-bold uppercase flex items-center gap-2 transition-all ${
            locationMode === 'JURISDICTION' 
              ? 'bg-rakshak-ink text-white' 
              : 'text-rakshak-ink hover:bg-rakshak-bg border-r border-rakshak-line'
          }`}
        >
          <MapPin size={12} /> Jurisdictional View
        </button>
        <button 
          onClick={() => {
            setLocationMode('GPS');
            if (!("geolocation" in navigator)) {
              alert("Your device/browser does not support GPS location tracking.");
            }
          }}
          className={`px-4 py-2 text-[10px] font-bold uppercase flex items-center gap-2 transition-all ${
            locationMode === 'GPS' 
              ? 'bg-blue-600 text-white' 
              : 'text-rakshak-ink hover:bg-blue-50'
          }`}
        >
          <Crosshair size={12} /> Live Officer GPS
        </button>
      </div>

      {/* Visibility Controls */}
      <div className="absolute top-20 left-6 z-[1000] flex flex-col gap-2">
        <button 
          onClick={() => setShowLegend(!showLegend)}
          className={`group flex items-center gap-2 p-2 bg-white border border-rakshak-line shadow-lg hover:bg-rakshak-ink hover:text-white transition-all rounded-sm ${!showLegend ? 'opacity-60' : ''}`}
          title={showLegend ? "Hide Indices" : "Show Indices"}
        >
          <Activity size={14} className={showLegend ? 'text-rakshak-ink group-hover:text-white' : 'text-gray-400 group-hover:text-white'} />
          <span className="text-[10px] font-bold uppercase overflow-hidden w-0 group-hover:w-20 transition-all">Indices</span>
        </button>
        <button 
          onClick={() => setShowPlayback(!showPlayback)}
          className={`group flex items-center gap-2 p-2 bg-white border border-rakshak-line shadow-lg hover:bg-rakshak-ink hover:text-white transition-all rounded-sm ${!showPlayback ? 'opacity-60' : ''}`}
          title={showPlayback ? "Hide Scrub" : "Show Scrub"}
        >
          <History size={14} className={showPlayback ? 'text-rakshak-ink group-hover:text-white' : 'text-gray-400 group-hover:text-white'} />
          <span className="text-[10px] font-bold uppercase overflow-hidden w-0 group-hover:w-20 transition-all">Timeline</span>
        </button>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="absolute top-6 left-6 z-[1000] bg-white border-2 border-rakshak-ink p-4 shadow-2xl rounded-sm">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-rakshak-ink font-serif italic">Operational Indices</h4>
            <button onClick={() => setShowLegend(false)} className="text-rakshak-ink/40 hover:text-rakshak-accent transition-colors">
              <Maximize2 size={10} className="rotate-45" />
            </button>
          </div>
          <div className="space-y-2 font-mono">
            <div className="flex items-center gap-2 text-[10px]">
              <div className="w-4 h-4 bg-blue-500/20 border border-blue-500 rounded-full flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              </div> 
              <span className="font-bold text-blue-600">OFFICER_CURRENT_GPS</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <div className="w-4 h-4 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              </div> 
              <span className="font-bold text-emerald-600">INTERCEPTION_ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <div className="w-2 h-2 bg-rakshak-accent" /> 
              <span>TARGET_ACQUISITION_RED</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
               <Activity size={12} className="text-rakshak-ink opacity-40" />
              <span>ACTIVE_TRAJECTORIES</span>
            </div>

            {/* Trajectory Filters */}
            <div className="pt-3 mt-1 border-t border-rakshak-line">
              <p className="text-[8px] font-bold opacity-50 mb-2 uppercase tracking-tighter">Path Filters (By Threat)</p>
              <div className="flex flex-wrap gap-1.5">
                {['Red', 'Orange', 'Yellow' ].map(level => (
                  <button
                    key={level}
                    onClick={() => setTrajectoryFilter(prev => 
                      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
                    )}
                    className={`px-2 py-1 text-[8px] font-bold border transition-all ${
                      trajectoryFilter.includes(level)
                        ? 'bg-rakshak-ink text-white'
                        : 'bg-white text-rakshak-ink opacity-40 hover:opacity-100'
                    }`}
                    style={{ borderColor: trajectoryFilter.includes(level) ? getMarkerColor(level) : '#eee' }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Slider Control */}
      {showPlayback && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-xl px-6">
          <div className="bg-white border-2 border-rakshak-ink p-6 shadow-2xl relative group/timeline">
            <button 
              onClick={() => setShowPlayback(false)}
              className="absolute -top-3 -right-3 bg-rakshak-ink text-white p-1.5 rounded-full opacity-0 group-hover/timeline:opacity-100 transition-opacity shadow-lg hover:bg-rakshak-accent"
              title="Hide Timeline"
            >
              <Maximize2 size={10} className="rotate-45" />
            </button>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${minutesAgo === 0 ? 'bg-rakshak-accent animate-ping' : 'bg-gray-400'}`} />
                <span className="text-[10px] font-bold font-mono tracking-widest uppercase">
                  {minutesAgo === 0 ? 'Live Intercept Mode' : `Historical Scrub: -${minutesAgo} MIN`}
                </span>
              </div>
              <span className="text-[10px] font-mono opacity-50 font-bold uppercase">60 min window</span>
            </div>
            <input 
              type="range"
              min="0"
              max="60"
              step="1"
              value={minutesAgo}
              onChange={(e) => onHistoryChange?.(parseInt(e.target.value))}
              className="w-full h-1.5 bg-rakshak-ink/10 rounded-lg appearance-none cursor-pointer accent-rakshak-ink hover:accent-rakshak-accent transition-all"
            />
            <div className="flex justify-between mt-2 font-mono text-[8px] font-bold text-rakshak-ink/30 uppercase">
              <span>-60 min</span>
              <span>-45 min</span>
              <span>-30 min</span>
              <span>-15 min</span>
              <span>Now</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
