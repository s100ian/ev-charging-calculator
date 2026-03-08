# Home Charging Scenarios

## Summary
Provide one-tap presets for common home and travel charging setups.

## Why it fits
Users often think in terms of charging situations rather than raw voltage and current values.

## Scope
- Add presets such as `230V / 10A`, `230V / 16A`, and common wallbox configurations
- Let users apply a preset with one click
- Keep manual editing available after preset selection

## Implementation Notes
- Represent presets as static data
- Update `volts` and `amps` when a preset is selected
- Consider a small label explaining the typical use case for each preset

## Success Criteria
- Users can switch charging setups faster than using sliders alone
- Presets do not block manual tuning
- Results update immediately after preset selection
