import React, { useState } from 'react';
import { addCustomFood } from '../utils/foodRegistry';
import { addCustomItem, addCustomCategory, saveLinkedWeight, getCustomCategories } from '../utils/checklistRegistry';
import { DEFAULT_RULES } from '../utils/checklistRegistry';
import { useAuth } from '../contexts/AuthContext';
import { syncCustomFood, syncChecklistItem, syncCustomCategory } from '../utils/supabaseSync';

export const JSONImport: React.FC = () => {
  const [jsonStr, setJsonStr] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleImport = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = JSON.parse(jsonStr);
      let foodsCount = 0;
      let gearCount = 0;

      if (data.foods && Array.isArray(data.foods)) {
        for (const f of data.foods) {
          if (f.name && f.caloriesPer100g !== undefined) {
             const newFood = addCustomFood({
               name: f.name,
               caloriesPer100g: f.caloriesPer100g,
               proteinPer100g: f.proteinPer100g || 0,
               fatPer100g: f.fatPer100g || 0,
               carbsPer100g: f.carbsPer100g || 0,
               sodiumPer100g: f.sodiumPer100g || 0,
             });
             if (user) {
               await syncCustomFood(user.id, newFood);
             }
             foodsCount++;
          }
        }
      }

      if (data.gear && Array.isArray(data.gear)) {
        const existingCats = getCustomCategories();
        for (const g of data.gear) {
          if (g.name && g.category) {
             if (!existingCats.includes(g.category) && !DEFAULT_RULES.some(r => r.category === g.category)) {
                addCustomCategory(g.category);
                existingCats.push(g.category);
                if (user) {
                  await syncCustomCategory(user.id, g.category);
                }
             }
             const newItem = addCustomItem({
               name: g.name,
               category: g.category,
               quantity: g.quantity || 1,
             });
             
             if (g.weightGrams !== undefined) {
                saveLinkedWeight(newItem.id, g.weightGrams);
                newItem.linkedGearWeightGrams = g.weightGrams;
             }
             if (g.isWorn) newItem.isWorn = true;
             if (g.isConsumable) newItem.isConsumable = true;

             if (user) {
               await syncChecklistItem(user.id, newItem);
             }
             gearCount++;
          }
        }
      }

      setSuccess(`Imported ${foodsCount} foods and ${gearCount} gear items. Reloading to apply changes...`);
      setTimeout(() => window.location.reload(), 1500);

    } catch (e) {
      setError('Invalid JSON format or network error.');
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-semibold text-emerald-400 font-heading">Bulk JSON Import</h3>
      <p className="text-xs text-slate-400">
        Paste a JSON object with <code>{"{ \"foods\": [...], \"gear\": [...] }"}</code>.
      </p>
      <textarea
        className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
        placeholder={'{"foods":[{"name":"Clif Bar","caloriesPer100g":400}],"gear":[{"name":"Tent","category":"shelter","weightGrams":1200}]}'}
        value={jsonStr}
        onChange={(e) => setJsonStr(e.target.value)}
      />
      {error && <p className="text-rose-400 text-xs">{error}</p>}
      {success && <p className="text-emerald-400 text-xs">{success}</p>}
      <button
        onClick={handleImport}
        disabled={loading || !jsonStr.trim()}
        className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-sm transition-colors disabled:opacity-50"
      >
        {loading ? 'Importing...' : 'Import JSON'}
      </button>
    </div>
  );
};
