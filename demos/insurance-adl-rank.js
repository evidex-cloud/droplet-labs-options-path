// Inline demo for lesson insurance-adl: where does your winning short sit in the ADL queue?
// Score = profit ratio × effective leverage (representative, Binance-style); five lights show your place.
import { slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const OTHERS = [["20× @ 100k", 100000, 20], ["10× @ 92k", 92000, 10], ["5× @ 95k", 95000, 5], ["2× @ 100k", 100000, 2]];
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("你在 ADL 队伍的第几位？（1 BTC 空单）", "Where are you in the ADL queue? (1 BTC short)")}</div>
    <div class="demo-grid-3">
      ${slider("iar-lev", T("你的杠杆", "Your leverage"), 1, 50, 1, 10)}
      ${slider("iar-entry", T("你的开空价", "Your short entry"), 86000, 110000, 500, 100000)}
      ${slider("iar-mark", T("当前标记价", "Current mark price"), 80000, 100000, 500, 88500)}
    </div>
    <div class="demo-math" id="iar-f"></div>
    <div id="iar-lights" style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:6px 0"></div>
    <div id="iar-table"></div>
    <p class="demo-tip">${T("试试：利润不变，只把杠杆从 10 拉到 30——你会一路排到队首；把杠杆降到 2，再大的利润也很难让你排进前两位。", "Try this: keep the profit, raise leverage from 10 to 30 and you climb to the front; drop to 2× and even a large profit rarely puts you in the top two.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const kf = (x) => Math.round(x).toLocaleString("en-US").replace(/,/g, "{,}");
  const usd = (x) => (x < 0 ? "−$" : "$") + Math.round(Math.abs(x)).toLocaleString("en-US");
  const score = (entry, lev, mark) => {
    const M = entry / lev, u = entry - mark, eq = M + u;
    if (eq <= 0.005 * mark) return { M, u, eq, ratio: u / M, eff: Infinity, s: -Infinity, dead: true };
    const ratio = u / M, eff = mark / eq;
    return { M, u, eq, ratio, eff, s: ratio >= 0 ? ratio * eff : ratio / eff, dead: false };
  };
  bindSliders(root, { "iar-lev": (x) => x + "×", "iar-entry": (x) => usd(x), "iar-mark": (x) => usd(x) }, (v) => {
    const lev = v["iar-lev"], entry = v["iar-entry"], mark = v["iar-mark"];
    const me = score(entry, lev, mark);
    const rows = [{ name: T("你", "You"), you: true, ...me }, ...OTHERS.map(([name, e, l]) => ({ name, ...score(e, l, mark) }))].sort((a, b) => b.s - a.s);
    const rank = rows.findIndex((r) => r.you);
    if (me.dead) {
      $("#iar-f").innerHTML = `<p class="demo-warn">${T("你的空单已经触到强平线——你不在赢家队列里，而是被强平的那一方。", "Your short has hit its liquidation line — you are not in the winners' queue, you are the one being liquidated.")}</p>`;
    } else {
      $("#iar-f").innerHTML = tex(String.raw`\text{${T("分数", "score")}} = \frac{${kf(me.u)}}{${kf(me.M)}} \times \frac{${kf(mark)}}{${kf(me.eq)}} = ${me.ratio.toFixed(2)} \times ${me.eff.toFixed(2)} = ${me.s.toFixed(2)}`, true);
    }
    const lit = me.dead || me.u <= 0 ? 0 : 5 - rank;
    $("#iar-lights").innerHTML = `<span class="demo-label">${T("ADL 指示灯", "ADL indicator")}</span><span style="font-size:1.4em;letter-spacing:3px">` + Array.from({ length: 5 }, (_, i) => `<span style="color:${i < lit ? "var(--red)" : "var(--line)"}">●</span>`).join("") + `</span>` +
      `<span class="demo-meta">${me.u > 0 && !me.dead ? T(`排第 ${rank + 1} / 5`, `rank ${rank + 1} of 5`) : T("亏损中：不会被 ADL", "losing: not an ADL target")}</span>`;
    $("#iar-table").innerHTML = `<table><thead><tr><th>#</th><th>${T("空单", "Short")}</th><th>${T("浮盈", "uPnL")}</th><th>${T("收益率", "Profit ratio")}</th><th>${T("有效杠杆", "Eff. lev.")}</th><th>${T("分数", "Score")}</th></tr></thead><tbody>${rows.map((r, i) => `<tr${r.you ? ' class="hl"' : ""}><td>${i + 1}</td><td>${r.name}</td><td>${usd(r.u)}</td><td>${r.ratio.toFixed(2)}</td><td>${isFinite(r.eff) ? r.eff.toFixed(2) + "×" : "–"}</td><td>${isFinite(r.s) ? r.s.toFixed(2) : T("已强平", "liquidated")}</td></tr>`).join("")}</tbody></table>`;
  });
}
