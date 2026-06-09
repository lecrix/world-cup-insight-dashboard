# World Cup Insight Dashboard

世界杯赛程、球队画像、模型概率、市场信号、竞彩数学分析和赛后复盘看板。

本项目面向公开分享和个人分析使用。它把公开数据源、本地球队基线、赔率隐含概率、天气场馆环境和阵容快照整合到一个轻量 Web 应用中，重点是解释模型如何得出结论，而不是承诺任何赛果。

> 本项目仅用于数据整理、概率分析和模型复盘，不保证比赛结果，也不构成投注建议。`竞彩` 页面提供的是数学计算和风险展示，不是购买建议。

## Table Of Contents

- [Features](#features)
- [Screens And Pages](#screens-and-pages)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Data Sources](#data-sources)
- [Model Notes](#model-notes)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Roadmap](#roadmap)
- [License](#license)

## Features

- 48 队、12 组、72 场小组赛骨架，支持按小组、日期和球队筛选。
- 比赛日指挥台，聚合关注比赛、临近开球、模型分歧、风险雷达和数据源状态。
- 单场深度页，展示胜平负概率、比分热区、关键因子、情景模拟、阵容、天气和历史情报。
- 球队页，展示球队强度、战术风险、同组竞争、中文大名单和球队对比。
- 市场页，把赔率转换为市场隐含概率，并和模型观点做差值比较。
- 竞彩助手，基于模型概率、泊松分布、期望值和凯利公式展示数学分析与风险提示。
- 模拟页，展示冠军概率、最佳第三名和路径假设。
- 球员页，展示金靴候选、预期进球、点球权、首发率和球队路径。
- 复盘页，在真实完赛数据返回后计算方向命中、比分 Top 6 命中和偏差指标。
- 数据源页，展示 live、cached、snapshot、estimated 的覆盖率、更新时间、fallback 和限制。

## Screens And Pages

| Page | Route | Purpose |
| --- | --- | --- |
| 指挥台 | `#/overview` | 比赛日入口，优先展示需要关注的比赛、风险和数据状态 |
| 赛程 | `#/matches` | 小组积分榜、赛程时间线、晋级规则和逐场入口 |
| 单场 | `#/match` | 单场赛前结论、概率证据、情景模拟、阵容和天气 |
| 球队 | `#/teams` | 球队能力画像、中文阵容、同组竞争和球队对比 |
| 市场 | `#/market` | 市场共识与模型观点差异，不提供投注指令 |
| 竞彩 | `#/betting` | 竞彩数学助手，计算 EV、凯利、串关回报和风险 |
| 模拟 | `#/simulation` | 冠军概率、最佳第三名和路径敏感项 |
| 球员 | `#/golden` | 金靴候选、角色权重、出场时间和球队路径 |
| 复盘 | `#/review` | 完赛后展示命中率、比分误差和模型校准口径 |
| 数据源 | `#/sources` | 数据源审计、覆盖率、fallback 和限制说明 |

All routes use hash navigation, so filtered views can be shared as URLs such as:

```text
http://127.0.0.1:5174/#/betting?date=2026-06-12&match=gA1&team=arg
```

## Architecture

```text
Browser
  index.html
  styles.css
  src/
    components/     shared UI shell and controls
    data/           tournament skeleton, teams, venues and page map
    domain/         match model, simulation, market and betting math
    services/       frontend API client
    utils/          formatting, icons and canvas export
    views.js        page composition
      |
      | fetch()
      v
Python runtime
  server.py         static server and API routes
  backend/          payload helpers
      |
      | public data providers
      v
ESPN / DraftKings / Open-Meteo / official-rosters.json
```

The frontend is a Vite ES modules app. The backend uses only Python standard-library HTTP primitives, so the project stays lightweight and easy to run.

## Quick Start

### Requirements

- Node.js 18 or newer
- Python 3.10 or newer
- npm

### Frontend Development

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5174/
```

The Vite dev server proxies `/api/*` to the local Python backend when it is running.

### Production-Style Local Run

```bash
npm run build
python3 -B server.py
```

Open:

```text
http://127.0.0.1:4174/
```

When `dist/` exists, `server.py` serves the production build. If `dist/` is missing, it falls back to the repository root for development convenience.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `WC_DASHBOARD_PORT` | `4174` | Python server port |
| `WC_DASHBOARD_STATIC_DIR` | `dist` | Static asset directory served by `server.py` |
| `WC_LIVE_CACHE_SECONDS` | `60` | Schedule and odds cache TTL |
| `WC_INTEL_CACHE_SECONDS` | `300` | Match and roster intelligence cache TTL |
| `WC_WEATHER_CACHE_SECONDS` | `1800` | Weather forecast cache TTL |
| `ODDS_API_KEY` / `THE_ODDS_API_KEY` | unset | Enables The Odds API fallback |
| `WC_ODDS_SPORT_KEY` | `soccer_fifa_world_cup` | The Odds API sport key |
| `WC_ODDS_REGIONS` | `eu,us` | The Odds API regions |
| `WC_ODDS_MARKETS` | `h2h` | The Odds API markets |

Keep secrets in environment variables. Do not commit `.env` files.

## Data Sources

| Module | Primary source | Fallback |
| --- | --- | --- |
| Schedule and scores | ESPN public soccer scoreboard | Local 48-team group-stage skeleton |
| Market odds | ESPN/DraftKings event payloads | The Odds API if configured, then model baseline odds |
| Rosters | `official-rosters.json` | ESPN roster endpoint when available |
| Weather | Open-Meteo inside pre-match forecast window | Stadium climate baseline |
| Model strength | Local team baseline fields | Estimated values documented in the UI |

The app labels data as:

- `live`: fetched during the current server session.
- `cached`: reused within a cache window or from a local success snapshot.
- `snapshot`: static project data committed with the repo.
- `estimated`: local model inputs used before verified match-day data exists.

## Model Notes

Single-match probabilities combine:

- team strength, Elo-like baseline and FIFA rank
- attack, defense, midfield, goalkeeper and depth
- recent form and head-to-head context when available
- roster availability and injury signals
- rest days, travel load, venue, weather and altitude
- market implied probability for comparison, not as ground truth

Scorelines are generated with a deterministic Poisson-style simulation. Displayed 1X2 probabilities are normalized to sum to 100%.

The `竞彩` page uses the same model output and applies:

- decimal odds conversion
- implied probability comparison
- expected value calculation
- capped Kelly fraction
- parlay return estimation

These calculations are mathematical diagnostics only.

## Testing

Run the full validation suite:

```bash
npm run check
npm test
npm run build
```

What each command covers:

| Command | Coverage |
| --- | --- |
| `npm run check` | JavaScript syntax check and Python compile check |
| `npm test` | Frontend domain tests and backend Python unit tests |
| `npm run build` | Production frontend build |

The current regression tests cover:

- 48-team and 72-match tournament skeleton
- odds-to-implied-probability normalization
- model fallback odds
- deterministic match model output
- date grouping
- championship probability normalization
- navigation and hash routing including `竞彩`
- local favorites
- scenario projection
- review metrics
- data source audit rows
- `竞彩` expected-goals wiring
- review empty state before real completed matches exist

## Deployment

### Static Sharing

Static hosting is suitable for public demos when live backend APIs are not required. Build the frontend:

```bash
npm run build
```

Deploy `dist/` to a static host. If the site is hosted under a subpath, configure Vite `base` before building so asset URLs resolve correctly.

### Full Data App

Use this mode when `/api/live-data`, `/api/match-intel` and `/api/team-roster` should remain available:

```bash
npm ci
npm run build
WC_DASHBOARD_PORT=4174 python3 -B server.py
```

For cloud platforms, run behind a reverse proxy or platform router, configure TLS externally, and keep API keys in environment variables.

## Project Structure

```text
.
├── backend/
│   └── http_payload.py
├── docs/
│   └── DATA_AND_MODEL_NOTES.md
├── src/
│   ├── components/
│   ├── data/
│   ├── domain/
│   ├── services/
│   ├── utils/
│   ├── main.js
│   ├── state.js
│   └── views.js
├── tests/
│   ├── backend/
│   └── frontend/
├── official-rosters.json
├── server.py
├── styles.css
├── vite.config.js
└── package.json
```

## Development Workflow

1. Keep UI changes scoped to `src/views.js`, `src/components/` and `styles.css`.
2. Keep model and betting math in `src/domain/`.
3. Add or update tests when changing route behavior, model output, review logic or data fallback.
4. Run `npm run check`, `npm test` and `npm run build` before publishing.
5. Keep generated `dist/` out of source control unless a deployment target explicitly requires committed build artifacts.

## Roadmap

- Add a one-command static deployment workflow.
- Add a cloud deployment profile for the Python API service.
- Expand `竞彩` tests to cover parlay adoption and risk labels.
- Add visual regression checks for desktop and mobile layouts.
- Replace estimated team baselines with versioned, source-attributed datasets when available.
- Add completed-match calibration charts after real match data exists.

## Contributing

This repository is currently optimized for focused local iteration. Contributions should keep the app:

- transparent about data confidence
- usable without private credentials
- cautious about betting-related language
- lightweight in dependencies
- testable with the existing `npm run check`, `npm test` and `npm run build` gate

## License

MIT License. See [LICENSE](LICENSE).
