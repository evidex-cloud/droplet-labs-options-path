// demos/calendar-spread.js —— 日历价差 损益演示（需要 _bs.js）
// 卖近月 + 买远月（同行权价 K=100）。在“近月到期”时点：
//   组合P&L(S) = bsPrice(远月, 剩余T, IV) − max(S−K,0)[近月内在] − 初始净付出
// 因为远月那条腿还没到期、仍有时间价值，P&L 是一条弯曲的“驼峰”（不是折线）。
// 自定义 SVG 逐点采样画曲线；IV 滑块演示 +Vega（IV↑ 抬高驼峰）。标峰值/两个BE。
import { bsPrice } from "./_bs.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const K = 100, r = 0.04;
  const T_NEAR = 1 / 12;   // 近月：1 个月
  const T_FAR = 3 / 12;    // 远月：3 个月
  const T_REMAIN = T_FAR - T_NEAR; // 近月到期时远月剩余 2 个月
  const LO = 80, HI = 120;

  let iv = 0.25; // 隐含波动率（可调，演示 +Vega）

  // 初始净付出（建仓时，标的=100）
  function initCost(sigma) {
    const near = bsPrice({ S: 100, K, T: T_NEAR, r, sigma, type: "call" });
    const far = bsPrice({ S: 100, K, T: T_FAR, r, sigma, type: "call" });
    return far - near; // 每股净付出
  }

  // 近月到期时的组合 P&L（每股），给定标的 S 与远月 IV
  function plAtNearExpiry(S, sigma, cost) {
    const farVal = bsPrice({ S, K, T: T_REMAIN, r, sigma, type: "call" });
    const nearIntrinsic = Math.max(S - K, 0); // 卖出近月，到期付内在价值
    return farVal - nearIntrinsic - cost;
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📅 ${T("日历价差 · 交易时间（曲线 P&L）", "Calendar spread · trading time (curved P&L)")}</div>

      <div class="demo-meta" style="margin-bottom:10px">
        ${T("卖出 1 个月看涨 + 买入 3 个月看涨，同行权价 K=100。下图是<b>近月到期那天</b>的组合损益——远月腿还剩 2 个月时间价值，用 Black-Scholes 定价，所以是<b>弯的驼峰</b>。",
            "Sell a 1-month call + buy a 3-month call, same strike K=100. The chart is P&L <b>on the near leg's expiry day</b> — the far leg still has 2 months of time value, priced by Black-Scholes, so it is a <b>curved hump</b>.")}
      </div>

      <div class="demo-block">
        <div class="demo-label">${T("隐含波动率 IV（拖动看 +Vega）", "Implied volatility IV (drag to see +Vega)")} <b id="cal-ivv">${(iv * 100).toFixed(0)}%</b></div>
        <input class="demo-slider" id="cal-iv" type="range" min="12" max="45" step="1" value="${(iv * 100).toFixed(0)}"/>
      </div>

      <div class="chart" id="cal-chart"></div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("峰值利润", "Peak profit")}</div><div class="v pos" id="cal-mp">–</div></div>
        <div class="stat"><div class="k">${T("最大亏损≈净付出", "Max loss ≈ debit")}</div><div class="v neg" id="cal-ml">–</div></div>
        <div class="stat"><div class="k">${T("下盈亏平衡", "Lower BE")}</div><div class="v acc" id="cal-be1">–</div></div>
        <div class="stat"><div class="k">${T("上盈亏平衡", "Upper BE")}</div><div class="v acc" id="cal-be2">–</div></div>
        <div class="stat"><div class="k">${T("净付出", "Net debit")}</div><div class="v" id="cal-cost">–</div></div>
      </div>

      <p class="demo-tip" id="cal-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  // 自定义曲线 SVG（青色 P&L 线 + 绿/红填充 + 零线 + 行权价 + 峰值/BE 标注）
  function drawCurve(cost) {
    const W = 580, H = 300;
    const mL = 48, mR = 16, mT = 18, mB = 34;
    const plotL = mL, plotR = W - mR, plotT = mT, plotB = H - mB;
    const N = 200;

    const xs = [], ys = [];
    for (let i = 0; i <= N; i++) {
      const S = LO + (HI - LO) * (i / N);
      xs.push(S); ys.push(plAtNearExpiry(S, iv, cost));
    }
    let ymin = Math.min(...ys), ymax = Math.max(...ys);
    const pad = (ymax - ymin) * 0.18; ymin -= pad; ymax += pad;
    if (ymin > 0) ymin = -pad; if (ymax < 0) ymax = pad;

    const xMap = (x) => plotL + (x - LO) / (HI - LO) * (plotR - plotL);
    const yMap = (y) => plotB - (y - ymin) / (ymax - ymin) * (plotB - plotT);
    const zeroY = yMap(0);

    const pts = xs.map((x, i) => `${xMap(x).toFixed(1)},${yMap(ys[i]).toFixed(1)}`);
    const area = `M ${xMap(LO).toFixed(1)},${zeroY.toFixed(1)} L ${pts.join(" L ")} L ${xMap(HI).toFixed(1)},${zeroY.toFixed(1)} Z`;

    // 网格 + x 标签
    let grid = "", xlab = "";
    for (let i = 0; i <= 6; i++) {
      const x = LO + (HI - LO) * (i / 6), px = xMap(x);
      grid += `<line class="grid" x1="${px.toFixed(1)}" y1="${plotT}" x2="${px.toFixed(1)}" y2="${plotB}"/>`;
      xlab += `<text class="lbl-axis" x="${px.toFixed(1)}" y="${plotB + 16}" text-anchor="middle">${x.toFixed(0)}</text>`;
    }
    // 行权价竖线
    const kx = xMap(K);
    const strikeMark = `<line class="marker" x1="${kx.toFixed(1)}" y1="${plotT}" x2="${kx.toFixed(1)}" y2="${plotB}" style="stroke:var(--gold);stroke-dasharray:2 3"/>`
      + `<text class="lbl-axis" x="${kx.toFixed(1)}" y="${plotT + 10}" text-anchor="middle" style="fill:var(--gold)">K=100</text>`;

    // 峰值点
    let peakI = 0; for (let i = 1; i < ys.length; i++) if (ys[i] > ys[peakI]) peakI = i;
    const peakMark = `<circle cx="${xMap(xs[peakI]).toFixed(1)}" cy="${yMap(ys[peakI]).toFixed(1)}" r="3.5" style="fill:var(--accent)"/>`
      + `<text class="lbl-be" x="${xMap(xs[peakI]).toFixed(1)}" y="${(yMap(ys[peakI]) - 7).toFixed(1)}" text-anchor="middle">${T("峰值", "peak")}</text>`;

    // 盈亏平衡点（穿零）
    let beMarks = "";
    for (let i = 1; i < ys.length; i++) {
      if ((ys[i - 1] <= 0 && ys[i] > 0) || (ys[i - 1] >= 0 && ys[i] < 0)) {
        const t = ys[i - 1] / (ys[i - 1] - ys[i]);
        const bx = xs[i - 1] + (xs[i] - xs[i - 1]) * t;
        const px = xMap(bx);
        beMarks += `<circle class="dot" cx="${px.toFixed(1)}" cy="${zeroY.toFixed(1)}" r="3"/>`
          + `<text class="lbl-be" x="${px.toFixed(1)}" y="${(zeroY + 16).toFixed(1)}" text-anchor="middle">${bx.toFixed(1)}</text>`;
      }
    }

    // y 标签
    let ylab = "";
    for (const yv of [ymax - pad * 0.3, 0, ymin + pad * 0.3]) {
      ylab += `<text class="lbl-axis" x="${plotL - 6}" y="${(yMap(yv) + 3).toFixed(1)}" text-anchor="end">${(yv * MULT).toFixed(0)}</text>`;
    }

    const svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
      <defs>
        <clipPath id="cal-up"><rect x="${plotL}" y="${plotT}" width="${plotR - plotL}" height="${(zeroY - plotT).toFixed(1)}"/></clipPath>
        <clipPath id="cal-dn"><rect x="${plotL}" y="${zeroY.toFixed(1)}" width="${plotR - plotL}" height="${(plotB - zeroY).toFixed(1)}"/></clipPath>
      </defs>
      ${grid}
      <path class="area" d="${area}" clip-path="url(#cal-up)" style="fill:var(--green-soft)"/>
      <path class="area" d="${area}" clip-path="url(#cal-dn)" style="fill:var(--red-soft)"/>
      <line class="axis" x1="${plotL}" y1="${plotT}" x2="${plotL}" y2="${plotB}"/>
      <line class="zero" x1="${plotL}" y1="${zeroY.toFixed(1)}" x2="${plotR}" y2="${zeroY.toFixed(1)}"/>
      ${strikeMark}
      <polyline class="line" points="${pts.join(" ")}"/>
      ${peakMark}${beMarks}${ylab}${xlab}
    </svg>`;

    return { svg, peakProfit: ys[peakI], peakS: xs[peakI] };
  }

  function paint() {
    const cost = initCost(iv);
    const drawn = drawCurve(cost);
    $("#cal-chart").innerHTML = drawn.svg
      + `<div class="payoff-legend">`
      + `<span><i style="background:var(--accent)"></i>${T("近月到期P&L", "P&L at near expiry")}</span>`
      + `<span><i style="background:var(--green-soft)"></i>${T("盈利", "Profit")}</span>`
      + `<span><i style="background:var(--red-soft)"></i>${T("亏损", "Loss")}</span>`
      + `</div>`;

    // 最大亏损 ≈ 净付出（标的冲到极远，远月时间价值被挤光）
    const tailLoss = plAtNearExpiry(LO - 25, iv, cost); // 远离行权价的尾部
    // 盈亏平衡点
    const bes = [];
    let prevY = plAtNearExpiry(LO, iv, cost), prevS = LO;
    for (let i = 1; i <= 800; i++) {
      const S = LO + (HI - LO) * (i / 800), y = plAtNearExpiry(S, iv, cost);
      if ((prevY <= 0 && y > 0) || (prevY >= 0 && y < 0)) {
        const t = prevY / (prevY - y); bes.push(prevS + (S - prevS) * t);
      }
      prevY = y; prevS = S;
    }

    $("#cal-mp").textContent = "+$" + (drawn.peakProfit * MULT).toFixed(0);
    $("#cal-ml").textContent = "−$" + Math.abs(tailLoss * MULT).toFixed(0);
    $("#cal-be1").textContent = bes.length ? bes[0].toFixed(1) : "—";
    $("#cal-be2").textContent = bes.length > 1 ? bes[1].toFixed(1) : "—";
    $("#cal-cost").textContent = "−$" + (cost * MULT).toFixed(0);

    $("#cal-tip").innerHTML = T(
      `峰值利润 <b>+$${(drawn.peakProfit * MULT).toFixed(0)}</b> 出现在标的钉在行权价 <b>100</b> 附近（近月归零、远月保住时间价值）。冲出 <b>${bes.length ? bes[0].toFixed(1) : "?"}~${bes.length > 1 ? bes[1].toFixed(1) : "?"}</b> 就转亏；标的剧烈单边运动时最痛（最大亏损≈净付出 $${(cost * MULT).toFixed(0)}）。<b>拖动 IV 滑块：IV 越高，整条驼峰被抬得越高——这就是日历价差的 +Vega。</b>`,
      `Peak profit <b>+$${(drawn.peakProfit * MULT).toFixed(0)}</b> sits where the underlying pins near strike <b>100</b> (near leg dies, far leg keeps its time value). Outside <b>${bes.length ? bes[0].toFixed(1) : "?"}~${bes.length > 1 ? bes[1].toFixed(1) : "?"}</b> it turns to a loss; a violent one-way move hurts most (max loss ≈ debit $${(cost * MULT).toFixed(0)}). <b>Drag the IV slider: higher IV lifts the whole hump — that is the calendar's +Vega.</b>`
    );
  }

  $("#cal-iv").addEventListener("input", (e) => { iv = +e.target.value / 100; $("#cal-ivv").textContent = (iv * 100).toFixed(0) + "%"; paint(); });

  paint();
}
