import React, { useState } from 'react';
import type { TripProfile } from '../types/checklist';

interface NutritionCalculatorProps {
  profile: TripProfile;
  onChange: (profile: TripProfile) => void;
}

export const NutritionCalculator: React.FC<NutritionCalculatorProps> = ({ profile, onChange }) => {
  const [showDurationTooltip, setShowDurationTooltip] = useState(false);
  const bmr = profile.bmr || 1600;
  const bodyWeight = profile.bodyWeight || 75;
  const packWeight = profile.packWeight || 15;
  const hours = profile.hours || 6;
  const met = profile.met || 6.0;

  // Calculations
  const activeBurnBase = met * bodyWeight * hours;
  // Every 10 kg of pack weight adds 10% to active burn -> +1% per kg
  const packPenalty = activeBurnBase * (packWeight / 100);
  const totalActiveBurn = activeBurnBase + packPenalty;
  const totalCalories = bmr + totalActiveBurn;

  const proteinMin = 1.6 * bodyWeight;
  const proteinMax = 2.2 * bodyWeight;

  const carbsMin = 8 * bodyWeight;
  const carbsMax = 12 * bodyWeight;

  const fatsMin = (totalCalories * 0.3) / 9;
  const fatsMax = (totalCalories * 0.5) / 9;

  const currentProtein = profile.targetProtein || Math.round(proteinMin);
  const currentCarbs = profile.targetCarbs || Math.round(carbsMin);
  const currentFats = profile.targetFat || Math.round(fatsMin);
  
  const currentCalories = (currentProtein * 4) + (currentCarbs * 4) + (currentFats * 9);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl w-full max-w-3xl mx-auto">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <h3 className="text-xl font-semibold text-emerald-400 font-heading">Trail Nutrition Calculator</h3>
        <p className="text-sm text-slate-400">Calculate physiological targets for endurance hiking</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">BMR (kcal)</p>
          <input type="number" value={bmr} onChange={e => onChange({...profile, bmr: Number(e.target.value)})} className="w-full bg-transparent border-b border-slate-700 text-lg font-bold text-slate-100 font-mono focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Body Wt (kg)</p>
          <input type="number" value={bodyWeight} onChange={e => onChange({...profile, bodyWeight: Number(e.target.value)})} className="w-full bg-transparent border-b border-slate-700 text-lg font-bold text-slate-100 font-mono focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Pack Wt (kg)</p>
          <input type="number" value={packWeight} onChange={e => onChange({...profile, packWeight: Number(e.target.value)})} className="w-full bg-transparent border-b border-slate-700 text-lg font-bold text-slate-100 font-mono focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 relative">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration (hr)</p>
            <button 
              type="button" 
              onClick={() => setShowDurationTooltip(!showDurationTooltip)}
              className="cursor-pointer bg-slate-800 text-slate-300 w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors hover:bg-slate-700"
            >
              ?
            </button>
          </div>
          {showDurationTooltip && (
            <div className="absolute right-0 top-10 w-48 p-3 bg-slate-800 text-slate-200 text-xs rounded-lg shadow-xl z-10 border border-slate-700 leading-relaxed">
              Time of active walking.
            </div>
          )}
          <input type="number" value={hours} onChange={e => onChange({...profile, hours: Number(e.target.value)})} className="w-full bg-transparent border-b border-slate-700 text-lg font-bold text-slate-100 font-mono focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <a href="https://en.wikipedia.org/wiki/Metabolic_equivalent_of_task" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 hover:underline transition-colors" title="Learn more about MET values">
              MET Value
            </a>
          </p>
          <input type="number" value={met} onChange={e => onChange({...profile, met: Number(e.target.value)})} step="0.1" className="w-full bg-transparent border-b border-slate-700 text-lg font-bold text-slate-100 font-mono focus:outline-none focus:border-emerald-500" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
          <div className="flex justify-between items-baseline mb-2">
            <h4 className="text-lg font-bold text-emerald-400">Total Calories: {Math.round(totalCalories)} kcal</h4>
          </div>
          <p className="text-sm text-slate-300 mb-2 font-mono">BMR + (MET × Body Weight × Duration) + Pack Penalty</p>
          <p className="text-xs text-slate-400">
            <strong className="text-emerald-500">The Pack Weight Penalty:</strong> Every 10 kg of pack weight adds 10% to your active burn. 
            (Base Active Burn: {Math.round(activeBurnBase)} kcal, Pack Penalty: +{Math.round(packPenalty)} kcal)
          </p>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
          <div className="flex justify-between items-baseline mb-2">
            <h4 className="text-lg font-bold text-emerald-400">Protein: {Math.round(proteinMin)} - {Math.round(proteinMax)} g</h4>
            <span className="text-xs text-slate-500 font-mono">1.6–2.2 g/kg</span>
          </div>
          <p className="text-xs text-slate-400">
            <strong className="text-emerald-500">The Recovery Window:</strong> Consume a 3:1 or 4:1 carb-to-protein ratio within 30–45 minutes of stopping to repair muscle.
          </p>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
          <div className="flex justify-between items-baseline mb-2">
            <h4 className="text-lg font-bold text-emerald-400">Carbohydrates: {Math.round(carbsMin)} - {Math.round(carbsMax)} g</h4>
            <span className="text-xs text-slate-500 font-mono">8–12 g/kg</span>
          </div>
          <p className="text-xs text-slate-400">
            <strong className="text-emerald-500">The Absorption Ceiling:</strong> Your gut can only process 60–90 grams per hour; you must "drip feed" these throughout the day.
          </p>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
          <div className="flex justify-between items-baseline mb-2">
            <h4 className="text-lg font-bold text-emerald-400">Fats: {Math.round(fatsMin)} - {Math.round(fatsMax)} g</h4>
            <span className="text-xs text-slate-500 font-mono">30%–50% of cals</span>
          </div>
          <p className="text-xs text-slate-400">
            <strong className="text-emerald-500">The GI Bottleneck:</strong> Keep daytime fat low to avoid nausea; backload these highly dense calories into your evening camp meal.
          </p>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-800">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-lg font-semibold text-emerald-400 font-heading">Dial in Your Macros</h3>
            <p className="text-sm text-slate-400">Adjust the sliders within the physiological ranges to hit your target.</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Slider Calories</p>
            <p className={`text-2xl font-bold font-mono ${Math.abs(currentCalories - totalCalories) < 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {Math.round(currentCalories)} <span className="text-sm font-normal text-slate-400">kcal</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">Target: {Math.round(totalCalories)}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Protein Slider */}
          <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-slate-300">Protein (g)</label>
              <span className="text-emerald-400 font-mono font-bold">{Math.round(currentProtein)}g <span className="text-slate-500 text-xs font-normal">({Math.round(currentProtein * 4)} kcal)</span></span>
            </div>
            <input 
              type="range" 
              min={Math.round(proteinMin)} 
              max={Math.round(proteinMax)} 
              value={Math.round(currentProtein)} 
              onChange={e => onChange({...profile, targetProtein: Number(e.target.value)})} 
              className="w-full accent-emerald-500" 
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
              <span>Min: {Math.round(proteinMin)}g</span>
              <span>Max: {Math.round(proteinMax)}g</span>
            </div>
          </div>

          {/* Carbs Slider */}
          <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-slate-300">Carbohydrates (g)</label>
              <span className="text-emerald-400 font-mono font-bold">{Math.round(currentCarbs)}g <span className="text-slate-500 text-xs font-normal">({Math.round(currentCarbs * 4)} kcal)</span></span>
            </div>
            <input 
              type="range" 
              min={Math.round(carbsMin)} 
              max={Math.round(carbsMax)} 
              value={Math.round(currentCarbs)} 
              onChange={e => onChange({...profile, targetCarbs: Number(e.target.value)})} 
              className="w-full accent-emerald-500" 
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
              <span>Min: {Math.round(carbsMin)}g</span>
              <span>Max: {Math.round(carbsMax)}g</span>
            </div>
          </div>

          {/* Fats Slider */}
          <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-slate-300">Fats (g)</label>
              <span className="text-emerald-400 font-mono font-bold">{Math.round(currentFats)}g <span className="text-slate-500 text-xs font-normal">({Math.round(currentFats * 9)} kcal)</span></span>
            </div>
            <input 
              type="range" 
              min={Math.round(fatsMin)} 
              max={Math.round(fatsMax)} 
              value={Math.round(currentFats)} 
              onChange={e => onChange({...profile, targetFat: Number(e.target.value)})} 
              className="w-full accent-emerald-500" 
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
              <span>Min: {Math.round(fatsMin)}g</span>
              <span>Max: {Math.round(fatsMax)}g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
