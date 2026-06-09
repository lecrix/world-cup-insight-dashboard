import { icon } from "../utils/icons.js";
import { safeText, signed } from "../utils/format.js";

export function appShell({ pages, state, content }) {
  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand" data-route="overview">
          <div class="brand-mark">WC</div>
          <div>
            <h1>世界杯洞察看板</h1>
            <p>赛程 / 市场 / 模型 / 复盘</p>
          </div>
        </div>
        <nav class="nav" aria-label="主导航">
          ${pages.map(([id, label, iconName]) => `
            <button class="${state.page === id ? "active" : ""}" data-route="${id}" type="button">
              ${icon(iconName)}<span>${safeText(label)}</span>
            </button>
          `).join("")}
        </nav>
        <div class="sidebar-utils">
          <button class="theme-toggle-btn" data-theme-toggle type="button">
            ${icon(state.theme === "dark" ? "sun" : "moon")}
            <span>${state.theme === "dark" ? "极光亮色" : "深空暗色"}</span>
          </button>
        </div>
        <div class="source-card ${state.feed.status}">
          <span>${statusDot(state.feed.status)}</span>
          <strong>${feedStatusLabel(state.feed.status)}</strong>
          <small>${safeText(state.feed.message)}</small>
        </div>
      </aside>
      <main class="main">
        ${content}
      </main>
    </div>
  `;
}

export function topbar({ kicker, title, subtitle, actions = "" }) {
  return `
    <header class="topbar">
      <div>
        <p class="kicker">${safeText(kicker)}</p>
        <h1 class="page-title">${safeText(title)}</h1>
        <p class="page-subtitle">${safeText(subtitle)}</p>
      </div>
      <div class="toolbar">${actions}</div>
    </header>
  `;
}

export function metric(label, value, hint, tone = "") {
  return `
    <article class="metric-card ${tone}">
      <span>${safeText(label)}</span>
      <strong>${safeText(value)}</strong>
      <small>${safeText(hint)}</small>
    </article>
  `;
}

export function panel(title, subtitle, body, className = "") {
  return `
    <section class="panel ${className}">
      <div class="panel-title"><h2>${safeText(title)}</h2><small>${safeText(subtitle)}</small></div>
      ${body}
    </section>
  `;
}

export function searchBox(value, placeholder = "搜索") {
  return `
    <label class="search-box">
      ${icon("search")}
      <input type="search" value="${safeText(value)}" placeholder="${safeText(placeholder)}" data-search />
    </label>
  `;
}

export function groupFilter(value, groups) {
  return `
    <label class="field">
      <span>小组</span>
      <select data-group-filter>
        <option value="all" ${value === "all" ? "selected" : ""}>全部小组</option>
        ${groups.map((group) => `<option value="${group}" ${value === group ? "selected" : ""}>${group} 组</option>`).join("")}
      </select>
    </label>
  `;
}

export function progress(label, value, tone = "") {
  const width = Math.max(4, Math.min(100, Number(value) || 0));
  return `
    <div class="progress-row">
      <span>${safeText(label)}</span>
      <div class="bar"><i class="${tone}" style="width:${width}%"></i></div>
      <strong>${Math.round(width)}%</strong>
    </div>
  `;
}

export function gapChip(value) {
  const tone = value >= 0 ? "good" : "bad";
  return `<span class="chip ${tone}">${signed(value)}%</span>`;
}

export function statusDot(status) {
  const tone = status === "live" ? "good" : status === "error" ? "bad" : status === "loading" ? "warn" : "muted";
  return `<i class="status-dot ${tone}"></i>`;
}

export function feedStatusLabel(status) {
  if (status === "live") return "实时源已连接";
  if (status === "cached") return "使用缓存";
  if (status === "error") return "数据源异常";
  if (status === "loading") return "正在同步";
  return "使用估算";
}
