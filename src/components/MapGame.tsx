import React, { useState } from 'react';
import { MapPin, Check, X } from 'lucide-react';
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

interface MapGameProps {
  mapType: keyof typeof MAPS;
  locations: { id: string; name: string; x: number; y: number }[];
  onComplete: (score: number) => void;
}

export const MapGame: React.FC<MapGameProps> = ({ mapType, locations, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guesses, setGuesses] = useState<{ id: string; correct: boolean }[]>([]);
  const [showResult, setShowResult] = useState(false);

  const target = locations[currentIndex];

  const handleGuess = (locId: string) => {
    if (showResult) return;
    
    const isCorrect = locId === target.id;
    setGuesses([...guesses, { id: target.id, correct: isCorrect }]);
    setShowResult(true);

    setTimeout(() => {
      if (currentIndex < locations.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowResult(false);
      } else {
        const correctCount = guesses.filter(g => g.correct).length + (isCorrect ? 1 : 0);
        onComplete(Math.round((correctCount / locations.length) * 100));
      }
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between rounded-2xl bg-black/5 p-6">
        <div className="text-left">
          <p className="text-sm font-bold uppercase tracking-widest text-black/40">Find</p>
          <p className="text-2xl font-black text-black">{target.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold uppercase tracking-widest text-black/40">Progress</p>
          <p className="text-2xl font-black text-black">
            {currentIndex + 1} <span className="text-black/20">/ {locations.length}</span>
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-black/5">
        <div className="relative aspect-[16/9] w-full">
          <img 
            src={MAPS[mapType]} 
            alt="Map" 
            className="h-full w-full object-contain opacity-80"
            referrerPolicy="no-referrer"
          />
          
          {locations.map((loc) => {
            const isTarget = loc.id === target.id;
            const guess = guesses.find(g => g.id === loc.id);
            
            return (
              <button
                key={loc.id}
                onClick={() => handleGuess(loc.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 p-2 transition-transform hover:scale-125"
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              >
                <div className="relative">
                  <MapPin className={cn(
                    "h-8 w-8 transition-colors",
                    showResult && isTarget ? "text-emerald-500" : "text-black/40 hover:text-black"
                  )} />
                  
                  {showResult && isTarget && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white">
                      {loc.name}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
