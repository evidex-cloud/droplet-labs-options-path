// Main demo for lesson earnings-events: price four structures the night before an announcement
// (weekly and 30-day options carry the event variance), then revalue them the morning after for the actual move.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("财报之夜：隐含对实际，四种结构的第二天早上", "Earnings night: implied vs actual — four structures the morning after")}</div>
    <div class="demo-grid">
      ${slider("ee-ev", T("事件标准差（市场定价）", "Event std. dev. (priced by the market)"), 2, 15, 0.0005, 6.7235)}
      ${slider("ee-b", T("基础波动率", "Base vol"), 10, 40, 0.01, 18.71)}
      ${slider("ee-d", T("周期权剩余天数（含公告）", "Weekly days left (incl. the event)"), 2, 14, 1, 7)}
      ${slider("ee-m", T("实际涨跌", "Actual move"), -15, 15, 0.5, 5)}
      ${slider("ee-post", T("公告后的隐含波动率", "Implied vol after the event"), 10, 40, 0.01, 18.71)}
    </div>
    <div class="demo-math" id="ee-f"></div>
    <div id="ee-stats"></div>
    <div id="ee-bars"></div>
    <div id="ee-chart"></div>
    <p class="demo-tip">${T("试试：实际涨跌设为 0，只有跨式亏——这就是崩塌；把实际涨跌拉到隐含波动幅度附近，跨式才打平；再拉到 ±10%，卖方结构开始亏。把“公告后的隐含波动率”调高几点，看日历价差怎样受益。", "Try this: set the actual move to 0 and only the straddle loses — that is the crush; move it near the implied move and the straddle breaks even; push it to ±10% and the premium sellers lose. Raise the “implied vol after the event” a few points and watch the calendar benefit.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const r = 0.04, S0 = 100;
  const draw = (v) => {
    const E = (v["ee-ev"] / 100) ** 2, b = v["ee-b"] / 100, d = v["ee-d"], mv = v["ee-m"] / 100, post = v["ee-post"] / 100;
    const iv = (days) => Math.sqrt((b * b * days / 365 + E) / (days / 365));
    const sw = iv(d), s30 = iv(30);
    const px = (S, K, days, s, ty) => O.bsPrice({ S, K, T: days / 365, r, sigma: s, type: ty });
    const structs = [
      { name: T("买入跨式", "Long straddle"), cls: 0, legs: [["call", 100, 1, d], ["put", 100, 1, d]] },
      { name: T("卖出铁鹰", "Short iron condor"), cls: 3, legs: [["put", 90, 1, d], ["put", 95, -1, d], ["call", 105, -1, d], ["call", 110, 1, d]] },
      { name: T("日历（卖周、买 30 天）", "Calendar (sell weekly, buy 30-day)"), cls: 1, legs: [["call", 100, -1, d], ["call", 100, 1, 30]] },
      { name: T("买入蝶式", "Long butterfly"), cls: 4, legs: [["call", 95, 1, d], ["call", 100, -2, d], ["call", 105, 1, d]] },
    ];
    for (const s of structs) {
      s.cost = s.legs.reduce((a, [ty, K, q, dd]) => a + q * px(S0, K, dd, iv(dd), ty), 0);
      s.after = (m) => s.legs.reduce((a, [ty, K, q, dd]) => a + q * px(S0 * (1 + m), K, dd - 1, post, ty), 0) - s.cost;
      s.vega = s.legs.reduce((a, [ty, K, q, dd]) => a + q * O.greeks({ S: S0, K, T: dd / 365, r, sigma: iv(dd), type: ty }).vega, 0);
    }
    const straddle = structs[0].cost, implied = straddle / S0;
    $("#ee-f").innerHTML = tex(String.raw`\begin{gathered}\text{${T("隐含波动幅度", "Implied move")}} \approx \frac{${straddle.toFixed(2)}}{100} = ${(implied * 100).toFixed(2)}\% \\ \sigma_{\text{${T("周", "weekly")}}} = \sqrt{\frac{${(b * b).toFixed(4)} \times ${d}/365 + ${E.toFixed(5)}}{${d}/365}} = ${(sw * 100).toFixed(1)}\% \\ \Delta V_{\text{crush}} \approx ${structs[0].vega.toFixed(3)} \times (${(post * 100).toFixed(1)} - ${(sw * 100).toFixed(1)}) = ${(structs[0].vega * (post - sw) * 100).toFixed(2)}\end{gathered}`, true);
    $("#ee-stats").innerHTML = stats([
      [T("周期权 IV（公告前）", "Weekly IV (before)"), (sw * 100).toFixed(1) + "%"],
      [T("30 天期 IV（公告前）", "30-day IV (before)"), (s30 * 100).toFixed(1) + "%"],
      [T("隐含波动幅度", "Implied move"), "±" + (implied * 100).toFixed(2) + "%", "acc"],
      [T("实际 ÷ 隐含", "Actual ÷ implied"), (Math.abs(mv) / implied).toFixed(2) + "×"],
    ]);
    const cash = (c) => (c > 0 ? T("付 ", "pay ") : T("收 ", "receive ")) + Math.abs(c).toFixed(2);
    $("#ee-bars").innerHTML = `<table><thead><tr><th>${T("结构", "Structure")}</th><th>${T("前一晚", "Night before")}</th><th>${T("第二天早上损益（每组）", "Morning-after P&L (per set)")}</th></tr></thead><tbody>${structs.map((s) => { const p = s.after(mv) * 100; return `<tr><td>${s.name}</td><td>${cash(s.cost)}</td><td style="color:var(${p >= 0 ? "--green" : "--red"})">${p >= 0 ? "+$" : "−$"}${Math.abs(p).toFixed(0)}</td></tr>`; }).join("")}</tbody></table>`;
    $("#ee-chart").innerHTML = lineChart({
      series: structs.map((s) => ({ f: (x) => s.after(x / 100) * 100, cls: s.cls, label: s.name })),
      xmin: -15, xmax: 15, xlabel: T("财报后的实际涨跌（%）", "Actual move after the announcement (%)"), ylabel: T("每组损益（美元）", "P&L per set ($)"),
      hlines: [{ y: 0 }], markers: [{ x: mv * 100, label: T("实际", "actual") }], bands: [{ x0: -implied * 100, x1: implied * 100, cls: 0, label: T("隐含 ±", "implied ±") }], H: 280,
    });
  };
  bindSliders(root, { "ee-ev": (x) => (+x).toFixed(1) + "%", "ee-b": (x) => (+x).toFixed(1) + "%", "ee-d": (x) => x + T(" 天", " days"), "ee-m": (x) => (x > 0 ? "+" : x < 0 ? "−" : "") + Math.abs(x) + "%", "ee-post": (x) => (+x).toFixed(1) + "%" }, draw);
}
