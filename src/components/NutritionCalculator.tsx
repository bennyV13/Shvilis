import React, { useState } from 'react';

export const NutritionCalculator: React.FC = () => {
  const [bmr, setBmr] = useState(1600);
  const [bodyWeight, setBodyWeight] = useState(75);
  const [packWeight, setPackWeight] = useState(15);
  const [hours, setHours] = useState(6);
  const [met, setMet] = useState(6.0); // 6.0 is typical for hiking

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

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl w-full max-w-3xl mx-auto">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <h3 className="text-xl font-semibold text-emerald-400 font-heading">Trail Nutrition Calculator</h3>
        <p className="text-sm text-slate-400">Calculate physiological targets for endurance hiking</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">BMR (kcal)</p>
          <input type="number" value={bmr} onChange={e => setBmr(Number(e.target.value))} className="w-full bg-transparent border-b border-slate-700 text-lg font-bold text-slate-100 font-mono focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Body Wt (kg)</p>
          <input type="number" value={bodyWeight} onChange={e => setBodyWeight(Number(e.target.value))} className="w-full bg-transparent border-b border-slate-700 text-lg font-bold text-slate-100 font-mono focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Pack Wt (kg)</p>
          <input type="number" value={packWeight} onChange={e => setPackWeight(Number(e.target.value))} className="w-full bg-transparent border-b border-slate-700 text-lg font-bold text-slate-100 font-mono focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Duration (hr)</p>
          <input type="number" value={hours} onChange={e => setHours(Number(e.target.value))} className="w-full bg-transparent border-b border-slate-700 text-lg font-bold text-slate-100 font-mono focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">MET Value</p>
          <input type="number" value={met} onChange={e => setMet(Number(e.target.value))} step="0.1" className="w-full bg-transparent border-b border-slate-700 text-lg font-bold text-slate-100 font-mono focus:outline-none focus:border-emerald-500" />
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
    </div>
  );
};
