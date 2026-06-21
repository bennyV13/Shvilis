import React, { useState } from 'react';
import type { ChecklistItem } from '../types/checklist';

interface ChecklistProps {
  items: ChecklistItem[];
  customCategories: string[];
  onTogglePacked: (itemId: string, isPacked: boolean) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onAddCustomItem: (name: string, category: string, quantity: number) => void;
  onAddCustomCategory: (categoryName: string) => void;
  onUpdateWeight?: (itemId: string, weightGrams: number) => void;
  onAssignMember?: (itemId: string, memberId: string) => void;
  groupSize: number;
}

export const Checklist: React.FC<ChecklistProps> = ({
  items,
  customCategories,
  onTogglePacked,
  onUpdateQuantity,
  onAddCustomItem,
  onAddCustomCategory,
  onUpdateWeight,
  onAssignMember,
  groupSize,
}) => {
  const [newItemNames, setNewItemNames] = useState<Record<string, string>>({});
  const [newCategoryName, setNewCategoryName] = useState('');

  // Group items by category
  const categoriesWithItems = Array.from(
    new Set([
      ...items.map((item) => item.category),
      ...customCategories,
    ])
  ).filter((cat) => !(groupSize === 1 && cat === 'group'));

  const handleAddItemSubmit = (e: React.FormEvent, category: string) => {
    e.preventDefault();
    const name = newItemNames[category] || '';
    if (name.trim()) {
      onAddCustomItem(name.trim(), category, 1);
      setNewItemNames((prev) => ({ ...prev, [category]: '' }));
    }
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCustomCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  // Calculate total packed weight
  const totalPackedWeightGrams = items
    .filter((item) => item.isPacked && item.linkedGearWeightGrams)
    .reduce((sum, item) => sum + (item.linkedGearWeightGrams || 0) * item.quantity, 0);

  const totalPackedWeightKg = (totalPackedWeightGrams / 1000).toFixed(2);

  return (
    <div className="space-y-8">
      {/* Weight Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Packed Base Weight
          </h4>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
            {totalPackedWeightKg} kg
          </p>
        </div>
        <div className="text-xs text-slate-500 max-w-sm">
          Calculates the total weight of all packed gear. Adjust gear weights individually in the checklist below.
        </div>
      </div>

      {/* Add Custom Category Form */}
      <form
        onSubmit={handleAddCategorySubmit}
        className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="flex-1 w-full">
          <label htmlFor="new-category-input" className="sr-only">
            Category Name
          </label>
          <input
            id="new-category-input"
            type="text"
            placeholder="New category name (e.g. Photography)..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2 rounded-lg text-sm transition duration-150 active:scale-[0.98]"
        >
          Add Category
        </button>
      </form>

      {/* Checklist Categories */}
      <div className="space-y-6">
        {categoriesWithItems.map((category) => {
          const categoryItems = items.filter((item) => item.category === category);

          return (
            <div
              key={category}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-md font-bold text-slate-200 capitalize tracking-wide font-heading">
                  {category}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {categoryItems.filter((i) => i.isPacked).length} / {categoryItems.length} packed
                </span>
              </div>

              {/* Items List */}
              {categoryItems.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No items in this category.</p>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3 transition-all ${
                        item.isPacked ? 'opacity-60' : ''
                      }`}
                    >
                      {/* Name & Checkbox */}
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          id={`packed-${item.id}`}
                          checked={item.isPacked}
                          onChange={(e) => onTogglePacked(item.id, e.target.checked)}
                          className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30 w-4 h-4 cursor-pointer"
                        />
                        <label
                          htmlFor={`packed-${item.id}`}
                          className={`text-sm font-medium text-slate-200 cursor-pointer select-none truncate ${
                            item.isPacked ? 'line-through text-slate-500' : ''
                          }`}
                        >
                          {item.name}
                        </label>
                        {item.isRequiredByRules && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-medium shrink-0">
                            Rec
                          </span>
                        )}
                      </div>

                      {/* Controls (Weight, Member select, Quantity) */}
                      <div className="flex items-center justify-end gap-3 flex-wrap sm:flex-nowrap">
                        {/* Weight optimizer input */}
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            placeholder="g"
                            aria-label={`Weight of ${item.name} in grams`}
                            value={item.linkedGearWeightGrams || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              onUpdateWeight?.(item.id, isNaN(val) ? 0 : val);
                            }}
                            className="w-16 bg-slate-950/60 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 text-right font-mono"
                          />
                          <span className="text-[10px] text-slate-500 font-mono">g</span>
                        </div>

                        {/* Member assignment dropdown */}
                        {groupSize > 1 && (
                          <select
                            value={item.assignedToMemberId || ''}
                            onChange={(e) => onAssignMember?.(item.id, e.target.value)}
                            aria-label={`Assign ${item.name} to member`}
                            className="bg-slate-950/60 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
                          >
                            <option value="">Unassigned</option>
                            <option value="1">Organizer</option>
                            {Array.from({ length: groupSize - 1 }, (_, idx) => {
                              const memberNum = idx + 2;
                              return (
                                <option key={memberNum} value={memberNum.toString()}>
                                  Member {memberNum}
                                </option>
                              );
                            })}
                          </select>
                        )}

                        {/* Quantity controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            aria-label="Decrease quantity"
                            title="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition text-sm"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-slate-300 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            title="Increase quantity"
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Custom Item Inline Form */}
              <form
                onSubmit={(e) => handleAddItemSubmit(e, category)}
                className="pt-2 flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Add item name..."
                  value={newItemNames[category] || ''}
                  onChange={(e) =>
                    setNewItemNames((prev) => ({ ...prev, [category]: e.target.value }))
                  }
                  className="flex-1 bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                />
                <button
                  type="submit"
                  className="bg-slate-850 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  Add Item
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
};
