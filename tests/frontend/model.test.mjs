import assert from "node:assert/strict";
import test from "node:test";
import { createMatches, createTeams } from "../../src/data/tournament.js";
import { championshipChances, getOdds, groupedMatchDays, implied, matchModel, projectedOdds } from "../../src/domain/model.js";
import { createFeed } from "../../src/services/api.js";

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
