# Departure Time Planner

## Summary
Allow users to enter a departure time and desired battery level, then calculate when charging should begin.

## Why it fits
This turns the calculator into a practical planning tool for overnight or scheduled charging.

## Scope
- Add departure time input
- Add desired SoC at departure
- Calculate required charge duration
- Calculate recommended charge start time

## Implementation Notes
- Build on top of the target-SoC logic
- Use local time in the browser
- Handle cases where the target cannot be reached in time

## Success Criteria
- Users can plan charging backwards from a departure time
- The app clearly states the recommended start time
- The app warns when the selected setup is too slow
