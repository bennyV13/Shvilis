import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { StatsDashboard } from './StatsDashboard';
import type { NutritionTotals } from '../types/meal';

describe('StatsDashboard', () => {
  const mockProfile: any = { weather: [], durationDays: 1, terrain: 'trail', groupSize: 1 };
  const mockOnChange = () => {};

  afterEach(() => {
    cleanup();
  });

  it('should render food weight and total calories correctly', () => {
    const totals: NutritionTotals = {
      calories: 2500,
      protein: 80,
      fat: 90,
      carbs: 300,
      sodium: 1500,
      weightGrams: 1200,
    };

    render(<StatsDashboard totals={totals} profile={mockProfile} onChange={mockOnChange} />);

    expect(screen.getByText(/1.20\s*kg/)).toBeDefined();
    expect(screen.getByText(/2500\s*kcal/)).toBeDefined();
    expect(screen.getByText(/1500\s*mg/)).toBeDefined();
  });

  it('should show high efficiency indicator for density >= 4 kcal/g', () => {
    const totals: NutritionTotals = {
      calories: 500,
      protein: 10,
      fat: 40,
      carbs: 20,
      sodium: 100,
      weightGrams: 100, // 5 kcal/g
    };

    render(<StatsDashboard totals={totals} profile={mockProfile} onChange={mockOnChange} />);

    expect(screen.getByText(/5.00/)).toBeDefined();
    expect(screen.getByText(/High Weight Efficiency/i)).toBeDefined();
  });

  it('should show low efficiency warning for density < 2.0 kcal/g', () => {
    const totals: NutritionTotals = {
      calories: 120,
      protein: 5,
      fat: 1,
      carbs: 20,
      sodium: 50,
      weightGrams: 100, // 1.2 kcal/g
    };

    render(<StatsDashboard totals={totals} profile={mockProfile} onChange={mockOnChange} />);

    expect(screen.getByText(/1.20/)).toBeDefined();
    expect(screen.getByText(/Low Weight Efficiency/i)).toBeDefined();
  });
});
