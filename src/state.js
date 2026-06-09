import { createMatches, createTeams } from "./data/tournament.js";
import { createFeed } from "./services/api.js";

const teams = createTeams();

export const appState = {
  page: "overview",
  selectedDate: "",
  selectedMatch: "gA1",
  selectedTeam: "arg",
  selectedCompareTeam: "",
  groupFilter: "all",
  search: "",
  favoriteMatches: [],
  favoriteTeams: [],
  theme: "dark",
  benchedPlayers: {}, // Format: { matchId: [athleteId, ...] }
  scenario: {
    homeForm: 0,
    awayAvailability: 0,
    weatherStress: 0,
    marketMode: "model",
    // Sandbox tuning params
    weightElo: 1.0,
    weightForm: 1.0,
    weightRoster: 1.0,
    weightWeather: 1.0,
  },
  // 竞彩投注状态
  betting: {
    selections: [],      // [{ matchId, playType, option, odds }]
    parlayType: "2串1",
    betAmount: 2,
    optimizerMode: "ev", // ev | kelly | manual
    lotteryOdds: {},     // { matchId: { spf: {h,d,a}, rqspf: {h,d,a,handicap}, ... } }
  },
  teams,
  matches: createMatches(teams),
  feed: createFeed(),
  rosters: {},
  intel: {},
  loading: {
    feed: false,
    roster: {},
    intel: {},
  },
  lastError: "",
};

export function routeToHash(state = appState) {
  const params = new URLSearchParams();
  if (state.selectedDate) params.set("date", state.selectedDate);
  if (state.selectedMatch) params.set("match", state.selectedMatch);
  if (state.selectedTeam) params.set("team", state.selectedTeam);
  if (state.selectedCompareTeam) params.set("compare", state.selectedCompareTeam);
  if (state.groupFilter !== "all") params.set("group", state.groupFilter);
  if (state.search) params.set("q", state.search);
  return `#/${state.page}${params.toString() ? `?${params}` : ""}`;
}

export function applyRoute(hash = window.location.hash, state = appState) {
  const raw = hash.replace(/^#\/?/, "");
  const [page = "overview", query = ""] = raw.split("?");
  const allowed = new Set(["overview", "matches", "match", "teams", "simulation", "golden", "market", "review", "sources"]);
  state.page = allowed.has(page) ? page : "overview";
  const params = new URLSearchParams(query);
  state.selectedDate = params.get("date") || state.selectedDate;
  state.selectedMatch = params.get("match") || state.selectedMatch;
  state.selectedTeam = params.get("team") || state.selectedTeam;
  state.selectedCompareTeam = params.get("compare") || state.selectedCompareTeam;
  state.groupFilter = params.get("group") || state.groupFilter || "all";
  state.search = params.get("q") || state.search || "";
}

export function persistUserPrefs(state = appState) {
  localStorage.setItem("wc-dashboard-prefs", JSON.stringify({
    groupFilter: state.groupFilter,
    selectedTeam: state.selectedTeam,
    favoriteMatches: state.favoriteMatches,
    favoriteTeams: state.favoriteTeams,
    theme: state.theme,
  }));
}

export function restoreUserPrefs(state = appState) {
  try {
    const prefs = JSON.parse(localStorage.getItem("wc-dashboard-prefs") || "{}");
    if (prefs.groupFilter) state.groupFilter = prefs.groupFilter;
    if (prefs.selectedTeam) state.selectedTeam = prefs.selectedTeam;
    if (Array.isArray(prefs.favoriteMatches)) state.favoriteMatches = prefs.favoriteMatches;
    if (Array.isArray(prefs.favoriteTeams)) state.favoriteTeams = prefs.favoriteTeams;
    state.theme = prefs.theme || "dark";
  } catch {
    state.theme = "dark";
  }
}

export function toggleFavorite(list = [], id) {
  if (!id) return [...list];
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}
