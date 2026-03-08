# Trip Readiness Calculator

## Summary
Add a trip-focused mode that checks whether a planned charge session is enough for an upcoming drive.

## Why it fits
The app already computes final SoC and estimated range, so a trip-check feature would turn those outputs into a concrete decision tool.

## Scope
- Add trip distance input
- Add desired reserve SoC or reserve range
- Show whether the planned charge is sufficient
- Suggest the additional time needed if it is not sufficient

## Implementation Notes
- Reuse range and SoC calculations already present in the app
- Keep the reserve as an explicit user-configurable parameter
- Highlight pass/fail status visually

## Success Criteria
- Users can check if a session covers a planned trip
- The app explains shortfall clearly when the result is not enough
- The feature works with existing battery and charging inputs
