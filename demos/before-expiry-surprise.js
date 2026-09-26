// Inline demo for lesson before-expiry: "the stock went up but my call lost money".
// A 30-day 100 call is bought at an entry IV; then the stock moves, days pass and IV changes.
// The P&L is split into price, time and volatility steps (each an exact Black-Scholes repricing),
// and compared with the Greek estimate Δ·dS + Θ·dt + ν·dσ.
import * as O from "./_opt.js";
import { barChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const K = 100, r = O.XYZ.r;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("股票涨了，看涨期权却亏了？", "The stock went up, so why did my call lose money?")}</div>
    <div class="demo-grid">
      ${slider("bes-iv0", T("买入时的隐含波动率", "Implied vol at purchase"), 10, 60, 1, 30)}
      ${slider("bes-ds", T("XYZ 从 100 变到", "XYZ moves from 100 to"), 90, 112, 0.5, 103)}
      ${slider("bes-dt", T("过去了几天（共 30 天）", "Days passed (of 30)"), 0, 29, 1, 21)}
      ${slider("bes-iv1", T("现在的隐含波动率", "Implied vol now"), 10, 60, 1, 20)}
    </div>
    <div class="demo-math" id="bes-f"></div>
    <div id="bes-stats"></div>
    <div id="bes-chart"></div>
    <p class="demo-tip">${T("默认场景：财报前以 30% 的隐含波动率买入，21 天后财报出来，XYZ 涨到 103，隐含波动率回落到 20%。价格那根柱子是正的，时间和波动率那两根却把它吃掉了。把“现在的隐含波动率”拉回 30%，看看结果。", "Default story: bought before earnings at 30% implied vol; 21 days later earnings are out, XYZ is at 103 and implied vol has dropped back to 20%. The price bar is positive; the time and volatility bars eat it. Move “implied vol now” back to 30% and see what changes.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "bes-iv0": (x) => x + "%", "bes-ds": (x) => "$" + (+x).toFixed(1), "bes-dt": (x) => x + T(" 天", " days"), "bes-iv1": (x) => x + "%" }, (v) => {
    const s0 = v["bes-iv0"] / 100, s1 = v["bes-iv1"] / 100, S1 = v["bes-ds"], dt = v["bes-dt"];
    const V = (S, days, sig) => O.bsPrice({ S, K, T: days / 365, r, sigma: sig, type: "call" });
    const a = V(100, 30, s0), b = V(S1, 30, s0), c = V(S1, 30 - dt, s0), d = V(S1, 30 - dt, s1);
    const g = O.greeks({ S: 100, K, T: 30 / 365, r, sigma: s0, type: "call" });
    const dS = S1 - 100, dvol = (s1 - s0) * 100;
    const est = g.delta * dS + g.theta * dt + g.vega * dvol;
    const f2 = (x) => (x >= 0 ? "+" : "") + x.toFixed(2);
    $("#bes-f").innerHTML = tex(String.raw`\dd V \approx \underbrace{${g.delta.toFixed(3)} \times (${dS.toFixed(1)})}_{\Delta\,\dd S} + \underbrace{(${g.theta.toFixed(3)}) \times ${dt}}_{\Theta\,\dd t} + \underbrace{${g.vega.toFixed(3)} \times (${dvol.toFixed(0)})}_{\nu\,\dd\sigma} = ${f2(est)}`, true)
      + tex(String.raw`\text{${en ? "exact" : "精确重估"}}:\ ${d.toFixed(2)} - ${a.toFixed(2)} = ${f2(d - a)}`, true);
    const pct = ((d - a) / a) * 100;
    $("#bes-stats").innerHTML = stats([
      [T("买入价", "Paid"), "$" + a.toFixed(2) + T("（每张 ", " ($") + (a * 100).toFixed(0) + T(" 美元）", ")")],
      [T("现在的价值", "Worth now"), "$" + d.toFixed(2)],
      [T("盈亏/张", "P&L / contract"), (d - a >= 0 ? "+$" : "−$") + Math.abs((d - a) * 100).toFixed(0), d - a >= 0 ? "pos" : "neg"],
      [T("收益率", "Return"), (pct >= 0 ? "+" : "−") + Math.abs(pct).toFixed(0) + "%", pct >= 0 ? "pos" : "neg"],
      [T("股票涨跌", "Stock move"), (dS >= 0 ? "+" : "−") + Math.abs(dS).toFixed(1) + "%", "acc"],
    ]);
    $("#bes-chart").innerHTML = barChart({
      bars: [
        { label: T("价格", "Price"), value: b - a, cls: b - a >= 0 ? 3 : 2 },
        { label: T("时间", "Time"), value: c - b, cls: c - b >= 0 ? 3 : 2 },
        { label: T("波动率", "Volatility"), value: d - c, cls: d - c >= 0 ? 3 : 2 },
        { label: T("合计", "Total"), value: d - a, cls: 0 },
      ],
      yfmt: (x) => (x >= 0 ? "+" : "") + x.toFixed(2), H: 220, xlabel: T("按顺序逐项重估（价格 → 时间 → 波动率），每股美元", "Step-by-step repricing (price → time → volatility), $ per share"),
    });
  });
}
