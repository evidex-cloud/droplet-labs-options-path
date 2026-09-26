// Main demo for lesson delta: delta S-curves across expiries, the live N(d1) formula, and a hedge-ratio calculator.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let type = "call";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("Delta 曲线与对冲计算器", "Delta curves and a hedge-ratio calculator")}</div>
    <div class="demo-row">${seg("dl-type", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")]], type)}
      <div class="demo-btns" style="margin:0"><button class="demo-btn" data-preset="kai">${T("小凯的 30 天 100 看涨", "Kai's 30-day 100 call")}</button><button class="demo-btn" data-preset="exp">${T("到期前一天", "One day to expiry")}</button></div></div>
    <div class="demo-grid">
      ${slider("dl-s", T("现价 S", "Spot S"), 70, 130, 0.5, 100)}
      ${slider("dl-d", T("到期天数", "Days to expiry"), 1, 365, 1, 30)}
      ${slider("dl-v", T("波动率 σ", "Volatility σ"), 5, 60, 1, 20)}
      ${slider("dl-n", T("持有合约张数（负数 = 卖出）", "Contracts held (negative = short)"), -10, 10, 1, 1)}
    </div>
    <div class="demo-math" id="dl-f"></div>
    <div id="dl-stats"></div>
    <div id="dl-chart"></div>
    <p class="demo-tip">${T("试试：把天数拉到 1，曲线几乎变成台阶——Delta 在行权价附近从 0 跳到 1；把 σ 拉高，曲线变平，虚值期权的 Delta 变大。“需要的股数”就是让整个头寸 Delta 归零要买卖的股票。", "Try this: drag days to 1 and the curve becomes almost a step — delta jumps from 0 to 1 around the strike; raise σ and the curve flattens, so out-of-the-money deltas grow. “Shares to hedge” is the stock trade that brings the whole position's delta to zero.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const K = 100, r = 0.04;
  const draw = (v) => {
    const S = v["dl-s"], days = v["dl-d"], sigma = v["dl-v"] / 100, n = v["dl-n"];
    const o = { S, K, T: days / 365, r, sigma, type };
    const g = O.greeks(o);
    const Nd1 = O.normCdf(g.d1);
    $("#dl-f").innerHTML = tex(type === "call"
      ? String.raw`\Delta_C = \N(d_1) = \N(${g.d1.toFixed(3)}) = ${g.delta.toFixed(3)}`
      : String.raw`\Delta_P = \N(d_1) - 1 = ${Nd1.toFixed(3)} - 1 = ${g.delta.toFixed(3)}`, true)
      + tex(String.raw`d_1 = \frac{\ln(S/K) + (r + \tfrac12\sigma^2)T}{\sigma\sqrt{T}} = \frac{\ln(${S}/100) + (0.04 + ${(sigma * sigma / 2).toFixed(4)}) \times ${(days / 365).toFixed(4)}}{${sigma.toFixed(2)} \times ${Math.sqrt(days / 365).toFixed(4)}} = ${g.d1.toFixed(3)}`, true);
    const posDelta = n * 100 * g.delta;
    const hedge = -posDelta;
    $("#dl-stats").innerHTML = stats([
      [T("Delta（每股）", "Delta (per share)"), g.delta.toFixed(3), "acc"],
      [T("头寸 Delta（相当于股数）", "Position delta (share-equivalents)"), (posDelta >= 0 ? "+" : "−") + Math.abs(posDelta).toFixed(1)],
      [T("对冲需要的股数", "Shares to hedge"), (hedge >= 0 ? T("买 ", "buy ") : T("卖 ", "sell ")) + Math.abs(hedge).toFixed(0), hedge >= 0 ? "pos" : "neg"],
      [T("美元 Delta（Δ × S × 100 × 张数）", "Dollar delta (Δ × S × 100 × n)"), O.fmtUsd(posDelta * S, 0)],
      [T("期权价格", "Option price"), "$" + g.price.toFixed(2)],
    ]);
    const lo = 70, hi = 130;
    const curve = (d, cls, label, dashed) => ({ f: (x) => O.greeks({ S: x, K, T: d / 365, r, sigma, type }).delta, cls, label, dashed });
    $("#dl-chart").innerHTML = lineChart({
      xmin: lo, xmax: hi, ymin: type === "call" ? 0 : -1, ymax: type === "call" ? 1 : 0, H: 270,
      xlabel: T("XYZ 价格 S", "XYZ price S"), ylabel: T("Delta Δ", "delta Δ"),
      series: [
        curve(7, 5, T("7 天", "7 days"), true), curve(180, 1, T("180 天", "180 days"), true),
        curve(days, 0, T(`你选的 ${days} 天`, `your ${days} ${days === 1 ? "day" : "days"}`)),
      ],
      markers: [{ x: K, label: "K = 100" }], points: [{ x: S, y: g.delta, cls: 0, label: "Δ = " + g.delta.toFixed(3) }],
    });
  };
  const spec = { "dl-s": (x) => "$" + x, "dl-d": (x) => x + T(" 天", x === 1 ? " day" : " days"), "dl-v": (x) => x + "%", "dl-n": (x) => String(x) };
  const run = bindSliders(root, spec, draw);
  onSeg(root, "dl-type", (x) => { type = x; run(); });
  const set = (vals) => { for (const [id, x] of Object.entries(vals)) $("#" + id).value = x; run(); };
  root.querySelectorAll("[data-preset]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.preset === "kai") set({ "dl-s": 100, "dl-d": 30, "dl-v": 20, "dl-n": 1 });
    else set({ "dl-s": 100.5, "dl-d": 1, "dl-v": 20, "dl-n": 1 });
  }));
}
