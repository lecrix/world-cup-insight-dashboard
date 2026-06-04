# Data And Model Notes

This dashboard separates four reliability levels:

- Live: fetched from a public API during the current server session.
- Cached: reused within a configured cache window or from a local success snapshot.
- Snapshot: static project data such as `official-rosters.json`.
- Estimated: local model inputs used before verified match-day data exists.

## Source Notes

- ESPN public soccer endpoints provide schedule, scores, broadcasts, team directory and match summaries when available.
- ESPN/DraftKings odds are parsed from public event payloads and converted to decimal odds.
- The Odds API is an optional fallback when configured with `ODDS_API_KEY` or `THE_ODDS_API_KEY`.
- Open-Meteo is used only inside the pre-match forecast window; otherwise the UI shows venue climate baselines.
- `official-rosters.json` remains the primary roster snapshot so the app stays useful without network roster calls.

## Model Notes

Single-match probabilities combine strength, attack, defense, midfield, goalkeeper, squad depth, recent form, roster availability, rest, travel load, weather stress and market disagreement. Scorelines are sampled with a Poisson-like simulation and normalized so 1X2 probabilities sum to 100%.

Market implied probability is calculated as `1 / decimal odds`, then normalized across home/draw/away. A positive model-market gap means the model is higher than the displayed market signal for that outcome.

Cup simulation uses current team baselines and path assumptions. It is designed for scenario comparison, not official tournament forecasting.

## Known Limitations

- Public sports data providers can change payload shape or availability without notice.
- Team strength fields are estimated and should be recalibrated with better sources.
- Starting XI, late injuries, suspensions and tactical changes can materially change match probabilities.
- Odds differ by bookmaker and region; displayed odds may not match a user's market.
- The app is optimized for public read-only sharing and personal analysis, not multi-user operations.

## Public Sharing Disclaimer

The dashboard is an analytical aid. It does not guarantee results, does not remove uncertainty and should not be used as the sole basis for betting or financial decisions.
