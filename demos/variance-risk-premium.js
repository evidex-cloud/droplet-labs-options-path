// Main demo for lesson variance-risk-premium: sell a 30-day at-the-money straddle every month for 20 years
// in a world where implied vol carries a premium over realized vol — and where rare crash jumps happen.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

const r = 0.04, Tm = 30 / 365, MONTHS = 240;

// One simulated history. Calm months: realized = rv, implied = rv + prem. A crash is a surprise jump inside a calm month;
// it is followed by STRESS months in which realized vol is 2.5·rv but implied (set at the start of each month) only 2·rv + prem,
// so the premium turns negative for a while — as it tends to after real crashes.
// Returns monthly equity (with and without crashes) and monthly returns.
export const STRESS_MONTHS = 3;
export function shortVolHistory({ rv, prem, lambda, jump, lev, seed }) {
  const R = O.rng(seed), iv = rv + prem;
  const strad = (s) => O.bsCall(100, 100, Tm, r, Math.max(s, 0.01)) + O.bsPut(100, 100, Tm, r, Math.max(s, 0.01)); // per 100 notional
  const straddle = strad(iv), straddleStress = strad(2 * rv + prem);
  let w = 1, wNo = 1, peak = 1, maxDD = 0, crashes = 0, dead = false, stress = 0;
  const eq = [[0, 1]], eqNo = [[0, 1]], rets = [];
  for (let m = 1; m <= MONTHS; m++) {
    const z = R.normal(), u = R();
    const inStress = stress > 0, rvM = inStress ? 2.5 * rv : rv, prM = inStress ? straddleStress : straddle;
    const diff = -0.5 * rvM * rvM * Tm + rvM * Math.sqrt(Tm) * z, diffNo = -0.5 * rv * rv * Tm + rv * Math.sqrt(Tm) * z;
    const hit = !inStress && u < lambda / 12;
    const ST = 100 * Math.exp(diff + (hit ? Math.log(1 + jump) : 0)), STno = 100 * Math.exp(diffNo);
    const cash = r / 12;
    const ret = cash + lev * (prM - Math.abs(ST - 100)) / 100;
    const retNo = cash + lev * (straddle - Math.abs(STno - 100)) / 100;
    if (inStress) stress--;
    if (hit) { crashes++; stress = STRESS_MONTHS; }
    if (!dead) { rets.push(ret); w *= 1 + ret; if (w <= 0.001) { w = 0.001; dead = true; } }
    wNo *= 1 + retNo;
    peak = Math.max(peak, w); maxDD = Math.max(maxDD, 1 - w / peak);
    eq.push([m / 12, w]); eqNo.push([m / 12, wNo]);
  }
  return { eq, eqNo, rets, straddle, iv, maxDD, crashes, dead, final: w, finalNo: wNo };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let seed = 7;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("卖波动率 20 年：每月卖一张 30 天平值跨式", "Twenty years of selling volatility: a 30-day at-the-money straddle every month")}</div>
    <div class="demo-grid">
      ${slider("vr-rv", T("平时的实际波动率", "Normal realized vol"), 8, 30, 1, 15)}
      ${slider("vr-pr", T("隐含比实际高几个点（溢价）", "Implied minus realized (the premium, vol pts)"), -2, 10, 0.5, 3)}
      ${slider("vr-la", T("暴跌频率（次 / 年）", "Crash frequency (per year)"), 0, 0.5, 0.02, 0.1)}
      ${slider("vr-j", T("暴跌幅度", "Crash size"), -40, -5, 1, -20)}
      ${slider("vr-l", T("名义本金 = 资金的几倍", "Notional = multiple of capital"), 0.25, 4, 0.25, 1)}
    </div>
    <div class="demo-math" id="vr-f"></div>
    <div id="vr-s"></div>
    <div class="demo-label">${T("资金曲线（对数刻度）：蓝 = 有暴跌的世界，灰虚线 = 同一段历史但没有暴跌（“回测里的样子”）", "Equity curve (log scale): blue = world with crashes, grey dashed = same history without crashes (what a crash-free backtest shows)")}</div>
    <div id="vr-eq"></div>
    <div class="demo-label">${T("回撤：离历史高点跌了多少", "Drawdown: how far below the running peak")}</div>
    <div id="vr-dd"></div>
    <div class="demo-btns"><button class="demo-btn" id="vr-seed">${T("换一段 20 年历史", "Another 20-year history")}</button></div>
    <p class="demo-tip">${T("试试：暴跌频率设为 0，灰线和蓝线重合，曲线平滑得像存款；再把频率调到 0.1、名义本金调到 3 倍，看一次暴跌怎样抹掉几年的收益。把溢价调到 0 附近，卖方就只剩下尾部风险。", "Try this: set the crash frequency to 0 and the blue and grey lines coincide — as smooth as a savings account; then set 0.1 crashes a year and 3× notional and watch one crash erase years of gains. Push the premium toward 0 and the seller is left with nothing but the tail risk.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const rv = v["vr-rv"] / 100, prem = v["vr-pr"] / 100, lambda = v["vr-la"], jump = v["vr-j"] / 100, lev = v["vr-l"];
    const h = shortVolHistory({ rv, prem, lambda, jump, lev, seed });
    const cagr = Math.pow(Math.max(h.final, 1e-9), 1 / 20) - 1, cagrNo = Math.pow(h.finalNo, 1 / 20) - 1;
    const wins = h.rets.filter((x) => x > 0).length / h.rets.length, worst = Math.min(...h.rets);
    const expPay = O.bsCall(100, 100, Tm, r, rv) + O.bsPut(100, 100, Tm, r, rv);
    $("#vr-f").innerHTML = tex(String.raw`\underbrace{${h.straddle.toFixed(2)}}_{\IV = ${(h.iv * 100).toFixed(1)}\%} - \underbrace{${expPay.toFixed(2)}}_{\RV = ${(rv * 100).toFixed(0)}\%} = ${(h.straddle - expPay).toFixed(2)}`, true) +
      `<p class="demo-meta" style="text-align:center;margin:0 0 6px">${T("收的权利金 − 平时的平均赔付（跨式在实际波动率下的价值），每 100 美元名义本金、每月", "premium collected − normal-month payout (the straddle valued at realized vol), per $100 notional per month")}</p>`;
    $("#vr-s").innerHTML = stats([
      [T("年化收益（有暴跌）", "CAGR (with crashes)"), h.dead ? T("爆仓", "wiped out") : (cagr * 100).toFixed(1) + "%", h.dead || cagr < 0 ? "neg" : "pos"],
      [T("年化收益（无暴跌）", "CAGR (no crashes)"), (cagrNo * 100).toFixed(1) + "%", "acc"],
      [T("赚钱的月份", "Winning months"), (wins * 100).toFixed(0) + "%"],
      [T("最差的一个月", "Worst month"), (worst * 100).toFixed(1) + "%", "neg"],
      [T("最大回撤", "Max drawdown"), (h.maxDD * 100).toFixed(0) + "%", "neg"],
      [T("20 年里的暴跌次数", "Crashes in 20 years"), String(h.crashes)],
    ]);
    const all = h.eq.concat(h.eqNo).map((p) => p[1]);
    $("#vr-eq").innerHTML = lineChart({
      xmin: 0, xmax: 20, logY: true, ymin: Math.max(0.001, Math.min(...all) * 0.9), ymax: Math.max(...all) * 1.1, H: 240,
      xlabel: T("年", "Year"), ylabel: T("资金（× 起点）", "Equity (× start)"), yfmt: (y) => "×" + (y >= 1 ? y.toFixed(0) : y.toPrecision(1)),
      series: [
        { points: h.eqNo, cls: 5, dashed: true, label: T("没有暴跌", "no crashes") },
        { points: h.eq, cls: 0, label: T("有暴跌", "with crashes") },
      ],
    });
    let pk = 1;
    const dd = h.eq.map(([t, w]) => { pk = Math.max(pk, w); return [t, -(1 - w / pk) * 100]; });
    $("#vr-dd").innerHTML = lineChart({ xmin: 0, xmax: 20, ymax: 0, H: 170, xlabel: T("年", "Year"), yfmt: (y) => y.toFixed(0) + "%", series: [{ points: dd, cls: 2, area: true }] });
  };
  const run = bindSliders(root, { "vr-rv": (x) => x + "%", "vr-pr": (x) => (x >= 0 ? "+" : "") + x, "vr-la": (x) => (+x).toFixed(2), "vr-j": (x) => x + "%", "vr-l": (x) => "×" + x }, draw);
  $("#vr-seed").addEventListener("click", () => { seed += 1; run(); });
}
