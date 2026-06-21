import React from 'react';
import type { NutritionTotals } from '../types/meal';
import { calculateCaloricDensity, calculateMacroRatios } from '../utils/nutrition';

interface StatsDashboardProps {
  totals: NutritionTotals;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ totals }) => {
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
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Calories</p>
          <p className="text-2xl font-bold text-slate-100 font-mono">{Math.round(totals.calories)} kcal</p>
        </div>

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
        <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Macronutrient Breakdown (Calorie %)</h4>
        <div className="space-y-4">
          {/* Protein */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-400">Protein ({Math.round(totals.protein)}g)</span>
              <span className="font-mono text-emerald-400 font-bold">{Math.round(macros.proteinPercent)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${macros.proteinPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Fat */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-400">Fat ({Math.round(totals.fat)}g)</span>
              <span className="font-mono text-emerald-400 font-bold">{Math.round(macros.fatPercent)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${macros.fatPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Carbohydrates */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-400">Carbohydrates ({Math.round(totals.carbs)}g)</span>
              <span className="font-mono text-emerald-400 font-bold">{Math.round(macros.carbsPercent)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${macros.carbsPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
