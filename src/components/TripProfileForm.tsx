import React from 'react';
import type { TripProfile } from '../types/checklist';

interface TripProfileFormProps {
  profile: TripProfile;
  onChange: (profile: TripProfile) => void;
}

const WEATHER_OPTIONS: ('sunny' | 'rainy' | 'cold' | 'hot')[] = ['sunny', 'rainy', 'cold', 'hot'];
const TERRAIN_OPTIONS: ('trail' | 'alpine' | 'desert' | 'forest')[] = ['trail', 'alpine', 'desert', 'forest'];

export const TripProfileForm: React.FC<TripProfileFormProps> = ({ profile, onChange }) => {
  const handleWeatherChange = (option: 'sunny' | 'rainy' | 'cold' | 'hot', checked: boolean) => {
    let updatedWeather = [...profile.weather];
    if (checked) {
      if (!updatedWeather.includes(option)) {
        updatedWeather.push(option);
      }
    } else {
      updatedWeather = updatedWeather.filter((w) => w !== option);
    }
    onChange({ ...profile, weather: updatedWeather });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) {
      onChange({ ...profile, durationDays: val });
    }
  };

  const handleGroupSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) {
      onChange({ ...profile, groupSize: val });
    }
  };

  const handleTerrainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as 'trail' | 'alpine' | 'desert' | 'forest';
    onChange({ ...profile, terrain: val });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <h3 className="text-lg font-semibold text-emerald-400 font-heading border-b border-slate-800 pb-3">
        Trip Profile & Conditions
      </h3>

      <div className="space-y-4">
        {/* Weather selection */}
        <div>
          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Expected Weather (Select all)
          </span>
          <div className="grid grid-cols-2 gap-3">
            {WEATHER_OPTIONS.map((w) => {
              const isChecked = profile.weather.includes(w);
              return (
                <label
                  key={w}
                  htmlFor={`weather-${w}`}
                  className={`flex items-center space-x-3 text-sm px-4 py-3 rounded-lg border cursor-pointer select-none transition-all ${
                    isChecked
                      ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`weather-${w}`}
                    checked={isChecked}
                    onChange={(e) => handleWeatherChange(w, e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30"
                  />
                  <span className="capitalize">{w}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Duration */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="duration-days" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Duration (Days)
            </label>
            <input
              type="number"
              id="duration-days"
              min="1"
              step="1"
              value={profile.durationDays}
              onChange={handleDurationChange}
              className="bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          {/* Group Size */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="group-size" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Group Size
            </label>
            <input
              type="number"
              id="group-size"
              min="1"
              step="1"
              value={profile.groupSize}
              onChange={handleGroupSizeChange}
              className="bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          {/* Terrain */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="terrain-type" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Terrain
            </label>
            <select
              id="terrain-type"
              value={profile.terrain}
              onChange={handleTerrainChange}
              className="bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
            >
              {TERRAIN_OPTIONS.map((t) => (
                <option key={t} value={t} className="bg-slate-950 text-slate-300">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
