# Charging Curve Model

## Summary
Replace the simplified top-end charging behavior with a more realistic charging curve model.

## Why it fits
The current calculation logic already contains a charging-phase concept, so this is a natural technical evolution of the model.

## Scope
- Model tapering near high SoC values
- Support different charging behavior profiles by vehicle or charging type
- Improve realism for time-to-target estimates

## Implementation Notes
- Refactor the current `calculateEnergyAdded` utility into clearer charging phases
- Keep the first iteration simple and testable
- Add comprehensive unit tests for curve transitions and caps

## Success Criteria
- Estimates near high SoC become more realistic
- The behavior is clearly documented in the UI or docs
- The new model remains deterministic and testable
