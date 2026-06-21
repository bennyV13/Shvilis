import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase client
const mockFrom = vi.fn();
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
  });

  it('should fetch all user data when fetchUserData is called', async () => {
    const mockQueryBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockImplementation(() => Promise.resolve({ data: [], error: null })),
    };
    mockFrom.mockReturnValue(mockQueryBuilder);

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
    const mockQueryBuilder = {
      upsert: vi.fn().mockImplementation(() => Promise.resolve({ error: null })),
    };
    mockFrom.mockReturnValue(mockQueryBuilder);

    const { syncTripProfile } = await import('./supabaseSync');
    const profile = {
      weather: ['sunny'],
      durationDays: 3,
      terrain: 'trail' as const,
      groupSize: 2,
    };

    await syncTripProfile('test-user-id', profile);
    expect(mockFrom).toHaveBeenCalledWith('trip_profiles');
    expect(mockQueryBuilder.upsert).toHaveBeenCalledWith({
      user_id: 'test-user-id',
      weather: ['sunny'],
      duration_days: 3,
      terrain: 'trail',
      group_size: 2,
    });
  });

  it('should upsert checklist item on syncChecklistItem', async () => {
    const mockQueryBuilder = {
      upsert: vi.fn().mockImplementation(() => Promise.resolve({ error: null })),
    };
    mockFrom.mockReturnValue(mockQueryBuilder);

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
    expect(mockQueryBuilder.upsert).toHaveBeenCalledWith({
      id: 'item-123',
      user_id: 'test-user-id',
      name: 'Tent',
      category: 'shelter',
      quantity: 1,
      is_required_by_rules: false,
      is_packed: true,
      is_worn: false,
      is_consumable: false,
      assigned_to_member_id: 'member-1',
      linked_gear_weight_grams: 2000,
    });
  });
});
