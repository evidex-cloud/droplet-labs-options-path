// Main demo for lesson price-drivers: six sliders → Black-Scholes price, the sign of every sensitivity at the
// current point (finite differences), and the price as a function of whichever input you pick.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let type = "call", axis = "S";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("六个旋钮：一次只动一个", "Six dials: move one at a time")}</div>
    <div class="demo-row">${seg("pd-type", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")]], type)}
      <div class="demo-btns" style="margin:0"><button class="demo-btn" data-pd="base">${T("小凯的标准期权", "Kai's standard option")}</button><button class="demo-btn" data-pd="deep">${T("深度实值欧式看跌 K=150", "Deep ITM European put, K = 150")}</button></div></div>
    <div class="demo-grid">
      ${slider("pd-s", T("现价 S", "Spot S"), 60, 160, 0.5, 100)}
      ${slider("pd-k", T("行权价 K", "Strike K"), 60, 160, 1, 100)}
      ${slider("pd-t", T("到期天数", "Days to expiry"), 1, 730, 1, 30)}
      ${slider("pd-v", T("波动率 σ", "Volatility σ"), 5, 80, 1, 20)}
      ${slider("pd-r", T("利率 r", "Rate r"), 0, 10, 0.25, 4)}
      ${slider("pd-q", T("股息率 q", "Dividend yield q"), 0, 8, 0.25, 0)}
    </div>
    <div class="demo-math" id="pd-f"></div>
    <div id="pd-stats"></div>
    <div id="pd-signs"></div>
    <div class="demo-label" style="margin-top:.6rem">${T("横轴换成哪个输入？（其余五个固定在当前值）", "Plot the price against which input? (the other five stay where they are)")}</div>
    ${seg("pd-axis", [["S", "S"], ["K", "K"], ["T", T("天数", "days")], ["v", "σ"], ["r", "r"], ["q", "q"]], axis)}
    <div id="pd-chart"></div>
    <p class="demo-tip">${T("试试：点“深度实值欧式看跌”，再把横轴换成“天数”——曲线向下走：到期越远越便宜。再把 σ 往上拉，看跌和看涨一起变贵。", "Try this: press “Deep ITM European put”, then plot against days — the curve slopes down: the longer put is cheaper. Then raise σ and watch calls and puts get dearer together.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const pct = (x) => x + "%";
  let cur = null;
  const price = (o) => O.bsPrice({ ...o, type });
  const draw = (v) => {
    const o = { S: v["pd-s"], K: v["pd-k"], T: v["pd-t"] / 365, sigma: v["pd-v"] / 100, r: v["pd-r"] / 100, q: v["pd-q"] / 100 };
    cur = o;
    const p = price(o), base = O.bsPrice({ S: 100, K: 100, T: 30 / 365, sigma: 0.2, r: 0.04, q: 0, type });
    const sym = type === "call" ? "C" : "P";
    $("#pd-f").innerHTML = tex(String.raw`${sym}\big(S{=}${o.S},\ K{=}${o.K},\ T{=}\tfrac{${v["pd-t"]}}{365},\ \sigma{=}${v["pd-v"]}\%,\ r{=}${v["pd-r"]}\%,\ q{=}${v["pd-q"]}\%\big) = ${p.toFixed(2)}`, true);
    const intr = O.intrinsic(type, o.S, o.K);
    $("#pd-stats").innerHTML = stats([
      [T("每股价格", "Price per share"), "$" + p.toFixed(2), "acc"],
      [T("一张合约", "Per contract"), "$" + (p * 100).toFixed(0)],
      [T("相对标准期权", "vs standard option"), (p - base >= 0 ? "+" : "−") + "$" + Math.abs(p - base).toFixed(2), p >= base ? "pos" : "neg"],
      [T("内在价值", "Intrinsic value"), "$" + intr.toFixed(2)],
      [T("时间价值", "Time value"), (p - intr >= 0 ? "" : "−") + "$" + Math.abs(p - intr).toFixed(2), p - intr < 0 ? "neg" : ""],
    ]);
    // finite-difference sensitivities at the current point
    const bump = [
      ["S", T("现价 +$1", "spot +$1"), (x) => ({ ...x, S: x.S + 1 })],
      ["K", T("行权价 +$1", "strike +$1"), (x) => ({ ...x, K: x.K + 1 })],
      ["T", T("多 1 天", "one more day"), (x) => ({ ...x, T: x.T + 1 / 365 })],
      ["σ", T("σ +1 个点", "σ +1 point"), (x) => ({ ...x, sigma: x.sigma + 0.01 })],
      ["r", T("r +1%", "r +1%"), (x) => ({ ...x, r: x.r + 0.01 })],
      ["q", T("q +1%", "q +1%"), (x) => ({ ...x, q: x.q + 0.01 })],
    ];
    const rows = bump.map(([k, lab, f]) => {
      const d = price(f(o)) - p;
      const arrow = Math.abs(d) < 5e-5 ? "→" : d > 0 ? "↑" : "↓";
      const cls = Math.abs(d) < 5e-5 ? "" : d > 0 ? "ok" : "bad";
      return `<tr><td>${k}</td><td>${lab}</td><td><span class="tag ${cls}">${arrow}</span></td><td>${d >= 0 ? "+" : "−"}$${Math.abs(d).toFixed(3)}</td></tr>`;
    }).join("");
    $("#pd-signs").innerHTML = `<table><thead><tr><th>${T("输入", "Input")}</th><th>${T("往上调", "Bump")}</th><th>${T("方向", "Direction")}</th><th>${T("价格变化", "Price change")}</th></tr></thead><tbody>${rows}</tbody></table>`;
    plot();
  };
  const plot = () => {
    if (!cur) return;
    const o = cur;
    const spec = {
      S: { lo: 50, hi: 170, f: (x) => ({ ...o, S: x }), x: o.S, lab: T("现价 S", "Spot S") },
      K: { lo: 50, hi: 170, f: (x) => ({ ...o, K: x }), x: o.K, lab: T("行权价 K", "Strike K") },
      T: { lo: 1, hi: 730, f: (x) => ({ ...o, T: x / 365 }), x: o.T * 365, lab: T("到期天数", "Days to expiry") },
      v: { lo: 5, hi: 80, f: (x) => ({ ...o, sigma: x / 100 }), x: o.sigma * 100, lab: T("波动率 σ（%）", "Volatility σ (%)") },
      r: { lo: 0, hi: 10, f: (x) => ({ ...o, r: x / 100 }), x: o.r * 100, lab: T("利率 r（%）", "Rate r (%)") },
      q: { lo: 0, hi: 8, f: (x) => ({ ...o, q: x / 100 }), x: o.q * 100, lab: T("股息率 q（%）", "Dividend yield q (%)") },
    }[axis];
    const y = price(spec.f(spec.x));
    $("#pd-chart").innerHTML = lineChart({
      xmin: spec.lo, xmax: spec.hi, xlabel: spec.lab, ylabel: T("期权价格", "Option price"), ymin: 0,
      series: [{ f: (x) => price(spec.f(x)), cls: type === "call" ? 0 : 1, label: type === "call" ? T("看涨价", "Call price") : T("看跌价", "Put price") }],
      points: [{ x: spec.x, y, cls: type === "call" ? 0 : 1, label: "$" + y.toFixed(2) }],
    });
  };
  const run = bindSliders(root, { "pd-s": (x) => "$" + x, "pd-k": (x) => "$" + x, "pd-t": (x) => x + T(" 天", " days"), "pd-v": pct, "pd-r": pct, "pd-q": pct }, draw);
  onSeg(root, "pd-type", (v) => { type = v; run(); });
  onSeg(root, "pd-axis", (v) => { axis = v; plot(); });
  const set = (vals) => { for (const [id, x] of Object.entries(vals)) $("#" + id).value = x; run(); };
  root.querySelectorAll("[data-pd]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.pd === "deep") {
      type = "put";
      root.querySelectorAll('[data-seg="pd-type"] button').forEach((x) => x.classList.toggle("on", x.dataset.v === "put"));
      set({ "pd-s": 100, "pd-k": 150, "pd-t": 365, "pd-v": 20, "pd-r": 4, "pd-q": 0 });
    } else set({ "pd-s": 100, "pd-k": 100, "pd-t": 30, "pd-v": 20, "pd-r": 4, "pd-q": 0 });
  }));
}
