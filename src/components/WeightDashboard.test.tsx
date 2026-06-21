import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { WeightDashboard } from './WeightDashboard';
import type { GearWeightTotals } from '../utils/weightCalculator';

describe('WeightDashboard', () => {
  afterEach(() => {
    cleanup();
  });

  const mockTotals: GearWeightTotals = {
    baseWeightGrams: 2500,
    consumableWeightGrams: 1500,
    wornWeightGrams: 800,
    skinOutWeightGrams: 4800,
    categoryWeights: {
      shelter: 2000,
      clothing: 800,
      kitchen: 500,
      food: 1500,
    },
  };

  it('should render all 4 key weight metrics correctly in kg', () => {
    render(<WeightDashboard totals={mockTotals} />);

    // Base Weight: 2.50 kg
    expect(screen.getByText(/2\.50\s*kg/i)).toBeDefined();
    expect(screen.getByText(/Base Weight/i)).toBeDefined();

    // Consumable Weight: 1.50 kg
    expect(screen.getByText(/1\.50\s*kg/i)).toBeDefined();
    expect(screen.getByText(/Consumable/i)).toBeDefined();

    // Worn Weight: 0.80 kg
    expect(screen.getByText(/0\.80\s*kg/i)).toBeDefined();
    expect(screen.getByText(/Worn/i)).toBeDefined();

    // Skin-Out Weight: 4.80 kg
    expect(screen.getByText(/4\.80\s*kg/i)).toBeDefined();
    expect(screen.getByText(/Skin-Out/i)).toBeDefined();
  });

  it('should render category breakdown labels and weights correctly', () => {
    render(<WeightDashboard totals={mockTotals} />);

    // Verify category labels and weights
    expect(screen.getByText(/shelter/i)).toBeDefined();
    expect(screen.getByText(/^2000\s*g/i)).toBeDefined();

    expect(screen.getByText(/clothing/i)).toBeDefined();
    expect(screen.getByText(/^800\s*g/i)).toBeDefined();

    expect(screen.getByText(/kitchen/i)).toBeDefined();
    expect(screen.getByText(/^500\s*g/i)).toBeDefined();

    expect(screen.getByText(/food/i)).toBeDefined();
    expect(screen.getByText(/^1500\s*g/i)).toBeDefined();
  });
});
