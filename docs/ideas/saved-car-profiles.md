# Saved Car Profiles

## Summary
Support multiple saved vehicle profiles instead of a single shared set of calculator inputs.

## Why it fits
The app already persists one configuration in `localStorage`; this feature expands that into a more useful profile system.

## Scope
- Save multiple cars with name, capacity, and consumption
- Switch between saved profiles
- Create, rename, and delete profiles
- Optionally mark one profile as default

## Implementation Notes
- Store a list of profiles in `localStorage`
- Keep the active profile separate from general charging session values
- Start with a simple local-only implementation

## Success Criteria
- Users can switch between at least two saved cars
- Profile changes update the calculator immediately
- Reloading the page preserves the selected profile
