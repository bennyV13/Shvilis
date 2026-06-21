import { supabase } from '../lib/supabase';
import type { TripProfile, ChecklistItem } from '../types/checklist';
import type { FoodItem } from '../types/food';
import type { DailyMealPlan } from '../types/meal';

export interface UserDataPayload {
  profile: TripProfile | null;
  customCategories: string[];
  checklistItems: ChecklistItem[];
  customFoods: FoodItem[];
  mealPlans: DailyMealPlan[];
}

export async function fetchUserData(userId: string): Promise<UserDataPayload> {
  // 1. Fetch Trip Profile
  const { data: tripData } = await supabase
    .from('trip_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  let profile: TripProfile | null = null;
  if (tripData) {
    profile = {
      weather: tripData.weather as ('sunny' | 'rainy' | 'cold' | 'hot')[],
      durationDays: tripData.duration_days,
      terrain: tripData.terrain as 'trail' | 'alpine' | 'desert' | 'forest',
      groupSize: tripData.group_size,
    };
  }

  // 2. Fetch Custom Categories
  const { data: catData } = await supabase
    .from('custom_categories')
    .select('name')
    .eq('user_id', userId);

  const customCategories = catData ? catData.map(c => c.name) : [];

  // 3. Fetch Checklist Items
  const { data: itemData } = await supabase
    .from('checklist_items')
    .select('*')
    .eq('user_id', userId);

  const checklistItems: ChecklistItem[] = itemData
    ? itemData.map(item => ({
        id: item.frontend_id || item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        isRequiredByRules: item.is_required_by_rules,
        isPacked: item.is_packed,
        isWorn: item.is_worn,
        isConsumable: item.is_consumable,
        assignedToMemberId: item.assigned_to_member_id || undefined,
        linkedGearWeightGrams: item.linked_gear_weight_grams || undefined,
      }))
    : [];

  // 4. Fetch Custom Foods
  const { data: foodData } = await supabase
    .from('custom_foods')
    .select('*')
    .eq('user_id', userId);

  const customFoods: FoodItem[] = foodData
    ? foodData.map(food => ({
        id: food.id,
        name: food.name,
        caloriesPer100g: food.calories_per_100g,
        proteinPer100g: Number(food.protein_per_100g),
        fatPer100g: Number(food.fat_per_100g),
        carbsPer100g: Number(food.carbs_per_100g),
        sodiumPer100g: Number(food.sodium_per_100g),
        isCustom: true,
      }))
    : [];

  // 5. Fetch Meal Plans
  const { data: mealData } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('user_id', userId);

  const mealPlansMap: Record<number, DailyMealPlan> = {};
  if (mealData) {
    mealData.forEach(row => {
      const dayIdx = row.day_index;
      if (!mealPlansMap[dayIdx]) {
        mealPlansMap[dayIdx] = {
          dayIndex: dayIdx,
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: [],
        };
      }
      const category = row.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snacks';
      mealPlansMap[dayIdx][category].push({
        id: row.id,
        foodId: row.food_id,
        portionGrams: row.portion_grams,
      });
    });
  }
  const mealPlans = Object.values(mealPlansMap);

  return {
    profile,
    customCategories,
    checklistItems,
    customFoods,
    mealPlans,
  };
}

export async function syncTripProfile(userId: string, profile: TripProfile): Promise<void> {
  const { data } = await supabase
    .from('trip_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  const payload = {
    user_id: userId,
    weather: profile.weather,
    duration_days: profile.durationDays,
    terrain: profile.terrain,
    group_size: profile.groupSize,
  };

  if (data?.id) {
    await supabase
      .from('trip_profiles')
      .update(payload)
      .eq('id', data.id);
  } else {
    await supabase
      .from('trip_profiles')
      .insert(payload);
  }
}

export async function syncCustomCategory(userId: string, name: string): Promise<void> {
  await supabase
    .from('custom_categories')
    .upsert(
      { user_id: userId, name },
      { onConflict: 'user_id,name' }
    );
}

export async function syncChecklistItem(userId: string, item: ChecklistItem): Promise<void> {
  const { data } = await supabase
    .from('checklist_items')
    .select('id')
    .eq('user_id', userId)
    .eq('frontend_id', item.id)
    .maybeSingle();

  const payload = {
    user_id: userId,
    frontend_id: item.id,
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    is_required_by_rules: item.isRequiredByRules,
    is_packed: item.isPacked,
    is_worn: item.isWorn || false,
    is_consumable: item.isConsumable || false,
    assigned_to_member_id: item.assignedToMemberId || null,
    linked_gear_weight_grams: item.linkedGearWeightGrams || null,
  };

  if (data?.id) {
    await supabase
      .from('checklist_items')
      .update(payload)
      .eq('id', data.id);
  } else {
    await supabase
      .from('checklist_items')
      .insert(payload);
  }
}

export async function syncCustomFood(userId: string, food: FoodItem): Promise<void> {
  await supabase
    .from('custom_foods')
    .upsert({
      id: food.id,
      user_id: userId,
      name: food.name,
      calories_per_100g: food.caloriesPer100g,
      protein_per_100g: food.proteinPer100g,
      fat_per_100g: food.fatPer100g,
      carbs_per_100g: food.carbsPer100g,
      sodium_per_100g: food.sodiumPer100g,
    }, { onConflict: 'id' });
}

export async function deleteCustomFoodFromDb(userId: string, foodId: string): Promise<void> {
  await supabase
    .from('custom_foods')
    .delete()
    .eq('user_id', userId)
    .eq('id', foodId);
}

export async function syncMealPlans(userId: string, plans: DailyMealPlan[]): Promise<void> {
  // Delete all existing meal plans for the user
  await supabase
    .from('meal_plans')
    .delete()
    .eq('user_id', userId);

  // Insert all new meal plans
  const rows: {
    user_id: string;
    day_index: number;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
    food_id: string;
    portion_grams: number;
  }[] = [];
  plans.forEach(plan => {
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;
    mealTypes.forEach(type => {
      plan[type].forEach(item => {
        rows.push({
          user_id: userId,
          day_index: plan.dayIndex,
          meal_type: type,
          food_id: item.foodId,
          portion_grams: item.portionGrams,
        });
      });
    });
  });

  if (rows.length > 0) {
    await supabase
      .from('meal_plans')
      .insert(rows);
  }
}
