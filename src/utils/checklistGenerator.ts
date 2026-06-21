import type { TripProfile, ChecklistItem, ChecklistRule } from '../types/checklist';

export function generateChecklist(
  profile: TripProfile,
  customItems: ChecklistItem[],
  rules: ChecklistRule[],
  packedStates: Record<string, boolean>,
  assignments: Record<string, string>,
  weights: Record<string, number>
): ChecklistItem[] {
  const generated: ChecklistItem[] = [];

  for (const rule of rules) {
    // 1. Weather check
    if (rule.weatherRequired && rule.weatherRequired.length > 0) {
      const match = profile.weather.some((w) => rule.weatherRequired!.includes(w));
      if (!match) continue;
    }

    // 2. Terrain check
    if (rule.terrainRequired && rule.terrainRequired.length > 0) {
      if (!rule.terrainRequired.includes(profile.terrain)) continue;
    }

    // 3. Duration check
    if (rule.minDurationDays !== undefined && profile.durationDays < rule.minDurationDays) {
      continue;
    }

    // 4. Group size check
    if (rule.minGroupSize !== undefined && profile.groupSize < rule.minGroupSize) {
      continue;
    }

    // 5. Group gear category filtering
    if (profile.groupSize === 1 && rule.category === 'group') {
      continue;
    }

    // Generate stable ID from rule item name
    const id = 'rule-' + rule.itemName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    generated.push({
      id,
      name: rule.itemName,
      category: rule.category,
      quantity: rule.quantity,
      isRequiredByRules: true,
      isPacked: packedStates[id] || false,
      assignedToMemberId: assignments[id],
      linkedGearWeightGrams: weights[id],
    });
  }

  // Process custom items and merge states
  const processedCustom = customItems
    .filter((item) => !(profile.groupSize === 1 && item.category === 'group'))
    .map((item) => ({
      ...item,
      isPacked: packedStates[item.id] || false,
      assignedToMemberId: assignments[item.id],
      linkedGearWeightGrams: weights[item.id],
    }));

  return [...generated, ...processedCustom];
}
