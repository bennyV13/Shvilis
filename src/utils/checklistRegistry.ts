import type { TripProfile, ChecklistItem, ChecklistRule } from '../types/checklist';

export const DEFAULT_RULES: ChecklistRule[] = [
  // Essentials (always)
  { itemName: 'Map & Compass', category: 'navigation', quantity: 1 },
  { itemName: 'First Aid Kit', category: 'safety', quantity: 1 },
  { itemName: 'Headlamp / Flashlight', category: 'essentials', quantity: 1 },
  { itemName: 'Pocket Knife / Multi-tool', category: 'essentials', quantity: 1 },
  { itemName: 'Water Bottle / Reservoir', category: 'essentials', quantity: 2 },
  { itemName: 'Matches / Fire Starter', category: 'essentials', quantity: 1 },
  { itemName: 'Sunscreen & Lip Balm', category: 'essentials', quantity: 1 },

  // Weather rules
  { itemName: 'Rain Jacket / Shell', category: 'clothing', quantity: 1, weatherRequired: ['rainy'] },
  { itemName: 'Pack Cover', category: 'safety', quantity: 1, weatherRequired: ['rainy'] },
  { itemName: 'Thermal Base Layers', category: 'clothing', quantity: 1, weatherRequired: ['cold'] },
  { itemName: 'Warm Gloves & Beanie', category: 'clothing', quantity: 1, weatherRequired: ['cold'] },
  { itemName: 'Sun Hat & Sunglasses', category: 'clothing', quantity: 1, weatherRequired: ['sunny'] },

  // Terrain rules
  { itemName: 'Microspikes / Traction', category: 'safety', quantity: 1, terrainRequired: ['alpine'] },
  { itemName: 'Emergency Bivvy Sack', category: 'safety', quantity: 1, terrainRequired: ['alpine'] },

  // Duration rules
  { itemName: 'Extra Trail Socks', category: 'clothing', quantity: 2, minDurationDays: 3 },
  { itemName: 'Extra Backcountry Food Portions', category: 'essentials', quantity: 1, minDurationDays: 4 },

  // Group rules
  { itemName: 'Shared Group Tent / Tarp', category: 'group', quantity: 1, minGroupSize: 2 },
  { itemName: 'Backpacking Stove & Fuel', category: 'group', quantity: 1, minGroupSize: 2 },
  { itemName: 'Water Filter / Purifier', category: 'group', quantity: 1, minGroupSize: 2 },
];

const TRIP_PROFILE_KEY = 'shvilis_trip_profile';
const CUSTOM_CATEGORIES_KEY = 'shvilis_custom_categories';
const CUSTOM_ITEMS_KEY = 'shvilis_custom_items';
const PACKED_STATES_KEY = 'shvilis_packed_states';
const GROUP_ASSIGNMENTS_KEY = 'shvilis_group_assignments';
const LINKED_WEIGHTS_KEY = 'shvilis_linked_weights';

export function getTripProfile(): TripProfile {
  try {
    const raw = localStorage.getItem(TRIP_PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ponytail: ignore Storage errors
  }
  return {
    weather: ['sunny'],
    durationDays: 1,
    terrain: 'trail',
    groupSize: 1,
  };
}

export function saveTripProfile(profile: TripProfile): void {
  localStorage.setItem(TRIP_PROFILE_KEY, JSON.stringify(profile));
}

export function getCustomCategories(): string[] {
  try {
    const raw = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ponytail: fallback
  }
  return [];
}

export function addCustomCategory(category: string): void {
  const list = getCustomCategories();
  if (!list.includes(category)) {
    list.push(category);
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(list));
  }
}

export function getCustomItems(): ChecklistItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_ITEMS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ponytail: fallback
  }
  return [];
}

export function addCustomItem(item: Omit<ChecklistItem, 'id' | 'isRequiredByRules' | 'isPacked'>): ChecklistItem {
  const newItem: ChecklistItem = {
    ...item,
    id: 'custom-item-' + Math.random().toString(36).slice(2, 9),
    isRequiredByRules: false,
    isPacked: false,
  };
  const list = getCustomItems();
  list.push(newItem);
  localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(list));
  return newItem;
}

export function updateCustomItem(id: string, updates: Partial<ChecklistItem>): void {
  const list = getCustomItems().map((item) =>
    item.id === id ? { ...item, ...updates } : item
  );
  localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(list));
}

export function getPackedStates(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(PACKED_STATES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ponytail: fallback
  }
  return {};
}

export function savePackedState(id: string, isPacked: boolean): void {
  const states = getPackedStates();
  states[id] = isPacked;
  localStorage.setItem(PACKED_STATES_KEY, JSON.stringify(states));
}

export function getGroupAssignments(): Record<string, string> {
  try {
    const raw = localStorage.getItem(GROUP_ASSIGNMENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ponytail: fallback
  }
  return {};
}

export function saveGroupAssignment(id: string, memberId: string): void {
  const assignments = getGroupAssignments();
  assignments[id] = memberId;
  localStorage.setItem(GROUP_ASSIGNMENTS_KEY, JSON.stringify(assignments));
}

export function getLinkedWeights(): Record<string, number> {
  try {
    const raw = localStorage.getItem(LINKED_WEIGHTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ponytail: fallback
  }
  return {};
}

export function saveLinkedWeight(id: string, weightGrams: number): void {
  const weights = getLinkedWeights();
  weights[id] = weightGrams;
  localStorage.setItem(LINKED_WEIGHTS_KEY, JSON.stringify(weights));
}

export function getDefaultRules(): ChecklistRule[] {
  return DEFAULT_RULES;
}
