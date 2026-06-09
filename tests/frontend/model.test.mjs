import assert from "node:assert/strict";
import test from "node:test";
import { createMatches, createTeams, pages } from "../../src/data/tournament.js";
import * as modelModule from "../../src/domain/model.js";
import { createFeed } from "../../src/services/api.js";
import * as stateModule from "../../src/state.js";
import { renderPage } from "../../src/views.js";

const {
  championshipChances,
  getOdds,
  groupedMatchDays,
  implied,
  matchModel,
  projectedOdds,
} = modelModule;

const teams = createTeams();
const matches = createMatches(teams);
const app = {
  teams,
  matches,
  feed: createFeed(),
  rosters: {},
  intel: {},
};

test("creates the full 48-team and 72-match group-stage skeleton", () => {
  assert.equal(teams.length, 48);
  assert.equal(matches.length, 72);
  assert.deepEqual([...new Set(teams.map((team) => team.group))], ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]);
});

test("normalizes implied probability from decimal odds", () => {
  const result = implied([2, 3.5, 4]);
  assert.equal(result.reduce((sum, value) => sum + value, 0), 100);
  assert.ok(result[0] > result[2]);
});

test("falls back to projected model odds when live odds are missing", () => {
  const match = matches[0];
  const odds = getOdds(app.feed, match, teams);
  assert.deepEqual(odds, projectedOdds(teams.find((team) => team.id === match.home), teams.find((team) => team.id === match.away)));
});

test("runs deterministic match model with sane percentages", () => {
  const model = matchModel(app, matches[0]);
  assert.equal(model.probs.reduce((sum, value) => sum + value, 0), 100);
  assert.ok(model.goals[0] >= 0);
  assert.ok(model.sim.scorelines.length > 0);
});

test("groups matches by competition day", () => {
  const days = groupedMatchDays(matches, createFeed());
  assert.ok(days.length >= 12);
  assert.equal(days.reduce((sum, day) => sum + day.matches.length, 0), 72);
});

test("championship chances are normalized to 100 percent", () => {
  const rows = championshipChances(teams);
  assert.equal(rows.reduce((sum, row) => sum + row.chance, 0), 100);
  assert.equal(rows.length, 48);
});

test("navigation labels include the public analysis workflow and betting assistant", () => {
  assert.deepEqual(pages().map((page) => page[1]), ["指挥台", "赛程", "单场", "球队", "市场", "竞彩", "模拟", "球员", "复盘", "数据源"]);
  const routed = { page: "overview", selectedDate: "", selectedMatch: "", selectedTeam: "", selectedCompareTeam: "", groupFilter: "all", search: "" };
  stateModule.applyRoute("#/betting?match=gA1", routed);
  assert.equal(routed.page, "betting");
  assert.equal(routed.selectedMatch, "gA1");
});

test("toggles favorite ids without duplicates", () => {
  assert.equal(typeof stateModule.toggleFavorite, "function");
  const { toggleFavorite } = stateModule;
  assert.deepEqual(toggleFavorite(["gA1"], "gA1"), []);
  assert.deepEqual(toggleFavorite(["gA1"], "gA2"), ["gA1", "gA2"]);
});

test("scenario projection adjusts probabilities while preserving a 100 percent total", () => {
  assert.equal(typeof modelModule.scenarioProjection, "function");
  const model = matchModel(app, matches[0]);
  const { scenarioProjection } = modelModule;
  const adjusted = scenarioProjection(model, { homeForm: 8, awayAvailability: -8, weatherStress: 6, marketMode: "model" });
  assert.equal(adjusted.probs.reduce((sum, value) => sum + value, 0), 100);
  assert.ok(adjusted.probs[0] > model.probs[0]);
  assert.ok(adjusted.notes.length >= 3);
});

test("review metrics summarize completed match calibration", () => {
  assert.equal(typeof modelModule.reviewMetrics, "function");
  const { reviewMetrics } = modelModule;
  const completed = [{ matchId: matches[0].id, homeScore: 2, awayScore: 1, statusDescription: "完赛" }];
  const metrics = reviewMetrics(app, completed);
  assert.equal(metrics.completed, 1);
  assert.equal(metrics.directionEvaluated, 1);
  assert.ok(metrics.rows[0].directionLabel);
});

test("source audit rows expose status, coverage and fallback text", () => {
  assert.equal(typeof modelModule.sourceAuditRows, "function");
  const { sourceAuditRows } = modelModule;
  const rows = sourceAuditRows(app.feed, teams, matches);
  assert.ok(rows.length >= 5);
  assert.ok(rows.every((row) => row.name && row.coverage && row.fallback));
});

test("betting page uses match model expected goals in single analysis", () => {
  const match = matches[0];
  const model = matchModel(app, match);
  const state = {
    ...app,
    page: "betting",
    selectedDate: modelModule.matchDate(app.feed, match).toISOString().slice(0, 10),
    selectedMatch: match.id,
    selectedTeam: "arg",
    selectedCompareTeam: "",
    groupFilter: "all",
    search: "",
    favoriteMatches: [],
    favoriteTeams: [],
    scenario: {
      homeForm: 0,
      awayAvailability: 0,
      weatherStress: 0,
      marketMode: "model",
      weightElo: 1,
      weightForm: 1,
      weightRoster: 1,
      weightWeather: 1,
    },
    betting: { selections: [], parlayType: "2串1", betAmount: 2, lotteryOdds: {} },
  };

  const html = renderPage(state);

  assert.match(html, new RegExp(`期望进球 ${model.goals[0].toFixed(2)} : ${model.goals[1].toFixed(2)}`));
});

test("review page shows an empty state before real completed matches exist", () => {
  const state = {
    ...app,
    page: "review",
    selectedDate: "",
    selectedMatch: matches[0].id,
    selectedTeam: "arg",
    selectedCompareTeam: "",
    groupFilter: "all",
    search: "",
    favoriteMatches: [],
    favoriteTeams: [],
    scenario: {
      homeForm: 0,
      awayAvailability: 0,
      weatherStress: 0,
      marketMode: "model",
      weightElo: 1,
      weightForm: 1,
      weightRoster: 1,
      weightWeather: 1,
    },
    betting: { selections: [], parlayType: "2串1", betAmount: 2, lotteryOdds: {} },
  };

  const html = renderPage(state);

  assert.match(html, /暂无真实完赛数据/);
  assert.doesNotMatch(html, /无完赛，已载入 5 场仿真测试样例/);
});
