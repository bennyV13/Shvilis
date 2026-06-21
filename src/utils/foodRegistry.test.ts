import { describe, it, expect, beforeEach } from 'vitest';
import {
  getDefaultFoods,
  getCustomFoods,
  getAllFoods,
  addCustomFood,
  deleteCustomFood
} from './foodRegistry';

describe('foodRegistry', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return a non-empty list of default trail foods', () => {
    const defaults = getDefaultFoods();
    expect(defaults.length).toBeGreaterThan(0);
    expect(defaults[0]).toHaveProperty('caloriesPer100g');
    expect(defaults[0].isCustom).toBeFalsy();
  });

  it('should start with an empty custom foods list', () => {
    expect(getCustomFoods()).toEqual([]);
  });

  it('should add a custom food and store it in localStorage', () => {
    const newFood = {
      name: 'Custom Energy Bar',
      caloriesPer100g: 450,
      proteinPer100g: 15,
      fatPer100g: 20,
      carbsPer100g: 50,
      sodiumPer100g: 200,
    };

    const added = addCustomFood(newFood);
    expect(added.id).toBeDefined();
    expect(added.name).toBe('Custom Energy Bar');
    expect(added.isCustom).toBe(true);

    const customList = getCustomFoods();
    expect(customList).toHaveLength(1);
    expect(customList[0].name).toBe('Custom Energy Bar');
  });

  it('should return custom foods combined with default foods in getAllFoods', () => {
    const initialAll = getAllFoods();
    const defaults = getDefaultFoods();
    expect(initialAll).toHaveLength(defaults.length);

    addCustomFood({
      name: 'Trail Mix Premium',
      caloriesPer100g: 520,
      proteinPer100g: 12,
      fatPer100g: 35,
      carbsPer100g: 40,
      sodiumPer100g: 150,
    });

    const finalAll = getAllFoods();
    expect(finalAll).toHaveLength(defaults.length + 1);
    expect(finalAll.find(f => f.name === 'Trail Mix Premium')).toBeDefined();
  });

  it('should delete a custom food from localStorage', () => {
    const added = addCustomFood({
      name: 'Dehydrated Chili',
      caloriesPer100g: 380,
      proteinPer100g: 22,
      fatPer100g: 8,
      carbsPer100g: 55,
      sodiumPer100g: 800,
    });

    expect(getCustomFoods()).toHaveLength(1);

    deleteCustomFood(added.id);
    expect(getCustomFoods()).toHaveLength(0);
  });
});
