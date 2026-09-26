// Main demo for lesson margin-liquidation: liquidation-price calculator (isolated / cross, long / short, funding drift)
// plus a path simulator that shows how often a random 30-day path touches the liquidation line.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const P0 = 100000, Q = 1, SIG = 0.5, FUND = 0.0001; // illustrative BTC, 1 BTC, 50% vol, +0.01% per 8h
  let side = "long", mode = "iso", seed = 11, cloud = null;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("强平价计算器 + 路径模拟（BTC 示意价 100,000 美元，1 BTC）", "Liquidation calculator + path simulator (illustrative BTC $100,000, 1 BTC)")}</div>
    <div class="demo-row">${seg("ml-side", [["long", T("多单", "Long")], ["short", T("空单", "Short")]], side)}
      ${seg("ml-mode", [["iso", T("逐仓", "Isolated")], ["cross", T("全仓", "Cross")]], mode)}</div>
    <div class="demo-grid">
      ${slider("ml-lev", T("杠杆 L", "Leverage L"), 1, 100, 1, 10)}
      ${slider("ml-mmr", T("维持保证金率 m", "Maintenance rate m"), 0.2, 2, 0.1, 0.5)}
      ${slider("ml-extra", T("账户里其余的钱（全仓时参与兜底）", "Rest of the account (backs the position in cross)"), 0, 50000, 1000, 20000)}
      ${slider("ml-days", T("已持仓天数（资金费 +0.01%/8h）", "Days held (funding +0.01%/8h)"), 0, 60, 1, 0)}
    </div>
    <div class="demo-math" id="ml-f"></div>
    <div id="ml-stats"></div>
    <div class="demo-label" style="margin-top:10px">${T("30 天路径（波动率 50%、无漂移，每小时一步；强平按“碰到”判定）", "30-day paths (50% vol, no drift, hourly steps; liquidation on the first touch)")}</div>
    <div class="demo-btns"><button class="demo-btn" data-act="path">${T("换一条路径", "New path")}</button><button class="demo-btn" data-act="cloud">${T("跑 1,000 条路径", "Run 1,000 paths")}</button></div>
    <div id="ml-chart"></div>
    <div id="ml-cloud" class="demo-out-sm"></div>
    <p class="demo-tip">${T("试试：把杠杆从 10 拉到 20，强平空间从 9.5% 缩到 4.5%，“30 天内碰到”的概率从约 51% 跳到约 77%；再切到全仓，看强平价往下挪了多少、最大亏损又涨了多少。", "Try this: move leverage from 10 to 20 — the room shrinks from 9.5% to 4.5% and the 30-day touch probability jumps from about 51% to about 77%. Then switch to cross and see how far the line moves, and how much larger the worst-case loss becomes.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const money = (x) => "$" + Math.round(x).toLocaleString("en-US");
  let cur = null;

  const compute = (v) => {
    const L = v["ml-lev"], m = v["ml-mmr"] / 100, extra = v["ml-extra"], days = v["ml-days"];
    const long = side === "long", M = (Q * P0) / L;
    const fund = FUND * 3 * days * Q * P0;            // positive funding: longs pay, shorts receive
    const B = (mode === "iso" ? M : M + extra) + (long ? -fund : fund);
    const cushion = (B - m * Q * P0) / Q;               // how far the price can move against you
    const liq = long ? P0 - cushion : P0 + cushion;
    const room = cushion / P0;
    return { L, m, extra, days, long, M, fund, B, liq, room, maxLoss: Math.max(0, B) };
  };

  const drawPath = () => {
    const c = cur, R = O.rng(seed), steps = 720, Tm = 30 / 365;
    const path = O.gbmPath(R, P0, 0, SIG, Tm, steps);
    let hit = -1;
    for (let i = 0; i < path.length; i++) if (c.long ? path[i] <= c.liq : path[i] >= c.liq) { hit = i; break; }
    const pts = path.map((p, i) => [(i / steps) * 30, p]);
    const alive = hit < 0 ? pts : pts.slice(0, hit + 1), after = hit < 0 ? [] : pts.slice(hit);
    const lo = Math.min(...path, c.long ? c.liq : P0) * 0.98, hi = Math.max(...path, c.long ? P0 : c.liq) * 1.02;
    $("#ml-chart").innerHTML = lineChart({
      xmin: 0, xmax: 30, ymin: Math.max(0, lo), ymax: hi, xlabel: T("天", "days"), ylabel: T("BTC 标记价", "BTC mark price"),
      yfmt: (y) => Math.round(y / 1000) + "k",
      series: [
        { points: alive, cls: 0, label: T("你持有的部分", "while you hold it") },
        ...(after.length ? [{ points: after, cls: 5, dashed: true, label: T("被强平后的走势（与你无关）", "after liquidation (not yours)") }] : []),
      ],
      hlines: [{ y: P0, label: T("开仓价", "entry") }, { y: c.liq, label: T("强平价 ", "liquidation ") + money(c.liq) }],
      points: hit >= 0 ? [{ x: pts[hit][0], y: pts[hit][1], cls: 2, label: T("强平！第 ", "liquidated, day ") + pts[hit][0].toFixed(1) + T(" 天", "") }] : [],
    });
  };

  const runCloud = () => {
    const c = cur, R = O.rng(1000 + seed), N = 1000, steps = 720, Tm = 30 / 365;
    let touched = 0, endBeyond = 0;
    for (let k = 0; k < N; k++) {
      const path = O.gbmPath(R, P0, 0, SIG, Tm, steps);
      let hit = false;
      for (let i = 0; i < path.length; i++) if (c.long ? path[i] <= c.liq : path[i] >= c.liq) { hit = true; break; }
      if (hit) touched++;
      const e = path[steps];
      if (c.long ? e <= c.liq : e >= c.liq) endBeyond++;
    }
    const theory = c.liq > 0 ? O.probTouch(P0, c.liq, Tm, SIG, 0) : 0;
    cloud = { touched: touched / N, endBeyond: endBeyond / N, theory };
    showCloud();
  };
  const showCloud = () => {
    if (!cloud) { $("#ml-cloud").innerHTML = T("按“跑 1,000 条路径”，数一数有多少条路径碰到了强平线。", "Press “Run 1,000 paths” to count how many paths touch the liquidation line."); return; }
    $("#ml-cloud").innerHTML = stats([
      [T("模拟：30 天内碰到强平线", "Simulated: touched within 30 days"), (cloud.touched * 100).toFixed(1) + "%", "neg"],
      [T("公式（反射原理）", "Formula (reflection principle)"), (cloud.theory * 100).toFixed(1) + "%"],
      [T("只看第 30 天：收在线外", "Day-30 snapshot only: ends beyond the line"), (cloud.endBeyond * 100).toFixed(1) + "%"],
    ]);
  };

  const draw = (v) => {
    const c = compute(v); cur = c; cloud = null;
    const Ls = String(c.L), ms = c.m.toFixed(3);
    const fw = T("资金费", "funding");
    const fundTerm = c.fund ? String.raw` + \tfrac{\text{${fw}}}{Q}` : "";
    const fundNum = c.fund ? " + " + Math.round(c.fund) : "";
    const liqTex = Math.round(c.liq).toLocaleString("en-US").replace(/,/g, "{,}");
    const sgn = c.long ? "-" : "+", sgn2 = c.long ? "+" : "-";
    let f;
    if (mode === "iso") f = String.raw`P_{\text{liq}} = P_0\left(1 ${sgn} \tfrac{1}{L} ${sgn2} m\right)${fundTerm} = 100{,}000\left(1 ${sgn} \tfrac{1}{${Ls}} ${sgn2} ${ms}\right)${fundNum} = ${liqTex}`;
    else f = String.raw`P_{\text{liq}} = P_0 ${sgn} \frac{B - m\,Q\,P_0}{Q} = 100{,}000 ${sgn} \frac{${Math.round(c.B)} - ${Math.round(c.m * P0)}}{1} = ${liqTex}`;
    $("#ml-f").innerHTML = tex(f, true);
    const dailyZ = c.room / (SIG / Math.sqrt(365));
    const pTouch = c.liq > 0 ? O.probTouch(P0, c.liq, 30 / 365, SIG, 0) : 0;
    $("#ml-stats").innerHTML = stats([
      [T("初始保证金 = 名义 ÷ L", "Initial margin = notional ÷ L"), money(c.M)],
      [T("强平价", "Liquidation price"), c.liq > 0 ? money(c.liq) : T("无（跌到 0 也不强平）", "none above $0"), "acc"],
      [T("离强平的空间", "Room to liquidation"), (c.room * 100).toFixed(2) + "%"],
      [T("相当于几个日波动 σ", "Room in daily moves (σ)"), dailyZ.toFixed(1)],
      [T("30 天内碰到的概率", "P(touch within 30 days)"), (pTouch * 100).toFixed(1) + "%", pTouch > 0.3 ? "neg" : ""],
      [T("被强平时大约亏掉", "Loss if liquidated ≈"), money(c.maxLoss), "neg"],
    ]) + (c.fund ? `<p class="demo-meta">${c.long ? T("多头已付资金费 ", "Funding paid by the long: ") : T("空头已收资金费 ", "Funding received by the short: ")}${money(c.fund)}${T("，已计入保证金。", " — already booked into the margin.")}</p>` : "");
    drawPath();
    showCloud();
  };

  const spec = { "ml-lev": (x) => x + "×", "ml-mmr": (x) => (+x).toFixed(1) + "%", "ml-extra": (x) => money(x), "ml-days": (x) => x + T(" 天", " days") };
  const run = bindSliders(root, spec, draw);
  onSeg(root, "ml-side", (v) => { side = v; run(); });
  onSeg(root, "ml-mode", (v) => { mode = v; run(); });
  root.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.act === "path") { seed += 1; drawPath(); }
    else runCloud();
  }));
}
