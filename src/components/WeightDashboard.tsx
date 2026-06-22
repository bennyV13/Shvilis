import React from 'react';
import type { GearWeightTotals } from '../utils/weightCalculator';

interface WeightDashboardProps {
  totals: GearWeightTotals;
}

const CATEGORY_COLORS: Record<string, string> = {
  shelter: 'bg-emerald-500',
  sleep: 'bg-indigo-500',
  kitchen: 'bg-amber-500',
  clothing: 'bg-sky-500',
  navigation: 'bg-violet-500',
  safety: 'bg-rose-500',
  food: 'bg-yellow-500',
  group: 'bg-pink-500',
  essentials: 'bg-teal-500',
};

export const WeightDashboard: React.FC<WeightDashboardProps> = ({ totals }) => {
  const formatKg = (grams: number) => {
    return (grams / 1000).toFixed(2) + ' kg';
  };

  const categories = Object.keys(totals.categoryWeights).sort(
    (a, b) => totals.categoryWeights[b] - totals.categoryWeights[a]
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <h3 className="text-lg font-semibold text-emerald-400 font-heading border-b border-slate-800 pb-3">
        Gear Weight Optimization
      </h3>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Base Weight */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-3 text-center">
          <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Base Weight
          </span>
          <span className="block text-lg font-bold text-slate-200 mt-1 font-mono">
            {formatKg(totals.baseWeightGrams)}
          </span>
        </div>

        {/* Consumable */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-3 text-center">
          <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Consumable
          </span>
          <span className="block text-lg font-bold text-amber-400 mt-1 font-mono">
            {formatKg(totals.consumableWeightGrams)}
          </span>
        </div>

        {/* Worn Weight */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-3 text-center">
          <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Worn Weight
          </span>
          <span className="block text-lg font-bold text-sky-400 mt-1 font-mono">
            {formatKg(totals.wornWeightGrams)}
          </span>
        </div>

        {/* Skin-Out */}
        <div className="bg-slate-950/40 border border-emerald-500/20 bg-emerald-500/5 rounded-lg p-3 text-center">
          <span className="block text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
            Skin-Out
          </span>
          <span className="block text-lg font-bold text-emerald-400 mt-1 font-mono">
            {formatKg(totals.skinOutWeightGrams)}
          </span>
        </div>
      </div>

      {/* Category Progress Bars */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Category Breakdown
        </h4>

        {categories.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center py-4">
            No gear weights added to the checklist yet.
          </p>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => {
              const weight = totals.categoryWeights[cat];
              const percentage =
                totals.skinOutWeightGrams > 0
                  ? (weight / totals.skinOutWeightGrams) * 100
                  : 0;
              const colorClass = CATEGORY_COLORS[cat.toLowerCase()] || 'bg-slate-500';

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 capitalize">{cat}</span>
                    <span className="text-slate-400 font-mono">
                      {weight} g ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${colorClass} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
