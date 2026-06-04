import { cityEnvironmentAliases, stadiumEnvironment } from "../data/tournament.js";
import { clamp, dateKey, dateLabel } from "../utils/format.js";

const MODEL_SAMPLE_SIZE = 50000;
const cache = new Map();

export function strength(team) {
  return (
    team.elo / 25 +
    team.form * 0.8 +
    team.attack * 0.9 +
    team.defense * 0.75 +
    team.midfield * 0.55 +
    Math.log(team.value) * 8 +
    team.depth * 0.45
  );
}

export function projectedOdds(home, away, drift = 0) {
  const diff = strength(home) - strength(away);
  const homeProb = clamp(0.41 + diff / 620, 0.18, 0.72);
  const awayProb = clamp(0.32 - diff / 650, 0.13, 0.62);
  const drawProb = clamp(1 - homeProb - awayProb, 0.18, 0.31);
  const total = homeProb + drawProb + awayProb;
  return [homeProb, drawProb, awayProb].map((prob, index) =>
    Number((1 / (prob / total) * 0.93 + drift * (index - 1)).toFixed(2))
  );
}

export function implied(odds) {
  const clean = (odds || []).map(Number).filter((value) => Number.isFinite(value) && value > 1);
  if (clean.length !== 3) return [33, 34, 33];
  const raw = clean.map((odd) => 1 / odd);
  const total = raw.reduce((sum, value) => sum + value, 0);
  return raw.map((value) => Math.round((value / total) * 100));
}

export function getTeam(teams, id) {
  return teams.find((team) => team.id === id);
}

export function liveEvent(feed, match) {
  return (feed.events || []).find((event) => event.matchId === match.id);
}

export function getOdds(feed, match, teams) {
  const live = feed.odds?.[match.id];
  if (live?.h2h) return live.h2h;
  return projectedOdds(getTeam(teams, match.home), getTeam(teams, match.away));
}

export function oddsSource(feed, match) {
  const live = feed.odds?.[match.id];
  if (live?.h2h) return live.source || feed.provider || "自动数据源";
  return "模型基线";
}

export function matchDate(feed, match) {
  const event = liveEvent(feed, match);
  const source = event?.commenceTime || feed.odds?.[match.id]?.schedule?.commenceTime || match.kickoff;
  const date = new Date(source);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function groupedMatchDays(matches, feed) {
  const map = new Map();
  matches.forEach((match) => {
    const date = matchDate(feed, match);
    const key = date ? dateKey(date) : "pending";
    map.set(key, [...(map.get(key) || []), match]);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, dayMatches]) => ({
      key,
      label: dateLabel(key),
      matches: dayMatches.sort((left, right) => (matchDate(feed, left)?.getTime() || 0) - (matchDate(feed, right)?.getTime() || 0)),
    }));
}

export function defaultDateKey(days, preferredKey = "") {
  if (preferredKey && days.some((day) => day.key === preferredKey)) return preferredKey;
  const today = dateKey(new Date());
  return days.find((day) => day.key === today)?.key || days.find((day) => day.key !== "pending" && day.key >= today)?.key || days[0]?.key || "";
}

export function matchVenue(feed, match) {
  const event = liveEvent(feed, match);
  if (!event?.venue) return match.venue;
  return [event.venue, event.city].filter(Boolean).join(" / ");
}

export function matchEnvironment(feed, match) {
  const event = liveEvent(feed, match);
  const venueKey = event?.venue || cityEnvironmentAliases[event?.city] || match.venue;
  const base = stadiumEnvironment[venueKey] || stadiumEnvironment[cityEnvironmentAliases[event?.city]] || null;
  const forecast = event?.weatherForecast;
  if (!base) return null;
  if (forecast?.status !== "live") {
    return { ...base, weatherMode: forecast?.mode || "baseline", weatherSource: forecast?.source || "历史气候基线", weatherMessage: forecast?.message };
  }
  return {
    ...base,
    temp: numberOr(forecast.temperature, base.temp),
    humidity: numberOr(forecast.humidity, base.humidity),
    apparent: numberOr(forecast.apparentTemperature, null),
    precipitationProbability: forecast.precipitationProbability,
    windSpeed: forecast.windSpeed,
    climate: `72小时预报：体感 ${forecast.apparentTemperature ?? "-"}°C，降水概率 ${forecast.precipitationProbability ?? "-"}%，风速 ${forecast.windSpeed ?? "-"}km/h`,
    weatherMode: "forecast72h",
    weatherSource: forecast.source || "Open-Meteo",
    weatherUpdatedAt: forecast.updatedAt,
    weatherMessage: forecast.message,
  };
}

function numberOr(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function previousTeamMatch(matches, feed, teamId, match) {
  const currentDate = matchDate(feed, match);
  if (!currentDate) return null;
  return matches
    .filter((item) => item.id !== match.id && (item.home === teamId || item.away === teamId))
    .map((item) => ({ item, date: matchDate(feed, item) }))
    .filter(({ date }) => date && date < currentDate)
    .sort((left, right) => right.date - left.date)[0]?.item || null;
}

export function teamTravelLoad(matches, feed, teamId, match) {
  const current = matchEnvironment(feed, match);
  const previous = previousTeamMatch(matches, feed, teamId, match);
  const previousEnv = previous ? matchEnvironment(feed, previous) : null;
  if (!current) return { score: 0.04, label: "球场环境待同步" };
  if (!previousEnv) {
    const baselineStress = heatHumidityStress(current) + altitudeStress(current) * 0.7;
    return {
      score: clamp(baselineStress, 0.02, 0.18),
      label: `${current.name}：${current.climate}，海拔 ${current.altitude}m，${current.temp}°C / 湿度 ${current.humidity}%`,
    };
  }
  const km = haversineKm(previousEnv, current);
  const altitudeChange = Math.abs(current.altitude - previousEnv.altitude);
  const tempChange = Math.abs(current.temp - previousEnv.temp);
  const humidityChange = Math.abs(current.humidity - previousEnv.humidity);
  const score = clamp(km / 9000 + altitudeChange / 9000 + tempChange / 90 + humidityChange / 280 + heatHumidityStress(current) + altitudeStress(current), 0.02, 0.36);
  return {
    score,
    label: `${previousEnv.name} → ${current.name}，约 ${Math.round(km)}km；海拔差 ${Math.round(altitudeChange)}m；温差 ${tempChange.toFixed(1)}°C`,
  };
}

export function matchModel({ teams, matches, feed, rosters, intel }, match) {
  const odds = getOdds(feed, match, teams);
  const key = `${match.id}|${odds.join("/")}|${feed.lastUpdated || "base"}|${intel[match.id]?.lastUpdated || "none"}`;
  if (cache.has(key)) return cache.get(key);
  const home = getTeam(teams, match.home);
  const away = getTeam(teams, match.away);
  const context = matchContext({ teams, matches, feed, rosters, intel }, match, home, away);
  const sim = monteCarloMatch(match, context);
  const probs = sim.probs;
  const market = implied(odds);
  const marketGap = Math.max(...probs.map((prob, index) => Math.abs(prob - market[index])));
  const confidence = Math.round(clamp(Math.abs(probs[0] - probs[2]) * 1.35 + marketGap * 0.55 + 48 - sim.volatility * 9, 42, 88));
  const result = {
    probs,
    goals: sim.averageGoals,
    totalGoals: sim.averageGoals[0] + sim.averageGoals[1],
    confidence,
    risk: confidence > 70 ? "低" : confidence > 58 ? "中" : "高",
    over25: sim.over25,
    btts: sim.btts,
    sim,
    context,
  };
  cache.set(key, result);
  if (cache.size > 300) cache.delete(cache.keys().next().value);
  return result;
}

export function matchContext(app, match, home, away) {
  const diff = strength(home) - strength(away);
  const matchIntel = app.intel?.[match.id];
  const homeRecent = recentFormScore(matchIntel?.forms?.[home.id]);
  const awayRecent = recentFormScore(matchIntel?.forms?.[away.id]);
  const homeRoster = rosterAvailabilityScore(app.rosters?.[home.id]);
  const awayRoster = rosterAvailabilityScore(app.rosters?.[away.id]);
  const env = matchEnvironment(app.feed, match);
  const homeTravel = teamTravelLoad(app.matches, app.feed, home.id, match);
  const awayTravel = teamTravelLoad(app.matches, app.feed, away.id, match);
  const homeInjury = injuryLoad(home.injuries);
  const awayInjury = injuryLoad(away.injuries);
  const restEdge = ((match.rest?.[0] || 4) - (match.rest?.[1] || 4)) * 0.025;
  const travelEdge = clamp((awayTravel.score - homeTravel.score) * 0.55, -0.12, 0.12);
  const recentEdge = clamp((homeRecent.score - awayRecent.score) * 0.035, -0.14, 0.14);
  const rosterEdge = clamp((homeRoster.score - awayRoster.score) * 0.08, -0.1, 0.1);
  const h2hEdge = h2hAdjustment(matchIntel);
  const weatherSlowdown = clamp((/湿度|海拔|偏慢|消耗|天气/.test(match.weather || "") ? 0.04 : 0.015) + heatHumidityStress(env) + altitudeStress(env) * 0.75, 0.015, 0.2);
  const midfieldEdge = (home.midfield - away.midfield) / 240;
  const depthEdge = (home.depth - away.depth) / 260;
  const keeperEdge = (home.keeper - away.keeper) / 300;
  const refereeChaos = /严|判罚|牌/.test(match.referee || "") ? 0.04 : 0.02;
  const homeLambda = clamp(home.xg * (away.xga + 0.72) / 1.72 + diff / 920 + midfieldEdge + depthEdge * 0.35 + restEdge - homeInjury * 0.28 - weatherSlowdown + recentEdge + h2hEdge * 0.5 + rosterEdge + travelEdge, 0.35, 3.25);
  const awayLambda = clamp(away.xg * (home.xga + 0.72) / 1.72 - diff / 980 - midfieldEdge * 0.55 - keeperEdge * 0.22 - restEdge - awayInjury * 0.28 - weatherSlowdown - recentEdge - h2hEdge * 0.5 - rosterEdge - travelEdge, 0.3, 3.0);
  const volatility = clamp(0.48 + Math.abs(home.form - away.form) / 220 + (100 - Math.min(home.depth, away.depth)) / 260 + Math.max(homeInjury, awayInjury) * 0.36 + (2 - Math.min(homeRoster.score, awayRoster.score)) * 0.06 + Math.max(homeTravel.score, awayTravel.score) * 0.35 + (matchIntel?.status === "live" ? 0 : 0.06) + refereeChaos, 0.42, 0.9);
  return {
    home,
    away,
    homeLambda,
    awayLambda,
    volatility,
    sampleSize: MODEL_SAMPLE_SIZE,
    factors: [
      ["状态", `${home.name} ${home.form} / ${away.name} ${away.form}`, home.form - away.form],
      ["攻防", `${home.name} xG ${home.xg} xGA ${home.xga}；${away.name} xG ${away.xg} xGA ${away.xga}`, diff],
      ["近期", `${home.name} ${homeRecent.score.toFixed(2)}；${away.name} ${awayRecent.score.toFixed(2)}`, recentEdge],
      ["旅途", `${home.name}：${homeTravel.label}。${away.name}：${awayTravel.label}`, travelEdge],
      ["环境", env ? `${env.name}，${env.climate}` : match.weather, -weatherSlowdown],
      ["名单", `${home.name} ${homeRoster.label}；${away.name} ${awayRoster.label}`, rosterEdge],
    ],
  };
}

export function upsetRisk(app, match, model = matchModel(app, match)) {
  const market = implied(getOdds(app.feed, match, app.teams));
  const home = getTeam(app.teams, match.home);
  const away = getTeam(app.teams, match.away);
  const favoriteIndex = market[0] >= market[2] ? 0 : 2;
  const favorite = favoriteIndex === 0 ? home : away;
  const underdog = favoriteIndex === 0 ? away : home;
  const favoriteOverpriced = clamp((market[favoriteIndex] - model.probs[favoriteIndex]) * 1.7, 0, 32);
  const underdogLive = clamp((model.probs[favoriteIndex === 0 ? 2 : 0] - 22) * 1.1, 0, 22);
  const drawTrap = clamp((model.probs[1] - 24) * 1.2, 0, 18);
  const heat = clamp((match.marketHeat - 68) * 0.55, 0, 14);
  const score = Math.round(clamp(favoriteOverpriced + underdogLive + drawTrap + heat + (model.context.volatility - 0.5) * 38, 0, 100));
  return {
    score,
    tone: score >= 55 ? "bad" : score >= 35 ? "warn" : "good",
    level: score >= 75 ? "强烈预警" : score >= 55 ? "高风险" : score >= 35 ? "有苗头" : "常规",
    favorite,
    underdog,
    reasons: [
      favoriteOverpriced >= 8 ? `${favorite.name}市场热度高于模型` : "",
      underdogLive >= 6 ? `${underdog.name}模型底盘不低` : "",
      drawTrap >= 5 ? `平局权重 ${model.probs[1]}% 偏高` : "",
      heat >= 5 ? "市场关注度较高" : "",
    ].filter(Boolean),
  };
}

export function largestGap(app, match, model = matchModel(app, match)) {
  const home = getTeam(app.teams, match.home);
  const away = getTeam(app.teams, match.away);
  const market = implied(getOdds(app.feed, match, app.teams));
  const labels = [home.name, "平局", away.name];
  const gaps = model.probs.map((prob, index) => prob - market[index]);
  const maxIndex = gaps.reduce((best, value, index) => (Math.abs(value) > Math.abs(gaps[best]) ? index : best), 0);
  return { labels, gaps, maxIndex, gapAbs: Math.abs(gaps[maxIndex]), market };
}

export function groupStandings(app) {
  const groups = Array.from(new Set(app.teams.map((team) => team.group))).sort();
  return groups.map((group) => {
    const rows = app.teams
      .filter((team) => team.group === group)
      .map((team) => {
        const score = cupScore(team) + team.path * 0.35;
        return { team, score };
      })
      .sort((left, right) => right.score - left.score)
      .map((row, index) => ({
        ...row,
        rank: index + 1,
        played: 0,
        win: 0,
        draw: 0,
        loss: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
        qualify: Math.round(clamp(88 - index * 17 + (row.score - 72) * 0.35, 28, 92)),
      }));
    return { group, rows };
  });
}

export function championshipChances(teams) {
  const ranked = [...teams].sort((a, b) => cupScore(b) - cupScore(a));
  const scores = ranked.map(cupScore);
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const weights = ranked.map((team) => Math.exp((cupScore(team) - mean) / 4.8));
  const total = weights.reduce((sum, value) => sum + value, 0);
  const raw = ranked.map((team, index) => {
    const chance = (weights[index] / total) * 100;
    return { team, chance, floor: Math.floor(chance), fraction: chance % 1 };
  });
  let remainder = 100 - raw.reduce((sum, item) => sum + item.floor, 0);
  raw.sort((a, b) => b.fraction - a.fraction).forEach((item) => {
    if (remainder > 0) {
      item.floor += 1;
      remainder -= 1;
    }
  });
  return raw.sort((a, b) => b.floor - a.floor).map((item) => ({ team: item.team, chance: item.floor }));
}

function cupScore(team) {
  return team.path * 0.34 + team.form * 0.2 + team.attack * 0.18 + team.defense * 0.18 + team.depth * 0.1;
}

function recentFormScore(events) {
  if (!events?.length) return { score: 1.5, source: "未返回，按中性处理" };
  const weights = [1, 0.86, 0.72, 0.58, 0.44, 0.3];
  let weighted = 0;
  let total = 0;
  events.slice(0, 6).forEach((event, index) => {
    const weight = weights[index] || 0.25;
    const result = event.result === "W" ? 3 : event.result === "D" ? 1 : 0;
    weighted += result * weight;
    total += weight;
  });
  return { score: total ? weighted / total : 1.5, source: `已同步近 ${events.length} 场` };
}

function h2hAdjustment(intel) {
  if (intel?.status !== "live" || !intel.headToHead?.length) return 0;
  let edge = 0;
  intel.headToHead.slice(0, 8).forEach((game, index) => {
    edge += (game.result === "W" ? 1 : game.result === "L" ? -1 : 0) / (index + 1);
  });
  return clamp(edge * 0.035 * clamp(intel.headToHead.length / 6, 0.15, 0.75), -0.09, 0.09);
}

function rosterAvailabilityScore(roster) {
  if (!roster || roster.status !== "live") return { score: 0.82, label: "名单未返回" };
  const total = roster.athletes?.length || 0;
  const unavailable = roster.athletes?.filter((player) => player.statusType && player.statusType !== "active").length || 0;
  const injured = roster.athletes?.filter((player) => player.injuries?.length).length || 0;
  return { score: clamp(1 - (unavailable * 0.035 + injured * 0.025), 0.55, 1), label: `${total} 人名单，异常 ${unavailable + injured} 项` };
}

function injuryLoad(text = "") {
  if (/暂无|满员|无核心/.test(text)) return 0.05;
  if (/核心|主力|缺阵|伤停/.test(text)) return 0.55;
  if (/轻伤|观察|恢复|疲劳/.test(text)) return 0.28;
  return 0.18;
}

function monteCarloMatch(match, context) {
  const rng = seededRandom(hashString(`${match.id}-${context.homeLambda}-${context.awayLambda}`));
  const counts = { home: 0, draw: 0, away: 0, over25: 0, btts: 0 };
  const scoreCounts = new Map();
  let totalHome = 0;
  let totalAway = 0;
  for (let index = 0; index < context.sampleSize; index += 1) {
    const scenario = 1 + normalish(rng) * context.volatility * 0.18;
    const homeGoals = poissonSample(clamp(context.homeLambda * scenario * (1 + normalish(rng) * context.volatility * 0.16), 0.15, 4.6), rng);
    const awayGoals = poissonSample(clamp(context.awayLambda * scenario * (1 + normalish(rng) * context.volatility * 0.16), 0.12, 4.4), rng);
    totalHome += homeGoals;
    totalAway += awayGoals;
    if (homeGoals > awayGoals) counts.home += 1;
    else if (homeGoals === awayGoals) counts.draw += 1;
    else counts.away += 1;
    if (homeGoals + awayGoals > 2.5) counts.over25 += 1;
    if (homeGoals > 0 && awayGoals > 0) counts.btts += 1;
    const key = `${homeGoals}-${awayGoals}`;
    scoreCounts.set(key, (scoreCounts.get(key) || 0) + 1);
  }
  const rawProbs = [counts.home, counts.draw, counts.away].map((value) => (value / context.sampleSize) * 100);
  return {
    sampleSize: context.sampleSize,
    probs: normalizePercentages(rawProbs),
    averageGoals: [Number((totalHome / context.sampleSize).toFixed(2)), Number((totalAway / context.sampleSize).toFixed(2))],
    over25: Math.round((counts.over25 / context.sampleSize) * 100),
    btts: Math.round((counts.btts / context.sampleSize) * 100),
    volatility: context.volatility,
    scorelines: Array.from(scoreCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([score, count]) => ({ score, pct: Number(((count / context.sampleSize) * 100).toFixed(1)) })),
  };
}

function normalizePercentages(values) {
  const rows = values.map((value, index) => ({
    index,
    floor: Math.floor(value),
    fraction: value - Math.floor(value),
  }));
  let remainder = 100 - rows.reduce((sum, row) => sum + row.floor, 0);
  rows.sort((a, b) => b.fraction - a.fraction).forEach((row) => {
    if (remainder > 0) {
      row.floor += 1;
      remainder -= 1;
    }
  });
  return rows.sort((a, b) => a.index - b.index).map((row) => row.floor);
}

function heatHumidityStress(env) {
  if (!env) return 0;
  return clamp((env.temp - 24) / 18, 0, 1) * 0.08 + clamp((env.humidity - 60) / 25, 0, 1) * 0.05;
}

function altitudeStress(env) {
  if (!env) return 0;
  return clamp((env.altitude - 500) / 2200, 0, 1) * 0.11;
}

function haversineKm(a, b) {
  const toRad = (value) => (value * Math.PI) / 180;
  const radius = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(h));
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  return function next() {
    seed += 0x6d2b79f5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalish(rng) {
  return (rng() + rng() + rng() + rng() - 2) / 1.2;
}

function poissonSample(lambda, rng) {
  const limit = Math.exp(-lambda);
  let product = 1;
  let count = 0;
  do {
    count += 1;
    product *= rng();
  } while (product > limit && count < 10);
  return count - 1;
}
