export function createFeed() {
  return {
    provider: "local",
    status: "loading",
    message: "正在连接自动数据源",
    lastUpdated: null,
    nextRefreshSeconds: 60,
    odds: {},
    events: [],
    warnings: [],
    sourceStatus: [],
  };
}

export async function fetchJson(url) {
  const response = await fetch(`${url}${url.includes("?") ? "&" : "?"}ts=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function loadLiveData() {
  const payload = await fetchJson("/api/live-data");
  return {
    ...createFeed(),
    ...payload,
    odds: payload.odds || {},
    events: payload.events || [],
    warnings: payload.warnings || [],
    sourceStatus: payload.sourceStatus || buildSourceStatus(payload),
  };
}

export async function loadRoster(teamId) {
  return fetchJson(`/api/team-roster?team=${encodeURIComponent(teamId)}`);
}

export async function loadMatchIntel(matchId) {
  return fetchJson(`/api/match-intel?matchId=${encodeURIComponent(matchId)}`);
}

function buildSourceStatus(payload) {
  return [
    {
      id: "schedule",
      label: "赛程/赛果",
      status: payload.events?.length ? payload.status : "estimated",
      detail: payload.events?.length ? `${payload.events.length} 场已映射` : "使用本地小组赛骨架",
    },
    {
      id: "odds",
      label: "市场赔率",
      status: Object.keys(payload.odds || {}).length ? "live" : "estimated",
      detail: Object.keys(payload.odds || {}).length ? `${Object.keys(payload.odds).length} 场带赔率` : "使用模型基线赔率",
    },
  ];
}
