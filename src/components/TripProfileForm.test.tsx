import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { TripProfileForm } from './TripProfileForm';
import type { TripProfile } from '../types/checklist';

describe('TripProfileForm', () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProfile: TripProfile = {
    weather: ['sunny'],
    durationDays: 2,
    terrain: 'trail',
    groupSize: 1,
  };

  it('should render form fields with initial values', () => {
    render(<TripProfileForm profile={defaultProfile} onChange={vi.fn()} />);

    // Check weather checkboxes
    const sunnyCheckbox = screen.getByLabelText(/sunny/i) as HTMLInputElement;
    const rainyCheckbox = screen.getByLabelText(/rainy/i) as HTMLInputElement;
    expect(sunnyCheckbox.checked).toBe(true);
    expect(rainyCheckbox.checked).toBe(false);

    // Check duration field
    const durationInput = screen.getByLabelText(/duration/i) as HTMLInputElement;
    expect(durationInput.value).toBe('2');

    // Check terrain select
    const terrainSelect = screen.getByLabelText(/terrain/i) as HTMLInputElement;
    expect(terrainSelect.value).toBe('trail');

    // Check group size field
    const groupSizeInput = screen.getByLabelText(/group size/i) as HTMLInputElement;
    expect(groupSizeInput.value).toBe('1');
  });

  it('should trigger onChange when duration changes', () => {
    const handleChange = vi.fn();
    render(<TripProfileForm profile={defaultProfile} onChange={handleChange} />);

    const durationInput = screen.getByLabelText(/duration/i);
    fireEvent.change(durationInput, { target: { value: '5' } });

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultProfile,
      durationDays: 5,
    });
  });

  it('should trigger onChange when group size changes', () => {
    const handleChange = vi.fn();
    render(<TripProfileForm profile={defaultProfile} onChange={handleChange} />);

    const groupSizeInput = screen.getByLabelText(/group size/i);
    fireEvent.change(groupSizeInput, { target: { value: '3' } });

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultProfile,
      groupSize: 3,
    });
  });

  it('should trigger onChange when terrain changes', () => {
    const handleChange = vi.fn();
    render(<TripProfileForm profile={defaultProfile} onChange={handleChange} />);

    const terrainSelect = screen.getByLabelText(/terrain/i);
    fireEvent.change(terrainSelect, { target: { value: 'alpine' } });

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultProfile,
      terrain: 'alpine',
    });
  });

  it('should trigger onChange when weather selection changes', () => {
    const handleChange = vi.fn();
    render(<TripProfileForm profile={defaultProfile} onChange={handleChange} />);

    // Check cold checkbox (currently unchecked)
    const coldCheckbox = screen.getByLabelText(/cold/i);
    fireEvent.click(coldCheckbox);

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultProfile,
      weather: ['sunny', 'cold'],
    });

    // Uncheck sunny checkbox (currently checked)
    const sunnyCheckbox = screen.getByLabelText(/sunny/i);
    fireEvent.click(sunnyCheckbox);

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultProfile,
      weather: [],
    });
  });

  it('should not allow negative or zero duration', () => {
    const handleChange = vi.fn();
    render(<TripProfileForm profile={defaultProfile} onChange={handleChange} />);

    const durationInput = screen.getByLabelText(/duration/i);
    fireEvent.change(durationInput, { target: { value: '0' } });
    expect(handleChange).not.toHaveBeenCalled();

    fireEvent.change(durationInput, { target: { value: '-1' } });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should not allow negative or zero group size', () => {
    const handleChange = vi.fn();
    render(<TripProfileForm profile={defaultProfile} onChange={handleChange} />);

    const groupSizeInput = screen.getByLabelText(/group size/i);
    fireEvent.change(groupSizeInput, { target: { value: '0' } });
    expect(handleChange).not.toHaveBeenCalled();

    fireEvent.change(groupSizeInput, { target: { value: '-2' } });
    expect(handleChange).not.toHaveBeenCalled();
  });
});
