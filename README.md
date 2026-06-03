# World Cup Insight Dashboard

世界杯赛前预测、赔率分歧观察和赛后复盘看板。项目面向希望把赛程、球队实力、市场赔率、阵容变量和模型解释放在同一个工作台里观察的足球数据爱好者。

当前版本是一个零前端构建依赖的本地 Web 应用：浏览器端负责交互、可视化和概率展示，Python 标准库后端负责静态文件服务、公开数据源拉取、缓存和 API 汇总。

> 本项目用于数据整理、概率分析和模型复盘，不保证任何比赛结果，也不构成投注建议。

## Features

- 首页总览：按比赛日展示重点比赛、模型置信、爆冷风险和模型/市场分歧。
- 小组赛程：覆盖 48 队、12 个小组和 72 场小组赛结构，展示小组积分和出线区域。
- 单场深度：展示胜平负概率、比分热力图、预期进球、攻防对比、阵容变量、市场赔率和反向证据。
- 球队画像：展示球队实力结构、核心球员、教练组、阵容名单、近期状态和对比球队。
- 杯赛模拟：估算小组出线、最佳第三、淘汰赛路径、冠军概率和黑马指数。
- 金靴预测：结合球员能力、首发率、点球权、射门量和球队路径估算进球分布。
- 赔率市场：自动同步赔率后计算市场隐含概率，并排序模型与市场的最大分歧。
- 赛后复盘：比赛完赛后根据 live feed 自动沉淀方向命中、比分 Top 5、进球数和单位变化。
- 数据源状态：明确展示哪些字段来自真实数据源、缓存、估算或赛前待导入。

## Architecture

```text
Browser
  index.html
  styles.css
  app.js
      | fetch()
      v
Python local server
  server.py
      | ESPN scoreboard / summary / teams
      | ESPN DraftKings odds
      | Open-Meteo forecast
      | optional The Odds API fallback
      v
In-memory cache + official-rosters.json
```

The frontend is intentionally dependency-free. It renders the dashboard directly from `app.js` and refreshes live data through the local backend.

The backend uses only Python standard library modules. It serves the static files and exposes a small JSON API for live data, match intelligence, team rosters, and health checks.

## Data Sources

| Data area | Current source | Status |
| --- | --- | --- |
| Teams, groups, group-stage skeleton | Built into `app.js` | Available |
| Official roster snapshot | `official-rosters.json` | Available |
| Schedule, scores, broadcasts | ESPN public soccer endpoints | Live/cache when available |
| 1X2 odds | ESPN/DraftKings public payload | Live/cache when available |
| Fallback odds | The Odds API | Optional, requires API key |
| Venue weather | Open-Meteo forecast inside 72-hour window | Live/cache when available |
| Strength ratings, form, market heat | Local model baseline | Estimated |
| Starting XI, late injuries, suspensions | Data-source dependent | Pending official import |

See [docs/DATA_AND_MODEL_NOTES.md](docs/DATA_AND_MODEL_NOTES.md) for model assumptions, caveats, and risk notes.

## Requirements

- Python 3.10 or newer
- A modern browser
- Optional: `ODDS_API_KEY` or `THE_ODDS_API_KEY` for The Odds API fallback

No `npm install` or Python package installation is required for the current version.

## Run Locally

```bash
python3 server.py
```

Open:

```text
http://127.0.0.1:4174
```

The default port can be changed:

```bash
WC_DASHBOARD_PORT=4180 python3 server.py
```

## Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `WC_DASHBOARD_PORT` | `4174` | Local server port |
| `WC_LIVE_CACHE_SECONDS` | `60` | Live schedule/odds cache TTL |
| `WC_INTEL_CACHE_SECONDS` | `300` | Match/team intelligence cache TTL |
| `WC_WEATHER_CACHE_SECONDS` | `1800` | Weather forecast cache TTL |
| `ODDS_API_KEY` / `THE_ODDS_API_KEY` | unset | Enables The Odds API fallback |
| `WC_ODDS_SPORT_KEY` | `soccer_fifa_world_cup` | The Odds API sport key |
| `WC_ODDS_REGIONS` | `eu,us` | The Odds API regions |
| `WC_ODDS_MARKETS` | `h2h` | The Odds API markets |

Example with an odds fallback:

```bash
ODDS_API_KEY="your-api-key" \
WC_ODDS_SPORT_KEY="soccer_fifa_world_cup" \
python3 server.py
```

## API Endpoints

| Endpoint | Description |
| --- | --- |
| `/api/health` | Local service health check |
| `/api/live-data` | Aggregated schedule, scores, odds, weather and source status |
| `/api/match-intel?matchId=gA1` | ESPN summary-derived head-to-head and recent-form context |
| `/api/team-roster?team=arg` | Team roster data from local official snapshot or ESPN fallback |

## Project Structure

```text
.
├── app.js                    # Frontend state, model calculations and page rendering
├── index.html                # Static app shell
├── official-rosters.json     # 48-team roster snapshot
├── server.py                 # Local static server and data aggregation API
├── styles.css                # Dashboard layout and visual system
├── docs/
│   └── DATA_AND_MODEL_NOTES.md
├── LICENSE
└── README.md
```

## Validation

Recommended checks before publishing or editing the model:

```bash
node --check app.js
python3 -c "compile(open('server.py', encoding='utf-8').read(), 'server.py', 'exec'); print('server.py syntax ok')"
python3 -c "import json; json.load(open('official-rosters.json', encoding='utf-8')); print('official-rosters.json ok')"
```

## Model Caveats

- The dashboard combines live public data with local estimated fields. Estimated values are useful for baseline comparison, not for certainty.
- Market implied probability is derived from decimal odds and normalized after removing bookmaker overround at the displayed outcome level.
- Monte Carlo outputs are deterministic for a given match/feed timestamp, so repeated renders remain stable.
- Roster, injury, suspension and starting XI data must be reviewed close to kickoff when available.
- Weather switches from climate baseline to Open-Meteo forecast only inside the configured pre-match window.
- Any betting-related interpretation should use strict bankroll limits and independent verification. The app is an analysis tool, not a prediction guarantee.

## License

MIT License. See [LICENSE](LICENSE).
