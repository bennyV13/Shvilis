import React from 'react';
import type { NutritionTotals } from '../types/meal';
import { calculateCaloricDensity, calculateMacroRatios } from '../utils/nutrition';

import type { TripProfile } from '../types/checklist';

interface StatsDashboardProps {
  totals: NutritionTotals;
  profile: TripProfile;
  onChange: (profile: TripProfile) => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ totals, profile, onChange }) => {
  const density = calculateCaloricDensity(totals.calories, totals.weightGrams);
  const weightKg = totals.weightGrams / 1000;
  const macros = calculateMacroRatios(totals.protein, totals.fat, totals.carbs);

  const getEfficiencyBadge = () => {
    if (totals.weightGrams === 0) return null;
    if (density >= 4.0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          High Weight Efficiency
        </span>
      );
    }
    if (density < 2.0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          Low Weight Efficiency
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 border border-slate-500/30 text-slate-400">
        Moderate Efficiency
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-semibold text-emerald-400 font-heading">Trip Nutrition & Stats</h3>
          <p className="text-sm text-slate-400">Live totals for planned outdoor trail fuel</p>
        </div>
        {getEfficiencyBadge()}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Calories</p>
          <input type="number" value={profile.targetCalories || ''} onChange={(e) => onChange({...profile, targetCalories: parseInt(e.target.value) || undefined})} className="w-full bg-transparent border-b border-slate-700 text-xl font-bold text-slate-100 font-mono focus:outline-none focus:border-emerald-500" placeholder="kcal" />
          <p className="text-xs text-slate-500 mt-2">Current: {Math.round(totals.calories)}</p>
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Protein</p>
          <input type="number" value={profile.targetProtein || ''} onChange={(e) => onChange({...profile, targetProtein: parseInt(e.target.value) || undefined})} className="w-full bg-transparent border-b border-slate-700 text-xl font-bold text-slate-100 font-mono focus:outline-none focus:border-emerald-500" placeholder="g" />
          <p className="text-xs text-slate-500 mt-2">Current: {Math.round(totals.protein)}</p>
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Fat</p>
          <input type="number" value={profile.targetFat || ''} onChange={(e) => onChange({...profile, targetFat: parseInt(e.target.value) || undefined})} className="w-full bg-transparent border-b border-slate-700 text-xl font-bold text-slate-100 font-mono focus:outline-none focus:border-emerald-500" placeholder="g" />
          <p className="text-xs text-slate-500 mt-2">Current: {Math.round(totals.fat)}</p>
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Carbs</p>
          <input type="number" value={profile.targetCarbs || ''} onChange={(e) => onChange({...profile, targetCarbs: parseInt(e.target.value) || undefined})} className="w-full bg-transparent border-b border-slate-700 text-xl font-bold text-slate-100 font-mono focus:outline-none focus:border-emerald-500" placeholder="g" />
          <p className="text-xs text-slate-500 mt-2">Current: {Math.round(totals.carbs)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Weight</p>
          <p className="text-2xl font-bold text-slate-100 font-mono">{weightKg.toFixed(2)} kg</p>
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Caloric Density</p>
          <p className="text-2xl font-bold text-slate-100 font-mono">{density.toFixed(2)} kcal/g</p>
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Sodium</p>
          <p className="text-2xl font-bold text-slate-100 font-mono">{Math.round(totals.sodium)} mg</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Macronutrient Progress</h4>
        <div className="space-y-4">
          {/* Protein */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-400">Protein ({Math.round(totals.protein)}g{profile.targetProtein ? ` / ${profile.targetProtein}g` : ''})</span>
              <span className="font-mono text-emerald-400 font-bold">{profile.targetProtein ? Math.round((totals.protein / profile.targetProtein) * 100) : Math.round(macros.proteinPercent)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, profile.targetProtein ? (totals.protein / profile.targetProtein) * 100 : macros.proteinPercent)}%` }}
              ></div>
            </div>
          </div>

          {/* Fat */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-400">Fat ({Math.round(totals.fat)}g{profile.targetFat ? ` / ${profile.targetFat}g` : ''})</span>
              <span className="font-mono text-emerald-400 font-bold">{profile.targetFat ? Math.round((totals.fat / profile.targetFat) * 100) : Math.round(macros.fatPercent)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, profile.targetFat ? (totals.fat / profile.targetFat) * 100 : macros.fatPercent)}%` }}
              ></div>
            </div>
          </div>

          {/* Carbohydrates */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-400">Carbs ({Math.round(totals.carbs)}g{profile.targetCarbs ? ` / ${profile.targetCarbs}g` : ''})</span>
              <span className="font-mono text-emerald-400 font-bold">{profile.targetCarbs ? Math.round((totals.carbs / profile.targetCarbs) * 100) : Math.round(macros.carbsPercent)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, profile.targetCarbs ? (totals.carbs / profile.targetCarbs) * 100 : macros.carbsPercent)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
