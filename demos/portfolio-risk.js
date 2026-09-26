// Main demo for lesson portfolio-risk: a small XYZ options book → aggregate Greeks → spot × vol scenario grid →
// stress tests → rough margin estimates (Reg T-style strategy margin vs a portfolio-margin-style ±15% scan).
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const r = 0.04, Tm = 30 / 365, S0 = 100, IV = 0.2;
const px = (type, K) => O.bsPrice({ S: S0, K, T: Tm, r, sigma: IV, type });
const leg = (type, side, K, qty = 1) => (type === "stock" ? { type, side, entry: S0, qty } : { type, side, K, qty, T: Tm, premium: px(type, K) });

export const BOOKS = {
  income: { legs: [leg("stock", "long"), leg("call", "short", 105), leg("put", "short", 95, 2)] },
  strangle: { legs: [leg("call", "short", 105), leg("put", "short", 95)] },
  straddle: { legs: [leg("call", "long", 100), leg("put", "long", 100)] },
  collar: { legs: [leg("stock", "long"), leg("put", "long", 95), leg("call", "short", 105)] },
};

// Reg T-style strategy margin (per book, in $), using the common exchange-minimum formula for uncovered equity options:
// premium + max(20% of spot − out-of-the-money amount, 10% of strike (puts) or of spot (calls)).
const nakedPut = (K, S = S0) => (px("put", K) + Math.max(0.2 * S - Math.max(S - K, 0), 0.1 * K)) * 100;
const nakedCall = (K, S = S0) => (px("call", K) + Math.max(0.2 * S - Math.max(K - S, 0), 0.1 * S)) * 100;
export function regT(id) {
  if (id === "income") return 0.5 * S0 * 100 + 2 * nakedPut(95); // covered call needs nothing beyond the stock
  if (id === "strangle") { const c = nakedCall(105), p = nakedPut(95); return Math.max(c, p) + (c > p ? px("put", 95) : px("call", 105)) * 100; }
  if (id === "straddle") return (px("call", 100) + px("put", 100)) * 100; // long options: paid in full
  return 0.5 * S0 * 100 + px("put", 95) * 100; // collar: stock at 50% + put paid in full
}

export const scenario = (legs, dS, dv) => O.netPLAt(legs, S0 * (1 + dS), { sigma: IV + dv, r }) * 100;

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let book = "income";
  const names = { income: T("小凯的收入账：100 股 + 卖 1 张 105 看涨 + 卖 2 张 95 看跌", "Kai's income book: 100 shares + short 1 × 105 call + short 2 × 95 put"), strangle: T("卖出宽跨式：卖 105 看涨 + 卖 95 看跌", "Short strangle: short 105 call + short 95 put"), straddle: T("买入跨式：买 100 看涨 + 买 100 看跌", "Long straddle: long 100 call + long 100 put"), collar: T("领口：100 股 + 买 95 看跌 + 卖 105 看涨", "Collar: 100 shares + long 95 put + short 105 call") };
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("一本小期权账的风险报告（XYZ，30 天期权，隐含波动率 20%）", "Risk report for a small options book (XYZ, 30-day options, implied vol 20%)")}</div>
    <div class="demo-row">${seg("pr-book", [["income", T("收入账", "Income book")], ["strangle", T("卖宽跨", "Short strangle")], ["straddle", T("买跨式", "Long straddle")], ["collar", T("领口", "Collar")]], book)}</div>
    <div class="demo-meta" id="pr-name"></div>
    ${slider("pr-n", T("整本账放大几倍", "Scale the whole book"), 1, 5, 1, 1)}
    <div id="pr-g"></div>
    <div class="demo-math" id="pr-f"></div>
    <div class="demo-label">${T("情景矩阵：股价瞬间变动 × 隐含波动率变动（美元，整本账）", "Scenario grid: instant spot move × implied-vol change ($, whole book)")}</div>
    <div id="pr-grid" style="overflow-x:auto"></div>
    <div class="demo-label">${T("压力测试（以 XYZ 为例的示意情景）", "Stress tests (illustrative scenarios applied to XYZ)")}</div>
    <div id="pr-st"></div>
    <div class="demo-label">${T("保证金粗估（示意，券商实际要求可能更高）", "Rough margin estimates (illustrative; brokers may require more)")}</div>
    <div id="pr-m"></div>
    <p class="demo-tip">${T("试试：在“收入账”里看左下角——股价 −20% 时，波动率怎么变都救不了；再比较 Delta 线性估算和完整重估在 −15% 处差多少。切到“买跨式”，整张矩阵的颜色反过来：它怕的是不动。", "Try this: in the income book look at the bottom-left — at −20% spot no vol change helps; compare the delta-only estimate with full revaluation at −15%. Switch to the long straddle and the whole grid flips colour: what it fears is no movement.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const tn = (x) => (x < 0 ? "-" : "") + Math.abs(x).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}"); // LaTeX thousands separator
  const money = (x) => (x >= 0 ? "+$" : "−$") + Math.abs(x).toLocaleString("en-US", { maximumFractionDigits: 0 });
  const draw = (v) => {
    const n = v["pr-n"];
    const legs = BOOKS[book].legs.map((l) => ({ ...l, qty: (l.qty || 1) * n }));
    $("#pr-name").textContent = names[book] + (n > 1 ? T(`（× ${n}）`, ` (× ${n})`) : "");
    const g = O.positionGreeks(legs, S0, { sigma: IV, r });
    $("#pr-g").innerHTML = stats([
      [T("Delta（股）", "Delta (shares)"), O.fmtSigned(g.delta * 100, 1)],
      [T("Gamma（股 / 美元）", "Gamma (shares per $1)"), O.fmtSigned(g.gamma * 100, 2)],
      [T("Vega（美元 / 波动率点）", "Vega ($ per vol pt)"), O.fmtSigned(g.vega * 100, 1)],
      [T("Theta（美元 / 天）", "Theta ($ per day)"), O.fmtSigned(g.theta * 100, 2)],
    ]);
    const d = g.delta * 100, gm = g.gamma * 100, dS = -15;
    const full = scenario(legs, -0.15, 0), lin = d * dS, dg = d * dS + 0.5 * gm * dS * dS;
    $("#pr-f").innerHTML = tex(String.raw`\begin{aligned} \Delta\Pi(-15\%) &\approx \underbrace{${d.toFixed(1)} \times (-15)}_{\text{${T("只用 Delta", "delta only")}}\ ${tn(lin)}} \\ &\quad + \underbrace{\tfrac12 \times (${gm.toFixed(2)}) \times 15^2}_{\text{Gamma}} = ${tn(dg)} \end{aligned}`, true) + tex(String.raw`\text{${T("完整重估", "full revaluation")}}:\ \Delta\Pi(-15\%) = ${tn(full)}`, true);
    const moves = [-0.2, -0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15], vols = [-0.05, 0, 0.05, 0.1, 0.2];
    const cells = vols.map((dv) => moves.map((m) => scenario(legs, m, dv)));
    const mx = Math.max(...cells.flat().map(Math.abs), 1);
    const cell = (x) => { const a = Math.round(15 + 55 * Math.min(1, Math.abs(x) / mx)); return `<td style="text-align:right;white-space:nowrap;background:color-mix(in srgb, var(${x >= 0 ? "--green" : "--red"}) ${a}%, transparent)">${money(x)}</td>`; };
    $("#pr-grid").innerHTML = `<table><thead><tr><th style="white-space:nowrap">${T("波动率 \\ 股价", "vol \\ spot")}</th>${moves.map((m) => `<th style="white-space:nowrap">${m > 0 ? "+" : m < 0 ? "−" : ""}${Math.abs(m * 100).toFixed(0)}%</th>`).join("")}</tr></thead><tbody>${vols.map((dv, i) => `<tr${dv === 0 ? ' class="hl"' : ""}><th style="white-space:nowrap">${dv >= 0 ? "+" : "−"}${Math.abs(dv * 100).toFixed(0)} ${T("点", "pts")}</th>${cells[i].map(cell).join("")}</tr>`).join("")}</tbody></table>`;
    const st = [
      [T("暴跌日：−20%，波动率 +25 点（类似 1987 年那样的单日暴跌）", "Crash day: −20%, vol +25 pts (a 1987-style one-day crash)"), -0.2, 0.25],
      [T("恐慌：−5%，波动率 +20 点（类似 VIX 单日飙升）", "Panic: −5%, vol +20 pts (a VIX-spike day)"), -0.05, 0.2],
      [T("跳空上涨：+15%，波动率 +5 点（例如收购消息）", "Gap up: +15%, vol +5 pts (say, takeover news)"), 0.15, 0.05],
      [T("平静：0%，波动率 −5 点", "Calm: 0%, vol −5 pts"), 0, -0.05],
    ];
    $("#pr-st").innerHTML = `<table><tbody>${st.map(([lab, m, dv]) => { const x = scenario(legs, m, dv); return `<tr><td>${lab}</td><td style="text-align:right;white-space:nowrap;color:var(${x >= 0 ? "--green" : "--red"})">${money(x)}</td></tr>`; }).join("")}</tbody></table>`;
    let worst = 0;
    for (let i = -10; i <= 10; i++) worst = Math.min(worst, scenario(legs, 0.015 * i, 0));
    $("#pr-m").innerHTML = stats([
      [T("Reg T 式策略保证金", "Reg T-style strategy margin"), "$" + (regT(book) * n).toLocaleString("en-US", { maximumFractionDigits: 0 })],
      [T("组合保证金式估算：±15% 内最坏亏损", "Portfolio-margin-style: worst loss within ±15%"), "$" + Math.abs(worst).toLocaleString("en-US", { maximumFractionDigits: 0 }), "acc"],
    ]);
  };
  const run = bindSliders(root, { "pr-n": (x) => "×" + x }, draw);
  onSeg(root, "pr-book", (x) => { book = x; run(); });
}
