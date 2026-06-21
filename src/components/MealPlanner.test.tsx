import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MealPlanner } from './MealPlanner';
import type { FoodItem } from '../types/food';
import type { DailyMealPlan } from '../types/meal';

const testFoods: FoodItem[] = [
  {
    id: 'oatmeal',
    name: 'Oatmeal',
    caloriesPer100g: 380,
    proteinPer100g: 10,
    fatPer100g: 5,
    carbsPer100g: 70,
    sodiumPer100g: 2,
    isCustom: false,
  },
  {
    id: 'peanut-butter',
    name: 'Peanut Butter',
    caloriesPer100g: 600,
    proteinPer100g: 20,
    fatPer100g: 50,
    carbsPer100g: 20,
    sodiumPer100g: 300,
    isCustom: false,
  },
];

const initialPlans: DailyMealPlan[] = [
  {
    dayIndex: 0,
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  },
];

describe('MealPlanner', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render categories for Day 1', () => {
    render(
      <MealPlanner
        foods={testFoods}
        plans={initialPlans}
        onPlansChange={vi.fn()}
      />
    );

    expect(screen.getByText(/Day 1/i)).toBeDefined();
    expect(screen.getByText(/Breakfast/i)).toBeDefined();
    expect(screen.getByText(/Lunch/i)).toBeDefined();
    expect(screen.getByText(/Dinner/i)).toBeDefined();
    expect(screen.getByText(/Snacks/i)).toBeDefined();
  });

  it('should call onPlansChange when a new food item is added to a category', () => {
    const handlePlansChange = vi.fn();
    render(
      <MealPlanner
        foods={testFoods}
        plans={initialPlans}
        onPlansChange={handlePlansChange}
      />
    );

    // Click "Add Item" in Breakfast category
    const addButtons = screen.getAllByRole('button', { name: /\+ Add Item/i });
    fireEvent.click(addButtons[0]); // First button is Breakfast

    // Select "Oatmeal" from the dropdown
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'oatmeal' } });

    // Enter portion size
    const portionInput = screen.getByPlaceholderText('Grams');
    fireEvent.change(portionInput, { target: { value: '80' } });

    // Click "Confirm" or "Add" button inside inline form
    const confirmButton = screen.getByRole('button', { name: /Add to Meal/i });
    fireEvent.click(confirmButton);

    expect(handlePlansChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          dayIndex: 0,
          breakfast: expect.arrayContaining([
            expect.objectContaining({
              foodId: 'oatmeal',
              portionGrams: 80,
            }),
          ]),
        }),
      ])
    );
  });

  it('should call onPlansChange when an item portion is updated inline', () => {
    const plansWithItem: DailyMealPlan[] = [
      {
        dayIndex: 0,
        breakfast: [{ id: 'item-1', foodId: 'oatmeal', portionGrams: 50 }],
        lunch: [],
        dinner: [],
        snacks: [],
      },
    ];

    const handlePlansChange = vi.fn();
    render(
      <MealPlanner
        foods={testFoods}
        plans={plansWithItem}
        onPlansChange={handlePlansChange}
      />
    );

    const portionInput = screen.getByDisplayValue('50');
    fireEvent.change(portionInput, { target: { value: '120' } });

    expect(handlePlansChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          dayIndex: 0,
          breakfast: expect.arrayContaining([
            expect.objectContaining({
              id: 'item-1',
              foodId: 'oatmeal',
              portionGrams: 120,
            }),
          ]),
        }),
      ])
    );
  });

  it('should call onPlansChange when an item is deleted', () => {
    const plansWithItem: DailyMealPlan[] = [
      {
        dayIndex: 0,
        breakfast: [{ id: 'item-1', foodId: 'oatmeal', portionGrams: 50 }],
        lunch: [],
        dinner: [],
        snacks: [],
      },
    ];

    const handlePlansChange = vi.fn();
    render(
      <MealPlanner
        foods={testFoods}
        plans={plansWithItem}
        onPlansChange={handlePlansChange}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /^Remove$/ });
    fireEvent.click(deleteButton);

    expect(handlePlansChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          dayIndex: 0,
          breakfast: [],
        }),
      ])
    );
  });
});
