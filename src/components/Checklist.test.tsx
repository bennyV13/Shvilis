import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Checklist } from './Checklist';
import type { ChecklistItem } from '../types/checklist';

describe('Checklist', () => {
  afterEach(() => {
    cleanup();
  });

  const mockItems: ChecklistItem[] = [
    { id: '1', name: 'Map & Compass', category: 'navigation', quantity: 1, isRequiredByRules: true, isPacked: false },
    { id: '2', name: 'Rain Jacket', category: 'clothing', quantity: 1, isRequiredByRules: true, isPacked: true },
    { id: '3', name: 'Custom Camera', category: 'photography', quantity: 1, isRequiredByRules: false, isPacked: false },
  ];

  const mockCategories = ['photography'];

  it('should render items grouped by category', () => {
    render(
      <Checklist
        items={mockItems}
        customCategories={mockCategories}
        onTogglePacked={vi.fn()}
        onUpdateQuantity={vi.fn()}
        onAddCustomItem={vi.fn()}
        onAddCustomCategory={vi.fn()}
        groupSize={1}
      />
    );

    // Verify category headers are rendered
    expect(screen.getByText(/navigation/i)).toBeDefined();
    expect(screen.getByText(/clothing/i)).toBeDefined();
    expect(screen.getByText(/photography/i)).toBeDefined();

    // Verify items are rendered
    expect(screen.getByText('Map & Compass')).toBeDefined();
    expect(screen.getByText('Rain Jacket')).toBeDefined();
    expect(screen.getByText('Custom Camera')).toBeDefined();

    // Verify packed state input checked/unchecked
    const jacketCheckbox = screen.getByLabelText('Rain Jacket') as HTMLInputElement;
    const mapCheckbox = screen.getByLabelText('Map & Compass') as HTMLInputElement;
    expect(jacketCheckbox.checked).toBe(true);
    expect(mapCheckbox.checked).toBe(false);
  });

  it('should call onTogglePacked when clicking an item checkbox', () => {
    const handleTogglePacked = vi.fn();
    render(
      <Checklist
        items={mockItems}
        customCategories={mockCategories}
        onTogglePacked={handleTogglePacked}
        onUpdateQuantity={vi.fn()}
        onAddCustomItem={vi.fn()}
        onAddCustomCategory={vi.fn()}
        groupSize={1}
      />
    );

    const mapCheckbox = screen.getByLabelText('Map & Compass');
    fireEvent.click(mapCheckbox);

    expect(handleTogglePacked).toHaveBeenCalledWith('1', true);
  });

  it('should call onUpdateQuantity when quantity controls are clicked', () => {
    const handleUpdateQuantity = vi.fn();
    render(
      <Checklist
        items={mockItems}
        customCategories={mockCategories}
        onTogglePacked={vi.fn()}
        onUpdateQuantity={handleUpdateQuantity}
        onAddCustomItem={vi.fn()}
        onAddCustomCategory={vi.fn()}
        groupSize={1}
      />
    );

    // Find the increment button for Map & Compass. We can design it to have aria-label/title or class/text.
    // Let's find button with label/title or plus sign.
    const mapContainer = screen.getByText('Map & Compass').closest('div')?.parentElement;
    const plusButton = mapContainer?.querySelector('button[aria-label="Increase quantity"]');
    if (!plusButton) throw new Error('Plus button not found');
    fireEvent.click(plusButton);

    expect(handleUpdateQuantity).toHaveBeenCalledWith('1', 2);
  });

  it('should call onAddCustomItem when submitting the custom item form', () => {
    const handleAddCustomItem = vi.fn();
    render(
      <Checklist
        items={mockItems}
        customCategories={mockCategories}
        onTogglePacked={vi.fn()}
        onUpdateQuantity={vi.fn()}
        onAddCustomItem={handleAddCustomItem}
        onAddCustomCategory={vi.fn()}
        groupSize={1}
      />
    );

    // Expand the "navigation" inline form if any, or find the form.
    // Let's type in the navigation category's "Add Custom Item" input.
    // We can label inputs as "New item name" or similar.
    const inputs = screen.getAllByPlaceholderText(/item name/i);
    // Let's say navigation is the first category in default order: clothing, navigation, photography
    // Let's select the first placeholder input, fill it, and click add.
    const nameInput = inputs[0];
    fireEvent.change(nameInput, { target: { value: 'GPS Unit' } });

    const addButtons = screen.getAllByRole('button', { name: /add item/i });
    fireEvent.click(addButtons[0]);

    // It should call handleAddCustomItem with name, category, and quantity (default 1)
    expect(handleAddCustomItem).toHaveBeenCalledWith('GPS Unit', expect.any(String), 1);
  });

  it('should call onAddCustomCategory when submitting the custom category form', () => {
    const handleAddCustomCategory = vi.fn();
    render(
      <Checklist
        items={mockItems}
        customCategories={mockCategories}
        onTogglePacked={vi.fn()}
        onUpdateQuantity={vi.fn()}
        onAddCustomItem={vi.fn()}
        onAddCustomCategory={handleAddCustomCategory}
        groupSize={1}
      />
    );

    const categoryInput = screen.getByPlaceholderText(/category name/i);
    fireEvent.change(categoryInput, { target: { value: 'Electronics' } });

    const addCategoryButton = screen.getByRole('button', { name: /add category/i });
    fireEvent.click(addCategoryButton);

    expect(handleAddCustomCategory).toHaveBeenCalledWith('Electronics');
  });
});
