import React, { useState } from 'react';
import type { FoodItem } from '../types/food';
import type { DailyMealPlan, PlannedMealItem } from '../types/meal';

interface MealPlannerProps {
  foods: FoodItem[];
  plans: DailyMealPlan[];
  onPlansChange: (plans: DailyMealPlan[]) => void;
}

type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export const MealPlanner: React.FC<MealPlannerProps> = ({ foods, plans, onPlansChange }) => {
  // Track which day and category is currently showing the "Add Item" inline form
  const [addingTo, setAddingTo] = useState<{ dayIndex: number; category: MealCategory } | null>(null);
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [portionGrams, setPortionGrams] = useState('');
  const [activeDay, setActiveDay] = useState<number>(0);

  const handleAddItemClick = (dayIndex: number, category: MealCategory) => {
    setAddingTo({ dayIndex, category });
    setSelectedFoodId(foods[0]?.id || '');
    setPortionGrams('');
  };

  const handleConfirmAdd = (dayIndex: number, category: MealCategory) => {
    const weight = parseFloat(portionGrams) || 0;
    if (weight <= 0 || !selectedFoodId) return;

    const newItem: PlannedMealItem = {
      id: 'meal-item-' + Math.random().toString(36).slice(2, 9),
      foodId: selectedFoodId,
      portionGrams: weight,
    };

    const updatedPlans = plans.map((plan) => {
      if (plan.dayIndex === dayIndex) {
        return {
          ...plan,
          [category]: [...plan[category], newItem],
        };
      }
      return plan;
    });

    onPlansChange(updatedPlans);
    setAddingTo(null);
  };

  const handlePortionChange = (dayIndex: number, category: MealCategory, itemId: string, value: string) => {
    const weight = parseFloat(value) || 0;
    if (weight < 0) return; // Prevent negative weights

    const updatedPlans = plans.map((plan) => {
      if (plan.dayIndex === dayIndex) {
        return {
          ...plan,
          [category]: plan[category].map((item) =>
            item.id === itemId ? { ...item, portionGrams: weight } : item
          ),
        };
      }
      return plan;
    });

    onPlansChange(updatedPlans);
  };

  const handleDeleteItem = (dayIndex: number, category: MealCategory, itemId: string) => {
    const updatedPlans = plans.map((plan) => {
      if (plan.dayIndex === dayIndex) {
        return {
          ...plan,
          [category]: plan[category].filter((item) => item.id !== itemId),
        };
      }
      return plan;
    });

    onPlansChange(updatedPlans);
  };

  const handleAddDay = () => {
    const nextDayIndex = plans.length;
    const newDay: DailyMealPlan = {
      dayIndex: nextDayIndex,
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };
    onPlansChange([...plans, newDay]);
    setActiveDay(nextDayIndex);
  };

  const handleRemoveDay = () => {
    if (plans.length <= 1) return;
    onPlansChange(plans.slice(0, -1));
    setActiveDay(Math.min(activeDay, plans.length - 2));
  };

  const categories: { key: MealCategory; label: string }[] = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Dinner' },
    { key: 'snacks', label: 'Snacks' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-semibold text-emerald-400 font-heading">Trip Meal Scheduler</h3>
          <p className="text-sm text-slate-400">Plan daily meal breakdowns and portions</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRemoveDay}
            disabled={plans.length <= 1}
            className="px-3 py-1.5 text-xs font-medium border border-red-800 text-red-400 rounded-lg hover:bg-red-950/30 disabled:opacity-40 transition-colors"
          >
            Remove Last Day
          </button>
          <button
            onClick={handleAddDay}
            className="px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            + Add Day
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-thin scrollbar-thumb-slate-800">
        {plans.map((plan) => (
          <button
            key={plan.dayIndex}
            onClick={() => setActiveDay(plan.dayIndex)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
              activeDay === plan.dayIndex
                ? 'bg-emerald-600/15 border border-emerald-500/50 text-emerald-400'
                : 'bg-slate-800/40 border border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Day {plan.dayIndex + 1}
          </button>
        ))}
      </div>

      {plans.map((plan) => {
        if (plan.dayIndex !== activeDay) return null;

        return (
          <div key={plan.dayIndex} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map(({ key, label }) => {
              const items = plan[key];
              const isAdding = addingTo?.dayIndex === plan.dayIndex && addingTo?.category === key;

              return (
                <div key={key} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 flex flex-col min-h-[220px]">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-200 text-base">{label}</h4>
                    <button
                      onClick={() => handleAddItemClick(plan.dayIndex, key)}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      + Add Item
                    </button>
                  </div>

                  {/* List of items */}
                  <div className="flex-1 space-y-3 mb-4">
                    {items.length === 0 && !isAdding ? (
                      <p className="text-xs text-slate-500 italic mt-4 text-center">No foods planned yet.</p>
                    ) : (
                      items.map((item) => {
                        const food = foods.find((f) => f.id === item.foodId);
                        if (!food) return null;

                        const itemCals = Math.round((food.caloriesPer100g * item.portionGrams) / 100);

                        return (
                          <div
                            key={item.id}
                            className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-100 truncate">{food.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{itemCals} kcal</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={item.portionGrams === 0 ? '' : item.portionGrams}
                                  onChange={(e) =>
                                    handlePortionChange(plan.dayIndex, key, item.id, e.target.value)
                                  }
                                  className="w-16 bg-slate-800 border border-slate-700 rounded-md px-1.5 py-1 text-slate-100 text-center focus:outline-none focus:border-emerald-500"
                                />
                                <span className="text-slate-400">g</span>
                              </div>

                              <button
                                onClick={() => handleDeleteItem(plan.dayIndex, key, item.id)}
                                className="text-red-500 hover:text-red-400 font-medium px-2 py-1 rounded transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Inline Form */}
                  {isAdding && (
                    <div className="bg-slate-900 border border-emerald-500/30 rounded-lg p-3.5 space-y-3 mt-auto">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Select Food
                        </label>
                        <select
                          value={selectedFoodId}
                          onChange={(e) => setSelectedFoodId(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                        >
                          {foods.map((food) => (
                            <option key={food.id} value={food.id}>
                              {food.name} ({food.caloriesPer100g} kcal/100g)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Portion Weight
                          </label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={portionGrams}
                              onChange={(e) => setPortionGrams(e.target.value)}
                              placeholder="Grams"
                              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                            />
                            <span className="text-xs text-slate-400">g</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setAddingTo(null)}
                          className="px-2.5 py-1 text-[11px] font-medium border border-slate-700 text-slate-400 hover:text-slate-200 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleConfirmAdd(plan.dayIndex, key)}
                          className="px-2.5 py-1 text-[11px] font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
                        >
                          Add to Meal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
