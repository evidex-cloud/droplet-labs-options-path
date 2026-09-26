// Main demo for lesson zero-dte: an XYZ option that expires at today's close. Move the clock, the strike and the
// time convention, and watch premium, delta, gamma and theta per hour change. Black-Scholes from the shared engine.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex, texNum } from "./_viz.js";

const r = 0.04;
// session clock: the whole day's variance lives in the 6.5-hour session; calendar clock: 24 hours a day
const years = (h, clock) => (clock === "session" ? h / 6.5 / 365 : h / (365 * 24));
const clockLabel = (h) => { const m = Math.round((16 - h) * 60); return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`; };

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let type = "call", clock = "session";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("0DTE 时钟：只剩几个小时的期权", "The 0DTE clock: an option with hours to live")}</div>
    <div class="demo-row">${seg("z-type", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")]], type)}
      ${seg("z-clock", [["session", T("交易时段时钟", "Session clock")], ["calendar", T("日历小时时钟", "Calendar-hour clock")]], clock)}</div>
    <div class="demo-grid">
      ${slider("z-h", T("离收盘还有（小时）", "Hours to the close"), 0.1, 6.5, 0.1, 2)}
      ${slider("z-k", T("行权价 K", "Strike K"), 97, 103, 0.5, 100)}
      ${slider("z-v", T("隐含波动率 σ", "Implied volatility σ"), 10, 40, 1, 20)}
    </div>
    <div class="demo-math" id="z-f"></div>
    <div id="z-stats"></div>
    <div id="z-chart"></div>
    <div id="z-decay"></div>
    <p class="demo-tip">${T("试试：把小时数从 6.5 拖到 0.5，平值期权的价格只剩约四分之一，Gamma 却变成三倍多。切换到“日历小时时钟”，同一时刻的价格几乎减半——0DTE 的“隐含波动率”先取决于你用哪只钟。", "Try this: drag the hours from 6.5 to 0.5 — the at-the-money price falls to about a quarter while gamma more than triples. Switch to the calendar-hour clock and the same moment's price nearly halves: a 0DTE's “implied volatility” depends first on which clock you use.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const h = v["z-h"], K = v["z-k"], sigma = v["z-v"] / 100, S = 100;
    const Tm = years(h, clock), o = { S, K, T: Tm, r, sigma, type };
    const g = O.greeks(o);
    const nextHour = O.bsPrice({ ...o, T: years(Math.max(0, h - 1), clock) });
    const approx = 0.4 * S * sigma * Math.sqrt(Tm);
    const Tfrac = clock === "session" ? String.raw`\dfrac{${h.toFixed(1)}}{6.5} \times \dfrac{1}{365}` : String.raw`\dfrac{${h.toFixed(1)}}{365 \times 24}`;
    $("#z-f").innerHTML = tex(String.raw`T = ${Tfrac} = ${texNum(Tm, 3)}\ \text{${T("年", "years")}}`, true)
      + tex(String.raw`\begin{aligned} ${type === "call" ? "C" : "P"}_{\text{BS}} &= ${g.price.toFixed(3)} \\ 0.4\,S\sigma\sqrt{T} &= 0.4 \times 100 \times ${sigma.toFixed(2)} \times ${Math.sqrt(Tm).toFixed(4)} = ${approx.toFixed(3)} \end{aligned}`, true);
    $("#z-stats").innerHTML = stats([
      [T("时刻（美东）", "Clock (ET)"), clockLabel(h)],
      [T("价格（每张）", "Price (per contract)"), "$" + (g.price * 100).toFixed(0), "acc"],
      ["Δ", g.delta.toFixed(3)],
      ["Γ", g.gamma.toFixed(3)],
      [T("下一小时的损耗（S 不变）", "Decay over the next hour (S unchanged)"), "−$" + ((g.price - nextHour) * 100).toFixed(1), "neg"],
      [T("剩余 1σ 波动", "Remaining 1σ move"), "±$" + O.expectedMove(S, sigma, Tm).toFixed(2)],
    ]);
    const tOpen = years(6.5, clock);
    $("#z-chart").innerHTML = lineChart({
      xmin: Math.min(97.5, K - 1), xmax: Math.max(102.5, K + 1), xlabel: T("XYZ 价格", "XYZ price"), ylabel: T("期权价格", "Option price"),
      series: [
        { f: (x) => O.bsPrice({ ...o, S: x, T: tOpen }), cls: 1, dashed: true, label: T("开盘 9:30", "At the 9:30 open") },
        { f: (x) => O.bsPrice({ ...o, S: x }), cls: 0, label: T("现在 ", "Now ") + clockLabel(h) },
        { f: (x) => O.intrinsic(type, x, K), cls: 5, label: T("16:00 收盘结算", "16:00 settlement") },
      ],
      markers: [{ x: K, label: "K" }], points: [{ x: S, y: g.price, cls: 0, label: "$" + g.price.toFixed(2) }],
    });
    // ATM time value through the session for this clock
    const pts = [];
    for (let i = 0; i <= 80; i++) { const hh = 6.5 * (1 - i / 80) ** 2; pts.push([6.5 - hh, O.bsPrice({ S, K: 100, T: years(Math.max(hh, 0), clock), r, sigma, type })]); }
    $("#z-decay").innerHTML = lineChart({
      xmin: 0, xmax: 6.5, xlabel: T("开盘后的小时数（0 = 9:30，6.5 = 16:00）", "Hours since the open (0 = 9:30, 6.5 = 16:00)"), ylabel: T("平值价格", "ATM price"),
      series: [{ points: pts, cls: 0, area: true, label: T("行权价 100 的平值期权（S 不变）", "The 100-strike option if S stays at 100") }],
      markers: [{ x: 6.5 - h, label: clockLabel(h) }], ymin: 0,
    });
  };
  const spec = { "z-h": (x) => (+x).toFixed(1) + " h", "z-k": (x) => "$" + x, "z-v": (x) => x + "%" };
  const rerun = bindSliders(root, spec, draw);
  onSeg(root, "z-type", (x) => { type = x; rerun(); });
  onSeg(root, "z-clock", (x) => { clock = x; rerun(); });
}
