# Product Guidelines - Shvilis

## 1. Design Aesthetics & Visual Identity
- **Color Palette (Earth & Trail Theme):**
  - **Background:** Deep Charcoal (`#121417`) to reduce eye strain in outdoor/tented settings.
  - **Primary Accents:** Forest Green (`#2E7D32` / `#4CAF50`) for interactive elements, completions, and positive indicators.
  - **Secondary Accents:** Terracotta/Sand (`#D84315` / `#FF5722`) for warnings, weights exceeding thresholds, or incomplete states.
  - **Muted Elements:** Slate Gray (`#37474F`) for structural borders and inactive checklist items.
- **Typography:**
  - Standard clean sans-serif typeface: **Inter** or **Outfit** for clean numbers, tables, and weights.
  - Monospace font (e.g., Fira Code, JetBrains Mono) for weight displays and nutrition stats to ensure numerical alignment.
- **Layout:**
  - Modern card-based grid layout for gear categories.
  - Fixed summary banner/sidebar displaying real-time metrics (Total Weight, Pack Status, Target Calorie Achievement).

## 2. User Experience & Interaction Patterns
- **Checklist Interactions:**
  - Single-tap toggle for checking/unchecking items. Completed items should immediately dim to 50% opacity with a clean strikethrough.
  - Inline editing for quantity, weight, and calories to avoid modal popups.
- **Weight Visualizations:**
  - Display progress bars showing base weight versus consumable weight (food, water).
  - Provide immediate visual feedback when an item is added or updated (no lag).
- **Offline Reliability:**
  - Always render a clear status indicator (e.g., "Ready for Offline Use" vs. "Syncing").
  - Gracefully store all packing and meal changes in local cache (`localStorage` / `IndexedDB`) before syncing to database.

## 3. Prose & Communication Tone
- **Tone:** Encouraging, precise, and practical.
- **Microcopy:** Avoid overly verbose explanations. Use clear labels like "Base Weight", "Consumables", "Daily Calories", "Water Capacity".
- **Empty States:** When a category or meal plan is empty, display helpful starter recommendations (e.g., "No breakfast planned yet. Add oatmeal or energy bars?").
