const paths = {
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  alert: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z M12 9v4 M12 17h.01",
  arrowLeft: "M19 12H5 M12 19l-7-7 7-7",
  calendar: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  chart: "M3 3v18h18 M7 15l4-4 3 3 5-7",
  chevronRight: "m9 18 6-6-6-6",
  cloud: "M17.5 19H7a5 5 0 1 1 1.1-9.88A7 7 0 0 1 21 12a4 4 0 0 1-3.5 7Z",
  filter: "M3 5h18 M6 12h12 M10 19h4",
  gauge: "M12 14l4-4 M3.34 19a10 10 0 1 1 17.32 0",
  refresh: "M21 12a9 9 0 0 1-15.5 6.3L3 16 M3 21v-5h5 M3 12A9 9 0 0 1 18.5 5.7L21 8 M21 3v5h-5",
  search: "m21 21-4.35-4.35 M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
  sparkles: "M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z M5 14l.9 2.1L8 17l-2.1.9L5 20l-.9-2.1L2 17l2.1-.9L5 14Z",
  trophy: "M8 21h8 M12 17v4 M7 4h10v4a5 5 0 0 1-10 0V4Z M5 5H3v2a4 4 0 0 0 4 4 M19 5h2v2a4 4 0 0 1-4 4",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
};

export function icon(name, className = "icon") {
  const path = paths[name] || paths.sparkles;
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${path}"/></svg>`;
}
