// Inline demo for lesson python-backtest: step through the backtest loop one day at a time on a tiny
// hand-made price path (the lesson's golden test), watching cash, the put's mark, equity and delta.
import { runPutWrite } from "./python-backtest.js";
import { seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const PATHS = {
  golden: () => [...Array(30).fill(100), ...Array(31).fill(85)],
  flat: () => Array(61).fill(100),
  dip: () => Array.from({ length: 61 }, (_, i) => (i < 12 ? 100 : i < 22 ? 100 - (i - 11) * 1.2 : 88 + (i - 21) * 0.4)),
};

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let path = "golden";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("逐日走一遍回测循环", "Walk the backtest loop one day at a time")}</div>
    <div class="demo-row">${seg("pbl-path", [["golden", T("黄金测试：第 30 天跌到 85", "Golden test: 85 from day 30")], ["flat", T("一直是 100", "Flat at 100")], ["dip", T("先跌后回", "Dip and partial recovery")]], "golden")}</div>
    ${slider("pbl-day", T("第几天", "Day"), 0, 60, 1, 0)}
    <div id="pbl-event"></div>
    <div id="pbl-stats"></div>
    <div class="demo-math" id="pbl-f"></div>
    <pre class="demo-out" id="pbl-out" style="white-space:pre-wrap;overflow-wrap:anywhere"></pre>
    <p class="demo-tip">${T("看什么：第 0 天刚卖出，权益就从 100,000 掉到 99,942.61——卖在买价、按中间价估值，价差成本当场入账。黄金测试里第 30 天一次付出 10,000 美元，然后在 85 附近按 81 的行权价重新卖出。", "What to notice: on day 0, right after the sale, equity drops from 100,000 to 99,942.61 — sold at the bid, marked at the mid, so the spread cost is booked at once. In the golden test, day 30 pays out $10,000 in one go and then sells a new 81 put near 85.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const run = bindSliders(root, { "pbl-day": (x) => String(x) }, (v) => {
    const close = PATHS[path](), day = v["pbl-day"];
    const { rows, cycles } = runPutWrite(close);
    const row = rows[day], prev = day > 0 ? rows[day - 1] : null;
    const settled = cycles.find((c) => c.i === day);
    const usd = (x) => "$" + x.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    let ev = `<div class="demo-log">${T(`第 ${day} 天 · XYZ 收盘 ${row.S.toFixed(2)}`, `Day ${day} · XYZ closes at ${row.S.toFixed(2)}`)}</div>`;
    if (day > 0) { const intr = (row.cash - (settled ? -settled.payout : 0) - (row.opened ? row.opened.prem : 0) - prev.cash).toFixed(2);
      ev += `<div class="demo-log">${T("① 利息：", "① Interest: ")}${tex(String.raw`\text{cash} \times e^{0.04/365}`)}${T(`，+$${intr}`, `, +$${intr}`)}</div>`; }
    if (settled) ev += `<div class="demo-log ${settled.payout > 0 ? "bad" : "ok"}">${T(`② 到期结算：K = ${settled.K}，S_T = ${settled.ST.toFixed(2)}，付出 $${settled.payout.toFixed(2)}`, `② Expiry: K = ${settled.K}, S_T = ${settled.ST.toFixed(2)}, pay $${settled.payout.toFixed(2)}`)}</div>`;
    if (row.opened) { const o = row.opened; ev += `<div class="demo-log ok">${T(`③ 开新仓：卖 ${o.n} 张 ${o.K} 看跌，中间价 ${o.mid.toFixed(4)}，按买价 ${o.px.toFixed(4)} 成交，净收 $${o.prem.toFixed(2)}`, `③ Open: sell ${o.n} × ${o.K} put, mid ${o.mid.toFixed(4)}, filled at the bid ${o.px.toFixed(4)}, net $${o.prem.toFixed(2)}`)}</div>`; }
    ev += `<div class="demo-log">${T("④ 估值：用剩余天数给看跌按中间价定价，记录 Delta 与 Vega", "④ Mark: price the put at the mid for the days left; record delta and vega")}</div>`;
    $("#pbl-event").innerHTML = ev;
    $("#pbl-stats").innerHTML = stats([
      [T("现金", "Cash"), usd(row.cash)],
      [T("看跌估值（每股）", "Put mark (per share)"), row.K !== null ? row.put.toFixed(4) : "—"],
      [T("权益", "Equity"), usd(row.equity), row.equity >= 100000 ? "pos" : "neg"],
      [T("持仓 Delta（股）", "Delta (shares)"), row.delta.toFixed(1), "acc"],
    ]);
    $("#pbl-f").innerHTML = row.K !== null
      ? tex(String.raw`\text{equity} = \text{cash} - n \times 100 \times \text{put} = ${row.cash.toFixed(2)} - ${row.n} \times 100 \times ${row.put.toFixed(4)} = ${row.equity.toFixed(2)}`, true)
      : tex(String.raw`\text{equity} = \text{cash} = ${row.cash.toFixed(2)} \quad (\text{no open put})`, true);
    const lines = [">>> print(cycles[[\"K\", \"S_T\", \"premium\", \"payout\"]].round(2).to_string(index=False))"];
    const done = cycles.filter((c) => c.i <= day);
    if (done.length) {
      const cols = [["K", done.map((c) => String(c.K))], ["S_T", done.map((c) => c.ST.toFixed(1))], ["premium", done.map((c) => c.premium.toFixed(2))], ["payout", done.map((c) => c.payout.toFixed(1))]];
      const w = cols.map(([h, vs]) => Math.max(h.length, ...vs.map((x) => x.length)));
      lines.push(cols.map(([h], k) => h.padStart(w[k])).join(" "));
      done.forEach((_, j) => lines.push(cols.map(([, vs], k) => vs[j].padStart(w[k])).join(" ")));
    } else lines.push(T("（还没有到期的合约）", "(no expired contracts yet)"));
    lines.push(`>>> round(daily["equity"].iloc[${day}], 2)`, String(Number(row.equity.toFixed(2))));
    $("#pbl-out").textContent = lines.join("\n");
  });
  onSeg(root, "pbl-path", (k) => { path = k; run(); });
}
