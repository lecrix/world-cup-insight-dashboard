# Data And Model Notes

This document explains how to interpret the dashboard data and probability outputs.

## Data Reliability

The dashboard separates data into four practical reliability levels:

- Live: fetched from a public API during the current local server session.
- Cached: previously fetched data reused within the configured cache window or from a local success snapshot.
- Snapshot: static project data such as `official-rosters.json`.
- Estimated: local baseline fields used before confirmed match-day data exists.

Live and cached fields can change when upstream providers update their payloads. Estimated fields should be treated as model inputs, not facts.

## Source Notes

- ESPN public soccer endpoints are used for schedule, score, team, roster and match-summary context when available.
- ESPN/DraftKings odds are parsed from public event payloads when returned by ESPN.
- The Odds API is supported as an optional fallback, but it requires a user-provided API key.
- Open-Meteo is used for venue weather only inside the pre-match forecast window. Before that, the dashboard falls back to venue climate baselines.
- `official-rosters.json` is a static roster snapshot included so the app remains useful when network calls are unavailable.

## Model Notes

The model combines team strength, attack, defense, midfield, goalkeeper, squad depth, recent form, roster availability, travel load, weather stress, rest days and market disagreement. Single-match probabilities are derived from simulated scorelines using Poisson-like goal sampling with contextual volatility.

Market implied probability is computed from displayed odds as `1 / odds`, then normalized across the available 1X2 outcomes. A positive model-market gap means the model probability is higher than the normalized market probability for that outcome.

The cup simulation uses current team baselines and path assumptions. It is designed for scenario comparison, not official tournament forecasting.

## Known Limitations

- Team strength fields are estimated and should be recalibrated when better sources are added.
- Starting XI, late injuries, suspensions and tactical changes can materially change match probabilities.
- Public sports data providers can change response shapes or availability without notice.
- Betting-market odds differ by region and bookmaker. The displayed odds may not match a user's actual sportsbook.
- The current app is optimized for local analysis rather than multi-user production deployment.

## Betting Risk Disclaimer

The dashboard is an analytical aid. It does not guarantee results, does not remove uncertainty, and should not be used as the sole basis for betting decisions. Any betting activity should use independent verification, strict budget limits and local legal compliance.
