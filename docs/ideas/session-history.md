# Session History

## Summary
Store previous calculator scenarios locally so users can revisit and compare past charging plans.

## Why it fits
The app already uses `localStorage`, so a local-only history feature can be added without introducing a backend.

## Scope
- Save previous calculation scenarios
- Show recent sessions in a list
- Let users reload or delete old scenarios
- Optionally add notes or labels per session

## Implementation Notes
- Persist an array of recent sessions in `localStorage`
- Store only the input values and a timestamp
- Limit the number of saved sessions to keep the feature simple

## Success Criteria
- Users can revisit recent scenarios after a page refresh
- A saved session can be restored into the calculator
- The history list remains easy to manage on mobile
