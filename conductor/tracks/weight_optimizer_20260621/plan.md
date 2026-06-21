# Plan - Gear Weight Optimizer

## Phase 1: Domain Extensions and Weight Calculation Utilities [checkpoint: 5983a1b]

- [x] Task: Extend ChecklistItem type and implement utility functions [e428623]
    - [x] Write unit tests for weight calculators (base, consumable, worn, skin-out) and Meal Planner food weight integration
    - [x] Implement data structures (isWorn, isConsumable on ChecklistItem) and core utility calculators
- [x] Task: Conductor - User Manual Verification 'Phase 1: Domain Extensions and Weight Calculation Utilities' (Protocol in workflow.md) [5983a1b]

## Phase 2: React Weight Dashboard and Breakdown Chart [checkpoint: d8b680a]

- [x] Task: Build Weight Dashboard and category progress bar charts [3886c50]
    - [x] Write component tests for the 4 key metrics and category progress bars
    - [x] Implement React components for the Weight Dashboard and horizontal breakdown bars
- [x] Task: Conductor - User Manual Verification 'Phase 2: React Weight Dashboard and Breakdown Chart' (Protocol in workflow.md) [d8b680a]

## Phase 3: UI Controls Integration and App Coordination

- [ ] Task: Integrate worn/consumable controls in Checklist and link App state
    - [ ] Write integration tests for Worn/Consumable toggles and Meal Planner food weight sync
    - [ ] Implement toggle controls in Checklist UI and coordinate state and rendering in App.tsx
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI Controls Integration and App Coordination' (Protocol in workflow.md)
