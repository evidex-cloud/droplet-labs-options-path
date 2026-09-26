// Main demo for lesson options-data: clean a messy XYZ chain.
// A 30-day chain is generated from Black-Scholes with a mild skew, then five realistic data errors are injected.
// Each cleaning rule can be switched on/off; flagged quotes are highlighted and dropped from the IV smile.
import * as O from "./_opt.js";
import { lineChart, stats, tex } from "./_viz.js";

const S = 100, r = 0.04, Tm = 30 / 365;
const F = O.forward(S, Tm, r);
export const trueVol = (K) => { const k = Math.log(K / F); return 0.2 - 0.25 * k + 1.0 * k * k; };
const tick = (p) => (p < 3 ? 0.01 : 0.05);
const floorT = (p) => Math.max(0, Math.floor(p / tick(p) + 1e-9) * tick(p));
const ceilT = (p) => Math.ceil(p / tick(p) - 1e-9) * tick(p);

// Build the chain: one row per strike with call/put bid, ask and a "last" trade.
export function buildChain() {
  const rows = [];
  for (let K = 80; K <= 120; K += 5) {
    const v = trueVol(K);
    const c = O.bsPrice({ S, K, T: Tm, r, sigma: v, type: "call" }), p = O.bsPrice({ S, K, T: Tm, r, sigma: v, type: "put" });
    const half = (m) => Math.max(0.025, 0.02 * m + 0.01);
    rows.push({
      K, vTrue: v,
      cb: floorT(c - half(c)), ca: ceilT(c + half(c)), cl: +c.toFixed(2),
      pb: floorT(p - half(p)), pa: ceilT(p + half(p)), pl: +p.toFixed(2),
      err: {},
    });
  }
  const at = (K) => rows.find((x) => x.K === K);
  // 1) crossed quote on the 105 call (bid above ask)
  at(105).cb = 0.66; at(105).ca = 0.62; at(105).err.c = "crossed";
  // 2) stale / bad quote on the 115 call: priced above the 110 call → monotonicity breach
  at(115).cb = 0.22; at(115).ca = 0.32; at(115).err.c = "mono";
  // 3) zero bid on the 85 put
  at(85).pb = 0; at(85).pa = 0.05; at(85).err.p = "zero";
  // 4) bad print on the 90 call: whole quote shifted up 0.60 → parity breach
  at(90).cb += 0.6; at(90).ca += 0.6; at(90).err.c = "parity";
  // 5) very wide put quote at 95
  at(95).pb = 0.4; at(95).pa = 0.9; at(95).err.p = "wide";
  // stale last trade on the 100 put (from the morning, when XYZ was higher)
  at(100).pl = 1.8;
  return rows;
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const rules = [
    ["crossed", T("交叉/锁定报价（买价 ≥ 卖价）", "Crossed/locked (bid ≥ ask)")],
    ["zero", T("零买价", "Zero bid")],
    ["wide", T("价差 > 中间价的 50%", "Spread > 50% of mid")],
    ["mono", T("单调性（看涨随 K 递减）", "Monotonicity (calls fall with K)")],
    ["parity", T("平价偏离 > 0.10", "Parity gap > 0.10")],
  ];
  const on = { crossed: true, zero: true, wide: true, mono: true, parity: true };
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("清洗一条脏期权链（XYZ，30 天，示意数据）", "Clean a messy chain (XYZ, 30 days, illustrative data)")}</div>
    <div class="demo-label">${T("清洗规则（点击开/关）", "Cleaning rules (click to switch on/off)")}</div>
    <div class="demo-btns" id="od-rules">${rules.map(([k, l]) => `<button type="button" class="demo-btn on" data-rule="${k}" aria-pressed="true">${l}</button>`).join("")}</div>
    <div id="od-table"></div>
    <div class="demo-math" id="od-f"></div>
    <div id="od-stats"></div>
    <div id="od-chart"></div>
    <p class="demo-tip">${T("试试：把“单调性”关掉，看 115 看涨那个离谱的隐含波动率点跳回微笑图里；再关掉“平价偏离”，90 看涨的坏报价就溜进了数据。每条规则都来自一条无套利关系。", "Try this: switch off Monotonicity and watch the absurd IV point at the 115 call jump back into the smile; switch off the parity check and the bad 90 call quote slips into your data. Every rule comes from a no-arbitrage relation.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const rows = buildChain();
  const mid = (b, a) => (b + a) / 2;

  const flagsOf = () => {
    // returns per row {c: [reasons], p: [reasons]}
    const res = rows.map(() => ({ c: [], p: [] }));
    rows.forEach((x, i) => {
      for (const side of ["c", "p"]) {
        const b = x[side + "b"], a = x[side + "a"], m = mid(b, a);
        if (on.crossed && b >= a) res[i][side].push("crossed");
        if (on.zero && b <= 0) res[i][side].push("zero");
        if (on.wide && b < a && (a - b) / m > 0.5) res[i][side].push("wide");
      }
    });
    if (on.mono) {
      // a call mid must not exceed the mid of the call one strike below (and puts the reverse)
      for (let i = 1; i < rows.length; i++) {
        if (mid(rows[i].cb, rows[i].ca) > mid(rows[i - 1].cb, rows[i - 1].ca) + 1e-9) res[i].c.push("mono");
        if (mid(rows[i - 1].pb, rows[i - 1].pa) > mid(rows[i].pb, rows[i].pa) + 1e-9) res[i - 1].p.push("mono");
      }
    }
    if (on.parity) {
      const df = Math.exp(-r * Tm);
      rows.forEach((x, i) => {
        const gap = mid(x.cb, x.ca) - mid(x.pb, x.pa) - df * (Fimp - x.K);
        if (Math.abs(gap) > 0.1) { (x.K < Fimp ? res[i].c : res[i].p).push("parity"); }
      });
    }
    return res;
  };
  // implied forward from the strike where |C − P| is smallest (as in the Cboe VIX method)
  let best = rows[0];
  for (const x of rows) if (Math.abs(mid(x.cb, x.ca) - mid(x.pb, x.pa)) < Math.abs(mid(best.cb, best.ca) - mid(best.pb, best.pa))) best = x;
  const cpd = mid(best.cb, best.ca) - mid(best.pb, best.pa);
  const Fimp = best.K + Math.exp(r * Tm) * cpd;

  const label = { crossed: T("交叉", "crossed"), zero: T("零买价", "zero bid"), wide: T("过宽", "wide"), mono: T("单调", "monotone"), parity: T("平价", "parity") };
  const draw = () => {
    const fl = flagsOf();
    const cell = (x, side, i) => {
      const b = x[side + "b"], a = x[side + "a"], f = fl[i][side];
      const tags = f.map((k) => `<span class="tag bad">${label[k]}</span>`).join(" ");
      return `<td${f.length ? ' style="background:var(--red-soft)"' : ""}>${b.toFixed(2)} / ${a.toFixed(2)}</td><td>${x[side + "l"].toFixed(2)}</td><td style="text-align:left">${tags}</td>`;
    };
    $("#od-table").innerHTML = `<table style="white-space:nowrap"><thead><tr><th>${T("看涨 买/卖", "Call bid / ask")}</th><th>${T("最新成交", "Last")}</th><th></th><th style="text-align:center">K</th><th>${T("看跌 买/卖", "Put bid / ask")}</th><th>${T("最新成交", "Last")}</th><th></th></tr></thead><tbody>${rows.map((x, i) => {
      const c = cell(x, "c", i).split("</td>");
      return `<tr${x.K === best.K ? ' class="hl"' : ""}>${c[0]}</td>${c[1]}</td>${c[2]}</td><td style="text-align:center"><b>${x.K}</b></td>${cell(x, "p", i)}</tr>`;
    }).join("")}</tbody></table>`;
    $("#od-f").innerHTML = tex(String.raw`F_{\text{imp}} = K^{*} + e^{rT}\,(C_{\text{mid}} - P_{\text{mid}}) = ${best.K} + e^{0.04 \times 30/365} \times ${cpd.toFixed(3)} = ${Fimp.toFixed(2)}`, true);
    const nFlag = fl.reduce((a, f) => a + (f.c.length ? 1 : 0) + (f.p.length ? 1 : 0), 0);
    // OTM smile: puts below the forward, calls above
    const raw = [], clean = [];
    rows.forEach((x, i) => {
      const side = x.K < Fimp ? "p" : "c", m = mid(x[side + "b"], x[side + "a"]);
      if (m <= 0) return;
      const iv = O.impliedVol(m, { S, K: x.K, T: Tm, r, type: side === "c" ? "call" : "put" });
      if (!isFinite(iv) || iv <= 0) return;
      raw.push([x.K, iv * 100]);
      if (!fl[i][side].length) clean.push([x.K, iv * 100]);
    });
    $("#od-stats").innerHTML = stats([
      [T("被标记的报价", "Flagged quotes"), String(nFlag), nFlag ? "neg" : "pos"],
      [T("进入曲面的虚值报价", "OTM quotes kept"), `${clean.length} / ${raw.length}`],
      [T("隐含远期", "Implied forward"), Fimp.toFixed(2), "acc"],
      [T("模型远期", "Model forward"), F.toFixed(2)],
    ]);
    $("#od-chart").innerHTML = lineChart({
      xmin: 78, xmax: 122, ymin: 0, xlabel: T("行权价 K", "Strike K"), ylabel: T("隐含波动率 %", "Implied vol %"),
      yfmt: (v) => v + "%",
      series: [
        { f: (k) => trueVol(k) * 100, cls: 5, dashed: true, label: T("真实微笑（生成数据用）", "True smile (used to generate data)") },
        { points: raw, cls: 2, dotsOnly: true, r: 5, label: T("清洗前（所有虚值报价）", "Before cleaning (all OTM quotes)") },
        { points: clean, cls: 0, dots: true, label: T("清洗后", "After cleaning") },
      ],
      markers: [{ x: Fimp, label: "F" }],
    });
  };
  root.querySelectorAll("[data-rule]").forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.rule; on[k] = !on[k];
    b.classList.toggle("on", on[k]); b.setAttribute("aria-pressed", String(on[k]));
    draw();
  }));
  draw();
}
