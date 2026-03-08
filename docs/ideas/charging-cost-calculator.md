# Charging Cost Calculator

## Summary
Add a fixed-price electricity tariff input so the calculator can estimate how much a charging session costs using wall-energy-based pricing.

## Why it fits
The app already calculates charging energy and range, so cost is a natural next step that makes the results more practical without adding much UI complexity.

## Scope
- Add a fixed-price tariff input in cost per `kWh`
- Show session cost
- Show cost to charge from the current SoC to full
- Show estimated cost per `100 km`
- Show placeholders when no price is entered
- Keep cost outputs clearly separated from energy and range outputs

## Implementation Notes
- Keep the fixed-price tariff in local state and persist it to `localStorage`
- Use a symbol-only currency input
- Best-effort guess the initial currency symbol from browser settings and store the selected symbol in `localStorage`
- Base cost calculations on wall energy and label the values clearly so users understand the estimate reflects grid energy paid for
- Reuse existing charging outputs where possible, but keep the pricing layer structured so day/night tariffs can be added later without reworking the data model

## Success Criteria
- Users can enter a fixed price per `kWh`
- Results update instantly as inputs change
- Empty price state shows placeholders instead of misleading zero values
- Cost outputs are clearly separated from energy and range outputs
- The implementation can later extend to day/night tariffs without replacing the overall pricing model
