export interface TripProfile {
  weather: ('sunny' | 'rainy' | 'cold' | 'hot')[];
  durationDays: number;
  terrain: 'trail' | 'alpine' | 'desert' | 'forest';
  groupSize: number;
  targetCalories?: number;
  targetProtein?: number;
  targetFat?: number;
  targetCarbs?: number;
}

export interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  isRequiredByRules: boolean;
  isPacked: boolean;
  assignedToMemberId?: string;
  linkedGearWeightGrams?: number;
  isWorn?: boolean;
  isConsumable?: boolean;
}

export interface ChecklistRule {
  itemName: string;
  category: string;
  quantity: number;
  weatherRequired?: ('sunny' | 'rainy' | 'cold' | 'hot')[];
  minDurationDays?: number;
  minGroupSize?: number;
  terrainRequired?: ('trail' | 'alpine' | 'desert' | 'forest')[];
}
