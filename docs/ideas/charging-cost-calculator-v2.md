# Charging Cost Calculator V2

## Summary
Extend the fixed-price MVP with richer tariff options and more advanced cost analysis workflows.

## Why it fits
The MVP adds the core pricing layer and cost outputs. A V2 can build on that foundation to make the calculator more realistic for home charging and more useful for comparing charging choices.

## Scope
- Add day and night tariff support
- Add optional pricing presets for common home and public charging cases
- Improve currency display with more consistent formatting
- Support cost comparison across charging setups or pricing modes
- Add richer cost breakdowns where they help explain the result

## Implementation Notes
- Extend the MVP pricing model instead of replacing it so a single fixed tariff remains the simplest supported case
- Keep tariff definition separate from charge-session inputs so future pricing modes stay modular
- Reuse the same core cost outputs and add richer breakdowns around them
- Keep cost labels explicit whenever multiple tariffs or pricing assumptions are involved

## Success Criteria
- Users can model at least a day and a night tariff
- The UI still supports the simple fixed-price flow without added friction
- More advanced pricing features remain easy to understand
- Cost comparisons stay consistent with the same underlying charging calculations
