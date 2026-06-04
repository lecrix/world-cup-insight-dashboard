export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function safeText(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function pct(value, digits = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0%";
  return `${number.toFixed(digits)}%`;
}

export function signed(value, digits = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return `${number > 0 ? "+" : ""}${number.toFixed(digits)}`;
}

export function formatTime(value) {
  if (!value) return "未返回";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return safeText(value);
  return date.toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function dateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "pending";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateLabel(key) {
  if (!key || key === "pending") return "待定";
  const date = new Date(`${key}T00:00:00`);
  if (Number.isNaN(date.getTime())) return key;
  return date.toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "short" });
}

export function normalizeSearch(text) {
  return String(text ?? "").trim().toLowerCase();
}
