// Main demo for lesson term-structure: forward-vol calculator + event-vol extractor on one pair of expiries.
// Total implied variance w = σ²T adds up over time; forward variance is the slope between two expiries;
// an event between them (or before both) shows up as a step m² in w.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("期限结构实验室：远期波动率与财报波动率提取", "Term-structure lab: forward vol and the earnings-move extractor")}</div>
    <div class="demo-btns">
      <button class="demo-btn" data-preset="kai">${T("小凯的 XYZ：14 天 18% / 30 天 20%", "Kai's XYZ: 14d 18% / 30d 20%")}</button>
      <button class="demo-btn" data-preset="two">${T("两个都在财报之后", "Both after earnings")}</button>
      <button class="demo-btn" data-preset="arb">${T("日历套利", "Calendar arbitrage")}</button>
    </div>
    <div class="demo-grid">
      ${slider("ts-t1", T("近月到期天数 T₁", "Near expiry T₁ (days)"), 2, 180, 1, 14)}
      ${slider("ts-s1", T("近月隐含波动率 σ₁", "Near implied vol σ₁"), 5, 80, 0.1, 18)}
      ${slider("ts-t2", T("远月到期天数 T₂", "Far expiry T₂ (days)"), 3, 365, 1, 30)}
      ${slider("ts-s2", T("远月隐含波动率 σ₂", "Far implied vol σ₂"), 5, 80, 0.1, 20)}
      ${slider("ts-e", T("财报在第几天（0 = 没有事件）", "Earnings on day (0 = no event)"), 0, 120, 1, 21)}
    </div>
    <div class="demo-math" id="ts-f"></div>
    <div id="ts-stats"></div>
    <div id="ts-note"></div>
    <div class="demo-label">${T("总隐含方差 w = σ²T：从原点连到某点的斜率就是 σ²，两点之间的斜率就是远期方差", "Total implied variance w = σ²T: the slope from the origin to a point is σ², the slope between two points is the forward variance")}</div>
    <div id="ts-w"></div>
    <div class="demo-label">${T("由提取出的“平日波动率 + 事件”重建的整条期限结构", "The whole term structure rebuilt from the extracted base vol + event")}</div>
    <div id="ts-curve"></div>
    <p class="demo-tip">${T("试试：点“小凯的 XYZ”，再把 σ₂ 往上拉——财报那一天被定价得越大，事件后的 IV 崩塌越狠。点“日历套利”，看远期方差变成负数。", "Try this: press “Kai's XYZ”, then raise σ₂ — the bigger the priced earnings day, the harder the IV crush afterwards. Press “Calendar arbitrage” and watch the forward variance turn negative.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const pct = (x) => x.toFixed(1) + "%";
  const draw = (v) => {
    let d1 = v["ts-t1"], d2 = v["ts-t2"];
    const s1 = v["ts-s1"] / 100, s2 = v["ts-s2"] / 100, ev = v["ts-e"];
    let swapped = false;
    if (d2 <= d1) { d2 = d1 + 1; swapped = true; }
    const T1 = d1 / 365, T2 = d2 / 365;
    const w1 = s1 * s1 * T1, w2 = s2 * s2 * T2;
    const fv = (w2 - w1) / (T2 - T1);
    const fwdTxt = fv >= 0 ? (Math.sqrt(fv) * 100).toFixed(1) + String.raw`\%` : String.raw`\text{${T("负数", "negative")}}`;
    $("#ts-f").innerHTML = tex(String.raw`\sigma_{\text{fwd}}^2 = \frac{\sigma_2^2 T_2 - \sigma_1^2 T_1}{T_2 - T_1} = \frac{${(s2 * s2).toFixed(4)} \times ${d2} - ${(s1 * s1).toFixed(4)} \times ${d1}}{${d2} - ${d1}} = ${fv.toFixed(4)} \;\Rightarrow\; \sigma_{\text{fwd}} = ${fwdTxt}`, true);

    // event extraction
    let base = null, m = null, method = "";
    if (ev > 0 && ev <= d1 && fv > 0) { base = Math.sqrt(fv); const m2 = w1 - fv * T1; m = m2 > 0 ? Math.sqrt(m2) : 0; method = T("两个到期日都在事件之后：平日波动率 = 两者之间的远期波动率", "both expiries after the event: base vol = forward vol between them"); }
    else if (ev > d1 && ev <= d2) { base = s1; const m2 = (s2 * s2 - s1 * s1) * T2; m = m2 > 0 ? Math.sqrt(m2) : 0; method = T("一个在事件前、一个在事件后：平日波动率 = 近月波动率", "one expiry before, one after: base vol = the near expiry's vol"); }
    else if (ev === 0 || ev > d2) method = T("两个到期日之间和之前都没有事件：只算远期波动率", "no event before the far expiry: forward vol only");
    else method = T("远期方差为负，无法提取事件", "negative forward variance: no event can be extracted");

    const items = [
      [T("近月总方差 w₁", "Near total variance w₁"), w1.toFixed(5)],
      [T("远月总方差 w₂", "Far total variance w₂"), w2.toFixed(5)],
      [T("远期波动率", "Forward vol"), fv >= 0 ? pct(Math.sqrt(fv) * 100) : T("负（套利）", "negative (arbitrage)"), fv >= 0 ? "acc" : "neg"],
    ];
    if (m != null && base != null) {
      const lastDay = Math.max(1, d2 - ev + 1); // days left in the far expiry on the day before the event
      const ivBefore = Math.sqrt(base * base + (m * m) / (lastDay / 365));
      items.push([T("平日波动率（去掉事件）", "Base (ex-event) vol"), pct(base * 100)]);
      items.push([T("事件 1σ 波动 m", "Event 1σ move m"), "±" + (m * 100).toFixed(2) + "%", "acc"]);
      items.push([T("平均绝对波动 ≈ 0.8m（股价 100）", "Average |move| ≈ 0.8m (at $100)"), "$" + (Math.sqrt(2 / Math.PI) * m * 100).toFixed(2)]);
      if (ev <= d2) {
        items.push([T("远月 IV：事件前一天", "Far IV the day before"), pct(ivBefore * 100)]);
        items.push([T("远月 IV：事件之后", "Far IV after the event"), pct(base * 100), "neg"]);
      }
    }
    $("#ts-stats").innerHTML = stats(items);
    const warn = fv < 0 ? `<div class="demo-warn">${T("远月的总方差比近月还小：长期期权“装的不确定性”比它包含的短期期权还少——这是日历套利（卖近月、买远月可锁定非负收益，未计成本）。", "The far expiry carries less total variance than the near one inside it: a calendar arbitrage (sell the near, buy the far for a credit; before costs).")}</div>` : "";
    $("#ts-note").innerHTML = `<p class="demo-meta">${method}${swapped ? T("（T₂ 已自动设为 T₁ + 1）", " (T₂ was bumped to T₁ + 1)") : ""}</p>${warn}`;

    // chart 1: total variance
    const xmax = Math.max(d2 * 1.25, 30);
    const pts = [[0, 0], [d1, w1], [d2, w2]];
    const series = [
      { points: [[0, 0], [d1, w1]], cls: 3, label: T("斜率 = σ₁²", "slope = σ₁²") },
      { points: [[d1, w1], [d2, w2]], cls: fv >= 0 ? 0 : 2, label: T("斜率 = 远期方差", "slope = forward variance") },
      { points: [[0, 0], [d2, w2]], cls: 5, dashed: true, label: T("斜率 = σ₂²", "slope = σ₂²") },
    ];
    $("#ts-w").innerHTML = lineChart({
      series, xmin: 0, xmax, ymin: 0, H: 230, xlabel: T("到期天数", "days to expiry"), ylabel: "w",
      yfmt: (y) => y.toFixed(3), markers: ev > 0 && ev < xmax ? [{ x: ev, label: T("财报", "earnings") }] : [],
      points: pts.slice(1).map(([x, y], i) => ({ x, y, cls: i ? 0 : 3, label: ((i ? s2 : s1) * 100).toFixed(1) + "%" })),
    });

    // chart 2: implied term structure from (base, m, ev)
    if (m != null && base != null) {
      const f = (d) => Math.sqrt(base * base + (d >= ev ? (m * m) / (d / 365) : 0)) * 100;
      const hi = Math.max(120, d2 * 1.5);
      const curve = []; for (let d = 1; d <= hi; d += 1) curve.push([d, f(d)]);
      $("#ts-curve").innerHTML = lineChart({
        series: [{ points: curve, cls: 0, label: T("重建的 ATM 期限结构", "rebuilt ATM term structure") }, { points: [[1, base * 100], [hi, base * 100]], cls: 5, dashed: true, label: T("平日波动率", "base vol") }],
        xmin: 0, xmax: hi, ymin: Math.max(0, base * 100 - 5), ymax: Math.min(Math.max(...curve.map((p) => p[1])) + 3, base * 100 + 40), H: 220,
        xlabel: T("到期天数", "days to expiry"), ylabel: T("隐含波动率 %", "implied vol %"), yfmt: (y) => y.toFixed(0) + "%",
        markers: [{ x: ev, label: T("财报", "earnings") }],
        points: [{ x: d1, y: s1 * 100, cls: 3 }, { x: d2, y: s2 * 100, cls: 0 }],
      });
    } else {
      $("#ts-curve").innerHTML = `<p class="demo-meta">${T("没有可提取的事件：把“财报在第几天”放到 T₂ 之前试试。", "No event to extract: put the earnings day before T₂.")}</p>`;
    }
  };
  const spec = { "ts-t1": (x) => x + T(" 天", " d"), "ts-s1": (x) => (+x).toFixed(1) + "%", "ts-t2": (x) => x + T(" 天", " d"), "ts-s2": (x) => (+x).toFixed(1) + "%", "ts-e": (x) => (+x ? T("第 " + x + " 天", "day " + x) : T("无", "none")) };
  const run = bindSliders(root, spec, draw);
  const set = (vals) => { for (const [id, x] of Object.entries(vals)) $("#" + id).value = x; run(); };
  root.querySelectorAll("[data-preset]").forEach((b) => b.addEventListener("click", () => {
    const p = b.dataset.preset;
    if (p === "kai") set({ "ts-t1": 14, "ts-s1": 18, "ts-t2": 30, "ts-s2": 20, "ts-e": 21 });
    else if (p === "two") set({ "ts-t1": 30, "ts-s1": 20, "ts-t2": 60, "ts-s2": 19, "ts-e": 21 });
    else set({ "ts-t1": 30, "ts-s1": 30, "ts-t2": 60, "ts-s2": 20, "ts-e": 0 });
  }));
}
