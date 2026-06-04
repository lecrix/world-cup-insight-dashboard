import { appState, applyRoute, persistUserPrefs, restoreUserPrefs, routeToHash } from "./state.js";
import { pages } from "./data/tournament.js";
import { loadLiveData, loadMatchIntel, loadRoster } from "./services/api.js";
import { appShell } from "./components/ui.js";
import { renderPage } from "./views.js";

const root = document.querySelector("#app");
let refreshTimer = null;
let searchTimer = null;

restoreUserPrefs(appState);
applyRoute(window.location.hash || "#/overview", appState);

function render() {
  root.innerHTML = appShell({
    pages: pages(),
    state: appState,
    content: renderPage(appState),
  });
}

function navigate(page) {
  appState.page = page;
  appState.search = "";
  history.replaceState(null, "", routeToHash(appState));
  render();
  syncPageData();
}

async function refreshFeed({ rerender = true } = {}) {
  appState.loading.feed = true;
  try {
    appState.feed = await loadLiveData();
    appState.lastError = "";
  } catch (error) {
    appState.feed = {
      ...appState.feed,
      status: "error",
      message: `自动数据接口暂不可用：${error.message}`,
      odds: {},
      events: [],
    };
    appState.lastError = error.message;
  } finally {
    appState.loading.feed = false;
  }
  scheduleRefresh();
  if (rerender) render();
  syncPageData();
}

function scheduleRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  const seconds = Number(appState.feed.nextRefreshSeconds) || 60;
  refreshTimer = setInterval(() => refreshFeed({ rerender: true }), seconds * 1000);
}

async function ensureRoster(teamId) {
  if (!teamId || appState.rosters[teamId]?.status === "live" || appState.loading.roster[teamId]) return;
  appState.loading.roster[teamId] = true;
  try {
    appState.rosters[teamId] = await loadRoster(teamId);
  } catch (error) {
    appState.rosters[teamId] = { status: "error", message: `名单同步失败：${error.message}`, athletes: [] };
  } finally {
    appState.loading.roster[teamId] = false;
  }
  if (appState.page === "teams" || appState.page === "match") render();
}

async function ensureMatchIntel(matchId) {
  if (!matchId || appState.intel[matchId]?.status === "live" || appState.loading.intel[matchId]) return;
  appState.loading.intel[matchId] = true;
  try {
    appState.intel[matchId] = await loadMatchIntel(matchId);
  } catch (error) {
    appState.intel[matchId] = { status: "error", message: `比赛情报同步失败：${error.message}` };
  } finally {
    appState.loading.intel[matchId] = false;
  }
  if (appState.page === "match") render();
}

function syncPageData() {
  if (appState.page === "teams") ensureRoster(appState.selectedTeam);
  if (appState.page === "match") {
    const match = appState.matches.find((item) => item.id === appState.selectedMatch);
    ensureMatchIntel(appState.selectedMatch);
    if (match) {
      ensureRoster(match.home);
      ensureRoster(match.away);
    }
  }
}

function updateHashOnly() {
  persistUserPrefs(appState);
  history.replaceState(null, "", routeToHash(appState));
}

root.addEventListener("click", (event) => {
  const route = event.target.closest("[data-route]");
  const matchButton = event.target.closest("[data-match]");
  const teamButton = event.target.closest("[data-team]");
  const dateButton = event.target.closest("[data-date]");
  const refreshButton = event.target.closest("[data-refresh]");

  if (route) {
    navigate(route.dataset.route);
    return;
  }
  if (matchButton) {
    appState.selectedMatch = matchButton.dataset.match;
    navigate("match");
    return;
  }
  if (teamButton) {
    appState.selectedTeam = teamButton.dataset.team;
    navigate("teams");
    return;
  }
  if (dateButton) {
    appState.selectedDate = dateButton.dataset.date;
    updateHashOnly();
    render();
    return;
  }
  if (refreshButton) {
    refreshFeed({ rerender: true });
  }
});

root.addEventListener("change", (event) => {
  if (event.target.matches("[data-group-filter]")) {
    appState.groupFilter = event.target.value;
    appState.selectedDate = "";
    updateHashOnly();
    render();
  }
});

root.addEventListener("input", (event) => {
  if (!event.target.matches("[data-search]")) return;
  appState.search = event.target.value;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    render();
    const input = root.querySelector("[data-search]");
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, 120);
});

window.addEventListener("hashchange", () => {
  applyRoute(window.location.hash, appState);
  render();
  syncPageData();
});

render();
refreshFeed({ rerender: true });
