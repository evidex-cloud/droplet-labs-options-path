// Main demo for lesson greeks-map: P&L attribution. Move the stock, let days pass, shift IV and rates;
// compare the Taylor (Greeks) estimate term by term with an exact Black-Scholes reprice.
import * as O from "./_opt.js";
import { lineChart, barChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let type = "call", side = 1;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("盈亏归因：希腊字母估算 vs 精确重新定价", "P&L attribution: the Greeks' estimate vs an exact reprice")}</div>
    <div class="demo-row">${seg("gm-type", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")]], type)}
      ${seg("gm-side", [["1", T("买入（多头）", "Long")], ["-1", T("卖出（空头）", "Short")]], "1")}
      <div class="demo-btns" style="margin:0"><button class="demo-btn" data-preset="kai">${T("小凯的一天", "Kai's day")}</button><button class="demo-btn" data-preset="big">${T("大行情：+10 美元", "Big move: +$10")}</button><button class="demo-btn" data-preset="crush">${T("财报后 IV −8 点", "After earnings: IV −8 pts")}</button></div></div>
    <div class="demo-label" style="margin-top:.6rem">${T("起点：XYZ = 100，σ = 20%，r = 4%", "Starting point: XYZ = 100, σ = 20%, r = 4%")}</div>
    <div class="demo-grid">
      ${slider("gm-k", T("行权价 K", "Strike K"), 85, 115, 1, 100)}
      ${slider("gm-d", T("到期天数", "Days to expiry"), 3, 365, 1, 30)}
    </div>
    <div class="demo-label">${T("接下来发生的变化", "What happens next")}</div>
    <div class="demo-grid">
      ${slider("gm-ds", T("股价变动 dS", "Stock move dS"), -15, 15, 0.5, 2)}
      ${slider("gm-dt", T("过去的天数 dt", "Days that pass dt"), 0, 20, 1, 1)}
      ${slider("gm-dv", T("隐含波动率变动 dσ", "IV change dσ"), -10, 10, 0.5, -1)}
      ${slider("gm-dr", T("利率变动 dr", "Rate change dr"), -2, 2, 0.25, 0)}
    </div>
    <div class="demo-math" id="gm-f"></div>
    <div id="gm-stats"></div>
    <div id="gm-bars"></div>
    <div id="gm-line"></div>
    <p class="demo-tip">${T("试试：按“小凯的一天”，各项加起来和精确值只差不到 1 美分；再按“大行情”，Delta + Gamma 的估算明显高估——因为股价涨上去以后 Gamma 自己变小了。切到“卖出”，每一项都反号。", "Try this: “Kai's day” — the terms add up to within a cent of the exact change. Then “Big move” — the Delta + Gamma estimate overshoots, because gamma itself shrinks as the call goes deep in the money. Switch to Short and every term flips sign.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const S0 = 100, r0 = 0.04, sig0 = 0.2;
  const sgn = (x, d = 3) => (x >= 0 ? "+" : "-") + Math.abs(x).toFixed(d);
  const draw = (v) => {
    const K = v["gm-k"], Tdays = v["gm-d"], dS = v["gm-ds"], dt = Math.min(v["gm-dt"], Tdays), dv = v["gm-dv"], dr = v["gm-dr"];
    const o = { S: S0, K, T: Tdays / 365, r: r0, sigma: sig0, type };
    const g = O.greeks(o);
    const sig1 = Math.max(0.01, sig0 + dv / 100), r1 = r0 + dr / 100;
    const o1 = { S: S0 + dS, K, T: (Tdays - dt) / 365, r: r1, sigma: sig1, type };
    const exact = side * (O.bsPrice(o1) - g.price);
    const tD = side * g.delta * dS, tG = side * 0.5 * g.gamma * dS * dS, tT = side * g.theta * dt, tV = side * g.vega * dv, tR = side * g.rho * dr;
    const tay = tD + tG + tT + tV + tR, res = exact - tay;
    $("#gm-f").innerHTML = tex(String.raw`\dd V \approx \underbrace{${(side * g.delta).toFixed(3)} \times ${dS < 0 ? "(" + dS + ")" : dS}}_{\Delta\,\dd S} \underbrace{${sgn(tG)}}_{\frac12\Gamma\,\dd S^2} \underbrace{${sgn(side * g.theta, 4)} \times ${dt}}_{\Theta\,\dd t} \underbrace{${sgn(side * g.vega)} \times (${dv})}_{\nu\,\dd\sigma} \underbrace{${sgn(side * g.rho)} \times (${dr})}_{\rho\,\dd r} = ${tay.toFixed(3)}`, true)
      + tex(String.raw`\text{${T("精确重新定价", "exact reprice")}}: V_{\text{${T("新", "new")}}} - V_0 = ${exact.toFixed(3)} \qquad \text{${T("残差", "residual")}} = ${res.toFixed(3)}`, true);
    $("#gm-stats").innerHTML = stats([
      [T("期权价格：起点 → 之后", "Option price: before → after"), "$" + g.price.toFixed(2) + " → $" + O.bsPrice(o1).toFixed(2), "acc"],
      [T("希腊字母估算（每张）", "Greeks estimate (per contract)"), O.fmtUsd(tay * 100, 2), tay >= 0 ? "pos" : "neg"],
      [T("精确变化（每张）", "Exact change (per contract)"), O.fmtUsd(exact * 100, 2), exact >= 0 ? "pos" : "neg"],
      [T("残差占比", "Residual share"), Math.abs(exact) > 1e-9 ? (Math.abs(res / exact) * 100).toFixed(1) + "%" : "0.0%"],
    ]);
    $("#gm-bars").innerHTML = barChart({
      bars: [
        { label: "Δ", value: tD * 100 }, { label: "½Γ", value: tG * 100 }, { label: "Θ", value: tT * 100 },
        { label: "ν", value: tV * 100 }, { label: "ρ", value: tR * 100 },
        { label: T("合计", "Sum"), value: tay * 100, cls: 0 }, { label: T("精确", "Exact"), value: exact * 100, cls: 5 },
      ],
      yfmt: (x) => (x < 0 ? "−$" : "$") + Math.abs(Math.round(x)), H: 220, xlabel: T("每张合约的盈亏来源（美元）", "Where the P&L came from, per contract ($)"),
    });
    // exact vs Taylor across a range of stock moves, holding the chosen dt, dσ, dr
    const lo = -15, hi = 15;
    $("#gm-line").innerHTML = lineChart({
      xmin: lo, xmax: hi, H: 250, xlabel: T("股价变动 dS（美元）", "Stock move dS ($)"), ylabel: T("每股盈亏", "P&L per share"),
      series: [
        { f: (x) => side * (O.bsPrice({ ...o1, S: S0 + x }) - g.price), cls: 0, label: T("精确重新定价", "Exact reprice") },
        { f: (x) => side * (g.delta * x + 0.5 * g.gamma * x * x) + tT + tV + tR, cls: 1, dashed: true, label: T("泰勒估算（Δ + ½Γ + Θ + ν + ρ）", "Taylor estimate (Δ + ½Γ + Θ + ν + ρ)") },
        { f: (x) => side * g.delta * x + tT + tV + tR, cls: 5, dashed: true, label: T("只用 Delta", "Delta only") },
      ],
      markers: [{ x: dS, label: "dS" }],
    });
  };
  const spec = { "gm-k": (x) => "$" + x, "gm-d": (x) => x + T(" 天", x === 1 ? " day" : " days"), "gm-ds": (x) => (x >= 0 ? "+$" : "−$") + Math.abs(x), "gm-dt": (x) => x + T(" 天", x === 1 ? " day" : " days"), "gm-dv": (x) => (x >= 0 ? "+" : "−") + Math.abs(x) + T(" 个波动率点", " vol pts"), "gm-dr": (x) => (x >= 0 ? "+" : "−") + Math.abs(x) + "%" };
  const run = bindSliders(root, spec, draw);
  onSeg(root, "gm-type", (x) => { type = x; run(); });
  onSeg(root, "gm-side", (x) => { side = +x; run(); });
  const set = (vals) => { for (const [id, x] of Object.entries(vals)) $("#" + id).value = x; run(); };
  root.querySelectorAll("[data-preset]").forEach((b) => b.addEventListener("click", () => {
    const p = b.dataset.preset;
    if (p === "kai") set({ "gm-k": 100, "gm-d": 30, "gm-ds": 2, "gm-dt": 1, "gm-dv": -1, "gm-dr": 0 });
    else if (p === "big") set({ "gm-k": 100, "gm-d": 30, "gm-ds": 10, "gm-dt": 0, "gm-dv": 0, "gm-dr": 0 });
    else set({ "gm-k": 100, "gm-d": 30, "gm-ds": 3, "gm-dt": 1, "gm-dv": -8, "gm-dr": 0 });
  }));
}
