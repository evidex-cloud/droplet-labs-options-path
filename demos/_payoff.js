// demos/_payoff.js —— 共享损益图引擎（被各 payoff 演示 import）
// 一切期权可视化的核心：把若干"腿"(legs)在到期日的盈亏画成 SVG。
// 盈利区填绿、亏损区填红、P&L 曲线用品牌青；自动标注行权价、盈亏平衡点、当前价。
// 设计与 styles.css 的 .payoff 类配合（颜色全走 CSS 变量）。

// 单腿到期盈亏（每股口径）。leg: {type:'call'|'put'|'stock', side:'long'|'short', strike, premium, qty, entry}
export function legPL(leg, S) {
  const q = leg.qty == null ? 1 : leg.qty;
  const sgn = leg.side === "short" ? -1 : 1;
  if (leg.type === "stock") return sgn * (S - leg.entry) * q;
  const intrinsic = leg.type === "put" ? Math.max(leg.strike - S, 0) : Math.max(S - leg.strike, 0);
  return sgn * (intrinsic - leg.premium) * q; // 多头=内在−权利金；空头取反
}

// 组合净盈亏
export function netPL(legs, S) {
  let a = 0;
  for (const leg of legs) a += legPL(leg, S);
  return a;
}

// 找盈亏平衡点（P&L 过零）——线性插值
function breakevens(legs, lo, hi, samples) {
  const out = [];
  let prev = netPL(legs, lo), prevX = lo;
  for (let i = 1; i <= samples; i++) {
    const x = lo + (hi - lo) * (i / samples);
    const y = netPL(legs, x);
    if ((prev <= 0 && y > 0) || (prev >= 0 && y < 0)) {
      const t = prev / (prev - y);
      out.push(prevX + (x - prevX) * t);
    }
    prev = y; prevX = x;
  }
  return out;
}

const fmt = (v) => {
  const a = Math.abs(v);
  if (a >= 1000) return (v < 0 ? "-" : "") + (a / 1000).toFixed(a >= 10000 ? 0 : 1) + "k";
  if (a >= 100) return v.toFixed(0);
  if (a >= 10) return v.toFixed(1);
  return v.toFixed(2);
};

// 生成损益图 SVG。返回 { svg, breakevens, ymin, ymax }
export function payoffSVG(o) {
  const W = o.W || 580, H = o.H || 300;
  const mL = 48, mR = 16, mT = 16, mB = 34;
  const plotL = mL, plotR = W - mR, plotT = mT, plotB = H - mB;
  const lo = o.lo, hi = o.hi, legs = o.legs;
  const N = o.samples || 180;
  const uid = o.uid || "pf";

  // 采样曲线
  const xs = [], ys = [];
  for (let i = 0; i <= N; i++) { const x = lo + (hi - lo) * (i / N); xs.push(x); ys.push(netPL(legs, x)); }
  let ymin = Math.min(...ys), ymax = Math.max(...ys);
  if (ymin === ymax) { ymin -= 1; ymax += 1; }
  const pad = (ymax - ymin) * 0.16; ymin -= pad; ymax += pad;
  if (ymin > 0) ymin = -pad; if (ymax < 0) ymax = pad; // 保证零线在图内

  const xMap = (x) => plotL + (x - lo) / (hi - lo) * (plotR - plotL);
  const yMap = (y) => plotB - (y - ymin) / (ymax - ymin) * (plotB - plotT);
  const zeroY = yMap(0);

  const pts = xs.map((x, i) => `${xMap(x).toFixed(1)},${yMap(ys[i]).toFixed(1)}`);
  const curve = pts.join(" ");
  // 面积多边形（曲线 ↔ 零线），用上下半区 clip 分别染绿/红
  const area = `M ${xMap(lo).toFixed(1)},${zeroY.toFixed(1)} L ${pts.join(" L ")} L ${xMap(hi).toFixed(1)},${zeroY.toFixed(1)} Z`;

  const bes = breakevens(legs, lo, hi, 600);

  // 网格 + x 轴价格标签
  let grid = "", xlab = "";
  const xticks = 6;
  for (let i = 0; i <= xticks; i++) {
    const x = lo + (hi - lo) * (i / xticks);
    const px = xMap(x);
    grid += `<line class="grid" x1="${px.toFixed(1)}" y1="${plotT}" x2="${px.toFixed(1)}" y2="${plotB}"/>`;
    xlab += `<text class="lbl-axis" x="${px.toFixed(1)}" y="${plotB + 16}" text-anchor="middle">${fmt(x)}</text>`;
  }
  // y 轴标签：ymin / 0 / ymax
  let ylab = "";
  for (const yv of [ymin + pad * 0.2, 0, ymax - pad * 0.2]) {
    ylab += `<text class="lbl-axis" x="${plotL - 6}" y="${(yMap(yv) + 3).toFixed(1)}" text-anchor="end">${fmt(yv)}</text>`;
  }

  // 行权价竖线
  const strikes = [...new Set(legs.filter((l) => l.type !== "stock").map((l) => l.strike))];
  let strikeMarks = "";
  for (const k of strikes) {
    if (k < lo || k > hi) continue;
    const px = xMap(k);
    strikeMarks += `<line class="strike-tick" x1="${px.toFixed(1)}" y1="${plotT}" x2="${px.toFixed(1)}" y2="${plotB}"/>`
      + `<text class="lbl-strike" x="${px.toFixed(1)}" y="${plotT + 10}" text-anchor="middle">K=${fmt(k)}</text>`;
  }

  // 盈亏平衡点
  let beMarks = "";
  for (const b of bes) {
    const px = xMap(b);
    beMarks += `<circle class="be-dot" cx="${px.toFixed(1)}" cy="${zeroY.toFixed(1)}" r="3.5"/>`
      + `<text class="lbl-be" x="${px.toFixed(1)}" y="${zeroY - 7 < plotT + 12 ? zeroY + 16 : zeroY - 7}" text-anchor="middle">BE ${fmt(b)}</text>`;
  }

  // 当前价标记
  let spotMark = "";
  if (o.spot != null && o.spot >= lo && o.spot <= hi) {
    const px = xMap(o.spot);
    spotMark = `<line class="marker" x1="${px.toFixed(1)}" y1="${plotT}" x2="${px.toFixed(1)}" y2="${plotB}" style="stroke:var(--muted)"/>`
      + `<text class="lbl-axis" x="${px.toFixed(1)}" y="${plotT - 4}" text-anchor="middle" style="fill:var(--muted)">${o.spotLabel || "现价"} ${fmt(o.spot)}</text>`;
  }

  const svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
    <defs>
      <clipPath id="${uid}-up"><rect x="${plotL}" y="${plotT}" width="${plotR - plotL}" height="${(zeroY - plotT).toFixed(1)}"/></clipPath>
      <clipPath id="${uid}-dn"><rect x="${plotL}" y="${zeroY.toFixed(1)}" width="${plotR - plotL}" height="${(plotB - zeroY).toFixed(1)}"/></clipPath>
    </defs>
    ${grid}
    <path class="curve-profit" d="${area}" clip-path="url(#${uid}-up)"/>
    <path class="curve-loss" d="${area}" clip-path="url(#${uid}-dn)"/>
    <line class="axis" x1="${plotL}" y1="${plotT}" x2="${plotL}" y2="${plotB}"/>
    <line class="zero" x1="${plotL}" y1="${zeroY.toFixed(1)}" x2="${plotR}" y2="${zeroY.toFixed(1)}"/>
    ${strikeMarks}
    ${spotMark}
    <polyline class="pl-line" points="${curve}"/>
    ${beMarks}
    ${ylab}
    ${xlab}
  </svg>`;

  return { svg, breakevens: bes, ymin, ymax };
}

// 便捷：把 {svg} 包成带图例的完整 payoff 卡片片段
export function payoffBlock(res, legendItems) {
  const legend = (legendItems || [
    ["var(--green-soft)", "盈利 / Profit"],
    ["var(--red-soft)", "亏损 / Loss"],
  ]).map(([c, t]) => `<span><i style="background:${c}"></i>${t}</span>`).join("");
  return `<div class="payoff">${res.svg}<div class="payoff-legend">${legend}</div></div>`;
}
