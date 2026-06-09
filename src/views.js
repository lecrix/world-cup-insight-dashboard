import { goldenCandidates } from "./data/tournament.js";
import {
  PLAY_TYPES,
  PARLAY_TYPES,
  scoreProbabilities,
  totalGoalsProbabilities,
  halfTimeFullTime,
  handicapProbabilities,
  calculateParlayReturn,
  expectedValue,
  kellyFraction,
  confidenceRating,
  findValueBets,
  generateParlayRecommendations,
  generateBettingSummary,
} from "./domain/betting.js";
import {
  championshipChances,
  defaultDateKey,
  getOdds,
  getTeam,
  cupScore,
  groupStandings,
  groupedMatchDays,
  implied,
  largestGap,
  liveEvent,
  matchDate,
  matchEnvironment,
  matchModel,
  matchVenue,
  oddsSource,
  reviewMetrics,
  scenarioProjection,
  sourceAuditRows,
  upsetRisk,
} from "./domain/model.js";
import { dateLabel, formatTime, normalizeSearch, safeText, signed } from "./utils/format.js";
import { icon } from "./utils/icons.js";
import { gapChip, groupFilter, metric, panel, progress, searchBox, statusDot, topbar } from "./components/ui.js";

export function renderPage(state) {
  if (state.page === "matches") return renderMatches(state);
  if (state.page === "match") return renderMatch(state);
  if (state.page === "teams") return renderTeams(state);
  if (state.page === "simulation") return renderSimulation(state);
  if (state.page === "golden") return renderGolden(state);
  if (state.page === "market") return renderMarket(state);
  if (state.page === "betting") return renderBetting(state);
  if (state.page === "review") return renderReview(state);
  if (state.page === "sources") return renderSources(state);
  return renderOverview(state);
}

function groups(state) {
  return Array.from(new Set(state.teams.map((team) => team.group))).sort();
}

function filteredTeams(state) {
  const query = normalizeSearch(state.search);
  return state.teams.filter((team) =>
    (state.groupFilter === "all" || team.group === state.groupFilter) &&
    (!query || `${team.name} ${team.id} ${team.stars.join(" ")}`.toLowerCase().includes(query))
  );
}

function filteredMatches(state) {
  const query = normalizeSearch(state.search);
  return state.matches.filter((match) => {
    const home = getTeam(state.teams, match.home);
    const away = getTeam(state.teams, match.away);
    return (state.groupFilter === "all" || match.group === state.groupFilter) &&
      (!query || `${home.name} ${away.name} ${match.group}`.toLowerCase().includes(query));
  });
}

function renderOverview(state) {
  const days = groupedMatchDays(state.matches, state.feed);
  const selectedDate = defaultDateKey(days, state.selectedDate);
  state.selectedDate = selectedDate;
  const selectedDay = days.find((day) => day.key === selectedDate) || days[0] || { matches: [], label: "待定" };
  const rows = selectedDay.matches.map((match) => {
    const model = matchModel(state, match);
    return { match, model, upset: upsetRisk(state, match, model), gap: largestGap(state, match, model) };
  });
  const topGap = [...rows].sort((a, b) => b.gap.gapAbs - a.gap.gapAbs)[0];
  const topRisk = [...rows].sort((a, b) => b.upset.score - a.upset.score)[0];
  const avgConfidence = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.model.confidence, 0) / rows.length) : 0;
  const valueSpots = rows.filter((row) => row.gap.gapAbs >= 5).length;
  const favorites = favoriteMatches(state);
  const alerts = dataAlerts(state);
  return `
    ${topbar({
      kicker: "比赛日指挥台",
      title: "先处理今天最需要关注的比赛",
      subtitle: "聚合临近开球、关注列表、模型倾向、市场共识分歧和数据源状态；公开分享时只呈现证据，不输出投注指令。",
      actions: `<button class="action" data-refresh>${icon("refresh")}刷新数据</button>`,
    })}
    <section class="command-grid">
      ${metric("当日比赛", rows.length, `全量 ${state.matches.length} 场`, "good")}
      ${metric("关注", favorites.length, "比赛 / 球队本地保存", favorites.length ? "good" : "warn")}
      ${metric("模型分歧", valueSpots, "模型与市场差值 >= 5%", "warn")}
      ${metric("平均置信", `${avgConfidence}%`, "仅代表模型集中度", "good")}
    </section>
    ${dayTabs(days, selectedDate)}
    <section class="dashboard-grid">
      ${panel("重点比赛", `${selectedDay.label} / 点击进入单场`, rows.map((row) => matchCard(state, row.match, row.model, row.upset)).join("") || empty("当前日期暂无比赛"), "span-2")}
      ${panel("我的关注", favorites.length ? "本机保存" : "尚未关注", favoriteOverview(state, favorites), "")}
      ${panel("临近开球", "按当前赛程排序", kickoffAlerts(state, rows), "")}
      ${panel("最大市场分歧", topGap ? `${teamLine(state, topGap.match)}` : "暂无", topGap ? gapDetail(state, topGap.match, topGap.model, topGap.gap) : empty("等待赔率或模型数据"), "")}
      ${panel("风险雷达", topRisk ? `${teamLine(state, topRisk.match)}` : "暂无", topRisk ? riskDetail(topRisk.upset) : empty("当前日期暂无风险项"), "")}
      ${panel("数据提醒", alerts.length ? `${alerts.length} 项需留意` : "当前链路稳定", alertList(alerts), "span-2")}
      ${panel("数据状态", "上线可解释性", sourceList(state), "span-2")}
    </section>
  `;
}

function renderMatches(state) {
  const standings = groupStandings(state).filter((group) => state.groupFilter === "all" || group.group === state.groupFilter);
  const matches = filteredMatches(state);
  return `
    ${topbar({
      kicker: "赛程 / 小组",
      title: "小组积分榜、比赛时间线与出线规则",
      subtitle: "把 12 个小组的晋级区、当前赛程和逐场入口放在同一页，适合快速浏览和分享。",
      actions: `${groupFilter(state.groupFilter, groups(state))}${searchBox(state.search, "搜索球队")}`,
    })}
    <section class="command-grid">
      ${metric("小组", standings.length, state.groupFilter === "all" ? "全部小组" : `${state.groupFilter} 组`, "good")}
      ${metric("比赛", matches.length, "筛选后场次", "good")}
      ${metric("直接晋级", "24 队", "每组前二", "good")}
      ${metric("最佳第三", "8 队", "12 个第三名竞争", "warn")}
    </section>
    <section class="dashboard-grid">
      ${panel("小组积分榜", "点击球队进入球队页", `
        <section class="standings-board">
          ${standings.map((group) => groupTable(group)).join("")}
        </section>
      `, "span-2")}
      ${panel("小组赛程", state.groupFilter === "all" ? "全部小组 / 点击进入单场" : `${state.groupFilter} 组 / 点击进入单场`, scheduleTimeline(state, matches), "")}
      ${panel("晋级规则", "公开版说明", factorList([
        ["直接晋级", "12 个小组前二进入 32 强。", 1],
        ["最佳第三", "12 个小组第三中成绩最好的 8 队晋级。", 0],
        ["当前积分", "赛前阶段积分为 0，出线概率来自模型基线。", -1],
      ]), "")}
    </section>
  `;
}

function renderMatch(state) {
  const candidates = filteredMatches(state);
  const match = state.matches.find((item) => item.id === state.selectedMatch) || candidates[0] || state.matches[0];
  state.selectedMatch = match.id;
  const model = matchModel(state, match);
  const scenario = scenarioProjection(model, state.scenario);
  const home = getTeam(state.teams, match.home);
  const away = getTeam(state.teams, match.away);
  const odds = getOdds(state.feed, match, state.teams);
  const market = implied(odds);
  const gap = largestGap(state, match, model);
  const event = liveEvent(state.feed, match);
  const rostersReady = [home.id, away.id].every((id) => state.rosters[id]?.status === "live");
  const risk = upsetRisk(state, match, model);
  const favorite = state.favoriteMatches.includes(match.id);
  return `
    ${topbar({
      kicker: "单场深度",
      title: `${home.name} vs ${away.name}`,
      subtitle: "第一屏给赛前结论，第二屏拆证据，第三屏列数据明细；情景模拟只用于观察敏感性。",
      actions: `${favoriteButton("match", match.id, favorite, favorite ? "已关注" : "关注比赛")}<button class="action" data-download-card="${match.id}">${icon("cloud")}<span>生成海报</span></button>${matchPicker(state, candidates)}${searchBox(state.search, "搜索比赛或球队")}${matchSearchResults(state, candidates.slice(0, 8))}`,
    })}
    <section class="command-grid">
      ${metric("模型倾向", model.probs[0] >= model.probs[2] ? `${home.name}不败` : `${away.name}不败`, `置信 ${model.confidence}% / 风险 ${model.risk}`, model.risk === "高" ? "bad" : "good")}
      ${metric("情景后主胜", `${scenario.probs[0]}%`, `较基线 ${signed(scenario.deltas[0])}%`, scenario.deltas[0] >= 0 ? "good" : "warn")}
      ${metric("市场共识", odds.join(" / "), oddsSource(state.feed, match), oddsSource(state.feed, match) === "模型基线" ? "warn" : "good")}
      ${metric("数据可信", rostersReady ? "阵容已载入" : "阵容待确认", rostersReady ? "中文大名单可用" : "名单同步后会重算可用性", rostersReady ? "good" : "warn")}
    </section>
    <section class="dashboard-grid">
      ${panel("赛前结论", "基线模型 + 情景敏感性", matchConclusion(state, match, model, scenario, risk), "span-2")}
      ${panel("胜平负概率", "模型 / 市场隐含", probabilityCompare(home.name, away.name, model.probs, market), "")}
      ${panel("情景模拟", "调整假设观察概率变化", scenarioControls(state, scenario), "")}
      ${panel("市场分歧", "模型概率 - 市场共识", gapDetail(state, match, model, gap), "")}
      ${panel("比分热区", "模拟 Top 6", scorelines(model), "")}
      ${panel("关键因子", "模型当前纳入项", factorList(model.context.factors), "span-2")}
      ${panel("风险反证", "公开版只呈现证据", riskDetail(risk), "span-2")}
      ${panel("阵容大名单与伤停模拟", rostersReady ? "勾选以启用主力，未勾选模拟缺阵" : "等待名单载入中", squadSimulator(state, match, home, away), "span-2")}
      ${panel("比赛信息", "自动赛程源", matchFacts(state, match, event), "")}
      ${panel("天气/场馆", "环境与旅途输入", weatherDetail(state, match), "")}
      ${panel("历史情报", "ESPN summary fallback", intelSummary(state, match), "span-2")}
    </section>
  `;
}

function renderTeams(state) {
  const list = filteredTeams(state);
  const team = state.teams.find((item) => item.id === state.selectedTeam) || list[0] || state.teams[0];
  state.selectedTeam = team.id;
  const roster = state.rosters[team.id];
  const compare = state.selectedCompareTeam ? state.teams.find((item) => item.id === state.selectedCompareTeam && item.id !== team.id) : null;
  state.selectedCompareTeam = compare ? compare.id : "";
  const favorite = state.favoriteTeams.includes(team.id);
  return `
    ${topbar({
      kicker: "球队画像",
      title: `${team.name} 阵容实力页`,
      subtitle: "面向公开分享的球队入口：先看球队结构、核心球员、阵容状态和同组/强队对比。",
      actions: `${favoriteButton("team", team.id, favorite, favorite ? "已关注" : "关注球队")}${groupFilter(state.groupFilter, groups(state))}${compareTeamSelect(state, team)}${searchBox(state.search, "搜索球队或球员")}`,
    })}
    <section class="team-hero">
      <div><span class="team-badge">${safeText(team.group)}</span><h2>${safeText(team.name)}</h2><p>${safeText(team.style)}</p></div>
      <div class="team-tags"><span>FIFA ${team.fifa}</span><span>Elo ${team.elo}</span><span>身价 ${team.value}M</span><span>平均 ${team.age} 岁</span></div>
    </section>
    <section class="team-layout">
      ${panel("球队列表", `${list.length} 支`, teamList(list, team.id), "")}
      ${panel(compare ? "能力对比" : "实力分析", compare ? `${team.name} vs ${compare.name}` : "球队综合能力评估", radar(team, compare), "span-2")}
      ${panel("同组竞争", `${team.group} 组`, groupRivals(state, team), "")}
      ${panel("战术与风险", "赛前需要复核", factorList([
        ["打法", team.style, 1],
        ["战术倾向", team.coach, 1],
        ["核心球员", team.stars.join(" / "), 1],
        ["伤停", team.injuries, -1],
      ]), "")}
      ${panel("阵容状态分组", roster?.status === "live" ? `${roster.athletes.length} 人 / ${roster.provider}` : "正在同步或待触发", rosterGroups(roster), "")}
      ${panel("中文阵容", roster?.status === "live" ? `${roster.athletes.length} 人 / ${roster.provider}` : "正在同步或待触发", rosterTable(roster), "span-3")}
    </section>
  `;
}

function renderSimulation(state) {
  const ranked = championshipChances(state.teams);
  const standings = groupStandings(state);
  const third = standings.map((group) => group.rows[2]).sort((a, b) => b.qualify - a.qualify).slice(0, 8);
  return `
    ${topbar({
      kicker: "杯赛模拟",
      title: "晋级路径与冠军概率",
      subtitle: "使用球队基线和当前赛程模拟 2026 赛制路径。这里用于场景比较，不是官方预测。",
    })}
    <section class="dashboard-grid">
      ${panel("冠军概率榜", "48 队归一化权重", ranked.slice(0, 16).map((row, index) => progress(`${index + 1}. ${row.team.name}`, Math.max(4, row.chance * 3), index < 3 ? "good" : "warn")).join(""), "")}
      ${panel("最佳第三线", "12 取 8", third.map((row) => progress(row.team.name, row.qualify, "warn")).join(""), "")}
      ${panel("模拟假设", "估算边界", factorList([
        ["基线", "冠军概率来自球队强度、状态、攻防、深度和路径权重。", 0],
        ["未纳入", "抽签变更、最终名单、临场伤停和淘汰赛对位尚未锁定。", -1],
        ["使用方式", "适合比较路径敏感性，不应当作为官方预测。", 1],
      ]), "")}
      ${panel("路径敏感项", "后续可接入情景模拟", factorList([
        ["小组第三", "12 取 8 使第三名概率对净胜球和赛程顺序敏感。", 0],
        ["热门球队", "强队深度影响淘汰赛连续作战稳定性。", 1],
        ["主办环境", "高温、高湿、海拔和旅途会影响单场输出。", -1],
      ]), "")}
    </section>
  `;
}

function renderGolden() {
  return `
    ${topbar({
      kicker: "球员专项",
      title: "金靴、角色和球队路径",
      subtitle: "金靴只是球员专项的一部分。公开版重点说明预期进球、出场时间、点球权和球队路径四个驱动项。",
    })}
    <section class="command-grid">
      ${metric("候选球员", goldenCandidates.length, "赛前基线池", "good")}
      ${metric("最高概率", `${Math.max(...goldenCandidates.map((item) => item.golden))}%`, "非确定性预测", "warn")}
      ${metric("最高首发", `${Math.max(...goldenCandidates.map((item) => item.starts))}%`, "角色稳定性", "good")}
      ${metric("路径变量", "球队晋级", "会随赛果滚动", "warn")}
    </section>
    <section class="dashboard-grid">
      ${panel("球员榜", "预期进球与角色权重", `
        <div class="responsive-table"><table><thead><tr><th>球员</th><th>球队</th><th>预期进球</th><th>概率</th><th>首发</th><th>点球</th><th>射门</th><th>路径</th></tr></thead><tbody>
          ${goldenCandidates.map((player) => `<tr><td><strong>${safeText(player.name)}</strong></td><td>${safeText(player.team)}</td><td>${player.goals}</td><td>${player.golden}%</td><td>${player.starts}%</td><td>${safeText(player.pens)}</td><td>${player.shots}</td><td>${player.path}</td></tr>`).join("")}
        </tbody></table></div>
      `, "span-2")}
      ${panel("解释口径", "四个驱动项", factorList([
        ["预期进球", "个人射门质量和球队创造力的赛前估计。", 1],
        ["出场时间", "首发率和淘汰赛路径决定样本量。", 1],
        ["点球权", "点球主罚权会显著改变上限。", 0],
        ["球队路径", "球队走得越远，球员累积进球机会越多。", 0],
      ]), "span-2")}
    </section>
  `;
}

function renderMarket(state) {
  const days = groupedMatchDays(filteredMatches(state), state.feed);
  const selectedDate = defaultDateKey(days, state.selectedDate);
  state.selectedDate = selectedDate;
  const matches = days.find((day) => day.key === selectedDate)?.matches || [];
  const rows = matches
    .map((match) => ({ match, model: matchModel(state, match) }))
    .sort((a, b) => largestGap(state, b.match, b.model).gapAbs - largestGap(state, a.match, a.model).gapAbs);
  return `
    ${topbar({
      kicker: "市场信号",
      title: "市场共识 vs 模型观点",
      subtitle: "赔率只换算为市场隐含概率，用于发现模型和公开市场的看法差异；不提供投注指令。",
      actions: `${groupFilter(state.groupFilter, groups(state))}${searchBox(state.search, "搜索比赛")}`,
    })}
    ${dayTabs(days, selectedDate)}
    <section class="dashboard-grid">
      ${panel("当日市场分歧", `${rows.length} 场 / 按绝对差值排序`, `
        <div class="market-list">${rows.map(({ match, model }) => marketRow(state, match, model)).join("") || empty("当前筛选下没有比赛")}</div>
      `, "span-2")}
      ${panel("解读规则", "公开版口径", factorList([
        ["正差值", "模型概率高于市场隐含概率，只表示观点差异。", 0],
        ["负差值", "模型低于市场共识，提示热门方向可能偏热。", 0],
        ["模型基线", "没有实时赔率时使用模型基线，不应解读为真实市场。", -1],
      ]), "")}
      ${panel("覆盖状态", "数据源更新时间", sourceList(state), "")}
    </section>
  `;
}

function renderBetting(state) {
  const days = groupedMatchDays(filteredMatches(state), state.feed);
  const selectedDate = defaultDateKey(days, state.selectedDate);
  const dayMatches = days.find((day) => day.key === selectedDate)?.matches || [];
  const betting = state.betting;
  const selections = betting.selections || [];
  const modelData = {};
  const matchList = dayMatches.length > 0 ? dayMatches : state.matches.slice(0, 12);
  for (const match of matchList) {
    const model = matchModel(state, match);
    modelData[match.id] = {
      probs: model.probs,
      homeXG: model.sim?.avgGoals?.[0] ?? model.context?.homeXG ?? 1.3,
      awayXG: model.sim?.avgGoals?.[1] ?? model.context?.awayXG ?? 1.1,
      confidence: model.confidence,
    };
  }
  const lotteryOdds = { ...betting.lotteryOdds };
  for (const match of matchList) {
    if (!lotteryOdds[match.id]) {
      const m = modelData[match.id];
      if (!m) continue;
      const [h, d, a] = m.probs.map(p => p / 100);
      const margin = 1.12;
      lotteryOdds[match.id] = {
        spf: { h: h > 0 ? Number((margin / h).toFixed(2)) : 10, d: d > 0 ? Number((margin / d).toFixed(2)) : 5, a: a > 0 ? Number((margin / a).toFixed(2)) : 10 },
        rqspf: { h: Number((margin / Math.max(h * 0.6 + 0.1, 0.15)).toFixed(2)), d: Number((margin / Math.max(d + 0.05, 0.15)).toFixed(2)), a: Number((margin / Math.max(a * 0.6 + 0.15, 0.15)).toFixed(2)), handicap: h > a ? -1 : h < a ? 1 : 0 },
      };
    }
  }
  const valueBets = findValueBets(matchList, modelData, lotteryOdds);
  const recommendations = generateParlayRecommendations(valueBets, { budget: betting.betAmount * 50 || 100, maxMatches: 6 });
  // Handle one-click adopt
  if (betting.adoptPlan && recommendations[betting.adoptPlan]?.length > 0) {
    const plan = recommendations[betting.adoptPlan][0];
    state.betting.selections = plan.selections.map(s => ({
      matchId: s.matchId, playType: s.playType || "SPF", playTypeName: s.playTypeName || "胜平负",
      outcome: s.outcome, odds: s.odds, modelProb: s.modelProb || 0,
    }));
    state.betting.parlayType = plan.parlayType;
  }
  let summary = null;
  if (state.betting.selections.length >= 2) { summary = generateBettingSummary(state.betting.selections, lotteryOdds, betting.betAmount, betting.parlayType); }
  const bestSingle = valueBets.length > 0 ? valueBets[0] : null;
  const bestLabel = bestSingle ? (() => { const m2 = matchList.find(x => x.id === bestSingle.matchId); return m2 ? `${getTeam(state.teams, m2.home).name} ${bestSingle.outcome}` : bestSingle.outcome; })() : "—";
  return `
    ${topbar({ kicker: "竞彩助手", title: "智能投注方案", subtitle: "基于蒙特卡洛模拟 · 泊松概率模型 · EV与凯利公式。仅供参考，不构成投注建议。", actions: `${groupFilter(state.groupFilter, groups(state))}` })}
    <section class="command-grid">
      ${metric("今日推荐", `${valueBets.length} 项`, "正 EV 投注机会", valueBets.length > 3 ? "good" : "warn")}
      ${metric("最佳单关", bestLabel, bestSingle ? `EV +${(bestSingle.ev * 100).toFixed(1)}%` : "暂无", bestSingle ? "good" : "warn")}
      ${metric("已选比赛", `${selections.length} 场`, `${betting.parlayType} / 每注 ${betting.betAmount} 元`, selections.length >= 2 ? "good" : "warn")}
      ${metric("理论最高", summary ? `¥${summary.maxReturn}` : "—", summary ? `${summary.totalBets} 注 × ${betting.betAmount} 元` : "至少选 2 场", summary ? "good" : "warn")}
    </section>
    <section class="dashboard-grid">
      ${panel("🌟 智能推荐方案", "系统基于模型概率自动组合的最佳投注建议", bettingRecommendations(state, recommendations, matchList), "span-2")}
    </section>
    ${dayTabs(days, selectedDate)}
    <section class="dashboard-grid">
      ${panel("竞彩盘口", `${matchList.length} 场 · 点击赔率添加`, bettingMatchList(state, matchList, modelData, lotteryOdds, selections, valueBets), "span-2")}
      ${panel("投注单", selections.length ? `已选 ${selections.length} 项` : "点击赔率添加", bettingSlip(state, selections, summary), "")}
      ${panel("价值排行", `${valueBets.length} 个正 EV`, bettingValueTable(state, valueBets.slice(0, 12), matchList), "")}
      ${panel("单场深度分析", "模型概率分布", bettingSingleAnalysis(state, matchList, modelData), "span-2")}
      ${panel("使用说明", "竞彩指南", factorList([["赔率来源", "默认使用模型推算赔率（含12%抽水），可替换为体彩官方赔率。", 0], ["期望值(EV)", "EV>0 为正期望投注。绿色推荐标记表示正EV。", 1], ["凯利公式", "建议投注比例=(概率×净赔率-失败概率)/净赔率，上限25%。", 0], ["免责声明", "本计算器仅供数学分析参考，不构成任何投注建议。请理性购彩。", -1]]), "")}
    </section>
  `;
}
function bettingMatchList(state, matches, modelData, lotteryOdds, selections, valueBets) {
  if (!matches.length) return empty("当前日期暂无可选比赛。");
  const selectedKeys = new Set(selections.map(s => `${s.matchId}-${s.playType}-${s.outcome}`));
  const valueBetKeys = new Set(valueBets.map(v => `${v.matchId}-${v.playType}-${v.outcome}`));
  return `<div class="ticai-table">${matches.map((match, idx) => {
    const home = getTeam(state.teams, match.home);
    const away = getTeam(state.teams, match.away);
    const m = modelData[match.id];
    const odds = lotteryOdds[match.id];
    if (!odds?.spf) return "";
    const spfOutcomes = ["主胜", "平局", "客胜"];
    const spfKeys = ["h", "d", "a"];
    const rqspfOutcomes = ["让球主胜", "让球平局", "让球客胜"];
    const handicap = odds.rqspf?.handicap ?? 0;
    const handicapLabel = handicap >= 0 ? `+${handicap}` : `${handicap}`;
    const probs = m ? m.probs.map(p => p / 100) : [0.33, 0.33, 0.34];
    const renderBtn = (mId, pt, ptn, oc, odd, mp) => {
      const key = `${mId}-${pt}-${oc}`;
      const isSel = selectedKeys.has(key);
      const isVal = valueBetKeys.has(key);
      return `<button class="ticai-odds-btn${isSel ? " selected" : ""}${isVal ? " value" : ""}" data-bet-option data-match-id="${mId}" data-play-type="${pt}" data-play-type-name="${ptn}" data-outcome="${oc}" data-odds="${odd}" data-model-prob="${mp.toFixed(4)}"><span class="ticai-odds-label">${safeText(oc)}</span><strong class="ticai-odds-value">${odd}</strong>${isVal ? '<i class="ticai-ev-tag">荐</i>' : ""}</button>`;
    };
    return `<div class="ticai-match-row"><div class="ticai-match-info"><span class="ticai-match-num">${String(idx + 1).padStart(3, "0")}</span><div class="ticai-match-teams"><strong>${safeText(home.name)} vs ${safeText(away.name)}</strong><small>${safeText(match.group)} 组${m ? ` · ${m.probs[0]}/${m.probs[1]}/${m.probs[2]}%` : ""}</small></div></div><div class="ticai-odds-group"><div class="ticai-play-row"><span class="ticai-play-label">胜平负</span><div class="ticai-odds-btns">${spfKeys.map((k, i) => renderBtn(match.id, "SPF", "胜平负", spfOutcomes[i], odds.spf[k], probs[i])).join("")}</div></div>${odds.rqspf ? `<div class="ticai-play-row"><span class="ticai-play-label">让球(${handicapLabel})</span><div class="ticai-odds-btns">${spfKeys.map((k, i) => renderBtn(match.id, "RQSPF", "让球胜平负", rqspfOutcomes[i], odds.rqspf[k], probs[i])).join("")}</div></div>` : ""}</div></div>`;
  }).join("")}</div>`;
}
function bettingSlip(state, selections, summary) {
  const betting = state.betting;
  if (!selections.length) return empty("点击盘口表中的赔率按钮添加选项。至少选 2 场计算串关。");
  const parlayOptions = Object.entries(PARLAY_TYPES).filter(([, v]) => selections.length >= v.n).map(([key, v]) => `<option value="${key}" ${key === betting.parlayType ? "selected" : ""}>${key} — ${v.description}</option>`).join("");
  return `<div class="bet-slip"><div class="bet-selections">${selections.map((sel, idx) => {
    const match = state.matches.find(m => m.id === sel.matchId);
    const home = match ? getTeam(state.teams, match.home) : null;
    const away = match ? getTeam(state.teams, match.away) : null;
    return `<div class="bet-selection-row"><div class="bet-sel-info"><strong>${home && away ? `${safeText(home.name)} vs ${safeText(away.name)}` : sel.matchId}</strong><span>${sel.playTypeName || sel.playType} → ${safeText(sel.outcome)}</span></div><div class="bet-sel-odds"><b>× ${sel.odds}</b></div><button class="bet-remove" data-bet-remove="${idx}">✕</button></div>`;
  }).join("")}</div><div class="bet-config"><label class="field"><span>过关</span><select data-bet-parlay>${parlayOptions || "<option>请至少选 2 场</option>"}</select></label><label class="field"><span>金额</span><input type="number" min="2" step="2" value="${betting.betAmount}" data-bet-amount><small>元</small></label></div>${summary ? `<div class="bet-summary"><div class="bet-summary-row"><span>${safeText(summary.parlayType)}</span><strong>${summary.totalBets} 注</strong></div><div class="bet-summary-row"><span>总投入</span><strong>¥${summary.totalCost}</strong></div><div class="bet-summary-row highlight"><span>最高奖金</span><strong>¥${summary.maxReturn}</strong></div>${summary.overallWinProb !== null ? `<div class="bet-summary-row"><span>全中概率</span><strong>${(summary.overallWinProb * 100).toFixed(2)}%</strong></div>` : ""}${summary.overallEV !== null ? `<div class="bet-summary-row ${summary.overallEV > 0 ? "positive" : "negative"}"><span>期望收益</span><strong>${(summary.overallEV * 100).toFixed(1)}%</strong></div>` : ""}<div class="bet-summary-row"><span>风险</span><strong>${safeText(summary.riskLevel)}</strong></div></div>` : ""}</div>`;
}
function bettingRecommendations(state, recommendations, matches) {
  const plans = [
    { key: "conservative", label: "🛡️ 稳守方案", desc: "高概率 · 低赔率 · 追求稳定命中", color: "green" },
    { key: "balanced", label: "⚖️ 稳健方案", desc: "中等风险 · 性价比最优 · EV 优先", color: "blue" },
    { key: "aggressive", label: "🔥 博冷方案", desc: "高赔率 · 小投入博大奖", color: "red" },
  ];
  const hasAny = plans.some(p => recommendations[p.key]?.length > 0);
  if (!hasAny) return empty("当前比赛数据不足，暂无推荐方案。");
  return `<div class="rec-cards">${plans.map(({ key, label, desc, color }) => {
    const planList = recommendations[key] || [];
    if (!planList.length) return `<div class="rec-card rec-card-${color}"><div class="rec-card-header"><h3>${label}</h3><span class="rec-risk-tag ${color}">${desc.split(" · ")[0]}</span></div><p class="rec-card-desc">${desc}</p><div class="rec-card-empty">暂无符合条件的方案</div></div>`;
    return planList.map(plan => {
      const matchRows = plan.selections.map(s => { const mt = matches.find(m2 => m2.id === s.matchId); const ml = mt ? `${getTeam(state.teams, mt.home).name} vs ${getTeam(state.teams, mt.away).name}` : s.matchId; return `<div class="rec-match-row"><strong>${safeText(ml)}</strong><span class="rec-match-pick">${safeText(s.outcome)}</span><b>@ ${s.odds}</b></div>`; }).join("");
      return `<div class="rec-card rec-card-${color}"><div class="rec-card-header"><h3>${label}</h3><span class="rec-risk-tag ${color}">${safeText(plan.parlayType)}</span></div><p class="rec-card-desc">${desc}</p><div class="rec-card-matches">${matchRows}</div><div class="rec-card-stats"><div><span>投入</span><strong>¥${plan.totalCost}</strong></div><div><span>最高奖金</span><strong class="rec-highlight">¥${plan.maxReturn}</strong></div><div><span>全中概率</span><strong>${(plan.winProb * 100).toFixed(2)}%</strong></div><div><span>EV</span><strong class="${plan.ev > 0 ? "positive" : "negative"}">${(plan.ev * 100).toFixed(1)}%</strong></div></div><button class="rec-adopt-btn" data-adopt-plan="${key}">一键采纳此方案</button></div>`;
    }).join("");
  }).join("")}</div>`;
}
function bettingValueTable(state, valueBets, matches) {
  if (!valueBets.length) return empty("当前没有发现正 EV 的投注选项。");
  return `<div class="responsive-table"><table><thead><tr><th>比赛</th><th>玩法</th><th>选项</th><th>概率</th><th>赔率</th><th>EV</th><th>评级</th></tr></thead><tbody>${valueBets.map(bet => { const match = matches.find(m => m.id === bet.matchId); const label = match ? `${getTeam(state.teams, match.home).name} vs ${getTeam(state.teams, match.away).name}` : bet.matchId; return `<tr><td><strong>${safeText(label)}</strong></td><td>${safeText(bet.playTypeName)}</td><td>${safeText(bet.outcome)}</td><td>${(bet.modelProb * 100).toFixed(1)}%</td><td>${bet.odds}</td><td class="${bet.ev > 0.05 ? "positive" : ""}">+${(bet.ev * 100).toFixed(1)}%</td><td><span class="bet-rating ${bet.confidence === "高价值" ? "high" : bet.confidence === "中等价值" ? "medium" : "low"}">${bet.confidence}</span></td></tr>`; }).join("")}</tbody></table></div>`;
}
function bettingSingleAnalysis(state, matches, modelData) {
  const match = matches.find(m => modelData[m.id]?.homeXG);
  if (!match) return empty("暂无比赛模型数据。");
  const home = getTeam(state.teams, match.home);
  const away = getTeam(state.teams, match.away);
  const m = modelData[match.id];
  const homeXG = m.homeXG;
  const awayXG = m.awayXG;
  const scores = scoreProbabilities(homeXG, awayXG);
  const topScores = [...scores.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const totalProbs = totalGoalsProbabilities(homeXG, awayXG);
  const goalLabels = ["0球", "1球", "2球", "3球", "4球", "5球", "6球", "7+球"];
  const bqcProbs = halfTimeFullTime(homeXG, awayXG);
  return `<div class="bet-analysis"><h3>${safeText(home.name)} vs ${safeText(away.name)}</h3><p>期望进球 ${homeXG.toFixed(2)} : ${awayXG.toFixed(2)}</p><div class="bet-analysis-grid"><div><h4>比分概率 Top 8</h4><div class="scorelines">${topScores.map(([score, prob]) => `<div><strong>${score}</strong><span>${(prob * 100).toFixed(1)}%</span></div>`).join("")}</div></div><div><h4>总进球分布</h4><div class="goals-dist">${totalProbs.map((prob, i) => `<div class="goal-bar"><span>${goalLabels[i]}</span><div class="bar"><i style="width:${prob * 300}%"></i></div><b>${(prob * 100).toFixed(1)}%</b></div>`).join("")}</div></div><div><h4>半全场矩阵</h4><div class="bqc-matrix"><table><thead><tr><th></th><th>全场胜</th><th>全场平</th><th>全场负</th></tr></thead><tbody><tr><td><b>半场胜</b></td><td>${(bqcProbs.HH * 100).toFixed(1)}%</td><td>${(bqcProbs.HD * 100).toFixed(1)}%</td><td>${(bqcProbs.HA * 100).toFixed(1)}%</td></tr><tr><td><b>半场平</b></td><td>${(bqcProbs.DH * 100).toFixed(1)}%</td><td>${(bqcProbs.DD * 100).toFixed(1)}%</td><td>${(bqcProbs.DA * 100).toFixed(1)}%</td></tr><tr><td><b>半场负</b></td><td>${(bqcProbs.AH * 100).toFixed(1)}%</td><td>${(bqcProbs.AD * 100).toFixed(1)}%</td><td>${(bqcProbs.AA * 100).toFixed(1)}%</td></tr></tbody></table></div></div></div></div>`;
}


function renderReview(state) {
  const completed = state.feed.events.filter((event) => event.completed && event.homeScore !== null && event.awayScore !== null);
  const mockCompleted = [
    { matchId: "gA1", homeScore: 2, awayScore: 1, completed: true },
    { matchId: "gA2", homeScore: 1, awayScore: 1, completed: true },
    { matchId: "gB1", homeScore: 0, awayScore: 3, completed: true },
    { matchId: "gC1", homeScore: 1, awayScore: 2, completed: true },
    { matchId: "gD1", homeScore: 2, awayScore: 0, completed: true },
  ];
  const activeCompleted = completed.length ? completed : mockCompleted;
  const metrics = reviewMetrics(state, activeCompleted);
  return `
    ${topbar({
      kicker: "赛后复盘",
      title: "命中率、偏差与模型调参",
      subtitle: "完赛后自动沉淀模型方向、比分 Top 6、进球倾向和偏差原因。当前公开版先展示复盘框架。",
    })}
    <section class="command-grid">
      ${metric("完赛场次", metrics.completed, completed.length ? "来自 live feed" : "无完赛，已载入 5 场仿真测试样例", "good")}
      ${metric("方向命中", `${metrics.directionRate}%`, `${metrics.directionHits}/${metrics.directionEvaluated || 0} 场`, metrics.directionRate >= 55 ? "good" : "warn")}
      ${metric("比分 Top 6", `${metrics.scorelineRate}%`, `${metrics.scorelineHits}/${metrics.directionEvaluated || 0} 场`, "warn")}
      ${metric("调优沙盒", "已启动", "拉动滑块观察历史准确率变化", "good")}
    </section>
    <section class="dashboard-grid">
      ${panel("模型调优沙盒 (Retrospective Calibration)", "调整滑块以实时改变权重并重算历史准确率", tuningSandbox(state, metrics), "span-2")}
      ${panel("复盘记录列表", "已重算当前权重下的预测命中结果", reviewRows(state, metrics.rows), "span-2")}
      ${panel("校准说明", "样本不足时不强行下结论", factorList([
        ["方向评估", "评估胜平负方向是否与实际相符，调高 Elo 或近期权重有助于拟合结果。", 0],
        ["比分重度", "比分分布对进球期望 $\lambda$ 和波动度 $v$ 极为敏感，调优需要统筹兼顾。", -1],
        ["沙盒规则", "调整权重在全局生效。在单场和赛程页面中同样会同步更新预测概率。", 1],
      ]), "span-2")}
    </section>
  `;
}

function renderSources(state) {
  const sourceRows = sourceAuditRows(state.feed, state.teams, state.matches);
  return `
    ${topbar({
      kicker: "数据源状态",
      title: "采集链路、覆盖率与 fallback 审计",
      subtitle: "公开版必须把 live、cached、snapshot、estimated 分清楚，避免把估算当事实。",
      actions: `<button class="action" data-refresh>${icon("refresh")}重新同步</button>`,
    })}
    <section class="command-grid">
      ${metric("球队席位", `${state.teams.length}/48`, "小组结构完整", "good")}
      ${metric("小组赛", `${state.matches.length}`, "12 组，每组 6 场", "good")}
      ${metric("赔率覆盖", `${Object.keys(state.feed.odds).length}`, "自动源或模型基线", Object.keys(state.feed.odds).length ? "good" : "warn")}
      ${metric("更新时间", state.feed.lastUpdated ? formatTime(state.feed.lastUpdated) : "等待同步", state.feed.message, state.feed.status === "error" ? "bad" : "good")}
    </section>
    ${panel("数据源审计", "覆盖率 / fallback / 限制", `
      <div class="responsive-table"><table><thead><tr><th>模块</th><th>来源</th><th>可信度</th><th>覆盖</th><th>更新时间</th><th>Fallback</th><th>限制</th></tr></thead><tbody>
        ${sourceRows.map((row) => `<tr><td><strong>${safeText(row.name)}</strong></td><td>${safeText(row.source)}</td><td>${statusDot(row.status)} ${safeText(row.status)}</td><td>${safeText(row.coverage)}</td><td>${safeText(row.updatedAt)}</td><td>${safeText(row.fallback)}</td><td>${safeText(row.limitation)}</td></tr>`).join("")}
      </tbody></table></div>
    `)}
    ${panel("公开版说明", "风险与限制", factorList([
      ["模型定位", "概率输出用于比较和复盘，不保证任何赛果。", 0],
      ["市场信号", "赔率只作为市场隐含概率来源，不构成投注建议。", 0],
      ["赛前复核", "首发、伤停、天气和赔率都可能在开球前快速变化。", -1],
    ]))}
  `;
}

function dayTabs(days, selectedDate) {
  return `
    <section class="day-tabs" aria-label="比赛日">
      ${days.map((day) => `<button class="${day.key === selectedDate ? "active" : ""}" data-date="${day.key}"><strong>${safeText(day.label)}</strong><span>${day.matches.length} 场</span></button>`).join("")}
    </section>
  `;
}

function groupTable(group) {
  return `
    <article class="group-table">
      <header><strong>${group.group} 组</strong><span>赛</span><span>分</span><span>出线</span><span>区域</span></header>
      ${group.rows.map((row) => `
        <button class="standing-row ${row.rank <= 2 ? "qualified" : row.rank === 3 ? "third" : ""}" data-team="${row.team.id}">
          <span><b>${row.rank}</b>${safeText(row.team.name)}<small>${safeText(row.team.style)}</small></span>
          <span>${row.played}</span><span>${row.points}</span><span>${row.qualify}%</span><span>${row.rank <= 2 ? "直接晋级" : row.rank === 3 ? "最佳第三" : "抢分区"}</span>
        </button>
      `).join("")}
    </article>
  `;
}

function scheduleTimeline(state, matches) {
  const rows = [...matches]
    .sort((a, b) => (matchDate(state.feed, a)?.getTime() || 0) - (matchDate(state.feed, b)?.getTime() || 0))
    .slice(0, state.groupFilter === "all" ? 18 : 12);
  return `
    <div class="schedule-list">
      ${rows.map((match) => {
        const event = liveEvent(state.feed, match);
        return `
          <button class="schedule-row" data-match="${match.id}">
            <span><strong>${safeText(teamLine(state, match))}</strong><small>${safeText(match.group)} 组 / ${safeText(event?.statusDescription || match.dataStatus)}</small></span>
            <b>${formatTime(matchDate(state.feed, match))}</b>
            <i>${safeText(matchVenue(state.feed, match))}</i>
          </button>
        `;
      }).join("") || empty("当前筛选下没有比赛")}
    </div>
  `;
}

function favoriteButton(type, id, active, label) {
  const attr = type === "team" ? "data-favorite-team" : "data-favorite-match";
  return `<button class="action favorite-action ${active ? "active" : ""}" ${attr}="${safeText(id)}">${icon(active ? "star" : "sparkles")}${safeText(label)}</button>`;
}

function favoriteMatches(state) {
  return state.favoriteMatches.map((id) => state.matches.find((match) => match.id === id)).filter(Boolean);
}

function favoriteOverview(state, matches) {
  const teams = state.favoriteTeams.map((id) => state.teams.find((team) => team.id === id)).filter(Boolean);
  if (!matches.length && !teams.length) return empty("在单场页或球队页点击关注后，这里会汇总你的跟踪对象。");
  return `
    <div class="watch-list">
      ${matches.map((match) => `<button data-match="${match.id}"><strong>${teamLine(state, match)}</strong><span>${formatTime(matchDate(state.feed, match))}</span></button>`).join("")}
      ${teams.map((team) => `<button data-team="${team.id}"><strong>${safeText(team.name)}</strong><span>${safeText(team.group)} 组 / ${safeText(team.style)}</span></button>`).join("")}
    </div>
  `;
}

function kickoffAlerts(state, rows) {
  const upcoming = [...rows]
    .sort((a, b) => (matchDate(state.feed, a.match)?.getTime() || 0) - (matchDate(state.feed, b.match)?.getTime() || 0))
    .slice(0, 4);
  if (!upcoming.length) return empty("当前日期暂无可提醒比赛。");
  return `<div class="insight-list">${upcoming.map(({ match, model }) => `
    <button data-match="${match.id}"><strong>${teamLine(state, match)}</strong><span>${formatTime(matchDate(state.feed, match))} / 置信 ${model.confidence}%</span></button>
  `).join("")}</div>`;
}

function dataAlerts(state) {
  const alerts = [...(state.feed.warnings || [])];
  if (state.feed.status === "error") alerts.push(state.feed.message || "自动数据源异常");
  if (!Object.keys(state.feed.odds || {}).length) alerts.push("当前市场信号使用模型基线，尚无实时赔率覆盖。");
  if (!state.feed.events?.length) alerts.push("赛程使用本地骨架，真实开球时间和场馆待同步。");
  return alerts;
}

function alertList(alerts) {
  if (!alerts.length) return empty("当前没有明显数据链路提醒。");
  return `<div class="factor-list">${alerts.map((item) => `<div class="negative"><strong>提醒</strong><p>${safeText(item)}</p></div>`).join("")}</div>`;
}

function matchPicker(state, matches) {
  return `
    <label class="field compact">
      <span>选择比赛</span>
      <select data-match-picker>
        ${matches.map((match) => `<option value="${match.id}" ${match.id === state.selectedMatch ? "selected" : ""}>${safeText(teamLine(state, match))}</option>`).join("")}
      </select>
    </label>
  `;
}

function matchConclusion(state, match, model, scenario, risk) {
  const home = getTeam(state.teams, match.home);
  const away = getTeam(state.teams, match.away);
  const leader = model.probs[0] >= model.probs[2] ? home : away;
  return `
    <div class="conclusion-box">
      <div>
        <span>基线判断</span>
        <strong>${safeText(leader.name)}方向更强</strong>
        <p>模型概率 ${model.probs.join(" / ")}，情景后 ${scenario.probs.join(" / ")}。风险等级：${safeText(risk.level)}。</p>
      </div>
      <div>
        <span>敏感性</span>
        <strong>${scenario.deltas.map((value) => signed(value)).join(" / ")}%</strong>
        <p>${scenario.notes.join("；") || "当前使用基线假设。"}</p>
      </div>
      <div>
        <span>公开说明</span>
        <strong>概率比较，不是结果承诺</strong>
        <p>${safeText(home.name)} vs ${safeText(away.name)} 的输出依赖名单、天气、市场和赛程源。</p>
      </div>
    </div>
  `;
}

function scenarioControls(state, scenario) {
  const { homeForm, awayAvailability, weatherStress, marketMode } = state.scenario;
  return `
    <div class="scenario-controls">
      ${rangeControl("主队状态", "homeForm", homeForm, -10, 10, "正值表示主队状态上修")}
      ${rangeControl("客队可用性", "awayAvailability", awayAvailability, -10, 10, "负值表示客队名单风险上升")}
      ${rangeControl("天气消耗", "weatherStress", weatherStress, 0, 10, "高温、高湿、海拔或旅途压力")}
      <label class="field">
        <span>参照口径</span>
        <select data-scenario="marketMode">
          <option value="model" ${marketMode === "model" ? "selected" : ""}>模型结构</option>
          <option value="market" ${marketMode === "market" ? "selected" : ""}>市场共识校验</option>
        </select>
      </label>
      <div class="scenario-result"><strong>${scenario.probs.join(" / ")}%</strong><span>${scenario.notes.join("；") || "基线假设"}</span></div>
    </div>
  `;
}

function rangeControl(label, key, value, min, max, hint, step = 1) {
  return `
    <label class="range-field">
      <span>${safeText(label)} <b>${safeText(value)}</b></span>
      <input type="range" min="${min}" max="${max}" step="${step}" value="${safeText(value)}" data-scenario="${key}">
      <small>${safeText(hint)}</small>
    </label>
  `;
}

function weatherDetail(state, match) {
  const env = matchEnvironment(state.feed, match);
  if (!env) return empty("场馆环境待同步。");
  return `
    <dl class="facts">
      <dt>场馆环境</dt><dd>${safeText(env.name)}</dd>
      <dt>天气口径</dt><dd>${safeText(env.weatherSource || "气候基线")}</dd>
      <dt>温湿度</dt><dd>${safeText(env.temp)}°C / ${safeText(env.humidity)}%</dd>
      <dt>海拔</dt><dd>${safeText(env.altitude)}m</dd>
      <dt>说明</dt><dd>${safeText(env.climate || env.weatherMessage || "等待赛前预报")}</dd>
    </dl>
  `;
}

function rosterStatusSummary(state, home, away) {
  return `<div class="source-list">${[home, away].map((team) => {
    const roster = state.rosters[team.id];
    return `<div><span>${safeText(team.name)}</span><strong>${roster?.status === "live" ? `${roster.athletes.length} 人已载入` : "待同步"}</strong></div>`;
  }).join("")}</div>`;
}

function intelSummary(state, match) {
  const intel = state.intel[match.id];
  if (!intel) return empty("进入单场页后会请求 ESPN summary 情报。");
  if (intel.status !== "live") return empty(intel.message || "历史情报暂不可用。");
  return `<div class="source-list">
    <div><span>近期状态</span><strong>${Object.keys(intel.forms || {}).length} 队返回</strong></div>
    <div><span>历史交锋</span><strong>${intel.headToHead?.length || 0} 场</strong></div>
    <div><span>来源</span><strong>${safeText(intel.provider || "ESPN")}</strong></div>
  </div>`;
}

function compareTeamSelect(state, team) {
  return `
    <label class="field compact">
      <span>对比</span>
      <select data-compare-team>
        <option value="">无对比 (不选)</option>
        ${state.teams.filter((item) => item.id !== team.id).map((item) => `<option value="${item.id}" ${item.id === state.selectedCompareTeam ? "selected" : ""}>${safeText(item.name)}</option>`).join("")}
      </select>
    </label>
  `;
}

function groupRivals(state, team) {
  const rivals = state.teams.filter((item) => item.group === team.group && item.id !== team.id);
  return `<div class="insight-list">${rivals.map((rival) => `<button data-team="${rival.id}"><strong>${safeText(rival.name)}</strong><span>FIFA ${rival.fifa} / ${safeText(rival.style)}</span></button>`).join("")}</div>`;
}

function rosterGroups(roster) {
  if (!roster) return empty("进入球队页后自动同步中文大名单。");
  if (roster.status !== "live") return empty(roster.message || "名单源暂不可用。");
  const active = roster.athletes.filter((player) => !player.statusType || player.statusType === "active").length;
  const flagged = roster.athletes.length - active;
  const injured = roster.athletes.filter((player) => player.injuries?.length).length;
  return `<div class="source-list">
    <div><span>可用</span><strong>${active}</strong></div>
    <div><span>异常状态</span><strong>${flagged}</strong></div>
    <div><span>伤病记录</span><strong>${injured}</strong></div>
  </div>`;
}

function matchCard(state, match, model, risk) {
  const home = getTeam(state.teams, match.home);
  const away = getTeam(state.teams, match.away);
  const gap = largestGap(state, match, model);
  const favorite = state.favoriteMatches.includes(match.id);
  return `
    <button class="match-card" data-match="${match.id}">
      <span class="match-main"><strong>${safeText(home.name)} vs ${safeText(away.name)}</strong><small>${formatTime(matchDate(state.feed, match))} / ${safeText(matchVenue(state.feed, match))}</small></span>
      <span class="prob-strip"><b>${model.probs[0]}%</b><b>${model.probs[1]}%</b><b>${model.probs[2]}%</b></span>
      <span class="card-tags"><i class="${risk.tone}">风险 ${risk.score}</i><i>分歧 ${signed(gap.gaps[gap.maxIndex])}%</i><i>${favorite ? "已关注" : "可关注"}</i></span>
    </button>
  `;
}

function teamLine(state, match) {
  return `${getTeam(state.teams, match.home).name} vs ${getTeam(state.teams, match.away).name}`;
}

function gapDetail(state, match, model, gap) {
  const odds = getOdds(state.feed, match, state.teams);
  return `
    <div class="gap-detail">
      ${gap.labels.map((label, index) => `
        <div class="${index === gap.maxIndex ? "focus" : ""}">
          <span>${safeText(label)}<small>赔率 ${odds[index]}</small></span>
          <b>模型 ${model.probs[index]}%</b>
          <b>市场 ${gap.market[index]}%</b>
          ${gapChip(gap.gaps[index])}
        </div>
      `).join("")}
    </div>
  `;
}

function riskDetail(risk) {
  return `
    <div class="risk-box ${risk.tone}">
      <strong>${risk.level} ${risk.score}</strong>
      <p>市场热门：${safeText(risk.favorite.name)}；潜在反向方：${safeText(risk.underdog.name)}</p>
      <ul>${(risk.reasons.length ? risk.reasons : ["模型与市场暂未出现强分歧"]).map((item) => `<li>${safeText(item)}</li>`).join("")}</ul>
    </div>
  `;
}

function sourceSummary(state) {
  if (state.feed.status === "live") return `${Object.keys(state.feed.odds).length} 场赔率`;
  if (state.feed.status === "cached") return "缓存可用";
  if (state.feed.status === "error") return "同步失败";
  return "估算基线";
}

function sourceList(state) {
  const rows = [
    ["赛程", state.feed.events.length ? `${state.feed.events.length} 场 live/cache` : "本地骨架"],
    ["赔率", Object.keys(state.feed.odds).length ? `${Object.keys(state.feed.odds).length} 场自动源` : "模型基线"],
    ["名单", "本地中文快照优先，ESPN fallback"],
    ["天气", "赛前 72 小时 Open-Meteo"],
  ];
  return `<div class="source-list">${rows.map(([label, value]) => `<div><span>${safeText(label)}</span><strong>${safeText(value)}</strong></div>`).join("")}</div>`;
}

function probabilityCompare(homeName, awayName, model, market) {
  const labels = [homeName, "平局", awayName];
  return labels.map((label, index) => `
    <div class="prob-compare">
      <span>${safeText(label)}</span>
      <div>
        <div class="bar"><i class="good" style="width:${model[index]}%"></i></div>
        <div class="bar"><i class="warn" style="width:${market[index]}%"></i></div>
      </div>
      <strong>${model[index]} / ${market[index]}%</strong>
    </div>
  `).join("");
}

function scorelines(model) {
  return `<div class="scorelines">${model.sim.scorelines.map((item) => `<div><strong>${safeText(item.score)}</strong><span>${item.pct}%</span></div>`).join("")}</div>`;
}

function matchFacts(state, match, event) {
  return `
    <dl class="facts">
      <dt>开球</dt><dd>${formatTime(matchDate(state.feed, match))}</dd>
      <dt>场馆</dt><dd>${safeText(matchVenue(state.feed, match))}</dd>
      <dt>转播</dt><dd>${safeText(event?.broadcasts?.join(" / ") || "未公布")}</dd>
      <dt>数据源</dt><dd>${safeText(oddsSource(state.feed, match))}</dd>
    </dl>
  `;
}

function factorList(items) {
  return `<div class="factor-list">${items.map(([title, text, tone]) => `<div class="${tone > 0 ? "positive" : tone < 0 ? "negative" : ""}"><strong>${safeText(title)}</strong><p>${safeText(text)}</p></div>`).join("")}</div>`;
}

function matchSearchResults(state, matches) {
  if (!state.search) return "";
  return `<div class="quick-results">${matches.map((match) => `<button data-match="${match.id}">${teamLine(state, match)}</button>`).join("") || `<span>没有匹配比赛</span>`}</div>`;
}

function teamList(teams, selectedId) {
  return `<div class="team-list">${teams.map((team) => `<button class="${team.id === selectedId ? "active" : ""}" data-team="${team.id}"><strong>${safeText(team.name)}</strong><span>${safeText(team.group)} 组 / FIFA ${team.fifa}</span></button>`).join("")}</div>`;
}

function radar(a, b) {
  const isCompare = Boolean(b && b.id && b.id !== a.id);
  const fields = [
    { label: "进攻", key: "attack" },
    { label: "防守", key: "defense" },
    { label: "中场", key: "midfield" },
    { label: "门将", key: "keeper" },
    { label: "深度", key: "depth" },
    { label: "状态", key: "form" }
  ];

  const Xc = 160;
  const Yc = 150;
  const R = 95;

  const cosValues = [0, 0.866, 0.866, 0, -0.866, -0.866];
  const sinValues = [-1, -0.5, 0.5, 1, 0.5, -0.5];

  // Draw concentric rings
  const levels = [30, 60, 90];
  const ringsHtml = levels.map((lvl) => {
    const pts = cosValues.map((cos, idx) => {
      const x = Xc + lvl * cos;
      const y = Yc + lvl * sinValues[idx];
      return `${x},${y}`;
    }).join(" ");
    return `<polygon points="${pts}" fill="none" stroke="var(--line)" stroke-width="1" stroke-dasharray="3,3" />`;
  }).join("");

  // Draw outer border
  const outerPts = cosValues.map((cos, idx) => {
    const x = Xc + R * cos;
    const y = Yc + R * sinValues[idx];
    return `${x},${y}`;
  }).join(" ");
  const outerBorder = `<polygon points="${outerPts}" fill="none" stroke="var(--line)" stroke-width="1" />`;

  // Draw axis lines and labels
  const axesHtml = fields.map((f, idx) => {
    const cos = cosValues[idx];
    const sin = sinValues[idx];
    const xOuter = Xc + R * cos;
    const yOuter = Yc + R * sin;
    const xLabel = Xc + (R + 16) * cos;
    const yLabel = Yc + (R + 10) * sin;
    let anchor = "middle";
    if (cos > 0.1) anchor = "start";
    if (cos < -0.1) anchor = "end";

    return `
      <line x1="${Xc}" y1="${Yc}" x2="${xOuter}" y2="${yOuter}" stroke="var(--line)" stroke-width="1" />
      <text x="${xLabel}" y="${yLabel}" fill="var(--ink)" font-size="11" font-weight="800" text-anchor="${anchor}" dominant-baseline="middle">${f.label}</text>
    `;
  }).join("");

  // Draw polygons for A and B
  const pointsA = fields.map((f, idx) => {
    const val = a[f.key];
    const x = Xc + R * (val / 100) * cosValues[idx];
    const y = Yc + R * (val / 100) * sinValues[idx];
    return `${x},${y}`;
  }).join(" ");

  const pointsB = isCompare ? fields.map((f, idx) => {
    const val = b[f.key];
    const x = Xc + R * (val / 100) * cosValues[idx];
    const y = Yc + R * (val / 100) * sinValues[idx];
    return `${x},${y}`;
  }).join(" ") : "";

  const polyA = `<polygon points="${pointsA}" fill="rgba(16, 185, 129, 0.2)" stroke="var(--good)" stroke-width="2.5" />`;
  const polyB = isCompare ? `<polygon points="${pointsB}" fill="rgba(96, 165, 250, 0.2)" stroke="var(--brand)" stroke-width="2.5" />` : "";

  const dotsHtml = fields.map((f, idx) => {
    const valA = a[f.key];
    const xA = Xc + R * (valA / 100) * cosValues[idx];
    const yA = Yc + R * (valA / 100) * sinValues[idx];
    let bDot = "";
    if (isCompare) {
      const valB = b[f.key];
      const xB = Xc + R * (valB / 100) * cosValues[idx];
      const yB = Yc + R * (valB / 100) * sinValues[idx];
      bDot = `<circle cx="${xB}" cy="${yB}" r="3.5" fill="var(--brand)" />`;
    }
    return `
      <circle cx="${xA}" cy="${yA}" r="3.5" fill="var(--good)" />
      ${bDot}
    `;
  }).join("");

  const legendHtml = `
    <div class="radar-legend">
      <div><span class="dot good"></span><strong>${a.name}</strong></div>
      ${isCompare ? `<div><span class="dot brand"></span><strong>${b.name}</strong></div>` : ""}
    </div>
  `;

  const breakdownHtml = `
    <div class="radar-breakdown">
      ${fields.map((f) => {
        const valA = a[f.key];
        const valB = isCompare ? b[f.key] : null;
        const diff = isCompare ? valA - valB : 0;
        return `
          <div class="radar-breakdown-row">
            <span>${f.label}</span>
            <div class="radar-bar-container">
              <div class="radar-bar good" style="width: ${valA}%"></div>
              ${isCompare ? `<div class="radar-bar brand" style="width: ${valB}%"></div>` : ""}
            </div>
            <strong>${valA}${isCompare ? ` <i>${diff >= 0 ? "+" : ""}${diff}</i>` : ""}</strong>
          </div>
        `;
      }).join("")}
    </div>
  `;

  return `
    <div class="radar-container">
      <div class="radar-chart-box">
        <svg viewBox="0 0 320 300" class="radar-svg">
          ${ringsHtml}
          ${outerBorder}
          ${polyA}
          ${polyB}
          ${axesHtml}
          ${dotsHtml}
        </svg>
        ${legendHtml}
      </div>
      ${breakdownHtml}
    </div>
  `;
}

function rosterTable(roster) {
  if (!roster) return empty("进入球队页后自动同步中文大名单。");
  if (roster.status !== "live") return empty(roster.message || "名单源暂不可用。");
  return `
    <div class="responsive-table"><table><thead><tr><th>球员</th><th>号码</th><th>位置</th><th>俱乐部</th><th>状态</th></tr></thead><tbody>
      ${roster.athletes.map((player) => `<tr><td><strong>${safeText(player.nameZh || player.name)}</strong></td><td>${safeText(player.number)}</td><td>${safeText(player.position)}</td><td>${safeText(player.clubZh || player.club)}</td><td>${safeText(player.status || "可用")}</td></tr>`).join("")}
    </tbody></table></div>
  `;
}



function marketRow(state, match, model) {
  const gap = largestGap(state, match, model);
  const risk = upsetRisk(state, match, model);
  return `
    <button class="market-row" data-match="${match.id}">
      <strong>${teamLine(state, match)}</strong>
      <span>${formatTime(matchDate(state.feed, match))} / ${safeText(oddsSource(state.feed, match))}</span>
      ${gapChip(gap.gaps[gap.maxIndex])}
      <i class="${risk.tone}">风险 ${risk.score}</i>
    </button>
  `;
}

function reviewRows(state, rows) {
  return `
    <div class="responsive-table"><table><thead><tr><th>比赛</th><th>赛果</th><th>模型方向</th><th>实际方向</th><th>方向命中</th><th>比分 Top 6</th></tr></thead><tbody>
      ${rows.map((row) => `<tr><td>${teamLine(state, row.match)}</td><td>${safeText(row.score)}</td><td>${safeText(row.predictedLabel)}</td><td>${safeText(row.directionLabel)}</td><td>${row.directionHit ? "是" : "否"}</td><td>${row.scorelineHit ? "命中" : "未命中"}</td></tr>`).join("")}
    </tbody></table></div>
  `;
}

function feedStatusText(status) {
  if (status === "live") return "实时";
  if (status === "cached") return "缓存";
  if (status === "error") return "异常";
  return "估算";
}

function empty(text) {
  return `
    <div class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <p>${safeText(text)}</p>
    </div>
  `;
}

function squadSimulator(state, match, home, away) {
  const homeRoster = state.rosters[home.id];
  const awayRoster = state.rosters[away.id];
  if (!homeRoster || !awayRoster) return empty("阵容名单载入中...");
  if (homeRoster.status !== "live" || awayRoster.status !== "live") {
    return empty("请等待两队大名单同步。");
  }

  const benchedList = state.benchedPlayers[match.id] || [];

  const renderTeamList = (team, roster) => {
    return `
      <div class="simulator-team">
        <h3>${safeText(team.name)} 模拟大名单</h3>
        <div class="simulator-scroll-list">
          ${roster.athletes.map((player) => {
            const isBenched = benchedList.includes(player.id);
            return `
              <label class="simulator-checkbox">
                <input type="checkbox" data-bench-player="${safeText(player.id)}" data-match-id="${safeText(match.id)}" ${isBenched ? "" : "checked"}>
                <span>
                  <b>${safeText(player.number || "-")}</b> 
                  <strong>${safeText(player.nameZh || player.name)}</strong>
                  <small>${safeText(player.positionGroup || player.position || "未知")}</small>
                </span>
              </label>
            `;
          }).join("")}
        </div>
      </div>
    `;
  };

  return `
    <div class="squad-simulator-panel">
      ${renderTeamList(home, homeRoster)}
      ${renderTeamList(away, awayRoster)}
    </div>
  `;
}

function tuningSandbox(state, metrics) {
  const { weightElo = 1, weightForm = 1, weightRoster = 1, weightWeather = 1 } = state.scenario;
  return `
    <div class="tuning-sandbox">
      <div class="sandbox-controls">
        ${rangeControl("Elo 实力权重", "weightElo", weightElo, 0, 3, "调节Elo基准对胜负概率的决定程度", 0.1)}
        ${rangeControl("近期状态权重", "weightForm", weightForm, 0, 3, "调节近期战绩/交锋的参考占比", 0.1)}
        ${rangeControl("阵容伤停权重", "weightRoster", weightRoster, 0, 3, "调节大名单/可用性减少的影响", 0.1)}
        ${rangeControl("天气环境权重", "weightWeather", weightWeather, 0, 3, "调节球场高湿度/高海拔的影响", 0.1)}
      </div>
      <div class="sandbox-result">
        <h3>模拟调参结果</h3>
        <div class="sandbox-metrics">
          <div><span>方向预测率</span><strong>${metrics.directionRate}%</strong></div>
          <div><span>比分命中率</span><strong>${metrics.scorelineRate}%</strong></div>
        </div>
        <p class="sandbox-tip">拖动滑块会即时触发泊松蒙特卡洛模型重算，复盘记录的预测方向也会实时刷新。</p>
      </div>
    </div>
  `;
}
