import { useState } from 'react';
import { getAllFoods, addCustomFood, deleteCustomFood } from './utils/foodRegistry';
import { calculateTripNutrients } from './utils/nutrition';
import type { FoodItem } from './types/food';
import type { DailyMealPlan } from './types/meal';
import { StatsDashboard } from './components/StatsDashboard';
import { MealPlanner } from './components/MealPlanner';
import { CustomFoodForm } from './components/CustomFoodForm';

const LOCAL_PLANS_KEY = 'shvilis_meal_plans';

function App() {
  const [foods, setFoods] = useState<FoodItem[]>(() => getAllFoods());
  const [plans, setPlans] = useState<DailyMealPlan[]>(() => {
    const savedPlans = localStorage.getItem(LOCAL_PLANS_KEY);
    if (savedPlans) {
      try {
        return JSON.parse(savedPlans);
      } catch {
        // ponytail: fallback
      }
    }
    return [{ dayIndex: 0, breakfast: [], lunch: [], dinner: [], snacks: [] }];
  });

  const handlePlansChange = (newPlans: DailyMealPlan[]) => {
    setPlans(newPlans);
    localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(newPlans));
  };

  const handleFoodAdded = (newFoodData: Omit<FoodItem, 'id' | 'isCustom'>) => {
    addCustomFood(newFoodData);
    setFoods(getAllFoods());
    // Trigger update of plans to sync references if needed (optional)
  };

  const handleFoodDeleted = (id: string) => {
    deleteCustomFood(id);
    setFoods(getAllFoods());

    // Also remove the deleted food from any scheduled meals
    const updatedPlans = plans.map((plan) => ({
      ...plan,
      breakfast: plan.breakfast.filter((item) => item.foodId !== id),
      lunch: plan.lunch.filter((item) => item.foodId !== id),
      dinner: plan.dinner.filter((item) => item.foodId !== id),
      snacks: plan.snacks.filter((item) => item.foodId !== id),
    }));
    handlePlansChange(updatedPlans);
  };

  const tripTotals = calculateTripNutrients(plans, foods);

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-100 px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent m-0 font-heading">
              Shvilis
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Trails & Paths: Smart Packing & Preparation Assistant
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Offline Mode Active
          </div>
        </header>

        {/* Stats Dashboard */}
        <StatsDashboard totals={tripTotals} />

        {/* Core Layout: Scheduler & Custom Foods */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main scheduler: taking 2/3 width on desktop */}
          <div className="lg:col-span-2">
            <MealPlanner foods={foods} plans={plans} onPlansChange={handlePlansChange} />
          </div>

          {/* Sidebar creator form & custom registry: taking 1/3 width */}
          <div className="space-y-8">
            <CustomFoodForm onFoodAdded={handleFoodAdded} />

            {/* Custom food registry list */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-emerald-400 mb-4 font-heading">Custom Food Registry</h3>
              
              {foods.filter((f) => f.isCustom).length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-4">No custom foods added yet.</p>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
                  {foods
                    .filter((f) => f.isCustom)
                    .map((food) => (
                      <div
                        key={food.id}
                        className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-200 truncate">{food.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{food.caloriesPer100g} kcal / 100g</p>
                        </div>
                        <button
                          onClick={() => handleFoodDeleted(food.id)}
                          className="text-red-500 hover:text-red-400 font-medium px-2 py-1 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
