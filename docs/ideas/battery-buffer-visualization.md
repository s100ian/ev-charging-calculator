# Battery Buffer Visualization

## Summary
Add a richer battery visualization that shows the current charge, expected added energy, and final state.

## Why it fits
The app already shows a battery bar for final SoC, so this idea deepens an existing visual pattern.

## Scope
- Show current SoC segment
- Show added energy segment
- Show target or capped final SoC segment
- Optionally annotate low, recommended, and high charge zones

## Implementation Notes
- Extend the existing battery UI in `ResultsDisplay`
- Use color and labels to separate current and added charge
- Keep the design accessible in light and dark modes

## Success Criteria
- Users can visually understand how much a session adds
- The component remains readable on mobile
- The visualization reflects the same calculation results shown numerically
