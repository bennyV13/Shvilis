import { describe, it, expect, beforeEach } from 'vitest';
import {
  getTripProfile,
  saveTripProfile,
  getCustomCategories,
  addCustomCategory,
  getCustomItems,
  addCustomItem,
  updateCustomItem,
  getPackedStates,
  savePackedState,
  getGroupAssignments,
  saveGroupAssignment,
  getLinkedWeights,
  saveLinkedWeight
} from './checklistRegistry';

describe('checklistRegistry storage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return a default trip profile when none exists', () => {
    const profile = getTripProfile();
    expect(profile.durationDays).toBe(1);
    expect(profile.groupSize).toBe(1);
    expect(profile.terrain).toBe('trail');
    expect(profile.weather).toEqual(['sunny']);
  });

  it('should save and load trip profile correctly', () => {
    const customProfile = {
      weather: ['rainy', 'cold'] as ('sunny' | 'rainy' | 'cold' | 'hot')[],
      durationDays: 4,
      terrain: 'alpine' as const,
      groupSize: 3,
    };

    saveTripProfile(customProfile);
    expect(getTripProfile()).toEqual(customProfile);
  });

  it('should manage custom categories list', () => {
    expect(getCustomCategories()).toEqual([]);
    addCustomCategory('Photography');
    expect(getCustomCategories()).toEqual(['Photography']);
  });

  it('should manage custom items list and updates', () => {
    expect(getCustomItems()).toEqual([]);

    const newItem = addCustomItem({
      name: 'Camera Tripod',
      category: 'Photography',
      quantity: 1,
    });

    expect(newItem.id).toBeDefined();
    expect(newItem.isRequiredByRules).toBe(false);
    expect(newItem.isPacked).toBe(false);

    const list = getCustomItems();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('Camera Tripod');

    updateCustomItem(newItem.id, { quantity: 2 });
    expect(getCustomItems()[0].quantity).toBe(2);
  });

  it('should store individual item states (packed, assignment, linked weight)', () => {
    expect(getPackedStates()).toEqual({});
    expect(getGroupAssignments()).toEqual({});
    expect(getLinkedWeights()).toEqual({});

    savePackedState('item-1', true);
    saveGroupAssignment('item-1', 'member-2');
    saveLinkedWeight('item-1', 450);

    expect(getPackedStates()).toEqual({ 'item-1': true });
    expect(getGroupAssignments()).toEqual({ 'item-1': 'member-2' });
    expect(getLinkedWeights()).toEqual({ 'item-1': 450 });
  });
});
