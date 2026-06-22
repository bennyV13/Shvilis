import React, { useState } from 'react';
import { addCustomFood } from '../utils/foodRegistry';
import { addCustomItem, addCustomCategory, saveLinkedWeight, getCustomCategories } from '../utils/checklistRegistry';
import { DEFAULT_RULES } from '../utils/checklistRegistry';
import { useAuth } from '../contexts/AuthContext';
import { syncCustomFood, syncChecklistItem, syncCustomCategory } from '../utils/supabaseSync';

const LLM_PROMPT = `I am going to provide you with images or text containing outdoor gear and/or food nutrition labels. Your task is to extract this data and convert it into a strict JSON object that I can import into my hiking planner app. 

Please follow these strict data conversion rules:

FOR FOOD (Nutrition Labels):
1. My app REQUIRES all nutritional data to be calculated "Per 100g". If the nutrition label provides data per serving, you MUST do the math to convert Calories, Protein, Fat, Carbohydrates, and Sodium to their per 100g equivalents.
2. If any macronutrient (Protein, Fat, Carbs, Sodium) is missing or 0, output 0 for it. 

FOR GEAR:
1. Try to categorize gear into logical outdoor categories (e.g., "Shelter", "Sleep System", "Cooking", "Electronics", "Clothing", "First Aid", "Consumables"). 
2. Ensure the weight is ALWAYS converted to grams (\`weightGrams\`). If the image shows ounces, multiply by 28.3495 and round to the nearest whole number. If it shows pounds, multiply by 453.592.
3. If an item is worn on the body (like hiking boots or trekking poles), set \`"isWorn": true\`.
4. If an item gets used up (like gas canisters, bug spray, or sunscreen), set \`"isConsumable": true\`.

OUTPUT FORMAT:
Provide ONLY the raw JSON object inside a code block. Do not add any conversational text before or after the JSON. Use the exact schema below. Omit the foods array if I only give you gear, and omit the gear array if I only give you food.

{
  "foods": [
    {
      "name": "Product Name (e.g., Clif Bar Peanut Butter)",
      "caloriesPer100g": 400,
      "proteinPer100g": 10,
      "fatPer100g": 5,
      "carbsPer100g": 60,
      "sodiumPer100g": 150
    }
  ],
  "gear": [
    {
      "name": "Item Name (e.g., Big Agnes Copper Spur)",
      "category": "Shelter",
      "weightGrams": 1400,
      "quantity": 1,
      "isWorn": false,
      "isConsumable": false
    }
  ]
}`;

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

      <details className="text-sm text-slate-400 group pt-4 border-t border-slate-800">
        <summary className="cursor-pointer hover:text-slate-300 transition-colors list-none font-semibold flex items-center gap-2">
          <span className="text-emerald-500 group-open:rotate-90 transition-transform">▶</span>
          Need help formatting? Get the LLM Prompt
        </summary>
        <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800 relative">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(LLM_PROMPT);
              setSuccess('Prompt copied to clipboard!');
              setTimeout(() => setSuccess(''), 3000);
            }}
            className="absolute top-3 right-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition-colors"
          >
            Copy Prompt
          </button>
          <pre className="whitespace-pre-wrap text-xs text-slate-300 font-mono mt-6">{LLM_PROMPT}</pre>
        </div>
      </details>
    </div>
  );
};
