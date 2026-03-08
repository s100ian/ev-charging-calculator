# Charging Efficiency and Losses

## Summary
Add a configurable efficiency factor so session results reflect real-world charging losses.

## Why it fits
The current model assumes ideal transfer of energy. A loss factor would make the calculator more realistic without changing the UI dramatically.

## Scope
- Add charging efficiency input such as `85%` to `95%`
- Show delivered energy versus energy drawn from the grid
- Use the adjusted energy for cost calculations if that feature is added

## Implementation Notes
- Keep the current ideal calculation as the base
- Apply efficiency as a conversion layer around energy added
- Be explicit about whether the result refers to battery energy or wall energy

## Success Criteria
- Users can enable a realistic loss factor
- The app shows clearly how losses affect results
- Labels prevent confusion between battery and grid energy
