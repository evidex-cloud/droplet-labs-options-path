// demos/_chart.js —— 共享折线图引擎（被希腊字母曲线、波动率微笑、时间衰减、蒙特卡洛等演示 import）
// 给一组 y=f(x) 曲线自动配坐标、网格、零线、可选竖直标记线。颜色全走 CSS 变量（.chart 类）。

const fmt = (v) => {
  const a = Math.abs(v);
  if (a >= 1000) return (v < 0 ? "-" : "") + (a / 1000).toFixed(a >= 10000 ? 0 : 1) + "k";
  if (a >= 100) return v.toFixed(0);
  if (a >= 1) return v.toFixed(a >= 10 ? 1 : 2);
  if (a === 0) return "0";
  return v.toFixed(3);
};

// o = { fns:[{f, cls, label}], lo, hi, W, H, samples, xlabel, markerX, markerLabel, forceZero }
// fns[i].f(x) → y。cls 见 styles.css：'line'(青) / 'line2'(金) / 'line3'(红)。
// 返回 { svg, ymin, ymax }
export function lineChart(o) {
  const W = o.W || 560, H = o.H || 280;
  const mL = 50, mR = 14, mT = 16, mB = 32;
  const plotL = mL, plotR = W - mR, plotT = mT, plotB = H - mB;
  const lo = o.lo, hi = o.hi, N = o.samples || 140;
  const fns = o.fns;
  const uid = o.uid || "ch";

  // 采样
  const series = fns.map((s) => {
    const pts = [];
    for (let i = 0; i <= N; i++) { const x = lo + (hi - lo) * (i / N); pts.push([x, s.f(x)]); }
    return { ...s, pts };
  });
  let ymin = Infinity, ymax = -Infinity;
  for (const s of series) for (const [, y] of s.pts) { if (isFinite(y)) { if (y < ymin) ymin = y; if (y > ymax) ymax = y; } }
  if (!isFinite(ymin) || !isFinite(ymax)) { ymin = -1; ymax = 1; }
  if (ymin === ymax) { ymin -= 1; ymax += 1; }
  if (o.forceZero) { if (ymin > 0) ymin = 0; if (ymax < 0) ymax = 0; }
  const pad = (ymax - ymin) * 0.12; ymin -= pad; ymax += pad;

  const xMap = (x) => plotL + (x - lo) / (hi - lo) * (plotR - plotL);
  const yMap = (y) => plotB - (y - ymin) / (ymax - ymin) * (plotB - plotT);

  // 网格 + x 标签
  let grid = "", xlab = "";
  const xticks = 6;
  for (let i = 0; i <= xticks; i++) {
    const x = lo + (hi - lo) * (i / xticks), px = xMap(x);
    grid += `<line class="grid" x1="${px.toFixed(1)}" y1="${plotT}" x2="${px.toFixed(1)}" y2="${plotB}"/>`;
    xlab += `<text class="lbl-axis" x="${px.toFixed(1)}" y="${plotB + 15}" text-anchor="middle">${fmt(x)}</text>`;
  }
  // y 标签：min/mid/max
  let ylab = "";
  for (const yv of [ymax - pad * 0.4, (ymin + ymax) / 2, ymin + pad * 0.4]) {
    ylab += `<text class="lbl-axis" x="${plotL - 6}" y="${(yMap(yv) + 3).toFixed(1)}" text-anchor="end">${fmt(yv)}</text>`;
  }
  // 零线
  let zero = "";
  if (ymin < 0 && ymax > 0) { const zy = yMap(0); zero = `<line class="zero" x1="${plotL}" y1="${zy.toFixed(1)}" x2="${plotR}" y2="${zy.toFixed(1)}"/>`; }

  // 曲线
  const lines = series.map((s) => {
    const pts = s.pts.filter(([, y]) => isFinite(y)).map(([x, y]) => `${xMap(x).toFixed(1)},${yMap(y).toFixed(1)}`).join(" ");
    return `<polyline class="${s.cls || "line"}" points="${pts}"/>`;
  }).join("");

  // 竖直标记线（如当前价）
  let marker = "";
  if (o.markerX != null && o.markerX >= lo && o.markerX <= hi) {
    const px = xMap(o.markerX);
    marker = `<line class="marker" x1="${px.toFixed(1)}" y1="${plotT}" x2="${px.toFixed(1)}" y2="${plotB}"/>`
      + (o.markerLabel ? `<text class="lbl-axis" x="${px.toFixed(1)}" y="${plotT - 3}" text-anchor="middle" style="fill:var(--accent-ink)">${o.markerLabel}</text>` : "");
  }
  // x 轴名
  const xname = o.xlabel ? `<text class="lbl-axis" x="${((plotL + plotR) / 2).toFixed(1)}" y="${H - 2}" text-anchor="middle">${o.xlabel}</text>` : "";

  const svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
    ${grid}
    <line class="axis" x1="${plotL}" y1="${plotT}" x2="${plotL}" y2="${plotB}"/>
    <line class="axis" x1="${plotL}" y1="${plotB}" x2="${plotR}" y2="${plotB}"/>
    ${zero}${marker}${lines}${ylab}${xlab}${xname}
  </svg>`;
  return { svg, ymin, ymax };
}

// 折线图 + 图例的便捷包装
export function chartBlock(res, legendItems) {
  const legend = (legendItems || []).map(([c, t]) =>
    `<span><i style="width:14px;height:3px;border-radius:2px;background:${c}"></i> ${t}</span>`).join("");
  return `<div class="chart">${res.svg}${legend ? `<div class="payoff-legend">${legend}</div>` : ""}</div>`;
}
