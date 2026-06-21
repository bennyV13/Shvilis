import { FoodItem } from '../types/food';

export const DEFAULT_FOODS: FoodItem[] = [
  {
    id: 'oatmeal',
    name: 'Oatmeal',
    caloriesPer100g: 389,
    proteinPer100g: 16.9,
    fatPer100g: 6.9,
    carbsPer100g: 66.3,
    sodiumPer100g: 2,
    isCustom: false,
  },
  {
    id: 'peanut-butter',
    name: 'Peanut Butter',
    caloriesPer100g: 588,
    proteinPer100g: 25,
    fatPer100g: 50,
    carbsPer100g: 20,
    sodiumPer100g: 350,
    isCustom: false,
  },
  {
    id: 'mixed-nuts',
    name: 'Mixed Nuts',
    caloriesPer100g: 607,
    proteinPer100g: 20,
    fatPer100g: 54,
    carbsPer100g: 21,
    sodiumPer100g: 270,
    isCustom: false,
  },
  {
    id: 'dried-banana',
    name: 'Dried Banana',
    caloriesPer100g: 346,
    proteinPer100g: 3.9,
    fatPer100g: 1.8,
    carbsPer100g: 88,
    sodiumPer100g: 2,
    isCustom: false,
  },
  {
    id: 'beef-jerky',
    name: 'Beef Jerky',
    caloriesPer100g: 410,
    proteinPer100g: 33,
    fatPer100g: 25,
    carbsPer100g: 11,
    sodiumPer100g: 2000,
    isCustom: false,
  },
  {
    id: 'dehydrated-pasta',
    name: 'Dehydrated Pasta Meal',
    caloriesPer100g: 370,
    proteinPer100g: 12,
    fatPer100g: 1.5,
    carbsPer100g: 75,
    sodiumPer100g: 850,
    isCustom: false,
  },
];

const LOCAL_STORAGE_KEY = 'shvilis_custom_foods';

export function getDefaultFoods(): FoodItem[] {
  return DEFAULT_FOODS;
}

export function getCustomFoods(): FoodItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    // ponytail: ignore storage errors in private mode/safari
    return [];
  }
}

export function getAllFoods(): FoodItem[] {
  return [...getDefaultFoods(), ...getCustomFoods()];
}

export function addCustomFood(food: Omit<FoodItem, 'id' | 'isCustom'>): FoodItem {
  // ponytail: Math.random base36 slug, unique enough for local lists
  const newFood: FoodItem = {
    ...food,
    id: 'custom-' + Math.random().toString(36).slice(2, 9),
    isCustom: true,
  };
  const list = getCustomFoods();
  list.push(newFood);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  return newFood;
}

export function deleteCustomFood(id: string): void {
  const list = getCustomFoods().filter((item) => item.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
}
