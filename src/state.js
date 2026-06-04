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
  if (state.groupFilter !== "all") params.set("group", state.groupFilter);
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
  state.groupFilter = params.get("group") || state.groupFilter || "all";
}

export function persistUserPrefs(state = appState) {
  localStorage.setItem("wc-dashboard-prefs", JSON.stringify({
    groupFilter: state.groupFilter,
    selectedTeam: state.selectedTeam,
  }));
}

export function restoreUserPrefs(state = appState) {
  try {
    const prefs = JSON.parse(localStorage.getItem("wc-dashboard-prefs") || "{}");
    if (prefs.groupFilter) state.groupFilter = prefs.groupFilter;
    if (prefs.selectedTeam) state.selectedTeam = prefs.selectedTeam;
  } catch {
    // Ignore invalid local state from previous app versions.
  }
}
