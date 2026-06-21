import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { CustomFoodForm } from './CustomFoodForm';

describe('CustomFoodForm', () => {
  afterEach(() => {
    cleanup();
  });
  it('should render all input fields', () => {
    render(<CustomFoodForm onFoodAdded={vi.fn()} />);

    expect(screen.getByLabelText(/Food Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Calories/i)).toBeDefined();
    expect(screen.getByLabelText(/Protein/i)).toBeDefined();
    expect(screen.getByLabelText(/Fat/i)).toBeDefined();
    expect(screen.getByLabelText(/Carbohydrates/i)).toBeDefined();
    expect(screen.getByLabelText(/Sodium/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Add Food/i })).toBeDefined();
  });

  it('should show validation messages for negative values', () => {
    render(<CustomFoodForm onFoodAdded={vi.fn()} />);

    const nameInput = screen.getByLabelText(/Food Name/i);
    fireEvent.change(nameInput, { target: { value: 'Valid Name' } });

    const caloriesInput = screen.getByLabelText(/Calories/i);
    fireEvent.change(caloriesInput, { target: { value: '-10' } });

    const submitButton = screen.getByRole('button', { name: /Add Food/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Values cannot be negative/i)).toBeDefined();
  });

  it('should call onFoodAdded with correct data and clear the form on valid submission', () => {
    const handleFoodAdded = vi.fn();
    render(<CustomFoodForm onFoodAdded={handleFoodAdded} />);

    fireEvent.change(screen.getByLabelText(/Food Name/i), { target: { value: 'Trail Jerky' } });
    fireEvent.change(screen.getByLabelText(/Calories/i), { target: { value: '350' } });
    fireEvent.change(screen.getByLabelText(/Protein/i), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText(/Fat/i), { target: { value: '15' } });
    fireEvent.change(screen.getByLabelText(/Carbohydrates/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Sodium/i), { target: { value: '1500' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Food/i }));

    expect(handleFoodAdded).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Trail Jerky',
        caloriesPer100g: 350,
        proteinPer100g: 25,
        fatPer100g: 15,
        carbsPer100g: 10,
        sodiumPer100g: 1500,
      })
    );

    // Form inputs should be cleared (except name, or all)
    expect((screen.getByLabelText(/Food Name/i) as HTMLInputElement).value).toBe('');
  });
});
