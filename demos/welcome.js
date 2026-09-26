// Main demo for lesson welcome: what each of Kai's choices does at expiry (30-day XYZ options, standard premiums).
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  // Standard course numbers (XYZ S = 100, σ = 20%, r = 4%, 30 days), rounded to cents as in the lessons.
  const stock = { type: "stock", side: "long", entry: 100 };
  const CH = {
    shares: { cls: 5, name: T("只持有 100 股", "Shares only"), legs: [stock],
      f: (s) => String.raw`\Pi = 100 \times (S_T - 100) = 100 \times (${s} - 100)` },
    put: { cls: 0, name: T("股票 + 买 95 看跌（保护）", "Shares + buy the 95 put (protect)"), legs: [stock, { type: "put", side: "long", K: 95, premium: 0.51 }],
      f: (s) => String.raw`\Pi = 100 \times \big[(${s} - 100) + \max(95 - ${s},\,0) - 0.51\big]` },
    cc: { cls: 1, name: T("股票 + 卖 105 看涨（收入）", "Shares + sell the 105 call (income)"), legs: [stock, { type: "call", side: "short", K: 105, premium: 0.71 }],
      f: (s) => String.raw`\Pi = 100 \times \big[(${s} - 100) - \max(${s} - 105,\,0) + 0.71\big]` },
    call: { cls: 3, name: T("不买股票，只买 100 看涨", "No shares, just the 100 call"), legs: [{ type: "call", side: "long", K: 100, premium: 2.45 }],
      f: (s) => String.raw`\Pi = 100 \times \big[\max(${s} - 100,\,0) - 2.45\big]` },
  };
  let pick = "put";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("小凯的四种选择：到期时各得多少？", "Kai's four choices: what does each one make at expiry?")}</div>
    <div class="demo-row">${seg("wel-pick", Object.entries(CH).map(([k, c]) => [k, c.name]), pick)}</div>
    ${slider("wel-s", T("到期时（30 天后）XYZ 的价格", "XYZ's price at expiry (in 30 days)"), 70, 130, 1, 88)}
    <div class="demo-math" id="wel-f"></div>
    <div id="wel-stats"></div>
    <div id="wel-chart"></div>
    <div id="wel-table"></div>
    <p class="demo-tip">${T("试试：把价格拉到 80，再拉到 120。看跌期权让最坏结果停在 −551 美元；卖出看涨让最好结果停在 +571 美元；只买看涨最多亏 245 美元，但股价要超过 102.45 才开始赚钱。", "Try this: drag the price to 80, then to 120. The put stops the worst case at −$551; selling the call stops the best case at +$571; the call alone can lose at most $245 but only makes money above $102.45.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const usd = (x) => (x < 0 ? "−$" : x > 0 ? "+$" : "$") + Math.abs(Math.round(x)).toLocaleString("en-US");
  const story = (k, S) => {
    if (k === "shares") return S >= 100 ? T("股票赚了，全部归小凯。", "The shares gained, all of it Kai's.") : T("股票亏了，全部由小凯承担。", "The shares lost, all of it Kai's to bear.");
    if (k === "put") return S < 95 ? T(`行使看跌期权：以 95 卖出，而不是 ${S}。`, `Exercise the put: sell at $95 instead of $${S}.`) : T("看跌期权作废（保险没用上），只损失 51 美元保费。", "The put expires unused; the $51 premium was the cost of cover.");
    if (k === "cc") return S > 105 ? T(`看涨被行权：股票按 105 卖出，${S} 以上的涨幅归买方。`, `The call is exercised: shares go at $105; the rise above that goes to the buyer.`) : T("看涨作废，小凯留下股票和 71 美元。", "The call expires; Kai keeps the shares and the $71.");
    return S > 100 ? T(`行权：以 100 买入价值 ${S} 的股票。`, `Exercise: buy at $100 a share worth $${S}.`) : T("不行权：期权作废，损失就是 245 美元权利金。", "Don't exercise: the call expires; the loss is the $245 premium.");
  };
  const draw = (v) => {
    const S = v["wel-s"], c = CH[pick];
    const pl = O.netPL(c.legs, S) * 100;
    $("#wel-f").innerHTML = tex(c.f(S) + String.raw` = ${pl < 0 ? "-" : ""}\$${Math.abs(Math.round(pl)).toLocaleString("en-US").replace(/,/g, "{,}")}`, true);
    const st = O.payoffStats(c.legs, 0.01, 400);
    const worst = st.maxLoss * 100, best = st.maxProfit * 100;
    $("#wel-stats").innerHTML = stats([
      [T("这个价位的损益", "P&L at this price"), usd(pl), pl >= 0 ? "pos" : "neg"],
      [T("最坏情况", "Worst case"), usd(worst), "neg"],
      [T("最好情况", "Best case"), isFinite(best) ? usd(best) : T("不封顶", "Unlimited"), "pos"],
      [T("盈亏平衡价", "Breakeven price"), st.breakevens.length ? "$" + st.breakevens[0].toFixed(2) : "–"],
    ]);
    $("#wel-chart").innerHTML = lineChart({
      xmin: 70, xmax: 130, ymin: -3000, ymax: 3000, xlabel: T("到期时 XYZ 的价格", "XYZ price at expiry"), ylabel: T("损益（美元，一手）", "P&L ($, 100 shares / 1 contract)"),
      series: Object.entries(CH).map(([k, ch]) => ({ f: (x) => O.netPL(ch.legs, x) * 100, cls: ch.cls, label: ch.name, dashed: k !== pick })),
      markers: [{ x: S, label: "$" + S }], points: [{ x: S, y: pl, cls: c.cls, label: usd(pl) }],
    });
    $("#wel-table").innerHTML = `<table><thead><tr><th>${T("选择", "Choice")}</th><th>${T("XYZ 收在 ", "If XYZ ends at $")}${S}${T(" 美元时", "")}</th><th>${T("发生了什么", "What happened")}</th></tr></thead><tbody>${Object.entries(CH).map(([k, ch]) => {
      const p = O.netPL(ch.legs, S) * 100;
      return `<tr class="${k === pick ? "hl" : ""}"><td>${ch.name}</td><td>${usd(p)}</td><td>${story(k, S)}</td></tr>`;
    }).join("")}</tbody></table>`;
  };
  const run = bindSliders(root, { "wel-s": (x) => "$" + x }, draw);
  onSeg(root, "wel-pick", (k) => { pick = k; run(); });
}
