# Charging Cost Calculator

## Summary
Add electricity pricing inputs so the calculator can estimate how much a charging session costs.

## Why it fits
The app already calculates energy added in `kWh`, so cost is a natural next step with very little new complexity.

## Scope
- Add a price input in cost per `kWh`
- Show session cost
- Show full-charge cost
- Show estimated cost per `100 km`

## Implementation Notes
- Keep pricing in local state and persist it to `localStorage`
- Reuse `energyAddedKwh`, `usableCapacity`, and `consumption`
- Consider optional support for currency symbol selection

## Success Criteria
- Users can enter a power price
- Results update instantly as inputs change
- Cost outputs are clearly separated from energy and range outputs
