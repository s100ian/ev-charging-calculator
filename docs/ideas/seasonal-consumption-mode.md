# Seasonal Consumption Mode

## Summary
Support seasonal or weather-based consumption presets so range estimates better match real driving conditions.

## Why it fits
Range output depends heavily on consumption, and seasonal presets would make that input faster and more realistic.

## Scope
- Add preset modes such as `summer`, `winter`, and `custom`
- Auto-adjust the consumption input when a mode is selected
- Optionally show an explanation of why seasonal consumption differs

## Implementation Notes
- Keep `custom` as the fallback mode
- Treat seasonal presets as a convenience layer on top of existing consumption input
- Use local-only static values initially

## Success Criteria
- Users can quickly test seasonal scenarios
- Range results visibly change between modes
- The current manual consumption control still works
