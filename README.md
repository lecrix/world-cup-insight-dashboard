# World Cup Insight Dashboard

世界杯赛程、球队实力、市场信号、阵容信息和模型复盘看板。当前版本面向公开分享和个人分析：前端使用 Vite + ES modules 组织，Python 标准库服务同时提供静态资源和数据 API。

> 本项目用于数据整理、概率分析和模型复盘，不保证任何比赛结果，也不构成投注建议。赔率只作为市场隐含概率和模型分歧参考。

## Highlights

- 比赛日指挥台：首屏聚合当天重点比赛、模型置信、市场分歧、风险雷达和数据源状态。
- 赛程/小组：48 队、12 组、72 场小组赛骨架，联动积分榜、赛程时间线和晋级规则。
- 单场深度：胜平负概率、预期进球、比分 Top 6、关键因子、阵容状态、天气场馆和反向证据。
- 关注与情景：本地关注比赛/球队，单场页可调整状态、可用性和天气消耗观察概率敏感性。
- 市场信号：自动读取 ESPN/DraftKings 赔率，换算市场隐含概率并排序模型差值。
- 数据可信度：区分 live、cached、snapshot、estimated，公开展示覆盖率、更新时间、缺失和 fallback 状态。
- 单服务上线：`dist/` 构建产物可由 `server.py` 直接托管，同时保留 API 路由。

## Architecture

```text
Browser
  index.html
  styles.css
  src/
    data/          tournament skeleton
    domain/        model and simulation
    services/      API client
    components/    shared UI
    views.js       page composition
      | fetch()
      v
Python local/server runtime
  server.py
  backend/
    http_payload.py
      | ESPN scoreboard / summary / teams
      | ESPN DraftKings odds
      | Open-Meteo forecast
      | optional The Odds API fallback
      v
In-memory cache + official-rosters.json
```

## Requirements

- Python 3.10 or newer
- Node.js 18 or newer for development/build
- Optional: `ODDS_API_KEY` or `THE_ODDS_API_KEY` for The Odds API fallback

## Run Locally

API + static fallback:

```bash
python3 -B server.py
```

Open `http://127.0.0.1:4174`.

Frontend development with proxy:

```bash
npm install
npm run dev
```

Production-style single service:

```bash
npm run build
python3 -B server.py
```

`server.py` serves `dist/` when present. Override it with:

```bash
WC_DASHBOARD_STATIC_DIR=/path/to/dist python3 -B server.py
```

## Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `WC_DASHBOARD_PORT` | `4174` | Local server port |
| `WC_DASHBOARD_STATIC_DIR` | `dist` | Static asset directory for production build |
| `WC_LIVE_CACHE_SECONDS` | `60` | Live schedule/odds cache TTL |
| `WC_INTEL_CACHE_SECONDS` | `300` | Match/team intelligence cache TTL |
| `WC_WEATHER_CACHE_SECONDS` | `1800` | Weather forecast cache TTL |
| `ODDS_API_KEY` / `THE_ODDS_API_KEY` | unset | Enables The Odds API fallback |
| `WC_ODDS_SPORT_KEY` | `soccer_fifa_world_cup` | The Odds API sport key |
| `WC_ODDS_REGIONS` | `eu,us` | The Odds API regions |
| `WC_ODDS_MARKETS` | `h2h` | The Odds API markets |

## API Endpoints

| Endpoint | Description |
| --- | --- |
| `/api/health` | Service health check |
| `/api/live-data` | Aggregated schedule, scores, odds, weather and source status |
| `/api/match-intel?matchId=gA1` | ESPN summary-derived head-to-head and recent-form context |
| `/api/team-roster?team=arg` | Team roster data from local official snapshot or ESPN fallback |

## Interface Map

| Page | Purpose |
| --- | --- |
| 指挥台 | 比赛日入口，展示重点比赛、关注列表、临近开球、风险和数据提醒 |
| 赛程 | 小组积分榜、赛程时间线、晋级规则和逐场入口 |
| 单场 | 赛前结论、概率证据、情景模拟、阵容、天气和历史情报 |
| 球队 | 球队画像、能力对比、同组竞争、中文阵容和关注球队 |
| 市场 | 市场共识与模型观点差异，不提供投注指令 |
| 模拟 | 冠军概率、最佳第三、路径假设和敏感项说明 |
| 球员 | 金靴候选、角色权重、点球权、出场时间和球队路径 |
| 复盘 | 完赛后记录方向命中、比分 Top 6 和模型校准口径 |
| 数据源 | 数据源审计、覆盖率、更新时间、fallback 和限制说明 |

## Validation

```bash
npm run check
npm test
```

If dependencies are not installed, the dependency-free checks still work:

```bash
node --test tests/frontend/*.test.mjs
python3 -B -m unittest discover -s tests/backend
python3 -B -m py_compile server.py
```

## Deployment Notes

1. Install Node dependencies and build frontend assets with `npm run build`.
2. Deploy the repo with Python 3.10+ and run `python3 -B server.py`.
3. Configure reverse proxy/TLS externally if exposing beyond localhost.
4. Keep API keys in environment variables; do not commit `.env`.

## Data Caveats

- Live public data can change as providers update payloads.
- Team strength, form, injuries and path scores are estimated baselines.
- Weather uses city/stadium baselines until the Open-Meteo forecast window opens.
- Starting XI, late injuries and suspensions must be reviewed close to kickoff.

## License

MIT License. See [LICENSE](LICENSE).
