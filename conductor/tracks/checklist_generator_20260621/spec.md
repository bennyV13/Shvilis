# Specification - Intelligent Checklist Generator

## Overview
The Intelligent Checklist Generator dynamically builds a tailored packing list for outdoor trips based on a trip profile (expected weather, duration, terrain, and group size). It categorizes items into comprehensive gear categories, applies rule-based recommendations, integrates with the Gear Weight Optimizer to track base weight, and allows users to add custom categories and custom items.

## Functional Requirements
1. **Trip Profile Setup Form:**
   - Input fields: Expected weather (Sunny, Rainy, Cold, Hot), duration in days, terrain (Trail, Alpine, Desert, Forest), and group size.
2. **Dynamic Checklist Generation Engine:**
   - Evaluates rules to append/adjust items based on weather, duration, group size, and terrain.
3. **Checklist Categories:**
   - Default categories: Essentials, Shelter, Sleep System, Kitchen, Clothing, Navigation, Safety, Group Gear.
   - **Custom Categories:** Users can add their own custom categories (e.g. "Photography", "Dog Gear").
4. **Ad-hoc Custom Items:**
   - Users can add additional custom items to any category (both default and custom categories).
5. **Member Assignment for Group Gear:**
   - Let trip organizers assign shared items to specific group members.
6. **Gear Weight Optimizer Integration:**
   - Allow checklist items to link to gear items with specified weights to calculate actual packed base weight.

## Data Structures

### Trip Profile
```typescript
interface TripProfile {
  weather: ('sunny' | 'rainy' | 'cold' | 'hot')[];
  durationDays: number;
  terrain: 'trail' | 'alpine' | 'desert' | 'forest';
  groupSize: number;
}
```

### Checklist Item
```typescript
interface ChecklistItem {
  id: string;
  name: string;
  category: string; // Defaults + custom categories
  quantity: number;
  isRequiredByRules: boolean;
  isPacked: boolean;
  assignedToMemberId?: string; // For group gear
  linkedGearWeightGrams?: number; // Linked from Gear Weight Optimizer
}
```

## User Experience (UX) Flow
1. **Create Profile:** User fills out expected trip variables.
2. **Generate Checklist:** System displays the generated checklist with categories.
3. **Customize Checklist:** User can click "Add Custom Category" or "Add Item" under any category.
4. **Manage Items:** User toggles packed state, updates quantities, and assigns group gear items.
5. **Weight Integration:** The checklist shows estimated weight next to items and sums packed weight.

## Acceptance Criteria
- Dynamic checklist updates immediately when changing trip profile.
- Custom categories and items persist locally (e.g., in localStorage).
- Group gear category is hidden if group size is 1.
- All rules correctly add/remove items.
- Component unit tests achieve >80% coverage.
