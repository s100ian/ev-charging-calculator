# Shareable Calculator State

## Summary
Encode the current calculator inputs in the URL so scenarios can be shared and reopened.

## Why it fits
The app is a static site, so URL-based state sharing is a strong fit and requires no backend.

## Scope
- Serialize the main calculator inputs into query parameters
- Load values from the URL on page open
- Add a `copy share link` action

## Implementation Notes
- Keep query parameter names short but readable
- Decide whether URL state overrides `localStorage` or merges with it
- Validate parsed values before applying them to state

## Success Criteria
- Users can share a link that reproduces a scenario
- Opening a shared link preloads the calculator with the same values
- Invalid or partial URL values fail safely
