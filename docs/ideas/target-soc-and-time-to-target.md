# Target SoC and Time to Target

## Summary
Let the user select a desired target state of charge and calculate the time and energy needed to reach it.

## Why it fits
The current calculator already models charge progression from a starting SoC, so adding a target extends the existing workflow instead of changing it.

## Scope
- Add a target SoC input
- Show time needed to reach target
- Show energy needed to reach target
- Show expected range at target

## Implementation Notes
- Extend the calculation utilities with a target-based function
- Ensure the target cannot be set below current SoC
- Decide how trickle charging applies near the top end

## Success Criteria
- Users can set a target such as `80%` or `90%`
- The app shows how long charging should take
- The result remains consistent with the existing charging model
