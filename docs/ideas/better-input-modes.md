# Better Input Modes

## Summary
Support direct numeric entry alongside sliders to make the calculator faster and more precise.

## Why it fits
The current slider-first approach is friendly on mobile, but it can be slow for exact values such as `11.4` hours or a specific consumption target.

## Scope
- Add number inputs next to sliders
- Keep slider and typed values synchronized
- Preserve sensible min, max, and step constraints

## Implementation Notes
- Reuse the current component boundaries in `CarInfo` and `ChargingDetails`
- Handle invalid, empty, and partially typed values carefully
- Maintain good mobile usability even with extra fields

## Success Criteria
- Users can type exact values directly
- Sliders still work as before
- The UI remains clear on small screens
