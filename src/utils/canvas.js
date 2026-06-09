import { matchModel, upsetRisk } from "../domain/model.js";
import { formatTime, dateLabel } from "./format.js";

export function exportMatchCardAsPng(state, match) {
  const model = matchModel(state, match);
  const risk = upsetRisk(state, match, model);
  
  const home = state.teams.find((t) => t.id === match.home);
  const away = state.teams.find((t) => t.id === match.away);

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 500;
  const ctx = canvas.getContext("2d");

  // 1. Draw Deep Space Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 800, 500);
  bgGrad.addColorStop(0, "#080c14");
  bgGrad.addColorStop(0.5, "#0b0f19");
  bgGrad.addColorStop(1, "#121824");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 800, 500);

  // 2. Draw Ambient Glows (Neon Circles)
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  
  // Left Blue Glow
  const blueGlow = ctx.createRadialGradient(200, 250, 50, 200, 250, 300);
  blueGlow.addColorStop(0, "rgba(59, 130, 246, 0.18)");
  blueGlow.addColorStop(1, "rgba(59, 130, 246, 0)");
  ctx.fillStyle = blueGlow;
  ctx.beginPath();
  ctx.arc(200, 250, 300, 0, Math.PI * 2);
  ctx.fill();

  // Right Green Glow
  const greenGlow = ctx.createRadialGradient(600, 250, 50, 600, 250, 300);
  greenGlow.addColorStop(0, "rgba(16, 185, 129, 0.15)");
  greenGlow.addColorStop(1, "rgba(16, 185, 129, 0)");
  ctx.fillStyle = greenGlow;
  ctx.beginPath();
  ctx.arc(600, 250, 300, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();

  // 3. Draw Glassmorphic Card Container
  ctx.save();
  // Fill glass layer
  ctx.fillStyle = "rgba(17, 25, 40, 0.65)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(40, 40, 720, 420, 16);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 4. Header Text (Kicker & Title)
  ctx.fillStyle = "#2dd4bf"; // Cyan brand
  ctx.font = "bold 13px Inter, sans-serif";
  ctx.fillText("WORLD CUP 2026 • MODEL SIMULATION", 70, 85);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px Inter, system-ui";
  ctx.fillText("世界杯数据洞察海报", 70, 120);

  // Venue & Info
  ctx.fillStyle = "#9ca3af";
  ctx.font = "13px Inter, sans-serif";
  const dateStr = new Date(match.kickoff).toLocaleString("zh-CN", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
  ctx.fillText(`${match.group} 组  •  ${dateStr}  •  ${match.venue || "官方指定场馆"}`, 70, 150);

  // 5. Versus Display (Team Names)
  ctx.textAlign = "center";
  
  // Home Team
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 34px Inter, system-ui";
  ctx.fillText(home.name, 230, 230);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "14px Inter, sans-serif";
  ctx.fillText(`FIFA ${home.fifa} / Elo ${home.elo}`, 230, 260);

  // VS Middle
  ctx.fillStyle = "#6b7280";
  ctx.font = "italic bold 28px Inter, sans-serif";
  ctx.fillText("VS", 400, 230);

  // Away Team
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 34px Inter, system-ui";
  ctx.fillText(away.name, 570, 230);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "14px Inter, sans-serif";
  ctx.fillText(`FIFA ${away.fifa} / Elo ${away.elo}`, 570, 260);

  // 6. Probability Badges
  const drawBadge = (x, val, title, color) => {
    // Glass card for badge
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.beginPath();
    ctx.roundRect(x - 90, 290, 180, 76, 10);
    ctx.fill();
    ctx.stroke();
    
    // Title
    ctx.fillStyle = "#9ca3af";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText(title, x, 316);
    
    // Value
    ctx.fillStyle = color;
    ctx.font = "bold 26px Inter, sans-serif";
    ctx.fillText(`${val}%`, x, 350);
    ctx.restore();
  };

  drawBadge(230, model.probs[0], `${home.name} 胜`, "#34d399"); // Green
  drawBadge(400, model.probs[1], "平局", "#fbbf24"); // Yellow
  drawBadge(570, model.probs[2], `${away.name} 胜`, "#60a5fa"); // Blue

  // 7. Confidence & Risk Footer
  ctx.textAlign = "left";
  ctx.fillStyle = "#9ca3af";
  ctx.font = "13px Inter, sans-serif";
  ctx.fillText(`模型置信度: ${model.confidence}%`, 70, 412);
  
  let riskColor = "#34d399";
  if (risk.score >= 55) riskColor = "#f87171";
  else if (risk.score >= 35) riskColor = "#fbbf24";
  ctx.fillStyle = riskColor;
  ctx.font = "bold 13px Inter, sans-serif";
  ctx.fillText(`冷门风险: ${risk.level} (${risk.score})`, 210, 412);

  // 8. Disclaimer / Brand info
  ctx.textAlign = "right";
  ctx.fillStyle = "#6b7280";
  ctx.font = "11px Inter, sans-serif";
  ctx.fillText("由 50,000 次蒙特卡洛模型仿真生成 • 观点差异仅作分歧参考 • 不构成投注建议", 730, 412);

  // Draw a small decorative accent line
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(40, 40, 8, 420); // vertical blue strip on the left edge of the card

  // Trigger Download
  const filename = `${home.name}_vs_${away.name}_insight.png`;
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
