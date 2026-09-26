// Inline demo for lesson retail-flows: a stylised covered-call income fund on XYZ over three years.
// Each month the fund holds XYZ, sells a one-month call (priced with Black-Scholes at the "implied" vol) and pays the
// whole premium out as a distribution. At expiry the call is cash-settled and the fund reinvests what is left.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const MONTHS = 36, dt = 1 / 12, r = 0.04;

function run({ ivol, rvol, mu, otm, seed }) {
  const R = O.rng(seed);
  let S = 100, u = 1, tr = 100, dist = 0;
  const nav = [[0, 100]], trFund = [[0, 100]], stock = [[0, 100]];
  const yearly = [0, 0, 0];
  for (let m = 0; m < MONTHS; m++) {
    const K = S * (1 + otm);
    const c = O.bsPrice({ S, K, T: dt, r, sigma: ivol, type: "call" });
    const D = u * c;                              // distribution paid this month
    const S1 = S * Math.exp((mu - rvol * rvol / 2) * dt + rvol * Math.sqrt(dt) * R.normal());
    const navStart = u * S, navEnd = u * Math.min(S1, K); // short call settled in cash
    tr *= (navEnd + D) / navStart;                // total return with distributions reinvested
    dist += D; yearly[Math.floor(m / 12)] += D / (u * S) ; // monthly yield on the month's starting NAV
    u = navEnd / S1; S = S1;                      // reinvest in XYZ at the new price
    nav.push([m + 1, u * S]); trFund.push([m + 1, tr]); stock.push([m + 1, S]);
  }
  return { nav, trFund, stock, dist, navEnd: u * S, trEnd: tr, stockEnd: S, yld: (yearly[0] + yearly[1] + yearly[2]) / 3 };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let otm = 0, seed = 15;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("分配收益率 ≠ 总回报：一只备兑看涨收益基金", "Distribution yield ≠ total return: a covered-call income fund")}</div>
    <div class="demo-row">${seg("ri-k", [["0", T("卖平值看涨", "Sell ATM calls")], ["0.02", T("卖 2% 虚值", "Sell 2% OTM")], ["0.05", T("卖 5% 虚值", "Sell 5% OTM")]], "0")}
      <div class="demo-btns" style="margin:0"><button type="button" class="demo-btn" data-act="seed">${T("换一条路径", "New path")}</button></div></div>
    <div class="demo-grid">
      ${slider("ri-iv", T("卖出看涨时的隐含波动率", "Implied vol when selling calls"), 10, 60, 1, 20)}
      ${slider("ri-rv", T("XYZ 的实际波动率", "XYZ's realized vol"), 10, 60, 1, 20)}
      ${slider("ri-mu", T("XYZ 每年的平均漂移", "XYZ's average drift per year"), -10, 20, 1, 8)}
    </div>
    <div id="ri-chart"></div>
    <div class="demo-math" id="ri-f"></div>
    <div id="ri-stats"></div>
    <p class="demo-tip">${T("看什么：分配收益率很少低于 20%，看起来像高息；但净值（虚线）往往一路往下，因为上涨被卖掉了、下跌却全额承担。把实际波动率调得比隐含波动率低，基金才更有优势——它赚的是波动率风险溢价，不是“利息”。", "What to notice: the distribution yield rarely drops below 20% and looks like a high coupon, yet the NAV (dashed) tends to drift down: the rallies were sold, the drops kept in full. Set realized vol below implied and the fund does better — what it earns is the volatility risk premium, not interest.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const ivol = v["ri-iv"] / 100, rvol = v["ri-rv"] / 100, mu = v["ri-mu"] / 100;
    const x = run({ ivol, rvol, mu, otm, seed });
    $("#ri-chart").innerHTML = lineChart({
      xmin: 0, xmax: MONTHS, xlabel: T("月份", "Month"), ylabel: T("价值（起点 = 100）", "Value (start = 100)"),
      series: [
        { points: x.stock, cls: 1, label: T("XYZ 本身", "XYZ itself") },
        { points: x.trFund, cls: 0, label: T("基金总回报（分配再投资）", "Fund total return (distributions reinvested)") },
        { points: x.nav, cls: 2, dashed: true, label: T("基金净值（分配付走）", "Fund NAV (distributions paid out)") },
      ],
    });
    const c0 = O.bsPrice({ S: 100, K: 100 * (1 + otm), T: dt, r, sigma: ivol, type: "call" });
    $("#ri-f").innerHTML = tex(String.raw`\begin{aligned} c_{\text{${T("第 1 月", "month 1")}}} &= ${c0.toFixed(2)} \\ \text{${T("年化分配收益率", "annualized yield")}} &\approx 12 \times \frac{${c0.toFixed(2)}}{100} = ${(12 * c0).toFixed(1)}\% \end{aligned}`, true);
    const pct = (a) => (a >= 100 ? "+" : "−") + Math.abs(a - 100).toFixed(1) + "%";
    $("#ri-stats").innerHTML = stats([
      [T("平均分配收益率（每年）", "Average distribution yield (per year)"), (x.yld * 100).toFixed(1) + "%", "acc"],
      [T("三年累计分配（每份）", "Distributions paid over 3 years (per unit)"), "$" + x.dist.toFixed(2)],
      [T("基金净值变化", "Fund NAV change"), pct(x.navEnd), x.navEnd >= 100 ? "pos" : "neg"],
      [T("基金总回报", "Fund total return"), pct(x.trEnd), x.trEnd >= 100 ? "pos" : "neg"],
      [T("XYZ 总回报", "XYZ total return"), pct(x.stockEnd), x.stockEnd >= 100 ? "pos" : "neg"],
    ]);
  };
  const spec = { "ri-iv": (x) => x + "%", "ri-rv": (x) => x + "%", "ri-mu": (x) => (x > 0 ? "+" : "") + x + "%" };
  const rerun = bindSliders(root, spec, draw);
  onSeg(root, "ri-k", (x) => { otm = +x; rerun(); });
  root.querySelector('[data-act="seed"]').addEventListener("click", () => { seed = (seed * 13 + 5) % 991; rerun(); });
}
