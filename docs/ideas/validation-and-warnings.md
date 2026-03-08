# Validation and Warnings

## Summary
Add user-facing validation and contextual warnings for unrealistic or risky charging scenarios.

## Why it fits
The app currently accepts a wide range of inputs. Guardrails would improve trust and prevent confusing results.

## Scope
- Warn when duration is unusually long
- Warn when current or voltage looks unrealistic for home charging
- Flag extreme consumption values
- Show guidance when targets are impractical or inefficient

## Implementation Notes
- Keep hard validation separate from soft warnings
- Co-locate field-specific messages near the relevant input
- Consider a general summary warning area in the results section

## Success Criteria
- Users receive clear feedback for odd scenarios
- Warnings do not block normal use unnecessarily
- Messages explain the issue without being overly technical
