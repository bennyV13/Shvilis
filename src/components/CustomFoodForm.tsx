import React, { useState } from 'react';
import type { FoodItem } from '../types/food';

interface CustomFoodFormProps {
  onFoodAdded: (food: Omit<FoodItem, 'id' | 'isCustom'>) => void;
}

export const CustomFoodForm: React.FC<CustomFoodFormProps> = ({ onFoodAdded }) => {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [sodium, setSodium] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Food name is required');
      return;
    }

    const cVal = parseFloat(calories) || 0;
    const pVal = parseFloat(protein) || 0;
    const fVal = parseFloat(fat) || 0;
    const cbVal = parseFloat(carbs) || 0;
    const sVal = parseFloat(sodium) || 0;

    if (cVal < 0 || pVal < 0 || fVal < 0 || cbVal < 0 || sVal < 0) {
      setError('Values cannot be negative');
      return;
    }

    onFoodAdded({
      name: name.trim(),
      caloriesPer100g: cVal,
      proteinPer100g: pVal,
      fatPer100g: fVal,
      carbsPer100g: cbVal,
      sodiumPer100g: sVal,
    });

    setName('');
    setCalories('');
    setProtein('');
    setFat('');
    setCarbs('');
    setSodium('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl max-w-md w-full">
      <h3 className="text-xl font-semibold text-emerald-400 mb-4 font-heading">Add Custom Food</h3>
      
      {error && (
        <div className="bg-red-950/50 border border-red-800 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="custom-food-name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Food Name
          </label>
          <input
            id="custom-food-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Grandma's Trail Mix"
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="custom-food-calories" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Calories (kcal / 100g)
            </label>
            <input
              id="custom-food-calories"
              type="number"
              step="any"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="custom-food-protein" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Protein (g / 100g)
            </label>
            <input
              id="custom-food-protein"
              type="number"
              step="any"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="custom-food-fat" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Fat (g / 100g)
            </label>
            <input
              id="custom-food-fat"
              type="number"
              step="any"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="custom-food-carbs" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Carbohydrates (g / 100g)
            </label>
            <input
              id="custom-food-carbs"
              type="number"
              step="any"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="custom-food-sodium" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Sodium (mg / 100g)
          </label>
          <input
            id="custom-food-sodium"
            type="number"
            step="any"
            value={sodium}
            onChange={(e) => setSodium(e.target.value)}
            placeholder="0"
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:shadow-emerald-500/20 active:translate-y-[1px] transition-all"
        >
          Add Food
        </button>
      </div>
    </form>
  );
};
