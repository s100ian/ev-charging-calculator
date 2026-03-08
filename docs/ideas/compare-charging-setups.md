# Compare Charging Setups

## Summary
Let users compare multiple charging configurations side by side.

## Why it fits
Many users want to know whether a stronger outlet or wallbox is worth it. The app already has all the inputs needed for a comparison view.

## Scope
- Compare two or more setups in parallel
- Show time, final SoC, added range, and cost if available
- Provide a simple table or card-based comparison layout

## Implementation Notes
- Extract scenario state into reusable data objects
- Reuse the same calculation functions for each scenario
- Keep the initial version limited to a small number of comparison slots

## Success Criteria
- Users can compare at least two charging setups at once
- The UI makes differences easy to scan
- Each comparison uses the same underlying formulas as the main calculator
