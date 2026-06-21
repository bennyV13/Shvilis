import { useState } from 'react';
import { getAllFoods, addCustomFood, deleteCustomFood } from './utils/foodRegistry';
import { calculateTripNutrients } from './utils/nutrition';
import type { FoodItem } from './types/food';
import type { DailyMealPlan } from './types/meal';
import { StatsDashboard } from './components/StatsDashboard';
import { MealPlanner } from './components/MealPlanner';
import { CustomFoodForm } from './components/CustomFoodForm';

// Checklist imports
import {
  getTripProfile,
  saveTripProfile,
  getCustomCategories,
  addCustomCategory,
  getCustomItems,
  addCustomItem,
  updateCustomItem,
  getPackedStates,
  savePackedState,
  getGroupAssignments,
  saveGroupAssignment,
  getLinkedWeights,
  saveLinkedWeight,
  DEFAULT_RULES,
} from './utils/checklistRegistry';
import { generateChecklist } from './utils/checklistGenerator';
import { TripProfileForm } from './components/TripProfileForm';
import { Checklist } from './components/Checklist';
import type { TripProfile, ChecklistItem } from './types/checklist';

const LOCAL_PLANS_KEY = 'shvilis_meal_plans';
const QUANTITY_OVERRIDES_KEY = 'shvilis_quantity_overrides';

function App() {
  // Tabs state
  const [activeTab, setActiveTab] = useState<'meals' | 'checklist'>('meals');

  // Meal Planner state
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

  // Checklist state
  const [profile, setProfile] = useState<TripProfile>(() => getTripProfile());
  const [customCategories, setCustomCategories] = useState<string[]>(() => getCustomCategories());
  const [customItems, setCustomItems] = useState<ChecklistItem[]>(() => getCustomItems());
  const [packedStates, setPackedStates] = useState<Record<string, boolean>>(() => getPackedStates());
  const [assignments, setAssignments] = useState<Record<string, string>>(() => getGroupAssignments());
  const [weights, setWeights] = useState<Record<string, number>>(() => getLinkedWeights());
  const [quantityOverrides, setQuantityOverrides] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem(QUANTITY_OVERRIDES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Meal Planner handlers
  const handlePlansChange = (newPlans: DailyMealPlan[]) => {
    setPlans(newPlans);
    localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(newPlans));
  };

  const handleFoodAdded = (newFoodData: Omit<FoodItem, 'id' | 'isCustom'>) => {
    addCustomFood(newFoodData);
    setFoods(getAllFoods());
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

  // Checklist handlers
  const handleProfileChange = (newProfile: TripProfile) => {
    setProfile(newProfile);
    saveTripProfile(newProfile);
  };

  const handleTogglePacked = (itemId: string, isPacked: boolean) => {
    savePackedState(itemId, isPacked);
    setPackedStates(getPackedStates());
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (itemId.startsWith('custom-item-')) {
      updateCustomItem(itemId, { quantity });
      setCustomItems(getCustomItems());
    } else {
      const updatedOverrides = { ...quantityOverrides, [itemId]: quantity };
      setQuantityOverrides(updatedOverrides);
      localStorage.setItem(QUANTITY_OVERRIDES_KEY, JSON.stringify(updatedOverrides));
    }
  };

  const handleAddCustomItem = (name: string, category: string, quantity: number) => {
    addCustomItem({ name, category, quantity });
    setCustomItems(getCustomItems());
  };

  const handleAddCustomCategory = (categoryName: string) => {
    addCustomCategory(categoryName);
    setCustomCategories(getCustomCategories());
  };

  const handleAssignMember = (itemId: string, memberId: string) => {
    saveGroupAssignment(itemId, memberId);
    setAssignments(getGroupAssignments());
  };

  const handleUpdateWeight = (itemId: string, weightGrams: number) => {
    saveLinkedWeight(itemId, weightGrams);
    setWeights(getLinkedWeights());
  };

  // Generate checklist with current state and apply quantity overrides
  const baseGeneratedChecklist = generateChecklist(
    profile,
    customItems,
    DEFAULT_RULES,
    packedStates,
    assignments,
    weights
  );

  const generatedItems = baseGeneratedChecklist.map((item) => ({
    ...item,
    quantity: quantityOverrides[item.id] !== undefined ? quantityOverrides[item.id] : item.quantity,
  }));

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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('meals')}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'meals'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Meal Planner
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'checklist'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Gear Checklist
          </button>
        </div>

        {/* Tab Content: Meal Planner */}
        {activeTab === 'meals' && (
          <div className="space-y-8">
            <StatsDashboard totals={tripTotals} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Main scheduler */}
              <div className="lg:col-span-2">
                <MealPlanner foods={foods} plans={plans} onPlansChange={handlePlansChange} />
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                <CustomFoodForm onFoodAdded={handleFoodAdded} />

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-4 font-heading">
                    Custom Food Registry
                  </h3>

                  {foods.filter((f) => f.isCustom).length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-4">
                      No custom foods added yet.
                    </p>
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
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {food.caloriesPer100g} kcal / 100g
                              </p>
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
        )}

        {/* Tab Content: Checklist */}
        {activeTab === 'checklist' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TripProfileForm profile={profile} onChange={handleProfileChange} />
            </div>

            {/* Checklist */}
            <div className="lg:col-span-2">
              <Checklist
                items={generatedItems}
                customCategories={customCategories}
                onTogglePacked={handleTogglePacked}
                onUpdateQuantity={handleUpdateQuantity}
                onAddCustomItem={handleAddCustomItem}
                onAddCustomCategory={handleAddCustomCategory}
                onAssignMember={handleAssignMember}
                onUpdateWeight={handleUpdateWeight}
                groupSize={profile.groupSize}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
