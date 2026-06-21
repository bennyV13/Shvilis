import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase client
const mockFrom = vi.fn();
const mockQueryBuilder = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn().mockImplementation(() => Promise.resolve({ data: null, error: null })),
  insert: vi.fn().mockImplementation(() => Promise.resolve({ data: null, error: null })),
  update: vi.fn().mockImplementation(() => Promise.resolve({ data: null, error: null })),
  upsert: vi.fn().mockImplementation(() => Promise.resolve({ data: null, error: null })),
  delete: vi.fn().mockReturnThis(),
};

vi.mock('../lib/supabase', () => {
  return {
    supabase: {
      from: (table: string) => mockFrom(table),
    },
  };
});

describe('supabaseSync data service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue(mockQueryBuilder);
  });

  it('should fetch all user data when fetchUserData is called', async () => {
    const { fetchUserData } = await import('./supabaseSync');
    const data = await fetchUserData('test-user-id');

    expect(data).toBeDefined();
    expect(mockFrom).toHaveBeenCalledWith('trip_profiles');
    expect(mockFrom).toHaveBeenCalledWith('custom_categories');
    expect(mockFrom).toHaveBeenCalledWith('checklist_items');
    expect(mockFrom).toHaveBeenCalledWith('custom_foods');
    expect(mockFrom).toHaveBeenCalledWith('meal_plans');
  });

  it('should upsert trip profile on syncTripProfile', async () => {
    const { syncTripProfile } = await import('./supabaseSync');
    const profile = {
      weather: ['sunny'] as ('sunny' | 'rainy' | 'cold' | 'hot')[],
      durationDays: 3,
      terrain: 'trail' as const,
      groupSize: 2,
    };

    await syncTripProfile('test-user-id', profile);
    expect(mockFrom).toHaveBeenCalledWith('trip_profiles');
  });

  it('should upsert checklist item on syncChecklistItem', async () => {
    const { syncChecklistItem } = await import('./supabaseSync');
    const item = {
      id: 'item-123',
      name: 'Tent',
      category: 'shelter',
      quantity: 1,
      isRequiredByRules: false,
      isPacked: true,
      isWorn: false,
      isConsumable: false,
      assignedToMemberId: 'member-1',
      linkedGearWeightGrams: 2000,
    };

    await syncChecklistItem('test-user-id', item);
    expect(mockFrom).toHaveBeenCalledWith('checklist_items');
  });
});
