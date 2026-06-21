import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { getAllFoods, addCustomFood, deleteCustomFood, getDefaultFoods } from './utils/foodRegistry';
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

// Weight Optimizer imports
import { calculateGearWeights } from './utils/weightCalculator';
import { WeightDashboard } from './components/WeightDashboard';

// Supabase and Auth imports
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForms } from './components/AuthForms';
import {
  fetchUserData,
  syncTripProfile,
  syncCustomCategory,
  syncChecklistItem,
  syncCustomFood,
  deleteCustomFoodFromDb,
  syncMealPlans,
} from './utils/supabaseSync';

const LOCAL_PLANS_KEY = 'shvilis_meal_plans';
const QUANTITY_OVERRIDES_KEY = 'shvilis_quantity_overrides';
const WORN_STATES_KEY = 'shvilis_worn_states';
const CONSUMABLE_STATES_KEY = 'shvilis_consumable_states';

function AppContent() {
  const { user } = useAuth();

  // Tabs state
  const [activeTab, setActiveTab] = useState<'meals' | 'checklist' | 'account'>('meals');

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

  // Worn and Consumable overrides for default rules items
  const [wornStates, setWornStates] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(WORN_STATES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [consumableStates, setConsumableStates] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(CONSUMABLE_STATES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Effect to load user data from Supabase when logged in
  useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          const data = await fetchUserData(user.id);
          if (data.profile) {
            setProfile(data.profile);
          }
          if (data.customCategories.length > 0) {
            setCustomCategories(data.customCategories);
          }
          if (data.checklistItems.length > 0) {
            const customs = data.checklistItems.filter(item => item.id.startsWith('custom-item-'));
            setCustomItems(customs);

            const newPacked: Record<string, boolean> = {};
            const newAssignments: Record<string, string> = {};
            const newWeights: Record<string, number> = {};
            const newQuantities: Record<string, number> = {};
            const newWorn: Record<string, boolean> = {};
            const newConsumable: Record<string, boolean> = {};

            data.checklistItems.forEach(item => {
              newPacked[item.id] = item.isPacked;
              if (item.assignedToMemberId) newAssignments[item.id] = item.assignedToMemberId;
              if (item.linkedGearWeightGrams) newWeights[item.id] = item.linkedGearWeightGrams;
              
              if (!item.id.startsWith('custom-item-')) {
                newQuantities[item.id] = item.quantity;
                newWorn[item.id] = item.isWorn || false;
                newConsumable[item.id] = item.isConsumable || false;
              }
            });

            setPackedStates(newPacked);
            setAssignments(newAssignments);
            setWeights(newWeights);
            setQuantityOverrides(newQuantities);
            setWornStates(newWorn);
            setConsumableStates(newConsumable);
          }

          if (data.customFoods.length > 0) {
            setFoods([...getDefaultFoods(), ...data.customFoods]);
          } else {
            setFoods(getDefaultFoods());
          }

          if (data.mealPlans.length > 0) {
            setPlans(data.mealPlans);
          }
        } catch (err) {
          console.error('Error fetching Supabase user data:', err);
        }
      } else {
        // Fallback to local storage for guests
        setProfile(getTripProfile());
        setCustomCategories(getCustomCategories());
        setCustomItems(getCustomItems());
        setPackedStates(getPackedStates());
        setAssignments(getGroupAssignments());
        setWeights(getLinkedWeights());
        setFoods(getAllFoods());
        
        const savedPlans = localStorage.getItem(LOCAL_PLANS_KEY);
        if (savedPlans) {
          try {
            setPlans(JSON.parse(savedPlans));
          } catch {
            // fallback
          }
        } else {
          setPlans([{ dayIndex: 0, breakfast: [], lunch: [], dinner: [], snacks: [] }]);
        }
      }
    }
    loadData();
  }, [user]);

  // Meal Planner handlers
  const handlePlansChange = (newPlans: DailyMealPlan[]) => {
    setPlans(newPlans);
    localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(newPlans));
    if (user) {
      syncMealPlans(user.id, newPlans);
    }
  };

  const handleFoodAdded = (newFoodData: Omit<FoodItem, 'id' | 'isCustom'>) => {
    const newFood = addCustomFood(newFoodData);
    if (user) {
      syncCustomFood(user.id, newFood).then(() => {
        setFoods([...getDefaultFoods(), ...foods.filter(f => f.isCustom), newFood]);
      });
    } else {
      setFoods(getAllFoods());
    }
  };

  const handleFoodDeleted = (id: string) => {
    deleteCustomFood(id);
    if (user) {
      deleteCustomFoodFromDb(user.id, id);
    }
    setFoods(foods.filter((f) => f.id !== id));

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
    if (user) {
      syncTripProfile(user.id, newProfile);
    }
  };

  const handleTogglePacked = (itemId: string, isPacked: boolean) => {
    savePackedState(itemId, isPacked);
    const updatedPacked = { ...packedStates, [itemId]: isPacked };
    setPackedStates(updatedPacked);
    
    if (user) {
      const item = generatedItems.find(i => i.id === itemId);
      if (item) {
        syncChecklistItem(user.id, { ...item, isPacked });
      }
    }
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (itemId.startsWith('custom-item-')) {
      updateCustomItem(itemId, { quantity });
      const updatedCustom = customItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setCustomItems(updatedCustom);
      
      if (user) {
        const item = updatedCustom.find(i => i.id === itemId);
        if (item) {
          syncChecklistItem(user.id, item);
        }
      }
    } else {
      const updatedOverrides = { ...quantityOverrides, [itemId]: quantity };
      setQuantityOverrides(updatedOverrides);
      localStorage.setItem(QUANTITY_OVERRIDES_KEY, JSON.stringify(updatedOverrides));
      
      if (user) {
        const item = generatedItems.find(i => i.id === itemId);
        if (item) {
          syncChecklistItem(user.id, { ...item, quantity });
        }
      }
    }
  };

  const handleAddCustomItem = (name: string, category: string, quantity: number) => {
    const newItem = addCustomItem({ name, category, quantity });
    const updatedCustom = [...customItems, newItem];
    setCustomItems(updatedCustom);
    
    if (user) {
      syncChecklistItem(user.id, newItem);
    }
  };

  const handleAddCustomCategory = (categoryName: string) => {
    addCustomCategory(categoryName);
    setCustomCategories(getCustomCategories());
    if (user) {
      syncCustomCategory(user.id, categoryName);
    }
  };

  const handleAssignMember = (itemId: string, memberId: string) => {
    saveGroupAssignment(itemId, memberId);
    setAssignments(getGroupAssignments());
    if (user) {
      const item = generatedItems.find(i => i.id === itemId);
      if (item) {
        syncChecklistItem(user.id, { ...item, assignedToMemberId: memberId });
      }
    }
  };

  const handleUpdateWeight = (itemId: string, weightGrams: number) => {
    saveLinkedWeight(itemId, weightGrams);
    setWeights(getLinkedWeights());
    if (user) {
      const item = generatedItems.find(i => i.id === itemId);
      if (item) {
        syncChecklistItem(user.id, { ...item, linkedGearWeightGrams: weightGrams });
      }
    }
  };

  const handleToggleWorn = (itemId: string, isWorn: boolean) => {
    if (itemId.startsWith('custom-item-')) {
      updateCustomItem(itemId, { isWorn });
      const updatedCustom = customItems.map(item =>
        item.id === itemId ? { ...item, isWorn } : item
      );
      setCustomItems(updatedCustom);
      
      if (user) {
        const item = updatedCustom.find(i => i.id === itemId);
        if (item) {
          syncChecklistItem(user.id, item);
        }
      }
    } else {
      const updated = { ...wornStates, [itemId]: isWorn };
      setWornStates(updated);
      localStorage.setItem(WORN_STATES_KEY, JSON.stringify(updated));
      
      if (user) {
        const item = generatedItems.find(i => i.id === itemId);
        if (item) {
          syncChecklistItem(user.id, { ...item, isWorn });
        }
      }
    }
  };

  const handleToggleConsumable = (itemId: string, isConsumable: boolean) => {
    if (itemId.startsWith('custom-item-')) {
      updateCustomItem(itemId, { isConsumable });
      const updatedCustom = customItems.map(item =>
        item.id === itemId ? { ...item, isConsumable } : item
      );
      setCustomItems(updatedCustom);
      
      if (user) {
        const item = updatedCustom.find(i => i.id === itemId);
        if (item) {
          syncChecklistItem(user.id, item);
        }
      }
    } else {
      const updated = { ...consumableStates, [itemId]: isConsumable };
      setConsumableStates(updated);
      localStorage.setItem(CONSUMABLE_STATES_KEY, JSON.stringify(updated));
      
      if (user) {
        const item = generatedItems.find(i => i.id === itemId);
        if (item) {
          syncChecklistItem(user.id, { ...item, isConsumable });
        }
      }
    }
  };

  // Generate checklist with current state
  const baseGeneratedChecklist = generateChecklist(
    profile,
    customItems,
    DEFAULT_RULES,
    packedStates,
    assignments,
    weights
  );

  // Apply local quantity, worn, and consumable overrides
  const generatedItems = baseGeneratedChecklist.map((item) => {
    const isCustom = item.id.startsWith('custom-item-');
    return {
      ...item,
      quantity: quantityOverrides[item.id] !== undefined ? quantityOverrides[item.id] : item.quantity,
      isWorn: isCustom ? item.isWorn : (wornStates[item.id] || false),
      isConsumable: isCustom ? item.isConsumable : (consumableStates[item.id] || false),
    };
  });

  const tripTotals = calculateTripNutrients(plans, foods);

  // Calculate detailed gear weights, integrating Meal Planner total food weight
  const gearWeightTotals = calculateGearWeights(generatedItems, tripTotals.weightGrams);

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
            <span className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`}></span>
            {user ? 'Cloud Sync Active' : 'Offline / Guest Mode'}
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
          <button
            onClick={() => setActiveTab('account')}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ml-auto ${
              activeTab === 'account'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {user ? `Account (${user.email})` : 'Sign In'}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Sidebar with Profile Form and Weight Dashboard */}
            <div className="lg:col-span-1 space-y-8">
              <TripProfileForm profile={profile} onChange={handleProfileChange} />
              <WeightDashboard totals={gearWeightTotals} />
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
                onToggleWorn={handleToggleWorn}
                onToggleConsumable={handleToggleConsumable}
                groupSize={profile.groupSize}
              />
            </div>
          </div>
        )}

        {/* Tab Content: Account */}
        {activeTab === 'account' && (
          <div className="max-w-md mx-auto py-8">
            <AuthForms />
          </div>
        )}
      </div>
    </div>
  );
}

export function App() {
  return (
    <Sentry.ErrorBoundary fallback={<p className="text-red-400 p-4">Something went wrong. Sentry has been notified.</p>} showDialog>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Sentry.ErrorBoundary>
  );
}

export default App;
