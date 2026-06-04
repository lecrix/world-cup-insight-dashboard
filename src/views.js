import { goldenCandidates } from "./data/tournament.js";
import {
  championshipChances,
  defaultDateKey,
  getOdds,
  getTeam,
  groupStandings,
  groupedMatchDays,
  implied,
  largestGap,
  liveEvent,
  matchDate,
  matchModel,
  matchVenue,
  oddsSource,
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
  return `
    ${topbar({
      kicker: "比赛日指挥台",
      title: "先看今天最值得关注的比赛",
      subtitle: "聚合赛程、模型倾向、市场分歧和数据源状态；公开分享时重点呈现证据，不输出投注指令。",
      actions: `<button class="action" data-refresh>${icon("refresh")}刷新数据</button>`,
    })}
    <section class="command-grid">
      ${metric("当日比赛", rows.length, `全量 ${state.matches.length} 场`, "good")}
      ${metric("模型分歧", valueSpots, "模型与市场差值 >= 5%", "warn")}
      ${metric("平均置信", `${avgConfidence}%`, "仅代表模型集中度", "good")}
      ${metric("数据源", sourceSummary(state), state.feed.lastUpdated ? formatTime(state.feed.lastUpdated) : "等待同步", state.feed.status === "error" ? "bad" : "good")}
    </section>
    ${dayTabs(days, selectedDate)}
    <section class="dashboard-grid">
      ${panel("重点比赛", `${selectedDay.label} / 点击进入单场`, rows.map((row) => matchCard(state, row.match, row.model, row.upset)).join("") || empty("当前日期暂无比赛"), "span-2")}
      ${panel("最大市场分歧", topGap ? `${teamLine(state, topGap.match)}` : "暂无", topGap ? gapDetail(state, topGap.match, topGap.model, topGap.gap) : empty("等待赔率或模型数据"), "")}
      ${panel("风险雷达", topRisk ? `${teamLine(state, topRisk.match)}` : "暂无", topRisk ? riskDetail(topRisk.upset) : empty("当前日期暂无风险项"), "")}
      ${panel("数据状态", "上线可解释性", sourceList(state), "span-2")}
    </section>
  `;
}

function renderMatches(state) {
  const standings = groupStandings(state).filter((group) => state.groupFilter === "all" || group.group === state.groupFilter);
  return `
    ${topbar({
      kicker: "小组赛程",
      title: "小组积分榜与出线区",
      subtitle: "按 12 个小组展示出线区域。公开版默认突出规则和数据可信度，逐场入口保留在指挥台和单场页。",
      actions: `${groupFilter(state.groupFilter, groups(state))}${searchBox(state.search, "搜索球队")}`,
    })}
    <section class="standings-board">
      ${standings.map((group) => `
        <article class="group-table">
          <header><strong>${group.group} 组</strong><span>赛</span><span>分</span><span>出线</span><span>区域</span></header>
          ${group.rows.map((row) => `
            <button class="standing-row ${row.rank <= 2 ? "qualified" : row.rank === 3 ? "third" : ""}" data-team="${row.team.id}">
              <span><b>${row.rank}</b>${safeText(row.team.name)}<small>${safeText(row.team.style)}</small></span>
              <span>${row.played}</span><span>${row.points}</span><span>${row.qualify}%</span><span>${row.rank <= 2 ? "直接晋级" : row.rank === 3 ? "最佳第三" : "抢分区"}</span>
            </button>
          `).join("")}
        </article>
      `).join("")}
    </section>
  `;
}

function renderMatch(state) {
  const candidates = filteredMatches(state);
  const match = state.matches.find((item) => item.id === state.selectedMatch) || candidates[0] || state.matches[0];
  state.selectedMatch = match.id;
  const model = matchModel(state, match);
  const home = getTeam(state.teams, match.home);
  const away = getTeam(state.teams, match.away);
  const odds = getOdds(state.feed, match, state.teams);
  const market = implied(odds);
  const gap = largestGap(state, match, model);
  const event = liveEvent(state.feed, match);
  const rostersReady = [home.id, away.id].every((id) => state.rosters[id]?.status === "live");
  return `
    ${topbar({
      kicker: "单场深度",
      title: `${home.name} vs ${away.name}`,
      subtitle: "把结果概率、比分分布、攻防结构、阵容状态、市场信号和反向证据放到同一个决策页。",
      actions: `${searchBox(state.search, "搜索比赛或球队")}${matchSearchResults(state, candidates.slice(0, 8))}`,
    })}
    <section class="command-grid">
      ${metric("模型倾向", model.probs[0] >= model.probs[2] ? `${home.name}不败` : `${away.name}不败`, `置信 ${model.confidence}% / 风险 ${model.risk}`, model.risk === "高" ? "bad" : "good")}
      ${metric("预期进球", model.totalGoals.toFixed(2), `大 2.5 球 ${model.over25}% / 双方进球 ${model.btts}%`, "warn")}
      ${metric("市场信号", odds.join(" / "), oddsSource(state.feed, match), oddsSource(state.feed, match) === "模型基线" ? "warn" : "good")}
      ${metric("阵容", rostersReady ? "已载入" : "待确认", rostersReady ? "中文大名单可用" : "进入球队页触发同步", rostersReady ? "good" : "warn")}
    </section>
    <section class="dashboard-grid">
      ${panel("胜平负概率", "模型 / 市场隐含", probabilityCompare(home.name, away.name, model.probs, market), "")}
      ${panel("市场分歧", "模型概率 - 市场隐含", gapDetail(state, match, model, gap), "")}
      ${panel("比分热区", "模拟 Top 6", scorelines(model), "")}
      ${panel("比赛信息", "自动赛程源", matchFacts(state, match, event), "")}
      ${panel("关键因子", "模型当前纳入项", factorList(model.context.factors), "span-2")}
      ${panel("风险反证", "公开版只呈现证据", riskDetail(upsetRisk(state, match, model)), "span-2")}
    </section>
  `;
}

function renderTeams(state) {
  const list = filteredTeams(state);
  const team = state.teams.find((item) => item.id === state.selectedTeam) || list[0] || state.teams[0];
  state.selectedTeam = team.id;
  const roster = state.rosters[team.id];
  const compare = state.teams.find((item) => item.id === state.selectedCompareTeam && item.id !== team.id) ||
    state.teams.find((item) => item.group === team.group && item.id !== team.id) ||
    state.teams.find((item) => item.id !== team.id);
  state.selectedCompareTeam = compare.id;
  return `
    ${topbar({
      kicker: "球队画像",
      title: `${team.name} 阵容实力页`,
      subtitle: "面向公开分享的球队入口：先看球队结构、核心球员、阵容状态和同组/强队对比。",
      actions: `${groupFilter(state.groupFilter, groups(state))}${searchBox(state.search, "搜索球队或球员")}`,
    })}
    <section class="team-hero">
      <div><span class="team-badge">${safeText(team.group)}</span><h2>${safeText(team.name)}</h2><p>${safeText(team.style)}</p></div>
      <div class="team-tags"><span>FIFA ${team.fifa}</span><span>Elo ${team.elo}</span><span>身价 ${team.value}M</span><span>平均 ${team.age} 岁</span></div>
    </section>
    <section class="team-layout">
      ${panel("球队列表", `${list.length} 支`, teamList(list, team.id), "")}
      ${panel("能力对比", `${team.name} vs ${compare.name}`, radar(team, compare), "span-2")}
      ${panel("战术与风险", "赛前需要复核", factorList([
        ["打法", team.style, 1],
        ["战术倾向", team.coach, 1],
        ["核心球员", team.stars.join(" / "), 1],
        ["伤停", team.injuries, -1],
      ]), "")}
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
      ${panel("32 强路径", "按当前权重展示", bracket(ranked.map((row) => row.team)), "span-2")}
    </section>
  `;
}

function renderGolden() {
  return `
    ${topbar({
      kicker: "球员专项",
      title: "金靴与进球分布",
      subtitle: "结合个人进球能力、首发率、点球权和球队路径。当前为赛前基线，应随首发和出线路径修正。",
    })}
    ${panel("金靴概率榜", "预期进球与角色权重", `
      <div class="responsive-table"><table><thead><tr><th>球员</th><th>球队</th><th>预期进球</th><th>概率</th><th>首发</th><th>点球</th><th>射门</th></tr></thead><tbody>
        ${goldenCandidates.map((player) => `<tr><td><strong>${safeText(player.name)}</strong></td><td>${safeText(player.team)}</td><td>${player.goals}</td><td>${player.golden}%</td><td>${player.starts}%</td><td>${safeText(player.pens)}</td><td>${player.shots}</td></tr>`).join("")}
      </tbody></table></div>
    `)}
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
      title: "概率、赔率与价值分歧",
      subtitle: "公开版将赔率视为市场共识输入，用于发现模型分歧；不提供投注指令。",
      actions: `${groupFilter(state.groupFilter, groups(state))}${searchBox(state.search, "搜索比赛")}`,
    })}
    ${dayTabs(days, selectedDate)}
    ${panel("当日市场分歧", `${rows.length} 场 / 按绝对差值排序`, `
      <div class="market-list">${rows.map(({ match, model }) => marketRow(state, match, model)).join("") || empty("当前筛选下没有比赛")}</div>
    `)}
  `;
}

function renderReview(state) {
  const completed = state.feed.events.filter((event) => event.completed && event.homeScore !== null && event.awayScore !== null);
  return `
    ${topbar({
      kicker: "赛后复盘",
      title: "命中率、偏差与模型调参",
      subtitle: "完赛后自动沉淀模型方向、比分 Top 6、进球倾向和偏差原因。当前公开版先展示复盘框架。",
    })}
    <section class="command-grid">
      ${metric("完赛场次", completed.length, "来自 live feed", completed.length ? "good" : "warn")}
      ${metric("方向命中", completed.length ? "待计算" : "0场", "等待首场完赛", "warn")}
      ${metric("比分 Top 6", completed.length ? "待计算" : "0场", "高波动指标", "warn")}
      ${metric("模型调参", "待样本", "赛后统一复盘", "good")}
    </section>
    ${panel("复盘记录", completed.length ? "自动生成" : "暂无完赛", completed.length ? reviewRows(state, completed) : empty("比赛结束后会按自动数据源生成复盘记录。"))}
  `;
}

function renderSources(state) {
  const sourceRows = [
    ["赛程/赛果", state.feed.events.length ? `${state.feed.events.length} 场 ESPN 事件` : "本地赛程骨架", state.feed.events.length ? "live" : "estimated"],
    ["市场赔率", Object.keys(state.feed.odds).length ? `${Object.keys(state.feed.odds).length} 场 DraftKings 赔率` : "模型基线", Object.keys(state.feed.odds).length ? "live" : "estimated"],
    ["中文名单", "official-rosters.json 快照 + ESPN fallback", "snapshot"],
    ["天气", "72 小时内 Open-Meteo，否则城市气候基线", "mixed"],
    ["模型强度", "Elo/FIFA/攻防/身价/状态估算", "estimated"],
  ];
  return `
    ${topbar({
      kicker: "数据源状态",
      title: "采集链路与可信度",
      subtitle: "公开版必须把 live、cache、snapshot、estimated 分清楚，避免把估算当事实。",
      actions: `<button class="action" data-refresh>${icon("refresh")}重新同步</button>`,
    })}
    <section class="command-grid">
      ${metric("球队席位", `${state.teams.length}/48`, "小组结构完整", "good")}
      ${metric("小组赛", `${state.matches.length}`, "12 组，每组 6 场", "good")}
      ${metric("赔率覆盖", `${Object.keys(state.feed.odds).length}`, "自动源或模型基线", Object.keys(state.feed.odds).length ? "good" : "warn")}
      ${metric("状态", feedStatusText(state.feed.status), state.feed.message, state.feed.status === "error" ? "bad" : "good")}
    </section>
    ${panel("数据源清单", "字段级可信度", `
      <div class="responsive-table"><table><thead><tr><th>模块</th><th>当前来源</th><th>可信度</th></tr></thead><tbody>
        ${sourceRows.map(([name, source, status]) => `<tr><td>${safeText(name)}</td><td>${safeText(source)}</td><td>${statusDot(status)} ${safeText(status)}</td></tr>`).join("")}
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

function matchCard(state, match, model, risk) {
  const home = getTeam(state.teams, match.home);
  const away = getTeam(state.teams, match.away);
  const gap = largestGap(state, match, model);
  return `
    <button class="match-card" data-match="${match.id}">
      <span class="match-main"><strong>${safeText(home.name)} vs ${safeText(away.name)}</strong><small>${formatTime(matchDate(state.feed, match))} / ${safeText(matchVenue(state.feed, match))}</small></span>
      <span class="prob-strip"><b>${model.probs[0]}%</b><b>${model.probs[1]}%</b><b>${model.probs[2]}%</b></span>
      <span class="card-tags"><i class="${risk.tone}">风险 ${risk.score}</i><i>分歧 ${signed(gap.gaps[gap.maxIndex])}%</i></span>
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
  const fields = [["进攻", "attack"], ["防守", "defense"], ["中场", "midfield"], ["门将", "keeper"], ["深度", "depth"], ["状态", "form"]];
  return `<div class="radar">${fields.map(([label, key]) => `
    <div class="radar-row"><span>${label}</span><div class="bar"><i class="good" style="width:${a[key]}%"></i></div><div class="bar"><i class="muted" style="width:${b[key]}%"></i></div><b>${a[key] - b[key] > 0 ? "+" : ""}${a[key] - b[key]}</b></div>
  `).join("")}</div>`;
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

function bracket(teams) {
  const rounds = [["32 强", teams.slice(0, 32)], ["16 强", teams.slice(0, 16)], ["8 强", teams.slice(0, 8)], ["4 强", teams.slice(0, 4)], ["决赛", teams.slice(0, 2)]];
  return `<div class="bracket">${rounds.map(([label, rows]) => `<div><h3>${label}</h3>${rows.map((team) => `<span>${safeText(team.name)}</span>`).join("")}</div>`).join("")}</div>`;
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

function reviewRows(state, completed) {
  return `
    <div class="responsive-table"><table><thead><tr><th>比赛</th><th>赛果</th><th>状态</th></tr></thead><tbody>
      ${completed.map((event) => {
        const match = state.matches.find((item) => item.id === event.matchId);
        return `<tr><td>${match ? teamLine(state, match) : safeText(event.matchId)}</td><td>${safeText(event.homeScore)}-${safeText(event.awayScore)}</td><td>${safeText(event.statusDescription || "完赛")}</td></tr>`;
      }).join("")}
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
  return `<div class="empty">${safeText(text)}</div>`;
}
