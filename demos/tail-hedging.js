// Main demo for lesson tail-hedging: 30 simulated years of a stock portfolio, with and without a monthly budget
// spent on 30-day out-of-the-money puts priced with Black-Scholes at a skewed implied vol.
import * as O from "./_opt.js";
import { lineChart, barChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const r = 0.04, Tm = 30 / 365, YEARS = 30;

// Monthly simulation. Calm months: GBM with drift mu and vol sig. Crash events arrive at `lambda` per year:
// "sudden" = one month with a jump of size J; "slow" = the same total loss spread evenly over 6 months.
// Each month the hedger spends budget/12 of wealth on puts struck (1 − otm)·S, priced at IV = sig + 3 pts + skew.
export function tailHistory({ mu = 0.07, sig = 0.15, lambda, J, kind, budget, otm, skew, seed }) {
  const R = O.rng(seed), iv = sig + 0.03 + skew;
  const K = 100 * (1 - otm), put = O.bsPut(100, K, Tm, r, iv);
  let w = 1, h = 1, pendingSlow = 0;
  const eqU = [[0, 1]], eqH = [[0, 1]], yrU = [], yrH = [], hedgePL = [];
  let yU = 1, yH = 1, yHedge = 0, bestMult = 0;
  for (let m = 1; m <= YEARS * 12; m++) {
    const z = R.normal(), u = R();
    let lr = (mu - 0.5 * sig * sig) / 12 + (sig / Math.sqrt(12)) * z;
    if (pendingSlow > 0) { lr += Math.log(1 + J) / 6; pendingSlow--; }
    if (u < lambda / 12) { if (kind === "sudden") lr += Math.log(1 + J); else { lr += Math.log(1 + J) / 6; pendingSlow = 5; } }
    const ST = 100 * Math.exp(lr), gross = ST / 100;
    // unhedged
    w *= gross;
    // hedged: spend budget/12 of wealth on puts (per 100 of stock value), rest stays in stock
    const spend = budget / 12, n = spend * 100 / put; // puts per 100 of wealth
    const pay = n * Math.max(K - ST, 0) / 100; // as a fraction of wealth
    const hedgeRet = (1 - spend) * gross + pay;
    if (pay / spend > bestMult) bestMult = pay / spend;
    yHedge += pay - spend;
    h *= hedgeRet;
    eqU.push([m / 12, w]); eqH.push([m / 12, h]);
    if (m % 12 === 0) { yrU.push(w / yU - 1); yrH.push(h / yH - 1); hedgePL.push(yHedge); yU = w; yH = h; yHedge = 0; }
  }
  const dd = (eq) => { let pk = 0, mx = 0; for (const [, v] of eq) { pk = Math.max(pk, v); mx = Math.max(mx, 1 - v / pk); } return mx; };
  const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
  const sd = (a) => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
  return {
    eqU, eqH, yrU, yrH, hedgePL, put, iv, K, bestMult,
    cagrU: Math.pow(w, 1 / YEARS) - 1, cagrH: Math.pow(h, 1 / YEARS) - 1, ddU: dd(eqU), ddH: dd(eqH),
    meanU: mean(yrU), meanH: mean(yrH), sdU: sd(yrU), sdH: sd(yrH), worstU: Math.min(...yrU), worstH: Math.min(...yrH),
  };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let seed = 1, kind = "sudden";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("尾部对冲 30 年：每年拿出一小笔钱买虚值看跌", "Thirty years of tail hedging: a small yearly budget of out-of-the-money puts")}</div>
    <div class="demo-row">${seg("th-kind", [["sudden", T("暴跌：一个月内跌完", "Crash: all in one month")], ["slow", T("熊市：6 个月慢慢跌完", "Bear market: spread over 6 months")]], kind)}</div>
    <div class="demo-grid">
      ${slider("th-b", T("每年对冲预算（占组合）", "Yearly hedge budget (% of portfolio)"), 0, 5, 0.25, 1.5)}
      ${slider("th-o", T("看跌期权虚值程度", "Put distance out of the money"), 5, 30, 1, 15)}
      ${slider("th-s", T("偏斜：虚值看跌的隐含波动率加点", "Skew: extra implied vol on the puts (pts)"), 0, 20, 1, 10)}
      ${slider("th-l", T("暴跌频率（次 / 年）", "Crash frequency (per year)"), 0, 0.3, 0.02, 0.1)}
      ${slider("th-j", T("暴跌幅度", "Crash size"), -50, -10, 1, -20)}
    </div>
    <div class="demo-math" id="th-f"></div>
    <div id="th-st"></div>
    <div class="demo-label">${T("组合价值（× 起点）", "Portfolio value (× start)")}</div>
    <div id="th-eq"></div>
    <div class="demo-label">${T("对冲仓位每年的净损益（占组合 %）：多数年份是小额“保费”，暴跌年份一次回本", "Net P&L of the hedge sleeve each year (% of portfolio): small “premiums” most years, one big payout in a crash year")}</div>
    <div id="th-bar"></div>
    <div class="demo-btns"><button class="demo-btn" id="th-seed">${T("换一段 30 年历史", "Another 30-year history")}</button></div>
    <p class="demo-tip">${T("试试：先看“暴跌”模式——对冲组合的最大回撤小得多，几何收益甚至可能更高；再切到“熊市”模式，同样的总跌幅分 6 个月跌完，一个月期的虚值看跌几乎每次都过期作废。把偏斜调到 20，保险变贵，拖累随之变大。", "Try this: in crash mode the hedged portfolio's maximum drawdown is much smaller and its geometric return can even be higher; switch to bear-market mode — the same total loss over six months — and one-month out-of-the-money puts expire worthless almost every time. Raise the skew to 20 and the insurance gets pricier, so the drag grows.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const pc = (x) => (x < 0 ? "−" : "") + Math.abs(x * 100).toFixed(1) + "%";
  const draw = (v) => {
    const p = { lambda: v["th-l"], J: v["th-j"] / 100, kind, budget: v["th-b"] / 100, otm: v["th-o"] / 100, skew: v["th-s"] / 100, seed };
    const H = tailHistory(p);
    const gU = H.meanU - 0.5 * H.sdU * H.sdU, gH = H.meanH - 0.5 * H.sdH * H.sdH;
    const gLine = (lab, m, s, g) => String.raw`G_{\text{${lab}}} \approx ${(m * 100).toFixed(1)}\% - \tfrac12(${(s * 100).toFixed(1)}\%)^2 = ${(g * 100).toFixed(1)}\%`;
    $("#th-f").innerHTML = tex(String.raw`P_{\text{${T("看跌", "put")}}}(K = ${H.K.toFixed(0)},\ \sigma = ${(H.iv * 100).toFixed(0)}\%) = ${H.put.toFixed(3)}`, true) +
      tex(gLine(T("不对冲", "unhedged"), H.meanU, H.sdU, gU), true) + tex(gLine(T("对冲", "hedged"), H.meanH, H.sdH, gH), true);
    $("#th-st").innerHTML = stats([
      [T("年化收益：不对冲 / 对冲", "CAGR: unhedged / hedged"), pc(H.cagrU) + " / " + pc(H.cagrH), H.cagrH >= H.cagrU ? "pos" : "neg"],
      [T("最大回撤：不对冲 / 对冲", "Max drawdown: unhedged / hedged"), pc(H.ddU) + " / " + pc(H.ddH)],
      [T("最差年份：不对冲 / 对冲", "Worst year: unhedged / hedged"), pc(H.worstU) + " / " + pc(H.worstH)],
      [T("年收益波动：不对冲 / 对冲", "Volatility of yearly returns"), pc(H.sdU) + " / " + pc(H.sdH)],
      [T("单月最高赔付倍数", "Best monthly payout multiple"), H.bestMult.toFixed(0) + "×", "acc"],
    ]);
    $("#th-eq").innerHTML = lineChart({
      xmin: 0, xmax: YEARS, H: 240, xlabel: T("年", "Year"), ylabel: T("价值（× 起点）", "Value (× start)"),
      yfmt: (y) => "×" + y.toFixed(1),
      series: [{ points: H.eqU, cls: 5, label: T("只持有股票", "stock only") }, { points: H.eqH, cls: 0, label: T("股票 + 尾部对冲", "stock + tail hedge") }],
    });
    $("#th-bar").innerHTML = barChart({ H: 180, yfmt: (y) => y.toFixed(0) + "%", bars: H.hedgePL.map((x, i) => ({ label: String(i + 1), value: x * 100, cls: x >= 0 ? 3 : 2 })), xlabel: T("第几年", "Year") });
  };
  const run = bindSliders(root, { "th-b": (x) => (+x).toFixed(2) + "%", "th-o": (x) => x + "%", "th-s": (x) => "+" + x, "th-l": (x) => (+x).toFixed(2), "th-j": (x) => String(x).replace("-", "−") + "%" }, draw);
  onSeg(root, "th-kind", (x) => { kind = x; run(); });
  $("#th-seed").addEventListener("click", () => { seed += 1; run(); });
}
