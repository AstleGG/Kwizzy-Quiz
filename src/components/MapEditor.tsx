import React, { useState, useRef } from 'react';
import { MapPin, Plus, X, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

const MAPS = {
  world: 'https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg',
  africa: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Africa_%28orthographic_projection%29.svg',
  asia: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Asia_%28orthographic_projection%29.svg',
  europe: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Europe_orthographic_Caucasus_Urals_boundary.svg',
  'north-america': 'https://upload.wikimedia.org/wikipedia/commons/4/43/Location_North_America.svg',
  'south-america': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/South_America_%28orthographic_projection%29.svg',
  oceania: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Oceania_%28orthographic_projection%29.svg',
};

interface MapEditorProps {
  onUpdate: (config: any) => void;
}

export const MapEditor: React.FC<MapEditorProps> = ({ onUpdate }) => {
  const [mapType, setMapType] = useState<keyof typeof MAPS>('world');
  const [locations, setLocations] = useState<{ id: string; name: string; x: number; y: number }[]>([]);
  const [currentName, setCurrentName] = useState('');
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (e: React.MouseEvent) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingPoint({ x, y });
  };

  const addLocation = () => {
    if (!pendingPoint || !currentName) return;
    const newLocations = [
      ...locations,
      { id: Math.random().toString(36).substr(2, 9), name: currentName, ...pendingPoint },
    ];
    setLocations(newLocations);
    setPendingPoint(null);
    setCurrentName('');
    onUpdate({ mapType, locations: newLocations });
  };

  const removeLocation = (id: string) => {
    const newLocations = locations.filter(l => l.id !== id);
    setLocations(newLocations);
    onUpdate({ mapType, locations: newLocations });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {(Object.keys(MAPS) as Array<keyof typeof MAPS>).map((type) => (
          <button
            key={type}
            onClick={() => {
              setMapType(type);
              setLocations([]);
              onUpdate({ mapType: type, locations: [] });
            }}
            className={cn(
              "rounded-xl border p-2 text-[10px] font-bold uppercase transition-all",
              mapType === type ? "border-black bg-black text-white" : "border-black/5 bg-white hover:border-black/20"
            )}
          >
            {type.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-black/5">
        <div 
          ref={mapRef}
          onClick={handleMapClick}
          className="relative aspect-[16/9] w-full cursor-crosshair"
        >
          <img 
            src={MAPS[mapType]} 
            alt="Map" 
            className="h-full w-full object-contain opacity-80"
            referrerPolicy="no-referrer"
          />
          
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            >
              <div className="group relative">
                <MapPin className="h-6 w-6 text-black" />
                <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {loc.name}
                </div>
              </div>
            </div>
          ))}

          {pendingPoint && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pendingPoint.x}%`, top: `${pendingPoint.y}%` }}
            >
              <div className="h-4 w-4 animate-ping rounded-full bg-black/40" />
              <MapPin className="h-6 w-6 text-black/40" />
            </div>
          )}
        </div>

        {pendingPoint && (
          <div className="absolute inset-x-0 bottom-0 bg-white/90 p-4 backdrop-blur-sm">
            <div className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                placeholder="Name this location..."
                className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2 focus:border-black focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && addLocation()}
              />
              <button
                onClick={addLocation}
                disabled={!currentName}
                className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => setPendingPoint(null)}
                className="rounded-xl bg-black/5 p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold uppercase tracking-wider text-black/40">Locations ({locations.length})</label>
        <div className="flex flex-wrap gap-2">
          {locations.map((loc) => (
            <div key={loc.id} className="flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-sm font-medium">
              <span>{loc.name}</span>
              <button onClick={() => removeLocation(loc.id)} className="text-black/40 hover:text-black">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {locations.length === 0 && (
            <p className="text-sm italic text-black/40">Click the map to add locations</p>
          )}
        </div>
      </div>
    </div>
  );
};
