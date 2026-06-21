import { describe, it, expect } from 'vitest';
import type { TripProfile, ChecklistItem, ChecklistRule } from '../types/checklist';
import { generateChecklist } from './checklistGenerator';

const testRules: ChecklistRule[] = [
  { itemName: 'Compass', category: 'navigation', quantity: 1 },
  { itemName: 'Rain Jacket', category: 'clothing', quantity: 1, weatherRequired: ['rainy'] },
  { itemName: 'Gloves', category: 'clothing', quantity: 1, weatherRequired: ['cold'] },
  { itemName: 'Microspikes', category: 'safety', quantity: 1, terrainRequired: ['alpine'] },
  { itemName: 'Stove', category: 'group', quantity: 1, minGroupSize: 2 },
  { itemName: 'Socks', category: 'clothing', quantity: 2, minDurationDays: 3 },
];

describe('checklist generator rules engine', () => {
  it('should always include essentials rules', () => {
    const profile: TripProfile = {
      weather: ['sunny'],
      durationDays: 1,
      terrain: 'trail',
      groupSize: 1,
    };

    const items = generateChecklist(profile, [], testRules, {}, {}, {});
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Compass');
    expect(items[0].isRequiredByRules).toBe(true);
  });

  it('should include weather-specific rules when matching profile', () => {
    const profile: TripProfile = {
      weather: ['rainy', 'cold'],
      durationDays: 1,
      terrain: 'trail',
      groupSize: 1,
    };

    const items = generateChecklist(profile, [], testRules, {}, {}, {});
    const names = items.map(i => i.name);
    expect(names).toContain('Compass');
    expect(names).toContain('Rain Jacket');
    expect(names).toContain('Gloves');
    expect(names).not.toContain('Microspikes');
  });

  it('should include terrain rules when matching terrain', () => {
    const profile: TripProfile = {
      weather: ['sunny'],
      durationDays: 1,
      terrain: 'alpine',
      groupSize: 1,
    };

    const items = generateChecklist(profile, [], testRules, {}, {}, {});
    const names = items.map(i => i.name);
    expect(names).toContain('Compass');
    expect(names).toContain('Microspikes');
  });

  it('should include duration-specific rules when matching duration thresholds', () => {
    const profileShort: TripProfile = {
      weather: ['sunny'],
      durationDays: 2,
      terrain: 'trail',
      groupSize: 1,
    };
    const itemsShort = generateChecklist(profileShort, [], testRules, {}, {}, {});
    expect(itemsShort.map(i => i.name)).not.toContain('Socks');

    const profileLong: TripProfile = {
      weather: ['sunny'],
      durationDays: 3,
      terrain: 'trail',
      groupSize: 1,
    };
    const itemsLong = generateChecklist(profileLong, [], testRules, {}, {}, {});
    expect(itemsLong.map(i => i.name)).toContain('Socks');
  });

  it('should include group rules and hide them if groupSize is 1', () => {
    const profileGroup: TripProfile = {
      weather: ['sunny'],
      durationDays: 1,
      terrain: 'trail',
      groupSize: 2,
    };
    const itemsGroup = generateChecklist(profileGroup, [], testRules, {}, {}, {});
    expect(itemsGroup.map(i => i.name)).toContain('Stove');

    const profileSolo: TripProfile = {
      weather: ['sunny'],
      durationDays: 1,
      terrain: 'trail',
      groupSize: 1,
    };
    const itemsSolo = generateChecklist(profileSolo, [], testRules, {}, {}, {});
    expect(itemsSolo.map(i => i.name)).not.toContain('Stove');
  });

  it('should combine custom items and preserve packed/assigned/weight states', () => {
    const profile: TripProfile = {
      weather: ['sunny'],
      durationDays: 1,
      terrain: 'trail',
      groupSize: 2,
    };

    const customItems: ChecklistItem[] = [
      {
        id: 'custom-1',
        name: 'Camera',
        category: 'Photography',
        quantity: 1,
        isRequiredByRules: false,
        isPacked: false,
      },
    ];

    const packedStates = {
      'rule-compass': true,
      'custom-1': true,
    };
    const assignments = {
      'rule-stove': 'member-A',
    };
    const weights = {
      'rule-compass': 150,
      'custom-1': 800,
    };

    const items = generateChecklist(profile, customItems, testRules, packedStates, assignments, weights);
    expect(items).toHaveLength(3); // Compass, Stove, Camera

    const compass = items.find(i => i.name === 'Compass')!;
    expect(compass.isPacked).toBe(true);
    expect(compass.linkedGearWeightGrams).toBe(150);

    const stove = items.find(i => i.name === 'Stove')!;
    expect(stove.assignedToMemberId).toBe('member-A');

    const camera = items.find(i => i.name === 'Camera')!;
    expect(camera.isPacked).toBe(true);
    expect(camera.linkedGearWeightGrams).toBe(800);
  });
});
