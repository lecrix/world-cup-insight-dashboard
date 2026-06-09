import { appState, applyRoute, persistUserPrefs, restoreUserPrefs, routeToHash, toggleFavorite } from "./state.js";
import { pages } from "./data/tournament.js";
import { loadLiveData, loadMatchIntel, loadRoster } from "./services/api.js";
import { groupStandings } from "./domain/model.js";
import { appShell } from "./components/ui.js";
import { renderPage } from "./views.js";

const root = document.querySelector("#app");
let refreshTimer = null;
let searchTimer = null;

restoreUserPrefs(appState);
applyRoute(window.location.hash || "#/overview", appState);

function render() {
  const scrolls = new Map();
  document.querySelectorAll(".team-list, .simulator-scroll-list, .sidebar, .day-tabs").forEach((el) => {
    if (el.className) scrolls.set(el.className, { top: el.scrollTop, left: el.scrollLeft });
  });

  document.documentElement.setAttribute("data-theme", appState.theme);
  root.innerHTML = appShell({
    pages: pages(),
    state: appState,
    content: renderPage(appState),
  });

  document.querySelectorAll(".team-list, .simulator-scroll-list, .sidebar, .day-tabs").forEach((el) => {
    if (el.className && scrolls.has(el.className)) {
      const pos = scrolls.get(el.className);
      el.scrollTop = pos.top;
      el.scrollLeft = pos.left;
    }
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

function updateScenario(target) {
  const key = target.dataset.scenario;
  if (!key) return;
  appState.scenario[key] = target.type === "range" || target.type === "number" ? Number(target.value) : target.value;
}

root.addEventListener("click", (event) => {
  const route = event.target.closest("[data-route]");
  const matchButton = event.target.closest("[data-match]");
  const teamButton = event.target.closest("[data-team]");
  const dateButton = event.target.closest("[data-date]");
  const refreshButton = event.target.closest("[data-refresh]");
  const favoriteMatchButton = event.target.closest("[data-favorite-match]");
  const favoriteTeamButton = event.target.closest("[data-favorite-team]");
  const themeToggle = event.target.closest("[data-theme-toggle]");
  const downloadCardButton = event.target.closest("[data-download-card]");
  const betAddButton = event.target.closest("[data-bet-add]");
  const betRemoveButton = event.target.closest("[data-bet-remove]");

  if (themeToggle) {
    appState.theme = appState.theme === "dark" ? "light" : "dark";
    persistUserPrefs(appState);
    render();
    return;
  }
  if (downloadCardButton) {
    const matchId = downloadCardButton.dataset.downloadCard;
    const match = appState.matches.find((m) => m.id === matchId);
    if (match) {
      import("./utils/canvas.js").then(({ exportMatchCardAsPng }) => {
        exportMatchCardAsPng(appState, match);
      }).catch((err) => {
        console.error("Failed to load canvas exporter", err);
      });
    }
    return;
  }
  if (route) {
    navigate(route.dataset.route);
    return;
  }
  if (favoriteMatchButton) {
    event.preventDefault();
    event.stopPropagation();
    appState.favoriteMatches = toggleFavorite(appState.favoriteMatches, favoriteMatchButton.dataset.favoriteMatch);
    updateHashOnly();
    render();
    return;
  }
  if (favoriteTeamButton) {
    event.preventDefault();
    event.stopPropagation();
    appState.favoriteTeams = toggleFavorite(appState.favoriteTeams, favoriteTeamButton.dataset.favoriteTeam);
    updateHashOnly();
    render();
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
    return;
  }
  if (betAddButton) {
    // Legacy handler — kept for backward compat
    const matchId = betAddButton.dataset.betAdd;
    const existing = appState.betting.selections.findIndex(s => s.matchId === matchId);
    if (existing >= 0) {
      appState.betting.selections = appState.betting.selections.filter((_, i) => i !== existing);
    }
    render();
    return;
  }

  // New: toggle individual odds button
  const betOptionBtn = event.target.closest("[data-bet-option]");
  if (betOptionBtn) {
    const matchId = betOptionBtn.dataset.matchId;
    const playType = betOptionBtn.dataset.playType;
    const playTypeName = betOptionBtn.dataset.playTypeName;
    const outcome = betOptionBtn.dataset.outcome;
    const odds = Number(betOptionBtn.dataset.odds);
    const modelProb = Number(betOptionBtn.dataset.modelProb);
    const key = `${matchId}-${playType}-${outcome}`;
    const idx = appState.betting.selections.findIndex(s => `${s.matchId}-${s.playType}-${s.outcome}` === key);
    if (idx >= 0) {
      appState.betting.selections = appState.betting.selections.filter((_, i) => i !== idx);
    } else {
      appState.betting.selections = [...appState.betting.selections, { matchId, playType, playTypeName, outcome, odds, modelProb }];
    }
    render();
    return;
  }

  // New: one-click adopt a recommendation plan
  const adoptBtn = event.target.closest("[data-adopt-plan]");
  if (adoptBtn) {
    appState.betting.adoptPlan = adoptBtn.dataset.adoptPlan;
    render();
    delete appState.betting.adoptPlan;
    return;
  }
  if (betRemoveButton) {
    const idx = Number(betRemoveButton.dataset.betRemove);
    appState.betting.selections = appState.betting.selections.filter((_, i) => i !== idx);
    render();
    return;
  }
});

root.addEventListener("change", (event) => {
  if (event.target.matches("[data-bench-player]")) {
    const matchId = event.target.dataset.matchId;
    const athleteId = event.target.dataset.benchPlayer;
    if (!appState.benchedPlayers[matchId]) {
      appState.benchedPlayers[matchId] = [];
    }
    const list = appState.benchedPlayers[matchId];
    if (event.target.checked) {
      // Checked means "active/available" (not benched). Remove from list.
      appState.benchedPlayers[matchId] = list.filter((id) => id !== athleteId);
    } else {
      // Unchecked means benched. Add to list.
      if (!list.includes(athleteId)) {
        appState.benchedPlayers[matchId] = [...list, athleteId];
      }
    }
    render();
    return;
  }
  if (event.target.matches("[data-group-filter]")) {
    appState.groupFilter = event.target.value;
    appState.selectedDate = "";
    updateHashOnly();
    render();
  }
  if (event.target.matches("[data-match-picker]")) {
    appState.selectedMatch = event.target.value;
    updateHashOnly();
    render();
    syncPageData();
  }
  if (event.target.matches("[data-compare-team]")) {
    appState.selectedCompareTeam = event.target.value;
    updateHashOnly();
    render();
  }
  if (event.target.matches("[data-scenario]")) {
    updateScenario(event.target);
    render();
  }
  if (event.target.matches("[data-bet-parlay]")) {
    appState.betting.parlayType = event.target.value;
    render();
  }
  if (event.target.matches("[data-bet-amount]")) {
    appState.betting.betAmount = Math.max(2, Number(event.target.value) || 2);
    render();
  }
});

root.addEventListener("input", (event) => {
  if (event.target.matches("[data-scenario]")) {
    updateScenario(event.target);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => render(), 60);
    return;
  }
  if (!event.target.matches("[data-search]")) return;
  appState.search = event.target.value;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    updateHashOnly();
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
