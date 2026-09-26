// Main demo for lesson delta-hedging: run one delta-hedged option through a simulated month with the engine's hedgeSim,
// then add what hedgeSim leaves out (transaction costs) and compare with the gamma–theta theory, step by step.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const K = 100, S0 = 100, T0 = 30 / 365, r = 0.04;

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let side = "long", steps = 30, seed = 39; // seed 39: a path whose realized vol (≈25%) matches the default slider
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("Delta 对冲实验室：一张 XYZ 30 天平值看涨，对冲一个月", "Delta-hedging lab: one 30-day at-the-money XYZ call, hedged for a month")}</div>
    <div class="demo-row">${seg("dh-side", [["long", T("买入期权 + 卖股票对冲（多 Gamma）", "Long the option, short stock (long gamma)")], ["short", T("卖出期权 + 买股票对冲（空 Gamma）", "Short the option, long stock (short gamma)")]], side)}</div>
    <div class="demo-row">${seg("dh-steps", [["4", T("每周对冲", "Weekly")], ["30", T("每天 1 次", "Daily")], ["120", T("每天 4 次", "4× a day")], ["480", T("每天 16 次", "16× a day")]], String(steps))}</div>
    <div class="demo-grid">
      ${slider("dh-iv", T("隐含波动率（买卖价用的 σ）", "Implied vol (the σ you traded at)"), 10, 40, 1, 20)}
      ${slider("dh-rv", T("实际波动率（股价真实的晃动）", "Realized vol (how much the stock really moves)"), 5, 60, 1, 25)}
      ${slider("dh-c", T("交易成本（每股美分）", "Trading cost (cents per share)"), 0, 10, 0.5, 1)}
    </div>
    <div class="demo-math" id="dh-f"></div>
    <div id="dh-s"></div>
    <div class="demo-label">${T("股价路径", "Stock path")}</div>
    <div id="dh-path"></div>
    <div class="demo-label">${T("对冲组合的累计损益（每张合约，未扣成本）与 Gamma–Theta 逐步理论值", "Cumulative P&L of the hedged position (per contract, before costs) vs the step-by-step gamma–theta theory")}</div>
    <div id="dh-pnl"></div>
    <div class="demo-btns"><button class="demo-btn" id="dh-seed">${T("换一条路径", "New path")}</button></div>
    <p class="demo-tip">${T("试试：让实际波动率 = 隐含波动率，损益只剩围绕 0 的噪声；把对冲从每周改到每天 16 次，噪声变小，但成本变大。再把实际波动率拉到 30%，多 Gamma 一方平均赚、空 Gamma 一方平均亏——看蓝线怎样紧跟理论线。", "Try this: set realized = implied and the P&L is just noise around zero; go from weekly to 16× a day and the noise shrinks while costs grow. Then push realized vol to 30%: the long-gamma side makes money on average, the short-gamma side loses — and the blue line tracks the theory line.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const sIV = v["dh-iv"] / 100, sRV = v["dh-rv"] / 100, cps = v["dh-c"] / 100;
    const sg = side === "long" ? -1 : 1; // hedgeSim reports the SHORT call; flip for the long side
    const res = O.hedgeSim({ S0, K, T: T0, r, sigmaImp: sIV, sigmaReal: sRV, steps, seed });
    const path = res.path, dt = T0 / steps;
    const pnl = sg * res.pnl * 100;
    // costs: every share bought or sold (initial hedge + each rebalance) pays cps
    let prev = 0, traded = 0;
    for (let i = 0; i < steps; i++) {
      const d = O.greeks({ S: path[i], K, T: T0 - i * dt, r, sigma: sIV, type: "call" }).delta;
      traded += Math.abs(d - prev) * 100; prev = d;
    }
    const cost = traded * cps;
    // step-by-step theory: ½ Γ S² (R² − σ_imp² dt), per contract, sign by side
    const theory = [[0, 0]];
    let acc = 0;
    for (let i = 1; i <= steps; i++) {
      const g = O.greeks({ S: path[i - 1], K, T: T0 - (i - 1) * dt, r, sigma: sIV, type: "call" }).gamma;
      const R = path[i] / path[i - 1] - 1;
      acc += -sg * 0.5 * g * path[i - 1] ** 2 * (R * R - sIV * sIV * dt) * 100;
      theory.push([(i * 30) / steps, acc]);
    }
    const rv = O.realizedVol(path, steps / T0);
    const vega = O.greeks({ S: S0, K, T: T0, r, sigma: sIV, type: "call" }).vega;
    const expect = -sg * (O.bsCall(S0, K, T0, r, sRV) - O.bsCall(S0, K, T0, r, sIV)) * 100;
    const fo = vega * (sRV - sIV) * 100 * 100 * -sg;
    $("#dh-f").innerHTML = tex(String.raw`\dd\Pi \approx \tfrac12\,\Gamma S^2\big(R^2 - \IV^2\,\dd t\big)`, true) +
      tex(String.raw`\E[\Pi] \approx ${side === "long" ? "" : "-"}\big[C(\RV) - C(\IV)\big] \times 100 = ${expect >= 0 ? "" : "-"}\$${Math.abs(expect).toFixed(0)}`, true) +
      tex(String.raw`\text{${T("一阶近似", "first order")}: } ${side === "long" ? "" : "-"}\nu\,(\RV - \IV) \times 100`, true) +
      tex(String.raw`= ${side === "long" ? "" : "-"}${vega.toFixed(3)} \times ${((sRV - sIV) * 100).toFixed(0)} \times 100 \approx ${fo >= 0 ? "" : "-"}\$${Math.abs(fo).toFixed(0)}`, true);
    $("#dh-s").innerHTML = stats([
      [T("这条路径的实际波动率", "Realized vol of this path"), (rv * 100).toFixed(1) + "%"],
      [T("对冲损益（未扣成本）", "Hedged P&L before costs"), (pnl >= 0 ? "+$" : "−$") + Math.abs(pnl).toFixed(0), pnl >= 0 ? "pos" : "neg"],
      [T("理论期望", "Theoretical expectation"), (expect >= 0 ? "+$" : "−$") + Math.abs(expect).toFixed(0), "acc"],
      [T("交易股数 / 成本", "Shares traded / cost"), traded.toFixed(0) + " / −$" + cost.toFixed(2)],
      [T("扣成本后", "After costs"), (pnl - cost >= 0 ? "+$" : "−$") + Math.abs(pnl - cost).toFixed(0), pnl - cost >= 0 ? "pos" : "neg"],
    ]);
    const days = path.map((s, i) => [(i * 30) / steps, s]);
    $("#dh-path").innerHTML = lineChart({ xmin: 0, xmax: 30, H: 190, xlabel: T("天", "Day"), ylabel: "S", series: [{ points: days, cls: 5, label: "XYZ" }], hlines: [{ y: K, label: "K = 100" }] });
    const ser = res.series.map((x, i) => [(i * 30) / steps, sg * x * 100]);
    $("#dh-pnl").innerHTML = lineChart({
      xmin: 0, xmax: 30, H: 220, xlabel: T("天", "Day"), ylabel: T("美元 / 张", "$ per contract"),
      series: [
        { points: ser, cls: 0, label: T("对冲组合按市值的损益", "Hedged position, marked to model") },
        { points: theory, cls: 1, dashed: true, label: T("逐步理论：½ΓS²(R² − σ²dt) 之和", "Step theory: sum of ½ΓS²(R² − σ²dt)") },
      ],
      hlines: [{ y: expect, label: T("期望", "expected") }],
    });
  };
  const run = bindSliders(root, { "dh-iv": (x) => x + "%", "dh-rv": (x) => x + "%", "dh-c": (x) => (+x).toFixed(1) + "¢" }, draw);
  onSeg(root, "dh-side", (x) => { side = x; run(); });
  onSeg(root, "dh-steps", (x) => { steps = +x; run(); });
  $("#dh-seed").addEventListener("click", () => { seed += 1; run(); });
}
